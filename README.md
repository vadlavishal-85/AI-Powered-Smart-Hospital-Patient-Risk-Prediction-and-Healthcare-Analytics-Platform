# AI Patient Risk Assessment System

> **Machine Learning-Based Multi-Disease Risk Assessment**  
> An evidence-informed clinical decision support system utilizing a trained 15-feature Random Forest multiclass classifier to evaluate risks across Type-2 Diabetes Mellitus, Essential Hypertension, and Ischemic Heart Disease.

---

## 🏥 Project Overview

The **AI Patient Risk Assessment System** provides a modern, responsive, healthcare-grade interface combined with a real machine learning inference engine. It enables clinicians and health practitioners to assess patient physiological and lifestyle data across eight verified diagnostic combinations.

### Supported Diagnostic Categories

| Code | Disease Name | Category | Description |
| :---: | :--- | :--- | :--- |
| **`N`** | Normal / Baseline | Baseline | Baseline physiological indicators across all three conditions. |
| **`DI`** | Type-2 Diabetes Mellitus | Single Disease | Glycemic dysregulation and elevated HbA1c/glucose profile. |
| **`HY`** | Essential Hypertension | Single Disease | Chronic arterial blood pressure elevation. |
| **`HT`** | Ischemic Heart Disease | Single Disease | Coronary/cardiovascular risk markers and lipid dysfunction. |
| **`DI_HY`** | Diabetes + Hypertension | Dual Co-Morbidity | Concurrent glycemic dysregulation and arterial hypertension. |
| **`DI_HT`** | Diabetes + Heart Disease | Dual Co-Morbidity | Concurrent glycemic dysregulation and coronary heart disease risk. |
| **`HT_HY`** | Heart Disease + Hypertension | Dual Co-Morbidity | Concurrent cardiovascular risk and arterial hypertension. |
| **`DI_HT_HY`** | Diabetes + Heart Disease + Hypertension | Tri-Morbidity | Simultaneous co-occurrence of all three chronic conditions. |

---

## 🧬 Machine Learning Architecture

- **Model Type:** Scikit-Learn `RandomForestClassifier` (100 estimators)
- **Training Population:** 278,701 balanced records
- **Features Evaluated:** 15 verified clinical parameters:
  1. `HbA1c_level` (3.0 – 15.0%)
  2. `bmi` (10.0 – 75.0 kg/m²)
  3. `glucose` (50.0 – 400.0 mg/dL)
  4. `age_normalized` (derived: `(age - 2) / 87`)
  5. `age` (2 – 110 years)
  6. `high_blood_pressure_Yes` (binary 0 or 1)
  7. `alcohol_intake` (0.0 – 30.0 units/week)
  8. `systolic_bp` (70.0 – 240.0 mmHg)
  9. `hdl` (15.0 – 120.0 mg/dL)
  10. `ldl` (40.0 – 300.0 mg/dL)
  11. `diastolic_bp` (40.0 – 140.0 mmHg; strictly `< systolic_bp`)
  12. `salt_intake` (1.0 – 20.0 g/day)
  13. `heart_rate` (40.0 – 180.0 bpm)
  14. `blood_pressure` (90.0 – 220.0 mmHg)
  15. `triglycerides` (30.0 – 600.0 mg/dL)

> **Clinical Disclaimer:** Model probabilities reflect ensemble decision-tree frequency distributions and represent computational classification confidence. They are **not calibrated epidemiological clinical risk estimates** and do not replace professional medical judgment.

---

## 🏗️ Repository Structure

```text
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── class_mapping.py      # Verified 8-class disease metadata
│   │   ├── main.py               # FastAPI application with CORS & lifespan
│   │   ├── model_service.py      # Preloaded Random Forest inference service
│   │   └── schemas.py            # Pydantic input/output validation models
│   ├── models/
│   │   ├── feature_columns.pkl   # Enforced 15-feature column order
│   │   ├── label_encoder.pkl     # Multiclass label encoder
│   │   ├── best_model.pkl        # Trained Random Forest weights (~740MB, see README)
│   │   └── README.md             # Artifact documentation & cloud hosting
│   ├── Dockerfile                # Production container specification
│   ├── requirements.txt          # Python dependencies
│   └── test_api.py               # Automated pytest validation suite
├── frontend/
│   ├── public/
│   │   └── _redirects            # Netlify SPA routing rewrite rule
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx   # Light-themed hospital landing page
│   │   │   ├── AssessmentPage.jsx# 15-parameter intake & review form
│   │   │   └── ResultsPage.jsx   # Verified prediction & probability breakdown
│   │   ├── services/
│   │   │   └── predictionService.js # Backend API client
│   │   ├── styles/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.js
├── netlify.toml                  # Netlify deployment configuration
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### 1. Backend Service
```bash
# Navigate to project root
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
```
- API Docs: `http://127.0.0.1:8000/docs`
- Health Check: `http://127.0.0.1:8000/health`

### 2. Frontend Application
```bash
cd frontend
npm install
npm run dev
```
- UI available at `http://localhost:5173/`

### 3. Run Automated Tests
```bash
python -m pytest backend/test_api.py -v
cd frontend && npm run lint && npm run build
```

---

## 🌐 Netlify Deployment

The frontend is ready for automated deployment on Netlify:
- **Base directory:** `frontend`
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Environment Variable:** `VITE_API_BASE_URL` (set to your production backend URL)
