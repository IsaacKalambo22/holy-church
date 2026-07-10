// Learning tracks/levels for courses, shared between the admin form and the
// public /lessons filter so the two never drift apart. Edit this one list to
// add or rename a track everywhere.
export const LESSON_CATEGORIES = [
  'Beginners',
  'New Believers',
  'Discipleship',
  'Ministers',
  'Leaders',
] as const

export type LessonCategory = (typeof LESSON_CATEGORIES)[number]
