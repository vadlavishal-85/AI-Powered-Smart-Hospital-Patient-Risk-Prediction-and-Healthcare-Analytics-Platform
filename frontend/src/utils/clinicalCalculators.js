/**
 * Clinical Calculations & Feature Normalization Utilities
 *
 * Sourced directly from training notebook: FINALMLPROJECT COMPLETE.ipynb
 * Dataset Boundaries: min = 2, max = 89
 * Formula: (age - 2) / (89 - 2) = (age - 2) / 87
 */

export const DATASET_AGE_MIN = 2;
export const DATASET_AGE_MAX = 89;

/**
 * Calculates the exact normalized age ratio [0.0 - 1.0] as generated during model training.
 * @param {number|string} ageVal - Patient age in years
 * @returns {number|null} - Normalized float rounded to 4 decimals, or null if invalid
 */
export function calculateAgeNormalized(ageVal) {
  const num = parseFloat(ageVal);
  if (isNaN(num)) return null;
  const normalized = (num - DATASET_AGE_MIN) / (DATASET_AGE_MAX - DATASET_AGE_MIN);
  return Math.max(0, Math.min(1.5, parseFloat(normalized.toFixed(4))));
}
