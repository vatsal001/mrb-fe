/**
 * ─────────────────────────────────────────────────────────────
 *  ROLE-BASED PERMISSIONS — MRB HOME DECOR MALL
 * ─────────────────────────────────────────────────────────────
 *
 *  ROLES:
 *  ┌─────────────┬────────────────────────────────────────────┐
 *  │ admin       │ Full access — all features CRUD            │
 *  │ billing     │ POS + Orders only (billing staff)          │
 *  │ manager     │ Inventory + Stock + Locations + Reports    │
 *  │ staff       │ Read-only on allowed pages                 │
 *  └─────────────┴────────────────────────────────────────────┘
 *
 *  USAGE:
 *    import { can, canView, ROLES } from '@/utils/permissions';
 *
 *    if (can(user, 'pos.create'))   → allow checkout
 *    if (canView(user, 'inventory')) → show inventory nav
 */

// ── Role identifiers ─────────────────────────────────────────
export const ROLES = {
  ADMIN: "admin",
  BILLING: "billing",
  MANAGER: "manager",
  STAFF: "staff",
};

// ── Role display labels ───────────────────────────────────────
export const ROLE_LABELS = {
  admin: "Full Admin",
  billing: "Billing (POS Only)",
  manager: "Manager (Stock)",
  staff: "Staff (Read Only)",
};

// ── Role colors (for badges) ──────────────────────────────────
export const ROLE_COLORS = {
  admin: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  billing: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  manager: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  staff: {
    bg: "bg-stone-100",
    text: "text-stone-600",
    border: "border-stone-200",
  },
};

// ─────────────────────────────────────────────────────────────
//  PERMISSION MATRIX
//  Each key is a "permission string" — value is array of roles
//  that are ALLOWED to perform that action.
// ─────────────────────────────────────────────────────────────
const PERMISSIONS = {
  // ── Dashboard ─────────────────────────────────────────────
  "dashboard.view": ["admin", "manager", "staff"],
  "dashboard.view_financials": ["admin", "manager"], // revenue/profit cards

  // ── Inventory ─────────────────────────────────────────────
  "inventory.view": ["admin", "manager", "staff"],
  "inventory.create": ["admin", "manager"],
  "inventory.edit": ["admin", "manager"],
  "inventory.delete": ["admin"],

  // ── Locations & Racks ─────────────────────────────────────
  "locations.view": ["admin", "manager", "staff"],
  "locations.create": ["admin", "manager"],
  "locations.edit": ["admin", "manager"],
  "locations.delete": ["admin"],

  // ── Stock Transfers ───────────────────────────────────────
  "transfers.view": ["admin", "manager", "staff"],
  "transfers.create": ["admin", "manager"],

  // ── POS / Billing ─────────────────────────────────────────
  "pos.view": ["admin", "billing"],
  "pos.create": ["admin", "billing"], // complete a sale
  "pos.void": ["admin"], // void/cancel an order

  // ── Orders ────────────────────────────────────────────────
  "orders.view": ["admin", "billing", "manager"],
  "orders.view_all": ["admin", "manager"], // see all staff orders
  "orders.view_own": ["billing"], // see only own orders
  "orders.delete": ["admin"],

  // ── Day Book ──────────────────────────────────────────────
  "daybook.view": ["admin", "manager", "staff"],
  "daybook.create": ["admin", "manager"],
  "daybook.settle": ["admin", "manager"],
  "daybook.delete": ["admin"],

  // ── Reports ───────────────────────────────────────────────
  "reports.view": ["admin", "manager"],
  "reports.export": ["admin"],

  // ── Users ─────────────────────────────────────────────────
  "users.view": ["admin"],
  "users.create": ["admin"],
  "users.edit_role": ["admin"],
  "users.delete": ["admin"],
};

// ─────────────────────────────────────────────────────────────
//  NAVIGATION VISIBILITY MAP
//  Which nav items each role can see.
// ─────────────────────────────────────────────────────────────
export const NAV_PERMISSIONS = {
  dashboard: ["admin", "manager", "staff"],
  inventory: ["admin", "manager", "staff"],
  dayBook: ["admin", "manager", "staff"],
  locationsRacks: ["admin", "manager", "staff"],
  stockTransfers: ["admin", "manager", "staff"],
  pos: ["admin", "billing"],
  orders: ["admin", "billing", "manager"],
  reports: ["admin", "manager"],
  users: ["admin"],
};

// ─────────────────────────────────────────────────────────────
//  HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────

/**
 * Check if a user has a specific permission.
 * @param {object|null} user  - user object from AuthContext (must have .role)
 * @param {string} permission - permission string e.g. 'pos.create'
 * @returns {boolean}
 */
export const can = (user, permission) => {
  if (!user) return false;
  const allowed = PERMISSIONS[permission];
  if (!allowed) return false;
  return allowed.includes(user.role);
};

/**
 * Check if a user can view a nav section.
 * @param {object|null} user
 * @param {string} section - key from NAV_PERMISSIONS
 * @returns {boolean}
 */
export const canView = (user, section) => {
  if (!user) return false;
  const allowed = NAV_PERMISSIONS[section];
  if (!allowed) return false;
  return allowed.includes(user.role);
};

/**
 * Check if user is a full admin.
 */
export const isAdmin = (user) => user?.role === ROLES.ADMIN;

/**
 * Check if user is billing staff.
 */
export const isBilling = (user) => user?.role === ROLES.BILLING;

/**
 * Check if user is a manager.
 */
export const isManager = (user) => user?.role === ROLES.MANAGER;

/**
 * Returns a readable label for a role.
 */
export const getRoleLabel = (role) => ROLE_LABELS[role] || role;

/**
 * Returns Tailwind color classes for a role badge.
 */
export const getRoleColor = (role) => ROLE_COLORS[role] || ROLE_COLORS.staff;

/**
 * Access denied component helper — returns true if user
 * should see an access denied screen for a given permission.
 */
export const isDenied = (user, permission) => !can(user, permission);

export default PERMISSIONS;
