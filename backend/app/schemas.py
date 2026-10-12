from pydantic import BaseModel, Field, model_validator
from typing import Optional, Dict, List, Any

class PatientAssessmentInput(BaseModel):
    age: float = Field(..., ge=2.0, le=110.0, description="Patient age in years")
    bmi: float = Field(..., ge=10.0, le=75.0, description="Body Mass Index in kg/m²")
    glucose: float = Field(..., ge=50.0, le=400.0, description="Blood glucose level in mg/dL")
    HbA1c_level: float = Field(..., ge=3.0, le=15.0, description="HbA1c percentage level")
    high_blood_pressure_Yes: int = Field(..., ge=0, le=1, description="Hypertension diagnosed: 1 for Yes, 0 for No")
    systolic_bp: float = Field(..., ge=70.0, le=240.0, description="Systolic blood pressure in mmHg")
    diastolic_bp: float = Field(..., ge=40.0, le=140.0, description="Diastolic blood pressure in mmHg")
    blood_pressure: float = Field(..., ge=90.0, le=220.0, description="General baseline blood pressure metric in mmHg")
    heart_rate: float = Field(..., ge=40.0, le=180.0, description="Resting heart rate in bpm")
    ldl: float = Field(..., ge=40.0, le=300.0, description="LDL cholesterol in mg/dL")
    hdl: float = Field(..., ge=15.0, le=120.0, description="HDL cholesterol in mg/dL")
    triglycerides: float = Field(..., ge=30.0, le=600.0, description="Triglycerides in mg/dL")
    alcohol_intake: float = Field(..., ge=0.0, le=30.0, description="Alcohol intake metric score (0 to 30)")
    salt_intake: float = Field(..., ge=1.0, le=20.0, description="Dietary salt intake metric score (1 to 20)")
    age_normalized: Optional[float] = Field(None, description="Optional precomputed normalized age")

    @model_validator(mode="after")
    def validate_bp_consistency(self):
        import math
        for field_name in type(self).model_fields:
            val = getattr(self, field_name)
            if isinstance(val, (float, int)) and not math.isfinite(val):
                raise ValueError(f"Field '{field_name}' must be a finite number.")
        if self.diastolic_bp >= self.systolic_bp:
            raise ValueError("Diastolic blood pressure must be strictly lower than systolic blood pressure.")
        return self

class PredictionResponse(BaseModel):
    status: str = "success"
    predicted_class: str
    disease_name: str
    disease_category: str
    disease_description: str
    class_probabilities: Dict[str, float]
    feature_values: Dict[str, float]
    model_metadata: Dict[str, Any]
    disclaimer: str
    preprocessing_notes: List[str]

class HealthCheckResponse(BaseModel):
    status: str
    model_loaded: bool
    feature_count: int
    target_classes: List[str]
    version: str
