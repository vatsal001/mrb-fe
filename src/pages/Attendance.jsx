// import React, { useEffect, useState, useMemo, useCallback } from "react";
// import axios from "axios";
// import { useAuth } from "@/context/AuthContext";
// import { useTranslation } from "react-i18next";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Clock,
//   LogIn,
//   LogOut,
//   Calendar,
//   CheckCircle2,
//   XCircle,
//   AlertCircle,
//   ChevronLeft,
//   ChevronRight,
//   User,
//   Users,
//   FileText,
//   Timer,
//   TrendingUp,
//   Download,
//   Eye,
//   X,
//   Plus,
//   ClipboardList,
//   Hourglass,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { toast } from "sonner";

// const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

// // ── Helpers ───────────────────────────────────────────────────

// const fmt = (iso) => {
//   if (!iso) return "—";
//   return new Date(iso).toLocaleTimeString("en-IN", {
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true,
//   });
// };

// const fmtDuration = (mins) => {
//   if (!mins) return "—";
//   const h = Math.floor(mins / 60);
//   const m = mins % 60;
//   return h > 0 ? `${h}h ${m}m` : `${m}m`;
// };

// const monthLabel = (ym) => {
//   const [y, m] = ym.split("-");
//   return new Date(y, m - 1, 1).toLocaleString("en-IN", {
//     month: "long",
//     year: "numeric",
//   });
// };

// const prevMonth = (ym) => {
//   const [y, m] = ym.split("-").map(Number);
//   const d = new Date(y, m - 2, 1);
//   return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
// };

// const nextMonth = (ym) => {
//   const [y, m] = ym.split("-").map(Number);
//   const d = new Date(y, m, 1);
//   return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
// };

// const currentMonthStr = () => {
//   const d = new Date();
//   return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
// };

// const LEAVE_TYPES = ["sick", "casual", "emergency", "other"];

// const LEAVE_COLORS = {
//   sick: {
//     badge: "bg-rose-100 text-rose-700 border-rose-200",
//     dot: "bg-rose-400",
//   },
//   casual: {
//     badge: "bg-blue-100 text-blue-700 border-blue-200",
//     dot: "bg-blue-400",
//   },
//   emergency: {
//     badge: "bg-orange-100 text-orange-700 border-orange-200",
//     dot: "bg-orange-400",
//   },
//   other: {
//     badge: "bg-stone-100 text-stone-600 border-stone-200",
//     dot: "bg-stone-400",
//   },
// };

// const STATUS_COLORS = {
//   pending: "bg-amber-100 text-amber-700 border-amber-200",
//   approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
//   rejected: "bg-rose-100 text-rose-700 border-rose-200",
// };

// // ═════════════════════════════════════════════════════════════
// //  STAFF VIEW COMPONENTS
// // ═════════════════════════════════════════════════════════════

// // ── Live Clock ────────────────────────────────────────────────
// const LiveClock = () => {
//   const [time, setTime] = useState(new Date());
//   useEffect(() => {
//     const t = setInterval(() => setTime(new Date()), 1000);
//     return () => clearInterval(t);
//   }, []);
//   return (
//     <div className="text-center">
//       <p className="text-5xl font-mono font-bold tracking-tight text-stone-800">
//         {time.toLocaleTimeString("en-IN", {
//           hour: "2-digit",
//           minute: "2-digit",
//           second: "2-digit",
//           hour12: true,
//         })}
//       </p>
//       <p className="text-sm text-stone-400 mt-1">
//         {time.toLocaleDateString("en-IN", {
//           weekday: "long",
//           day: "numeric",
//           month: "long",
//           year: "numeric",
//         })}
//       </p>
//     </div>
//   );
// };

// // ── Clock In/Out Panel ────────────────────────────────────────
// const ClockPanel = ({ today, onAction }) => {
//   const { t } = useTranslation();
//   const [loading, setLoading] = useState(false);
//   const { token } = useAuth();

//   const record = today?.record;
//   const onLeave = today?.on_approved_leave;
//   const clockedIn = !!record?.clock_in;
//   const clockedOut = !!record?.clock_out;

//   const handleClock = async (type) => {
//     setLoading(true);
//     try {
//       await axios.post(
//         `${API_URL}/attendance/${type}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         },
//       );
//       toast.success(
//         type === "clock-in"
//           ? t("attendance.clockedInSuccess")
//           : t("attendance.clockedOutSuccess"),
//       );
//       onAction();
//     } catch (err) {
//       toast.error(err.response?.data?.detail || t("attendance.actionFailed"));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 16 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="bg-white border-2 border-stone-200 rounded-3xl p-8 flex flex-col items-center gap-6"
//     >
//       <LiveClock />

//       {/* Status indicator */}
//       <div className="flex items-center gap-2">
//         {onLeave ? (
//           <span className="flex items-center gap-2 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-4 py-2 rounded-full">
//             <Calendar size={15} /> {t("attendance.onApprovedLeave")}
//           </span>
//         ) : clockedOut ? (
//           <span className="flex items-center gap-2 text-sm font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-full">
//             <CheckCircle2 size={15} /> {t("attendance.shiftComplete")}
//           </span>
//         ) : clockedIn ? (
//           <span className="flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 border border-primary/20 px-4 py-2 rounded-full">
//             <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
//             {t("attendance.currentlyWorking")} · {t("attendance.since")}{" "}
//             {fmt(record.clock_in)}
//           </span>
//         ) : (
//           <span className="flex items-center gap-2 text-sm font-semibold text-stone-500 bg-stone-50 border border-stone-200 px-4 py-2 rounded-full">
//             <Hourglass size={15} /> {t("attendance.notClockedIn")}
//           </span>
//         )}
//       </div>

//       {/* Action button */}
//       {!onLeave && !clockedOut && (
//         <button
//           onClick={() => handleClock(clockedIn ? "clock-out" : "clock-in")}
//           disabled={loading}
//           className={`relative w-36 h-36 rounded-full font-bold text-white text-lg shadow-xl transition-all active:scale-95 flex flex-col items-center justify-center gap-2 ${
//             clockedIn
//               ? "bg-rose-500 hover:bg-rose-600 shadow-rose-200"
//               : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200"
//           } ${loading ? "opacity-60" : ""}`}
//         >
//           {clockedIn ? <LogOut size={30} /> : <LogIn size={30} />}
//           <span className="text-sm font-semibold">
//             {loading
//               ? "..."
//               : clockedIn
//                 ? t("attendance.clockOut")
//                 : t("attendance.clockIn")}
//           </span>
//           {/* Pulse ring when clocked in */}
//           {clockedIn && !loading && (
//             <span className="absolute inset-0 rounded-full border-4 border-rose-400 animate-ping opacity-30" />
//           )}
//         </button>
//       )}

//       {/* Today summary */}
//       {(clockedIn || clockedOut) && (
//         <div className="grid grid-cols-3 gap-4 w-full pt-4 border-t border-stone-100">
//           <div className="text-center">
//             <p className="text-xs text-stone-400 mb-1">{t("attendance.in")}</p>
//             <p className="font-mono font-bold text-stone-700">
//               {fmt(record?.clock_in)}
//             </p>
//           </div>
//           <div className="text-center">
//             <p className="text-xs text-stone-400 mb-1">{t("attendance.out")}</p>
//             <p className="font-mono font-bold text-stone-700">
//               {fmt(record?.clock_out)}
//             </p>
//           </div>
//           <div className="text-center">
//             <p className="text-xs text-stone-400 mb-1">
//               {t("attendance.duration")}
//             </p>
//             <p className="font-mono font-bold text-stone-700">
//               {fmtDuration(record?.duration_minutes)}
//             </p>
//           </div>
//         </div>
//       )}
//     </motion.div>
//   );
// };

// // ── Leave Request Modal ───────────────────────────────────────
// const LeaveModal = ({ onClose, onSaved }) => {
//   const { t } = useTranslation();
//   const { token } = useAuth();
//   const today = new Date().toISOString().split("T")[0];
//   const [form, setForm] = useState({
//     date_from: today,
//     date_to: today,
//     leave_type: "casual",
//     reason: "",
//   });
//   const [saving, setSaving] = useState(false);
//   const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

//   const handleSubmit = async () => {
//     if (!form.reason.trim()) {
//       toast.error(t("attendance.reasonRequired"));
//       return;
//     }
//     setSaving(true);
//     try {
//       await axios.post(`${API_URL}/leaves`, form, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success(t("attendance.leaveSubmitted"));
//       onSaved();
//       onClose();
//     } catch (err) {
//       toast.error(err.response?.data?.detail || t("attendance.leaveFailed"));
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
//       onClick={onClose}
//     >
//       <motion.div
//         initial={{ scale: 0.93, y: 16 }}
//         animate={{ scale: 1, y: 0 }}
//         exit={{ scale: 0.93, y: 16 }}
//         transition={{ type: "spring", stiffness: 340, damping: 30 }}
//         className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex items-center justify-between px-7 py-5 border-b border-stone-100">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-blue-50 rounded-xl">
//               <Calendar size={18} className="text-blue-600" />
//             </div>
//             <h2 className="text-lg font-bold text-stone-800">
//               {t("attendance.requestLeave")}
//             </h2>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600"
//           >
//             <X size={18} />
//           </button>
//         </div>

//         <div className="px-7 py-6 space-y-5">
//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <Label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2 block">
//                 {t("attendance.from")}
//               </Label>
//               <Input
//                 type="date"
//                 value={form.date_from}
//                 min={today}
//                 onChange={(e) => set("date_from", e.target.value)}
//                 className="h-11 rounded-xl border-stone-200 bg-stone-50"
//               />
//             </div>
//             <div>
//               <Label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2 block">
//                 {t("attendance.to")}
//               </Label>
//               <Input
//                 type="date"
//                 value={form.date_to}
//                 min={form.date_from}
//                 onChange={(e) => set("date_to", e.target.value)}
//                 className="h-11 rounded-xl border-stone-200 bg-stone-50"
//               />
//             </div>
//           </div>

//           <div>
//             <Label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2 block">
//               {t("attendance.leaveType")}
//             </Label>
//             <div className="grid grid-cols-2 gap-2">
//               {LEAVE_TYPES.map((lt) => (
//                 <button
//                   key={lt}
//                   onClick={() => set("leave_type", lt)}
//                   className={`py-2.5 px-3 rounded-xl border-2 text-sm font-medium capitalize transition-all ${
//                     form.leave_type === lt
//                       ? `${LEAVE_COLORS[lt].badge} border-current`
//                       : "border-stone-200 text-stone-500 hover:border-stone-300"
//                   }`}
//                 >
//                   {t(`attendance.leaveTypes.${lt}`)}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div>
//             <Label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2 block">
//               {t("attendance.reason")}
//             </Label>
//             <textarea
//               value={form.reason}
//               onChange={(e) => set("reason", e.target.value)}
//               className="w-full h-24 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm resize-none outline-none focus:ring-2 focus:ring-primary/20"
//               placeholder={t("attendance.reasonPlaceholder")}
//             />
//           </div>
//         </div>

//         <div className="px-7 py-5 border-t border-stone-100 flex gap-3">
//           <Button
//             variant="ghost"
//             onClick={onClose}
//             className="flex-1 h-11 rounded-xl text-stone-600 hover:bg-stone-100"
//           >
//             {t("common.cancel")}
//           </Button>
//           <Button
//             onClick={handleSubmit}
//             disabled={saving}
//             className="flex-1 h-11 rounded-xl bg-primary text-white"
//           >
//             {saving ? "..." : t("attendance.submitLeave")}
//           </Button>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// // ── My Attendance History ─────────────────────────────────────
// const MyHistory = ({ month, onMonthChange }) => {
//   const { t } = useTranslation();
//   const { token } = useAuth();
//   const [records, setRecords] = useState([]);
//   const [leaves, setLeaves] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetch = async () => {
//       setLoading(true);
//       try {
//         const [recRes, lvRes] = await Promise.all([
//           axios.get(`${API_URL}/attendance/my?month=${month}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios.get(`${API_URL}/leaves`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);
//         setRecords(recRes.data);
//         setLeaves(lvRes.data);
//       } catch {
//         toast.error(t("attendance.loadFailed"));
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetch();
//   }, [month]);

//   const stats = useMemo(
//     () => ({
//       present: records.filter((r) => r.status === "present").length,
//       onLeave: records.filter((r) => r.status === "on_leave").length,
//       avgDur: fmtDuration(
//         records.filter((r) => r.duration_minutes).length > 0
//           ? Math.round(
//               records
//                 .filter((r) => r.duration_minutes)
//                 .reduce((s, r) => s + r.duration_minutes, 0) /
//                 records.filter((r) => r.duration_minutes).length,
//             )
//           : 0,
//       ),
//     }),
//     [records],
//   );

//   return (
//     <div className="space-y-5">
//       {/* Month nav */}
//       <div className="flex items-center justify-between">
//         <h3 className="text-sm font-bold text-stone-700">
//           {t("attendance.myHistory")}
//         </h3>
//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => onMonthChange(prevMonth(month))}
//             className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500"
//           >
//             <ChevronLeft size={16} />
//           </button>
//           <span className="text-sm font-semibold text-stone-700 min-w-28 text-center">
//             {monthLabel(month)}
//           </span>
//           <button
//             onClick={() => onMonthChange(nextMonth(month))}
//             disabled={month >= currentMonthStr()}
//             className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 disabled:opacity-30"
//           >
//             <ChevronRight size={16} />
//           </button>
//         </div>
//       </div>

//       {/* Stat pills */}
//       <div className="grid grid-cols-3 gap-3">
//         {[
//           {
//             label: t("attendance.present"),
//             val: stats.present,
//             color: "text-emerald-600 bg-emerald-50 border-emerald-200",
//           },
//           {
//             label: t("attendance.onLeave"),
//             val: stats.onLeave,
//             color: "text-blue-600 bg-blue-50 border-blue-200",
//           },
//           {
//             label: t("attendance.avgHours"),
//             val: stats.avgDur,
//             color: "text-stone-600 bg-stone-50 border-stone-200",
//           },
//         ].map((s) => (
//           <div
//             key={s.label}
//             className={`rounded-xl border p-3 text-center ${s.color}`}
//           >
//             <p className="text-lg font-bold font-mono">{s.val}</p>
//             <p className="text-[10px] font-medium mt-0.5">{s.label}</p>
//           </div>
//         ))}
//       </div>

//       {/* Records list */}
//       {loading ? (
//         <div className="text-center py-8">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
//         </div>
//       ) : records.length === 0 ? (
//         <div className="text-center py-10 text-stone-400 text-sm">
//           {t("attendance.noRecords")}
//         </div>
//       ) : (
//         <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
//           {records.map((r) => (
//             <div
//               key={r.id}
//               className="flex items-center justify-between bg-stone-50 rounded-xl px-4 py-3"
//             >
//               <div className="flex items-center gap-3">
//                 <span
//                   className={`w-2 h-2 rounded-full flex-shrink-0 ${
//                     r.status === "on_leave"
//                       ? "bg-blue-400"
//                       : r.clock_out
//                         ? "bg-emerald-400"
//                         : "bg-amber-400"
//                   }`}
//                 />
//                 <div>
//                   <p className="text-xs font-semibold text-stone-700">
//                     {new Date(r.date).toLocaleDateString("en-IN", {
//                       weekday: "short",
//                       day: "numeric",
//                       month: "short",
//                     })}
//                   </p>
//                   {r.status === "on_leave" ? (
//                     <p className="text-[10px] text-blue-500">
//                       {t("attendance.onLeave")}
//                     </p>
//                   ) : (
//                     <p className="text-[10px] text-stone-400">
//                       {fmt(r.clock_in)} → {fmt(r.clock_out)}
//                     </p>
//                   )}
//                 </div>
//               </div>
//               <span className="text-xs font-mono font-bold text-stone-500">
//                 {fmtDuration(r.duration_minutes)}
//               </span>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* My leave requests */}
//       <div>
//         <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
//           {t("attendance.myLeaveRequests")}
//         </h4>
//         {leaves.length === 0 ? (
//           <p className="text-xs text-stone-400 text-center py-4">
//             {t("attendance.noLeaveRequests")}
//           </p>
//         ) : (
//           <div className="space-y-2">
//             {leaves.slice(0, 5).map((l) => (
//               <div
//                 key={l.id}
//                 className="flex items-center justify-between bg-stone-50 rounded-xl px-4 py-3"
//               >
//                 <div className="flex items-center gap-3">
//                   <span
//                     className={`w-2 h-2 rounded-full ${LEAVE_COLORS[l.leave_type]?.dot || "bg-stone-400"}`}
//                   />
//                   <div>
//                     <p className="text-xs font-semibold text-stone-700">
//                       {l.date_from === l.date_to
//                         ? l.date_from
//                         : `${l.date_from} → ${l.date_to}`}
//                       <span className="ml-1 text-stone-400">
//                         ({l.days_count}d)
//                       </span>
//                     </p>
//                     <p className="text-[10px] text-stone-400 capitalize">
//                       {t(`attendance.leaveTypes.${l.leave_type}`)}
//                     </p>
//                   </div>
//                 </div>
//                 <span
//                   className={`text-[10px] font-bold px-2 py-1 rounded-full border capitalize ${STATUS_COLORS[l.status]}`}
//                 >
//                   {t(`attendance.leaveStatus.${l.status}`)}
//                 </span>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // ── Staff View (combined) ─────────────────────────────────────
// const StaffView = () => {
//   const { t } = useTranslation();
//   const { token } = useAuth();
//   const [today, setToday] = useState(null);
//   const [showLeave, setShowLeave] = useState(false);
//   const [month, setMonth] = useState(currentMonthStr());

//   const fetchToday = useCallback(async () => {
//     try {
//       const res = await axios.get(`${API_URL}/attendance/today`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setToday(res.data);
//     } catch {
//       toast.error(t("attendance.loadFailed"));
//     }
//   }, [token]);

//   useEffect(() => {
//     fetchToday();
//   }, [fetchToday]);

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//       {/* Left — clock panel + leave button */}
//       <div className="space-y-4">
//         <ClockPanel today={today} onAction={fetchToday} />
//         <Button
//           onClick={() => setShowLeave(true)}
//           variant="outline"
//           className="w-full rounded-2xl h-12 border-2 border-stone-200 gap-2 text-stone-600 hover:border-primary hover:text-primary"
//         >
//           <Calendar size={18} />
//           {t("attendance.requestLeave")}
//         </Button>
//       </div>

//       {/* Right — history */}
//       <div className="bg-white border-2 border-stone-200 rounded-3xl p-6">
//         <MyHistory month={month} onMonthChange={setMonth} />
//       </div>

//       <AnimatePresence>
//         {showLeave && (
//           <LeaveModal
//             onClose={() => setShowLeave(false)}
//             onSaved={fetchToday}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// // ═════════════════════════════════════════════════════════════
// //  ADMIN VIEW COMPONENTS
// // ═════════════════════════════════════════════════════════════

// // ── Leave Approval Row ────────────────────────────────────────
// const LeaveRow = ({ leave, onAction }) => {
//   const { t } = useTranslation();
//   const { token } = useAuth();
//   const [loading, setLoading] = useState(false);

//   const act = async (action) => {
//     setLoading(true);
//     try {
//       await axios.put(
//         `${API_URL}/leaves/${leave.id}/${action}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } },
//       );
//       toast.success(
//         action === "approve"
//           ? t("attendance.leaveApproved")
//           : t("attendance.leaveRejected"),
//       );
//       onAction();
//     } catch (err) {
//       toast.error(err.response?.data?.detail || t("attendance.actionFailed"));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const lc = LEAVE_COLORS[leave.leave_type] || LEAVE_COLORS.other;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 8 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="bg-white border border-stone-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4"
//     >
//       <div className="flex items-center gap-3 flex-1 min-w-0">
//         <div className="p-2 bg-stone-100 rounded-xl flex-shrink-0">
//           <User size={18} className="text-stone-500" />
//         </div>
//         <div className="min-w-0">
//           <p className="text-sm font-bold text-stone-800 truncate">
//             {leave.user_name}
//           </p>
//           <p className="text-xs text-stone-500">
//             {leave.date_from === leave.date_to
//               ? leave.date_from
//               : `${leave.date_from} → ${leave.date_to}`}{" "}
//             · {leave.days_count}{" "}
//             {leave.days_count === 1
//               ? t("attendance.day")
//               : t("attendance.days")}
//           </p>
//           <p className="text-xs text-stone-400 mt-0.5 line-clamp-1 italic">
//             "{leave.reason}"
//           </p>
//         </div>
//       </div>

//       <div className="flex items-center gap-2 flex-shrink-0">
//         <span
//           className={`text-[10px] font-bold px-2.5 py-1 rounded-full border capitalize ${lc.badge}`}
//         >
//           {t(`attendance.leaveTypes.${leave.leave_type}`)}
//         </span>
//         {leave.status === "pending" ? (
//           <>
//             <button
//               onClick={() => act("approve")}
//               disabled={loading}
//               className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors"
//             >
//               <CheckCircle2 size={13} /> {t("attendance.approve")}
//             </button>
//             <button
//               onClick={() => act("reject")}
//               disabled={loading}
//               className="flex items-center gap-1 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-lg transition-colors"
//             >
//               <XCircle size={13} /> {t("attendance.reject")}
//             </button>
//           </>
//         ) : (
//           <span
//             className={`text-[10px] font-bold px-2.5 py-1 rounded-full border capitalize ${STATUS_COLORS[leave.status]}`}
//           >
//             {t(`attendance.leaveStatus.${leave.status}`)}
//           </span>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// // ── Staff Detail Modal ────────────────────────────────────────
// const StaffDetailModal = ({ staff, month, onClose }) => {
//   const { t } = useTranslation();
//   const { token } = useAuth();
//   const [records, setRecords] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     axios
//       .get(`${API_URL}/attendance/staff/${staff.user_id}?month=${month}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((r) => setRecords(r.data))
//       .catch(() => {})
//       .finally(() => setLoading(false));
//   }, [staff.user_id, month]);

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
//       onClick={onClose}
//     >
//       <motion.div
//         initial={{ scale: 0.93, y: 16 }}
//         animate={{ scale: 1, y: 0 }}
//         className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex items-center justify-between px-7 py-5 border-b border-stone-100 flex-shrink-0">
//           <div>
//             <h2 className="text-lg font-bold text-stone-800">
//               {staff.user_name}
//             </h2>
//             <p className="text-xs text-stone-400">{monthLabel(month)}</p>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 rounded-full hover:bg-stone-100 text-stone-400"
//           >
//             <X size={18} />
//           </button>
//         </div>

//         <div className="px-7 py-5 overflow-y-auto">
//           {/* Summary */}
//           <div className="grid grid-cols-3 gap-3 mb-5">
//             {[
//               {
//                 label: t("attendance.present"),
//                 val: staff.days_present,
//                 color: "text-emerald-600",
//               },
//               {
//                 label: t("attendance.onLeave"),
//                 val: staff.days_on_leave,
//                 color: "text-blue-600",
//               },
//               {
//                 label: t("attendance.avgHours"),
//                 val: fmtDuration(staff.avg_duration_minutes),
//                 color: "text-stone-600",
//               },
//             ].map((s) => (
//               <div
//                 key={s.label}
//                 className="bg-stone-50 rounded-xl p-3 text-center"
//               >
//                 <p className={`text-xl font-bold font-mono ${s.color}`}>
//                   {s.val}
//                 </p>
//                 <p className="text-[10px] text-stone-400 mt-0.5">{s.label}</p>
//               </div>
//             ))}
//           </div>

//           {loading ? (
//             <div className="text-center py-8">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
//             </div>
//           ) : records.length === 0 ? (
//             <p className="text-center text-stone-400 text-sm py-6">
//               {t("attendance.noRecords")}
//             </p>
//           ) : (
//             <div className="space-y-2">
//               {records.map((r) => (
//                 <div
//                   key={r.id}
//                   className="flex items-center justify-between bg-stone-50 rounded-xl px-4 py-3"
//                 >
//                   <div className="flex items-center gap-3">
//                     <span
//                       className={`w-2 h-2 rounded-full ${r.status === "on_leave" ? "bg-blue-400" : r.clock_out ? "bg-emerald-400" : "bg-amber-400"}`}
//                     />
//                     <div>
//                       <p className="text-xs font-semibold text-stone-700">
//                         {new Date(r.date).toLocaleDateString("en-IN", {
//                           weekday: "short",
//                           day: "numeric",
//                           month: "short",
//                         })}
//                       </p>
//                       {r.status === "on_leave" ? (
//                         <p className="text-[10px] text-blue-500">
//                           {t("attendance.onLeave")}
//                         </p>
//                       ) : (
//                         <p className="text-[10px] text-stone-400">
//                           {fmt(r.clock_in)} → {fmt(r.clock_out)}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                   <span className="text-xs font-mono font-bold text-stone-500">
//                     {fmtDuration(r.duration_minutes)}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// // ── Admin View ────────────────────────────────────────────────
// const AdminView = () => {
//   const { t } = useTranslation();
//   const { token } = useAuth();
//   const [month, setMonth] = useState(currentMonthStr());
//   const [summary, setSummary] = useState([]);
//   const [leaves, setLeaves] = useState([]);
//   const [loadingSum, setLoadingSum] = useState(true);
//   const [loadingLv, setLoadingLv] = useState(true);
//   const [activeTab, setActiveTab] = useState("summary"); // 'summary' | 'leaves'
//   const [detail, setDetail] = useState(null); // staff summary object

//   const fetchSummary = useCallback(async () => {
//     setLoadingSum(true);
//     try {
//       const res = await axios.get(
//         `${API_URL}/attendance/summary?month=${month}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         },
//       );
//       setSummary(res.data.summary);
//     } catch {
//       toast.error(t("attendance.loadFailed"));
//     } finally {
//       setLoadingSum(false);
//     }
//   }, [month, token]);

//   const fetchLeaves = useCallback(async () => {
//     setLoadingLv(true);
//     try {
//       const res = await axios.get(`${API_URL}/leaves`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setLeaves(res.data);
//     } catch {
//     } finally {
//       setLoadingLv(false);
//     }
//   }, [token]);

//   useEffect(() => {
//     fetchSummary();
//   }, [fetchSummary]);
//   useEffect(() => {
//     fetchLeaves();
//   }, [fetchLeaves]);

//   const pendingLeaves = leaves.filter((l) => l.status === "pending");

//   return (
//     <div className="space-y-6">
//       {/* Tabs */}
//       <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-full w-fit">
//         {[
//           {
//             key: "summary",
//             label: t("attendance.monthlySummary"),
//             icon: TrendingUp,
//           },
//           {
//             key: "leaves",
//             label: t("attendance.leaveRequests"),
//             icon: ClipboardList,
//             badge: pendingLeaves.length,
//           },
//         ].map((tab) => {
//           const Icon = tab.icon;
//           return (
//             <button
//               key={tab.key}
//               onClick={() => setActiveTab(tab.key)}
//               className={`flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-full transition-all ${
//                 activeTab === tab.key
//                   ? "bg-white text-primary shadow-sm"
//                   : "text-stone-500 hover:text-stone-700"
//               }`}
//             >
//               <Icon size={15} />
//               {tab.label}
//               {tab.badge > 0 && (
//                 <span className="ml-1 text-[10px] bg-amber-400 text-white font-bold px-1.5 py-0.5 rounded-full">
//                   {tab.badge}
//                 </span>
//               )}
//             </button>
//           );
//         })}
//       </div>

//       {/* Monthly Summary Tab */}
//       {activeTab === "summary" && (
//         <div className="space-y-4">
//           {/* Month selector */}
//           <div className="flex items-center justify-between">
//             <h3 className="text-sm font-bold text-stone-700">
//               {t("attendance.allStaff")}
//             </h3>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => setMonth(prevMonth(month))}
//                 className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500"
//               >
//                 <ChevronLeft size={16} />
//               </button>
//               <span className="text-sm font-semibold text-stone-700 min-w-32 text-center">
//                 {monthLabel(month)}
//               </span>
//               <button
//                 onClick={() => setMonth(nextMonth(month))}
//                 disabled={month >= currentMonthStr()}
//                 className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 disabled:opacity-30"
//               >
//                 <ChevronRight size={16} />
//               </button>
//             </div>
//           </div>

//           {loadingSum ? (
//             <div className="text-center py-16">
//               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto" />
//             </div>
//           ) : (
//             <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="bg-stone-800 text-white text-xs">
//                     <th className="text-left px-5 py-3 font-semibold rounded-tl-2xl">
//                       {t("attendance.staffMember")}
//                     </th>
//                     <th className="px-4 py-3 text-center font-semibold">
//                       {t("attendance.role")}
//                     </th>
//                     <th className="px-4 py-3 text-center font-semibold">
//                       {t("attendance.present")}
//                     </th>
//                     <th className="px-4 py-3 text-center font-semibold">
//                       {t("attendance.onLeave")}
//                     </th>
//                     <th className="px-4 py-3 text-center font-semibold">
//                       {t("attendance.avgHours")}
//                     </th>
//                     <th className="px-4 py-3 text-center font-semibold rounded-tr-2xl">
//                       {t("attendance.details")}
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {summary.length === 0 ? (
//                     <tr>
//                       <td
//                         colSpan={6}
//                         className="text-center py-12 text-stone-400"
//                       >
//                         {t("attendance.noRecords")}
//                       </td>
//                     </tr>
//                   ) : (
//                     summary.map((s, i) => (
//                       <tr
//                         key={s.user_id}
//                         className={`border-t border-stone-100 hover:bg-stone-50 transition-colors ${i % 2 === 0 ? "" : "bg-stone-50/50"}`}
//                       >
//                         <td className="px-5 py-3">
//                           <p className="font-semibold text-stone-800">
//                             {s.user_name}
//                           </p>
//                           <p className="text-[10px] text-stone-400">
//                             {s.user_email}
//                           </p>
//                         </td>
//                         <td className="px-4 py-3 text-center">
//                           <span className="text-[10px] font-semibold bg-stone-100 text-stone-600 px-2 py-1 rounded-full capitalize">
//                             {s.role}
//                           </span>
//                         </td>
//                         <td className="px-4 py-3 text-center">
//                           <span className="font-mono font-bold text-emerald-600">
//                             {s.days_present}
//                           </span>
//                           {s.days_clocked_in_only > 0 && (
//                             <span className="ml-1 text-[10px] text-amber-500">
//                               +{s.days_clocked_in_only}
//                             </span>
//                           )}
//                         </td>
//                         <td className="px-4 py-3 text-center">
//                           <span className="font-mono font-bold text-blue-600">
//                             {s.days_on_leave}
//                           </span>
//                         </td>
//                         <td className="px-4 py-3 text-center">
//                           <span className="font-mono text-stone-600">
//                             {fmtDuration(s.avg_duration_minutes)}
//                           </span>
//                         </td>
//                         <td className="px-4 py-3 text-center">
//                           <button
//                             onClick={() => setDetail(s)}
//                             className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-primary transition-colors"
//                           >
//                             <Eye size={16} />
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Leave Requests Tab */}
//       {activeTab === "leaves" && (
//         <div className="space-y-4">
//           {/* Pending first */}
//           {pendingLeaves.length > 0 && (
//             <div>
//               <h4 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-3 flex items-center gap-2">
//                 <AlertCircle size={13} /> {t("attendance.pendingApproval")} (
//                 {pendingLeaves.length})
//               </h4>
//               <div className="space-y-2">
//                 {pendingLeaves.map((l) => (
//                   <LeaveRow key={l.id} leave={l} onAction={fetchLeaves} />
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* All other leaves */}
//           {leaves.filter((l) => l.status !== "pending").length > 0 && (
//             <div>
//               <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
//                 {t("attendance.processed")}
//               </h4>
//               <div className="space-y-2">
//                 {leaves
//                   .filter((l) => l.status !== "pending")
//                   .map((l) => (
//                     <LeaveRow key={l.id} leave={l} onAction={fetchLeaves} />
//                   ))}
//               </div>
//             </div>
//           )}

//           {leaves.length === 0 && !loadingLv && (
//             <div className="text-center py-16 text-stone-400">
//               <ClipboardList
//                 size={36}
//                 className="mx-auto mb-3 text-stone-300"
//               />
//               <p className="text-sm">{t("attendance.noLeaveRequests")}</p>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Staff detail modal */}
//       <AnimatePresence>
//         {detail && (
//           <StaffDetailModal
//             staff={detail}
//             month={month}
//             onClose={() => setDetail(null)}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// // ═════════════════════════════════════════════════════════════
// //  MAIN PAGE
// // ═════════════════════════════════════════════════════════════

// const Attendance = () => {
//   const { t } = useTranslation();
//   const { user } = useAuth();
//   const isAdminOrManager = ["admin", "manager"].includes(user?.role);

//   return (
//     <div className="p-4 md:p-6 lg:p-8" data-testid="attendance-page">
//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//       >
//         {/* Header */}
//         <div className="flex items-center gap-3 mb-8">
//           <div className="p-2.5 bg-primary/10 rounded-xl">
//             <Clock size={22} className="text-primary" strokeWidth={1.5} />
//           </div>
//           <div>
//             <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
//               {t("attendance.title")}
//             </h1>
//             <p className="text-stone-500 text-sm mt-0.5">
//               {t("attendance.subtitle")}
//             </p>
//           </div>
//         </div>

//         {isAdminOrManager ? <AdminView /> : <StaffView />}
//       </motion.div>
//     </div>
//   );
// };

// export default Attendance;

import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  LogIn,
  LogOut,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  User,
  Users,
  TrendingUp,
  Eye,
  X,
  ClipboardList,
  Hourglass,
  RefreshCw,
  Timer,
  UserCheck,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

// ── Helpers ───────────────────────────────────────────────────
const fmt = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
const fmtDuration = (mins) => {
  if (!mins) return "—";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};
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

const LEAVE_TYPES = ["sick", "casual", "emergency", "other"];
const LEAVE_COLORS = {
  sick: {
    badge: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    dot: "bg-rose-400",
    light: "bg-rose-50 text-rose-700 border-rose-200",
  },
  casual: {
    badge: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    dot: "bg-blue-400",
    light: "bg-blue-50 text-blue-700 border-blue-200",
  },
  emergency: {
    badge: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    dot: "bg-orange-400",
    light: "bg-orange-50 text-orange-700 border-orange-200",
  },
  other: {
    badge: "bg-stone-500/15 text-stone-400 border-stone-500/30",
    dot: "bg-stone-400",
    light: "bg-stone-100 text-stone-600 border-stone-200",
  },
};
const STATUS_COLORS = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
};
const ROLE_COLORS = {
  admin: "bg-amber-500/15 text-amber-400",
  manager: "bg-blue-500/15 text-blue-400",
  billing: "bg-emerald-500/15 text-emerald-400",
  staff: "bg-stone-500/15 text-stone-400",
};

// ── Live Clock ─────────────────────────────────────────────────
const LiveClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="text-center">
      <p className="text-5xl font-mono font-black tracking-tight text-white">
        {time.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })}
      </p>
      <p className="text-stone-400 text-sm mt-1.5">
        {time.toLocaleDateString("en-IN", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>
    </div>
  );
};

// ── Clock In/Out Panel ─────────────────────────────────────────
const ClockPanel = ({ todayData, onClock }) => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const record = todayData?.record;
  const onLeave = todayData?.on_approved_leave;
  const clockedIn = !!record?.clock_in;
  const clockedOut = !!record?.clock_out;

  const handleClock = async (type) => {
    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/attendance/${type}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(
        type === "clock-in"
          ? t("attendance.clockedInSuccess")
          : t("attendance.clockedOutSuccess"),
      );
      await onClock();
    } catch (err) {
      toast.error(err.response?.data?.detail || t("attendance.actionFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1c1c2e] border border-white/10 rounded-2xl p-7 flex flex-col items-center gap-6 shadow-xl relative overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          background:
            clockedIn && !clockedOut
              ? "radial-gradient(circle at 50% 80%, #10b981 0%, transparent 60%)"
              : "radial-gradient(circle at 50% 80%, #f59e0b 0%, transparent 60%)",
        }}
      />

      <div className="relative">
        <LiveClock />
      </div>

      {/* Status pill */}
      <div>
        {onLeave ? (
          <span className="flex items-center gap-2 text-sm font-semibold text-blue-400 bg-blue-500/15 border border-blue-500/30 px-4 py-2 rounded-full">
            <Calendar size={14} />
            {t("attendance.onApprovedLeave")}
          </span>
        ) : clockedOut ? (
          <span className="flex items-center gap-2 text-sm font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-4 py-2 rounded-full">
            <CheckCircle2 size={14} />
            {t("attendance.shiftComplete")}
          </span>
        ) : clockedIn ? (
          <span className="flex items-center gap-2 text-sm font-semibold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-4 py-2 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {t("attendance.currentlyWorking")} · {fmt(record.clock_in)}
          </span>
        ) : (
          <span className="flex items-center gap-2 text-sm font-semibold text-stone-400 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
            <Hourglass size={14} />
            {t("attendance.notClockedIn")}
          </span>
        )}
      </div>

      {/* Big clock button */}
      {!onLeave && !clockedOut && (
        <button
          onClick={() => handleClock(clockedIn ? "clock-out" : "clock-in")}
          disabled={loading}
          className={`relative w-36 h-36 rounded-full font-black text-white shadow-2xl transition-all active:scale-95 flex flex-col items-center justify-center gap-2 text-sm
            ${clockedIn ? "bg-gradient-to-br from-rose-500 to-rose-600 shadow-rose-900/50" : "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-900/50"}
            ${loading ? "opacity-60" : "hover:scale-105"}`}
        >
          {clockedIn ? <LogOut size={28} /> : <LogIn size={28} />}
          {loading ? (
            <RefreshCw size={14} className="animate-spin" />
          ) : clockedIn ? (
            t("attendance.clockOut")
          ) : (
            t("attendance.clockIn")
          )}
          {clockedIn && !loading && (
            <span className="absolute inset-0 rounded-full border-4 border-rose-400 animate-ping opacity-20" />
          )}
        </button>
      )}

      {/* In/Out/Duration row */}
      {(clockedIn || clockedOut) && (
        <div className="grid grid-cols-3 gap-4 w-full pt-5 border-t border-white/10">
          {[
            {
              label: t("attendance.in"),
              val: fmt(record?.clock_in),
              color: "text-emerald-400",
            },
            {
              label: t("attendance.out"),
              val: fmt(record?.clock_out),
              color: "text-rose-400",
            },
            {
              label: t("attendance.duration"),
              val: fmtDuration(record?.duration_minutes),
              color: "text-amber-400",
            },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <p className="text-[10px] text-stone-500 uppercase tracking-wider mb-1">
                {item.label}
              </p>
              <p className={`font-mono font-black text-sm ${item.color}`}>
                {item.val}
              </p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

// ── Leave Request Modal ───────────────────────────────────────
const LeaveModal = ({ onClose, onSaved }) => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({
    date_from: today,
    date_to: today,
    leave_type: "casual",
    reason: "",
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.reason.trim()) {
      toast.error(t("attendance.reasonRequired"));
      return;
    }
    setSaving(true);
    try {
      await axios.post(`${API_URL}/leaves`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(t("attendance.leaveSubmitted"));
      await onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.detail || t("attendance.leaveFailed"));
    } finally {
      setSaving(false);
    }
  };

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
            <div className="p-2 bg-blue-500/15 rounded-xl">
              <Calendar size={17} className="text-blue-400" />
            </div>
            <h2 className="text-base font-bold text-white">
              {t("attendance.requestLeave")}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              ["from", "date_from", today],
              ["to", "date_to", form.date_from],
            ].map(([lbl, key, min]) => (
              <div key={key}>
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2 block">
                  {t(`attendance.${lbl}`)}
                </label>
                <input
                  type="date"
                  value={form[key]}
                  min={min}
                  onChange={(e) => set(key, e.target.value)}
                  className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-stone-300 text-sm outline-none focus:ring-2 focus:ring-amber-500/40"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2 block">
              {t("attendance.leaveType")}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {LEAVE_TYPES.map((lt) => (
                <button
                  key={lt}
                  onClick={() => set("leave_type", lt)}
                  className={`py-2.5 px-3 rounded-xl border-2 text-xs font-bold capitalize transition-all ${
                    form.leave_type === lt
                      ? `${LEAVE_COLORS[lt].badge} border-current`
                      : "border-white/10 text-stone-500 hover:border-white/20"
                  }`}
                >
                  {t(`attendance.leaveTypes.${lt}`)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2 block">
              {t("attendance.reason")}
            </label>
            <textarea
              value={form.reason}
              onChange={(e) => set("reason", e.target.value)}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-stone-300 text-sm resize-none outline-none focus:ring-2 focus:ring-amber-500/40 placeholder-stone-600"
              placeholder={t("attendance.reasonPlaceholder")}
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-white/10 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-xl border border-white/10 text-stone-400 hover:text-white hover:border-white/20 text-sm font-semibold transition-all"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 h-11 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-900 font-black text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw size={13} className="animate-spin" />
                {t("common.loading")}
              </>
            ) : (
              t("attendance.submitLeave")
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── My Attendance History ──────────────────────────────────────
const MyHistory = ({ month, onMonthChange, myRecords, myLeaves, loading }) => {
  const { t } = useTranslation();
  const stats = useMemo(() => {
    const durations = myRecords
      .filter((r) => r.duration_minutes)
      .map((r) => r.duration_minutes);
    return {
      present: myRecords.filter((r) => r.status === "present").length,
      onLeave: myRecords.filter((r) => r.status === "on_leave").length,
      avgDur: fmtDuration(
        durations.length > 0
          ? Math.round(durations.reduce((s, d) => s + d, 0) / durations.length)
          : 0,
      ),
    };
  }, [myRecords]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">
          {t("attendance.myHistory")}
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onMonthChange(prevMonth(month))}
            className="p-1.5 rounded-lg hover:bg-white/10 text-stone-500 hover:text-white transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-xs font-bold text-stone-300 min-w-28 text-center">
            {monthLabel(month)}
          </span>
          <button
            onClick={() => onMonthChange(nextMonth(month))}
            disabled={month >= currentMonthStr()}
            className="p-1.5 rounded-lg hover:bg-white/10 text-stone-500 hover:text-white transition-colors disabled:opacity-30"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          {
            label: t("attendance.present"),
            val: stats.present,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10 border-emerald-500/20",
          },
          {
            label: t("attendance.onLeave"),
            val: stats.onLeave,
            color: "text-blue-400",
            bg: "bg-blue-500/10 border-blue-500/20",
          },
          {
            label: t("attendance.avgHours"),
            val: stats.avgDur,
            color: "text-amber-400",
            bg: "bg-amber-500/10 border-amber-500/20",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`rounded-xl border p-3 text-center ${s.bg}`}
          >
            <p className={`text-lg font-black font-mono ${s.color}`}>{s.val}</p>
            <p className="text-[10px] text-stone-500 font-medium mt-0.5">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <RefreshCw size={20} className="animate-spin text-stone-500" />
        </div>
      ) : myRecords.length === 0 ? (
        <p className="text-center text-stone-500 text-xs py-8">
          {t("attendance.noRecords")}
        </p>
      ) : (
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {myRecords.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between bg-white/5 hover:bg-white/8 rounded-xl px-3 py-2.5 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${r.status === "on_leave" ? "bg-blue-400" : r.clock_out ? "bg-emerald-400" : "bg-amber-400"}`}
                />
                <div>
                  <p className="text-xs font-semibold text-stone-300">
                    {new Date(r.date).toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                  {r.status === "on_leave" ? (
                    <p className="text-[10px] text-blue-400">
                      {t("attendance.onLeave")}
                    </p>
                  ) : (
                    <p className="text-[10px] text-stone-500 font-mono">
                      {fmt(r.clock_in)} → {fmt(r.clock_out)}
                    </p>
                  )}
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-stone-400">
                {fmtDuration(r.duration_minutes)}
              </span>
            </div>
          ))}
        </div>
      )}

      <div>
        <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-3">
          {t("attendance.myLeaveRequests")}
        </p>
        {myLeaves.length === 0 ? (
          <p className="text-center text-stone-500 text-xs py-4">
            {t("attendance.noLeaveRequests")}
          </p>
        ) : (
          <div className="space-y-1.5">
            {myLeaves.slice(0, 5).map((l) => (
              <div
                key={l.id}
                className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${LEAVE_COLORS[l.leave_type]?.dot}`}
                  />
                  <div>
                    <p className="text-xs font-semibold text-stone-300">
                      {l.date_from === l.date_to
                        ? l.date_from
                        : `${l.date_from} → ${l.date_to}`}
                      <span className="ml-1 text-stone-500">
                        ({l.days_count}d)
                      </span>
                    </p>
                    <p className="text-[10px] text-stone-500 capitalize">
                      {t(`attendance.leaveTypes.${l.leave_type}`)}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${STATUS_COLORS[l.status]}`}
                >
                  {t(`attendance.leaveStatus.${l.status}`)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Leave Row (admin) ─────────────────────────────────────────
const LeaveRow = ({ leave, onAction }) => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const act = async (action) => {
    setLoading(true);
    try {
      await axios.put(
        `${API_URL}/leaves/${leave.id}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(
        action === "approve"
          ? t("attendance.leaveApproved")
          : t("attendance.leaveRejected"),
      );
      await onAction();
    } catch (err) {
      toast.error(err.response?.data?.detail || t("attendance.actionFailed"));
    } finally {
      setLoading(false);
    }
  };

  const lc = LEAVE_COLORS[leave.leave_type] || LEAVE_COLORS.other;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-stone-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-black text-stone-600">
            {leave.user_name?.charAt(0)}
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-stone-800 truncate">
            {leave.user_name}
          </p>
          <p className="text-xs text-stone-500">
            {leave.date_from === leave.date_to
              ? leave.date_from
              : `${leave.date_from} → ${leave.date_to}`}{" "}
            · {leave.days_count}{" "}
            {leave.days_count === 1
              ? t("attendance.day")
              : t("attendance.days")}
          </p>
          {leave.reason && (
            <p className="text-[10px] text-stone-400 mt-0.5 line-clamp-1 italic">
              "{leave.reason}"
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span
          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border capitalize ${lc.light}`}
        >
          {t(`attendance.leaveTypes.${leave.leave_type}`)}
        </span>
        {leave.status === "pending" ? (
          <>
            <button
              onClick={() => act("approve")}
              disabled={loading}
              className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <CheckCircle2 size={12} />
              {t("attendance.approve")}
            </button>
            <button
              onClick={() => act("reject")}
              disabled={loading}
              className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <XCircle size={12} />
              {t("attendance.reject")}
            </button>
          </>
        ) : (
          <span
            className={`text-[10px] font-bold px-2.5 py-1 rounded-full border capitalize ${STATUS_COLORS[leave.status]}`}
          >
            {t(`attendance.leaveStatus.${leave.status}`)}
          </span>
        )}
      </div>
    </motion.div>
  );
};

// ── Staff Detail Modal ────────────────────────────────────────
const StaffDetailModal = ({ staff, month, onClose }) => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/attendance/staff/${staff.user_id}?month=${month}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => setRecords(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [staff.user_id, month]);

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
        className="bg-[#1c1c2e] border border-white/10 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center">
              <span className="text-amber-400 font-black">
                {staff.user_name?.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                {staff.user_name}
              </h2>
              <p className="text-[10px] text-stone-500">
                {monthLabel(month)} · {t("attendance.attendanceDetails")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-4 flex-shrink-0 grid grid-cols-3 gap-3 border-b border-white/10">
          {[
            {
              label: t("attendance.present"),
              val: staff.days_present,
              color: "text-emerald-400",
              bg: "bg-emerald-500/10",
            },
            {
              label: t("attendance.onLeave"),
              val: staff.days_on_leave,
              color: "text-blue-400",
              bg: "bg-blue-500/10",
            },
            {
              label: t("attendance.avgHours"),
              val: fmtDuration(staff.avg_duration_minutes),
              color: "text-amber-400",
              bg: "bg-amber-500/10",
            },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
              <p className={`font-black font-mono text-base ${s.color}`}>
                {s.val}
              </p>
              <p className="text-[10px] text-stone-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="flex justify-center py-10">
              <RefreshCw size={20} className="animate-spin text-stone-500" />
            </div>
          ) : records.length === 0 ? (
            <p className="text-center text-stone-500 text-xs py-10">
              {t("attendance.noRecords")}
            </p>
          ) : (
            <div className="space-y-1.5">
              {records.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${r.status === "on_leave" ? "bg-blue-400" : r.clock_out ? "bg-emerald-400" : "bg-amber-400"}`}
                    />
                    <div>
                      <p className="text-xs font-semibold text-stone-300">
                        {new Date(r.date).toLocaleDateString("en-IN", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                      {r.status === "on_leave" ? (
                        <p className="text-[10px] text-blue-400">
                          {t("attendance.onLeave")}
                        </p>
                      ) : (
                        <p className="text-[10px] text-stone-500 font-mono">
                          {fmt(r.clock_in)} → {fmt(r.clock_out)}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-stone-400">
                    {fmtDuration(r.duration_minutes)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Main Page ──────────────────────────────────────────────────
const Attendance = () => {
  const { token, user } = useAuth();
  const { t } = useTranslation();
  const isAdminOrManager = ["admin", "manager"].includes(user?.role);
  const isStaff = !isAdminOrManager;

  const [todayData, setTodayData] = useState(null);
  const [myRecords, setMyRecords] = useState([]);
  const [myLeaves, setMyLeaves] = useState([]);
  const [summary, setSummary] = useState([]);
  const [allLeaves, setAllLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLeave, setShowLeave] = useState(false);
  const [detail, setDetail] = useState(null);
  const [activeTab, setActiveTab] = useState("summary");
  const [adminMonth, setAdminMonth] = useState(currentMonthStr());
  const [myMonth, setMyMonth] = useState(currentMonthStr());

  const headers = { Authorization: `Bearer ${token}` };

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const calls = [
        axios.get(`${API_URL}/attendance/today`, { headers }),
        axios.get(`${API_URL}/attendance/my?month=${myMonth}`, { headers }),
        axios.get(`${API_URL}/leaves`, { headers }),
      ];
      if (isAdminOrManager) {
        calls.push(
          axios.get(`${API_URL}/attendance/summary?month=${adminMonth}`, {
            headers,
          }),
        );
        calls.push(axios.get(`${API_URL}/leaves`, { headers }));
      }
      const results = await Promise.allSettled(calls);
      const safe = (r, key) => {
        if (r.status !== "fulfilled") return [];
        const d = r.value.data;
        if (key && d && typeof d === "object" && !Array.isArray(d))
          return d[key] ?? [];
        return Array.isArray(d) ? d : [];
      };
      setTodayData(
        results[0].status === "fulfilled" ? results[0].value.data : null,
      );
      setMyRecords(safe(results[1]));
      setMyLeaves(safe(results[2]));
      if (isAdminOrManager) {
        setSummary(safe(results[3], "summary"));
        setAllLeaves(safe(results[4]));
      }
    } catch {
      toast.error(t("attendance.loadError"));
    } finally {
      setLoading(false);
    }
  }, [myMonth, adminMonth, token]);

  useEffect(() => {
    refresh();
  }, [myMonth, adminMonth]);

  const pendingLeaves = allLeaves.filter((l) => l.status === "pending");

  // Quick stats for hero
  const todayPresent = summary.filter((s) => s.days_present > 0).length;
  const todayOnLeave = summary.filter((s) => s.days_on_leave > 0).length;

  if (loading && !todayData)
    return (
      <div className="flex items-center justify-center h-full bg-[#f7f6f3]">
        <div className="text-center">
          <div className="relative w-14 h-14 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-amber-100" />
            <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
          </div>
          <p className="text-stone-400 text-sm">{t("attendance.loading")}</p>
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
              "radial-gradient(circle at 80% 40%, #f59e0b 0%, transparent 50%), radial-gradient(circle at 15% 80%, #10b981 0%, transparent 40%)",
          }}
        />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/15 rounded-2xl border border-amber-500/20">
              <Clock size={24} className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                {t("attendance.title")}
              </h1>
              <p className="text-stone-400 text-sm mt-0.5">
                {t("attendance.subtitle")}
              </p>
            </div>
          </div>
          {isStaff && (
            <button
              onClick={() => setShowLeave(true)}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-900 font-black text-sm px-5 py-3 rounded-xl transition-all shadow-lg shadow-amber-900/30 active:scale-95"
            >
              <Calendar size={15} />
              {t("attendance.requestLeave")}
            </button>
          )}
        </div>

        {/* Quick stats strip (admin only) */}
        {isAdminOrManager && (
          <div className="relative mt-5 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                label: "Total Staff",
                value: summary.length,
                color: "text-stone-300",
              },
              {
                label: "Present Today",
                value: todayPresent,
                color: "text-emerald-400",
              },
              {
                label: "On Leave",
                value: todayOnLeave,
                color: "text-blue-400",
              },
              {
                label: "Pending Leaves",
                value: pendingLeaves.length,
                color:
                  pendingLeaves.length > 0
                    ? "text-amber-400"
                    : "text-stone-500",
              },
            ].map((item, i) => (
              <div key={i}>
                <p className="text-stone-500 text-[10px] uppercase tracking-wider font-semibold mb-0.5">
                  {item.label}
                </p>
                <p className={`font-mono font-black text-xl ${item.color}`}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* ── Staff view ── */}
        {isStaff && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <ClockPanel todayData={todayData} onClock={refresh} />

            {/* My history — dark panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#1c1c2e] border border-white/10 rounded-2xl p-5 shadow-xl"
            >
              <MyHistory
                month={myMonth}
                onMonthChange={setMyMonth}
                myRecords={myRecords}
                myLeaves={myLeaves}
                loading={loading}
              />
            </motion.div>
          </div>
        )}

        {/* ── Admin / Manager view ── */}
        {isAdminOrManager && (
          <div>
            {/* Tabs */}
            <div className="flex items-center gap-1 bg-[#1c1c2e] border border-white/10 p-1 rounded-xl w-fit mb-5 shadow">
              {[
                {
                  key: "summary",
                  label: t("attendance.monthlySummary"),
                  icon: TrendingUp,
                },
                {
                  key: "leaves",
                  label: t("attendance.leaveRequests"),
                  icon: ClipboardList,
                  badge: pendingLeaves.length,
                },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`relative flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg transition-all ${
                      activeTab === tab.key
                        ? "bg-amber-500 text-stone-900 shadow-lg"
                        : "text-stone-400 hover:text-white"
                    }`}
                  >
                    <Icon size={13} />
                    {tab.label}
                    {tab.badge > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Monthly Summary Tab */}
            {activeTab === "summary" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    {t("attendance.allStaff")}
                  </p>
                  <div className="flex items-center gap-1 bg-[#1c1c2e] border border-white/10 rounded-xl px-1 py-1">
                    <button
                      onClick={() => setAdminMonth(prevMonth(adminMonth))}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <span className="text-xs font-bold text-stone-300 min-w-28 text-center">
                      {monthLabel(adminMonth)}
                    </span>
                    <button
                      onClick={() => setAdminMonth(nextMonth(adminMonth))}
                      disabled={adminMonth >= currentMonthStr()}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-stone-400 hover:text-white transition-colors disabled:opacity-30"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-stone-100 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#1c1c2e]">
                        <th className="text-left px-5 py-3.5 text-xs font-bold text-stone-400 uppercase tracking-wider">
                          {t("attendance.staffMember")}
                        </th>
                        <th className="px-4 py-3.5 text-center text-xs font-bold text-stone-400 uppercase tracking-wider">
                          {t("attendance.role")}
                        </th>
                        <th className="px-4 py-3.5 text-center text-xs font-bold text-stone-400 uppercase tracking-wider">
                          {t("attendance.present")}
                        </th>
                        <th className="px-4 py-3.5 text-center text-xs font-bold text-stone-400 uppercase tracking-wider">
                          {t("attendance.onLeave")}
                        </th>
                        <th className="px-4 py-3.5 text-center text-xs font-bold text-stone-400 uppercase tracking-wider">
                          {t("attendance.avgHours")}
                        </th>
                        <th className="px-4 py-3.5 text-center text-xs font-bold text-stone-400 uppercase tracking-wider">
                          {t("attendance.details")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="text-center py-14 text-stone-400 text-sm"
                          >
                            {t("attendance.noRecords")}
                          </td>
                        </tr>
                      ) : (
                        summary.map((s, i) => (
                          <tr
                            key={s.user_id}
                            className={`border-t border-stone-100 hover:bg-amber-50/40 transition-colors ${i % 2 === 0 ? "" : "bg-stone-50/60"}`}
                          >
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center flex-shrink-0">
                                  <span className="text-xs font-black text-stone-600">
                                    {s.user_name?.charAt(0)}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-bold text-stone-800 text-sm">
                                    {s.user_name}
                                  </p>
                                  <p className="text-[10px] text-stone-400">
                                    {s.user_email}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              <span
                                className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${ROLE_COLORS[s.role] || "bg-stone-100 text-stone-500"}`}
                              >
                                {s.role}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              <span className="font-mono font-black text-emerald-600 text-base">
                                {s.days_present}
                              </span>
                              {s.days_clocked_in_only > 0 && (
                                <span className="ml-1 text-[10px] text-amber-500">
                                  +{s.days_clocked_in_only}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              <span className="font-mono font-black text-blue-600 text-base">
                                {s.days_on_leave}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              <span className="font-mono text-stone-500 text-sm">
                                {fmtDuration(s.avg_duration_minutes)}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              <button
                                onClick={() => setDetail(s)}
                                className="p-2 rounded-xl hover:bg-amber-50 text-stone-300 hover:text-amber-600 transition-colors"
                              >
                                <Eye size={15} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Leave Requests Tab */}
            {activeTab === "leaves" && (
              <div className="space-y-5">
                {pendingLeaves.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <AlertCircle size={12} />
                      {t("attendance.pendingApproval")} ({pendingLeaves.length})
                    </p>
                    <div className="space-y-2">
                      {pendingLeaves.map((l) => (
                        <LeaveRow key={l.id} leave={l} onAction={refresh} />
                      ))}
                    </div>
                  </div>
                )}
                {allLeaves.filter((l) => l.status !== "pending").length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
                      {t("attendance.processed")}
                    </p>
                    <div className="space-y-2">
                      {allLeaves
                        .filter((l) => l.status !== "pending")
                        .map((l) => (
                          <LeaveRow key={l.id} leave={l} onAction={refresh} />
                        ))}
                    </div>
                  </div>
                )}
                {allLeaves.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-stone-100">
                    <ClipboardList size={32} className="text-stone-300 mb-3" />
                    <p className="text-stone-400 text-sm">
                      {t("attendance.noLeaveRequests")}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {showLeave && (
          <LeaveModal onClose={() => setShowLeave(false)} onSaved={refresh} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {detail && (
          <StaffDetailModal
            staff={detail}
            month={adminMonth}
            onClose={() => setDetail(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Attendance;
