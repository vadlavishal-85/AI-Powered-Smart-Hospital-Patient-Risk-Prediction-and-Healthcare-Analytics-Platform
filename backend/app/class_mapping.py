"""
Verified Disease Target Label Definitions

Source of truth: FINALMLPROJECT COMPLETE.ipynb & project specifications
Classes: ['DI', 'DI_HT', 'DI_HT_HY', 'DI_HY', 'HT', 'HT_HY', 'HY', 'N']

Mapping:
- N = Normal / baseline
- DI = Type-2 Diabetes Mellitus
- HY = Essential Hypertension
- HT = Ischemic Heart Disease
- DI_HY = Diabetes + Hypertension
- DI_HT = Diabetes + Heart Disease
- HT_HY = Heart Disease + Hypertension
- DI_HT_HY = Diabetes + Heart Disease + Hypertension
"""

DISEASE_METADATA = {
    "N": {
        "code": "N",
        "name": "Normal / Baseline",
        "short_name": "Normal",
        "category": "Baseline",
        "description": "No detected chronic disease pattern across diabetes, hypertension, or heart disease markers.",
    },
    "DI": {
        "code": "DI",
        "name": "Type-2 Diabetes Mellitus",
        "short_name": "Diabetes",
        "category": "Single Disease",
        "description": "Primary indication of glycemic dysregulation and diabetic metabolic pattern.",
    },
    "HY": {
        "code": "HY",
        "name": "Essential Hypertension",
        "short_name": "Hypertension",
        "category": "Single Disease",
        "description": "Primary indication of persistent arterial pressure elevation and chronic hypertensive vascular risk.",
    },
    "HT": {
        "code": "HT",
        "name": "Ischemic Heart Disease",
        "short_name": "Heart Disease",
        "category": "Single Disease",
        "description": "Primary indication of coronary/cardiac risk and cardiovascular dysfunction.",
    },
    "DI_HY": {
        "code": "DI_HY",
        "name": "Diabetes + Hypertension",
        "short_name": "Diabetes + Hypertension",
        "category": "Dual Co-Morbidity",
        "description": "Co-morbid presentation of Type-2 Diabetes Mellitus and Essential Hypertension.",
    },
    "DI_HT": {
        "code": "DI_HT",
        "name": "Diabetes + Heart Disease",
        "short_name": "Diabetes + Heart Disease",
        "category": "Dual Co-Morbidity",
        "description": "Co-morbid presentation of Type-2 Diabetes Mellitus and Ischemic Heart Disease.",
    },
    "HT_HY": {
        "code": "HT_HY",
        "name": "Heart Disease + Hypertension",
        "short_name": "Heart Disease + Hypertension",
        "category": "Dual Co-Morbidity",
        "description": "Co-morbid presentation of Ischemic Heart Disease and Essential Hypertension.",
    },
    "DI_HT_HY": {
        "code": "DI_HT_HY",
        "name": "Diabetes + Heart Disease + Hypertension",
        "short_name": "Tri-Morbidity (All Three)",
        "category": "Tri-Morbidity",
        "description": "Simultaneous tri-morbidity presenting Type-2 Diabetes, Ischemic Heart Disease, and Essential Hypertension.",
    },
}

def get_disease_info(code: str) -> dict:
    return DISEASE_METADATA.get(
        code,
        {
            "code": code or "UNKNOWN",
            "name": f"Unmapped Class ({code})",
            "short_name": "Unknown",
            "category": "Unverified",
            "description": "Unverified category from model output.",
        },
    )
