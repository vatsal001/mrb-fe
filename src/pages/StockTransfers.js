// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useAuth } from '@/context/AuthContext';
// import { useTranslation } from 'react-i18next';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Plus, ArrowRightLeft, Calendar, User } from 'lucide-react';
// import { toast } from 'sonner';
// import { motion } from 'framer-motion';

// const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

// const StockTransfers = () => {
//   const { token } = useAuth();
//   const { t } = useTranslation();
//   const [transfers, setTransfers] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [racks, setRacks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showDialog, setShowDialog] = useState(false);
//   const [filterProduct, setFilterProduct] = useState('all');
//   const [transferForm, setTransferForm] = useState({
//     product_id: '',
//     from_rack_id: '',
//     to_rack_id: '',
//     quantity: '',
//     notes: ''
//   });

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const [transfersRes, productsRes, racksRes] = await Promise.all([
//         axios.get(`${API_URL}/stock-transfers`, { headers: { Authorization: `Bearer ${token}` } }),
//         axios.get(`${API_URL}/products`, { headers: { Authorization: `Bearer ${token}` } }),
//         axios.get(`${API_URL}/racks`, { headers: { Authorization: `Bearer ${token}` } })
//       ]);
//       setTransfers(transfersRes.data);
//       setProducts(productsRes.data);
//       setRacks(racksRes.data);
//     } catch (error) {
//       toast.error('Failed to load data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = {
//         product_id: transferForm.product_id,
//         from_rack_id: transferForm.from_rack_id || null,
//         to_rack_id: transferForm.to_rack_id || null,
//         quantity: parseInt(transferForm.quantity),
//         transfer_type: 'manual',
//         notes: transferForm.notes
//       };

//       await axios.post(`${API_URL}/stock-transfers`, payload, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       toast.success('Stock transfer completed successfully');
//       setShowDialog(false);
//       resetForm();
//       fetchData();
//     } catch (error) {
//       toast.error(error.response?.data?.detail || 'Failed to create transfer');
//     }
//   };

//   const resetForm = () => {
//     setTransferForm({
//       product_id: '',
//       from_rack_id: '',
//       to_rack_id: '',
//       quantity: '',
//       notes: ''
//     });
//   };

//   const filteredTransfers = filterProduct && filterProduct !== 'all'
//     ? transfers.filter(t => t.product_id === filterProduct)
//     : transfers;

//   const getTransferTypeColor = (type) => {
//     switch (type) {
//       case 'sale':
//         return 'bg-red-100 text-red-700';
//       case 'restock':
//         return 'bg-green-100 text-green-700';
//       default:
//         return 'bg-blue-100 text-blue-700';
//     }
//   };

//   const getTransferTypeLabel = (type) => {
//     switch (type) {
//       case 'sale': return t('transfers.sale');
//       case 'restock': return t('transfers.restock');
//       case 'manual': return t('transfers.manual');
//       default: return type;
//     }
//   };

//   return (
//     <div className="p-4 md:p-6 lg:p-8" data-testid="stock-transfers-page">
//       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
//           <div>
//             <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-2">
//               {t('transfers.title')}
//             </h1>
//             <p className="text-stone-600 text-sm md:text-base">
//               {t('transfers.subtitle')}
//             </p>
//           </div>
//           <Button
//             onClick={() => {
//               resetForm();
//               setShowDialog(true);
//             }}
//             className="rounded-full bg-gradient-to-r from-primary to-stone-800 hover:shadow-lg transition-all gap-2"
//             data-testid="add-transfer-button"
//           >
//             <Plus size={20} />
//             {t('transfers.newTransfer')}
//           </Button>
//         </div>

//         {/* Filter */}
//         <div className="mb-6">
//           <Select value={filterProduct || "all"} onValueChange={(value) => setFilterProduct(value === "all" ? "" : value)}>
//             <SelectTrigger className="w-full md:w-64" data-testid="filter-product">
//               <SelectValue placeholder={t('transfers.filterByProduct')} />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">{t('transfers.allProducts')}</SelectItem>
//               {products.map((product) => (
//                 <SelectItem key={product.id} value={product.id}>
//                   {product.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         {loading ? (
//           <div className="text-center py-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
//             <p className="text-stone-500">{t('transfers.loading')}</p>
//           </div>
//         ) : filteredTransfers.length === 0 ? (
//           <div className="text-center py-12 bg-white border-2 border-stone-200 rounded-2xl">
//             <ArrowRightLeft className="mx-auto mb-4 text-stone-400" size={48} />
//             <p className="text-stone-600 font-medium">{t('transfers.noTransfers')}</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {filteredTransfers.map((transfer, index) => (
//               <motion.div
//                 key={transfer.id}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: index * 0.05 }}
//                 className="bg-white border-2 border-stone-200 rounded-2xl p-4 md:p-5 hover:shadow-lg transition-all"
//                 data-testid={`transfer-${transfer.id}`}
//               >
//                 <div className="flex flex-col md:flex-row md:items-center gap-4">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2 mb-2">
//                       <h3 className="text-lg font-bold text-primary">{transfer.product_name}</h3>
//                       <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTransferTypeColor(transfer.transfer_type)}`}>
//                         {getTransferTypeLabel(transfer.transfer_type)}
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-4 text-sm text-stone-600">
//                       <div className="flex items-center gap-2">
//                         <ArrowRightLeft size={16} />
//                         <span>
//                           {transfer.from_rack_code || t('transfers.external')} → {transfer.to_rack_code || t('transfers.external')}
//                         </span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <User size={16} />
//                         <span>{transfer.transferred_by_name}</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Calendar size={16} />
//                         <span>{new Date(transfer.created_at).toLocaleString()}</span>
//                       </div>
//                     </div>
//                     {transfer.notes && (
//                       <p className="text-sm text-stone-600 mt-2 italic">{transfer.notes}</p>
//                     )}
//                   </div>
//                   <div className="text-center md:text-right">
//                     <p className="text-2xl font-mono font-bold text-primary">{transfer.quantity}</p>
//                     <p className="text-xs text-stone-600">{t('transfers.units')}</p>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         )}
//       </motion.div>

//       <Dialog open={showDialog} onOpenChange={setShowDialog}>
//         <DialogContent className="max-w-md">
//           <DialogHeader>
//             <DialogTitle className="text-2xl font-bold">{t('transfers.newStockTransfer')}</DialogTitle>
//           </DialogHeader>
//           <form onSubmit={handleSubmit} className="space-y-4" data-testid="transfer-form">
//             <div>
//               <Label htmlFor="product">{t('transfers.product')} *</Label>
//               <Select
//                 value={transferForm.product_id}
//                 onValueChange={(value) => setTransferForm({ ...transferForm, product_id: value })}
//               >
//                 <SelectTrigger data-testid="product-select">
//                   <SelectValue placeholder={t('transfers.selectProduct')} />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {products.map((product) => (
//                     <SelectItem key={product.id} value={product.id}>
//                       {product.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label htmlFor="from_rack">{t('transfers.fromRack')} *</Label>
//               <Select
//                 value={transferForm.from_rack_id}
//                 onValueChange={(value) => setTransferForm({ ...transferForm, from_rack_id: value })}
//               >
//                 <SelectTrigger data-testid="from-rack-select">
//                   <SelectValue placeholder={t('transfers.selectSourceRack')} />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {racks.map((rack) => (
//                     <SelectItem key={rack.id} value={rack.id}>
//                       {rack.name} ({rack.code}) - {rack.location_name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label htmlFor="to_rack">{t('transfers.toRack')} *</Label>
//               <Select
//                 value={transferForm.to_rack_id}
//                 onValueChange={(value) => setTransferForm({ ...transferForm, to_rack_id: value })}
//               >
//                 <SelectTrigger data-testid="to-rack-select">
//                   <SelectValue placeholder={t('transfers.selectDestRack')} />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {racks.map((rack) => (
//                     <SelectItem key={rack.id} value={rack.id}>
//                       {rack.name} ({rack.code}) - {rack.location_name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label htmlFor="quantity">{t('transfers.quantity')} *</Label>
//               <Input
//                 id="quantity"
//                 type="number"
//                 value={transferForm.quantity}
//                 onChange={(e) => setTransferForm({ ...transferForm, quantity: e.target.value })}
//                 required
//                 min="1"
//                 data-testid="quantity-input"
//               />
//             </div>
//             <div>
//               <Label htmlFor="notes">{t('transfers.notes')}</Label>
//               <Input
//                 id="notes"
//                 value={transferForm.notes}
//                 onChange={(e) => setTransferForm({ ...transferForm, notes: e.target.value })}
//                 placeholder={t('transfers.optionalNotes')}
//                 data-testid="notes-input"
//               />
//             </div>
//             <div className="flex gap-3 pt-4">
//               <Button
//                 type="submit"
//                 className="flex-1 rounded-full bg-primary hover:bg-black"
//                 data-testid="submit-transfer-button"
//               >
//                 {t('transfers.completeTransfer')}
//               </Button>
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => setShowDialog(false)}
//                 className="rounded-full"
//               >
//                 {t('common.cancel')}
//               </Button>
//             </div>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default StockTransfers;

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRightLeft,
  Plus,
  X,
  RefreshCw,
  Calendar,
  User,
  Package,
  Search,
  Filter,
  ChevronRight,
  Warehouse,
  Store,
  Hash,
  AlignLeft,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const fmt = (iso) =>
  iso
    ? new Date(iso).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const TYPE_STYLES = {
  sale: {
    bg: "bg-rose-500/15",
    text: "text-rose-400",
    border: "border-rose-500/20",
    label: "Sale",
  },
  restock: {
    bg: "bg-emerald-500/15",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    label: "Restock",
  },
  manual: {
    bg: "bg-blue-500/15",
    text: "text-blue-400",
    border: "border-blue-500/20",
    label: "Manual",
  },
};
const typeStyle = (t) => TYPE_STYLES[t] || TYPE_STYLES.manual;

// ── New Transfer Modal ────────────────────────────────────────
const TransferModal = ({ products, racks, onClose, onSave }) => {
  const [form, setForm] = useState({
    product_id: "",
    from_rack_id: "",
    to_rack_id: "",
    quantity: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const selectedProduct = products.find((p) => p.id === form.product_id);
  const fromRack = racks.find((r) => r.id === form.from_rack_id);
  const toRack = racks.find((r) => r.id === form.to_rack_id);

  const handleSubmit = async () => {
    if (!form.product_id) {
      toast.error("Select a product");
      return;
    }
    if (!form.quantity || parseInt(form.quantity) < 1) {
      toast.error("Enter a valid quantity");
      return;
    }
    setSaving(true);
    try {
      await onSave({
        product_id: form.product_id,
        from_rack_id: form.from_rack_id || null,
        to_rack_id: form.to_rack_id || null,
        quantity: parseInt(form.quantity),
        transfer_type: "manual",
        notes: form.notes,
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
        className="bg-[#1c1c2e] border border-white/10 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/15 rounded-xl border border-blue-500/20">
              <ArrowRightLeft size={17} className="text-blue-400" />
            </div>
            <h2 className="text-base font-bold text-white">
              New Stock Transfer
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
          {/* Product */}
          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 block">
              Product *
            </label>
            <select
              value={form.product_id}
              onChange={(e) => set("product_id", e.target.value)}
              className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-3 text-stone-300 text-sm outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              <option value="" className="bg-[#1c1c2e]">
                — Select product —
              </option>
              {products.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#1c1c2e]">
                  {p.name}
                </option>
              ))}
            </select>
            {selectedProduct && (
              <div className="mt-2 flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
                <Package size={12} className="text-blue-400" />
                <span className="text-xs text-stone-300 font-semibold">
                  {selectedProduct.name}
                </span>
                {selectedProduct.sku && (
                  <span className="text-[10px] font-mono text-stone-500 ml-auto">
                    {selectedProduct.sku}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* From → To */}
          <div className="relative">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 block">
              From Rack
            </label>
            <select
              value={form.from_rack_id}
              onChange={(e) => set("from_rack_id", e.target.value)}
              className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-3 text-stone-300 text-sm outline-none focus:ring-2 focus:ring-amber-500/40"
            >
              <option value="" className="bg-[#1c1c2e]">
                — External / None —
              </option>
              {racks.map((r) => (
                <option key={r.id} value={r.id} className="bg-[#1c1c2e]">
                  {r.name} ({r.code}) – {r.location_name}
                </option>
              ))}
            </select>
          </div>

          {/* Arrow visual */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <div className="p-2 bg-blue-500/15 rounded-xl border border-blue-500/20">
              <ArrowRightLeft size={14} className="text-blue-400" />
            </div>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 block">
              To Rack
            </label>
            <select
              value={form.to_rack_id}
              onChange={(e) => set("to_rack_id", e.target.value)}
              className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-3 text-stone-300 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40"
            >
              <option value="" className="bg-[#1c1c2e]">
                — External / None —
              </option>
              {racks.map((r) => (
                <option key={r.id} value={r.id} className="bg-[#1c1c2e]">
                  {r.name} ({r.code}) – {r.location_name}
                </option>
              ))}
            </select>
          </div>

          {/* Summary preview */}
          {(fromRack || toRack) && (
            <div className="bg-white/5 border border-white/8 rounded-xl p-3 flex items-center gap-3 text-xs">
              <span className="text-stone-400 font-semibold truncate">
                {fromRack?.name || "External"}
              </span>
              <ChevronRight size={12} className="text-blue-400 flex-shrink-0" />
              <span className="text-stone-400 font-semibold truncate">
                {toRack?.name || "External"}
              </span>
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 block">
              Quantity *
            </label>
            <div className="relative">
              <Hash
                size={12}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500"
              />
              <input
                type="number"
                min="1"
                value={form.quantity}
                onChange={(e) => set("quantity", e.target.value)}
                placeholder="0"
                className="w-full h-11 bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 text-white text-lg font-mono font-black outline-none focus:ring-2 focus:ring-blue-500/40 placeholder-stone-700"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 block">
              Notes (optional)
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              rows={2}
              placeholder="Reason for transfer, batch info, etc."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-stone-300 text-sm resize-none outline-none focus:ring-2 focus:ring-blue-500/40 placeholder-stone-600"
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
            className="flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw size={13} className="animate-spin" />
                Processing…
              </>
            ) : (
              <>
                <ArrowRightLeft size={14} />
                Complete Transfer
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Transfer Row Card ─────────────────────────────────────────
const TransferCard = ({ transfer, index }) => {
  const ts = typeStyle(transfer.transfer_type);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ delay: index * 0.03 }}
      className="bg-white border border-stone-100 rounded-2xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-start gap-3.5">
        {/* Icon */}
        <div
          className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${ts.bg} ${ts.border}`}
        >
          <ArrowRightLeft size={16} className={ts.text} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <p className="font-bold text-stone-800 text-sm">
                {transfer.product_name}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${ts.bg} ${ts.text} ${ts.border}`}
                >
                  {ts.label}
                </span>
                {transfer.from_rack_code && (
                  <span className="text-[10px] font-mono text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
                    {transfer.from_rack_code}
                  </span>
                )}
                {(transfer.from_rack_code || transfer.to_rack_code) && (
                  <ChevronRight size={10} className="text-stone-300" />
                )}
                {transfer.to_rack_code && (
                  <span className="text-[10px] font-mono text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
                    {transfer.to_rack_code}
                  </span>
                )}
                {!transfer.from_rack_code && !transfer.to_rack_code && (
                  <span className="text-[10px] text-stone-400">
                    External movement
                  </span>
                )}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xl font-black font-mono text-stone-800">
                {transfer.quantity}
              </p>
              <p className="text-[10px] text-stone-400">units</p>
            </div>
          </div>

          {transfer.notes && (
            <p className="text-xs text-stone-500 italic mb-2 line-clamp-1">
              "{transfer.notes}"
            </p>
          )}

          <div className="flex items-center gap-3 text-[11px] text-stone-400">
            <span className="flex items-center gap-1">
              <User size={10} />
              {transfer.transferred_by_name || "System"}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={10} />
              {fmt(transfer.created_at)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ── Main Page ─────────────────────────────────────────────────
const StockTransfers = () => {
  const { token, user } = useAuth();
  const { t } = useTranslation();
  const canCreate = ["admin", "manager"].includes(user?.role);

  const [transfers, setTransfers] = useState([]);
  const [products, setProducts] = useState([]);
  const [racks, setRacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterProduct, setFilterProduct] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [search, setSearch] = useState("");

  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tRes, pRes, rRes] = await Promise.all([
        axios.get(`${API_URL}/stock-transfers`, { headers }),
        axios.get(`${API_URL}/products`, { headers }),
        axios.get(`${API_URL}/racks`, { headers }),
      ]);
      setTransfers(Array.isArray(tRes.data) ? tRes.data : []);
      setProducts(Array.isArray(pRes.data) ? pRes.data : []);
      setRacks(Array.isArray(rRes.data) ? rRes.data : []);
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
      await axios.post(`${API_URL}/stock-transfers`, payload, { headers });
      toast.success("Stock transfer completed!");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to create transfer");
      throw err;
    }
  };

  const filtered = useMemo(
    () =>
      transfers.filter((tr) => {
        if (filterProduct !== "all" && tr.product_id !== filterProduct)
          return false;
        if (filterType !== "all" && tr.transfer_type !== filterType)
          return false;
        if (
          search &&
          !tr.product_name?.toLowerCase().includes(search.toLowerCase()) &&
          !tr.from_rack_code?.toLowerCase().includes(search.toLowerCase()) &&
          !tr.to_rack_code?.toLowerCase().includes(search.toLowerCase())
        )
          return false;
        return true;
      }),
    [transfers, filterProduct, filterType, search],
  );

  const stats = useMemo(
    () => ({
      total: transfers.length,
      manual: transfers.filter((t) => t.transfer_type === "manual").length,
      sale: transfers.filter((t) => t.transfer_type === "sale").length,
      restock: transfers.filter((t) => t.transfer_type === "restock").length,
    }),
    [transfers],
  );

  if (loading)
    return (
      <div className="flex items-center justify-center h-full bg-[#f7f6f3]">
        <div className="text-center">
          <div className="relative w-14 h-14 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
            <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
          </div>
          <p className="text-stone-400 text-sm">Loading transfers…</p>
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
              "radial-gradient(circle at 80% 40%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 15% 70%, #10b981 0%, transparent 40%)",
          }}
        />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/15 rounded-2xl border border-blue-500/20">
              <ArrowRightLeft size={24} className="text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                Stock Transfers
              </h1>
              <p className="text-stone-400 text-sm mt-0.5">
                Track all product movements between racks
              </p>
            </div>
          </div>
          {canCreate && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm px-5 py-3 rounded-xl transition-all shadow-lg shadow-blue-900/30 active:scale-95"
            >
              <Plus size={16} />
              New Transfer
            </button>
          )}
        </div>

        {/* Stats strip */}
        <div className="relative mt-5 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Total Transfers",
              value: stats.total,
              color: "text-stone-300",
            },
            { label: "Manual", value: stats.manual, color: "text-blue-400" },
            { label: "Sales", value: stats.sale, color: "text-rose-400" },
            {
              label: "Restocks",
              value: stats.restock,
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
            placeholder="Search product, rack…"
            className="w-full h-9 pl-8 pr-3 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/30 text-stone-700"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="h-9 px-3 rounded-xl border border-stone-200 bg-white text-xs text-stone-600 outline-none"
        >
          <option value="all">All Types</option>
          <option value="manual">Manual</option>
          <option value="sale">Sale</option>
          <option value="restock">Restock</option>
        </select>
        <select
          value={filterProduct}
          onChange={(e) => setFilterProduct(e.target.value)}
          className="h-9 px-3 rounded-xl border border-stone-200 bg-white text-xs text-stone-600 outline-none max-w-[180px]"
        >
          <option value="all">All Products</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        {(search || filterType !== "all" || filterProduct !== "all") && (
          <button
            onClick={() => {
              setSearch("");
              setFilterType("all");
              setFilterProduct("all");
            }}
            className="h-9 px-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold flex items-center gap-1"
          >
            <X size={11} />
            Clear
          </button>
        )}
        <span className="ml-auto text-xs text-stone-400 font-semibold">
          {filtered.length} records
        </span>
      </div>

      {/* ── List ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-stone-100">
          <div className="p-4 bg-blue-50 rounded-2xl mb-3">
            <ArrowRightLeft size={28} className="text-blue-300" />
          </div>
          <p className="text-stone-500 font-semibold text-sm">
            No transfers found
          </p>
          <p className="text-stone-400 text-xs mt-1">
            {transfers.length === 0
              ? "Create the first stock transfer"
              : "Adjust filters to see results"}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          <AnimatePresence mode="popLayout">
            {filtered.map((tr, i) => (
              <TransferCard key={tr.id} transfer={tr} index={i} />
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <TransferModal
            products={products}
            racks={racks}
            onClose={() => setShowModal(false)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default StockTransfers;
