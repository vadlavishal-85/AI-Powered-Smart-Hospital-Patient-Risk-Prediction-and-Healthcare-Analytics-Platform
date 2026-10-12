import React, { useState } from 'react';
import './LandingPage.css';

const CURRENT_YEAR = 2026;

/**
 * Premium Light-Themed Hospital Landing Page
 * Module 2 Implementation: AI Patient Risk Assessment System
 *
 * @param {Object} props
 * @param {Function} props.onStartAssessment - Navigation callback invoked when user clicks "Explore Assessment"
 */
export default function LandingPage({ onStartAssessment }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAssessmentClick = () => {
    setMobileMenuOpen(false);
    if (typeof onStartAssessment === 'function') {
      onStartAssessment();
    }
  };

  return (
    <div className="landing-page-root">
      {/* 1. Responsive Navigation Bar */}
      <header className="landing-nav" role="banner">
        <div className="landing-container">
          <div className="nav-inner">
            {/* Brand Logo & Name */}
            <button
              type="button"
              className="nav-brand"
              onClick={() => scrollToSection('hero')}
              aria-label="Patient Risk Assessment Home"
            >
              <div className="brand-icon-wrapper" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M2 12h20" />
                  <path d="M5 5l14 14" opacity="0.35" />
                </svg>
              </div>
              <span className="brand-name">Patient Risk Assessment</span>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="desktop-nav" aria-label="Main Navigation">
              <ul className="nav-menu">
                <li>
                  <button
                    type="button"
                    className="nav-link"
                    onClick={() => scrollToSection('hero')}
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="nav-link"
                    onClick={() => scrollToSection('about')}
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="nav-link"
                    onClick={() => scrollToSection('disclaimer')}
                  >
                    Medical Disclaimer
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleAssessmentClick}
                    id="nav-explore-btn"
                  >
                    Explore Assessment
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </li>
              </ul>
            </nav>

            {/* Mobile Navigation Toggle */}
            <button
              type="button"
              className="mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-menu-drawer" role="navigation" aria-label="Mobile Navigation">
            <button
              type="button"
              className="nav-link"
              onClick={() => scrollToSection('hero')}
            >
              Home
            </button>
            <button
              type="button"
              className="nav-link"
              onClick={() => scrollToSection('about')}
            >
              About
            </button>
            <button
              type="button"
              className="nav-link"
              onClick={() => scrollToSection('disclaimer')}
            >
              Medical Disclaimer
            </button>
            <button
              type="button"
              className="btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
              onClick={handleAssessmentClick}
            >
              Explore Assessment
            </button>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main id="main-content">
        {/* 2. Hospital-Themed Hero Section */}
        <section id="hero" className="hero-section" aria-labelledby="hero-heading">
          <div className="hero-overlay" aria-hidden="true" />
          <div className="landing-container hero-inner">
            <div className="hero-card">
              <div className="hero-badge">
                <span className="hero-badge-dot" aria-hidden="true" />
                <span>AI-POWERED HEALTHCARE INSIGHTS</span>
              </div>

              <h1 id="hero-heading" className="hero-title">
                Smarter Insights for Better Health
              </h1>

              <p className="hero-description">
                Explore a machine-learning-based assessment of patient health indicators and
                multi-disease risk patterns to support informed healthcare discussions.
              </p>

              <div className="hero-cta-group">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleAssessmentClick}
                  id="hero-explore-btn"
                >
                  Explore Assessment
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => scrollToSection('about')}
                  id="hero-learn-more-btn"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Feature Highlights Section */}
        <section id="features" className="features-section" aria-labelledby="features-heading">
          <div className="landing-container">
            <div className="section-header">
              <span className="section-label">Core Capabilities</span>
              <h2 id="features-heading" className="section-title">
                Multi-Risk Intelligence & Health Analysis
              </h2>
              <p className="section-subtitle">
                Built to provide structured, objective analysis across key patient indicators.
              </p>
            </div>

            <div className="features-grid">
              {/* Feature 1 */}
              <article className="feature-card">
                <div className="feature-icon-wrapper" aria-hidden="true">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </div>
                <h3 className="feature-title">Multi-Disease Assessment</h3>
                <p className="feature-description">
                  The model is designed to classify eight disease-combination categories using
                  patient health indicators.
                </p>
              </article>

              {/* Feature 2 */}
              <article className="feature-card">
                <div className="feature-icon-wrapper" aria-hidden="true">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                </div>
                <h3 className="feature-title">Data-Driven Analysis</h3>
                <p className="feature-description">
                  Machine learning is used to analyze patterns in health-related features.
                </p>
              </article>

              {/* Feature 3 */}
              <article className="feature-card">
                <div className="feature-icon-wrapper" aria-hidden="true">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <h3 className="feature-title">Health Awareness</h3>
                <p className="feature-description">
                  The output may support informed discussions with qualified healthcare
                  professionals.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* 4. About Section */}
        <section id="about" className="about-section" aria-labelledby="about-heading">
          <div className="landing-container">
            <div className="about-card">
              <div className="about-header">
                <span className="section-label">About the Initiative</span>
                <h2 id="about-heading" className="about-title">
                  Healthcare Insights, Made Simpler
                </h2>
                <p className="about-lead">
                  This project explores how machine learning can analyze patient health
                  indicators and classify possible multi-disease patterns. It is intended for
                  educational research and decision-support exploration.
                </p>
              </div>

              <div className="about-pillars">
                <div className="pillar-item">
                  <div className="pillar-bullet" aria-hidden="true">✓</div>
                  <div className="pillar-text">
                    <h4>Multi-Indicator Synthesis</h4>
                    <p>Correlating vital signs, metabolic values, and behavioral metrics.</p>
                  </div>
                </div>

                <div className="pillar-item">
                  <div className="pillar-bullet" aria-hidden="true">✓</div>
                  <div className="pillar-text">
                    <h4>Clinical Decision Support</h4>
                    <p>Designed to complement medical discussions rather than automate care.</p>
                  </div>
                </div>

                <div className="pillar-item">
                  <div className="pillar-bullet" aria-hidden="true">✓</div>
                  <div className="pillar-text">
                    <h4>Research & Education</h4>
                    <p>Promoting transparent, ethical exploration of preventative ML modeling.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Medical Disclaimer Section */}
        <section id="disclaimer" className="disclaimer-section" aria-labelledby="disclaimer-heading">
          <div className="landing-container">
            <div className="disclaimer-box">
              <div className="disclaimer-icon-wrapper" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div>
                <h3 id="disclaimer-heading" className="disclaimer-title">
                  Medical & Research Disclaimer
                </h3>
                <p className="disclaimer-text">
                  This machine learning system is intended for research and decision-support
                  purposes only. Its output is not a medical diagnosis and must not replace
                  evaluation by a qualified healthcare professional.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 6. Light-Themed Footer */}
      <footer className="landing-footer" role="contentinfo">
        <div className="landing-container">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="nav-brand" style={{ padding: 0 }}>
                <div className="brand-icon-wrapper" style={{ width: '32px', height: '32px' }} aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M2 12h20" />
                  </svg>
                </div>
                <span className="brand-name" style={{ fontSize: '1.05rem' }}>
                  Patient Risk Assessment
                </span>
              </div>
              <p className="footer-description" style={{ marginTop: '0.75rem' }}>
                An educational clinical decision-support and health risk assessment prototype
                exploring multi-disease pattern classification.
              </p>
            </div>

            <div className="footer-links-group">
              <div>
                <h4 className="footer-column-title">Navigation</h4>
                <ul className="footer-nav">
                  <li>
                    <button
                      type="button"
                      className="footer-link"
                      onClick={() => scrollToSection('hero')}
                    >
                      Home
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="footer-link"
                      onClick={() => scrollToSection('about')}
                    >
                      About
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="footer-link"
                      onClick={() => scrollToSection('disclaimer')}
                    >
                      Medical Disclaimer
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="footer-column-title">Module Workflow</h4>
                <ul className="footer-nav">
                  <li>
                    <button
                      type="button"
                      className="footer-link"
                      onClick={handleAssessmentClick}
                    >
                      Explore Assessment
                    </button>
                  </li>
                  <li>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-steel-blue)' }}>
                      Module 2: Landing Page
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>
              &copy; {CURRENT_YEAR} Patient Risk Assessment. Research and decision-support prototype.
            </p>
            <p>
              Light Clinical Aesthetic &bull; Accessibility Tested
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
