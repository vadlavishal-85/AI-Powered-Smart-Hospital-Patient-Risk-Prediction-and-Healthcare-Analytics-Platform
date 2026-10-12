import os
import joblib
import pandas as pd
import numpy as np
from typing import Dict, Any, Tuple
from .class_mapping import get_disease_info
from .schemas import PatientAssessmentInput, PredictionResponse

DATASET_AGE_MIN = 2.0
DATASET_AGE_MAX = 89.0
DATASET_AGE_SPAN = DATASET_AGE_MAX - DATASET_AGE_MIN  # 87.0

MODEL_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models"))
MODEL_PATH = os.path.join(MODEL_DIR, "best_model.pkl")
FEATURES_PATH = os.path.join(MODEL_DIR, "feature_columns.pkl")
ENCODER_PATH = os.path.join(MODEL_DIR, "label_encoder.pkl")

class ModelService:
    _instance = None

    def __init__(self):
        self.model = None
        self.feature_columns = None
        self.label_encoder = None
        self.is_loaded = False

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def load_artifacts(self):
        if self.is_loaded:
            return

        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model artifact not found at: {MODEL_PATH}")
        if not os.path.exists(FEATURES_PATH):
            raise FileNotFoundError(f"Feature columns artifact not found at: {FEATURES_PATH}")

        self.feature_columns = joblib.load(FEATURES_PATH)
        self.model = joblib.load(MODEL_PATH)

        if os.path.exists(ENCODER_PATH):
            try:
                self.label_encoder = joblib.load(ENCODER_PATH)
            except Exception:
                self.label_encoder = None

        self.is_loaded = True

    def predict(self, patient_data: PatientAssessmentInput) -> PredictionResponse:
        if not self.is_loaded:
            self.load_artifacts()

        preprocessing_notes = []

        # 1. Compute age_normalized using verified notebook formula: (age - 2) / 87
        age_val = float(patient_data.age)
        computed_age_norm = (age_val - DATASET_AGE_MIN) / DATASET_AGE_SPAN

        if age_val > DATASET_AGE_MAX:
            preprocessing_notes.append(
                f"Patient age ({age_val:.0f} yrs) exceeds training dataset maximum (89 yrs). "
                f"age_normalized evaluated to {computed_age_norm:.4f} (> 1.0)."
            )

        # 2. Build feature dictionary with exact keys
        features_dict: Dict[str, float] = {
            "HbA1c_level": float(patient_data.HbA1c_level),
            "bmi": float(patient_data.bmi),
            "glucose": float(patient_data.glucose),
            "age": age_val,
            "age_normalized": float(round(computed_age_norm, 4)),
            "high_blood_pressure_Yes": int(patient_data.high_blood_pressure_Yes),
            "systolic_bp": float(patient_data.systolic_bp),
            "ldl": float(patient_data.ldl),
            "alcohol_intake": float(patient_data.alcohol_intake),
            "diastolic_bp": float(patient_data.diastolic_bp),
            "hdl": float(patient_data.hdl),
            "heart_rate": float(patient_data.heart_rate),
            "blood_pressure": float(patient_data.blood_pressure),
            "triglycerides": float(patient_data.triglycerides),
            "salt_intake": float(patient_data.salt_intake),
        }

        # 3. Create DataFrame and enforce verified training column order
        df_input = pd.DataFrame([features_dict])[self.feature_columns]

        # 4. Perform actual model inference
        predicted_class = str(self.model.predict(df_input)[0])

        # 5. Extract probabilities if supported by the model
        class_probabilities: Dict[str, float] = {}
        if hasattr(self.model, "predict_proba") and hasattr(self.model, "classes_"):
            raw_probas = self.model.predict_proba(df_input)[0]
            for cls_name, prob in zip(self.model.classes_, raw_probas):
                class_probabilities[str(cls_name)] = float(round(float(prob) * 100, 2))

        # 6. Retrieve verified disease definition
        disease_info = get_disease_info(predicted_class)

        return PredictionResponse(
            status="success",
            predicted_class=predicted_class,
            disease_name=disease_info["name"],
            disease_category=disease_info["category"],
            disease_description=disease_info["description"],
            class_probabilities=class_probabilities,
            feature_values={k: features_dict[k] for k in self.feature_columns},
            model_metadata={
                "model_type": type(self.model).__name__,
                "n_features": len(self.feature_columns),
                "feature_order": self.feature_columns,
                "classes": list(self.model.classes_) if hasattr(self.model, "classes_") else [],
                "is_calibrated": False,
                "probability_disclaimer": "Model probabilities represent Random Forest decision-tree frequency distributions and are not calibrated clinical epidemiology risk percentages.",
            },
            disclaimer=(
                "This machine learning system is intended for research and decision-support "
                "purposes only. Its output is not a medical diagnosis and must not replace "
                "evaluation by a qualified healthcare professional."
            ),
            preprocessing_notes=preprocessing_notes,
        )
