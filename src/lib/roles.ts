// Single source of truth for roles and what each may access.
// Matches the `Role` enum in prisma/schema.prisma.

export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'PASTOR'
  | 'MINISTRY_LEADER'
  | 'CONTENT_MANAGER'
  | 'FINANCE_MANAGER'
  | 'MEMBER'

// Full management access — these roles can see and manage everything.
// A PASTOR is treated exactly like an admin.
export const ADMIN_ROLES: UserRole[] = ['SUPER_ADMIN', 'ADMIN', 'PASTOR']

// May manage finances/donations (admins + the dedicated finance manager).
export const FINANCE_ROLES: UserRole[] = [...ADMIN_ROLES, 'FINANCE_MANAGER']

// May manage content: sermons, events, blog, gallery, ministries, prayer.
// (CONTENT_MANAGER / MINISTRY_LEADER scope is inferred — adjust as needed.)
export const CONTENT_ROLES: UserRole[] = [...ADMIN_ROLES, 'CONTENT_MANAGER', 'MINISTRY_LEADER']

// Anyone who may access the management dashboard at all — every staff role.
// Plain MEMBERs are intentionally excluded: they only see the public site.
export const STAFF_ROLES: UserRole[] = [
  ...ADMIN_ROLES,
  'FINANCE_MANAGER',
  'CONTENT_MANAGER',
  'MINISTRY_LEADER',
]

export const isAdmin = (role: UserRole): boolean => ADMIN_ROLES.includes(role)
export const isFinance = (role: UserRole): boolean => FINANCE_ROLES.includes(role)
export const isContentManager = (role: UserRole): boolean => CONTENT_ROLES.includes(role)
export const isStaff = (role: UserRole): boolean => STAFF_ROLES.includes(role)
