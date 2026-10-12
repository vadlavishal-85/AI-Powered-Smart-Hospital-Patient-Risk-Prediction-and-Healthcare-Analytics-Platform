import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import AssessmentPage from './pages/AssessmentPage';
import ResultsPage from './pages/ResultsPage';
import { predictPatientRisk } from './services/predictionService';

/**
 * AI Patient Risk Assessment System - Main App Router
 * Module 5: Integrated Real Machine Learning Model Inference
 */
export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [patientData, setPatientData] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleStartAssessment = () => {
    setCurrentView('assessment');
    setApiError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnHome = () => {
    setCurrentView('landing');
    setApiError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitAssessment = async (validatedData) => {
    setIsPredicting(true);
    setApiError(null);
    try {
      const response = await predictPatientRisk(validatedData);
      setPatientData(validatedData);
      setPredictionResult(response);
      setIsPredicting(false);
      setCurrentView('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setIsPredicting(false);
      setApiError(err.message || 'Failed to connect to the machine learning prediction service.');
    }
  };

  const handleEditAssessment = () => {
    setCurrentView('assessment');
    setApiError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewAssessment = () => {
    setPatientData(null);
    setPredictionResult(null);
    setApiError(null);
    setCurrentView('assessment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {currentView === 'landing' && (
        <LandingPage onStartAssessment={handleStartAssessment} />
      )}

      {currentView === 'assessment' && (
        <AssessmentPage
          onReturnHome={handleReturnHome}
          onSubmitAssessment={handleSubmitAssessment}
          initialValues={patientData}
          isSubmitting={isPredicting}
          submissionError={apiError}
          onClearError={() => setApiError(null)}
        />
      )}

      {currentView === 'results' && (
        <ResultsPage
          patientData={patientData}
          predictionResult={predictionResult}
          onEditAssessment={handleEditAssessment}
          onNewAssessment={handleNewAssessment}
          onReturnHome={handleReturnHome}
        />
      )}
    </>
  );
}
