import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gift,
  Plus,
  X,
  RefreshCw,
  CheckCircle2,
  Clock,
  Trash2,
  TrendingUp,
  User,
  IndianRupee,
  Percent,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Star,
  Award,
  Wallet,
  Eye,
  AlertCircle,
  Users,
} from "lucide-react";
import { toast } from "sonner";

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const monthLabel = (ym) => {
  const [y, m] = ym.split("-");
  return new Date(y, m - 1, 1).toLocaleString("en-IN", {
    month: "long",
    year: "numeric",
  });
};
const prevMonth = (ym) => {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(y, m - 2, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};
const nextMonth = (ym) => {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(y, m, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};
const currentMonthStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};
const fmt = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

const ROLE_COLORS = {
  admin: "bg-amber-500/15 text-amber-400",
  manager: "bg-blue-500/15 text-blue-400",
  billing: "bg-emerald-500/15 text-emerald-400",
  staff: "bg-stone-500/15 text-stone-400",
};

// ── Add Commission Modal ──────────────────────────────────────
const AddModal = ({ users, onClose, onSave }) => {
  const [form, setForm] = useState({
    staff_id: "",
    commission_type: "flat",
    amount: "",
    percentage_value: "",
    order_id: "",
    order_amount: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // Auto-calc amount when percentage + order amount filled
  useEffect(() => {
    if (
      form.commission_type === "percentage" &&
      form.percentage_value &&
      form.order_amount
    ) {
      const calc =
        (parseFloat(form.order_amount) * parseFloat(form.percentage_value)) /
        100;
      set("amount", calc.toFixed(2));
    }
  }, [form.percentage_value, form.order_amount, form.commission_type]);

  const handleSubmit = async () => {
    if (!form.staff_id) {
      toast.error("Select a staff member");
      return;
    }
    if (!form.amount || parseFloat(form.amount) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (!form.date) {
      toast.error("Select a date");
      return;
    }
    setSaving(true);
    try {
      await onSave({
        staff_id: form.staff_id,
        amount: parseFloat(form.amount),
        commission_type: form.commission_type,
        percentage_value: form.percentage_value
          ? parseFloat(form.percentage_value)
          : null,
        order_id: form.order_id || null,
        order_amount: form.order_amount ? parseFloat(form.order_amount) : null,
        notes: form.notes,
        date: form.date,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const staffOnly = users.filter((u) =>
    ["staff", "billing", "manager"].includes(u.role),
  );

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
        className="bg-[#1c1c2e] border border-white/10 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/15 rounded-xl">
              <Gift size={17} className="text-amber-400" />
            </div>
            <h2 className="text-base font-bold text-white">
              Add Commission / Incentive
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Staff picker */}
          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2 block">
              Staff Member *
            </label>
            <select
              value={form.staff_id}
              onChange={(e) => set("staff_id", e.target.value)}
              className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-3 text-stone-300 text-sm outline-none focus:ring-2 focus:ring-amber-500/40"
            >
              <option value="" className="bg-[#1c1c2e]">
                — Select staff —
              </option>
              {staffOnly.map((u) => (
                <option key={u.id} value={u.id} className="bg-[#1c1c2e]">
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
            {form.staff_id && (
              <div className="mt-2 flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <span className="text-xs font-black text-amber-400">
                    {staffOnly
                      .find((u) => u.id === form.staff_id)
                      ?.name?.charAt(0)}
                  </span>
                </div>
                <span className="text-xs text-stone-300 font-semibold">
                  {staffOnly.find((u) => u.id === form.staff_id)?.name}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto ${ROLE_COLORS[staffOnly.find((u) => u.id === form.staff_id)?.role] || "bg-stone-500/15 text-stone-400"}`}
                >
                  {staffOnly.find((u) => u.id === form.staff_id)?.role}
                </span>
              </div>
            )}
          </div>

          {/* Commission type */}
          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2 block">
              Commission Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  value: "flat",
                  label: "Flat Amount",
                  icon: IndianRupee,
                  desc: "Fixed ₹ reward",
                },
                {
                  value: "percentage",
                  label: "Percentage",
                  icon: Percent,
                  desc: "% of sale amount",
                },
              ].map((ct) => {
                const Icon = ct.icon;
                const isActive = form.commission_type === ct.value;
                return (
                  <button
                    key={ct.value}
                    onClick={() => set("commission_type", ct.value)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${
                      isActive
                        ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                        : "border-white/10 text-stone-500 hover:border-white/20"
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-lg ${isActive ? "bg-amber-500/15" : "bg-white/5"}`}
                    >
                      <Icon size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-bold">{ct.label}</p>
                      <p className="text-[10px] opacity-60">{ct.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Order link + percentage calc */}
          {form.commission_type === "percentage" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 block">
                  Sale Amount (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.order_amount}
                  onChange={(e) => set("order_amount", e.target.value)}
                  placeholder="Order total"
                  className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm outline-none focus:ring-2 focus:ring-amber-500/40 placeholder-stone-600"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 block">
                  Commission %
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    max="100"
                    value={form.percentage_value}
                    onChange={(e) => set("percentage_value", e.target.value)}
                    placeholder="e.g. 5"
                    className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 pr-8 text-white text-sm outline-none focus:ring-2 focus:ring-amber-500/40 placeholder-stone-600"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">
                    %
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 block">
              Final Commission Amount (₹) *
              {form.commission_type === "percentage" && form.amount && (
                <span className="ml-2 text-amber-400 font-normal normal-case">
                  auto-calculated
                </span>
              )}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400 font-bold">
                ₹
              </span>
              <input
                type="number"
                step="0.01"
                value={form.amount}
                onChange={(e) => set("amount", e.target.value)}
                placeholder="0.00"
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 text-white text-lg font-mono font-black outline-none focus:ring-2 focus:ring-amber-500/40 placeholder-stone-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 block">
                Order Ref # (optional)
              </label>
              <input
                type="text"
                value={form.order_id}
                onChange={(e) => set("order_id", e.target.value)}
                placeholder="Order ID"
                className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm outline-none focus:ring-2 focus:ring-amber-500/40 placeholder-stone-600"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 block">
                Date *
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-stone-300 text-sm outline-none focus:ring-2 focus:ring-amber-500/40"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 block">
              Reason / Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              rows={3}
              placeholder="e.g. Convinced customer to buy Premium Sofa Set worth ₹45,000"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-stone-300 text-sm resize-none outline-none focus:ring-2 focus:ring-amber-500/40 placeholder-stone-600"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-white/10 flex gap-3 flex-shrink-0">
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
                Saving…
              </>
            ) : (
              <>
                <Gift size={14} />
                Add Commission
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Commission Row Card ───────────────────────────────────────
const CommissionCard = ({ c, isAdmin, onPay, onDelete, index }) => {
  const isPending = c.status === "pending";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6, scale: 0.97 }}
      transition={{ delay: index * 0.03 }}
      className="group bg-white border border-stone-100 rounded-2xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-start gap-3.5">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-900/20">
          <span className="text-white font-black text-sm">
            {c.staff_name?.charAt(0)}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div>
              <p className="font-bold text-stone-800 text-sm">{c.staff_name}</p>
              <p className="text-[10px] text-stone-400">{c.staff_email}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
                  isPending
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                }`}
              >
                {isPending ? "Pending" : "Paid"}
              </span>
              <span className="text-lg font-black font-mono text-stone-800">
                ₹{c.amount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Badges row */}
          <div className="flex items-center gap-1.5 flex-wrap mb-2">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ROLE_COLORS[c.staff_role] || "bg-stone-100 text-stone-500"}`}
            >
              {c.staff_role}
            </span>
            {c.commission_type === "percentage" && c.percentage_value && (
              <span className="text-[10px] font-bold bg-purple-50 text-purple-600 border border-purple-200 px-2 py-0.5 rounded-full">
                {c.percentage_value}% of ₹{c.order_amount?.toFixed(0)}
              </span>
            )}
            {c.order_id && (
              <span className="text-[10px] text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full font-mono">
                #{c.order_id.slice(-8)}
              </span>
            )}
          </div>

          {c.notes && (
            <p className="text-xs text-stone-500 italic mb-2 line-clamp-2">
              "{c.notes}"
            </p>
          )}

          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-3 text-[11px] text-stone-400">
              <span>{fmt(c.date)}</span>
              {c.created_by_name && <span>· by {c.created_by_name}</span>}
              {c.status === "paid" && c.paid_by_name && (
                <span className="text-emerald-500">
                  · paid by {c.paid_by_name}
                </span>
              )}
            </div>

            {isAdmin && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {isPending && (
                  <button
                    onClick={() => onPay(c.id)}
                    className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:bg-emerald-50 px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    <CheckCircle2 size={11} />
                    Mark Paid
                  </button>
                )}
                <button
                  onClick={() => onDelete(c.id)}
                  className="p-1.5 text-stone-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ── Staff Leaderboard Card ────────────────────────────────────
const LeaderboardCard = ({ staff, rank, onFilterStaff }) => {
  const medals = ["🥇", "🥈", "🥉"];
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.07 }}
      onClick={() => onFilterStaff(staff.staff_id)}
      className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl cursor-pointer transition-colors group border border-white/5 hover:border-white/15"
    >
      <span className="text-lg w-6 text-center flex-shrink-0">
        {medals[rank] || `#${rank + 1}`}
      </span>
      <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
        <span className="text-amber-400 font-black text-xs">
          {staff.staff_name?.charAt(0)}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-white truncate">
          {staff.staff_name}
        </p>
        <p className="text-[10px] text-stone-500">{staff.count} commissions</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-black font-mono text-amber-400">
          ₹{staff.total_earned.toFixed(0)}
        </p>
        {staff.pending > 0 && (
          <p className="text-[10px] text-amber-500/60">
            ₹{staff.pending.toFixed(0)} pending
          </p>
        )}
      </div>
    </motion.div>
  );
};

// ── Main Page ─────────────────────────────────────────────────
const Commission = () => {
  const { token, user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";
  const canManage = isAdmin || isManager;

  const [commissions, setCommissions] = useState([]);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [month, setMonth] = useState(currentMonthStr());
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterStaff, setFilterStaff] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(new Set());

  const headers = { Authorization: `Bearer ${token}` };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const calls = [
        axios.get(`${API_URL}/commissions?month=${month}`, { headers }),
        axios.get(`${API_URL}/commissions/stats/summary?month=${month}`, {
          headers,
        }),
      ];
      if (canManage) calls.push(axios.get(`${API_URL}/users`, { headers }));
      const results = await Promise.allSettled(calls);
      if (results[0].status === "fulfilled")
        setCommissions(
          Array.isArray(results[0].value.data) ? results[0].value.data : [],
        );
      if (results[1].status === "fulfilled") setStats(results[1].value.data);
      if (canManage && results[2]?.status === "fulfilled")
        setUsers(
          Array.isArray(results[2].value.data) ? results[2].value.data : [],
        );
    } catch {
      toast.error("Failed to load commissions");
    } finally {
      setLoading(false);
    }
  }, [month, token]);

  useEffect(() => {
    fetchAll();
    setSelected(new Set());
  }, [month]);

  const handleSave = async (data) => {
    try {
      await axios.post(`${API_URL}/commissions`, data, { headers });
      toast.success("Commission added successfully!");
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to add");
      throw err;
    }
  };

  const handlePay = async (id) => {
    try {
      await axios.put(`${API_URL}/commissions/${id}/pay`, {}, { headers });
      toast.success("Commission marked as paid!");
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed");
    }
  };

  const handleBulkPay = async () => {
    if (selected.size === 0) return;
    try {
      await axios.put(
        `${API_URL}/commissions/bulk/pay`,
        { commission_ids: [...selected] },
        { headers },
      );
      toast.success(`${selected.size} commissions marked as paid!`);
      setSelected(new Set());
      fetchAll();
    } catch {
      toast.error("Bulk pay failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this commission entry?")) return;
    try {
      await axios.delete(`${API_URL}/commissions/${id}`, { headers });
      toast.success("Deleted");
      fetchAll();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const toggleSelect = (id) =>
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const pendingCommissions = commissions.filter((c) => c.status === "pending");

  const filtered = useMemo(
    () =>
      commissions.filter((c) => {
        if (filterStatus !== "all" && c.status !== filterStatus) return false;
        if (filterStaff !== "all" && c.staff_id !== filterStaff) return false;
        if (
          search &&
          !c.staff_name.toLowerCase().includes(search.toLowerCase()) &&
          !c.notes?.toLowerCase().includes(search.toLowerCase())
        )
          return false;
        return true;
      }),
    [commissions, filterStatus, filterStaff, search],
  );

  const uniqueStaff = useMemo(() => {
    const map = {};
    commissions.forEach((c) => {
      if (!map[c.staff_id]) map[c.staff_id] = c.staff_name;
    });
    return Object.entries(map).map(([id, name]) => ({ id, name }));
  }, [commissions]);

  if (loading && !stats)
    return (
      <div className="flex items-center justify-center h-full bg-[#f7f6f3]">
        <div className="text-center">
          <div className="relative w-14 h-14 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-amber-100" />
            <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
          </div>
          <p className="text-stone-400 text-sm">Loading commissions…</p>
        </div>
      </div>
    );

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
              "radial-gradient(circle at 85% 40%, #f59e0b 0%, transparent 50%), radial-gradient(circle at 10% 70%, #8b5cf6 0%, transparent 45%)",
          }}
        />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/15 rounded-2xl border border-amber-500/20">
              <Gift size={24} className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                Commission & Incentives
              </h1>
              <p className="text-stone-400 text-sm mt-0.5">
                Reward staff for outstanding sales performance
              </p>
            </div>
          </div>
          {canManage && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-900 font-black text-sm px-5 py-3 rounded-xl transition-all shadow-lg shadow-amber-900/30 active:scale-95"
            >
              <Plus size={16} />
              Add Commission
            </button>
          )}
        </div>

        {/* Stats strip */}
        {stats && (
          <div className="relative mt-5 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                label: "Total This Month",
                value: `₹${(stats.total_pending + stats.total_paid).toFixed(0)}`,
                color: "text-stone-300",
              },
              {
                label: "Pending Payout",
                value: `₹${stats.total_pending.toFixed(0)}`,
                color:
                  stats.total_pending > 0 ? "text-amber-400" : "text-stone-500",
              },
              {
                label: "Already Paid",
                value: `₹${stats.total_paid.toFixed(0)}`,
                color: "text-emerald-400",
              },
              {
                label: "Entries",
                value: stats.total_count,
                color: "text-blue-400",
              },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-stone-500 text-[10px] uppercase tracking-wider font-semibold mb-0.5">
                  {s.label}
                </p>
                <p className={`font-mono font-black text-xl ${s.color}`}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Month nav */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-1 bg-[#1c1c2e] border border-white/10 rounded-xl px-1 py-1 shadow">
          <button
            onClick={() => setMonth(prevMonth(month))}
            className="p-1.5 rounded-lg hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-xs font-bold text-stone-300 min-w-28 text-center">
            {monthLabel(month)}
          </span>
          <button
            onClick={() => setMonth(nextMonth(month))}
            disabled={month >= currentMonthStr()}
            className="p-1.5 rounded-lg hover:bg-white/10 text-stone-400 hover:text-white transition-colors disabled:opacity-30"
          >
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Bulk pay */}
        {isAdmin && selected.size > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleBulkPay}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-all shadow-lg"
          >
            <CheckCircle2 size={14} />
            Mark {selected.size} as Paid
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* LEFT: Commission list */}
        <div className="xl:col-span-2 space-y-4">
          {/* Filters */}
          <div className="bg-white rounded-2xl border border-stone-100 p-4 shadow-sm flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-36">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search staff or notes…"
                className="w-full h-9 pl-8 pr-3 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/30 text-stone-700"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-9 px-3 rounded-xl border border-stone-200 bg-white text-xs text-stone-600 outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
            {canManage && uniqueStaff.length > 0 && (
              <select
                value={filterStaff}
                onChange={(e) => setFilterStaff(e.target.value)}
                className="h-9 px-3 rounded-xl border border-stone-200 bg-white text-xs text-stone-600 outline-none"
              >
                <option value="all">All Staff</option>
                {uniqueStaff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            )}
            {(search || filterStatus !== "all" || filterStaff !== "all") && (
              <button
                onClick={() => {
                  setSearch("");
                  setFilterStatus("all");
                  setFilterStaff("all");
                }}
                className="h-9 px-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold flex items-center gap-1"
              >
                <X size={11} />
                Clear
              </button>
            )}
            {canManage && pendingCommissions.length > 0 && (
              <button
                onClick={() => {
                  setSelected(new Set(pendingCommissions.map((c) => c.id)));
                }}
                className="h-9 px-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold flex items-center gap-1 ml-auto"
              >
                Select all pending ({pendingCommissions.length})
              </button>
            )}
          </div>

          {/* List */}
          {loading ? (
            <div className="flex justify-center py-16">
              <RefreshCw size={22} className="animate-spin text-stone-400" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-stone-100">
              <div className="p-4 bg-stone-100 rounded-2xl mb-3">
                <Gift size={28} className="text-stone-300" />
              </div>
              <p className="text-stone-500 font-semibold text-sm">
                No commissions found
              </p>
              <p className="text-stone-400 text-xs mt-1">
                {commissions.length === 0
                  ? "Add the first commission entry"
                  : "Adjust filters to see results"}
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              <AnimatePresence mode="popLayout">
                {filtered.map((c, i) => (
                  <div key={c.id} className="relative">
                    {isAdmin && (
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                        <input
                          type="checkbox"
                          checked={selected.has(c.id)}
                          onChange={() => toggleSelect(c.id)}
                          className="w-3.5 h-3.5 rounded accent-amber-500 cursor-pointer"
                        />
                      </div>
                    )}
                    <div className={isAdmin ? "pl-7" : ""}>
                      <CommissionCard
                        c={c}
                        isAdmin={isAdmin}
                        onPay={handlePay}
                        onDelete={handleDelete}
                        index={i}
                      />
                    </div>
                  </div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* RIGHT: Leaderboard + summary */}
        <div className="space-y-4">
          {/* My earnings card (staff view) */}
          {!canManage && stats && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#1c1c2e] border border-white/10 rounded-2xl p-5 shadow-xl"
            >
              <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Award size={11} className="text-amber-400" />
                My Earnings — {monthLabel(month)}
              </p>
              {[
                {
                  label: "Total Earned",
                  value: `₹${(stats.total_pending + stats.total_paid).toFixed(2)}`,
                  color: "text-white",
                },
                {
                  label: "Pending Payout",
                  value: `₹${stats.total_pending.toFixed(2)}`,
                  color: "text-amber-400",
                },
                {
                  label: "Received",
                  value: `₹${stats.total_paid.toFixed(2)}`,
                  color: "text-emerald-400",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between py-3 ${i < 2 ? "border-b border-white/8" : ""}`}
                >
                  <span className="text-xs text-stone-400">{item.label}</span>
                  <span
                    className={`font-mono font-black text-base ${item.color}`}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
              {stats.total_pending > 0 && (
                <div className="mt-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-center gap-2">
                  <Clock size={13} className="text-amber-400 flex-shrink-0" />
                  <p className="text-xs text-amber-300">
                    ₹{stats.total_pending.toFixed(2)} pending approval from
                    admin
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Leaderboard (admin/manager) */}
          {canManage && stats?.staff_breakdown?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#1c1c2e] border border-white/10 rounded-2xl p-5 shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest flex items-center gap-2">
                  <Star size={11} className="text-amber-400" />
                  Top Performers
                </p>
                {filterStaff !== "all" && (
                  <button
                    onClick={() => setFilterStaff("all")}
                    className="text-[10px] text-amber-400 hover:text-amber-300"
                  >
                    Show all
                  </button>
                )}
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {stats.staff_breakdown.map((s, i) => (
                  <LeaderboardCard
                    key={s.staff_id}
                    staff={s}
                    rank={i}
                    onFilterStaff={(id) =>
                      setFilterStaff(id === filterStaff ? "all" : id)
                    }
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Pending payout alert */}
          {canManage && pendingCommissions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-5"
            >
              <h3 className="font-bold text-amber-800 text-sm mb-3 flex items-center gap-2">
                <AlertCircle size={14} />
                Pending Payouts ({pendingCommissions.length})
              </h3>
              <div className="space-y-2">
                {pendingCommissions.slice(0, 5).map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between bg-white/70 rounded-xl px-3 py-2 text-xs"
                  >
                    <span className="text-stone-700 font-semibold truncate max-w-[130px]">
                      {c.staff_name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-amber-700">
                        ₹{c.amount.toFixed(0)}
                      </span>
                      {isAdmin && (
                        <button
                          onClick={() => handlePay(c.id)}
                          className="p-1 rounded-lg text-emerald-600 hover:bg-emerald-100 transition-colors"
                        >
                          <CheckCircle2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {pendingCommissions.length > 5 && (
                  <p className="text-[10px] text-amber-600 text-center">
                    +{pendingCommissions.length - 5} more
                  </p>
                )}
              </div>
              {isAdmin && pendingCommissions.length > 1 && (
                <button
                  onClick={() => {
                    setSelected(new Set(pendingCommissions.map((c) => c.id)));
                  }}
                  className="mt-3 w-full h-9 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 size={12} />
                  Select All & Pay ₹{stats?.total_pending?.toFixed(0)}
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <AddModal
            users={users}
            onClose={() => setShowModal(false)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Commission;
