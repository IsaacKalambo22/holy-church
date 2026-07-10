// Canonical ministry categories, shared between the admin form (the select the
// client asked for) and the public ministries filter so they never drift apart.
export const MINISTRY_CATEGORIES = [
  'Worship',
  'Youth',
  'Children',
  'Outreach',
  'Missions',
  'Care',
  'Media',
  'Prayer',
  'Community',
  'Convention',
] as const

export type MinistryCategory = (typeof MINISTRY_CATEGORIES)[number]
