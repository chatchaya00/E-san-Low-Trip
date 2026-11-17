/**
 * Centralized Typography System for E-san low Trip
 * Aesthetic: Vintage Travel Passport + Modern Nature
 *
 * - Cinzel: App Logo, English passport headings, and achievement numbers
 * - Prompt: Thai headings, navigation menus, buttons, and Thai stamp names
 * - Sarabun: Park details, history, highlights, descriptions, and general prose
 */
export const TYPOGRAPHY = {
  logo: 'typo-logo', // Cinzel Bold (700)
  enHeading: 'typo-en-heading', // Cinzel SemiBold (600)
  achievement: 'typo-achievement', // Cinzel Bold (700) + tabular-nums
  mainHeading: 'typo-main-heading', // Prompt SemiBold (600)
  sectionHeading: 'typo-section-heading', // Prompt Medium (500)
  nav: 'typo-nav', // Prompt Medium (500)
  button: 'typo-btn', // Prompt Medium (500)
  body: 'typo-body', // Sarabun Regular (400)
} as const;
