// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "@/context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   MapPin,
//   Plus,
//   Pencil,
//   Trash2,
//   Eye,
//   X,
//   RefreshCw,
//   Package,
//   LayoutGrid,
//   Warehouse,
//   Store,
//   Hash,
//   AlignLeft,
//   Layers,
//   ChevronRight,
//   AlertTriangle,
// } from "lucide-react";
// import { toast } from "sonner";

// const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

// // ── Add / Edit Rack Modal ─────────────────────────────────────
// const RackModal = ({ editingRack, locations, onClose, onSave }) => {
//   const [form, setForm] = useState({
//     code: editingRack?.code || "",
//     name: editingRack?.name || "",
//     location_id: editingRack?.location_id || "",
//     description: editingRack?.description || "",
//     max_capacity: editingRack?.max_capacity?.toString() || "",
//   });
//   const [saving, setSaving] = useState(false);
//   const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

//   const handleSubmit = async () => {
//     if (!form.code.trim()) {
//       toast.error("Rack code is required");
//       return;
//     }
//     if (!form.name.trim()) {
//       toast.error("Rack name is required");
//       return;
//     }
//     if (!form.location_id) {
//       toast.error("Please select a location");
//       return;
//     }
//     setSaving(true);
//     try {
//       await onSave({
//         ...form,
//         max_capacity: form.max_capacity ? parseInt(form.max_capacity) : null,
//       });
//       onClose();
//     } finally {
//       setSaving(false);
//     }
//   };

//   const selectedLoc = locations.find((l) => l.id === form.location_id);
//   const isMall = selectedLoc?.type === "mall";

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
//         className="bg-[#1c1c2e] border border-white/10 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
//           <div className="flex items-center gap-3">
//             <div
//               className={`p-2 rounded-xl ${isMall ? "bg-blue-500/15" : "bg-amber-500/15"}`}
//             >
//               <MapPin
//                 size={17}
//                 className={isMall ? "text-blue-400" : "text-amber-400"}
//               />
//             </div>
//             <h2 className="text-base font-bold text-white">
//               {editingRack ? "Edit Rack" : "Add New Rack"}
//             </h2>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 rounded-xl hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
//           >
//             <X size={16} />
//           </button>
//         </div>

//         <div className="px-6 py-5 space-y-4">
//           {/* Location picker */}
//           <div>
//             <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 block">
//               Location *
//             </label>
//             <select
//               value={form.location_id}
//               onChange={(e) => set("location_id", e.target.value)}
//               className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-3 text-stone-300 text-sm outline-none focus:ring-2 focus:ring-amber-500/40"
//             >
//               <option value="" className="bg-[#1c1c2e]">
//                 — Select location —
//               </option>
//               {locations.map((l) => (
//                 <option key={l.id} value={l.id} className="bg-[#1c1c2e]">
//                   {l.name} ({l.type})
//                 </option>
//               ))}
//             </select>
//             {selectedLoc && (
//               <div
//                 className={`mt-2 flex items-center gap-2 px-3 py-2 rounded-xl ${isMall ? "bg-blue-500/10 border border-blue-500/20" : "bg-amber-500/10 border border-amber-500/20"}`}
//               >
//                 {isMall ? (
//                   <Store size={12} className="text-blue-400" />
//                 ) : (
//                   <Warehouse size={12} className="text-amber-400" />
//                 )}
//                 <span
//                   className={`text-[11px] font-semibold ${isMall ? "text-blue-300" : "text-amber-300"}`}
//                 >
//                   {selectedLoc.name}
//                 </span>
//               </div>
//             )}
//           </div>

//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 block">
//                 Rack Code *
//               </label>
//               <div className="relative">
//                 <Hash
//                   size={12}
//                   className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500"
//                 />
//                 <input
//                   value={form.code}
//                   onChange={(e) => set("code", e.target.value.toUpperCase())}
//                   placeholder="A1, B2, WALL-1"
//                   className="w-full h-11 bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 text-white text-sm font-mono outline-none focus:ring-2 focus:ring-amber-500/40 placeholder-stone-600"
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 block">
//                 Max Capacity
//               </label>
//               <div className="relative">
//                 <Layers
//                   size={12}
//                   className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500"
//                 />
//                 <input
//                   type="number"
//                   value={form.max_capacity}
//                   onChange={(e) => set("max_capacity", e.target.value)}
//                   placeholder="100"
//                   className="w-full h-11 bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 text-white text-sm outline-none focus:ring-2 focus:ring-amber-500/40 placeholder-stone-600"
//                 />
//               </div>
//             </div>
//           </div>

//           <div>
//             <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 block">
//               Rack Name *
//             </label>
//             <input
//               value={form.name}
//               onChange={(e) => set("name", e.target.value)}
//               placeholder="Front Display Rack"
//               className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm outline-none focus:ring-2 focus:ring-amber-500/40 placeholder-stone-600"
//             />
//           </div>

//           <div>
//             <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 block">
//               Description
//             </label>
//             <div className="relative">
//               <AlignLeft
//                 size={12}
//                 className="absolute left-3 top-3 text-stone-500"
//               />
//               <textarea
//                 value={form.description}
//                 onChange={(e) => set("description", e.target.value)}
//                 rows={2}
//                 placeholder="e.g. Top shelf near entrance, next to window display"
//                 className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-3 text-stone-300 text-sm resize-none outline-none focus:ring-2 focus:ring-amber-500/40 placeholder-stone-600"
//               />
//             </div>
//           </div>
//         </div>

//         <div className="px-6 py-4 border-t border-white/10 flex gap-3">
//           <button
//             onClick={onClose}
//             className="flex-1 h-11 rounded-xl border border-white/10 text-stone-400 hover:text-white hover:border-white/20 text-sm font-semibold transition-all"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={saving}
//             className="flex-1 h-11 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-900 font-black text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
//           >
//             {saving ? (
//               <>
//                 <RefreshCw size={13} className="animate-spin" />
//                 Saving…
//               </>
//             ) : (
//               <>
//                 <MapPin size={14} />
//                 {editingRack ? "Update Rack" : "Create Rack"}
//               </>
//             )}
//           </button>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// // ── Rack Card ─────────────────────────────────────────────────
// const RackCard = ({ rack, type, isAdmin, onEdit, onDelete, onView, index }) => {
//   const isMall = type === "mall";
//   const accent = isMall
//     ? {
//         bg: "bg-blue-500/10",
//         border: "border-blue-500/20",
//         text: "text-blue-400",
//         badge: "bg-blue-500/15 text-blue-400",
//         hover: "hover:border-blue-400/30 hover:shadow-blue-900/20",
//       }
//     : {
//         bg: "bg-amber-500/10",
//         border: "border-amber-500/20",
//         text: "text-amber-400",
//         badge: "bg-amber-500/15 text-amber-400",
//         hover: "hover:border-amber-400/30 hover:shadow-amber-900/20",
//       };

//   const utilPct =
//     rack.max_capacity && rack.assigned_count
//       ? Math.min(
//           100,
//           Math.round((rack.assigned_count / rack.max_capacity) * 100),
//         )
//       : null;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, scale: 0.96 }}
//       transition={{ delay: index * 0.05 }}
//       className={`group relative bg-[#1c1c2e] border rounded-2xl p-4 hover:shadow-xl transition-all duration-200 cursor-pointer ${accent.border} ${accent.hover}`}
//       onClick={onView}
//     >
//       {/* Top row */}
//       <div className="flex items-start justify-between mb-3">
//         <div className="flex items-center gap-2.5">
//           <div
//             className={`w-10 h-10 rounded-xl ${accent.bg} border ${accent.border} flex items-center justify-center flex-shrink-0`}
//           >
//             <span className={`font-black text-sm font-mono ${accent.text}`}>
//               {rack.code}
//             </span>
//           </div>
//           <div>
//             <h3 className="font-bold text-white text-sm leading-tight">
//               {rack.name}
//             </h3>
//             {rack.description && (
//               <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
//                 {rack.description}
//               </p>
//             )}
//           </div>
//         </div>
//         {/* Action buttons — revealed on hover */}
//         {isAdmin && (
//           <div
//             className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={onEdit}
//               className="p-1.5 rounded-lg text-stone-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
//             >
//               <Pencil size={12} />
//             </button>
//             <button
//               onClick={onDelete}
//               className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
//             >
//               <Trash2 size={12} />
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Capacity bar */}
//       {rack.max_capacity && (
//         <div className="mb-3">
//           <div className="flex items-center justify-between mb-1">
//             <span className="text-[10px] text-stone-500">Capacity</span>
//             <span className="text-[10px] font-bold text-stone-400">
//               {rack.assigned_count || 0} / {rack.max_capacity} SKUs
//             </span>
//           </div>
//           <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
//             <motion.div
//               initial={{ width: 0 }}
//               animate={{ width: `${utilPct || 0}%` }}
//               transition={{
//                 delay: index * 0.05 + 0.3,
//                 duration: 0.6,
//                 ease: "easeOut",
//               }}
//               className={`h-full rounded-full ${
//                 utilPct > 85
//                   ? "bg-rose-500"
//                   : utilPct > 60
//                     ? "bg-amber-500"
//                     : isMall
//                       ? "bg-blue-500"
//                       : "bg-amber-500"
//               }`}
//             />
//           </div>
//         </div>
//       )}

//       {/* Footer */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-1.5">
//           <Package size={11} className="text-stone-500" />
//           <span className="text-[11px] text-stone-500">
//             {rack.assigned_count || 0} products
//           </span>
//         </div>
//         <div
//           className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${accent.badge}`}
//         >
//           <Eye size={9} />
//           View
//           <ChevronRight size={9} />
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// // ── Section ───────────────────────────────────────────────────
// const LocationSection = ({
//   title,
//   icon: Icon,
//   racks,
//   type,
//   locations,
//   isAdmin,
//   onEdit,
//   onDelete,
//   onView,
// }) => {
//   const isMall = type === "mall";
//   const colors = isMall
//     ? {
//         header: "from-blue-500/10 to-transparent border-blue-500/20",
//         text: "text-blue-400",
//         dot: "bg-blue-500",
//         count: "bg-blue-500/15 text-blue-400 border-blue-500/20",
//       }
//     : {
//         header: "from-amber-500/10 to-transparent border-amber-500/20",
//         text: "text-amber-400",
//         dot: "bg-amber-500",
//         count: "bg-amber-500/15 text-amber-400 border-amber-500/20",
//       };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 12 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden"
//     >
//       {/* Section header */}
//       <div
//         className={`flex items-center justify-between px-5 py-4 bg-gradient-to-r border-b ${colors.header}`}
//       >
//         <div className="flex items-center gap-3">
//           <div
//             className={`p-2 rounded-xl ${isMall ? "bg-blue-500/15" : "bg-amber-500/15"}`}
//           >
//             <Icon size={18} className={colors.text.split(" ")[0]} />
//           </div>
//           <div>
//             <h2 className="font-black text-[#1c1c2e] text-base">{title}</h2>
//             <p className="text-[11px] text-stone-400 mt-0.5">
//               {isMall
//                 ? "Customer-facing display areas"
//                 : "Back-end storage areas"}
//             </p>
//           </div>
//         </div>
//         <span
//           className={`text-xs font-black px-3 py-1.5 rounded-full border ${colors.count}`}
//         >
//           {racks.length} rack{racks.length !== 1 ? "s" : ""}
//         </span>
//       </div>

//       <div className="p-5">
//         {racks.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-10 text-center">
//             <div
//               className={`p-4 rounded-2xl mb-3 ${isMall ? "bg-blue-50" : "bg-amber-50"}`}
//             >
//               <Icon
//                 size={28}
//                 className={isMall ? "text-blue-300" : "text-amber-300"}
//               />
//             </div>
//             <p className="text-stone-400 font-semibold text-sm">No racks yet</p>
//             <p className="text-stone-300 text-xs mt-1">
//               Add your first rack to this location
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
//             <AnimatePresence mode="popLayout">
//               {racks.map((rack, i) => (
//                 <RackCard
//                   key={rack.id}
//                   rack={rack}
//                   type={type}
//                   isAdmin={isAdmin}
//                   onEdit={() => onEdit(rack)}
//                   onDelete={() => onDelete(rack.id)}
//                   onView={() => onView(rack.id)}
//                   index={i}
//                 />
//               ))}
//             </AnimatePresence>
//           </div>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// // ── Main Page ─────────────────────────────────────────────────
// const LocationsRacks = () => {
//   const { token, user } = useAuth();
//   const { t } = useTranslation();
//   const navigate = useNavigate();
//   const isAdmin = user?.role === "admin";
//   const canEdit = ["admin", "manager"].includes(user?.role);

//   const [locations, setLocations] = useState([]);
//   const [racks, setRacks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editingRack, setEditingRack] = useState(null);

//   const headers = { Authorization: `Bearer ${token}` };

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [locsRes, racksRes] = await Promise.all([
//         axios.get(`${API_URL}/locations`, { headers }),
//         axios.get(`${API_URL}/racks`, { headers }),
//       ]);
//       setLocations(Array.isArray(locsRes.data) ? locsRes.data : []);
//       setRacks(Array.isArray(racksRes.data) ? racksRes.data : []);
//     } catch {
//       toast.error("Failed to load data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleSave = async (payload) => {
//     try {
//       if (editingRack) {
//         await axios.put(`${API_URL}/racks/${editingRack.id}`, payload, {
//           headers,
//         });
//         toast.success("Rack updated!");
//       } else {
//         await axios.post(`${API_URL}/racks`, payload, { headers });
//         toast.success("Rack created!");
//       }
//       fetchData();
//     } catch (err) {
//       toast.error(err.response?.data?.detail || "Failed to save rack");
//       throw err;
//     }
//   };

//   const handleDelete = async (id) => {
//     if (
//       !window.confirm(
//         "Delete this rack? All product assignments will be removed.",
//       )
//     )
//       return;
//     try {
//       await axios.delete(`${API_URL}/racks/${id}`, { headers });
//       toast.success("Rack deleted");
//       fetchData();
//     } catch (err) {
//       toast.error(err.response?.data?.detail || "Failed to delete");
//     }
//   };

//   const openAdd = () => {
//     setEditingRack(null);
//     setShowModal(true);
//   };
//   const openEdit = (rack) => {
//     setEditingRack(rack);
//     setShowModal(true);
//   };

//   const mallRacks = racks.filter(
//     (r) => locations.find((l) => l.id === r.location_id)?.type === "mall",
//   );
//   const warehouseRacks = racks.filter(
//     (r) => locations.find((l) => l.id === r.location_id)?.type === "warehouse",
//   );
//   const totalProducts = racks.reduce(
//     (sum, r) => sum + (r.assigned_count || 0),
//     0,
//   );

//   if (loading)
//     return (
//       <div className="flex items-center justify-center h-full bg-[#f7f6f3]">
//         <div className="text-center">
//           <div className="relative w-14 h-14 mx-auto mb-4">
//             <div className="absolute inset-0 rounded-full border-4 border-amber-100" />
//             <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
//           </div>
//           <p className="text-stone-400 text-sm">Loading locations…</p>
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
//               "radial-gradient(circle at 80% 50%, #3b82f6 0%, transparent 45%), radial-gradient(circle at 15% 70%, #f59e0b 0%, transparent 40%)",
//           }}
//         />

//         <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//           <div className="flex items-center gap-4">
//             <div className="p-3 bg-blue-500/15 rounded-2xl border border-blue-500/20">
//               <MapPin size={24} className="text-blue-400" />
//             </div>
//             <div>
//               <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
//                 Locations & Racks
//               </h1>
//               <p className="text-stone-400 text-sm mt-0.5">
//                 Manage physical display and storage areas
//               </p>
//             </div>
//           </div>
//           {canEdit && (
//             <button
//               onClick={openAdd}
//               className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-900 font-black text-sm px-5 py-3 rounded-xl transition-all shadow-lg shadow-amber-900/30 active:scale-95"
//             >
//               <Plus size={16} />
//               Add Rack
//             </button>
//           )}
//         </div>

//         {/* Stats strip */}
//         <div className="relative mt-5 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
//           {[
//             {
//               label: "Total Racks",
//               value: racks.length,
//               color: "text-stone-300",
//             },
//             {
//               label: "Mall Showroom",
//               value: mallRacks.length,
//               color: "text-blue-400",
//             },
//             {
//               label: "Warehouse",
//               value: warehouseRacks.length,
//               color: "text-amber-400",
//             },
//             {
//               label: "Products Placed",
//               value: totalProducts,
//               color: "text-emerald-400",
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

//       {/* ── Location Sections ── */}
//       <div className="space-y-5">
//         <LocationSection
//           title="Mall Showroom"
//           icon={Store}
//           racks={mallRacks}
//           type="mall"
//           locations={locations}
//           isAdmin={canEdit}
//           onEdit={openEdit}
//           onDelete={handleDelete}
//           onView={(id) => navigate(`/rack/${id}`)}
//         />
//         <LocationSection
//           title="Warehouse Storage"
//           icon={Warehouse}
//           racks={warehouseRacks}
//           type="warehouse"
//           locations={locations}
//           isAdmin={canEdit}
//           onEdit={openEdit}
//           onDelete={handleDelete}
//           onView={(id) => navigate(`/rack/${id}`)}
//         />
//       </div>

//       <AnimatePresence>
//         {showModal && (
//           <RackModal
//             editingRack={editingRack}
//             locations={locations}
//             onClose={() => setShowModal(false)}
//             onSave={handleSave}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default LocationsRacks;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Eye,
  X,
  RefreshCw,
  Package,
  LayoutGrid,
  Warehouse,
  Store,
  Hash,
  AlignLeft,
  Layers,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

// ── Add / Edit Rack Modal ─────────────────────────────────────
const RackModal = ({ editingRack, locations, onClose, onSave }) => {
  const [form, setForm] = useState({
    code: editingRack?.code || "",
    name: editingRack?.name || "",
    location_id: editingRack?.location_id || "",
    description: editingRack?.description || "",
    max_capacity: editingRack?.max_capacity?.toString() || "",
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.code.trim()) {
      toast.error("Rack code is required");
      return;
    }
    if (!form.name.trim()) {
      toast.error("Rack name is required");
      return;
    }
    if (!form.location_id) {
      toast.error("Please select a location");
      return;
    }
    setSaving(true);
    try {
      await onSave({
        ...form,
        max_capacity: form.max_capacity ? parseInt(form.max_capacity) : null,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const selectedLoc = locations.find((l) => l.id === form.location_id);
  const isMall = selectedLoc?.type === "mall";

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
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl ${isMall ? "bg-blue-500/15" : "bg-amber-500/15"}`}
            >
              <MapPin
                size={17}
                className={isMall ? "text-blue-400" : "text-amber-400"}
              />
            </div>
            <h2 className="text-base font-bold text-white">
              {editingRack ? "Edit Rack" : "Add New Rack"}
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
          {/* Location picker */}
          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 block">
              Location *
            </label>
            <select
              value={form.location_id}
              onChange={(e) => set("location_id", e.target.value)}
              className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-3 text-stone-300 text-sm outline-none focus:ring-2 focus:ring-amber-500/40"
            >
              <option value="" className="bg-[#1c1c2e]">
                — Select location —
              </option>
              {locations.map((l) => (
                <option key={l.id} value={l.id} className="bg-[#1c1c2e]">
                  {l.name} ({l.type})
                </option>
              ))}
            </select>
            {selectedLoc && (
              <div
                className={`mt-2 flex items-center gap-2 px-3 py-2 rounded-xl ${isMall ? "bg-blue-500/10 border border-blue-500/20" : "bg-amber-500/10 border border-amber-500/20"}`}
              >
                {isMall ? (
                  <Store size={12} className="text-blue-400" />
                ) : (
                  <Warehouse size={12} className="text-amber-400" />
                )}
                <span
                  className={`text-[11px] font-semibold ${isMall ? "text-blue-300" : "text-amber-300"}`}
                >
                  {selectedLoc.name}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 block">
                Rack Code *
              </label>
              <div className="relative">
                <Hash
                  size={12}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500"
                />
                <input
                  value={form.code}
                  onChange={(e) => set("code", e.target.value.toUpperCase())}
                  placeholder="A1, B2, WALL-1"
                  className="w-full h-11 bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 text-white text-sm font-mono outline-none focus:ring-2 focus:ring-amber-500/40 placeholder-stone-600"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 block">
                Max Capacity
              </label>
              <div className="relative">
                <Layers
                  size={12}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500"
                />
                <input
                  type="number"
                  value={form.max_capacity}
                  onChange={(e) => set("max_capacity", e.target.value)}
                  placeholder="100"
                  className="w-full h-11 bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 text-white text-sm outline-none focus:ring-2 focus:ring-amber-500/40 placeholder-stone-600"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 block">
              Rack Name *
            </label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Front Display Rack"
              className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm outline-none focus:ring-2 focus:ring-amber-500/40 placeholder-stone-600"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 block">
              Description
            </label>
            <div className="relative">
              <AlignLeft
                size={12}
                className="absolute left-3 top-3 text-stone-500"
              />
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={2}
                placeholder="e.g. Top shelf near entrance, next to window display"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-3 text-stone-300 text-sm resize-none outline-none focus:ring-2 focus:ring-amber-500/40 placeholder-stone-600"
              />
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
                Saving…
              </>
            ) : (
              <>
                <MapPin size={14} />
                {editingRack ? "Update Rack" : "Create Rack"}
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Rack Card ─────────────────────────────────────────────────
const RackCard = ({ rack, type, isAdmin, onEdit, onDelete, onView, index }) => {
  const isMall = type === "mall";
  const accent = isMall
    ? {
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        text: "text-blue-400",
        badge: "bg-blue-500/15 text-blue-400",
        hover: "hover:border-blue-400/30 hover:shadow-blue-900/20",
      }
    : {
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        text: "text-amber-400",
        badge: "bg-amber-500/15 text-amber-400",
        hover: "hover:border-amber-400/30 hover:shadow-amber-900/20",
      };

  const utilPct =
    rack.max_capacity && rack.assigned_count
      ? Math.min(
          100,
          Math.round((rack.assigned_count / rack.max_capacity) * 100),
        )
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ delay: index * 0.05 }}
      className={`group relative bg-[#1c1c2e] border rounded-2xl p-4 hover:shadow-xl transition-all duration-200 cursor-pointer ${accent.border} ${accent.hover}`}
      onClick={onView}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-10 h-10 rounded-xl ${accent.bg} border ${accent.border} flex items-center justify-center flex-shrink-0`}
          >
            <span className={`font-black text-sm font-mono ${accent.text}`}>
              {rack.code}
            </span>
          </div>
          <div>
            <h3 className="font-bold text-white text-sm leading-tight">
              {rack.name}
            </h3>
            {rack.description && (
              <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                {rack.description}
              </p>
            )}
          </div>
        </div>
        {/* Action buttons — revealed on hover */}
        {isAdmin && (
          <div
            className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onEdit}
              className="p-1.5 rounded-lg text-stone-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
            >
              <Pencil size={12} />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>

      {/* Capacity bar */}
      {rack.max_capacity && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-stone-500">Capacity</span>
            <span className="text-[10px] font-bold text-stone-400">
              {rack.assigned_count || 0} / {rack.max_capacity} SKUs
            </span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${utilPct || 0}%` }}
              transition={{
                delay: index * 0.05 + 0.3,
                duration: 0.6,
                ease: "easeOut",
              }}
              className={`h-full rounded-full ${
                utilPct > 85
                  ? "bg-rose-500"
                  : utilPct > 60
                    ? "bg-amber-500"
                    : isMall
                      ? "bg-blue-500"
                      : "bg-amber-500"
              }`}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Package size={11} className="text-stone-500" />
          <span className="text-[11px] text-stone-500">
            {rack.assigned_count || 0} products
          </span>
        </div>
        <div
          className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${accent.badge}`}
        >
          <Eye size={9} />
          View
          <ChevronRight size={9} />
        </div>
      </div>
    </motion.div>
  );
};

// ── Section ───────────────────────────────────────────────────
const LocationSection = ({
  title,
  icon: Icon,
  racks,
  type,
  locations,
  isAdmin,
  onEdit,
  onDelete,
  onView,
}) => {
  const isMall = type === "mall";
  const colors = isMall
    ? {
        header: "from-blue-500/10 to-transparent border-blue-500/20",
        text: "text-blue-400",
        dot: "bg-blue-500",
        count: "bg-blue-500/15 text-blue-400 border-blue-500/20",
      }
    : {
        header: "from-amber-500/10 to-transparent border-amber-500/20",
        text: "text-amber-400",
        dot: "bg-amber-500",
        count: "bg-amber-500/15 text-amber-400 border-amber-500/20",
      };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden"
    >
      {/* Section header */}
      <div
        className={`flex items-center justify-between px-5 py-4 bg-gradient-to-r border-b ${colors.header}`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-xl ${isMall ? "bg-blue-500/15" : "bg-amber-500/15"}`}
          >
            <Icon size={18} className={colors.text.split(" ")[0]} />
          </div>
          <div>
            <h2 className="font-black text-[#1c1c2e] text-base">{title}</h2>
            <p className="text-[11px] text-stone-400 mt-0.5">
              {isMall
                ? "Customer-facing display areas"
                : "Back-end storage areas"}
            </p>
          </div>
        </div>
        <span
          className={`text-xs font-black px-3 py-1.5 rounded-full border ${colors.count}`}
        >
          {racks.length} rack{racks.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="p-5">
        {racks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div
              className={`p-4 rounded-2xl mb-3 ${isMall ? "bg-blue-50" : "bg-amber-50"}`}
            >
              <Icon
                size={28}
                className={isMall ? "text-blue-300" : "text-amber-300"}
              />
            </div>
            <p className="text-stone-400 font-semibold text-sm">No racks yet</p>
            <p className="text-stone-300 text-xs mt-1">
              Add your first rack to this location
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            <AnimatePresence mode="popLayout">
              {racks.map((rack, i) => (
                <RackCard
                  key={rack.id}
                  rack={rack}
                  type={type}
                  isAdmin={isAdmin}
                  onEdit={() => onEdit(rack)}
                  onDelete={() => onDelete(rack.id)}
                  onView={() => onView(rack.id)}
                  index={i}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ── Main Page ─────────────────────────────────────────────────
const LocationsRacks = () => {
  const { token, user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";
  const canEdit = ["admin", "manager"].includes(user?.role);

  const [locations, setLocations] = useState([]);
  const [racks, setRacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRack, setEditingRack] = useState(null);

  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [locsRes, racksRes] = await Promise.all([
        axios.get(`${API_URL}/locations`, { headers }),
        axios.get(`${API_URL}/racks`, { headers }),
      ]);
      setLocations(Array.isArray(locsRes.data) ? locsRes.data : []);
      setRacks(Array.isArray(racksRes.data) ? racksRes.data : []);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (payload) => {
    try {
      if (editingRack) {
        await axios.put(`${API_URL}/racks/${editingRack.id}`, payload, {
          headers,
        });
        toast.success("Rack updated!");
      } else {
        await axios.post(`${API_URL}/racks`, payload, { headers });
        toast.success("Rack created!");
      }
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to save rack");
      throw err;
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this rack? All product assignments will be removed.",
      )
    )
      return;
    try {
      await axios.delete(`${API_URL}/racks/${id}`, { headers });
      toast.success("Rack deleted");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to delete");
    }
  };

  const openAdd = () => {
    setEditingRack(null);
    setShowModal(true);
  };
  const openEdit = (rack) => {
    setEditingRack(rack);
    setShowModal(true);
  };

  const mallRacks = racks.filter(
    (r) => locations.find((l) => l.id === r.location_id)?.type === "mall",
  );
  const warehouseRacks = racks.filter(
    (r) => locations.find((l) => l.id === r.location_id)?.type === "warehouse",
  );
  const totalProducts = racks.reduce(
    (sum, r) => sum + (r.assigned_count || 0),
    0,
  );

  if (loading)
    return (
      <div className="flex items-center justify-center h-full bg-[#f7f6f3]">
        <div className="text-center">
          <div className="relative w-14 h-14 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-amber-100" />
            <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
          </div>
          <p className="text-stone-400 text-sm">Loading locations…</p>
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
              "radial-gradient(circle at 80% 50%, #3b82f6 0%, transparent 45%), radial-gradient(circle at 15% 70%, #f59e0b 0%, transparent 40%)",
          }}
        />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/15 rounded-2xl border border-blue-500/20">
              <MapPin size={24} className="text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                Locations & Racks
              </h1>
              <p className="text-stone-400 text-sm mt-0.5">
                Manage physical display and storage areas
              </p>
            </div>
          </div>
          {canEdit && (
            <button
              onClick={openAdd}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-900 font-black text-sm px-5 py-3 rounded-xl transition-all shadow-lg shadow-amber-900/30 active:scale-95"
            >
              <Plus size={16} />
              {t("locations.addRack")}
            </button>
          )}
        </div>

        {/* Stats strip */}
        <div className="relative mt-5 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Total Racks",
              value: racks.length,
              color: "text-stone-300",
            },
            {
              label: "Mall Showroom",
              value: mallRacks.length,
              color: "text-blue-400",
            },
            {
              label: "Warehouse",
              value: warehouseRacks.length,
              color: "text-amber-400",
            },
            {
              label: "Products Placed",
              value: totalProducts,
              color: "text-emerald-400",
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

      {/* ── Location Sections ── */}
      <div className="space-y-5">
        <LocationSection
          title="Mall Showroom"
          icon={Store}
          racks={mallRacks}
          type="mall"
          locations={locations}
          isAdmin={canEdit}
          onEdit={openEdit}
          onDelete={handleDelete}
          onView={(id) => navigate(`/rack/${id}`)}
        />
        <LocationSection
          title="Warehouse Storage"
          icon={Warehouse}
          racks={warehouseRacks}
          type="warehouse"
          locations={locations}
          isAdmin={canEdit}
          onEdit={openEdit}
          onDelete={handleDelete}
          onView={(id) => navigate(`/rack/${id}`)}
        />
      </div>

      <AnimatePresence>
        {showModal && (
          <RackModal
            editingRack={editingRack}
            locations={locations}
            onClose={() => setShowModal(false)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationsRacks;
