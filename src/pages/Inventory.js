// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "@/context/AuthContext";
// import { useTranslation } from "react-i18next";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Plus,
//   Pencil,
//   Trash2,
//   Search,
//   Package,
//   MapPin,
//   X,
//   RefreshCw,
//   Tag,
//   Layers,
//   TrendingDown,
//   AlertTriangle,
//   ChevronDown,
//   Check,
//   IndianRupee,
// } from "lucide-react";
// import { toast } from "sonner";

// const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

// const mockImages = [
//   "https://images.unsplash.com/photo-1758789898279-82f8cc279444?w=200&q=80",
//   "https://images.unsplash.com/photo-1765277114329-b3da8e70731e?w=200&q=80",
//   "https://images.unsplash.com/photo-1765371512379-b6e10ffddc3f?w=200&q=80",
// ];

// // ── Dark Field ────────────────────────────────────────────────
// const Field = ({ label, children, required }) => (
//   <div className="space-y-1.5">
//     <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block">
//       {label}
//       {required && <span className="text-rose-400 ml-0.5">*</span>}
//     </label>
//     {children}
//   </div>
// );

// const DarkInput = ({ ...props }) => (
//   <input
//     {...props}
//     className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 placeholder-stone-600 transition-all"
//   />
// );

// // ── Add/Edit Product Modal ────────────────────────────────────
// const ProductModal = ({ editingProduct, onClose, onSave }) => {
//   const { t } = useTranslation();
//   const [saving, setSaving] = useState(false);
//   const [formData, setFormData] = useState({
//     name: editingProduct?.name || "",
//     sku: editingProduct?.sku || "",
//     category: editingProduct?.category || "",
//     purchase_price: editingProduct?.purchase_price?.toString() || "",
//     selling_price: editingProduct?.selling_price?.toString() || "",
//     stock_quantity: editingProduct?.stock_quantity?.toString() || "",
//     supplier: editingProduct?.supplier || "",
//     image_url: editingProduct?.image_url || "",
//     low_stock_threshold:
//       editingProduct?.low_stock_threshold?.toString() || "10",
//   });
//   const set = (k, v) => setFormData((f) => ({ ...f, [k]: v }));

//   const handleSubmit = async () => {
//     if (!formData.name || !formData.sku || !formData.category) {
//       toast.error("Name, SKU and Category required");
//       return;
//     }
//     setSaving(true);
//     try {
//       await onSave({
//         ...formData,
//         purchase_price: parseFloat(formData.purchase_price),
//         selling_price: parseFloat(formData.selling_price),
//         stock_quantity: parseInt(formData.stock_quantity),
//         low_stock_threshold: parseInt(formData.low_stock_threshold),
//       });
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
//         initial={{ scale: 0.93, y: 16 }}
//         animate={{ scale: 1, y: 0 }}
//         exit={{ scale: 0.93, y: 16 }}
//         transition={{ type: "spring", stiffness: 340, damping: 30 }}
//         className="bg-[#1c1c2e] border border-white/10 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 flex-shrink-0">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-amber-500/15 rounded-xl">
//               <Package size={17} className="text-amber-400" />
//             </div>
//             <h2 className="text-base font-bold text-white">
//               {editingProduct
//                 ? t("inventory.editProduct")
//                 : t("inventory.addProduct")}
//             </h2>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 rounded-xl hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
//           >
//             <X size={16} />
//           </button>
//         </div>

//         <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <Field label={t("inventory.productName")} required>
//               <DarkInput
//                 value={formData.name}
//                 onChange={(e) => set("name", e.target.value)}
//                 placeholder="Product name"
//               />
//             </Field>
//             <Field label={t("inventory.sku")} required>
//               <DarkInput
//                 value={formData.sku}
//                 onChange={(e) => set("sku", e.target.value)}
//                 placeholder="SKU-001"
//               />
//             </Field>
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <Field label={t("inventory.category")} required>
//               <DarkInput
//                 value={formData.category}
//                 onChange={(e) => set("category", e.target.value)}
//                 placeholder="e.g. Vases"
//               />
//             </Field>
//             <Field label={t("inventory.supplier")}>
//               <DarkInput
//                 value={formData.supplier}
//                 onChange={(e) => set("supplier", e.target.value)}
//                 placeholder="Supplier name"
//               />
//             </Field>
//           </div>
//           <div className="grid grid-cols-3 gap-4">
//             <Field label={t("inventory.purchasePrice")} required>
//               <div className="relative">
//                 <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400 text-sm font-bold">
//                   ₹
//                 </span>
//                 <DarkInput
//                   type="number"
//                   step="0.01"
//                   value={formData.purchase_price}
//                   onChange={(e) => set("purchase_price", e.target.value)}
//                   placeholder="0.00"
//                   className="pl-8"
//                   style={{ paddingLeft: "2rem" }}
//                 />
//               </div>
//             </Field>
//             <Field label={t("inventory.sellingPrice")} required>
//               <div className="relative">
//                 <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400 text-sm font-bold">
//                   ₹
//                 </span>
//                 <DarkInput
//                   type="number"
//                   step="0.01"
//                   value={formData.selling_price}
//                   onChange={(e) => set("selling_price", e.target.value)}
//                   placeholder="0.00"
//                   style={{ paddingLeft: "2rem" }}
//                 />
//               </div>
//             </Field>
//             <Field label={t("inventory.stockQuantity")} required>
//               <DarkInput
//                 type="number"
//                 value={formData.stock_quantity}
//                 onChange={(e) => set("stock_quantity", e.target.value)}
//                 placeholder="0"
//               />
//             </Field>
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <Field label={t("inventory.lowStockThreshold")}>
//               <DarkInput
//                 type="number"
//                 value={formData.low_stock_threshold}
//                 onChange={(e) => set("low_stock_threshold", e.target.value)}
//                 placeholder="10"
//               />
//             </Field>
//             <Field label={t("inventory.imageUrl")}>
//               <DarkInput
//                 type="url"
//                 value={formData.image_url}
//                 onChange={(e) => set("image_url", e.target.value)}
//                 placeholder="https://..."
//               />
//             </Field>
//           </div>
//           {formData.image_url && (
//             <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/10">
//               <img
//                 src={formData.image_url}
//                 alt="Preview"
//                 className="w-12 h-12 object-cover rounded-lg"
//                 onError={(e) => {
//                   e.target.style.display = "none";
//                 }}
//               />
//               <p className="text-xs text-stone-400">Image preview</p>
//             </div>
//           )}
//         </div>

//         <div className="px-6 py-4 border-t border-white/10 flex gap-3 flex-shrink-0">
//           <button
//             onClick={onClose}
//             className="flex-1 h-11 rounded-xl border border-white/10 text-stone-400 hover:text-white hover:border-white/20 text-sm font-semibold transition-all"
//           >
//             {t("common.cancel")}
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={saving}
//             className="flex-1 h-11 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-900 font-black text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
//           >
//             {saving ? (
//               <>
//                 <RefreshCw size={13} className="animate-spin" />
//                 {t("common.loading")}
//               </>
//             ) : editingProduct ? (
//               t("inventory.update")
//             ) : (
//               t("inventory.add")
//             )}
//           </button>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// // ── Rack Assignment Modal ─────────────────────────────────────
// const RackModal = ({ product, racks, onClose, token }) => {
//   const { t } = useTranslation();
//   const [assignments, setAssignments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [form, setForm] = useState({ rack_id: "", quantity: "" });
//   const [saving, setSaving] = useState(false);
//   const headers = { Authorization: `Bearer ${token}` };

//   const fetchAssignments = async () => {
//     try {
//       const r = await axios.get(
//         `${API_URL}/products/${product.id}/rack-assignments`,
//         { headers },
//       );
//       setAssignments(r.data);
//     } catch {
//       toast.error("Failed to load rack assignments");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAssignments();
//   }, []);

//   const handleAssign = async () => {
//     if (!form.rack_id || !form.quantity) {
//       toast.error("Select a rack and enter quantity");
//       return;
//     }
//     setSaving(true);
//     try {
//       await axios.post(
//         `${API_URL}/rack-assignments`,
//         {
//           product_id: product.id,
//           rack_id: form.rack_id,
//           quantity: parseInt(form.quantity),
//         },
//         { headers },
//       );
//       toast.success("Rack assignment created");
//       setForm({ rack_id: "", quantity: "" });
//       setLoading(true);
//       fetchAssignments();
//     } catch (err) {
//       toast.error(err.response?.data?.detail || "Failed to assign rack");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Remove this assignment?")) return;
//     try {
//       await axios.delete(`${API_URL}/rack-assignments/${id}`, { headers });
//       toast.success("Assignment removed");
//       fetchAssignments();
//     } catch {
//       toast.error("Failed to remove");
//     }
//   };

//   const totalAssigned = assignments.reduce((s, a) => s + a.quantity, 0);

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
//         className="bg-[#1c1c2e] border border-white/10 rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden max-h-[85vh] flex flex-col"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 flex-shrink-0">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-blue-500/15 rounded-xl">
//               <MapPin size={16} className="text-blue-400" />
//             </div>
//             <div>
//               <h2 className="text-sm font-bold text-white">
//                 {t("inventory.rackAssignments")}
//               </h2>
//               <p className="text-[10px] text-stone-500">{product.name}</p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 rounded-xl hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
//           >
//             <X size={16} />
//           </button>
//         </div>

//         <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
//           {/* Total bar */}
//           <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
//             <span className="text-sm text-stone-400 font-semibold">
//               {t("inventory.totalAssigned")}
//             </span>
//             <span className="font-mono font-black text-amber-400 text-lg">
//               {totalAssigned} / {product.stock_quantity}{" "}
//               <span className="text-xs text-stone-500">
//                 {t("inventory.units")}
//               </span>
//             </span>
//           </div>

//           {/* Current assignments */}
//           <div>
//             <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-3">
//               {t("inventory.currentRackLocations")}
//             </p>
//             {loading ? (
//               <div className="flex justify-center py-6">
//                 <RefreshCw size={18} className="animate-spin text-stone-500" />
//               </div>
//             ) : assignments.length === 0 ? (
//               <p className="text-center text-stone-500 text-xs py-6">
//                 {t("inventory.noAssignments")}
//               </p>
//             ) : (
//               <div className="space-y-2">
//                 {assignments.map((a) => (
//                   <div
//                     key={a.id}
//                     className="flex items-center justify-between bg-white/5 border border-white/8 rounded-xl px-4 py-3 group"
//                   >
//                     <div>
//                       <p className="text-sm font-bold text-white">
//                         {a.rack_code} — {a.location_name}
//                       </p>
//                       <p className="text-[10px] text-stone-500">
//                         {t("inventory.assignedBy")} {a.assigned_by_name}
//                       </p>
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <span className="font-mono font-black text-amber-400">
//                         {a.quantity}{" "}
//                         <span className="text-xs text-stone-500">
//                           {t("inventory.units")}
//                         </span>
//                       </span>
//                       <button
//                         onClick={() => handleDelete(a.id)}
//                         className="p-1.5 rounded-lg text-stone-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
//                       >
//                         <Trash2 size={13} />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Assign to new rack */}
//           <div className="border-t border-white/10 pt-4">
//             <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-3">
//               {t("inventory.assignToNewRack")}
//             </p>
//             <div className="grid grid-cols-2 gap-3 mb-3">
//               <div>
//                 <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 block">
//                   {t("inventory.selectRack")}
//                 </label>
//                 <select
//                   value={form.rack_id}
//                   onChange={(e) =>
//                     setForm((f) => ({ ...f, rack_id: e.target.value }))
//                   }
//                   className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-3 text-stone-300 text-sm outline-none focus:ring-2 focus:ring-amber-500/40"
//                 >
//                   <option value="" className="bg-[#1c1c2e]">
//                     {t("inventory.chooseRack")}
//                   </option>
//                   {racks.map((r) => (
//                     <option key={r.id} value={r.id} className="bg-[#1c1c2e]">
//                       {r.code} — {r.name} ({r.location_name})
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 block">
//                   {t("inventory.quantity")}
//                 </label>
//                 <input
//                   type="number"
//                   min="1"
//                   value={form.quantity}
//                   onChange={(e) =>
//                     setForm((f) => ({ ...f, quantity: e.target.value }))
//                   }
//                   placeholder={t("inventory.enterQuantity")}
//                   className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm outline-none focus:ring-2 focus:ring-amber-500/40 placeholder-stone-600"
//                 />
//               </div>
//             </div>
//             <button
//               onClick={handleAssign}
//               disabled={saving}
//               className="w-full h-11 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
//             >
//               {saving ? (
//                 <RefreshCw size={13} className="animate-spin" />
//               ) : (
//                 <MapPin size={13} />
//               )}
//               {t("inventory.assignToRack")}
//             </button>
//           </div>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// // ── Main Page ─────────────────────────────────────────────────
// const Inventory = () => {
//   const { token, user } = useAuth();
//   const { t } = useTranslation();
//   const isAdmin = user?.role === "admin";

//   const [products, setProducts] = useState([]);
//   const [racks, setRacks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [showProductModal, setShowProductModal] = useState(false);
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [rackProduct, setRackProduct] = useState(null);
//   const headers = { Authorization: `Bearer ${token}` };

//   useEffect(() => {
//     fetchAll();
//   }, []);

//   const fetchAll = async () => {
//     setLoading(true);
//     try {
//       const [prodRes, rackRes] = await Promise.all([
//         axios.get(`${API_URL}/products`, { headers }),
//         axios.get(`${API_URL}/racks`, { headers }),
//       ]);
//       setProducts(prodRes.data);
//       setRacks(rackRes.data);
//     } catch {
//       toast.error("Failed to fetch inventory");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filtered = products.filter(
//     (p) =>
//       p.name.toLowerCase().includes(search.toLowerCase()) ||
//       p.sku.toLowerCase().includes(search.toLowerCase()) ||
//       p.category.toLowerCase().includes(search.toLowerCase()),
//   );

//   const lowStock = products.filter(
//     (p) => p.stock_quantity <= p.low_stock_threshold,
//   ).length;
//   const categories = [...new Set(products.map((p) => p.category))].length;
//   const totalValue = products.reduce(
//     (s, p) => s + p.selling_price * p.stock_quantity,
//     0,
//   );

//   const handleSave = async (data) => {
//     try {
//       if (editingProduct) {
//         await axios.put(`${API_URL}/products/${editingProduct.id}`, data, {
//           headers,
//         });
//         toast.success("Product updated");
//       } else {
//         await axios.post(`${API_URL}/products`, data, { headers });
//         toast.success("Product added");
//       }
//       fetchAll();
//     } catch (err) {
//       toast.error(err.response?.data?.detail || "Failed to save");
//       throw err;
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this product?")) return;
//     try {
//       await axios.delete(`${API_URL}/products/${id}`, { headers });
//       toast.success("Product deleted");
//       fetchAll();
//     } catch (err) {
//       toast.error(err.response?.data?.detail || "Failed to delete");
//     }
//   };

//   return (
//     <div
//       className="min-h-full bg-[#f7f6f3] p-4 md:p-6 lg:p-8"
//       data-testid="inventory-page"
//     >
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
//               "radial-gradient(circle at 80% 40%, #f59e0b 0%, transparent 50%), radial-gradient(circle at 15% 80%, #6366f1 0%, transparent 40%)",
//           }}
//         />
//         <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//           <div className="flex items-center gap-4">
//             <div className="p-3 bg-amber-500/15 rounded-2xl border border-amber-500/20">
//               <Package size={24} className="text-amber-400" />
//             </div>
//             <div>
//               <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
//                 {t("inventory.title")}
//               </h1>
//               <p className="text-stone-400 text-sm mt-0.5">
//                 {t("inventory.subtitle")}
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={() => {
//               setEditingProduct(null);
//               setShowProductModal(true);
//             }}
//             className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-900 font-black text-sm px-5 py-3 rounded-xl transition-all shadow-lg shadow-amber-900/30 active:scale-95 whitespace-nowrap"
//             data-testid="add-product-button"
//           >
//             <Plus size={16} />
//             {t("inventory.addProduct")}
//           </button>
//         </div>

//         {/* Stats strip */}
//         <div className="relative mt-5 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
//           {[
//             {
//               label: "Total Products",
//               value: products.length,
//               color: "text-stone-300",
//             },
//             { label: "Categories", value: categories, color: "text-blue-400" },
//             {
//               label: "Low Stock",
//               value: lowStock,
//               color: lowStock > 0 ? "text-amber-400" : "text-stone-500",
//             },
//             {
//               label: "Inventory Value",
//               value: `₹${totalValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
//               color: "text-emerald-400",
//             },
//           ].map((s, i) => (
//             <div key={i}>
//               <p className="text-stone-500 text-[10px] uppercase tracking-wider font-semibold mb-0.5">
//                 {s.label}
//               </p>
//               <p className={`font-mono font-black text-lg ${s.color}`}>
//                 {s.value}
//               </p>
//             </div>
//           ))}
//         </div>
//       </motion.div>

//       {/* Search */}
//       <motion.div
//         initial={{ opacity: 0, y: 8 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.1 }}
//         className="relative mb-5"
//       >
//         <Search
//           size={15}
//           className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
//         />
//         <input
//           type="text"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           placeholder={t("inventory.searchPlaceholder")}
//           className="w-full h-11 bg-white border border-stone-200 rounded-xl pl-10 pr-4 text-sm text-stone-700 outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400/50 shadow-sm"
//           data-testid="search-input"
//         />
//         {search && (
//           <button
//             onClick={() => setSearch("")}
//             className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
//           >
//             <X size={13} />
//           </button>
//         )}
//       </motion.div>

//       {loading ? (
//         <div className="flex items-center justify-center py-24">
//           <div className="text-center">
//             <div className="relative w-14 h-14 mx-auto mb-4">
//               <div className="absolute inset-0 rounded-full border-4 border-amber-100" />
//               <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
//             </div>
//             <p className="text-stone-400 text-sm">{t("inventory.loading")}</p>
//           </div>
//         </div>
//       ) : filtered.length === 0 ? (
//         <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-stone-100 shadow-sm">
//           <div className="p-4 bg-stone-100 rounded-2xl mb-4">
//             <Package size={32} className="text-stone-300" />
//           </div>
//           <p className="text-stone-500 font-semibold">
//             {t("inventory.noProducts")}
//           </p>
//           <p className="text-stone-400 text-sm mt-1">
//             {products.length > 0
//               ? "Try adjusting your search"
//               : "Add your first product to get started"}
//           </p>
//         </div>
//       ) : (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.15 }}
//         >
//           {/* Desktop Table */}
//           <div className="hidden lg:block bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm">
//             <table className="w-full" data-testid="products-table">
//               <thead>
//                 <tr className="bg-[#1c1c2e]">
//                   {[
//                     "Product Name",
//                     "SKU / Barcode",
//                     "Category",
//                     "Price",
//                     "Stock",
//                     "Actions",
//                   ].map((h, i) => (
//                     <th
//                       key={h}
//                       className={`px-5 py-3.5 text-xs font-bold text-stone-400 uppercase tracking-wider ${i === 5 ? "text-right" : "text-left"}`}
//                     >
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.map((product, i) => {
//                   const isLow =
//                     product.stock_quantity <= product.low_stock_threshold;
//                   const profit = product.selling_price - product.purchase_price;
//                   return (
//                     <motion.tr
//                       key={product.id}
//                       initial={{ opacity: 0, y: 6 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: i * 0.03 }}
//                       className={`border-t border-stone-100 hover:bg-amber-50/30 transition-colors ${i % 2 === 0 ? "" : "bg-stone-50/40"}`}
//                       data-testid={`product-row-${product.id}`}
//                     >
//                       <td className="px-5 py-3.5">
//                         <div className="flex items-center gap-3">
//                           <img
//                             src={
//                               product.image_url ||
//                               mockImages[i % mockImages.length]
//                             }
//                             alt={product.name}
//                             className="w-11 h-11 object-cover rounded-xl border border-stone-100 flex-shrink-0"
//                             onError={(e) => {
//                               e.target.src = mockImages[i % mockImages.length];
//                             }}
//                           />
//                           <div>
//                             <p className="font-bold text-stone-800 text-sm leading-tight">
//                               {product.name}
//                             </p>
//                             {product.supplier && (
//                               <p className="text-[10px] text-stone-400 mt-0.5">
//                                 {product.supplier}
//                               </p>
//                             )}
//                           </div>
//                         </div>
//                       </td>

//                       <td className="px-5 py-3.5">
//                         <p className="text-xs font-mono font-bold text-stone-700">
//                           {product.sku}
//                         </p>
//                         {product.barcode && (
//                           <p className="text-[10px] font-mono text-stone-400">
//                             {product.barcode}
//                           </p>
//                         )}
//                       </td>

//                       <td className="px-5 py-3.5">
//                         <span className="text-[11px] font-bold bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full">
//                           {product.category}
//                         </span>
//                       </td>

//                       <td className="px-5 py-3.5">
//                         <p className="font-mono font-black text-stone-800">
//                           ₹{product.selling_price.toFixed(2)}
//                         </p>
//                         <p className="text-[10px] text-stone-400">
//                           {t("inventory.cost")}: ₹{product.purchase_price} ·{" "}
//                           <span className="text-emerald-600">
//                             +₹{profit.toFixed(0)}
//                           </span>
//                         </p>
//                       </td>

//                       <td className="px-5 py-3.5">
//                         <span
//                           className={`inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full ${
//                             product.stock_quantity === 0
//                               ? "bg-rose-50 text-rose-600 border border-rose-200"
//                               : isLow
//                                 ? "bg-amber-50 text-amber-700 border border-amber-200"
//                                 : "bg-emerald-50 text-emerald-700 border border-emerald-200"
//                           }`}
//                         >
//                           {isLow && product.stock_quantity > 0 && (
//                             <AlertTriangle size={10} />
//                           )}
//                           {product.stock_quantity} {t("inventory.units")}
//                         </span>
//                       </td>

//                       <td className="px-5 py-3.5">
//                         <div className="flex items-center justify-end gap-1">
//                           <button
//                             onClick={() => {
//                               setEditingProduct(product);
//                               setShowProductModal(true);
//                             }}
//                             className="p-2 rounded-xl hover:bg-amber-50 text-stone-400 hover:text-amber-600 transition-colors"
//                             data-testid={`edit-button-${product.id}`}
//                           >
//                             <Pencil size={14} />
//                           </button>
//                           <button
//                             onClick={() => setRackProduct(product)}
//                             className="p-2 rounded-xl hover:bg-blue-50 text-stone-400 hover:text-blue-600 transition-colors"
//                             data-testid={`racks-button-${product.id}`}
//                           >
//                             <MapPin size={14} />
//                           </button>
//                           {isAdmin && (
//                             <button
//                               onClick={() => handleDelete(product.id)}
//                               className="p-2 rounded-xl hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors"
//                               data-testid={`delete-button-${product.id}`}
//                             >
//                               <Trash2 size={14} />
//                             </button>
//                           )}
//                         </div>
//                       </td>
//                     </motion.tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {/* Mobile Cards */}
//           <div className="lg:hidden space-y-3">
//             {filtered.map((product, i) => {
//               const isLow =
//                 product.stock_quantity <= product.low_stock_threshold;
//               return (
//                 <motion.div
//                   key={product.id}
//                   initial={{ opacity: 0, x: -12 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: i * 0.04 }}
//                   className="bg-white border border-stone-100 rounded-2xl p-4 shadow-sm"
//                   data-testid={`product-card-${product.id}`}
//                 >
//                   <div className="flex gap-3">
//                     <img
//                       src={
//                         product.image_url || mockImages[i % mockImages.length]
//                       }
//                       alt={product.name}
//                       className="w-16 h-16 object-cover rounded-xl flex-shrink-0 border border-stone-100"
//                     />
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-start justify-between gap-2 mb-1">
//                         <p className="font-bold text-stone-800 text-sm leading-tight truncate">
//                           {product.name}
//                         </p>
//                         <span
//                           className={`text-[10px] font-black px-2 py-1 rounded-full flex-shrink-0 ${isLow ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}
//                         >
//                           {product.stock_quantity}
//                         </span>
//                       </div>
//                       <p className="text-[10px] text-stone-400 mb-2">
//                         {product.category} · {product.sku}
//                       </p>
//                       <div className="flex items-center justify-between">
//                         <span className="font-mono font-black text-stone-800">
//                           ₹{product.selling_price}
//                         </span>
//                         <div className="flex gap-1">
//                           <button
//                             onClick={() => {
//                               setEditingProduct(product);
//                               setShowProductModal(true);
//                             }}
//                             className="p-1.5 rounded-lg bg-stone-50 text-stone-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
//                           >
//                             <Pencil size={13} />
//                           </button>
//                           <button
//                             onClick={() => setRackProduct(product)}
//                             className="p-1.5 rounded-lg bg-stone-50 text-stone-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
//                           >
//                             <MapPin size={13} />
//                           </button>
//                           {isAdmin && (
//                             <button
//                               onClick={() => handleDelete(product.id)}
//                               className="p-1.5 rounded-lg bg-stone-50 text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
//                             >
//                               <Trash2 size={13} />
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>
//               );
//             })}
//           </div>

//           <p className="text-center text-xs text-stone-400 mt-4">
//             {filtered.length} of {products.length} products
//           </p>
//         </motion.div>
//       )}

//       <AnimatePresence>
//         {showProductModal && (
//           <ProductModal
//             editingProduct={editingProduct}
//             onClose={() => {
//               setShowProductModal(false);
//               setEditingProduct(null);
//             }}
//             onSave={handleSave}
//           />
//         )}
//       </AnimatePresence>
//       <AnimatePresence>
//         {rackProduct && (
//           <RackModal
//             product={rackProduct}
//             racks={racks}
//             token={token}
//             onClose={() => setRackProduct(null)}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default Inventory;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Package,
  MapPin,
  X,
  RefreshCw,
  Tag,
  Layers,
  TrendingDown,
  AlertTriangle,
  ChevronDown,
  Check,
  IndianRupee,
} from "lucide-react";
import { toast } from "sonner";

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const mockImages = [
  "https://images.unsplash.com/photo-1758789898279-82f8cc279444?w=200&q=80",
  "https://images.unsplash.com/photo-1765277114329-b3da8e70731e?w=200&q=80",
  "https://images.unsplash.com/photo-1765371512379-b6e10ffddc3f?w=200&q=80",
];

// ── Dark Field ────────────────────────────────────────────────
const Field = ({ label, children, required }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block">
      {label}
      {required && <span className="text-rose-400 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const DarkInput = ({ ...props }) => (
  <input
    {...props}
    className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 placeholder-stone-600 transition-all"
  />
);

// ── Add/Edit Product Modal ────────────────────────────────────
const ProductModal = ({ editingProduct, onClose, onSave }) => {
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: editingProduct?.name || "",
    sku: editingProduct?.sku || "",
    category: editingProduct?.category || "",
    purchase_price: editingProduct?.purchase_price?.toString() || "",
    selling_price: editingProduct?.selling_price?.toString() || "",
    stock_quantity: editingProduct?.stock_quantity?.toString() || "",
    supplier: editingProduct?.supplier || "",
    image_url: editingProduct?.image_url || "",
    low_stock_threshold:
      editingProduct?.low_stock_threshold?.toString() || "10",
  });
  const set = (k, v) => setFormData((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!formData.name || !formData.sku || !formData.category) {
      toast.error("Name, SKU and Category required");
      return;
    }
    setSaving(true);
    try {
      await onSave({
        ...formData,
        purchase_price: parseFloat(formData.purchase_price),
        selling_price: parseFloat(formData.selling_price),
        stock_quantity: parseInt(formData.stock_quantity),
        low_stock_threshold: parseInt(formData.low_stock_threshold),
      });
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
        initial={{ scale: 0.93, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.93, y: 16 }}
        transition={{ type: "spring", stiffness: 340, damping: 30 }}
        className="bg-[#1c1c2e] border border-white/10 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/15 rounded-xl">
              <Package size={17} className="text-amber-400" />
            </div>
            <h2 className="text-base font-bold text-white">
              {editingProduct
                ? t("inventory.editProduct")
                : t("inventory.addProduct")}
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
          <div className="grid grid-cols-2 gap-4">
            <Field label={t("inventory.productName")} required>
              <DarkInput
                value={formData.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Product name"
              />
            </Field>
            <Field label={t("inventory.sku")} required>
              <DarkInput
                value={formData.sku}
                onChange={(e) => set("sku", e.target.value)}
                placeholder="SKU-001"
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t("inventory.category")} required>
              <DarkInput
                value={formData.category}
                onChange={(e) => set("category", e.target.value)}
                placeholder="e.g. Vases"
              />
            </Field>
            <Field label={t("inventory.supplier")}>
              <DarkInput
                value={formData.supplier}
                onChange={(e) => set("supplier", e.target.value)}
                placeholder="Supplier name"
              />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Field label={t("inventory.purchasePrice")} required>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400 text-sm font-bold">
                  ₹
                </span>
                <DarkInput
                  type="number"
                  step="0.01"
                  value={formData.purchase_price}
                  onChange={(e) => set("purchase_price", e.target.value)}
                  placeholder="0.00"
                  className="pl-8"
                  style={{ paddingLeft: "2rem" }}
                />
              </div>
            </Field>
            <Field label={t("inventory.sellingPrice")} required>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400 text-sm font-bold">
                  ₹
                </span>
                <DarkInput
                  type="number"
                  step="0.01"
                  value={formData.selling_price}
                  onChange={(e) => set("selling_price", e.target.value)}
                  placeholder="0.00"
                  style={{ paddingLeft: "2rem" }}
                />
              </div>
            </Field>
            <Field label={t("inventory.stockQuantity")} required>
              <DarkInput
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => set("stock_quantity", e.target.value)}
                placeholder="0"
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t("inventory.lowStockThreshold")}>
              <DarkInput
                type="number"
                value={formData.low_stock_threshold}
                onChange={(e) => set("low_stock_threshold", e.target.value)}
                placeholder="10"
              />
            </Field>
            <Field label={t("inventory.imageUrl")}>
              <DarkInput
                type="url"
                value={formData.image_url}
                onChange={(e) => set("image_url", e.target.value)}
                placeholder="https://..."
              />
            </Field>
          </div>
          {formData.image_url && (
            <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/10">
              <img
                src={formData.image_url}
                alt="Preview"
                className="w-12 h-12 object-cover rounded-lg"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <p className="text-xs text-stone-400">Image preview</p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-white/10 flex gap-3 flex-shrink-0">
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
            ) : editingProduct ? (
              t("inventory.update")
            ) : (
              t("inventory.add")
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Rack Assignment Modal ─────────────────────────────────────
const RackModal = ({ product, racks, onClose, token }) => {
  const { t } = useTranslation();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ rack_id: "", quantity: "" });
  const [saving, setSaving] = useState(false);
  const headers = { Authorization: `Bearer ${token}` };

  const fetchAssignments = async () => {
    try {
      const r = await axios.get(
        `${API_URL}/products/${product.id}/rack-assignments`,
        { headers },
      );
      setAssignments(r.data);
    } catch {
      toast.error("Failed to load rack assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleAssign = async () => {
    if (!form.rack_id || !form.quantity) {
      toast.error("Select a rack and enter quantity");
      return;
    }
    setSaving(true);
    try {
      await axios.post(
        `${API_URL}/rack-assignments`,
        {
          product_id: product.id,
          rack_id: form.rack_id,
          quantity: parseInt(form.quantity),
        },
        { headers },
      );
      toast.success("Rack assignment created");
      setForm({ rack_id: "", quantity: "" });
      setLoading(true);
      fetchAssignments();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to assign rack");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this assignment?")) return;
    try {
      await axios.delete(`${API_URL}/rack-assignments/${id}`, { headers });
      toast.success("Assignment removed");
      fetchAssignments();
    } catch {
      toast.error("Failed to remove");
    }
  };

  const totalAssigned = assignments.reduce((s, a) => s + a.quantity, 0);

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
        className="bg-[#1c1c2e] border border-white/10 rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/15 rounded-xl">
              <MapPin size={16} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                {t("inventory.rackAssignments")}
              </h2>
              <p className="text-[10px] text-stone-500">{product.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Total bar */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
            <span className="text-sm text-stone-400 font-semibold">
              {t("inventory.totalAssigned")}
            </span>
            <span className="font-mono font-black text-amber-400 text-lg">
              {totalAssigned} / {product.stock_quantity}{" "}
              <span className="text-xs text-stone-500">
                {t("inventory.units")}
              </span>
            </span>
          </div>

          {/* Current assignments */}
          <div>
            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-3">
              {t("inventory.currentRackLocations")}
            </p>
            {loading ? (
              <div className="flex justify-center py-6">
                <RefreshCw size={18} className="animate-spin text-stone-500" />
              </div>
            ) : assignments.length === 0 ? (
              <p className="text-center text-stone-500 text-xs py-6">
                {t("inventory.noAssignments")}
              </p>
            ) : (
              <div className="space-y-2">
                {assignments.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between bg-white/5 border border-white/8 rounded-xl px-4 py-3 group"
                  >
                    <div>
                      <p className="text-sm font-bold text-white">
                        {a.rack_code} — {a.location_name}
                      </p>
                      <p className="text-[10px] text-stone-500">
                        {t("inventory.assignedBy")} {a.assigned_by_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-amber-400">
                        {a.quantity}{" "}
                        <span className="text-xs text-stone-500">
                          {t("inventory.units")}
                        </span>
                      </span>
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="p-1.5 rounded-lg text-stone-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assign to new rack */}
          <div className="border-t border-white/10 pt-4">
            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-3">
              {t("inventory.assignToNewRack")}
            </p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 block">
                  {t("inventory.selectRack")}
                </label>
                <select
                  value={form.rack_id}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, rack_id: e.target.value }))
                  }
                  className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-3 text-stone-300 text-sm outline-none focus:ring-2 focus:ring-amber-500/40"
                >
                  <option value="" className="bg-[#1c1c2e]">
                    {t("inventory.chooseRack")}
                  </option>
                  {racks.map((r) => (
                    <option key={r.id} value={r.id} className="bg-[#1c1c2e]">
                      {r.code} — {r.name} ({r.location_name})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 block">
                  {t("inventory.quantity")}
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, quantity: e.target.value }))
                  }
                  placeholder={t("inventory.enterQuantity")}
                  className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm outline-none focus:ring-2 focus:ring-amber-500/40 placeholder-stone-600"
                />
              </div>
            </div>
            <button
              onClick={handleAssign}
              disabled={saving}
              className="w-full h-11 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {saving ? (
                <RefreshCw size={13} className="animate-spin" />
              ) : (
                <MapPin size={13} />
              )}
              {t("inventory.assignToRack")}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Main Page ─────────────────────────────────────────────────
const Inventory = () => {
  const { token, user } = useAuth();
  const { t } = useTranslation();
  const isAdmin = user?.role === "admin";
  const canEdit = ["admin", "manager"].includes(user?.role); // staff: read-only
  const isReadOnly = user?.role === "staff"; // no add/edit/rack-assign

  const [products, setProducts] = useState([]);
  const [racks, setRacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [rackProduct, setRackProduct] = useState(null);
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [prodRes, rackRes] = await Promise.all([
        axios.get(`${API_URL}/products`, { headers }),
        axios.get(`${API_URL}/racks`, { headers }),
      ]);
      setProducts(prodRes.data);
      setRacks(rackRes.data);
    } catch {
      toast.error("Failed to fetch inventory");
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

  const lowStock = products.filter(
    (p) => p.stock_quantity <= p.low_stock_threshold,
  ).length;
  const categories = [...new Set(products.map((p) => p.category))].length;
  const totalValue = products.reduce(
    (s, p) => s + p.selling_price * p.stock_quantity,
    0,
  );

  const handleSave = async (data) => {
    try {
      if (editingProduct) {
        await axios.put(`${API_URL}/products/${editingProduct.id}`, data, {
          headers,
        });
        toast.success("Product updated");
      } else {
        await axios.post(`${API_URL}/products`, data, { headers });
        toast.success("Product added");
      }
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to save");
      throw err;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`${API_URL}/products/${id}`, { headers });
      toast.success("Product deleted");
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to delete");
    }
  };

  return (
    <div
      className="min-h-full bg-[#f7f6f3] p-4 md:p-6 lg:p-8"
      data-testid="inventory-page"
    >
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
              "radial-gradient(circle at 80% 40%, #f59e0b 0%, transparent 50%), radial-gradient(circle at 15% 80%, #6366f1 0%, transparent 40%)",
          }}
        />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/15 rounded-2xl border border-amber-500/20">
              <Package size={24} className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                {t("inventory.title")}
              </h1>
              <p className="text-stone-400 text-sm mt-0.5">
                {t("inventory.subtitle")}
              </p>
            </div>
          </div>
          {canEdit && (
            <button
              onClick={() => {
                setEditingProduct(null);
                setShowProductModal(true);
              }}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-900 font-black text-sm px-5 py-3 rounded-xl transition-all shadow-lg shadow-amber-900/30 active:scale-95 whitespace-nowrap"
              data-testid="add-product-button"
            >
              <Plus size={16} />
              {t("inventory.addProduct")}
            </button>
          )}
        </div>

        {/* Stats strip */}
        <div className="relative mt-5 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Total Products",
              value: products.length,
              color: "text-stone-300",
            },
            { label: "Categories", value: categories, color: "text-blue-400" },
            {
              label: "Low Stock",
              value: lowStock,
              color: lowStock > 0 ? "text-amber-400" : "text-stone-500",
            },
            {
              label: "Inventory Value",
              value: `₹${totalValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
              color: "text-emerald-400",
            },
          ].map((s, i) => (
            <div key={i}>
              <p className="text-stone-500 text-[10px] uppercase tracking-wider font-semibold mb-0.5">
                {s.label}
              </p>
              <p className={`font-mono font-black text-lg ${s.color}`}>
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative mb-5"
      >
        <Search
          size={15}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("inventory.searchPlaceholder")}
          className="w-full h-11 bg-white border border-stone-200 rounded-xl pl-10 pr-4 text-sm text-stone-700 outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400/50 shadow-sm"
          data-testid="search-input"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
          >
            <X size={13} />
          </button>
        )}
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="relative w-14 h-14 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-amber-100" />
              <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
            </div>
            <p className="text-stone-400 text-sm">{t("inventory.loading")}</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-stone-100 shadow-sm">
          <div className="p-4 bg-stone-100 rounded-2xl mb-4">
            <Package size={32} className="text-stone-300" />
          </div>
          <p className="text-stone-500 font-semibold">
            {t("inventory.noProducts")}
          </p>
          <p className="text-stone-400 text-sm mt-1">
            {products.length > 0
              ? "Try adjusting your search"
              : "Add your first product to get started"}
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          {/* Desktop Table */}
          <div className="hidden lg:block bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm">
            <table className="w-full" data-testid="products-table">
              <thead>
                <tr className="bg-[#1c1c2e]">
                  {[
                    "Product Name",
                    "SKU / Barcode",
                    "Category",
                    "Price",
                    "Stock",
                    "Actions",
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={`px-5 py-3.5 text-xs font-bold text-stone-400 uppercase tracking-wider ${i === 5 ? "text-right" : "text-left"}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((product, i) => {
                  const isLow =
                    product.stock_quantity <= product.low_stock_threshold;
                  const profit = product.selling_price - product.purchase_price;
                  return (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`border-t border-stone-100 hover:bg-amber-50/30 transition-colors ${i % 2 === 0 ? "" : "bg-stone-50/40"}`}
                      data-testid={`product-row-${product.id}`}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              product.image_url ||
                              mockImages[i % mockImages.length]
                            }
                            alt={product.name}
                            className="w-11 h-11 object-cover rounded-xl border border-stone-100 flex-shrink-0"
                            onError={(e) => {
                              e.target.src = mockImages[i % mockImages.length];
                            }}
                          />
                          <div>
                            <p className="font-bold text-stone-800 text-sm leading-tight">
                              {product.name}
                            </p>
                            {product.supplier && (
                              <p className="text-[10px] text-stone-400 mt-0.5">
                                {product.supplier}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <p className="text-xs font-mono font-bold text-stone-700">
                          {product.sku}
                        </p>
                        {product.barcode && (
                          <p className="text-[10px] font-mono text-stone-400">
                            {product.barcode}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-3.5">
                        <span className="text-[11px] font-bold bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full">
                          {product.category}
                        </span>
                      </td>

                      <td className="px-5 py-3.5">
                        <p className="font-mono font-black text-stone-800">
                          ₹{product.selling_price.toFixed(2)}
                        </p>
                        <p className="text-[10px] text-stone-400">
                          {t("inventory.cost")}: ₹{product.purchase_price} ·{" "}
                          <span className="text-emerald-600">
                            +₹{profit.toFixed(0)}
                          </span>
                        </p>
                      </td>

                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full ${
                            product.stock_quantity === 0
                              ? "bg-rose-50 text-rose-600 border border-rose-200"
                              : isLow
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {isLow && product.stock_quantity > 0 && (
                            <AlertTriangle size={10} />
                          )}
                          {product.stock_quantity} {t("inventory.units")}
                        </span>
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          {canEdit && (
                            <button
                              onClick={() => {
                                setEditingProduct(product);
                                setShowProductModal(true);
                              }}
                              className="p-2 rounded-xl hover:bg-amber-50 text-stone-400 hover:text-amber-600 transition-colors"
                              data-testid={`edit-button-${product.id}`}
                            >
                              <Pencil size={14} />
                            </button>
                          )}
                          {canEdit && (
                            <button
                              onClick={() => setRackProduct(product)}
                              className="p-2 rounded-xl hover:bg-blue-50 text-stone-400 hover:text-blue-600 transition-colors"
                              data-testid={`racks-button-${product.id}`}
                            >
                              <MapPin size={14} />
                            </button>
                          )}
                          {isAdmin && (
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-2 rounded-xl hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors"
                              data-testid={`delete-button-${product.id}`}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                          {isReadOnly && (
                            <span className="text-[10px] text-stone-300 italic px-2">
                              View only
                            </span>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-3">
            {filtered.map((product, i) => {
              const isLow =
                product.stock_quantity <= product.low_stock_threshold;
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white border border-stone-100 rounded-2xl p-4 shadow-sm"
                  data-testid={`product-card-${product.id}`}
                >
                  <div className="flex gap-3">
                    <img
                      src={
                        product.image_url || mockImages[i % mockImages.length]
                      }
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-xl flex-shrink-0 border border-stone-100"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-bold text-stone-800 text-sm leading-tight truncate">
                          {product.name}
                        </p>
                        <span
                          className={`text-[10px] font-black px-2 py-1 rounded-full flex-shrink-0 ${isLow ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}
                        >
                          {product.stock_quantity}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-400 mb-2">
                        {product.category} · {product.sku}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-black text-stone-800">
                          ₹{product.selling_price}
                        </span>
                        <div className="flex gap-1">
                          {canEdit && (
                            <button
                              onClick={() => {
                                setEditingProduct(product);
                                setShowProductModal(true);
                              }}
                              className="p-1.5 rounded-lg bg-stone-50 text-stone-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                            >
                              <Pencil size={13} />
                            </button>
                          )}
                          {canEdit && (
                            <button
                              onClick={() => setRackProduct(product)}
                              className="p-1.5 rounded-lg bg-stone-50 text-stone-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                              <MapPin size={13} />
                            </button>
                          )}
                          {isAdmin && (
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-1.5 rounded-lg bg-stone-50 text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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
            })}
          </div>

          <p className="text-center text-xs text-stone-400 mt-4">
            {filtered.length} of {products.length} products
          </p>
        </motion.div>
      )}

      <AnimatePresence>
        {showProductModal && (
          <ProductModal
            editingProduct={editingProduct}
            onClose={() => {
              setShowProductModal(false);
              setEditingProduct(null);
            }}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {rackProduct && (
          <RackModal
            product={rackProduct}
            racks={racks}
            token={token}
            onClose={() => setRackProduct(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Inventory;
