// Cookie consent manager for GDPR compliance

const CONSENT_KEY = 'quantdrill_cookie_consent';

export const CATEGORIES = {
  ESSENTIAL: 'essential',
  ANALYTICS: 'analytics',
  MARKETING: 'marketing',
};

/**
 * Get current consent state from localStorage
 */
export function getConsentState() {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Save consent preferences to localStorage
 */
export function saveConsentState(preferences) {
  const state = {
    timestamp: new Date().toISOString(),
    essential: true, // always true
    analytics: preferences?.analytics || false,
    marketing: preferences?.marketing || false,
  };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(state));
  return state;
}

/**
 * Check if analytics is allowed
 */
export function isAnalyticsAllowed() {
  const state = getConsentState();
  if (!state) return false;
  return state.analytics === true;
}

/**
 * Check if marketing is allowed
 */
export function isMarketingAllowed() {
  const state = getConsentState();
  if (!state) return false;
  return state.marketing === true;
}

/**
 * Reset consent (for testing or user request)
 */
export function resetConsent() {
  localStorage.removeItem(CONSENT_KEY);
}

/**
 * Accept all cookies
 */
export function acceptAll() {
  return saveConsentState({
    analytics: true,
    marketing: true,
  });
}

/**
 * Reject all non-essential cookies
 */
export function rejectAll() {
  return saveConsentState({
    analytics: false,
    marketing: false,
  });
}