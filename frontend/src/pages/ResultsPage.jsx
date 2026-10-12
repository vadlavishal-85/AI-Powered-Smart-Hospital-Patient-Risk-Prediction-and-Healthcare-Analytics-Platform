import React, { useState } from 'react';
import './ResultsPage.css';
import { getAllDiseaseClasses, getDiseaseClassInfo } from '../utils/diseaseClassMapping';

/**
 * Patient Risk Assessment Results Page
 * Module 5 Implementation: Real ML Inference Integration
 *
 * @param {Object} props
 * @param {Object} props.patientData - The structured 15-feature model input object
 * @param {Object} [props.predictionResult] - Actual prediction returned by the trained model
 * @param {Function} props.onEditAssessment - Callback to return to the assessment form with values preserved
 * @param {Function} props.onNewAssessment - Callback to start a fresh assessment (clearing state)
 * @param {Function} props.onReturnHome - Callback to return to the landing page
 */
export default function ResultsPage({
  patientData,
  predictionResult,
  onEditAssessment,
  onNewAssessment,
  onReturnHome,
}) {
  const [showNewConfirm, setShowNewConfirm] = useState(false);
  const diseaseClasses = getAllDiseaseClasses();

  // If page is accessed without submitted patient data
  if (!patientData) {
    return (
      <div className="results-root">
        <header className="results-header-bar" role="banner">
          <div className="results-header-inner">
            <button type="button" className="results-brand" onClick={onReturnHome}>
              <div className="results-brand-icon">+</div>
              <span className="results-brand-title">Patient Risk Assessment</span>
            </button>
          </div>
        </header>

        <main className="results-main">
          <div className="results-card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'var(--color-ice-blue, #EAF6FF)',
                color: 'var(--color-primary-blue, #2B6CB0)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
              }}
              aria-hidden="true"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h1 style={{ fontSize: '1.75rem', color: 'var(--color-text-heading, #1E3A8A)', marginBottom: '0.75rem' }}>
              No Assessment Data Available
            </h1>
            <p style={{ maxWidth: '520px', margin: '0 auto 2rem auto', color: 'var(--color-text-body, #4A5568)' }}>
              No patient data was found in the current session. Please complete the 15-feature clinical intake
              assessment to generate structured results.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button type="button" className="btn-primary-action" onClick={onNewAssessment}>
                Start New Assessment
              </button>
              <button type="button" className="btn-secondary-action" onClick={onReturnHome}>
                Back to Home
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const isAgeExceedingTrainingMax = patientData.age > 89;
  const isPredictionAvailable = Boolean(predictionResult && predictionResult.predicted_class);

  // Extract class info if available
  const predictedInfo = isPredictionAvailable
    ? getDiseaseClassInfo(predictionResult.predicted_class)
    : null;

  // Sort model probabilities descending
  const sortedProbabilities = isPredictionAvailable && predictionResult.class_probabilities
    ? Object.entries(predictionResult.class_probabilities)
        .sort(([, a], [, b]) => b - a)
    : [];

  return (
    <div className="results-root">
      {/* =====================================================================
          Section A: Page Header Bar
          ===================================================================== */}
      <header className="results-header-bar" role="banner">
        <div className="results-header-inner">
          <button
            type="button"
            className="results-brand"
            onClick={onReturnHome}
            aria-label="Return to Home"
          >
            <div className="results-brand-icon" aria-hidden="true">+</div>
            <span className="results-brand-title">Patient Risk Assessment</span>
          </button>

          {/* Model Status Indicator */}
          {isPredictionAvailable ? (
            <div className="results-status-pill ready" role="status" aria-label="Model Prediction Status">
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} aria-hidden="true" />
              <span>Model Prediction Active (Trained Random Forest)</span>
            </div>
          ) : (
            <div className="results-status-pill pending" role="status" aria-label="Model Prediction Status">
              <span className="status-pulse-dot" aria-hidden="true" />
              <span>Prediction Engine: Model Not Connected</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="results-main" id="main-content">
        {/* Page Intro Header */}
        <div className="results-title-section">
          <h1>Patient Risk Assessment Results</h1>
          <p>
            This page presents the outcome of the machine learning assessment evaluated across
            15 verified physiological and lifestyle indicators using the trained Random Forest multiclass model.
          </p>
        </div>

        {/* =====================================================================
            Section C: Prediction Summary (Real Prediction or Honest Pending State)
            ===================================================================== */}
        <section className="results-card" aria-labelledby="section-prediction-title">
          <div className="results-card-header">
            <div className="results-card-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <div>
              <h2 id="section-prediction-title">Machine Learning Risk Classification</h2>
              <p>Multiclass predictive assessment across diabetes, hypertension, and heart disease.</p>
            </div>
          </div>

          {isPredictionAvailable ? (
            <div>
              {/* Active Prediction Banner */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
                  border: '1px solid #bbf7d0',
                  borderLeft: '4px solid #10b981',
                  borderRadius: '12px',
                  padding: '1.75rem',
                  marginBottom: '2rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span
                      style={{
                        background: '#dcfce7',
                        color: '#15803d',
                        border: '1px solid #86efac',
                        padding: '0.3rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      Predicted Class: {predictionResult.predicted_class}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                      Category: {predictionResult.disease_category}
                    </span>
                  </div>

                  <span style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 600 }}>
                    15-Feature Random Forest Inference Verified
                  </span>
                </div>

                <h3 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--color-text-heading, #1E3A8A)', marginBottom: '0.5rem' }}>
                  {predictionResult.disease_name}
                </h3>

                <p style={{ fontSize: '1rem', color: 'var(--color-text-body, #4A5568)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  {predictionResult.disease_description}
                </p>

                {/* Preprocessing Notes if any */}
                {predictionResult.preprocessing_notes && predictionResult.preprocessing_notes.length > 0 && (
                  <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '0.75rem 1rem', marginTop: '0.75rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#b45309', marginBottom: '0.25rem' }}>
                      Preprocessing Observation:
                    </div>
                    {predictionResult.preprocessing_notes.map((note, idx) => (
                      <div key={idx} style={{ fontSize: '0.8rem', color: '#92400e' }}>
                        &bull; {note}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Model Probabilities Section */}
              {sortedProbabilities.length > 0 && (
                <div style={{ marginBottom: '2.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-heading, #1E3A8A)', marginBottom: '0.4rem' }}>
                    Model-Estimated Class Probabilities (Ensemble Vote Confidence)
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-steel-blue, #527A91)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                    These probabilities represent <strong>model-estimated class probabilities</strong> derived from the proportion
                    of ensemble decision trees (100 estimators) voting for each disease category. They reflect computational
                    model confidence and are <em>not calibrated epidemiological clinical risk percentages or medical diagnoses</em>.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
                    {sortedProbabilities.map(([clsCode, probVal]) => {
                      const classMeta = getDiseaseClassInfo(clsCode);
                      const isPredicted = clsCode === predictionResult.predicted_class;
                      return (
                        <div
                          key={clsCode}
                          style={{
                            background: isPredicted ? '#f0fdf4' : '#ffffff',
                            border: isPredicted ? '2px solid #86efac' : '1px solid var(--color-border, #D8EBF7)',
                            borderRadius: '10px',
                            padding: '0.85rem 1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.35rem',
                            boxShadow: isPredicted ? '0 2px 8px rgba(16, 185, 129, 0.15)' : 'none',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontFamily: 'Consolas, monospace', fontSize: '0.8rem', fontWeight: 700, color: '#1E3A8A' }}>
                              {clsCode}
                            </span>
                            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: isPredicted ? '#15803d' : '#1e293b' }}>
                              {probVal.toFixed(1)}%
                            </span>
                          </div>

                          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
                            {classMeta.shortName || classMeta.name}
                          </div>

                          {/* Mini Progress Bar */}
                          <div style={{ height: '6px', width: '100%', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden', marginTop: '0.2rem' }}>
                            <div
                              style={{
                                height: '100%',
                                width: `${Math.min(100, Math.max(0, probVal))}%`,
                                background: isPredicted ? '#10b981' : '#65BDB3',
                                borderRadius: '9999px',
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Honest Pending State when Model is Not Connected */
            <div className="prediction-pending-banner">
              <div className="prediction-pending-header">
                <span className="prediction-pending-badge">Status</span>
                <h3 className="prediction-pending-title">Prediction Not Available Yet</h3>
              </div>
              <p className="prediction-pending-text">
                The 15 submitted clinical indicators have been validated and structured in memory.
                However, the trained machine learning model has not yet been connected to this results page.
              </p>

              <ul className="prediction-transparency-list">
                <li className="prediction-transparency-item">
                  <span className="transparency-bullet" aria-hidden="true">✓</span>
                  <span>
                    <strong>No fabricated predictions:</strong> This platform does not generate synthetic risk scores,
                    artificial probabilities, or placeholder disease diagnoses.
                  </span>
                </li>
                <li className="prediction-transparency-item">
                  <span className="transparency-bullet" aria-hidden="true">✓</span>
                  <span>
                    <strong>Trained Architecture:</strong> The backend model is a 15-feature Random Forest Classifier
                    trained on 278,701 balanced records, designed to classify 8 distinct disease combination categories.
                  </span>
                </li>
                <li className="prediction-transparency-item">
                  <span className="transparency-bullet" aria-hidden="true">✓</span>
                  <span>
                    <strong>Inference Integration:</strong> Authentic model execution will be connected to provide
                    genuine multiclass classification and probability distributions.
                  </span>
                </li>
              </ul>
            </div>
          )}

          {/* =====================================================================
              Section D: Disease Class Architecture Reference
              ===================================================================== */}
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-heading, #1E3A8A)', marginBottom: '0.4rem' }}>
              Supported Disease Classification Architecture
            </h3>
            <p className="disease-classes-intro">
              The trained multiclass classification pipeline supports the following eight verified target categories
              (source of truth: <code>FINALMLPROJECT COMPLETE.ipynb</code>).
              {isPredictionAvailable && predictedInfo && (
                <span style={{ fontWeight: 600, color: '#15803d', display: 'block', marginTop: '0.25rem' }}>
                  Model Prediction Match: {predictedInfo.code} ({predictedInfo.name}).
                </span>
              )}
            </p>

            <div className="disease-classes-grid">
              {diseaseClasses.map((item) => {
                const isSelected = isPredictionAvailable && predictionResult.predicted_class === item.code;
                return (
                  <div
                    key={item.code}
                    className="disease-class-card"
                    style={{
                      border: isSelected ? '2px solid #10b981' : '1px solid var(--color-border, #D8EBF7)',
                      background: isSelected ? '#f0fdf4' : '#ffffff',
                    }}
                  >
                    <div className="disease-class-header">
                      <span className="disease-code-pill">{item.code}</span>
                      <span className="disease-category-tag">{item.category}</span>
                    </div>
                    <div className="disease-class-name">
                      {item.name} {isSelected && '✓'}
                    </div>
                    <div className="disease-class-desc">{item.description}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================================
            Section B: Assessment Summary (Organized 15 Features)
            ===================================================================== */}
        <section className="results-card" aria-labelledby="section-summary-title">
          <div className="results-card-header">
            <div className="results-card-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div>
              <h2 id="section-summary-title">Submitted Clinical Assessment Summary</h2>
              <p>The 15 physiological and behavioral indicators prepared for model evaluation.</p>
            </div>
          </div>

          <div className="summary-groups-grid">
            {/* Group 1: Patient Profile */}
            <div className="summary-group-box">
              <h3 className="summary-group-title">
                <span>👤</span> 1. Patient Profile &amp; Biometrics
              </h3>
              <div className="summary-items-grid">
                <div className="summary-item-card">
                  <div className="summary-item-label">
                    <span>Patient Age</span>
                    <span className="summary-item-key">age</span>
                  </div>
                  <div className="summary-item-value">{patientData.age}</div>
                  <div className="summary-item-unit">years</div>
                </div>

                <div className="summary-item-card">
                  <div className="summary-item-label">
                    <span>Normalized Age</span>
                    <span className="summary-item-key">age_normalized</span>
                  </div>
                  <div className="summary-item-value" style={{ color: '#0d9488' }}>
                    {patientData.age_normalized}
                  </div>
                  <div className="summary-item-unit">formula: (age - 2) / 87</div>
                  {isAgeExceedingTrainingMax && (
                    <div className="discrepancy-note">
                      Note: Age exceeds training dataset maximum (89 years). Resulting age_normalized &gt; 1.0.
                    </div>
                  )}
                </div>

                <div className="summary-item-card">
                  <div className="summary-item-label">
                    <span>Body Mass Index</span>
                    <span className="summary-item-key">bmi</span>
                  </div>
                  <div className="summary-item-value">{patientData.bmi}</div>
                  <div className="summary-item-unit">kg/m²</div>
                </div>
              </div>
            </div>

            {/* Group 2: Glucose and Diabetes Indicators */}
            <div className="summary-group-box">
              <h3 className="summary-group-title">
                <span>🩸</span> 2. Glucose &amp; Diabetes Indicators
              </h3>
              <div className="summary-items-grid">
                <div className="summary-item-card">
                  <div className="summary-item-label">
                    <span>Blood Glucose</span>
                    <span className="summary-item-key">glucose</span>
                  </div>
                  <div className="summary-item-value">{patientData.glucose}</div>
                  <div className="summary-item-unit">mg/dL</div>
                </div>

                <div className="summary-item-card">
                  <div className="summary-item-label">
                    <span>HbA1c Level</span>
                    <span className="summary-item-key">HbA1c_level</span>
                  </div>
                  <div className="summary-item-value">{patientData.HbA1c_level}</div>
                  <div className="summary-item-unit">%</div>
                </div>
              </div>
            </div>

            {/* Group 3: Blood Pressure & Cardiovascular Indicators */}
            <div className="summary-group-box">
              <h3 className="summary-group-title">
                <span>❤️</span> 3. Blood Pressure &amp; Cardiovascular Indicators
              </h3>
              <div className="summary-items-grid">
                <div className="summary-item-card">
                  <div className="summary-item-label">
                    <span>High BP Diagnosis</span>
                    <span className="summary-item-key">high_blood_pressure_Yes</span>
                  </div>
                  <div className="summary-item-value">
                    {patientData.high_blood_pressure_Yes === 1 ? 'Yes (1)' : 'No (0)'}
                  </div>
                  <div className="summary-item-unit">binary dummy flag</div>
                </div>

                <div className="summary-item-card">
                  <div className="summary-item-label">
                    <span>Systolic BP</span>
                    <span className="summary-item-key">systolic_bp</span>
                  </div>
                  <div className="summary-item-value">{patientData.systolic_bp}</div>
                  <div className="summary-item-unit">mmHg</div>
                </div>

                <div className="summary-item-card">
                  <div className="summary-item-label">
                    <span>Diastolic BP</span>
                    <span className="summary-item-key">diastolic_bp</span>
                  </div>
                  <div className="summary-item-value">{patientData.diastolic_bp}</div>
                  <div className="summary-item-unit">mmHg</div>
                </div>

                <div className="summary-item-card">
                  <div className="summary-item-label">
                    <span>Baseline BP Metric</span>
                    <span className="summary-item-key">blood_pressure</span>
                  </div>
                  <div className="summary-item-value">{patientData.blood_pressure}</div>
                  <div className="summary-item-unit">mmHg</div>
                </div>

                <div className="summary-item-card">
                  <div className="summary-item-label">
                    <span>Resting Heart Rate</span>
                    <span className="summary-item-key">heart_rate</span>
                  </div>
                  <div className="summary-item-value">{patientData.heart_rate}</div>
                  <div className="summary-item-unit">bpm</div>
                </div>
              </div>
            </div>

            {/* Group 4: Lifestyle and Lipid Health Indicators */}
            <div className="summary-group-box">
              <h3 className="summary-group-title">
                <span>🥗</span> 4. Lifestyle &amp; Lipid Indicators
              </h3>
              <div className="summary-items-grid">
                <div className="summary-item-card">
                  <div className="summary-item-label">
                    <span>LDL Cholesterol</span>
                    <span className="summary-item-key">ldl</span>
                  </div>
                  <div className="summary-item-value">{patientData.ldl}</div>
                  <div className="summary-item-unit">mg/dL</div>
                </div>

                <div className="summary-item-card">
                  <div className="summary-item-label">
                    <span>HDL Cholesterol</span>
                    <span className="summary-item-key">hdl</span>
                  </div>
                  <div className="summary-item-value">{patientData.hdl}</div>
                  <div className="summary-item-unit">mg/dL</div>
                </div>

                <div className="summary-item-card">
                  <div className="summary-item-label">
                    <span>Triglycerides</span>
                    <span className="summary-item-key">triglycerides</span>
                  </div>
                  <div className="summary-item-value">{patientData.triglycerides}</div>
                  <div className="summary-item-unit">mg/dL</div>
                </div>

                <div className="summary-item-card">
                  <div className="summary-item-label">
                    <span>Alcohol Intake Metric</span>
                    <span className="summary-item-key">alcohol_intake</span>
                  </div>
                  <div className="summary-item-value">{patientData.alcohol_intake}</div>
                  <div className="summary-item-unit">units/week</div>
                </div>

                <div className="summary-item-card">
                  <div className="summary-item-label">
                    <span>Salt Intake Metric</span>
                    <span className="summary-item-key">salt_intake</span>
                  </div>
                  <div className="summary-item-value">{patientData.salt_intake}</div>
                  <div className="summary-item-unit">g/day</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            Section E: Precautions and Health Guidance
            ===================================================================== */}
        <section className="results-card" aria-labelledby="section-guidance-title">
          <div className="results-card-header">
            <div className="results-card-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <h2 id="section-guidance-title">Clinical Guidance &amp; Precautions</h2>
              <p>Evidence-informed discussion support principles.</p>
            </div>
          </div>

          <div className="guidance-banner">
            <div className="guidance-icon-box" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </div>
            <div className="guidance-content">
              {isPredictionAvailable ? (
                <>
                  <h3>Health Discussion Guide: {predictionResult.disease_name}</h3>
                  <p>
                    Based on the machine learning classification (Class: <strong>{predictionResult.predicted_class}</strong>),
                    the following clinical areas may warrant discussion with a healthcare provider:
                  </p>
                  <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem', color: '#334155', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {predictionResult.predicted_class.includes('DI') && (
                      <li>
                        <strong>Metabolic &amp; Glycemic Care:</strong> Regular fasting blood glucose checks, HbA1c review, and dietary carbohydrate counseling.
                      </li>
                    )}
                    {predictionResult.predicted_class.includes('HY') && (
                      <li>
                        <strong>Blood Pressure Management:</strong> Routine arterial blood pressure logging, dietary sodium moderation, and vascular evaluation.
                      </li>
                    )}
                    {predictionResult.predicted_class.includes('HT') && (
                      <li>
                        <strong>Cardiovascular Health:</strong> Comprehensive lipid panel evaluation, resting/exercise cardiac evaluation, and coronary health discussions.
                      </li>
                    )}
                    {predictionResult.predicted_class === 'N' && (
                      <li>
                        <strong>Preventative Wellness:</strong> Maintenance of balanced nutrition, regular aerobic activity, and routine annual wellness monitoring.
                      </li>
                    )}
                  </ul>
                </>
              ) : (
                <>
                  <h3>Category-Specific Guidance Awaiting Model Inference</h3>
                  <p>
                    Personalized health precautions and discussion prompts will be activated once verified
                    model inference is connected.
                  </p>
                </>
              )}

              <div className="guidance-reminder-box">
                <strong>Medical Notice:</strong> This machine learning system is intended for educational research and
                decision-support exploration only. Its output is not a medical diagnosis and must not replace evaluation
                or treatment by a qualified healthcare professional.
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            Section F: Action Buttons Bar
            ===================================================================== */}
        <div className="results-actions-bar">
          <button
            type="button"
            className="btn-secondary-action"
            onClick={onEditAssessment}
            id="results-edit-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit Assessment Values
          </button>

          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-warning-action"
              onClick={() => setShowNewConfirm(true)}
              id="results-new-btn"
            >
              Start New Assessment
            </button>

            <button
              type="button"
              className="btn-primary-action"
              onClick={onReturnHome}
              id="results-home-btn"
            >
              Back to Home
            </button>
          </div>
        </div>
      </main>

      {/* Confirmation Modal for Starting a New Assessment */}
      {showNewConfirm && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-dialog">
            <h3 id="modal-title" className="modal-title">Start a New Assessment?</h3>
            <p className="modal-body">
              Starting a new assessment will clear all currently entered patient values and model results.
              If you want to keep and modify the existing values instead, choose "Edit Assessment".
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn-secondary-action"
                onClick={() => setShowNewConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-warning-action"
                onClick={() => {
                  setShowNewConfirm(false);
                  if (typeof onNewAssessment === 'function') {
                    onNewAssessment();
                  }
                }}
                id="modal-confirm-new-btn"
              >
                Yes, Start New
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
