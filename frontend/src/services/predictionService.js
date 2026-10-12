/**
 * Prediction API Service
 * Handles communication with the FastAPI backend ML inference service.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Checks backend health and model loading status.
 * @returns {Promise<{status: string, model_loaded: boolean, feature_count: number}>}
 */
export async function checkApiHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend returned status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return {
      status: 'unavailable',
      model_loaded: false,
      error: error.message || 'Unable to connect to backend service',
    };
  }
}

/**
 * Sends validated 15 patient features to the ML prediction endpoint.
 * @param {Object} patientData - Object with the 15 verified features
 * @returns {Promise<Object>} - Actual prediction response from the trained model
 */
export async function predictPatientRisk(patientData) {
  const payload = {
    HbA1c_level: parseFloat(patientData.HbA1c_level),
    bmi: parseFloat(patientData.bmi),
    glucose: parseFloat(patientData.glucose),
    age: parseFloat(patientData.age),
    high_blood_pressure_Yes: parseInt(patientData.high_blood_pressure_Yes, 10),
    systolic_bp: parseFloat(patientData.systolic_bp),
    ldl: parseFloat(patientData.ldl),
    alcohol_intake: parseFloat(patientData.alcohol_intake),
    diastolic_bp: parseFloat(patientData.diastolic_bp),
    hdl: parseFloat(patientData.hdl),
    heart_rate: parseFloat(patientData.heart_rate),
    blood_pressure: parseFloat(patientData.blood_pressure),
    triglycerides: parseFloat(patientData.triglycerides),
    salt_intake: parseFloat(patientData.salt_intake),
    age_normalized: patientData.age_normalized !== undefined ? parseFloat(patientData.age_normalized) : undefined,
  };

  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorDetail = `Prediction request failed (HTTP ${response.status})`;
    try {
      const errJson = await response.json();
      if (errJson.detail) {
        if (Array.isArray(errJson.detail)) {
          errorDetail = errJson.detail.map((d) => d.msg || JSON.stringify(d)).join('; ');
        } else {
          errorDetail = String(errJson.detail);
        }
      }
    } catch {
      // Use fallback errorDetail
    }
    throw new Error(errorDetail);
  }

  return await response.json();
}
