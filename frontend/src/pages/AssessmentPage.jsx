import React, { useState } from 'react';
import './AssessmentPage.css';
import { calculateAgeNormalized } from '../utils/clinicalCalculators';

const DEFAULT_FORM_STATE = {
  age: '',
  bmi: '',
  glucose: '',
  HbA1c_level: '',
  high_blood_pressure_Yes: '0', // 0: No, 1: Yes
  systolic_bp: '',
  diastolic_bp: '',
  blood_pressure: '',
  heart_rate: '',
  ldl: '',
  hdl: '',
  triglycerides: '',
  alcohol_intake: '',
  salt_intake: '',
};

const VALIDATION_CONSTRAINTS = {
  age: { min: 2, max: 110, label: 'Age', unit: 'years' },
  bmi: { min: 10, max: 75, label: 'Body Mass Index (BMI)', unit: 'kg/m²' },
  glucose: { min: 50, max: 400, label: 'Blood Glucose Level', unit: 'mg/dL' },
  HbA1c_level: { min: 3.0, max: 15.0, label: 'HbA1c Level', unit: '%' },
  systolic_bp: { min: 70, max: 240, label: 'Systolic Blood Pressure', unit: 'mmHg' },
  diastolic_bp: { min: 40, max: 140, label: 'Diastolic Blood Pressure', unit: 'mmHg' },
  blood_pressure: { min: 90, max: 220, label: 'Baseline Blood Pressure Metric', unit: 'mmHg' },
  heart_rate: { min: 40, max: 180, label: 'Resting Heart Rate', unit: 'bpm' },
  ldl: { min: 40, max: 300, label: 'LDL Cholesterol', unit: 'mg/dL' },
  hdl: { min: 15, max: 120, label: 'HDL Cholesterol', unit: 'mg/dL' },
  triglycerides: { min: 30, max: 600, label: 'Triglycerides', unit: 'mg/dL' },
  alcohol_intake: { min: 0, max: 30, label: 'Alcohol Intake Metric', unit: 'units/week' },
  salt_intake: { min: 1.0, max: 20.0, label: 'Dietary Salt Intake Metric', unit: 'g/day' },
};

/**
 * 15-Feature Patient Assessment Intake Form
 * Module 3 Implementation: AI Patient Risk Assessment System
 *
 * @param {Object} props
 * @param {Function} props.onReturnHome - Callback to return to landing page
 * @param {Function} props.onSubmitAssessment - Callback to proceed with verified data
 * @param {Object} [props.initialValues] - Existing values to preserve on edit
 */
export default function AssessmentPage({
  onReturnHome,
  onSubmitAssessment,
  initialValues,
  isSubmitting = false,
  submissionError = null,
  onClearError,
}) {
  const [formData, setFormData] = useState(() => {
    if (initialValues) {
      return {
        age: initialValues.age !== undefined ? String(initialValues.age) : '',
        bmi: initialValues.bmi !== undefined ? String(initialValues.bmi) : '',
        glucose: initialValues.glucose !== undefined ? String(initialValues.glucose) : '',
        HbA1c_level: initialValues.HbA1c_level !== undefined ? String(initialValues.HbA1c_level) : '',
        high_blood_pressure_Yes: initialValues.high_blood_pressure_Yes !== undefined ? String(initialValues.high_blood_pressure_Yes) : '0',
        systolic_bp: initialValues.systolic_bp !== undefined ? String(initialValues.systolic_bp) : '',
        diastolic_bp: initialValues.diastolic_bp !== undefined ? String(initialValues.diastolic_bp) : '',
        blood_pressure: initialValues.blood_pressure !== undefined ? String(initialValues.blood_pressure) : '',
        heart_rate: initialValues.heart_rate !== undefined ? String(initialValues.heart_rate) : '',
        ldl: initialValues.ldl !== undefined ? String(initialValues.ldl) : '',
        hdl: initialValues.hdl !== undefined ? String(initialValues.hdl) : '',
        triglycerides: initialValues.triglycerides !== undefined ? String(initialValues.triglycerides) : '',
        alcohol_intake: initialValues.alcohol_intake !== undefined ? String(initialValues.alcohol_intake) : '',
        salt_intake: initialValues.salt_intake !== undefined ? String(initialValues.salt_intake) : '',
      };
    }
    return DEFAULT_FORM_STATE;
  });

  const [errors, setErrors] = useState({});
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Live calculation of age_normalized
  const computedAgeNormalized = calculateAgeNormalized(formData.age);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error on edit
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateAll = () => {
    const newErrors = {};

    Object.entries(VALIDATION_CONSTRAINTS).forEach(([field, rule]) => {
      const val = formData[field];
      if (val === '' || val === null || val === undefined) {
        newErrors[field] = `${rule.label} is required.`;
        return;
      }
      const num = parseFloat(val);
      if (isNaN(num) || !isFinite(num)) {
        newErrors[field] = `Please enter a valid numeric value for ${rule.label}.`;
        return;
      }
      if (num < rule.min || num > rule.max) {
        newErrors[field] = `${rule.label} must be between ${rule.min} and ${rule.max} ${rule.unit}.`;
      }
    });

    // Check diastolic vs systolic logical consistency
    const sys = parseFloat(formData.systolic_bp);
    const dia = parseFloat(formData.diastolic_bp);
    if (!isNaN(sys) && !isNaN(dia) && dia >= sys) {
      newErrors.diastolic_bp = 'Diastolic BP must be lower than Systolic BP.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReviewClick = (e) => {
    e.preventDefault();
    if (validateAll()) {
      setIsReviewMode(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinalSubmit = () => {
    if (!validateAll()) {
      setIsReviewMode(false);
      return;
    }

    // Prepare verified 15-feature model input object matching exact training columns
    const preparedPayload = {
      HbA1c_level: parseFloat(formData.HbA1c_level),
      bmi: parseFloat(formData.bmi),
      glucose: parseFloat(formData.glucose),
      age: parseFloat(formData.age),
      age_normalized: computedAgeNormalized !== null ? computedAgeNormalized : 0,
      high_blood_pressure_Yes: parseInt(formData.high_blood_pressure_Yes, 10),
      systolic_bp: parseFloat(formData.systolic_bp),
      ldl: parseFloat(formData.ldl),
      alcohol_intake: parseFloat(formData.alcohol_intake),
      diastolic_bp: parseFloat(formData.diastolic_bp),
      hdl: parseFloat(formData.hdl),
      heart_rate: parseFloat(formData.heart_rate),
      blood_pressure: parseFloat(formData.blood_pressure),
      triglycerides: parseFloat(formData.triglycerides),
      salt_intake: parseFloat(formData.salt_intake),
    };

    if (typeof onSubmitAssessment === 'function') {
      onSubmitAssessment(preparedPayload);
    }
  };

  const handleClearForm = () => {
    setFormData(DEFAULT_FORM_STATE);
    setErrors({});
    setShowClearConfirm(false);
    setIsReviewMode(false);
  };

  const loadSampleValues = () => {
    setFormData({
      age: '58',
      bmi: '29.5',
      glucose: '155',
      HbA1c_level: '7.2',
      high_blood_pressure_Yes: '1',
      systolic_bp: '145',
      diastolic_bp: '92',
      blood_pressure: '145',
      heart_rate: '82',
      ldl: '150',
      hdl: '42',
      triglycerides: '190',
      alcohol_intake: '10.0',
      salt_intake: '8.0',
    });
    setErrors({});
  };

  return (
    <div className="assessment-root">
      {/* Top Header Navigation Bar */}
      <header className="assessment-header-bar" role="banner">
        <div className="assessment-header-inner">
          <button
            type="button"
            className="btn-back"
            onClick={onReturnHome}
            aria-label="Return to Landing Page"
            id="assessment-back-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Landing Page
          </button>

          <div className="assessment-progress-badge">
            <span style={{ color: 'var(--color-soft-teal, #65BDB3)' }}>●</span>
            {isReviewMode ? 'Step 2 of 2: Review & Confirm' : 'Step 1 of 2: Clinical Intake'}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="assessment-main" id="main-content">
        {/* Title & Guidance */}
        <div className="assessment-title-section">
          <h1>Patient Health Risk Assessment</h1>
          <p>
            Please provide the patient's verified physiological, metabolic, and lifestyle metrics.
            All 15 indicators are structured directly for the multi-disease classifier pipeline.
          </p>
        </div>

        {/* Clinical Transparency Notice */}
        <div className="clinical-info-banner">
          <div className="clinical-info-banner-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
          <div className="clinical-info-banner-content">
            <h4>Verified ML Feature Alignment</h4>
            <p>
              This intake form collects the 15 selected features verified from the trained model pipeline.
              <code>age_normalized</code> is automatically derived using the training dataset MinMax parameters
              (min=2, max=89). No predictions are computed in this module.
            </p>
          </div>
        </div>

        {/* Mode A: REVIEW VIEW */}
        {isReviewMode ? (
          <div className="review-container">
            <div className="review-header">
              <h2>Review Assessment Inputs</h2>
              <p>Please review each of the 15 captured parameters before submitting to the results view.</p>
            </div>

            <table className="review-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Clinical Parameter</th>
                  <th>Model Feature Key</th>
                  <th>Entered Value</th>
                  <th>Unit / Scale</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Profile</td>
                  <td className="review-param-name">Age</td>
                  <td className="review-model-key">age</td>
                  <td className="review-value-cell">{formData.age}</td>
                  <td>years</td>
                </tr>
                <tr>
                  <td>Profile</td>
                  <td className="review-param-name">Normalized Age</td>
                  <td className="review-model-key">age_normalized</td>
                  <td className="review-value-cell" style={{ color: '#0d9488' }}>
                    {computedAgeNormalized} (auto-calculated)
                  </td>
                  <td>ratio [0.0 - 1.0]</td>
                </tr>
                <tr>
                  <td>Profile</td>
                  <td className="review-param-name">Body Mass Index</td>
                  <td className="review-model-key">bmi</td>
                  <td className="review-value-cell">{formData.bmi}</td>
                  <td>kg/m²</td>
                </tr>
                <tr>
                  <td>Metabolic</td>
                  <td className="review-param-name">Blood Glucose</td>
                  <td className="review-model-key">glucose</td>
                  <td className="review-value-cell">{formData.glucose}</td>
                  <td>mg/dL</td>
                </tr>
                <tr>
                  <td>Metabolic</td>
                  <td className="review-param-name">HbA1c Level</td>
                  <td className="review-model-key">HbA1c_level</td>
                  <td className="review-value-cell">{formData.HbA1c_level}</td>
                  <td>%</td>
                </tr>
                <tr>
                  <td>Cardiovascular</td>
                  <td className="review-param-name">Diagnosed Hypertension</td>
                  <td className="review-model-key">high_blood_pressure_Yes</td>
                  <td className="review-value-cell">
                    {formData.high_blood_pressure_Yes === '1' ? 'Yes (1)' : 'No (0)'}
                  </td>
                  <td>binary flag</td>
                </tr>
                <tr>
                  <td>Cardiovascular</td>
                  <td className="review-param-name">Systolic Blood Pressure</td>
                  <td className="review-model-key">systolic_bp</td>
                  <td className="review-value-cell">{formData.systolic_bp}</td>
                  <td>mmHg</td>
                </tr>
                <tr>
                  <td>Cardiovascular</td>
                  <td className="review-param-name">Diastolic Blood Pressure</td>
                  <td className="review-model-key">diastolic_bp</td>
                  <td className="review-value-cell">{formData.diastolic_bp}</td>
                  <td>mmHg</td>
                </tr>
                <tr>
                  <td>Cardiovascular</td>
                  <td className="review-param-name">Baseline Blood Pressure</td>
                  <td className="review-model-key">blood_pressure</td>
                  <td className="review-value-cell">{formData.blood_pressure}</td>
                  <td>mmHg</td>
                </tr>
                <tr>
                  <td>Cardiovascular</td>
                  <td className="review-param-name">Resting Heart Rate</td>
                  <td className="review-model-key">heart_rate</td>
                  <td className="review-value-cell">{formData.heart_rate}</td>
                  <td>bpm</td>
                </tr>
                <tr>
                  <td>Lipid Profile</td>
                  <td className="review-param-name">LDL Cholesterol</td>
                  <td className="review-model-key">ldl</td>
                  <td className="review-value-cell">{formData.ldl}</td>
                  <td>mg/dL</td>
                </tr>
                <tr>
                  <td>Lipid Profile</td>
                  <td className="review-param-name">HDL Cholesterol</td>
                  <td className="review-model-key">hdl</td>
                  <td className="review-value-cell">{formData.hdl}</td>
                  <td>mg/dL</td>
                </tr>
                <tr>
                  <td>Lipid Profile</td>
                  <td className="review-param-name">Triglycerides</td>
                  <td className="review-model-key">triglycerides</td>
                  <td className="review-value-cell">{formData.triglycerides}</td>
                  <td>mg/dL</td>
                </tr>
                <tr>
                  <td>Lifestyle</td>
                  <td className="review-param-name">Alcohol Intake Metric</td>
                  <td className="review-model-key">alcohol_intake</td>
                  <td className="review-value-cell">{formData.alcohol_intake}</td>
                  <td>units/week (0-30)</td>
                </tr>
                <tr>
                  <td>Lifestyle</td>
                  <td className="review-param-name">Salt Intake Metric</td>
                  <td className="review-model-key">salt_intake</td>
                  <td className="review-value-cell">{formData.salt_intake}</td>
                  <td>g/day (1-20)</td>
                </tr>
              </tbody>
            </table>

            {submissionError && (
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderLeft: '4px solid #ef4444',
                  borderRadius: '8px',
                  padding: '1.25rem',
                  marginBottom: '1.5rem',
                  color: '#991b1b',
                  fontSize: '0.9rem',
                }}
                role="alert"
                aria-live="assertive"
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 300px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem', color: '#b91c1c' }}>
                      Inference Service Notice
                    </div>
                    <p style={{ margin: 0, color: '#7f1d1d', lineHeight: 1.5 }}>
                      {submissionError}
                    </p>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.82rem', color: '#991b1b' }}>
                      Please ensure the local machine learning backend service is operational (port 8000) and try again.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={handleFinalSubmit}
                      disabled={isSubmitting}
                      style={{
                        background: '#dc2626',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.45rem 0.9rem',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                      id="retry-inference-btn"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <polyline points="23 4 23 10 17 10" />
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                      </svg>
                      Retry Inference
                    </button>
                    {onClearError && (
                      <button
                        type="button"
                        onClick={onClearError}
                        style={{
                          background: '#f1f5f9',
                          border: '1px solid #cbd5e1',
                          color: '#475569',
                          borderRadius: '6px',
                          padding: '0.45rem 0.75rem',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                        }}
                        id="dismiss-error-btn"
                      >
                        Dismiss
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="review-actions">
              <button
                type="button"
                className="btn-back"
                onClick={() => setIsReviewMode(false)}
                id="review-edit-btn"
                disabled={isSubmitting}
              >
                &larr; Edit Details
              </button>

              <button
                type="button"
                className="btn-review"
                onClick={handleFinalSubmit}
                id="review-confirm-submit-btn"
                disabled={isSubmitting}
                style={{
                  opacity: isSubmitting ? 0.7 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                }}
              >
                {isSubmitting ? (
                  <>Evaluating Model Prediction...</>
                ) : (
                  <>
                    Confirm &amp; Proceed to Results
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Mode B: INTAKE FORM VIEW */
          <form onSubmit={handleReviewClick} noValidate>
            {/* Quick Demo Helper Controls */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={loadSampleValues}
                style={{
                  background: 'var(--color-ice-blue, #EAF6FF)',
                  border: '1px solid var(--color-light-blue, #B9E4F5)',
                  color: 'var(--color-primary-blue, #2B6CB0)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  padding: '0.4rem 0.8rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
                id="fill-sample-btn"
              >
                Fill Clinical Sample Values
              </button>
            </div>

            {/* Section 1: Patient Profile & Demographics */}
            <section className="form-section-card" aria-labelledby="section-profile">
              <div className="form-section-header">
                <div className="section-icon-badge" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <h2 id="section-profile">1. Patient Profile &amp; Demographics</h2>
                  <p>Basic biometric and age categorization features.</p>
                </div>
              </div>

              <div className="form-grid">
                {/* 1. age */}
                <div className="field-container">
                  <div className="field-label-row">
                    <label htmlFor="field-age" className="field-label">
                      Patient Age <span className="required-mark">*</span>
                    </label>
                    <span className="field-unit">years</span>
                  </div>
                  <div className="input-wrapper">
                    <input
                      id="field-age"
                      type="number"
                      step="1"
                      min="2"
                      max="110"
                      placeholder="e.g. 58"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className={`form-input ${errors.age ? 'has-error' : ''}`}
                      aria-invalid={!!errors.age}
                      aria-describedby={errors.age ? 'err-age' : 'help-age'}
                    />
                  </div>
                  <span id="help-age" className="field-helper">Valid training range: 2 to 110 years</span>
                  {errors.age && (
                    <span id="err-age" className="field-error-msg" role="alert">
                      {errors.age}
                    </span>
                  )}
                </div>

                {/* 2. age_normalized (Derived Feature Display) */}
                <div className="derived-feature-box">
                  <span className="derived-feature-label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    Auto-Derived Feature: age_normalized
                  </span>
                  <div className="derived-feature-value">
                    {computedAgeNormalized !== null ? computedAgeNormalized : '—'}
                  </div>
                  <span className="derived-feature-formula">
                    Exact Dataset Formula: (Age - 2) / 87 [MinMax Scaler]
                  </span>
                </div>

                {/* 3. bmi */}
                <div className="field-container">
                  <div className="field-label-row">
                    <label htmlFor="field-bmi" className="field-label">
                      Body Mass Index (BMI) <span className="required-mark">*</span>
                    </label>
                    <span className="field-unit">kg/m²</span>
                  </div>
                  <div className="input-wrapper">
                    <input
                      id="field-bmi"
                      type="number"
                      step="0.1"
                      min="10"
                      max="75"
                      placeholder="e.g. 29.5"
                      value={formData.bmi}
                      onChange={(e) => handleInputChange('bmi', e.target.value)}
                      className={`form-input ${errors.bmi ? 'has-error' : ''}`}
                      aria-invalid={!!errors.bmi}
                      aria-describedby={errors.bmi ? 'err-bmi' : 'help-bmi'}
                    />
                  </div>
                  <span id="help-bmi" className="field-helper">Normal (18.5-24.9), Overweight (25-29.9), Obese (30+)</span>
                  {errors.bmi && (
                    <span id="err-bmi" className="field-error-msg" role="alert">
                      {errors.bmi}
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* Section 2: Glucose and Diabetes Indicators */}
            <section className="form-section-card" aria-labelledby="section-glucose">
              <div className="form-section-header">
                <div className="section-icon-badge" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                  </svg>
                </div>
                <div>
                  <h2 id="section-glucose">2. Glucose &amp; Diabetes Indicators</h2>
                  <p>Glycemic control and plasma blood sugar concentrations.</p>
                </div>
              </div>

              <div className="form-grid">
                {/* 4. glucose */}
                <div className="field-container">
                  <div className="field-label-row">
                    <label htmlFor="field-glucose" className="field-label">
                      Blood Glucose Level <span className="required-mark">*</span>
                    </label>
                    <span className="field-unit">mg/dL</span>
                  </div>
                  <div className="input-wrapper">
                    <input
                      id="field-glucose"
                      type="number"
                      step="1"
                      min="50"
                      max="400"
                      placeholder="e.g. 155"
                      value={formData.glucose}
                      onChange={(e) => handleInputChange('glucose', e.target.value)}
                      className={`form-input ${errors.glucose ? 'has-error' : ''}`}
                      aria-invalid={!!errors.glucose}
                      aria-describedby={errors.glucose ? 'err-glucose' : 'help-glucose'}
                    />
                  </div>
                  <span id="help-glucose" className="field-helper">Fasting or plasma glucose measurement (70-300 mg/dL)</span>
                  {errors.glucose && (
                    <span id="err-glucose" className="field-error-msg" role="alert">
                      {errors.glucose}
                    </span>
                  )}
                </div>

                {/* 5. HbA1c_level */}
                <div className="field-container">
                  <div className="field-label-row">
                    <label htmlFor="field-hba1c" className="field-label">
                      HbA1c Level <span className="required-mark">*</span>
                    </label>
                    <span className="field-unit">%</span>
                  </div>
                  <div className="input-wrapper">
                    <input
                      id="field-hba1c"
                      type="number"
                      step="0.1"
                      min="3.0"
                      max="15.0"
                      placeholder="e.g. 7.2"
                      value={formData.HbA1c_level}
                      onChange={(e) => handleInputChange('HbA1c_level', e.target.value)}
                      className={`form-input ${errors.HbA1c_level ? 'has-error' : ''}`}
                      aria-invalid={!!errors.HbA1c_level}
                      aria-describedby={errors.HbA1c_level ? 'err-hba1c' : 'help-hba1c'}
                    />
                  </div>
                  <span id="help-hba1c" className="field-helper">Normal (&lt;5.7%), Prediabetic (5.7-6.4%), Diabetic (&ge;6.5%)</span>
                  {errors.HbA1c_level && (
                    <span id="err-hba1c" className="field-error-msg" role="alert">
                      {errors.HbA1c_level}
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* Section 3: Blood Pressure & Cardiovascular Indicators */}
            <section className="form-section-card" aria-labelledby="section-bp">
              <div className="form-section-header">
                <div className="section-icon-badge" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <div>
                  <h2 id="section-bp">3. Blood Pressure &amp; Cardiovascular Indicators</h2>
                  <p>Blood pressure readings, clinical hypertension status, and heart rate.</p>
                </div>
              </div>

              <div className="form-grid">
                {/* 6. high_blood_pressure_Yes */}
                <div className="field-container">
                  <div className="field-label-row">
                    <span className="field-label">
                      High Blood Pressure Diagnosis <span className="required-mark">*</span>
                    </span>
                    <span className="field-unit">Clinical Flag</span>
                  </div>
                  <div className="radio-choice-group" role="radiogroup" aria-label="High Blood Pressure Diagnosis">
                    <label className={`radio-card-option ${formData.high_blood_pressure_Yes === '0' ? 'is-selected' : ''}`}>
                      <input
                        type="radio"
                        name="high_blood_pressure_Yes"
                        value="0"
                        checked={formData.high_blood_pressure_Yes === '0'}
                        onChange={(e) => handleInputChange('high_blood_pressure_Yes', e.target.value)}
                      />
                      No (Normal / Unreported)
                    </label>
                    <label className={`radio-card-option ${formData.high_blood_pressure_Yes === '1' ? 'is-selected' : ''}`}>
                      <input
                        type="radio"
                        name="high_blood_pressure_Yes"
                        value="1"
                        checked={formData.high_blood_pressure_Yes === '1'}
                        onChange={(e) => handleInputChange('high_blood_pressure_Yes', e.target.value)}
                      />
                      Yes (Diagnosed Hypertension)
                    </label>
                  </div>
                  <span className="field-helper">Maps to model binary dummy feature <code>high_blood_pressure_Yes</code></span>
                </div>

                {/* 7. heart_rate */}
                <div className="field-container">
                  <div className="field-label-row">
                    <label htmlFor="field-heart-rate" className="field-label">
                      Resting Heart Rate <span className="required-mark">*</span>
                    </label>
                    <span className="field-unit">bpm</span>
                  </div>
                  <div className="input-wrapper">
                    <input
                      id="field-heart-rate"
                      type="number"
                      step="1"
                      min="40"
                      max="180"
                      placeholder="e.g. 82"
                      value={formData.heart_rate}
                      onChange={(e) => handleInputChange('heart_rate', e.target.value)}
                      className={`form-input ${errors.heart_rate ? 'has-error' : ''}`}
                      aria-invalid={!!errors.heart_rate}
                      aria-describedby={errors.heart_rate ? 'err-heart-rate' : 'help-heart-rate'}
                    />
                  </div>
                  <span id="help-heart-rate" className="field-helper">Typical resting pulse (50-100 bpm)</span>
                  {errors.heart_rate && (
                    <span id="err-heart-rate" className="field-error-msg" role="alert">
                      {errors.heart_rate}
                    </span>
                  )}
                </div>

                {/* 8. systolic_bp */}
                <div className="field-container">
                  <div className="field-label-row">
                    <label htmlFor="field-systolic" className="field-label">
                      Systolic Blood Pressure <span className="required-mark">*</span>
                    </label>
                    <span className="field-unit">mmHg</span>
                  </div>
                  <div className="input-wrapper">
                    <input
                      id="field-systolic"
                      type="number"
                      step="1"
                      min="70"
                      max="240"
                      placeholder="e.g. 145"
                      value={formData.systolic_bp}
                      onChange={(e) => handleInputChange('systolic_bp', e.target.value)}
                      className={`form-input ${errors.systolic_bp ? 'has-error' : ''}`}
                      aria-invalid={!!errors.systolic_bp}
                      aria-describedby={errors.systolic_bp ? 'err-systolic' : 'help-systolic'}
                    />
                  </div>
                  <span id="help-systolic" className="field-helper">Normal (&lt;120), Elevated (120-129), High (&ge;130)</span>
                  {errors.systolic_bp && (
                    <span id="err-systolic" className="field-error-msg" role="alert">
                      {errors.systolic_bp}
                    </span>
                  )}
                </div>

                {/* 9. diastolic_bp */}
                <div className="field-container">
                  <div className="field-label-row">
                    <label htmlFor="field-diastolic" className="field-label">
                      Diastolic Blood Pressure <span className="required-mark">*</span>
                    </label>
                    <span className="field-unit">mmHg</span>
                  </div>
                  <div className="input-wrapper">
                    <input
                      id="field-diastolic"
                      type="number"
                      step="1"
                      min="40"
                      max="140"
                      placeholder="e.g. 92"
                      value={formData.diastolic_bp}
                      onChange={(e) => handleInputChange('diastolic_bp', e.target.value)}
                      className={`form-input ${errors.diastolic_bp ? 'has-error' : ''}`}
                      aria-invalid={!!errors.diastolic_bp}
                      aria-describedby={errors.diastolic_bp ? 'err-diastolic' : 'help-diastolic'}
                    />
                  </div>
                  <span id="help-diastolic" className="field-helper">Normal (&lt;80), Stage 1 (80-89), Stage 2 (&ge;90)</span>
                  {errors.diastolic_bp && (
                    <span id="err-diastolic" className="field-error-msg" role="alert">
                      {errors.diastolic_bp}
                    </span>
                  )}
                </div>

                {/* 10. blood_pressure (Baseline metric in warehouse dataset) */}
                <div className="field-container">
                  <div className="field-label-row">
                    <label htmlFor="field-bp" className="field-label">
                      Baseline Blood Pressure Metric <span className="required-mark">*</span>
                    </label>
                    <span className="field-unit">mmHg</span>
                  </div>
                  <div className="input-wrapper">
                    <input
                      id="field-bp"
                      type="number"
                      step="1"
                      min="90"
                      max="220"
                      placeholder="e.g. 145"
                      value={formData.blood_pressure}
                      onChange={(e) => handleInputChange('blood_pressure', e.target.value)}
                      className={`form-input ${errors.blood_pressure ? 'has-error' : ''}`}
                      aria-invalid={!!errors.blood_pressure}
                      aria-describedby={errors.blood_pressure ? 'err-bp' : 'help-bp'}
                    />
                  </div>
                  <span id="help-bp" className="field-helper">General clinical baseline BP (dataset mean ~149.8 mmHg)</span>
                  {errors.blood_pressure && (
                    <span id="err-bp" className="field-error-msg" role="alert">
                      {errors.blood_pressure}
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* Section 4: Lipid Profile Indicators */}
            <section className="form-section-card" aria-labelledby="section-lipids">
              <div className="form-section-header">
                <div className="section-icon-badge" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 3" />
                  </svg>
                </div>
                <div>
                  <h2 id="section-lipids">4. Lipid Profile Indicators</h2>
                  <p>Cholesterol fractions and serum triglycerides.</p>
                </div>
              </div>

              <div className="form-grid">
                {/* 11. ldl */}
                <div className="field-container">
                  <div className="field-label-row">
                    <label htmlFor="field-ldl" className="field-label">
                      LDL Cholesterol <span className="required-mark">*</span>
                    </label>
                    <span className="field-unit">mg/dL</span>
                  </div>
                  <div className="input-wrapper">
                    <input
                      id="field-ldl"
                      type="number"
                      step="1"
                      min="40"
                      max="300"
                      placeholder="e.g. 150"
                      value={formData.ldl}
                      onChange={(e) => handleInputChange('ldl', e.target.value)}
                      className={`form-input ${errors.ldl ? 'has-error' : ''}`}
                      aria-invalid={!!errors.ldl}
                      aria-describedby={errors.ldl ? 'err-ldl' : 'help-ldl'}
                    />
                  </div>
                  <span id="help-ldl" className="field-helper">Optimal (&lt;100), Borderline (130-159), High (&ge;160)</span>
                  {errors.ldl && (
                    <span id="err-ldl" className="field-error-msg" role="alert">
                      {errors.ldl}
                    </span>
                  )}
                </div>

                {/* 12. hdl */}
                <div className="field-container">
                  <div className="field-label-row">
                    <label htmlFor="field-hdl" className="field-label">
                      HDL Cholesterol <span className="required-mark">*</span>
                    </label>
                    <span className="field-unit">mg/dL</span>
                  </div>
                  <div className="input-wrapper">
                    <input
                      id="field-hdl"
                      type="number"
                      step="1"
                      min="15"
                      max="120"
                      placeholder="e.g. 42"
                      value={formData.hdl}
                      onChange={(e) => handleInputChange('hdl', e.target.value)}
                      className={`form-input ${errors.hdl ? 'has-error' : ''}`}
                      aria-invalid={!!errors.hdl}
                      aria-describedby={errors.hdl ? 'err-hdl' : 'help-hdl'}
                    />
                  </div>
                  <span id="help-hdl" className="field-helper">Low risk (&gt;50 mg/dL), High risk (&lt;40 mg/dL)</span>
                  {errors.hdl && (
                    <span id="err-hdl" className="field-error-msg" role="alert">
                      {errors.hdl}
                    </span>
                  )}
                </div>

                {/* 13. triglycerides */}
                <div className="field-container">
                  <div className="field-label-row">
                    <label htmlFor="field-triglycerides" className="field-label">
                      Triglycerides <span className="required-mark">*</span>
                    </label>
                    <span className="field-unit">mg/dL</span>
                  </div>
                  <div className="input-wrapper">
                    <input
                      id="field-triglycerides"
                      type="number"
                      step="1"
                      min="30"
                      max="600"
                      placeholder="e.g. 190"
                      value={formData.triglycerides}
                      onChange={(e) => handleInputChange('triglycerides', e.target.value)}
                      className={`form-input ${errors.triglycerides ? 'has-error' : ''}`}
                      aria-invalid={!!errors.triglycerides}
                      aria-describedby={errors.triglycerides ? 'err-triglycerides' : 'help-triglycerides'}
                    />
                  </div>
                  <span id="help-triglycerides" className="field-helper">Normal (&lt;150), Borderline (150-199), High (&ge;200)</span>
                  {errors.triglycerides && (
                    <span id="err-triglycerides" className="field-error-msg" role="alert">
                      {errors.triglycerides}
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* Section 5: Lifestyle and Other Health Indicators */}
            <section className="form-section-card" aria-labelledby="section-lifestyle">
              <div className="form-section-header">
                <div className="section-icon-badge" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                    <line x1="6" y1="1" x2="6" y2="4" />
                    <line x1="10" y1="1" x2="10" y2="4" />
                    <line x1="14" y1="1" x2="14" y2="4" />
                  </svg>
                </div>
                <div>
                  <h2 id="section-lifestyle">5. Lifestyle Indicators</h2>
                  <p>Dietary sodium consumption and alcohol intake metrics.</p>
                </div>
              </div>

              <div className="form-grid">
                {/* 14. alcohol_intake */}
                <div className="field-container">
                  <div className="field-label-row">
                    <label htmlFor="field-alcohol" className="field-label">
                      Alcohol Intake Metric <span className="required-mark">*</span>
                    </label>
                    <span className="field-unit">units/week</span>
                  </div>
                  <div className="input-wrapper">
                    <input
                      id="field-alcohol"
                      type="number"
                      step="0.5"
                      min="0"
                      max="30"
                      placeholder="e.g. 10.0"
                      value={formData.alcohol_intake}
                      onChange={(e) => handleInputChange('alcohol_intake', e.target.value)}
                      className={`form-input ${errors.alcohol_intake ? 'has-error' : ''}`}
                      aria-invalid={!!errors.alcohol_intake}
                      aria-describedby={errors.alcohol_intake ? 'err-alcohol' : 'help-alcohol'}
                    />
                  </div>
                  <span id="help-alcohol" className="field-helper">Weekly alcohol consumption scale (0 to 30 units/week)</span>
                  {errors.alcohol_intake && (
                    <span id="err-alcohol" className="field-error-msg" role="alert">
                      {errors.alcohol_intake}
                    </span>
                  )}
                </div>

                {/* 15. salt_intake */}
                <div className="field-container">
                  <div className="field-label-row">
                    <label htmlFor="field-salt" className="field-label">
                      Salt Intake Metric <span className="required-mark">*</span>
                    </label>
                    <span className="field-unit">g/day</span>
                  </div>
                  <div className="input-wrapper">
                    <input
                      id="field-salt"
                      type="number"
                      step="0.5"
                      min="1.0"
                      max="20.0"
                      placeholder="e.g. 8.0"
                      value={formData.salt_intake}
                      onChange={(e) => handleInputChange('salt_intake', e.target.value)}
                      className={`form-input ${errors.salt_intake ? 'has-error' : ''}`}
                      aria-invalid={!!errors.salt_intake}
                      aria-describedby={errors.salt_intake ? 'err-salt' : 'help-salt'}
                    />
                  </div>
                  <span id="help-salt" className="field-helper">Daily dietary sodium score (dataset range: 2 to 15 g/day)</span>
                  {errors.salt_intake && (
                    <span id="err-salt" className="field-error-msg" role="alert">
                      {errors.salt_intake}
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* Bottom Actions Bar */}
            <div className="form-actions-bar">
              <div>
                {showClearConfirm ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#e53e3e', fontWeight: 600 }}>Reset all inputs?</span>
                    <button
                      type="button"
                      onClick={handleClearForm}
                      style={{
                        background: '#dc2626',
                        color: '#ffffff',
                        border: 'none',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                      id="confirm-clear-btn"
                    >
                      Yes, Clear
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowClearConfirm(false)}
                      style={{
                        background: '#f1f5f9',
                        color: '#475569',
                        border: 'none',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn-clear"
                    onClick={() => setShowClearConfirm(true)}
                    id="clear-form-btn"
                  >
                    Clear Form
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="btn-review"
                id="review-assessment-btn"
              >
                Review Assessment
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
