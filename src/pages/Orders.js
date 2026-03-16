// import React, { useEffect, useState, useMemo } from "react";
// import axios from "axios";
// import { useAuth } from "@/context/AuthContext";
// import { useTranslation } from "react-i18next";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   FileText,
//   Eye,
//   X,
//   Search,
//   IndianRupee,
//   Package,
//   Calendar,
//   CreditCard,
//   User,
//   Hash,
//   ChevronRight,
//   ShoppingBag,
//   Tag,
//   Receipt,
//   RefreshCw,
// } from "lucide-react";

// const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

// const fmt = (iso) =>
//   iso
//     ? new Date(iso).toLocaleDateString("en-IN", {
//         day: "numeric",
//         month: "short",
//         year: "numeric",
//       })
//     : "—";
// const fmtTime = (iso) =>
//   iso
//     ? new Date(iso).toLocaleTimeString("en-IN", {
//         hour: "2-digit",
//         minute: "2-digit",
//       })
//     : "";
// const fmtFull = (iso) =>
//   iso
//     ? new Date(iso).toLocaleString("en-IN", {
//         day: "numeric",
//         month: "short",
//         year: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//       })
//     : "—";
// const rupee = (n) => `₹${(n || 0).toFixed(2)}`;

// const PAYMENT_COLORS = {
//   cash: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
//   card: "bg-blue-500/15 text-blue-400 border-blue-500/20",
//   upi: "bg-purple-500/15 text-purple-400 border-purple-500/20",
//   split: "bg-amber-500/15 text-amber-400 border-amber-500/20",
// };
// const pmColor = (m) =>
//   PAYMENT_COLORS[m?.toLowerCase()] ||
//   "bg-stone-500/15 text-stone-400 border-stone-500/20";

// // ── Order Detail Modal ────────────────────────────────────────
// const OrderModal = ({ order, onClose }) => {
//   if (!order) return null;
//   const hasGST = order.invoice_type === "gst" && order.tax > 0;

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
//       onClick={onClose}
//     >
//       <motion.div
//         initial={{ scale: 0.93, y: 16 }}
//         animate={{ scale: 1, y: 0 }}
//         exit={{ scale: 0.93, y: 16 }}
//         transition={{ type: "spring", stiffness: 340, damping: 30 }}
//         className="bg-[#1c1c2e] border border-white/10 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 flex-shrink-0">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-amber-500/15 rounded-xl border border-amber-500/20">
//               <Receipt size={17} className="text-amber-400" />
//             </div>
//             <div>
//               <p className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">
//                 Invoice
//               </p>
//               <p className="text-white font-black font-mono text-sm">
//                 {order.invoice_number}
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 rounded-xl hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
//           >
//             <X size={16} />
//           </button>
//         </div>

//         <div className="flex-1 overflow-y-auto">
//           {/* Meta */}
//           <div className="px-6 py-4 border-b border-white/8 grid grid-cols-2 gap-4">
//             <div>
//               <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-1">
//                 Date & Time
//               </p>
//               <p className="text-white text-xs font-semibold">
//                 {fmtFull(order.created_at)}
//               </p>
//             </div>
//             <div>
//               <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-1">
//                 Payment
//               </p>
//               <span
//                 className={`text-[11px] font-black px-2.5 py-1 rounded-full border capitalize ${pmColor(order.payment_mode)}`}
//               >
//                 {order.payment_mode || "Cash"}
//               </span>
//             </div>
//             {order.customer_name && (
//               <div>
//                 <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-1">
//                   Customer
//                 </p>
//                 <p className="text-white text-xs font-semibold">
//                   {order.customer_name}
//                 </p>
//                 {order.customer_phone && (
//                   <p className="text-stone-400 text-[11px]">
//                     {order.customer_phone}
//                   </p>
//                 )}
//               </div>
//             )}
//             {order.invoice_type && (
//               <div>
//                 <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-1">
//                   Type
//                 </p>
//                 <span className="text-[11px] font-black px-2.5 py-1 rounded-full border bg-stone-500/15 text-stone-400 border-stone-500/20 uppercase">
//                   {order.invoice_type === "gst"
//                     ? `GST ${order.gst_rate || ""}%`
//                     : "Non-GST"}
//                 </span>
//               </div>
//             )}
//           </div>

//           {/* Items */}
//           <div className="px-6 py-4 border-b border-white/8">
//             <p className="text-[10px] text-stone-500 uppercase tracking-widest font-bold mb-3">
//               {order.items?.length || 0} Items
//             </p>
//             <div className="space-y-2">
//               {(order.items || []).map((item, i) => (
//                 <div
//                   key={i}
//                   className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2.5"
//                 >
//                   <div className="flex items-center gap-2.5">
//                     <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center flex-shrink-0">
//                       <Package size={11} className="text-amber-400" />
//                     </div>
//                     <div>
//                       <p className="text-white text-xs font-semibold">
//                         {item.product_name}
//                       </p>
//                       <p className="text-stone-400 text-[10px]">
//                         {rupee(item.price)} × {item.quantity}
//                       </p>
//                     </div>
//                   </div>
//                   <p className="font-mono font-black text-sm text-white">
//                     {rupee(item.total)}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Totals */}
//           <div className="px-6 py-4 space-y-2">
//             {[
//               {
//                 label: "Subtotal",
//                 value: rupee(order.subtotal),
//                 color: "text-stone-300",
//               },
//               order.discount > 0 && {
//                 label: "Discount",
//                 value: `−${rupee(order.discount)}`,
//                 color: "text-emerald-400",
//               },
//               hasGST && {
//                 label: `Tax (GST ${order.gst_rate}%)`,
//                 value: rupee(order.tax),
//                 color: "text-stone-300",
//               },
//               order.round_off &&
//                 order.round_off !== 0 && {
//                   label: "Round Off",
//                   value: rupee(order.round_off),
//                   color: "text-stone-400",
//                 },
//             ]
//               .filter(Boolean)
//               .map((row, i) => (
//                 <div
//                   key={i}
//                   className="flex items-center justify-between text-sm"
//                 >
//                   <span className="text-stone-400">{row.label}</span>
//                   <span className={`font-mono font-semibold ${row.color}`}>
//                     {row.value}
//                   </span>
//                 </div>
//               ))}
//             <div className="flex items-center justify-between pt-3 border-t border-white/10">
//               <span className="font-black text-white text-base">Total</span>
//               <span className="font-mono font-black text-xl text-amber-400">
//                 {rupee(order.total)}
//               </span>
//             </div>
//           </div>

//           {order.narration && (
//             <div className="px-6 pb-4">
//               <p className="text-xs text-stone-500 italic bg-white/5 rounded-xl px-3 py-2">
//                 "{order.narration}"
//               </p>
//             </div>
//           )}
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// // ── Order Row ─────────────────────────────────────────────────
// const OrderRow = ({ order, index, onView }) => (
//   <motion.tr
//     initial={{ opacity: 0, y: 6 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ delay: index * 0.025 }}
//     className="group border-b border-stone-100 hover:bg-amber-50/40 transition-colors cursor-pointer"
//     onClick={onView}
//   >
//     <td className="px-5 py-3.5">
//       <p className="font-mono font-bold text-xs text-stone-800">
//         {order.invoice_number}
//       </p>
//       {order.customer_name && (
//         <p className="text-[10px] text-stone-400 mt-0.5 flex items-center gap-1">
//           <User size={9} />
//           {order.customer_name}
//         </p>
//       )}
//     </td>
//     <td className="px-5 py-3.5">
//       <p className="text-xs font-semibold text-stone-700">
//         {fmt(order.created_at)}
//       </p>
//       <p className="text-[10px] text-stone-400">{fmtTime(order.created_at)}</p>
//     </td>
//     <td className="px-5 py-3.5">
//       <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-600 text-[10px] font-bold px-2.5 py-1 rounded-full">
//         <Package size={9} />
//         {order.items?.length || 0} items
//       </span>
//     </td>
//     <td className="px-5 py-3.5">
//       <span
//         className={`text-[10px] font-black px-2 py-1 rounded-full border capitalize ${pmColor(order.payment_mode)}`}
//       >
//         {order.payment_mode || "cash"}
//       </span>
//     </td>
//     <td className="px-5 py-3.5">
//       <p className="font-mono text-xs text-stone-500">
//         {rupee(order.subtotal)}
//       </p>
//     </td>
//     <td className="px-5 py-3.5">
//       <p className="font-mono font-black text-sm text-stone-800">
//         {rupee(order.total)}
//       </p>
//     </td>
//     <td className="px-5 py-3.5 text-right">
//       <button
//         onClick={onView}
//         className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[11px] font-bold text-amber-600 hover:bg-amber-50 px-2.5 py-1.5 rounded-lg transition-all ml-auto"
//       >
//         <Eye size={11} />
//         View
//       </button>
//     </td>
//   </motion.tr>
// );

// // ── Mobile Card ───────────────────────────────────────────────
// const OrderCard = ({ order, index, onView }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 8 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ delay: index * 0.04 }}
//     onClick={onView}
//     className="bg-white border border-stone-100 rounded-2xl p-4 hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
//   >
//     <div className="flex items-start justify-between mb-2.5">
//       <div>
//         <p className="font-mono font-bold text-xs text-stone-800">
//           {order.invoice_number}
//         </p>
//         <p className="text-[10px] text-stone-400 mt-0.5">
//           {fmt(order.created_at)} · {fmtTime(order.created_at)}
//         </p>
//       </div>
//       <p className="font-mono font-black text-base text-stone-800">
//         {rupee(order.total)}
//       </p>
//     </div>
//     <div className="flex items-center gap-2">
//       <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
//         <Package size={8} />
//         {order.items?.length || 0} items
//       </span>
//       <span
//         className={`text-[10px] font-black px-2 py-0.5 rounded-full border capitalize ${pmColor(order.payment_mode)}`}
//       >
//         {order.payment_mode || "cash"}
//       </span>
//       {order.customer_name && (
//         <span className="text-[10px] text-stone-400 truncate ml-auto">
//           {order.customer_name}
//         </span>
//       )}
//     </div>
//   </motion.div>
// );

// // ── Main Page ─────────────────────────────────────────────────
// const Orders = () => {
//   const { token } = useAuth();
//   const { t } = useTranslation();
//   const [orders, setOrders] = useState([]);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [filterPayment, setFilterPayment] = useState("all");

//   useEffect(() => {
//     axios
//       .get(`${API_URL}/orders`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((r) => setOrders(Array.isArray(r.data) ? r.data : []))
//       .catch(() => {})
//       .finally(() => setLoading(false));
//   }, []);

//   const filtered = useMemo(
//     () =>
//       orders.filter((o) => {
//         if (
//           filterPayment !== "all" &&
//           o.payment_mode?.toLowerCase() !== filterPayment
//         )
//           return false;
//         if (search) {
//           const q = search.toLowerCase();
//           if (
//             !o.invoice_number?.toLowerCase().includes(q) &&
//             !o.customer_name?.toLowerCase().includes(q)
//           )
//             return false;
//         }
//         return true;
//       }),
//     [orders, search, filterPayment],
//   );

//   const stats = useMemo(
//     () => ({
//       count: orders.length,
//       revenue: orders.reduce((s, o) => s + (o.total || 0), 0),
//       today: orders.filter(
//         (o) => fmt(o.created_at) === fmt(new Date().toISOString()),
//       ).length,
//       avgOrder: orders.length
//         ? orders.reduce((s, o) => s + (o.total || 0), 0) / orders.length
//         : 0,
//     }),
//     [orders],
//   );

//   if (loading)
//     return (
//       <div className="flex items-center justify-center h-full bg-[#f7f6f3]">
//         <div className="text-center">
//           <div className="relative w-14 h-14 mx-auto mb-4">
//             <div className="absolute inset-0 rounded-full border-4 border-amber-100" />
//             <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
//           </div>
//           <p className="text-stone-400 text-sm">Loading orders…</p>
//         </div>
//       </div>
//     );

//   return (
//     <div className="min-h-full bg-[#f7f6f3] p-4 md:p-6 lg:p-8">
//       {/* ── Hero Header ── */}
//       <motion.div
//         initial={{ opacity: 0, y: -12 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="relative overflow-hidden bg-[#1c1c2e] rounded-2xl p-6 mb-6 shadow-xl"
//       >
//         <div
//           className="absolute inset-0 opacity-10 pointer-events-none"
//           style={{
//             backgroundImage:
//               "radial-gradient(circle at 85% 40%, #f59e0b 0%, transparent 50%), radial-gradient(circle at 10% 70%, #10b981 0%, transparent 45%)",
//           }}
//         />

//         <div className="relative flex items-center gap-4">
//           <div className="p-3 bg-amber-500/15 rounded-2xl border border-amber-500/20">
//             <FileText size={24} className="text-amber-400" />
//           </div>
//           <div>
//             <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
//               Order History
//             </h1>
//             <p className="text-stone-400 text-sm mt-0.5">
//               All past billing transactions
//             </p>
//           </div>
//         </div>

//         <div className="relative mt-5 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
//           {[
//             {
//               label: "Total Orders",
//               value: stats.count,
//               color: "text-stone-300",
//             },
//             {
//               label: "Total Revenue",
//               value: `₹${stats.revenue.toFixed(0)}`,
//               color: "text-amber-400",
//             },
//             {
//               label: "Today's Orders",
//               value: stats.today,
//               color: "text-emerald-400",
//             },
//             {
//               label: "Avg Order Value",
//               value: `₹${stats.avgOrder.toFixed(0)}`,
//               color: "text-blue-400",
//             },
//           ].map((s, i) => (
//             <div key={i}>
//               <p className="text-stone-500 text-[10px] uppercase tracking-wider font-semibold mb-0.5">
//                 {s.label}
//               </p>
//               <p className={`font-mono font-black text-2xl ${s.color}`}>
//                 {s.value}
//               </p>
//             </div>
//           ))}
//         </div>
//       </motion.div>

//       {/* ── Filters ── */}
//       <div className="bg-white rounded-2xl border border-stone-100 p-4 mb-5 shadow-sm flex flex-wrap gap-2 items-center">
//         <div className="relative flex-1 min-w-36">
//           <Search
//             size={13}
//             className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
//           />
//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search invoice or customer…"
//             className="w-full h-9 pl-8 pr-3 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/30 text-stone-700"
//           />
//         </div>
//         <select
//           value={filterPayment}
//           onChange={(e) => setFilterPayment(e.target.value)}
//           className="h-9 px-3 rounded-xl border border-stone-200 bg-white text-xs text-stone-600 outline-none"
//         >
//           <option value="all">All Payments</option>
//           <option value="cash">Cash</option>
//           <option value="card">Card</option>
//           <option value="upi">UPI</option>
//           <option value="split">Split</option>
//         </select>
//         {(search || filterPayment !== "all") && (
//           <button
//             onClick={() => {
//               setSearch("");
//               setFilterPayment("all");
//             }}
//             className="h-9 px-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold flex items-center gap-1"
//           >
//             <X size={11} />
//             Clear
//           </button>
//         )}
//         <span className="ml-auto text-xs text-stone-400 font-semibold">
//           {filtered.length} orders
//         </span>
//       </div>

//       {/* ── Content ── */}
//       {filtered.length === 0 ? (
//         <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-stone-100">
//           <div className="p-4 bg-amber-50 rounded-2xl mb-3">
//             <FileText size={28} className="text-amber-300" />
//           </div>
//           <p className="text-stone-500 font-semibold text-sm">
//             No orders found
//           </p>
//           <p className="text-stone-400 text-xs mt-1">
//             {orders.length === 0
//               ? "Orders will appear after billing"
//               : "Try adjusting your filters"}
//           </p>
//         </div>
//       ) : (
//         <>
//           {/* Mobile */}
//           <div className="md:hidden space-y-2.5">
//             {filtered.map((o, i) => (
//               <OrderCard
//                 key={o.id}
//                 order={o}
//                 index={i}
//                 onView={() => setSelectedOrder(o)}
//               />
//             ))}
//           </div>

//           {/* Desktop Table */}
//           <div className="hidden md:block bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm">
//             <table className="w-full">
//               <thead>
//                 <tr className="bg-[#1c1c2e]">
//                   {[
//                     "Invoice",
//                     "Date",
//                     "Items",
//                     "Payment",
//                     "Subtotal",
//                     "Total",
//                     "",
//                   ].map((h, i) => (
//                     <th
//                       key={i}
//                       className={`text-[10px] font-bold text-stone-400 uppercase tracking-widest px-5 py-3.5 ${i === 6 ? "text-right" : "text-left"}`}
//                     >
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 <AnimatePresence>
//                   {filtered.map((o, i) => (
//                     <OrderRow
//                       key={o.id}
//                       order={o}
//                       index={i}
//                       onView={() => setSelectedOrder(o)}
//                     />
//                   ))}
//                 </AnimatePresence>
//               </tbody>
//             </table>
//           </div>
//         </>
//       )}

//       <AnimatePresence>
//         {selectedOrder && (
//           <OrderModal
//             order={selectedOrder}
//             onClose={() => setSelectedOrder(null)}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default Orders;

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Eye,
  X,
  Search,
  IndianRupee,
  Package,
  Calendar,
  CreditCard,
  User,
  Hash,
  ChevronRight,
  ShoppingBag,
  Tag,
  Receipt,
  RefreshCw,
} from "lucide-react";

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const fmt = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";
const fmtTime = (iso) =>
  iso
    ? new Date(iso).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";
const fmtFull = (iso) =>
  iso
    ? new Date(iso).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";
const rupee = (n) => `₹${(n || 0).toFixed(2)}`;

const PAYMENT_COLORS = {
  cash: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  card: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  upi: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  split: "bg-amber-500/15 text-amber-400 border-amber-500/20",
};
const pmColor = (m) =>
  PAYMENT_COLORS[m?.toLowerCase()] ||
  "bg-stone-500/15 text-stone-400 border-stone-500/20";

// ── Order Detail Modal ────────────────────────────────────────
const OrderModal = ({ order, onClose }) => {
  if (!order) return null;
  const hasGST = order.invoice_type === "gst" && order.tax > 0;

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
            <div className="p-2 bg-amber-500/15 rounded-xl border border-amber-500/20">
              <Receipt size={17} className="text-amber-400" />
            </div>
            <div>
              <p className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">
                Invoice
              </p>
              <p className="text-white font-black font-mono text-sm">
                {order.invoice_number}
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

        <div className="flex-1 overflow-y-auto">
          {/* Meta */}
          <div className="px-6 py-4 border-b border-white/8 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-1">
                Date & Time
              </p>
              <p className="text-white text-xs font-semibold">
                {fmtFull(order.created_at)}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-1">
                Payment
              </p>
              <span
                className={`text-[11px] font-black px-2.5 py-1 rounded-full border capitalize ${pmColor(order.payment_mode)}`}
              >
                {order.payment_mode || "Cash"}
              </span>
            </div>
            {order.customer_name && (
              <div>
                <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-1">
                  Customer
                </p>
                <p className="text-white text-xs font-semibold">
                  {order.customer_name}
                </p>
                {order.customer_phone && (
                  <p className="text-stone-400 text-[11px]">
                    {order.customer_phone}
                  </p>
                )}
              </div>
            )}
            {order.invoice_type && (
              <div>
                <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-1">
                  Type
                </p>
                <span className="text-[11px] font-black px-2.5 py-1 rounded-full border bg-stone-500/15 text-stone-400 border-stone-500/20 uppercase">
                  {order.invoice_type === "gst"
                    ? `GST ${order.gst_rate || ""}%`
                    : "Non-GST"}
                </span>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="px-6 py-4 border-b border-white/8">
            <p className="text-[10px] text-stone-500 uppercase tracking-widest font-bold mb-3">
              {order.items?.length || 0} Items
            </p>
            <div className="space-y-2">
              {(order.items || []).map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                      <Package size={11} className="text-amber-400" />
                    </div>
                    <div>
                      <p className="text-white text-xs font-semibold">
                        {item.product_name}
                      </p>
                      <p className="text-stone-400 text-[10px]">
                        {rupee(item.price)} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-mono font-black text-sm text-white">
                    {rupee(item.total)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="px-6 py-4 space-y-2">
            {[
              {
                label: "Subtotal",
                value: rupee(order.subtotal),
                color: "text-stone-300",
              },
              order.discount > 0 && {
                label: "Discount",
                value: `−${rupee(order.discount)}`,
                color: "text-emerald-400",
              },
              hasGST && {
                label: `Tax (GST ${order.gst_rate}%)`,
                value: rupee(order.tax),
                color: "text-stone-300",
              },
              order.round_off &&
                order.round_off !== 0 && {
                  label: "Round Off",
                  value: rupee(order.round_off),
                  color: "text-stone-400",
                },
            ]
              .filter(Boolean)
              .map((row, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-stone-400">{row.label}</span>
                  <span className={`font-mono font-semibold ${row.color}`}>
                    {row.value}
                  </span>
                </div>
              ))}
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <span className="font-black text-white text-base">Total</span>
              <span className="font-mono font-black text-xl text-amber-400">
                {rupee(order.total)}
              </span>
            </div>
          </div>

          {order.narration && (
            <div className="px-6 pb-4">
              <p className="text-xs text-stone-500 italic bg-white/5 rounded-xl px-3 py-2">
                "{order.narration}"
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Order Row ─────────────────────────────────────────────────
const OrderRow = ({ order, index, onView }) => (
  <motion.tr
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.025 }}
    className="group border-b border-stone-100 hover:bg-amber-50/40 transition-colors cursor-pointer"
    onClick={onView}
  >
    <td className="px-5 py-3.5">
      <p className="font-mono font-bold text-xs text-stone-800">
        {order.invoice_number}
      </p>
      {order.customer_name && (
        <p className="text-[10px] text-stone-400 mt-0.5 flex items-center gap-1">
          <User size={9} />
          {order.customer_name}
        </p>
      )}
    </td>
    <td className="px-5 py-3.5">
      <p className="text-xs font-semibold text-stone-700">
        {fmt(order.created_at)}
      </p>
      <p className="text-[10px] text-stone-400">{fmtTime(order.created_at)}</p>
    </td>
    <td className="px-5 py-3.5">
      <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-600 text-[10px] font-bold px-2.5 py-1 rounded-full">
        <Package size={9} />
        {order.items?.length || 0} items
      </span>
    </td>
    <td className="px-5 py-3.5">
      <span
        className={`text-[10px] font-black px-2 py-1 rounded-full border capitalize ${pmColor(order.payment_mode)}`}
      >
        {order.payment_mode || "cash"}
      </span>
    </td>
    <td className="px-5 py-3.5">
      <p className="font-mono text-xs text-stone-500">
        {rupee(order.subtotal)}
      </p>
    </td>
    <td className="px-5 py-3.5">
      <p className="font-mono font-black text-sm text-stone-800">
        {rupee(order.total)}
      </p>
    </td>
    <td className="px-5 py-3.5 text-right">
      <button
        onClick={onView}
        className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[11px] font-bold text-amber-600 hover:bg-amber-50 px-2.5 py-1.5 rounded-lg transition-all ml-auto"
      >
        <Eye size={11} />
        View
      </button>
    </td>
  </motion.tr>
);

// ── Mobile Card ───────────────────────────────────────────────
const OrderCard = ({ order, index, onView }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.04 }}
    onClick={onView}
    className="bg-white border border-stone-100 rounded-2xl p-4 hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
  >
    <div className="flex items-start justify-between mb-2.5">
      <div>
        <p className="font-mono font-bold text-xs text-stone-800">
          {order.invoice_number}
        </p>
        <p className="text-[10px] text-stone-400 mt-0.5">
          {fmt(order.created_at)} · {fmtTime(order.created_at)}
        </p>
      </div>
      <p className="font-mono font-black text-base text-stone-800">
        {rupee(order.total)}
      </p>
    </div>
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
        <Package size={8} />
        {order.items?.length || 0} items
      </span>
      <span
        className={`text-[10px] font-black px-2 py-0.5 rounded-full border capitalize ${pmColor(order.payment_mode)}`}
      >
        {order.payment_mode || "cash"}
      </span>
      {order.customer_name && (
        <span className="text-[10px] text-stone-400 truncate ml-auto">
          {order.customer_name}
        </span>
      )}
    </div>
  </motion.div>
);

// ── Main Page ─────────────────────────────────────────────────
const Orders = () => {
  const { token, user } = useAuth();
  const { t } = useTranslation();
  const canViewOrders = ["admin", "billing"].includes(user?.role);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterPayment, setFilterPayment] = useState("all");

  useEffect(() => {
    axios
      .get(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => setOrders(Array.isArray(r.data) ? r.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () =>
      orders.filter((o) => {
        if (
          filterPayment !== "all" &&
          o.payment_mode?.toLowerCase() !== filterPayment
        )
          return false;
        if (search) {
          const q = search.toLowerCase();
          if (
            !o.invoice_number?.toLowerCase().includes(q) &&
            !o.customer_name?.toLowerCase().includes(q)
          )
            return false;
        }
        return true;
      }),
    [orders, search, filterPayment],
  );

  const stats = useMemo(
    () => ({
      count: orders.length,
      revenue: orders.reduce((s, o) => s + (o.total || 0), 0),
      today: orders.filter(
        (o) => fmt(o.created_at) === fmt(new Date().toISOString()),
      ).length,
      avgOrder: orders.length
        ? orders.reduce((s, o) => s + (o.total || 0), 0) / orders.length
        : 0,
    }),
    [orders],
  );

  if (!canViewOrders)
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-[#f7f6f3]">
        <div className="p-5 bg-stone-100 rounded-2xl mb-4">
          <FileText size={44} className="text-stone-300" />
        </div>
        <p className="font-black text-stone-600 text-lg">Access Denied</p>
        <p className="text-stone-400 text-sm mt-1">
          Only Admin and Billing staff can view orders.
        </p>
      </div>
    );

  if (loading)
    return (
      <div className="flex items-center justify-center h-full bg-[#f7f6f3]">
        <div className="text-center">
          <div className="relative w-14 h-14 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-amber-100" />
            <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
          </div>
          <p className="text-stone-400 text-sm">Loading orders…</p>
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
              "radial-gradient(circle at 85% 40%, #f59e0b 0%, transparent 50%), radial-gradient(circle at 10% 70%, #10b981 0%, transparent 45%)",
          }}
        />

        <div className="relative flex items-center gap-4">
          <div className="p-3 bg-amber-500/15 rounded-2xl border border-amber-500/20">
            <FileText size={24} className="text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Order History
            </h1>
            <p className="text-stone-400 text-sm mt-0.5">
              All past billing transactions
            </p>
          </div>
        </div>

        <div className="relative mt-5 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Total Orders",
              value: stats.count,
              color: "text-stone-300",
            },
            {
              label: "Total Revenue",
              value: `₹${stats.revenue.toFixed(0)}`,
              color: "text-amber-400",
            },
            {
              label: "Today's Orders",
              value: stats.today,
              color: "text-emerald-400",
            },
            {
              label: "Avg Order Value",
              value: `₹${stats.avgOrder.toFixed(0)}`,
              color: "text-blue-400",
            },
          ].map((s, i) => (
            <div key={i}>
              <p className="text-stone-500 text-[10px] uppercase tracking-wider font-semibold mb-0.5">
                {s.label}
              </p>
              <p className={`font-mono font-black text-2xl ${s.color}`}>
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Filters ── */}
      <div className="bg-white rounded-2xl border border-stone-100 p-4 mb-5 shadow-sm flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-36">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice or customer…"
            className="w-full h-9 pl-8 pr-3 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/30 text-stone-700"
          />
        </div>
        <select
          value={filterPayment}
          onChange={(e) => setFilterPayment(e.target.value)}
          className="h-9 px-3 rounded-xl border border-stone-200 bg-white text-xs text-stone-600 outline-none"
        >
          <option value="all">All Payments</option>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="upi">UPI</option>
          <option value="split">Split</option>
        </select>
        {(search || filterPayment !== "all") && (
          <button
            onClick={() => {
              setSearch("");
              setFilterPayment("all");
            }}
            className="h-9 px-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold flex items-center gap-1"
          >
            <X size={11} />
            Clear
          </button>
        )}
        <span className="ml-auto text-xs text-stone-400 font-semibold">
          {filtered.length} orders
        </span>
      </div>

      {/* ── Content ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-stone-100">
          <div className="p-4 bg-amber-50 rounded-2xl mb-3">
            <FileText size={28} className="text-amber-300" />
          </div>
          <p className="text-stone-500 font-semibold text-sm">
            No orders found
          </p>
          <p className="text-stone-400 text-xs mt-1">
            {orders.length === 0
              ? "Orders will appear after billing"
              : "Try adjusting your filters"}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile */}
          <div className="md:hidden space-y-2.5">
            {filtered.map((o, i) => (
              <OrderCard
                key={o.id}
                order={o}
                index={i}
                onView={() => setSelectedOrder(o)}
              />
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-[#1c1c2e]">
                  {[
                    "Invoice",
                    "Date",
                    "Items",
                    "Payment",
                    "Subtotal",
                    "Total",
                    "",
                  ].map((h, i) => (
                    <th
                      key={i}
                      className={`text-[10px] font-bold text-stone-400 uppercase tracking-widest px-5 py-3.5 ${i === 6 ? "text-right" : "text-left"}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((o, i) => (
                    <OrderRow
                      key={o.id}
                      order={o}
                      index={i}
                      onView={() => setSelectedOrder(o)}
                    />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </>
      )}

      <AnimatePresence>
        {selectedOrder && (
          <OrderModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;
