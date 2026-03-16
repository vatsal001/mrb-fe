import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  Shield,
  User as UserIcon,
  ShoppingCart,
  Package,
  Eye,
  Crown,
  X,
  RefreshCw,
  ChevronDown,
  Check,
  Minus,
  Users as UsersIcon,
} from "lucide-react";
import { toast } from "sonner";

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ROLE_CONFIG = {
  admin: {
    icon: Crown,
    labelKey: "users.roles.admin.label",
    descKey: "users.roles.admin.desc",
    dark: {
      bg: "bg-purple-500/15",
      text: "text-purple-400",
      border: "border-purple-500/20",
    },
    light: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
      badge: "bg-purple-100 text-purple-700",
    },
  },
  billing: {
    icon: ShoppingCart,
    labelKey: "users.roles.billing.label",
    descKey: "users.roles.billing.desc",
    dark: {
      bg: "bg-blue-500/15",
      text: "text-blue-400",
      border: "border-blue-500/20",
    },
    light: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      badge: "bg-blue-100 text-blue-700",
    },
  },
  manager: {
    icon: Package,
    labelKey: "users.roles.manager.label",
    descKey: "users.roles.manager.desc",
    dark: {
      bg: "bg-emerald-500/15",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
    },
    light: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      badge: "bg-emerald-100 text-emerald-700",
    },
  },
  staff: {
    icon: Eye,
    labelKey: "users.roles.staff.label",
    descKey: "users.roles.staff.desc",
    dark: {
      bg: "bg-stone-500/15",
      text: "text-stone-400",
      border: "border-stone-500/20",
    },
    light: {
      bg: "bg-stone-50",
      text: "text-stone-600",
      border: "border-stone-200",
      badge: "bg-stone-100 text-stone-600",
    },
  },
};

const ALL_ROLES = ["admin", "billing", "manager", "staff"];

const ROLE_PERMS = [
  {
    featureKey: "dashboard",
    admin: true,
    billing: false,
    manager: true,
    staff: true,
  },
  {
    featureKey: "inventory",
    admin: true,
    billing: false,
    manager: true,
    staff: "👁",
  },
  {
    featureKey: "pos",
    admin: true,
    billing: true,
    manager: false,
    staff: false,
  },
  {
    featureKey: "orders",
    admin: true,
    billing: "👁",
    manager: "👁",
    staff: false,
  },
  {
    featureKey: "dayBook",
    admin: true,
    billing: false,
    manager: true,
    staff: "👁",
  },
  {
    featureKey: "stockTransfers",
    admin: true,
    billing: false,
    manager: true,
    staff: "👁",
  },
  {
    featureKey: "locationsRacks",
    admin: true,
    billing: false,
    manager: true,
    staff: "👁",
  },
  {
    featureKey: "reports",
    admin: true,
    billing: false,
    manager: true,
    staff: false,
  },
  {
    featureKey: "users",
    admin: true,
    billing: false,
    manager: false,
    staff: false,
  },
  {
    featureKey: "commissions",
    admin: true,
    billing: false,
    manager: true,
    staff: "👁",
  },
];

const PermCell = ({ val }) => {
  if (val === true)
    return (
      <div className="flex justify-center">
        <span className="w-6 h-6 rounded-full bg-emerald-500/15 flex items-center justify-center">
          <Check size={11} className="text-emerald-400" />
        </span>
      </div>
    );
  if (val === false)
    return (
      <div className="flex justify-center">
        <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
          <Minus size={10} className="text-stone-600" />
        </span>
      </div>
    );
  return <div className="text-center text-sm">{val}</div>;
};

// ── Permissions Modal ─────────────────────────────────────────
const PermsModal = ({ onClose }) => {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.93, y: 16 }}
        transition={{ type: "spring", stiffness: 340, damping: 30 }}
        className="bg-[#1c1c2e] border border-white/10 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/15 rounded-xl border border-purple-500/20">
              <Shield size={16} className="text-purple-400" />
            </div>
            <h2 className="font-black text-white text-base">
              Role Permissions Matrix
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-auto px-6 py-5">
          <table className="w-full">
            <thead>
              <tr className="bg-white/5 rounded-xl">
                <th className="text-left text-[10px] font-bold text-stone-500 uppercase tracking-widest px-4 py-3 rounded-l-xl">
                  Feature
                </th>
                {ALL_ROLES.map((role) => {
                  const cfg = ROLE_CONFIG[role];
                  const Icon = cfg.icon;
                  return (
                    <th
                      key={role}
                      className="px-4 py-3 text-center last:rounded-r-xl"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <div className={`p-1.5 rounded-lg ${cfg.dark.bg}`}>
                          <Icon size={12} className={cfg.dark.text} />
                        </div>
                        <span
                          className={`text-[10px] font-bold ${cfg.dark.text}`}
                        >
                          {t(cfg.labelKey)}
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {ROLE_PERMS.map((row, i) => (
                <tr
                  key={row.featureKey}
                  className={`border-b ${i < ROLE_PERMS.length - 1 ? "border-white/5" : "border-transparent"}`}
                >
                  <td className="px-4 py-3 text-xs font-semibold text-stone-400">
                    {t(`perms.features.${row.featureKey}`)}
                  </td>
                  {ALL_ROLES.map((role) => (
                    <td key={role} className="px-4 py-3">
                      <PermCell val={row[role]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex items-center gap-4 text-[11px] text-stone-500">
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-emerald-500/15 flex items-center justify-center">
                <Check size={9} className="text-emerald-400" />
              </span>
              Full Access
            </span>
            <span className="flex items-center gap-1.5">
              <span>👁</span>View Only
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-white/5 flex items-center justify-center">
                <Minus size={8} className="text-stone-600" />
              </span>
              No Access
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Add User Modal ────────────────────────────────────────────
const AddUserModal = ({ onClose, onSave }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!form.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const selectedCfg = ROLE_CONFIG[form.role];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.93, y: 16 }}
        transition={{ type: "spring", stiffness: 340, damping: 30 }}
        className="bg-[#1c1c2e] border border-white/10 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/15 rounded-xl border border-amber-500/20">
              <UserPlus size={16} className="text-amber-400" />
            </div>
            <h2 className="font-black text-white text-base">Add New User</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 block">
              Full Name *
            </label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Ravi Kumar"
              className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm outline-none focus:ring-2 focus:ring-amber-500/40 placeholder-stone-600"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 block">
              Email Address *
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="ravi@mrbmall.com"
              className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm outline-none focus:ring-2 focus:ring-amber-500/40 placeholder-stone-600"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 block">
              Password *
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              placeholder="Min 6 characters"
              className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm outline-none focus:ring-2 focus:ring-amber-500/40 placeholder-stone-600"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 block">
              Role *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ALL_ROLES.map((role) => {
                const cfg = ROLE_CONFIG[role];
                const Icon = cfg.icon;
                const isActive = form.role === role;
                return (
                  <button
                    key={role}
                    onClick={() => set("role", role)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border-2 text-left transition-all ${
                      isActive
                        ? `${cfg.dark.bg} ${cfg.dark.border} ${cfg.dark.text}`
                        : "border-white/8 text-stone-500 hover:border-white/15"
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-lg ${isActive ? cfg.dark.bg : "bg-white/5"}`}
                    >
                      <Icon size={13} />
                    </div>
                    <div>
                      <p className="text-xs font-bold">{t(cfg.labelKey)}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            <div
              className={`mt-2 px-3 py-2.5 rounded-xl border text-xs ${selectedCfg.dark.bg} ${selectedCfg.dark.border} ${selectedCfg.dark.text}`}
            >
              {t(selectedCfg.descKey)}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-white/10 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-xl border border-white/10 text-stone-400 hover:text-white hover:border-white/20 text-sm font-semibold transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 h-11 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-900 font-black text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw size={13} className="animate-spin" />
                Creating…
              </>
            ) : (
              <>
                <UserPlus size={14} />
                Create User
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── User Card ─────────────────────────────────────────────────
const UserCard = ({ u, currentUserId, cfg, onRoleChange, index }) => {
  const { t } = useTranslation();
  const Icon = cfg.icon;
  const [changing, setChanging] = useState(false);

  const handleRole = async (newRole) => {
    setChanging(true);
    try {
      await onRoleChange(u.id, newRole);
    } finally {
      setChanging(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-white border-2 ${cfg.light.border} rounded-2xl p-5 hover:shadow-md transition-all`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${cfg.light.bg}`}>
          <Icon size={20} className={cfg.light.text} />
        </div>
        <span
          className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide ${cfg.light.badge}`}
        >
          {t(cfg.labelKey)}
        </span>
      </div>

      {/* Avatar + name */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-10 h-10 rounded-xl ${cfg.light.bg} border-2 ${cfg.light.border} flex items-center justify-center flex-shrink-0`}
        >
          <span className={`font-black text-base ${cfg.light.text}`}>
            {u.name?.charAt(0)?.toUpperCase()}
          </span>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-black text-stone-800 text-sm truncate">
              {u.name}
            </h3>
            {u.id === currentUserId && (
              <span className="flex-shrink-0 text-[9px] bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded-full font-bold">
                YOU
              </span>
            )}
          </div>
          <p className="text-[11px] text-stone-400 truncate">{u.email}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-stone-100">
        <span className="text-[10px] text-stone-400">
          {u.created_at
            ? new Date(u.created_at).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "—"}
        </span>
        {u.id !== currentUserId && (
          <div className="relative">
            <select
              value={u.role}
              onChange={(e) => handleRole(e.target.value)}
              disabled={changing}
              className={`h-7 pl-2.5 pr-7 rounded-lg border text-[11px] font-bold outline-none appearance-none cursor-pointer ${cfg.light.bg} ${cfg.light.border} ${cfg.light.text} disabled:opacity-50`}
            >
              {ALL_ROLES.map((r) => (
                <option key={r} value={r} className="bg-white text-stone-800">
                  {t(ROLE_CONFIG[r].labelKey)}
                </option>
              ))}
            </select>
            <ChevronDown
              size={10}
              className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${cfg.light.text}`}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ── Main Page ─────────────────────────────────────────────────
const Users = () => {
  const { token, user: currentUser, isFullAdmin } = useAuth();
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showPerms, setShowPerms] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error(t("users.failedFetch"));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      await axios.post(
        `${API_URL}/auth/register`,
        { user_data: formData },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(t("users.createdSuccess"));
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.detail || t("users.failedCreate"));
      throw err;
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(
        `${API_URL}/users/${userId}/role?role=${newRole}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(t("users.roleUpdated"));
      fetchUsers();
    } catch {
      toast.error(t("users.failedUpdateRole"));
    }
  };

  if (!isFullAdmin)
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-[#f7f6f3]">
        <div className="p-5 bg-stone-100 rounded-2xl mb-4">
          <Shield size={44} className="text-stone-300" />
        </div>
        <p className="font-black text-stone-600 text-lg">
          {t("users.accessDenied")}
        </p>
        <p className="text-stone-400 text-sm mt-1">{t("users.adminOnly")}</p>
      </div>
    );

  const grouped = ALL_ROLES.reduce((acc, role) => {
    acc[role] = users.filter((u) => u.role === role);
    return acc;
  }, {});

  return (
    <div className="min-h-full bg-[#f7f6f3] p-4 md:p-6 lg:p-8">
      {/* ── Hero Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-[#1c1c2e] rounded-2xl p-6 mb-6 shadow-xl"
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 85% 40%, #a78bfa 0%, transparent 50%), radial-gradient(circle at 10% 70%, #f59e0b 0%, transparent 45%)",
          }}
        />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/15 rounded-2xl border border-purple-500/20">
              <UsersIcon size={24} className="text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                User Management
              </h1>
              <p className="text-stone-400 text-sm mt-0.5">
                Manage accounts and role permissions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowPerms(true)}
              className="flex items-center gap-2 h-10 px-4 rounded-xl bg-white/8 border border-white/15 text-stone-300 hover:text-white hover:border-white/25 font-semibold text-sm transition-all"
            >
              <Shield size={14} />
              Permissions
            </button>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 h-10 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-900 font-black text-sm transition-all shadow-lg shadow-amber-900/30"
            >
              <UserPlus size={15} />
              Add User
            </button>
          </div>
        </div>

        {/* Stats strip */}
        <div className="relative mt-5 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {ALL_ROLES.map((role) => {
            const cfg = ROLE_CONFIG[role];
            const Icon = cfg.icon;
            return (
              <div key={role} className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${cfg.dark.bg}`}>
                  <Icon size={14} className={cfg.dark.text} />
                </div>
                <div>
                  <p
                    className={`font-mono font-black text-xl ${cfg.dark.text}`}
                  >
                    {grouped[role]?.length || 0}
                  </p>
                  <p className="text-stone-500 text-[10px] uppercase tracking-wider font-semibold">
                    {t(cfg.labelKey)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ── User Groups ── */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-4 border-purple-100" />
            <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {ALL_ROLES.map((role) => {
            const roleUsers = grouped[role];
            if (!roleUsers?.length) return null;
            const cfg = ROLE_CONFIG[role];
            const Icon = cfg.icon;
            return (
              <motion.div
                key={role}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Section header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-1.5 rounded-lg ${cfg.light.bg}`}>
                    <Icon size={15} className={cfg.light.text} />
                  </div>
                  <h2 className="text-xs font-black text-stone-600 uppercase tracking-widest">
                    {t(cfg.labelKey)}
                  </h2>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${cfg.light.badge}`}
                  >
                    {roleUsers.length}{" "}
                    {roleUsers.length === 1 ? "user" : "users"}
                  </span>
                  <div className="flex-1 h-px bg-stone-200" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  <AnimatePresence>
                    {roleUsers.map((u, i) => (
                      <UserCard
                        key={u.id}
                        u={u}
                        currentUserId={currentUser?.id}
                        cfg={cfg}
                        onRoleChange={handleRoleChange}
                        index={i}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {showAdd && (
          <AddUserModal onClose={() => setShowAdd(false)} onSave={handleSave} />
        )}
        {showPerms && <PermsModal onClose={() => setShowPerms(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default Users;
