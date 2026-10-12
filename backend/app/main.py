import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from .schemas import PatientAssessmentInput, PredictionResponse, HealthCheckResponse
from .model_service import ModelService

# Configure structured logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("patient_risk_api")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Preload ML model once during startup
    logger.info("Initializing ML model service and loading artifacts...")
    try:
        model_service = ModelService.get_instance()
        model_service.load_artifacts()
        logger.info(f"Model loaded successfully. Features: {len(model_service.feature_columns)}")
    except Exception as e:
        logger.error(f"Failed to load ML artifacts during startup: {str(e)}")
        # App will report error if requested
    yield
    logger.info("Shutting down ML API service.")

app = FastAPI(
    title="AI Patient Risk Assessment API",
    description="Machine Learning-Based Multi-Disease Risk Assessment Inference Service",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Configuration
allowed_origins_env = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173",
)
allowed_origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

@app.get("/health", response_model=HealthCheckResponse)
def health_check():
    service = ModelService.get_instance()
    return HealthCheckResponse(
        status="healthy" if service.is_loaded else "degraded",
        model_loaded=service.is_loaded,
        feature_count=len(service.feature_columns) if service.feature_columns else 0,
        target_classes=list(service.model.classes_) if service.is_loaded and hasattr(service.model, "classes_") else [],
        version="1.0.0",
    )

@app.post("/predict", response_model=PredictionResponse)
def predict_patient_risk(patient_input: PatientAssessmentInput):
    service = ModelService.get_instance()
    if not service.is_loaded:
        try:
            service.load_artifacts()
        except Exception as e:
            logger.error(f"Model load failure: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Machine learning model service is currently unavailable. Please check backend model artifacts.",
            )

    try:
        result = service.predict(patient_input)
        return result
    except Exception as e:
        logger.error(f"Inference error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while evaluating the clinical inputs. Please verify parameter ranges.",
        )
