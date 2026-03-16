// import React, { useEffect, useState, useMemo } from "react";
// import axios from "axios";
// import { useAuth } from "@/context/AuthContext";
// import { useTranslation } from "react-i18next";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   BookOpen,
//   Plus,
//   TrendingUp,
//   TrendingDown,
//   Clock,
//   CheckCircle2,
//   X,
//   Search,
//   Trash2,
//   ArrowDownLeft,
//   ArrowUpRight,
//   User,
//   Building2,
//   Users,
//   AlertCircle,
//   Calendar,
//   FileText,
//   Filter,
//   RefreshCw,
//   Wallet,
// } from "lucide-react";
// import { toast } from "sonner";

// const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

// // ── Add Entry Modal ───────────────────────────────────────────
// const AddEntryModal = ({ onClose, onSave, users }) => {
//   const { t } = useTranslation();
//   const [form, setForm] = useState({
//     type: "borrow",
//     amount: "",
//     party_name: "",
//     party_type: "vendor",
//     assigned_to_user_id: "",
//     notes: "",
//     date: new Date().toISOString().split("T")[0],
//   });
//   const [saving, setSaving] = useState(false);
//   const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

//   const handleSubmit = async () => {
//     if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
//       toast.error(t("dayBook.invalidAmount"));
//       return;
//     }
//     if (!form.party_name.trim()) {
//       toast.error(t("dayBook.partyRequired"));
//       return;
//     }
//     setSaving(true);
//     try {
//       await onSave({ ...form, amount: parseFloat(form.amount) });
//       onClose();
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
//       onClick={onClose}
//     >
//       <motion.div
//         initial={{ scale: 0.93, opacity: 0, y: 16 }}
//         animate={{ scale: 1, opacity: 1, y: 0 }}
//         exit={{ scale: 0.93, opacity: 0, y: 16 }}
//         transition={{ type: "spring", stiffness: 340, damping: 30 }}
//         className="bg-[#1c1c2e] border border-white/10 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-amber-500/15 rounded-xl">
//               <BookOpen size={18} className="text-amber-400" />
//             </div>
//             <h2 className="text-base font-bold text-white">
//               {t("dayBook.newEntryTitle")}
//             </h2>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 rounded-xl hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
//           >
//             <X size={16} />
//           </button>
//         </div>

//         <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
//           {/* Type toggle */}
//           <div>
//             <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2 block">
//               {t("dayBook.entryType")}
//             </label>
//             <div className="grid grid-cols-2 gap-3">
//               {[
//                 {
//                   value: "borrow",
//                   label: t("dayBook.borrowed"),
//                   desc: t("dayBook.borrowedDesc"),
//                   icon: ArrowDownLeft,
//                   active:
//                     "bg-emerald-500/15 border-emerald-500/40 text-emerald-400",
//                   dot: "bg-emerald-400",
//                 },
//                 {
//                   value: "give",
//                   label: t("dayBook.given"),
//                   desc: t("dayBook.givenDesc"),
//                   icon: ArrowUpRight,
//                   active: "bg-rose-500/15 border-rose-500/40 text-rose-400",
//                   dot: "bg-rose-400",
//                 },
//               ].map((et) => {
//                 const Icon = et.icon;
//                 const isSelected = form.type === et.value;
//                 return (
//                   <button
//                     key={et.value}
//                     onClick={() => set("type", et.value)}
//                     className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${isSelected ? et.active : "border-white/10 bg-white/5 text-stone-400 hover:border-white/20"}`}
//                   >
//                     <div
//                       className={`p-2 rounded-xl ${isSelected ? "bg-white/10" : "bg-white/5"}`}
//                     >
//                       <Icon size={16} />
//                     </div>
//                     <div>
//                       <p className="text-sm font-bold">{et.label}</p>
//                       <p className="text-[10px] opacity-60 leading-tight mt-0.5">
//                         {et.desc}
//                       </p>
//                     </div>
//                   </button>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Amount */}
//           <div>
//             <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2 block">
//               {t("dayBook.amount")} (₹)
//             </label>
//             <div className="relative">
//               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400 font-bold text-sm">
//                 ₹
//               </span>
//               <input
//                 type="number"
//                 min="0"
//                 step="0.01"
//                 value={form.amount}
//                 onChange={(e) => set("amount", e.target.value)}
//                 className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 text-white text-sm outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 placeholder-stone-600 font-mono"
//                 placeholder="0.00"
//               />
//             </div>
//           </div>

//           {/* Party info */}
//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2 block">
//                 {t("dayBook.partyName")}
//               </label>
//               <input
//                 value={form.party_name}
//                 onChange={(e) => set("party_name", e.target.value)}
//                 className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm outline-none focus:ring-2 focus:ring-amber-500/40 placeholder-stone-600"
//                 placeholder={t("dayBook.partyNamePlaceholder")}
//               />
//             </div>
//             <div>
//               <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2 block">
//                 {t("dayBook.partyType")}
//               </label>
//               <select
//                 value={form.party_type}
//                 onChange={(e) => set("party_type", e.target.value)}
//                 className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-3 text-stone-300 text-sm outline-none focus:ring-2 focus:ring-amber-500/40"
//               >
//                 {["staff", "vendor", "other"].map((p) => (
//                   <option key={p} value={p} className="bg-[#1c1c2e]">
//                     {t(`dayBook.${p}`)}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Staff assign */}
//           {form.type === "give" &&
//             form.party_type === "staff" &&
//             users?.length > 0 && (
//               <div>
//                 <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2 block">
//                   {t("dayBook.assignToStaff")}
//                 </label>
//                 <select
//                   value={form.assigned_to_user_id}
//                   onChange={(e) => set("assigned_to_user_id", e.target.value)}
//                   className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-3 text-stone-300 text-sm outline-none focus:ring-2 focus:ring-amber-500/40"
//                 >
//                   <option value="" className="bg-[#1c1c2e]">
//                     {t("dayBook.selectStaff")}
//                   </option>
//                   {users.map((u) => (
//                     <option key={u.id} value={u.id} className="bg-[#1c1c2e]">
//                       {u.name} ({u.role})
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             )}

//           {/* Date */}
//           <div>
//             <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2 block">
//               {t("dayBook.date")}
//             </label>
//             <input
//               type="date"
//               value={form.date}
//               onChange={(e) => set("date", e.target.value)}
//               className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-stone-300 text-sm outline-none focus:ring-2 focus:ring-amber-500/40"
//             />
//           </div>

//           {/* Notes */}
//           <div>
//             <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2 block">
//               {t("dayBook.notesOptional")}
//             </label>
//             <textarea
//               value={form.notes}
//               onChange={(e) => set("notes", e.target.value)}
//               rows={3}
//               className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-stone-300 text-sm resize-none outline-none focus:ring-2 focus:ring-amber-500/40 placeholder-stone-600"
//               placeholder={t("dayBook.notesPlaceholder")}
//             />
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="px-6 py-4 border-t border-white/10 flex gap-3">
//           <button
//             onClick={onClose}
//             className="flex-1 h-11 rounded-xl border border-white/10 text-stone-400 hover:text-white hover:border-white/20 transition-all text-sm font-semibold"
//           >
//             {t("common.cancel")}
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={saving}
//             className="flex-1 h-11 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-900 font-black text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
//           >
//             {saving ? (
//               <>
//                 <RefreshCw size={14} className="animate-spin" />
//                 {t("common.loading")}
//               </>
//             ) : (
//               t("dayBook.addEntry")
//             )}
//           </button>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// // ── Entry Card ────────────────────────────────────────────────
// const EntryCard = ({ entry, canDelete, onSettle, onDelete, index }) => {
//   const { t } = useTranslation();
//   const isBorrow = entry.type === "borrow";
//   const isPending = entry.status === "pending";
//   const Icon = isBorrow ? ArrowDownLeft : ArrowUpRight;
//   const PartyIconMap = { staff: User, vendor: Building2, other: Users };
//   const PartyIcon = PartyIconMap[entry.party_type] || Users;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -8, scale: 0.97 }}
//       transition={{ delay: index * 0.03 }}
//       className="group bg-white border border-stone-100 rounded-2xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
//     >
//       <div className="flex items-start gap-3.5">
//         {/* Icon */}
//         <div
//           className={`p-2.5 rounded-xl shrink-0 ${isBorrow ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
//         >
//           <Icon size={18} />
//         </div>

//         <div className="flex-1 min-w-0">
//           <div className="flex items-start justify-between gap-2 mb-2">
//             {/* Badges */}
//             <div className="flex items-center gap-1.5 flex-wrap">
//               <span
//                 className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${isBorrow ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"}`}
//               >
//                 <Icon size={9} />
//                 {isBorrow ? t("dayBook.borrowed") : t("dayBook.given")}
//               </span>
//               <span className="inline-flex items-center gap-1 text-[10px] text-stone-500 bg-stone-100 border border-stone-200 px-2 py-1 rounded-full">
//                 <PartyIcon size={9} />
//                 {t(`dayBook.${entry.party_type}`)}
//               </span>
//               <span
//                 className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full border ${isPending ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}
//               >
//                 {isPending ? <Clock size={9} /> : <CheckCircle2 size={9} />}
//                 {isPending ? t("dayBook.pending") : t("dayBook.settled")}
//               </span>
//             </div>
//             {/* Amount */}
//             <span
//               className={`text-lg font-black font-mono shrink-0 ${isBorrow ? "text-emerald-600" : "text-rose-600"}`}
//             >
//               {isBorrow ? "+" : "-"}₹{entry.amount.toFixed(2)}
//             </span>
//           </div>

//           <p className="text-sm font-bold text-stone-800 truncate mb-0.5">
//             {entry.party_name}
//           </p>
//           {entry.notes && (
//             <p className="text-xs text-stone-400 line-clamp-1 mb-2">
//               {entry.notes}
//             </p>
//           )}

//           <div className="flex items-center justify-between mt-2">
//             <div className="flex items-center gap-3 text-[11px] text-stone-400">
//               <span className="flex items-center gap-1">
//                 <Calendar size={10} />
//                 {new Date(entry.date).toLocaleDateString("en-IN", {
//                   day: "numeric",
//                   month: "short",
//                   year: "numeric",
//                 })}
//               </span>
//               {entry.created_by_name && (
//                 <span className="flex items-center gap-1">
//                   <User size={10} />
//                   {entry.created_by_name}
//                 </span>
//               )}
//               {entry.assigned_to_name && (
//                 <span className="flex items-center gap-1 text-blue-500">
//                   <Users size={10} />→ {entry.assigned_to_name}
//                 </span>
//               )}
//             </div>
//             <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//               {isPending && (
//                 <button
//                   onClick={() => onSettle(entry.id)}
//                   className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:bg-emerald-50 px-2.5 py-1.5 rounded-lg transition-colors"
//                 >
//                   <CheckCircle2 size={11} />
//                   {t("dayBook.settle")}
//                 </button>
//               )}
//               {canDelete && (
//                 <button
//                   onClick={() => onDelete(entry.id)}
//                   className="p-1.5 text-stone-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
//                 >
//                   <Trash2 size={13} />
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// // ── Stat Card ─────────────────────────────────────────────────
// const StatCard = ({ title, value, icon: Icon, color, sub, index, dark }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 20 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ delay: index * 0.07 }}
//     className={`relative overflow-hidden rounded-2xl p-5 hover:-translate-y-1 transition-all duration-300 ${dark ? "bg-[#1c1c2e] border border-white/10" : "bg-white border border-stone-100 shadow-sm"}`}
//   >
//     <div
//       className={`absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-10 blur-xl ${color.glow}`}
//     />
//     <div className="flex items-start justify-between mb-3">
//       <div className={`p-2.5 rounded-xl ${color.bg}`}>
//         <Icon size={18} className={color.text} />
//       </div>
//     </div>
//     <p
//       className={`text-2xl font-black font-mono ${dark ? color.darkText || "text-white" : color.text} mb-0.5`}
//     >
//       {value}
//     </p>
//     <p
//       className={`text-xs font-semibold ${dark ? "text-stone-400" : "text-stone-500"}`}
//     >
//       {title}
//     </p>
//     {sub && (
//       <p
//         className={`text-[10px] mt-0.5 ${dark ? "text-stone-600" : "text-stone-400"}`}
//       >
//         {sub}
//       </p>
//     )}
//   </motion.div>
// );

// // ── Main Page ─────────────────────────────────────────────────
// const DayBook = () => {
//   const { token, user } = useAuth();
//   const { t } = useTranslation();
//   const isAdmin = user?.role === "admin";

//   const [entries, setEntries] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [activeTab, setActiveTab] = useState("all");
//   const [search, setSearch] = useState("");
//   const [filterPartyType, setFilterPartyType] = useState("all");
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [dateFrom, setDateFrom] = useState("");
//   const [dateTo, setDateTo] = useState("");
//   const [showFilters, setShowFilters] = useState(false);

//   const headers = { Authorization: `Bearer ${token}` };

//   const TABS = [
//     { key: "all", label: t("dayBook.allEntries") },
//     { key: "borrow", label: t("dayBook.borrowed") },
//     { key: "give", label: t("dayBook.given") },
//     { key: "pending", label: t("dayBook.pending") },
//   ];

//   useEffect(() => {
//     fetchAll();
//   }, []);

//   const fetchAll = async () => {
//     setLoading(true);
//     try {
//       const [entRes] = await Promise.all([
//         axios.get(`${API_URL}/daybook`, { headers }),
//       ]);
//       setEntries(entRes.data);
//       if (isAdmin) {
//         const usersRes = await axios.get(`${API_URL}/users`, { headers });
//         setUsers(usersRes.data);
//       }
//     } catch {
//       toast.error(t("dayBook.loadError"));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSave = async (form) => {
//     try {
//       const res = await axios.post(`${API_URL}/daybook`, form, { headers });
//       setEntries((prev) => [res.data, ...prev]);
//       toast.success(t("dayBook.entryAdded"));
//     } catch (err) {
//       toast.error(err.response?.data?.detail || t("dayBook.loadError"));
//       throw err;
//     }
//   };

//   const handleSettle = async (id) => {
//     try {
//       await axios.put(`${API_URL}/daybook/${id}/settle`, {}, { headers });
//       setEntries((prev) =>
//         prev.map((e) => (e.id === id ? { ...e, status: "settled" } : e)),
//       );
//       toast.success(t("dayBook.entrySettled"));
//     } catch {
//       toast.error(t("dayBook.settleError"));
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm(t("dayBook.confirmDelete"))) return;
//     try {
//       await axios.delete(`${API_URL}/daybook/${id}`, { headers });
//       setEntries((prev) => prev.filter((e) => e.id !== id));
//       toast.success(t("dayBook.entryDeleted"));
//     } catch {
//       toast.error(t("dayBook.deleteError"));
//     }
//   };

//   const stats = useMemo(() => {
//     const borrowed = entries
//       .filter((e) => e.type === "borrow")
//       .reduce((s, e) => s + e.amount, 0);
//     const given = entries
//       .filter((e) => e.type === "give")
//       .reduce((s, e) => s + e.amount, 0);
//     const pending = entries
//       .filter((e) => e.status === "pending" && e.type === "give")
//       .reduce((s, e) => s + e.amount, 0);
//     return { borrowed, given, net: borrowed - given, pending };
//   }, [entries]);

//   const filtered = useMemo(
//     () =>
//       entries.filter((e) => {
//         if (activeTab === "borrow" && e.type !== "borrow") return false;
//         if (activeTab === "give" && e.type !== "give") return false;
//         if (activeTab === "pending" && e.status !== "pending") return false;
//         if (filterPartyType !== "all" && e.party_type !== filterPartyType)
//           return false;
//         if (filterStatus !== "all" && e.status !== filterStatus) return false;
//         if (
//           search &&
//           !e.party_name.toLowerCase().includes(search.toLowerCase()) &&
//           !e.notes?.toLowerCase().includes(search.toLowerCase())
//         )
//           return false;
//         if (dateFrom && new Date(e.date) < new Date(dateFrom)) return false;
//         if (dateTo && new Date(e.date) > new Date(dateTo)) return false;
//         return true;
//       }),
//     [
//       entries,
//       activeTab,
//       filterPartyType,
//       filterStatus,
//       search,
//       dateFrom,
//       dateTo,
//     ],
//   );

//   const partyBreakdown = useMemo(() => {
//     if (!isAdmin) return [];
//     const map = {};
//     entries.forEach((e) => {
//       const key = `${e.party_name}__${e.party_type}`;
//       if (!map[key])
//         map[key] = {
//           name: e.party_name,
//           type: e.party_type,
//           given: 0,
//           borrowed: 0,
//           pending: 0,
//         };
//       if (e.type === "give") map[key].given += e.amount;
//       else map[key].borrowed += e.amount;
//       if (e.status === "pending" && e.type === "give")
//         map[key].pending += e.amount;
//     });
//     return Object.values(map).sort((a, b) => b.pending - a.pending);
//   }, [entries, isAdmin]);

//   const todayStr = new Date().toISOString().split("T")[0];
//   const todayEntries = entries.filter((e) => e.date === todayStr);
//   const todayBorrow = todayEntries
//     .filter((e) => e.type === "borrow")
//     .reduce((s, e) => s + e.amount, 0);
//   const todayGiven = todayEntries
//     .filter((e) => e.type === "give")
//     .reduce((s, e) => s + e.amount, 0);
//   const pendingCount = entries.filter((e) => e.status === "pending").length;

//   if (loading)
//     return (
//       <div className="flex items-center justify-center h-full bg-[#f7f6f3]">
//         <div className="text-center">
//           <div className="relative w-14 h-14 mx-auto mb-4">
//             <div className="absolute inset-0 rounded-full border-4 border-amber-100" />
//             <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
//           </div>
//           <p className="text-stone-400 text-sm">{t("dayBook.loading")}</p>
//         </div>
//       </div>
//     );

//   return (
//     <div
//       className="min-h-full bg-[#f7f6f3] p-4 md:p-6 lg:p-8"
//       data-testid="daybook-page"
//     >
//       {/* ── Hero Header ── */}
//       <motion.div
//         initial={{ opacity: 0, y: -12 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="relative overflow-hidden bg-[#1c1c2e] rounded-2xl p-6 mb-6 shadow-xl"
//       >
//         <div
//           className="absolute inset-0 opacity-10"
//           style={{
//             backgroundImage:
//               "radial-gradient(circle at 80% 50%, #f59e0b 0%, transparent 50%), radial-gradient(circle at 20% 80%, #10b981 0%, transparent 40%)",
//           }}
//         />
//         <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//           <div className="flex items-center gap-4">
//             <div className="p-3 bg-amber-500/15 rounded-2xl border border-amber-500/20">
//               <BookOpen size={24} className="text-amber-400" />
//             </div>
//             <div>
//               <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
//                 {t("dayBook.title")}
//               </h1>
//               <p className="text-stone-400 text-sm mt-0.5">
//                 {t("dayBook.subtitle")}
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={() => setShowModal(true)}
//             className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-900 font-black text-sm px-5 py-3 rounded-xl transition-all shadow-lg shadow-amber-900/30 active:scale-95"
//           >
//             <Plus size={16} />
//             {t("dayBook.newEntry")}
//           </button>
//         </div>

//         {/* Quick today strip */}
//         <div className="relative mt-5 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
//           {[
//             {
//               label: "Today Borrowed",
//               value: `₹${todayBorrow.toFixed(2)}`,
//               color: "text-emerald-400",
//             },
//             {
//               label: "Today Given",
//               value: `₹${todayGiven.toFixed(2)}`,
//               color: "text-rose-400",
//             },
//             {
//               label: "Pending Entries",
//               value: pendingCount,
//               color: pendingCount > 0 ? "text-amber-400" : "text-stone-400",
//             },
//             {
//               label: "Net Today",
//               value: `${todayBorrow - todayGiven >= 0 ? "+" : ""}₹${(todayBorrow - todayGiven).toFixed(2)}`,
//               color:
//                 todayBorrow >= todayGiven ? "text-blue-400" : "text-orange-400",
//             },
//           ].map((item, i) => (
//             <div key={i}>
//               <p className="text-stone-500 text-[10px] uppercase tracking-wider font-semibold mb-0.5">
//                 {item.label}
//               </p>
//               <p className={`font-mono font-black text-lg ${item.color}`}>
//                 {item.value}
//               </p>
//             </div>
//           ))}
//         </div>
//       </motion.div>

//       {/* ── 4 Stat Cards ── */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
//         {[
//           {
//             title: t("dayBook.totalBorrowed"),
//             value: `₹${stats.borrowed.toFixed(2)}`,
//             icon: ArrowDownLeft,
//             sub: t("dayBook.totalBorrowedSub"),
//             color: {
//               bg: "bg-emerald-50",
//               text: "text-emerald-600",
//               glow: "bg-emerald-400",
//             },
//           },
//           {
//             title: t("dayBook.totalGiven"),
//             value: `₹${stats.given.toFixed(2)}`,
//             icon: ArrowUpRight,
//             sub: t("dayBook.totalGivenSub"),
//             color: {
//               bg: "bg-rose-50",
//               text: "text-rose-600",
//               glow: "bg-rose-400",
//             },
//           },
//           {
//             title: t("dayBook.netBalance"),
//             value: `${stats.net >= 0 ? "+" : ""}₹${Math.abs(stats.net).toFixed(2)}`,
//             icon: stats.net >= 0 ? TrendingUp : TrendingDown,
//             sub: t("dayBook.netBalanceSub"),
//             color:
//               stats.net >= 0
//                 ? {
//                     bg: "bg-blue-50",
//                     text: "text-blue-600",
//                     glow: "bg-blue-400",
//                   }
//                 : {
//                     bg: "bg-orange-50",
//                     text: "text-orange-600",
//                     glow: "bg-orange-400",
//                   },
//           },
//           {
//             title: t("dayBook.pendingDues"),
//             value: `₹${stats.pending.toFixed(2)}`,
//             icon: Clock,
//             sub: t("dayBook.pendingDuesSub"),
//             color: {
//               bg: "bg-amber-50",
//               text: "text-amber-600",
//               glow: "bg-amber-400",
//             },
//           },
//         ].map((card, i) => (
//           <StatCard key={i} {...card} index={i} />
//         ))}
//       </div>

//       {/* ── Main grid ── */}
//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
//         {/* LEFT: Entry list */}
//         <div className="xl:col-span-2 space-y-4">
//           {/* Tabs + toolbar */}
//           <div className="bg-white rounded-2xl border border-stone-100 p-4 shadow-sm">
//             {/* Tab row */}
//             <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl w-fit mb-4">
//               {TABS.map((tab) => (
//                 <button
//                   key={tab.key}
//                   onClick={() => setActiveTab(tab.key)}
//                   className={`relative px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === tab.key ? "bg-white text-stone-800 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}
//                 >
//                   {tab.label}
//                   {tab.key === "pending" && pendingCount > 0 && (
//                     <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
//                       {pendingCount}
//                     </span>
//                   )}
//                 </button>
//               ))}
//             </div>

//             {/* Search + filter row */}
//             <div className="flex items-center gap-2">
//               <div className="relative flex-1">
//                 <Search
//                   size={13}
//                   className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
//                 />
//                 <input
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   placeholder={t("dayBook.searchPlaceholder")}
//                   className="w-full h-9 pl-8 pr-3 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/30 text-stone-700"
//                 />
//               </div>
//               <button
//                 onClick={() => setShowFilters((v) => !v)}
//                 className={`flex items-center gap-1.5 h-9 px-3 rounded-xl border text-xs font-semibold transition-all ${showFilters || filterPartyType !== "all" || filterStatus !== "all" || dateFrom || dateTo ? "bg-amber-50 border-amber-300 text-amber-700" : "bg-stone-50 border-stone-200 text-stone-500 hover:border-stone-300"}`}
//               >
//                 <Filter size={12} />
//                 Filters
//                 {(filterPartyType !== "all" ||
//                   filterStatus !== "all" ||
//                   dateFrom ||
//                   dateTo) && (
//                   <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
//                 )}
//               </button>
//             </div>

//             {/* Expanded filters */}
//             <AnimatePresence>
//               {showFilters && (
//                 <motion.div
//                   initial={{ height: 0, opacity: 0 }}
//                   animate={{ height: "auto", opacity: 1 }}
//                   exit={{ height: 0, opacity: 0 }}
//                   transition={{ duration: 0.2 }}
//                   className="overflow-hidden"
//                 >
//                   <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-stone-100">
//                     <select
//                       value={filterPartyType}
//                       onChange={(e) => setFilterPartyType(e.target.value)}
//                       className="h-8 px-3 rounded-lg border border-stone-200 bg-white text-xs text-stone-600 outline-none"
//                     >
//                       <option value="all">{t("dayBook.allParties")}</option>
//                       {["staff", "vendor", "other"].map((p) => (
//                         <option key={p} value={p}>
//                           {t(`dayBook.${p}`)}
//                         </option>
//                       ))}
//                     </select>
//                     <select
//                       value={filterStatus}
//                       onChange={(e) => setFilterStatus(e.target.value)}
//                       className="h-8 px-3 rounded-lg border border-stone-200 bg-white text-xs text-stone-600 outline-none"
//                     >
//                       <option value="all">{t("dayBook.allStatus")}</option>
//                       <option value="pending">{t("dayBook.pending")}</option>
//                       <option value="settled">{t("dayBook.settled")}</option>
//                     </select>
//                     <input
//                       type="date"
//                       value={dateFrom}
//                       onChange={(e) => setDateFrom(e.target.value)}
//                       className="h-8 px-3 rounded-lg border border-stone-200 bg-white text-xs text-stone-600 outline-none w-34"
//                     />
//                     <span className="text-stone-400 text-xs self-center">
//                       to
//                     </span>
//                     <input
//                       type="date"
//                       value={dateTo}
//                       onChange={(e) => setDateTo(e.target.value)}
//                       className="h-8 px-3 rounded-lg border border-stone-200 bg-white text-xs text-stone-600 outline-none w-34"
//                     />
//                     {(dateFrom ||
//                       dateTo ||
//                       filterPartyType !== "all" ||
//                       filterStatus !== "all") && (
//                       <button
//                         onClick={() => {
//                           setDateFrom("");
//                           setDateTo("");
//                           setFilterPartyType("all");
//                           setFilterStatus("all");
//                         }}
//                         className="h-8 px-3 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 text-xs font-semibold flex items-center gap-1 hover:bg-rose-100 transition-colors"
//                       >
//                         <X size={11} />
//                         Clear
//                       </button>
//                     )}
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* Entries */}
//           <div className="space-y-2.5">
//             <AnimatePresence mode="popLayout">
//               {filtered.length === 0 ? (
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-stone-100"
//                 >
//                   <div className="p-4 bg-stone-100 rounded-2xl mb-3">
//                     <FileText size={28} className="text-stone-300" />
//                   </div>
//                   <p className="text-stone-500 font-semibold text-sm">
//                     {t("dayBook.noEntries")}
//                   </p>
//                   <p className="text-stone-400 text-xs mt-1">
//                     {entries.length === 0
//                       ? t("dayBook.noEntriesDesc")
//                       : t("dayBook.adjustFilters")}
//                   </p>
//                 </motion.div>
//               ) : (
//                 filtered.map((entry, i) => (
//                   <EntryCard
//                     key={entry.id}
//                     entry={entry}
//                     index={i}
//                     canDelete={isAdmin || entry.created_by === user?.id}
//                     onSettle={handleSettle}
//                     onDelete={handleDelete}
//                   />
//                 ))
//               )}
//             </AnimatePresence>
//           </div>
//         </div>

//         {/* RIGHT: Panels */}
//         <div className="space-y-4">
//           {/* Today's summary — dark card */}
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.2 }}
//             className="bg-[#1c1c2e] rounded-2xl p-5 border border-white/10 shadow-xl"
//           >
//             <p className="text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
//               <Calendar size={11} className="text-amber-400" />
//               {t("dayBook.todaySummary")}
//             </p>
//             {[
//               {
//                 label: t("dayBook.borrowedToday"),
//                 value: `₹${todayBorrow.toFixed(2)}`,
//                 color: "text-emerald-400",
//                 icon: ArrowDownLeft,
//               },
//               {
//                 label: t("dayBook.givenToday"),
//                 value: `₹${todayGiven.toFixed(2)}`,
//                 color: "text-rose-400",
//                 icon: ArrowUpRight,
//               },
//               {
//                 label: t("dayBook.netToday"),
//                 value: `${todayBorrow - todayGiven >= 0 ? "+" : ""}₹${(todayBorrow - todayGiven).toFixed(2)}`,
//                 color:
//                   todayBorrow >= todayGiven
//                     ? "text-blue-400"
//                     : "text-orange-400",
//                 icon: Wallet,
//               },
//             ].map((item, i) => {
//               const ItemIcon = item.icon;
//               return (
//                 <div
//                   key={i}
//                   className={`flex items-center justify-between py-3 ${i < 2 ? "border-b border-white/8" : ""}`}
//                 >
//                   <span className="flex items-center gap-2 text-xs text-stone-400">
//                     <ItemIcon size={13} className={item.color} />
//                     {item.label}
//                   </span>
//                   <span
//                     className={`font-mono font-black text-sm ${item.color}`}
//                   >
//                     {item.value}
//                   </span>
//                 </div>
//               );
//             })}
//             {todayEntries.length === 0 && (
//               <p className="text-[10px] text-stone-600 text-center mt-3">
//                 {t("dayBook.noEntriesToday")}
//               </p>
//             )}
//           </motion.div>

//           {/* Pending alerts */}
//           {pendingCount > 0 && (
//             <motion.div
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.3 }}
//               className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-5"
//             >
//               <h3 className="font-bold text-amber-800 text-sm mb-3 flex items-center gap-2">
//                 <AlertCircle size={14} className="text-amber-600" />
//                 {t("dayBook.pendingSettlements")}
//               </h3>
//               <div className="space-y-2">
//                 {entries
//                   .filter((e) => e.status === "pending")
//                   .slice(0, 5)
//                   .map((e) => (
//                     <div
//                       key={e.id}
//                       className="flex justify-between items-center bg-white/70 rounded-xl px-3 py-2 text-xs"
//                     >
//                       <span className="text-stone-700 font-semibold truncate max-w-[120px]">
//                         {e.party_name}
//                       </span>
//                       <span className="font-mono font-black text-amber-700">
//                         ₹{e.amount.toFixed(2)}
//                       </span>
//                     </div>
//                   ))}
//                 {pendingCount > 5 && (
//                   <p className="text-[10px] text-amber-600 text-center mt-1">
//                     +{pendingCount - 5} {t("dayBook.morePending")}
//                   </p>
//                 )}
//               </div>
//             </motion.div>
//           )}

//           {/* Party breakdown — admin only */}
//           {isAdmin && partyBreakdown.length > 0 && (
//             <motion.div
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.4 }}
//               className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm"
//             >
//               <h3 className="font-bold text-stone-800 text-sm mb-4 flex items-center gap-2">
//                 <Users size={14} className="text-stone-500" />
//                 {t("dayBook.partyBreakdown")}
//               </h3>
//               <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
//                 {partyBreakdown.map((p, i) => {
//                   const PIconMap = {
//                     staff: User,
//                     vendor: Building2,
//                     other: Users,
//                   };
//                   const PIcon = PIconMap[p.type] || Users;
//                   return (
//                     <div
//                       key={i}
//                       className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors"
//                     >
//                       <div className="p-1.5 bg-stone-200 rounded-lg shrink-0">
//                         <PIcon size={13} className="text-stone-600" />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <p className="text-xs font-bold text-stone-800 truncate">
//                           {p.name}
//                         </p>
//                         <div className="flex items-center gap-2 mt-0.5 text-[10px]">
//                           <span className="text-emerald-600 font-mono">
//                             +₹{p.borrowed.toFixed(0)}
//                           </span>
//                           <span className="text-rose-600 font-mono">
//                             -₹{p.given.toFixed(0)}
//                           </span>
//                           {p.pending > 0 && (
//                             <span className="text-amber-600 font-mono flex items-center gap-0.5">
//                               <Clock size={8} />₹{p.pending.toFixed(0)} pending
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </motion.div>
//           )}
//         </div>
//       </div>

//       {/* Modal */}
//       <AnimatePresence>
//         {showModal && (
//           <AddEntryModal
//             onClose={() => setShowModal(false)}
//             onSave={handleSave}
//             users={users}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default DayBook;

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Plus,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  X,
  Search,
  Trash2,
  ArrowDownLeft,
  ArrowUpRight,
  User,
  Building2,
  Users,
  AlertCircle,
  Calendar,
  FileText,
  Filter,
  RefreshCw,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

// ── Add Entry Modal ───────────────────────────────────────────
const AddEntryModal = ({ onClose, onSave, users }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    type: "borrow",
    amount: "",
    party_name: "",
    party_type: "vendor",
    assigned_to_user_id: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      toast.error(t("dayBook.invalidAmount"));
      return;
    }
    if (!form.party_name.trim()) {
      toast.error(t("dayBook.partyRequired"));
      return;
    }
    setSaving(true);
    try {
      await onSave({ ...form, amount: parseFloat(form.amount) });
      onClose();
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
        initial={{ scale: 0.93, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 16 }}
        transition={{ type: "spring", stiffness: 340, damping: 30 }}
        className="bg-[#1c1c2e] border border-white/10 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/15 rounded-xl">
              <BookOpen size={18} className="text-amber-400" />
            </div>
            <h2 className="text-base font-bold text-white">
              {t("dayBook.newEntryTitle")}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Type toggle */}
          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2 block">
              {t("dayBook.entryType")}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  value: "borrow",
                  label: t("dayBook.borrowed"),
                  desc: t("dayBook.borrowedDesc"),
                  icon: ArrowDownLeft,
                  active:
                    "bg-emerald-500/15 border-emerald-500/40 text-emerald-400",
                  dot: "bg-emerald-400",
                },
                {
                  value: "give",
                  label: t("dayBook.given"),
                  desc: t("dayBook.givenDesc"),
                  icon: ArrowUpRight,
                  active: "bg-rose-500/15 border-rose-500/40 text-rose-400",
                  dot: "bg-rose-400",
                },
              ].map((et) => {
                const Icon = et.icon;
                const isSelected = form.type === et.value;
                return (
                  <button
                    key={et.value}
                    onClick={() => set("type", et.value)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${isSelected ? et.active : "border-white/10 bg-white/5 text-stone-400 hover:border-white/20"}`}
                  >
                    <div
                      className={`p-2 rounded-xl ${isSelected ? "bg-white/10" : "bg-white/5"}`}
                    >
                      <Icon size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{et.label}</p>
                      <p className="text-[10px] opacity-60 leading-tight mt-0.5">
                        {et.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2 block">
              {t("dayBook.amount")} (₹)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400 font-bold text-sm">
                ₹
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={(e) => set("amount", e.target.value)}
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 text-white text-sm outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 placeholder-stone-600 font-mono"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Party info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2 block">
                {t("dayBook.partyName")}
              </label>
              <input
                value={form.party_name}
                onChange={(e) => set("party_name", e.target.value)}
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm outline-none focus:ring-2 focus:ring-amber-500/40 placeholder-stone-600"
                placeholder={t("dayBook.partyNamePlaceholder")}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2 block">
                {t("dayBook.partyType")}
              </label>
              <select
                value={form.party_type}
                onChange={(e) => set("party_type", e.target.value)}
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-3 text-stone-300 text-sm outline-none focus:ring-2 focus:ring-amber-500/40"
              >
                {["staff", "vendor", "other"].map((p) => (
                  <option key={p} value={p} className="bg-[#1c1c2e]">
                    {t(`dayBook.${p}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Staff assign */}
          {form.type === "give" &&
            form.party_type === "staff" &&
            users?.length > 0 && (
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2 block">
                  {t("dayBook.assignToStaff")}
                </label>
                <select
                  value={form.assigned_to_user_id}
                  onChange={(e) => set("assigned_to_user_id", e.target.value)}
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-3 text-stone-300 text-sm outline-none focus:ring-2 focus:ring-amber-500/40"
                >
                  <option value="" className="bg-[#1c1c2e]">
                    {t("dayBook.selectStaff")}
                  </option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id} className="bg-[#1c1c2e]">
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>
            )}

          {/* Date */}
          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2 block">
              {t("dayBook.date")}
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-stone-300 text-sm outline-none focus:ring-2 focus:ring-amber-500/40"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2 block">
              {t("dayBook.notesOptional")}
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-stone-300 text-sm resize-none outline-none focus:ring-2 focus:ring-amber-500/40 placeholder-stone-600"
              placeholder={t("dayBook.notesPlaceholder")}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-xl border border-white/10 text-stone-400 hover:text-white hover:border-white/20 transition-all text-sm font-semibold"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 h-11 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-900 font-black text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                {t("common.loading")}
              </>
            ) : (
              t("dayBook.addEntry")
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Entry Card ────────────────────────────────────────────────
const EntryCard = ({ entry, canDelete, onSettle, onDelete, index }) => {
  const { t } = useTranslation();
  const isBorrow = entry.type === "borrow";
  const isPending = entry.status === "pending";
  const Icon = isBorrow ? ArrowDownLeft : ArrowUpRight;
  const PartyIconMap = { staff: User, vendor: Building2, other: Users };
  const PartyIcon = PartyIconMap[entry.party_type] || Users;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ delay: index * 0.03 }}
      className="group bg-white border border-stone-100 rounded-2xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-start gap-3.5">
        {/* Icon */}
        <div
          className={`p-2.5 rounded-xl shrink-0 ${isBorrow ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
        >
          <Icon size={18} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            {/* Badges */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${isBorrow ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"}`}
              >
                <Icon size={9} />
                {isBorrow ? t("dayBook.borrowed") : t("dayBook.given")}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-stone-500 bg-stone-100 border border-stone-200 px-2 py-1 rounded-full">
                <PartyIcon size={9} />
                {t(`dayBook.${entry.party_type}`)}
              </span>
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full border ${isPending ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}
              >
                {isPending ? <Clock size={9} /> : <CheckCircle2 size={9} />}
                {isPending ? t("dayBook.pending") : t("dayBook.settled")}
              </span>
            </div>
            {/* Amount */}
            <span
              className={`text-lg font-black font-mono shrink-0 ${isBorrow ? "text-emerald-600" : "text-rose-600"}`}
            >
              {isBorrow ? "+" : "-"}₹{entry.amount.toFixed(2)}
            </span>
          </div>

          <p className="text-sm font-bold text-stone-800 truncate mb-0.5">
            {entry.party_name}
          </p>
          {entry.notes && (
            <p className="text-xs text-stone-400 line-clamp-1 mb-2">
              {entry.notes}
            </p>
          )}

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-3 text-[11px] text-stone-400">
              <span className="flex items-center gap-1">
                <Calendar size={10} />
                {new Date(entry.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              {entry.created_by_name && (
                <span className="flex items-center gap-1">
                  <User size={10} />
                  {entry.created_by_name}
                </span>
              )}
              {entry.assigned_to_name && (
                <span className="flex items-center gap-1 text-blue-500">
                  <Users size={10} />→ {entry.assigned_to_name}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {isPending && (
                <button
                  onClick={() => onSettle(entry.id)}
                  className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:bg-emerald-50 px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  <CheckCircle2 size={11} />
                  {t("dayBook.settle")}
                </button>
              )}
              {canDelete && (
                <button
                  onClick={() => onDelete(entry.id)}
                  className="p-1.5 text-stone-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ── Stat Card ─────────────────────────────────────────────────
const StatCard = ({ title, value, icon: Icon, color, sub, index, dark }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.07 }}
    className={`relative overflow-hidden rounded-2xl p-5 hover:-translate-y-1 transition-all duration-300 ${dark ? "bg-[#1c1c2e] border border-white/10" : "bg-white border border-stone-100 shadow-sm"}`}
  >
    <div
      className={`absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-10 blur-xl ${color.glow}`}
    />
    <div className="flex items-start justify-between mb-3">
      <div className={`p-2.5 rounded-xl ${color.bg}`}>
        <Icon size={18} className={color.text} />
      </div>
    </div>
    <p
      className={`text-2xl font-black font-mono ${dark ? color.darkText || "text-white" : color.text} mb-0.5`}
    >
      {value}
    </p>
    <p
      className={`text-xs font-semibold ${dark ? "text-stone-400" : "text-stone-500"}`}
    >
      {title}
    </p>
    {sub && (
      <p
        className={`text-[10px] mt-0.5 ${dark ? "text-stone-600" : "text-stone-400"}`}
      >
        {sub}
      </p>
    )}
  </motion.div>
);

// ── Main Page ─────────────────────────────────────────────────
const DayBook = () => {
  const { token, user } = useAuth();
  const { t } = useTranslation();
  const isAdminOrManager = ["admin", "manager"].includes(user?.role);
  const isAdmin = user?.role === "admin"; // delete-only guard (admin only)

  const [entries, setEntries] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [filterPartyType, setFilterPartyType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const headers = { Authorization: `Bearer ${token}` };

  const TABS = [
    { key: "all", label: t("dayBook.allEntries") },
    { key: "borrow", label: t("dayBook.borrowed") },
    { key: "give", label: t("dayBook.given") },
    { key: "pending", label: t("dayBook.pending") },
  ];

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [entRes] = await Promise.all([
        axios.get(`${API_URL}/daybook`, { headers }),
      ]);
      setEntries(entRes.data);
      if (isAdminOrManager) {
        const usersRes = await axios.get(`${API_URL}/users`, { headers });
        setUsers(usersRes.data);
      }
    } catch {
      toast.error(t("dayBook.loadError"));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (form) => {
    try {
      const res = await axios.post(`${API_URL}/daybook`, form, { headers });
      setEntries((prev) => [res.data, ...prev]);
      toast.success(t("dayBook.entryAdded"));
    } catch (err) {
      toast.error(err.response?.data?.detail || t("dayBook.loadError"));
      throw err;
    }
  };

  const handleSettle = async (id) => {
    try {
      await axios.put(`${API_URL}/daybook/${id}/settle`, {}, { headers });
      setEntries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: "settled" } : e)),
      );
      toast.success(t("dayBook.entrySettled"));
    } catch {
      toast.error(t("dayBook.settleError"));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("dayBook.confirmDelete"))) return;
    try {
      await axios.delete(`${API_URL}/daybook/${id}`, { headers });
      setEntries((prev) => prev.filter((e) => e.id !== id));
      toast.success(t("dayBook.entryDeleted"));
    } catch {
      toast.error(t("dayBook.deleteError"));
    }
  };

  const stats = useMemo(() => {
    const borrowed = entries
      .filter((e) => e.type === "borrow")
      .reduce((s, e) => s + e.amount, 0);
    const given = entries
      .filter((e) => e.type === "give")
      .reduce((s, e) => s + e.amount, 0);
    const pending = entries
      .filter((e) => e.status === "pending" && e.type === "give")
      .reduce((s, e) => s + e.amount, 0);
    return { borrowed, given, net: borrowed - given, pending };
  }, [entries]);

  const filtered = useMemo(
    () =>
      entries.filter((e) => {
        if (activeTab === "borrow" && e.type !== "borrow") return false;
        if (activeTab === "give" && e.type !== "give") return false;
        if (activeTab === "pending" && e.status !== "pending") return false;
        if (filterPartyType !== "all" && e.party_type !== filterPartyType)
          return false;
        if (filterStatus !== "all" && e.status !== filterStatus) return false;
        if (
          search &&
          !e.party_name.toLowerCase().includes(search.toLowerCase()) &&
          !e.notes?.toLowerCase().includes(search.toLowerCase())
        )
          return false;
        if (dateFrom && new Date(e.date) < new Date(dateFrom)) return false;
        if (dateTo && new Date(e.date) > new Date(dateTo)) return false;
        return true;
      }),
    [
      entries,
      activeTab,
      filterPartyType,
      filterStatus,
      search,
      dateFrom,
      dateTo,
    ],
  );

  const partyBreakdown = useMemo(() => {
    if (!isAdminOrManager) return [];
    const map = {};
    entries.forEach((e) => {
      const key = `${e.party_name}__${e.party_type}`;
      if (!map[key])
        map[key] = {
          name: e.party_name,
          type: e.party_type,
          given: 0,
          borrowed: 0,
          pending: 0,
        };
      if (e.type === "give") map[key].given += e.amount;
      else map[key].borrowed += e.amount;
      if (e.status === "pending" && e.type === "give")
        map[key].pending += e.amount;
    });
    return Object.values(map).sort((a, b) => b.pending - a.pending);
  }, [entries, isAdmin]);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayEntries = entries.filter((e) => e.date === todayStr);
  const todayBorrow = todayEntries
    .filter((e) => e.type === "borrow")
    .reduce((s, e) => s + e.amount, 0);
  const todayGiven = todayEntries
    .filter((e) => e.type === "give")
    .reduce((s, e) => s + e.amount, 0);
  const pendingCount = entries.filter((e) => e.status === "pending").length;

  if (loading)
    return (
      <div className="flex items-center justify-center h-full bg-[#f7f6f3]">
        <div className="text-center">
          <div className="relative w-14 h-14 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-amber-100" />
            <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
          </div>
          <p className="text-stone-400 text-sm">{t("dayBook.loading")}</p>
        </div>
      </div>
    );

  return (
    <div
      className="min-h-full bg-[#f7f6f3] p-4 md:p-6 lg:p-8"
      data-testid="daybook-page"
    >
      {/* ── Hero Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-[#1c1c2e] rounded-2xl p-6 mb-6 shadow-xl"
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 50%, #f59e0b 0%, transparent 50%), radial-gradient(circle at 20% 80%, #10b981 0%, transparent 40%)",
          }}
        />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/15 rounded-2xl border border-amber-500/20">
              <BookOpen size={24} className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                {t("dayBook.title")}
              </h1>
              <p className="text-stone-400 text-sm mt-0.5">
                {t("dayBook.subtitle")}
              </p>
            </div>
          </div>
          {isAdminOrManager && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-900 font-black text-sm px-5 py-3 rounded-xl transition-all shadow-lg shadow-amber-900/30 active:scale-95"
            >
              <Plus size={16} />
              {t("dayBook.newEntry")}
            </button>
          )}
        </div>

        {/* Quick today strip */}
        <div className="relative mt-5 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Today Borrowed",
              value: `₹${todayBorrow.toFixed(2)}`,
              color: "text-emerald-400",
            },
            {
              label: "Today Given",
              value: `₹${todayGiven.toFixed(2)}`,
              color: "text-rose-400",
            },
            {
              label: "Pending Entries",
              value: pendingCount,
              color: pendingCount > 0 ? "text-amber-400" : "text-stone-400",
            },
            {
              label: "Net Today",
              value: `${todayBorrow - todayGiven >= 0 ? "+" : ""}₹${(todayBorrow - todayGiven).toFixed(2)}`,
              color:
                todayBorrow >= todayGiven ? "text-blue-400" : "text-orange-400",
            },
          ].map((item, i) => (
            <div key={i}>
              <p className="text-stone-500 text-[10px] uppercase tracking-wider font-semibold mb-0.5">
                {item.label}
              </p>
              <p className={`font-mono font-black text-lg ${item.color}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── 4 Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        {[
          {
            title: t("dayBook.totalBorrowed"),
            value: `₹${stats.borrowed.toFixed(2)}`,
            icon: ArrowDownLeft,
            sub: t("dayBook.totalBorrowedSub"),
            color: {
              bg: "bg-emerald-50",
              text: "text-emerald-600",
              glow: "bg-emerald-400",
            },
          },
          {
            title: t("dayBook.totalGiven"),
            value: `₹${stats.given.toFixed(2)}`,
            icon: ArrowUpRight,
            sub: t("dayBook.totalGivenSub"),
            color: {
              bg: "bg-rose-50",
              text: "text-rose-600",
              glow: "bg-rose-400",
            },
          },
          {
            title: t("dayBook.netBalance"),
            value: `${stats.net >= 0 ? "+" : ""}₹${Math.abs(stats.net).toFixed(2)}`,
            icon: stats.net >= 0 ? TrendingUp : TrendingDown,
            sub: t("dayBook.netBalanceSub"),
            color:
              stats.net >= 0
                ? {
                    bg: "bg-blue-50",
                    text: "text-blue-600",
                    glow: "bg-blue-400",
                  }
                : {
                    bg: "bg-orange-50",
                    text: "text-orange-600",
                    glow: "bg-orange-400",
                  },
          },
          {
            title: t("dayBook.pendingDues"),
            value: `₹${stats.pending.toFixed(2)}`,
            icon: Clock,
            sub: t("dayBook.pendingDuesSub"),
            color: {
              bg: "bg-amber-50",
              text: "text-amber-600",
              glow: "bg-amber-400",
            },
          },
        ].map((card, i) => (
          <StatCard key={i} {...card} index={i} />
        ))}
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* LEFT: Entry list */}
        <div className="xl:col-span-2 space-y-4">
          {/* Tabs + toolbar */}
          <div className="bg-white rounded-2xl border border-stone-100 p-4 shadow-sm">
            {/* Tab row */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl w-fit mb-4">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === tab.key ? "bg-white text-stone-800 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}
                >
                  {tab.label}
                  {tab.key === "pending" && pendingCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                      {pendingCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Search + filter row */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("dayBook.searchPlaceholder")}
                  className="w-full h-9 pl-8 pr-3 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/30 text-stone-700"
                />
              </div>
              <button
                onClick={() => setShowFilters((v) => !v)}
                className={`flex items-center gap-1.5 h-9 px-3 rounded-xl border text-xs font-semibold transition-all ${showFilters || filterPartyType !== "all" || filterStatus !== "all" || dateFrom || dateTo ? "bg-amber-50 border-amber-300 text-amber-700" : "bg-stone-50 border-stone-200 text-stone-500 hover:border-stone-300"}`}
              >
                <Filter size={12} />
                Filters
                {(filterPartyType !== "all" ||
                  filterStatus !== "all" ||
                  dateFrom ||
                  dateTo) && (
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                )}
              </button>
            </div>

            {/* Expanded filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-stone-100">
                    <select
                      value={filterPartyType}
                      onChange={(e) => setFilterPartyType(e.target.value)}
                      className="h-8 px-3 rounded-lg border border-stone-200 bg-white text-xs text-stone-600 outline-none"
                    >
                      <option value="all">{t("dayBook.allParties")}</option>
                      {["staff", "vendor", "other"].map((p) => (
                        <option key={p} value={p}>
                          {t(`dayBook.${p}`)}
                        </option>
                      ))}
                    </select>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="h-8 px-3 rounded-lg border border-stone-200 bg-white text-xs text-stone-600 outline-none"
                    >
                      <option value="all">{t("dayBook.allStatus")}</option>
                      <option value="pending">{t("dayBook.pending")}</option>
                      <option value="settled">{t("dayBook.settled")}</option>
                    </select>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="h-8 px-3 rounded-lg border border-stone-200 bg-white text-xs text-stone-600 outline-none w-34"
                    />
                    <span className="text-stone-400 text-xs self-center">
                      to
                    </span>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="h-8 px-3 rounded-lg border border-stone-200 bg-white text-xs text-stone-600 outline-none w-34"
                    />
                    {(dateFrom ||
                      dateTo ||
                      filterPartyType !== "all" ||
                      filterStatus !== "all") && (
                      <button
                        onClick={() => {
                          setDateFrom("");
                          setDateTo("");
                          setFilterPartyType("all");
                          setFilterStatus("all");
                        }}
                        className="h-8 px-3 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 text-xs font-semibold flex items-center gap-1 hover:bg-rose-100 transition-colors"
                      >
                        <X size={11} />
                        Clear
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Entries */}
          <div className="space-y-2.5">
            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-stone-100"
                >
                  <div className="p-4 bg-stone-100 rounded-2xl mb-3">
                    <FileText size={28} className="text-stone-300" />
                  </div>
                  <p className="text-stone-500 font-semibold text-sm">
                    {t("dayBook.noEntries")}
                  </p>
                  <p className="text-stone-400 text-xs mt-1">
                    {entries.length === 0
                      ? t("dayBook.noEntriesDesc")
                      : t("dayBook.adjustFilters")}
                  </p>
                </motion.div>
              ) : (
                filtered.map((entry, i) => (
                  <EntryCard
                    key={entry.id}
                    entry={entry}
                    index={i}
                    canDelete={isAdminOrManager}
                    onSettle={handleSettle}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT: Panels */}
        <div className="space-y-4">
          {/* Today's summary — dark card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#1c1c2e] rounded-2xl p-5 border border-white/10 shadow-xl"
          >
            <p className="text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <Calendar size={11} className="text-amber-400" />
              {t("dayBook.todaySummary")}
            </p>
            {[
              {
                label: t("dayBook.borrowedToday"),
                value: `₹${todayBorrow.toFixed(2)}`,
                color: "text-emerald-400",
                icon: ArrowDownLeft,
              },
              {
                label: t("dayBook.givenToday"),
                value: `₹${todayGiven.toFixed(2)}`,
                color: "text-rose-400",
                icon: ArrowUpRight,
              },
              {
                label: t("dayBook.netToday"),
                value: `${todayBorrow - todayGiven >= 0 ? "+" : ""}₹${(todayBorrow - todayGiven).toFixed(2)}`,
                color:
                  todayBorrow >= todayGiven
                    ? "text-blue-400"
                    : "text-orange-400",
                icon: Wallet,
              },
            ].map((item, i) => {
              const ItemIcon = item.icon;
              return (
                <div
                  key={i}
                  className={`flex items-center justify-between py-3 ${i < 2 ? "border-b border-white/8" : ""}`}
                >
                  <span className="flex items-center gap-2 text-xs text-stone-400">
                    <ItemIcon size={13} className={item.color} />
                    {item.label}
                  </span>
                  <span
                    className={`font-mono font-black text-sm ${item.color}`}
                  >
                    {item.value}
                  </span>
                </div>
              );
            })}
            {todayEntries.length === 0 && (
              <p className="text-[10px] text-stone-600 text-center mt-3">
                {t("dayBook.noEntriesToday")}
              </p>
            )}
          </motion.div>

          {/* Pending alerts */}
          {pendingCount > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-5"
            >
              <h3 className="font-bold text-amber-800 text-sm mb-3 flex items-center gap-2">
                <AlertCircle size={14} className="text-amber-600" />
                {t("dayBook.pendingSettlements")}
              </h3>
              <div className="space-y-2">
                {entries
                  .filter((e) => e.status === "pending")
                  .slice(0, 5)
                  .map((e) => (
                    <div
                      key={e.id}
                      className="flex justify-between items-center bg-white/70 rounded-xl px-3 py-2 text-xs"
                    >
                      <span className="text-stone-700 font-semibold truncate max-w-[120px]">
                        {e.party_name}
                      </span>
                      <span className="font-mono font-black text-amber-700">
                        ₹{e.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                {pendingCount > 5 && (
                  <p className="text-[10px] text-amber-600 text-center mt-1">
                    +{pendingCount - 5} {t("dayBook.morePending")}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Party breakdown — admin & manager */}
          {isAdminOrManager && partyBreakdown.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm"
            >
              <h3 className="font-bold text-stone-800 text-sm mb-4 flex items-center gap-2">
                <Users size={14} className="text-stone-500" />
                {t("dayBook.partyBreakdown")}
              </h3>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {partyBreakdown.map((p, i) => {
                  const PIconMap = {
                    staff: User,
                    vendor: Building2,
                    other: Users,
                  };
                  const PIcon = PIconMap[p.type] || Users;
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors"
                    >
                      <div className="p-1.5 bg-stone-200 rounded-lg shrink-0">
                        <PIcon size={13} className="text-stone-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-stone-800 truncate">
                          {p.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px]">
                          <span className="text-emerald-600 font-mono">
                            +₹{p.borrowed.toFixed(0)}
                          </span>
                          <span className="text-rose-600 font-mono">
                            -₹{p.given.toFixed(0)}
                          </span>
                          {p.pending > 0 && (
                            <span className="text-amber-600 font-mono flex items-center gap-0.5">
                              <Clock size={8} />₹{p.pending.toFixed(0)} pending
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <AddEntryModal
            onClose={() => setShowModal(false)}
            onSave={handleSave}
            users={users}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DayBook;
