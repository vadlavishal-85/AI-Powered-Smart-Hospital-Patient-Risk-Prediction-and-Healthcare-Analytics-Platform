/**
 * Disease Class Mapping Utility
 *
 * Source of Truth: Verified Target-Label Definitions
 * Target column: df['sublabel']
 * Target classes: ['DI', 'DI_HT', 'DI_HT_HY', 'DI_HY', 'HT', 'HT_HY', 'HY', 'N']
 *
 * Mapping Specifications:
 * - N = Normal / baseline
 * - DI = Type-2 Diabetes Mellitus
 * - HY = Essential Hypertension
 * - HT = Ischemic Heart Disease
 * - DI_HY = Diabetes + Hypertension
 * - DI_HT = Diabetes + Heart Disease
 * - HT_HY = Heart Disease + Hypertension
 * - DI_HT_HY = Diabetes + Heart Disease + Hypertension
 */

export const DISEASE_CLASSES = {
  N: {
    code: 'N',
    name: 'Normal / Baseline',
    shortName: 'Normal',
    category: 'Baseline',
    description: 'No detected chronic disease pattern across diabetes, hypertension, or heart disease markers.',
    colorTheme: '#059669', // Emerald
  },
  DI: {
    code: 'DI',
    name: 'Type-2 Diabetes Mellitus',
    shortName: 'Diabetes',
    category: 'Single Disease',
    description: 'Primary indication of glycemic dysregulation and diabetic metabolic pattern.',
    colorTheme: '#2563eb', // Blue
  },
  HY: {
    code: 'HY',
    name: 'Essential Hypertension',
    shortName: 'Hypertension',
    category: 'Single Disease',
    description: 'Primary indication of persistent arterial pressure elevation and chronic hypertensive risk.',
    colorTheme: '#0891b2', // Cyan
  },
  HT: {
    code: 'HT',
    name: 'Ischemic Heart Disease',
    shortName: 'Heart Disease',
    category: 'Single Disease',
    description: 'Primary indication of coronary/cardiac risk and cardiovascular dysfunction.',
    colorTheme: '#d97706', // Amber
  },
  DI_HY: {
    code: 'DI_HY',
    name: 'Diabetes + Hypertension',
    shortName: 'Diabetes + Hypertension',
    category: 'Dual Co-Morbidity',
    description: 'Co-morbid presentation of Type-2 Diabetes Mellitus and Essential Hypertension.',
    colorTheme: '#7c3aed', // Purple
  },
  DI_HT: {
    code: 'DI_HT',
    name: 'Diabetes + Heart Disease',
    shortName: 'Diabetes + Heart Disease',
    category: 'Dual Co-Morbidity',
    description: 'Co-morbid presentation of Type-2 Diabetes Mellitus and Ischemic Heart Disease.',
    colorTheme: '#c026d3', // Fuchsia
  },
  HT_HY: {
    code: 'HT_HY',
    name: 'Heart Disease + Hypertension',
    shortName: 'Heart Disease + Hypertension',
    category: 'Dual Co-Morbidity',
    description: 'Co-morbid presentation of Ischemic Heart Disease and Essential Hypertension.',
    colorTheme: '#ea580c', // Orange
  },
  DI_HT_HY: {
    code: 'DI_HT_HY',
    name: 'Diabetes + Heart Disease + Hypertension',
    shortName: 'Tri-Morbidity (All Three)',
    category: 'Tri-Morbidity',
    description: 'Simultaneous tri-morbidity presenting Type-2 Diabetes, Ischemic Heart Disease, and Essential Hypertension.',
    colorTheme: '#dc2626', // Red
  },
};

/**
 * Returns readable details for a given disease code, or a fallback object if code is unverified.
 * @param {string} code
 * @returns {Object}
 */
export function getDiseaseClassInfo(code) {
  if (!code || !DISEASE_CLASSES[code]) {
    return {
      code: code || 'UNKNOWN',
      name: 'Unverified Category',
      shortName: 'Unverified',
      category: 'Pending',
      description: 'Model output has not been verified or connected.',
      colorTheme: '#64748b',
    };
  }
  return DISEASE_CLASSES[code];
}

/**
 * Returns all verified target classes as an ordered array.
 * @returns {Array<Object>}
 */
export function getAllDiseaseClasses() {
  return Object.values(DISEASE_CLASSES);
}
