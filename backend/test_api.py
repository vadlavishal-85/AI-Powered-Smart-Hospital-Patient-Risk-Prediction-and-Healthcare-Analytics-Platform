import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.model_service import ModelService
from backend.app.class_mapping import DISEASE_METADATA, get_disease_info

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as test_client:
        yield test_client

VALID_PATIENT_PAYLOAD = {
    "HbA1c_level": 7.2,
    "bmi": 29.5,
    "glucose": 155.0,
    "age": 58.0,
    "high_blood_pressure_Yes": 1,
    "systolic_bp": 145.0,
    "ldl": 150.0,
    "alcohol_intake": 10.0,
    "diastolic_bp": 92.0,
    "hdl": 42.0,
    "heart_rate": 82.0,
    "blood_pressure": 145.0,
    "triglycerides": 190.0,
    "salt_intake": 8.0,
}

def test_health_endpoint(client):
    """Verify GET /health reports model loading status and target classes."""
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["model_loaded"] is True
    assert data["feature_count"] == 15
    assert set(data["target_classes"]) == {"DI", "DI_HT", "DI_HT_HY", "DI_HY", "HT", "HT_HY", "HY", "N"}

def test_disease_class_mapping():
    """Verify all 8 target classes have verified descriptions and names."""
    expected_classes = ["N", "DI", "HY", "HT", "DI_HY", "DI_HT", "HT_HY", "DI_HT_HY"]
    for code in expected_classes:
        assert code in DISEASE_METADATA
        info = get_disease_info(code)
        assert info["code"] == code
        assert len(info["name"]) > 0
        assert len(info["description"]) > 0
        assert len(info["category"]) > 0

    # Test unknown fallback
    fallback = get_disease_info("UNKNOWN_XYZ")
    assert fallback["code"] == "UNKNOWN_XYZ"
    assert fallback["category"] == "Unverified"

def test_feature_columns_order():
    """Verify model service feature columns match the 15 features in exact order."""
    service = ModelService.get_instance()
    assert service.is_loaded
    expected_order = [
        "HbA1c_level",
        "bmi",
        "glucose",
        "age_normalized",
        "age",
        "high_blood_pressure_Yes",
        "alcohol_intake",
        "systolic_bp",
        "hdl",
        "ldl",
        "diastolic_bp",
        "salt_intake",
        "heart_rate",
        "blood_pressure",
        "triglycerides",
    ]
    assert list(service.feature_columns) == expected_order

def test_age_normalized_preprocessing():
    """Verify age_normalized is computed using (age - 2) / 87."""
    service = ModelService.get_instance()
    # Age 58 -> (58 - 2) / 87 = 56 / 87 = 0.643678... -> 0.6437
    input_data = {**VALID_PATIENT_PAYLOAD, "age": 58.0}
    from backend.app.schemas import PatientAssessmentInput
    parsed = PatientAssessmentInput(**input_data)
    result = service.predict(parsed)
    assert result.feature_values["age_normalized"] == pytest.approx(0.6437, abs=1e-3)
    assert len(result.preprocessing_notes) == 0

    # Age 95 -> exceeds 89 -> note added
    input_data_elderly = {**VALID_PATIENT_PAYLOAD, "age": 95.0}
    parsed_elderly = PatientAssessmentInput(**input_data_elderly)
    result_elderly = service.predict(parsed_elderly)
    assert result_elderly.feature_values["age_normalized"] > 1.0
    assert any("exceeds training dataset maximum" in note for note in result_elderly.preprocessing_notes)

def test_predict_endpoint_valid_payload(client):
    """Verify POST /predict produces valid prediction and probability distribution."""
    res = client.post("/predict", json=VALID_PATIENT_PAYLOAD)
    assert res.status_code == 200, res.text
    data = res.json()
    assert data["status"] == "success"
    assert data["predicted_class"] in {"DI", "DI_HT", "DI_HT_HY", "DI_HY", "HT", "HT_HY", "HY", "N"}
    assert data["disease_name"] == DISEASE_METADATA[data["predicted_class"]]["name"]

    # Verify probability distribution
    probs = data["class_probabilities"]
    assert len(probs) == 8
    for cls_code in DISEASE_METADATA:
        assert cls_code in probs
        assert probs[cls_code] >= 0.0

    total_prob = sum(probs.values())
    assert 99.0 <= total_prob <= 101.0, f"Probabilities should sum to ~100%, got {total_prob}"

    # Verify predicted class has the highest probability
    highest_prob_class = max(probs.items(), key=lambda x: x[1])[0]
    assert data["predicted_class"] == highest_prob_class

    # Verify disclaimer is attached
    assert "not a medical diagnosis" in data["disclaimer"]
    assert data["model_metadata"]["is_calibrated"] is False

def test_blood_pressure_consistency_validation(client):
    """Verify diastolic BP >= systolic BP is rejected with 422."""
    # Diastolic greater than systolic
    invalid_1 = {**VALID_PATIENT_PAYLOAD, "systolic_bp": 120.0, "diastolic_bp": 130.0}
    res_1 = client.post("/predict", json=invalid_1)
    assert res_1.status_code == 422
    assert "Diastolic blood pressure must be strictly lower" in res_1.text

    # Diastolic equal to systolic
    invalid_2 = {**VALID_PATIENT_PAYLOAD, "systolic_bp": 120.0, "diastolic_bp": 120.0}
    res_2 = client.post("/predict", json=invalid_2)
    assert res_2.status_code == 422
    assert "Diastolic blood pressure must be strictly lower" in res_2.text

def test_out_of_range_rejections(client):
    """Verify inputs outside training-supported bounds are rejected with 422."""
    test_cases = [
        ("age", 1.0),
        ("age", 115.0),
        ("bmi", 5.0),
        ("bmi", 85.0),
        ("glucose", 30.0),
        ("glucose", 500.0),
        ("HbA1c_level", 2.0),
        ("HbA1c_level", 18.0),
        ("systolic_bp", 50.0),
        ("systolic_bp", 260.0),
        ("diastolic_bp", 30.0),
        ("diastolic_bp", 150.0),
        ("salt_intake", 0.5),
        ("salt_intake", 25.0),
        ("alcohol_intake", -1.0),
        ("alcohol_intake", 45.0),
    ]
    for field, bad_val in test_cases:
        bad_payload = {**VALID_PATIENT_PAYLOAD, field: bad_val}
        # Avoid triggering BP consistency if modifying systolic/diastolic
        if field == "systolic_bp" and bad_val < 92.0:
            bad_payload["diastolic_bp"] = bad_val - 10.0
        res = client.post("/predict", json=bad_payload)
        assert res.status_code == 422, f"Expected 422 for {field}={bad_val}, got {res.status_code}: {res.text}"

def test_missing_required_fields(client):
    """Verify omitting required fields triggers 422."""
    incomplete = {k: v for k, v in VALID_PATIENT_PAYLOAD.items() if k != "glucose"}
    res = client.post("/predict", json=incomplete)
    assert res.status_code == 422

    res_empty = client.post("/predict", json={})
    assert res_empty.status_code == 422

def test_non_finite_inputs(client):
    """Verify non-finite inputs (strings, NaNs) trigger 422."""
    bad_payload_str = {**VALID_PATIENT_PAYLOAD, "bmi": "not-a-number"}
    res = client.post("/predict", json=bad_payload_str)
    assert res.status_code == 422
