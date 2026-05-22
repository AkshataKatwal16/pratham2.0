export interface LanguageOption {
  code: string;
  nativeLabel: string;
  englishLabel?: string;
}

/** PLP landing language grid — keep in sync with Header language codes */
export const PLP_LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', nativeLabel: 'English' },
  { code: 'hi', nativeLabel: 'हिंदी', englishLabel: 'Hindi' },
  { code: 'mr', nativeLabel: 'मराठी', englishLabel: 'Marathi' },
  { code: 'odi', nativeLabel: 'ଓଡ଼ିଆ', englishLabel: 'Odia' },
  { code: 'tel', nativeLabel: 'తెలుగు', englishLabel: 'Telugu' },
  { code: 'kan', nativeLabel: 'ಕನ್ನಡ', englishLabel: 'Kannada' },
  { code: 'tam', nativeLabel: 'தமிழ்', englishLabel: 'Tamil' },
  { code: 'guj', nativeLabel: 'ગુજરાતી', englishLabel: 'Gujarati' },
  { code: 'ur', nativeLabel: 'اردو', englishLabel: 'Urdu' },
];

export const PLP_LANGUAGE_POPUP_DISMISSED_KEY = 'plpLanguagePopupDismissed';

/** App routes under src/app — not program-specific share links */
const RESERVED_APP_ROUTES = new Set([
  'account-selection',
  'api',
  'change-password',
  'change-username',
  'cmslink',
  'content',
  'content-details',
  'courses-contents',
  'enroll-profile-completion',
  'explore',
  'faqs',
  'home',
  'home-courses',
  'in-progress',
  'knowledge-bank',
  'landing',
  'login',
  'logout',
  'manual-assessment',
  'navapatham',
  'observations',
  'password-forget',
  'player',
  'pos',
  'profile',
  'profile-complition',
  'programs',
  'reattempt-check',
  'registration',
  'reset-password',
  'scp-dashboard',
  'skill-center',
  'sso',
  'support-request',
  'themantic',
  'unauthorized',
]);

/**
 * Show language popup on PLP home and program share URLs
 * e.g. /, /landing, /Vocational%20Training
 */
export function isLanguagePopupRoute(pathname: string): boolean {
  if (!pathname || pathname === '/') return true;
  if (pathname === '/landing') return true;

  const segments = pathname.split('/').filter(Boolean);
  if (segments.length !== 1) return false;

  const segment = decodeURIComponent(segments[0]).toLowerCase();
  return !RESERVED_APP_ROUTES.has(segment);
}
