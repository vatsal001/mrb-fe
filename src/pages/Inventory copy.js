import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
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
  Layers,
  TrendingDown,
  AlertTriangle,
  Check,
  Barcode,
  Printer,
  Copy,
  CheckCheck,
  Minus as MinusIcon,
  Upload,
  Download,
  FileSpreadsheet,
  Image as ImageIcon,
  ChevronRight,
  Eye,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const mockImages = [
  "https://images.unsplash.com/photo-1758789898279-82f8cc279444?w=200&q=80",
  "https://images.unsplash.com/photo-1765277114329-b3da8e70731e?w=200&q=80",
  "https://images.unsplash.com/photo-1765371512379-b6e10ffddc3f?w=200&q=80",
];

// ── Label config ──────────────────────────────────────────────
const LABEL = { W: 48, H: 30, GAP: 2, COLS: 3 };

// ── Shared UI atoms ───────────────────────────────────────────
const Field = ({ label, children, required }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block">
      {label}
      {required && <span className="text-rose-400 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const DarkInput = (props) => (
  <input
    {...props}
    className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 placeholder-stone-600 transition-all"
  />
);

const SpringModal = ({ children, onClose, maxW = "max-w-2xl" }) => (
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
      className={`bg-[#1c1c2e] border border-white/10 rounded-3xl shadow-2xl w-full ${maxW} overflow-hidden max-h-[90vh] flex flex-col`}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </motion.div>
  </motion.div>
);

// ── JsBarcode CDN loader (singleton) ─────────────────────────
let _jbPromise = null;
const loadJsBarcode = () => {
  if (_jbPromise) return _jbPromise;
  _jbPromise = new Promise((resolve, reject) => {
    if (window.JsBarcode) {
      resolve(window.JsBarcode);
      return;
    }
    const s = document.createElement("script");
    s.src =
      "https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js";
    s.onload = () => resolve(window.JsBarcode);
    s.onerror = () => {
      _jbPromise = null;
      reject(new Error("JsBarcode load failed"));
    };
    document.head.appendChild(s);
  });
  return _jbPromise;
};

// ── Shared barcode render helper ──────────────────────────────
const renderBarcode = async (svgEl, code, opts = {}) => {
  const jb = await loadJsBarcode();
  jb(svgEl, code, {
    format: "CODE128",
    lineColor: "#000",
    background: "#fff",
    width: 2.5,
    height: 70,
    displayValue: true,
    fontSize: 13,
    margin: 8,
    ...opts,
  });
};

// ── Hook: render barcode into a ref ──────────────────────────
const useBarcodeRef = (code, opts) => {
  const ref = useRef(null);
  useEffect(() => {
    if (!code?.trim() || !ref.current) return;
    renderBarcode(ref.current, code.trim(), opts).catch(() => {});
  }, [code]); // eslint-disable-line react-hooks/exhaustive-deps
  return ref;
};

// ── Print mode helpers ────────────────────────────────────────
const getPrintMode = () => localStorage.getItem("mrb_print_mode") || "laser";
const setPrintMode = (m) => localStorage.setItem("mrb_print_mode", m);

// ── Laser print ───────────────────────────────────────────────
const printLabelsLaser = async (labels) => {
  const jb = await loadJsBarcode();
  const labelHTMLs = labels
    .map((l) => {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      try {
        jb(svg, l.sku, {
          format: "CODE128",
          lineColor: "#000",
          background: "#fff",
          width: 1.6,
          height: 36,
          displayValue: true,
          fontSize: 8,
          margin: 2,
        });
      } catch {
        return "";
      }
      const dataUrl =
        "data:image/svg+xml;base64," +
        btoa(
          unescape(
            encodeURIComponent(new XMLSerializer().serializeToString(svg)),
          ),
        );
      return `<div class="label">
      <div class="shop">MRB Home Decor Mall</div>
      <div class="name">${l.name.substring(0, 28)}</div>
      <img src="${dataUrl}" class="barcode-img" />
      <div class="price">Rs.${Number(l.price || 0).toLocaleString("en-IN")}</div>
    </div>`;
    })
    .join("");

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Labels — MRB Home Decor Mall</title>
<style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,sans-serif;background:#fff;width:210mm;}
.sheet{width:210mm;height:297mm;padding:5.5mm 6mm;display:grid;grid-template-columns:repeat(4,48mm);grid-template-rows:repeat(12,22mm);column-gap:2mm;row-gap:2mm;}
.label{width:48mm;height:22mm;padding:0.8mm 1.2mm;display:flex;flex-direction:column;justify-content:center;align-items:center;overflow:hidden;page-break-inside:avoid;}
.shop{font-size:5px;color:#999;text-transform:uppercase;letter-spacing:.3px;margin-bottom:.3mm;white-space:nowrap;}
.name{font-size:6.5px;font-weight:bold;color:#111;line-height:1.1;text-align:center;max-height:5mm;overflow:hidden;margin-bottom:.3mm;word-break:break-word;}
.barcode-img{width:44mm;height:9mm;object-fit:contain;display:block;}
.price{font-size:8px;font-weight:900;color:#111;margin-top:.3mm;}
@media print{@page{size:A4 portrait;margin:0;}body{margin:0;width:210mm;-webkit-print-color-adjust:exact;print-color-adjust:exact;}}</style>
</head><body><div class="sheet">${labelHTMLs}</div>
<script>window.onload=function(){const imgs=document.querySelectorAll('img');let n=0;if(!imgs.length){window.print();return;}imgs.forEach(i=>{const done=()=>{if(++n===imgs.length)window.print();};i.complete?done():i.onload=i.onerror=done;});};window.onafterprint=function(){window.close();};<\/script></body></html>`;

  const w = window.open("", "_blank", "width=900,height=700");
  w.document.write(html);
  w.document.close();
};

// ── Thermal print (TSC TSPL) ──────────────────────────────────
const printLabelsThermal = async (labels, token) => {
  const DOT = 8;
  const blocks = labels.map((l) => {
    const name = (l.name || "").substring(0, 24).replace(/"/g, "'");
    const sku = (l.sku || "").replace(/"/g, "'");
    const price = `Rs.${Number(l.price || 0).toFixed(0)}`;
    return [
      "CLS",
      `TEXT 4,4,"1",0,1,1,"MRB Home Decor Mall"`,
      `TEXT 4,20,"2",0,1,1,"${name}"`,
      `BARCODE 4,44,"128",64,1,0,2,3,"${sku}"`,
      `TEXT 4,114,"1",0,1,1,"${sku}"`,
      `TEXT 4,130,"3",0,1,1,"${price}"`,
      "PRINT 1",
      "",
    ].join("\r\n");
  });

  const fullTSPL = [
    `SIZE ${LABEL.W} mm,${LABEL.H} mm`,
    `GAP ${LABEL.GAP} mm,0 mm`,
    "DIRECTION 1",
    "REFERENCE 0,0",
    "OFFSET 0 mm",
    "",
    ...blocks,
  ].join("\r\n");

  const res = await fetch(`${API_URL}/print-thermal`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ commands: fullTSPL }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Print failed (${res.status})`);
  }
  return res.json();
};

const printLabels = (labels, token) =>
  getPrintMode() === "thermal"
    ? printLabelsThermal(labels, token)
    : printLabelsLaser(labels);

// ── Print mode toggle ─────────────────────────────────────────
const PrintModeToggle = ({ value, onChange }) => (
  <div className="flex items-center gap-1 bg-white/8 border border-white/10 rounded-xl p-1">
    {[
      { id: "laser", label: "🖨️ Laser" },
      { id: "thermal", label: "🏷️ Thermal" },
    ].map((opt) => (
      <button
        key={opt.id}
        onClick={() => onChange(opt.id)}
        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${value === opt.id ? "bg-amber-500 text-stone-900 shadow" : "text-stone-400 hover:text-white"}`}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

// ── Barcode SVG preview ───────────────────────────────────────
const BarcodeDisplay = ({ code, name, price }) => {
  const svgRef = useRef(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!code?.trim() || !svgRef.current) {
      setError(false);
      return;
    }
    setError(false);
    loadJsBarcode()
      .then((jb) => {
        try {
          while (svgRef.current.firstChild)
            svgRef.current.removeChild(svgRef.current.firstChild);
          svgRef.current.removeAttribute("style");
          jb(svgRef.current, code.trim(), {
            format: "CODE128",
            lineColor: "#000",
            background: "#fff",
            width: 2.5,
            height: 70,
            displayValue: true,
            fontSize: 13,
            margin: 8,
          });
        } catch {
          setError(true);
        }
      })
      .catch(() => setError(true));
  }, [code]);

  if (!code?.trim())
    return (
      <div className="bg-white rounded-xl p-4 min-h-[90px] flex items-center justify-center">
        <p className="text-stone-300 text-xs text-center">
          Enter or generate a barcode to see preview
        </p>
      </div>
    );

  return (
    <div className="bg-white rounded-xl p-3 text-center">
      {error ? (
        <p className="text-rose-400 text-xs py-6">
          Invalid barcode value — use letters and numbers only
        </p>
      ) : (
        <>
          <p className="text-[8px] text-stone-400 uppercase tracking-widest mb-1">
            MRB Home Decor Mall
          </p>
          <p className="font-bold text-stone-800 text-xs mb-2 truncate px-2">
            {name || "Product Name"}
          </p>
          <svg ref={svgRef} className="mx-auto max-w-full" />
          {price && (
            <p className="font-black text-stone-900 text-lg mt-1">₹{price}</p>
          )}
        </>
      )}
    </div>
  );
};

// ── Image upload field ────────────────────────────────────────
const ImageUploadField = ({ value, onChange, token }) => {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      onChange(e.target.result);
      setUploading(true);
      try {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch(`${API_URL}/upload-image`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        });
        if (res.ok) {
          const d = await res.json();
          if (d.url) onChange(d.url);
        }
      } catch {
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      {value ? (
        <div
          className="relative group rounded-2xl overflow-hidden border border-white/10 bg-white/5"
          style={{ height: 180 }}
        >
          <img
            src={value}
            alt="Product"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/55 transition-all duration-200 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100">
            <label className="flex flex-col items-center gap-1.5 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-white/15 hover:bg-amber-500/80 border border-white/20 flex items-center justify-center transition-all">
                <Upload size={16} className="text-white" />
              </div>
              <span className="text-[10px] text-white font-bold">Change</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  e.target.files?.[0] && handleFile(e.target.files[0])
                }
              />
            </label>
            <button
              onClick={() =>
                value.startsWith("data:")
                  ? (() => {
                      const w = window.open();
                      w.document.write(
                        `<img src="${value}" style="max-width:100%;display:block;margin:auto;" />`,
                      );
                    })()
                  : window.open(value, "_blank", "noopener,noreferrer")
              }
              className="flex flex-col items-center gap-1.5"
            >
              <div className="w-10 h-10 rounded-xl bg-white/15 hover:bg-blue-500/80 border border-white/20 flex items-center justify-center transition-all">
                <Eye size={16} className="text-white" />
              </div>
              <span className="text-[10px] text-white font-bold">View</span>
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <RefreshCw size={20} className="text-amber-400 animate-spin" />
                <span className="text-xs text-white font-semibold">
                  Uploading…
                </span>
              </div>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 px-3 py-1.5 bg-gradient-to-t from-black/70 to-transparent">
            <p className="text-[9px] text-stone-300 truncate">
              {value.startsWith("data:") ? "Local file" : value}
            </p>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]);
          }}
          onClick={() => fileRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-2 h-36 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${dragging ? "border-amber-400 bg-amber-500/10" : "border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/8"}`}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              e.target.files?.[0] && handleFile(e.target.files[0])
            }
          />
          {uploading ? (
            <>
              <RefreshCw size={22} className="text-amber-400 animate-spin" />
              <p className="text-[11px] text-stone-400">Uploading…</p>
            </>
          ) : (
            <>
              <div
                className={`p-3 rounded-xl transition-colors ${dragging ? "bg-amber-500/20" : "bg-white/8"}`}
              >
                <ImageIcon
                  size={22}
                  className={dragging ? "text-amber-400" : "text-stone-500"}
                />
              </div>
              <div className="text-center">
                <p className="text-[12px] text-stone-300 font-semibold">
                  {dragging ? "Drop image here" : "Click or drag & drop"}
                </p>
                <p className="text-[10px] text-stone-600 mt-0.5">
                  PNG, JPG, WEBP · max 5 MB
                </p>
              </div>
            </>
          )}
        </div>
      )}
      <div className="flex items-center gap-2">
        <input
          type="url"
          value={value?.startsWith("data:") ? "" : value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste image URL…"
          className="flex-1 h-9 bg-white/5 border border-white/10 rounded-xl px-3 text-white text-xs outline-none focus:ring-2 focus:ring-amber-500/40 placeholder-stone-600 transition-all"
        />
        {value && !value.startsWith("data:") && (
          <button
            onClick={() => {
              navigator.clipboard.writeText(value);
              toast.success("URL copied!");
            }}
            className="h-9 px-3 rounded-xl bg-white/8 hover:bg-white/15 border border-white/10 text-stone-400 hover:text-white transition-all flex-shrink-0"
          >
            <Copy size={13} />
          </button>
        )}
      </div>
    </div>
  );
};

// ── Product Modal ─────────────────────────────────────────────
const ProductModal = ({ editingProduct, onClose, onSave, token }) => {
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: editingProduct?.name || "",
    sku: editingProduct?.sku || editingProduct?.barcode || "",
    category: editingProduct?.category || "",
    purchase_price: editingProduct?.purchase_price?.toString() || "",
    selling_price: editingProduct?.selling_price?.toString() || "",
    stock_quantity: editingProduct?.stock_quantity?.toString() || "",
    supplier: editingProduct?.supplier || "",
    image_url: editingProduct?.image_url || "",
    low_stock_threshold:
      editingProduct?.low_stock_threshold?.toString() || "10",
  });
  const set = useCallback((k, v) => setForm((f) => ({ ...f, [k]: v })), []);

  const generateBarcode = () => {
    set(
      "sku",
      `${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 900 + 100)}`,
    );
  };

  const handlePrintSingle = async () => {
    if (!form.sku.trim() || !form.name.trim()) {
      toast.error("Enter product name and barcode first");
      return;
    }
    try {
      await printLabels(
        [{ name: form.name, sku: form.sku, price: form.selling_price }],
        token,
      );
      if (getPrintMode() === "thermal")
        toast.success("Sent to thermal printer!");
    } catch (err) {
      toast.error(err.message || "Print failed");
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.sku || !form.category) {
      toast.error("Name, Barcode and Category are required");
      return;
    }
    setSaving(true);
    try {
      await onSave({
        ...form,
        purchase_price: parseFloat(form.purchase_price) || 0,
        selling_price: parseFloat(form.selling_price) || 0,
        stock_quantity: parseInt(form.stock_quantity) || 0,
        low_stock_threshold: parseInt(form.low_stock_threshold) || 10,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <SpringModal onClose={onClose}>
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
        {/* Barcode section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Barcode size={14} className="text-amber-400" />
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                Barcode / SKU *
              </span>
            </div>
            <button
              onClick={generateBarcode}
              className="flex items-center gap-1.5 text-[11px] font-black bg-amber-500 hover:bg-amber-400 text-stone-900 px-3 py-1.5 rounded-lg transition-all"
            >
              <RefreshCw size={11} /> Generate New
            </button>
          </div>
          <div className="flex gap-2 mb-3">
            <DarkInput
              value={form.sku}
              onChange={(e) => set("sku", e.target.value)}
              placeholder="Enter barcode or click Generate"
              style={{
                fontFamily: "monospace",
                letterSpacing: "0.12em",
                fontSize: "1rem",
              }}
            />
            {form.sku && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(form.sku);
                  toast.success("Copied!");
                }}
                className="px-3 rounded-xl bg-white/10 hover:bg-white/15 text-stone-300 hover:text-white transition-colors flex-shrink-0"
              >
                <Copy size={14} />
              </button>
            )}
          </div>
          <BarcodeDisplay
            code={form.sku}
            name={form.name}
            price={form.selling_price}
          />
          {form.sku && form.name && (
            <button
              onClick={handlePrintSingle}
              className="mt-3 w-full flex items-center justify-center gap-2 h-9 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all"
            >
              <Printer size={13} /> Print This Label
            </button>
          )}
          <p className="text-[10px] text-stone-600 text-center mt-2">
            ✓ Scannable by Fingers and all USB barcode scanners
          </p>
        </div>

        {/* Product details */}
        <div className="grid grid-cols-2 gap-4">
          <Field label={t("inventory.productName")} required>
            <DarkInput
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Product name"
            />
          </Field>
          <Field label={t("inventory.category")} required>
            <DarkInput
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              placeholder="e.g. Vases"
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label={t("inventory.supplier")}>
            <DarkInput
              value={form.supplier}
              onChange={(e) => set("supplier", e.target.value)}
              placeholder="Supplier name"
            />
          </Field>
          <Field label={t("inventory.lowStockThreshold")}>
            <DarkInput
              type="number"
              value={form.low_stock_threshold}
              onChange={(e) => set("low_stock_threshold", e.target.value)}
              placeholder="10"
            />
          </Field>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: t("inventory.purchasePrice"), key: "purchase_price" },
            { label: t("inventory.sellingPrice"), key: "selling_price" },
          ].map(({ label, key }) => (
            <Field key={key} label={label} required>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400 text-sm font-bold">
                  ₹
                </span>
                <DarkInput
                  type="number"
                  step="0.01"
                  value={form[key]}
                  onChange={(e) => set(key, e.target.value)}
                  placeholder="0.00"
                  style={{ paddingLeft: "2rem" }}
                />
              </div>
            </Field>
          ))}
          <Field label={t("inventory.stockQuantity")} required>
            <DarkInput
              type="number"
              value={form.stock_quantity}
              onChange={(e) => set("stock_quantity", e.target.value)}
              placeholder="0"
            />
          </Field>
        </div>
        <Field label="Product Image">
          <ImageUploadField
            value={form.image_url}
            onChange={(v) => set("image_url", v)}
            token={token}
          />
        </Field>
        {form.image_url && (
          <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/10">
            <img
              src={form.image_url}
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
    </SpringModal>
  );
};

// ── Rack Modal ────────────────────────────────────────────────
const RackModal = ({ product, racks, onClose, token }) => {
  const { t } = useTranslation();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ rack_id: "", quantity: "" });
  const [saving, setSaving] = useState(false);
  const headers = useMemo(
    () => ({ Authorization: `Bearer ${token}` }),
    [token],
  );

  const fetchAssignments = useCallback(async () => {
    setLoading(true);
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
  }, [product.id, headers]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

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
    <SpringModal onClose={onClose} maxW="max-w-xl">
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
    </SpringModal>
  );
};

// ── Barcode Modal ─────────────────────────────────────────────
const BarcodeModal = ({ product, token, onClose }) => {
  const barcodeCode = product.barcode || product.sku;
  const svgRef = useBarcodeRef(barcodeCode, {
    width: 2.5,
    height: 65,
    fontSize: 13,
    margin: 8,
  });
  const [copies, setCopies] = useState(1);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(barcodeCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = async () => {
    const labels = Array.from({ length: copies }, () => ({
      name: product.name,
      sku: barcodeCode,
      price: product.selling_price,
    }));
    try {
      await printLabels(labels, token);
      if (getPrintMode() === "thermal") toast.success("Sent to printer!");
    } catch (err) {
      toast.error(err.message || "Print failed");
    }
  };

  return (
    <SpringModal onClose={onClose} maxW="max-w-sm">
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/15 rounded-xl border border-amber-500/20">
            <Barcode size={16} className="text-amber-400" />
          </div>
          <h2 className="font-black text-white text-sm">Barcode Label</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="px-6 py-5">
        <div className="bg-white rounded-2xl p-4 text-center shadow-lg border border-stone-200">
          <p className="text-[8px] text-stone-400 uppercase tracking-widest mb-1">
            MRB Home Decor Mall
          </p>
          <p className="font-black text-stone-800 text-sm leading-tight mb-3 line-clamp-2">
            {product.name}
          </p>
          <svg ref={svgRef} className="mx-auto max-w-full" />
          <p className="font-mono text-[9px] text-stone-400 mt-1 tracking-wider">
            {barcodeCode}
          </p>
          <p className="font-black text-stone-900 text-xl mt-2">
            ₹
            {Number(product.selling_price).toLocaleString("en-IN", {
              maximumFractionDigits: 2,
            })}
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
          <span className="text-xs font-mono text-stone-300 flex-1 truncate">
            {barcodeCode}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors flex-shrink-0"
          >
            {copied ? (
              <>
                <CheckCheck size={13} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={13} />
                Copy
              </>
            )}
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
          <span className="text-xs text-stone-400 font-semibold">
            Print copies
          </span>
          <div className="flex items-center gap-3">
            {[
              {
                icon: MinusIcon,
                action: () => setCopies((c) => Math.max(1, c - 1)),
              },
              {
                icon: Plus,
                action: () => setCopies((c) => Math.min(50, c + 1)),
              },
            ].map(({ icon: Icon, action }, i) =>
              i === 0 ? (
                <button
                  key={i}
                  onClick={action}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                >
                  <Icon size={12} />
                </button>
              ) : (
                <>
                  <span className="text-white font-black text-sm w-6 text-center">
                    {copies}
                  </span>
                  <button
                    key={i}
                    onClick={action}
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  >
                    <Icon size={12} />
                  </button>
                </>
              ),
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-white/10 flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 h-11 rounded-xl border border-white/10 text-stone-400 hover:text-white text-sm font-semibold transition-all"
        >
          Close
        </button>
        <button
          onClick={handlePrint}
          className="flex-1 h-11 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-900 font-black text-sm flex items-center justify-center gap-2 transition-all"
        >
          <Printer size={14} /> Print {copies > 1 ? `(${copies})` : ""}
        </button>
      </div>
    </SpringModal>
  );
};

// ── XLSX helpers ──────────────────────────────────────────────
const XLSX_COLS = [
  "name",
  "sku",
  "category",
  "purchase_price",
  "selling_price",
  "stock_quantity",
  "supplier",
  "low_stock_threshold",
  "image_url",
];

const loadXLSX = () =>
  new Promise((resolve, reject) => {
    if (window.XLSX) {
      resolve(window.XLSX);
      return;
    }
    const s = document.createElement("script");
    s.src = "https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js";
    s.onload = () => resolve(window.XLSX);
    s.onerror = () => reject(new Error("Failed to load Excel library"));
    document.head.appendChild(s);
  });

const loadJSZip = () =>
  new Promise((resolve, reject) => {
    if (window.JSZip) {
      resolve(window.JSZip);
      return;
    }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
    s.onload = () => resolve(window.JSZip);
    s.onerror = reject;
    document.head.appendChild(s);
  });

const downloadXLSXTemplate = async () => {
  try {
    const XLSX = await loadXLSX();
    const ws_data = [
      XLSX_COLS,
      [
        "Ceramic Vase Blue",
        "CV001",
        "Vases",
        "200",
        "499",
        "10",
        "Artisan Co.",
        "5",
        "",
      ],
      [
        "Wall Clock Teak",
        "WC002",
        "Clocks",
        "350",
        "799",
        "20",
        "TimeCo.",
        "3",
        "",
      ],
      [
        "Cushion Cover Set",
        "CC003",
        "Textiles",
        "120",
        "299",
        "30",
        "SoftCo.",
        "5",
        "",
      ],
    ];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    ws["!cols"] = [25, 14, 16, 14, 14, 14, 18, 20, 35].map((wch) => ({ wch }));
    ws["!rows"] = [{ hpt: 20 }, { hpt: 60 }, { hpt: 60 }, { hpt: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, "mrb_products_template.xlsx");
  } catch (err) {
    toast.error(err.message);
  }
};

const parseXLSX = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const [XLSX, JSZip] = await Promise.all([loadXLSX(), loadJSZip()]);
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, {
          type: "array",
          cellStyles: true,
          cellDates: true,
        });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const raw = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

        if (raw.length < 2) {
          resolve({
            rows: [],
            errors: ["Excel file must have at least one data row"],
          });
          return;
        }

        const headers = raw[0].map((h) =>
          String(h).trim().toLowerCase().replace(/\s+/g, "_"),
        );
        const missing = ["name", "sku", "category", "selling_price"].filter(
          (r) => !headers.includes(r),
        );
        if (missing.length) {
          resolve({
            rows: [],
            errors: [`Missing columns: ${missing.join(", ")}`],
          });
          return;
        }

        // Extract embedded images via JSZip
        let drawingRowMap = {};
        try {
          const zip = await JSZip.loadAsync(data);
          const mediaFiles = {};
          await Promise.all(
            Object.entries(zip.files)
              .filter(([path]) => path.startsWith("xl/media/"))
              .map(async ([path, entry]) => {
                const ext = path.split(".").pop().toLowerCase();
                const mimeMap = {
                  png: "image/png",
                  jpg: "image/jpeg",
                  jpeg: "image/jpeg",
                  gif: "image/gif",
                  webp: "image/webp",
                };
                if (mimeMap[ext])
                  mediaFiles[path] =
                    `data:${mimeMap[ext]};base64,${await entry.async("base64")}`;
              }),
          );

          const relsFile = zip.file("xl/drawings/_rels/drawing1.xml.rels");
          const rIdToMedia = {};
          if (relsFile) {
            const doc = new DOMParser().parseFromString(
              await relsFile.async("string"),
              "text/xml",
            );
            doc.querySelectorAll("Relationship").forEach((rel) => {
              const resolved =
                "xl/media/" + rel.getAttribute("Target").split("/").pop();
              if (mediaFiles[resolved])
                rIdToMedia[rel.getAttribute("Id")] = mediaFiles[resolved];
            });
          }

          const drawingFile = zip.file("xl/drawings/drawing1.xml");
          if (drawingFile) {
            const doc = new DOMParser().parseFromString(
              await drawingFile.async("string"),
              "text/xml",
            );
            [
              ...doc.querySelectorAll("twoCellAnchor"),
              ...doc.querySelectorAll("oneCellAnchor"),
            ].forEach((anchor) => {
              const fromRow = anchor.querySelector("from > row");
              const blip = anchor.querySelector("blip");
              if (!fromRow || !blip) return;
              const rId =
                blip.getAttribute("r:embed") ||
                blip.getAttributeNS(
                  "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
                  "embed",
                );
              const dataRowIdx = parseInt(fromRow.textContent, 10) - 1;
              if (dataRowIdx >= 0 && rId && rIdToMedia[rId])
                drawingRowMap[dataRowIdx] = rIdToMedia[rId];
            });
          }
        } catch (e) {
          console.warn("Image extraction failed:", e);
        }

        const rows = raw
          .slice(1)
          .map((cols, i) => {
            const row = { _line: i + 2, _errors: [] };
            headers.forEach((h, j) => {
              row[h] = String(cols[j] ?? "").trim();
            });
            if (!row.name) row._errors.push("Name required");
            if (!row.sku) row._errors.push("SKU/Barcode required");
            if (!row.category) row._errors.push("Category required");
            if (row.selling_price && isNaN(parseFloat(row.selling_price)))
              row._errors.push("Invalid selling price");
            if (drawingRowMap[i]) {
              row.image_url = drawingRowMap[i];
              row._hasEmbeddedImage = true;
            }
            return row;
          })
          .filter((r) =>
            ["name", "sku", "category", "selling_price", "stock_quantity"].some(
              (k) => r[k],
            ),
          );

        resolve({ rows, errors: [] });
      } catch (err) {
        resolve({
          rows: [],
          errors: [`Failed to parse Excel file: ${err.message}`],
        });
      }
    };
    reader.readAsArrayBuffer(file);
  });
};

// ── XLSX Import Modal ─────────────────────────────────────────
const XLSXImportModal = ({ onClose, onImport, token }) => {
  const [step, setStep] = useState("upload");
  const [rows, setRows] = useState([]);
  const [parseErrors, setParseErrors] = useState([]);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [fileName, setFileName] = useState("");
  const fileRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.name.match(/\.xlsx?$/i) && !file.type.includes("spreadsheet")) {
      toast.error("Please upload an Excel file (.xlsx)");
      return;
    }
    setFileName(file.name);
    const { rows: parsed, errors } = await parseXLSX(file);
    setParseErrors(errors);
    setRows(parsed);
    if (!errors.length && parsed.length) setStep("preview");
  };

  const handleRowImage = (rowIdx, file) => {
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setRows((prev) =>
      prev.map((r, i) =>
        i === rowIdx
          ? {
              ...r,
              image_url: URL.createObjectURL(file),
              _pendingImageFile: file,
            }
          : r,
      ),
    );
  };

  const editCell = (rowIdx, col, val) =>
    setRows((prev) =>
      prev.map((r, i) => (i === rowIdx ? { ...r, [col]: val } : r)),
    );
  const removeRow = (rowIdx) =>
    setRows((prev) => prev.filter((_, i) => i !== rowIdx));

  const handleImport = async () => {
    const valid = rows.filter((r) => !r._errors?.length);
    if (!valid.length) {
      toast.error("No valid rows to import");
      return;
    }
    setStep("importing");
    setProgress({ done: 0, total: valid.length });

    let success = 0,
      failed = 0;
    for (const row of valid) {
      let imageUrl = row.image_url || "";
      if (row._pendingImageFile instanceof File) {
        try {
          const form = new FormData();
          form.append("file", row._pendingImageFile);
          const res = await fetch(`${API_URL}/upload-image`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: form,
          });
          if (res.ok) {
            const d = await res.json();
            if (d.url) imageUrl = d.url;
          }
          if (imageUrl.startsWith("blob:")) {
            imageUrl = await new Promise((resolve) => {
              const r = new FileReader();
              r.onload = (e) => resolve(e.target.result);
              r.readAsDataURL(row._pendingImageFile);
            });
          }
        } catch {
          imageUrl = await new Promise((resolve) => {
            const r = new FileReader();
            r.onload = (e) => resolve(e.target.result);
            r.readAsDataURL(row._pendingImageFile);
          }).catch(() => "");
        }
      }
      try {
        await axios.post(
          `${API_URL}/products`,
          {
            name: row.name,
            sku: row.sku,
            category: row.category,
            purchase_price: parseFloat(row.purchase_price) || 0,
            selling_price: parseFloat(row.selling_price) || 0,
            stock_quantity: parseInt(row.stock_quantity) || 0,
            supplier: row.supplier || "",
            low_stock_threshold: parseInt(row.low_stock_threshold) || 10,
            image_url: imageUrl,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        success++;
      } catch {
        failed++;
      }
      setProgress((p) => ({ ...p, done: p.done + 1 }));
    }
    toast.success(
      `Imported ${success} product${success !== 1 ? "s" : ""}${failed ? ` (${failed} failed)` : ""}`,
    );
    onImport();
    onClose();
  };

  const validRows = rows.filter((r) => !r._errors?.length);
  const invalidRows = rows.filter((r) => r._errors?.length);
  const embeddedImageCount = rows.filter((r) => r._hasEmbeddedImage).length;

  const StepIndicator = () => (
    <div className="hidden sm:flex items-center gap-1 text-[11px]">
      {["Upload", "Preview & Edit", "Import"].map((s, i) => {
        const ids = ["upload", "preview", "importing"];
        const active = step === ids[i];
        const done =
          (step === "preview" && i === 0) || (step === "importing" && i < 2);
        return (
          <React.Fragment key={s}>
            <span
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${active ? "bg-amber-500 text-stone-900" : done ? "text-emerald-400" : "text-stone-600"}`}
            >
              {done ? "✓ " : ""}
              {s}
            </span>
            {i < 2 && <ChevronRight size={12} className="text-stone-700" />}
          </React.Fragment>
        );
      })}
    </div>
  );

  return (
    <SpringModal onClose={onClose} maxW="max-w-5xl">
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/15 rounded-xl border border-emerald-500/20">
            <FileSpreadsheet size={17} className="text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              Import Products via Excel
            </h2>
            <p className="text-[10px] text-stone-500">
              Upload an .xlsx file — images inserted into cells are
              automatically extracted
            </p>
          </div>
        </div>
        <StepIndicator />
        <button
          onClick={onClose}
          className="p-2 rounded-xl hover:bg-white/10 text-stone-400 hover:text-white transition-colors ml-4"
        >
          <X size={16} />
        </button>
      </div>

      {step === "upload" && (
        <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col items-center justify-center gap-6">
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFile(e.dataTransfer.files[0]);
            }}
            className="w-full max-w-lg border-2 border-dashed border-white/20 hover:border-emerald-500/50 rounded-2xl p-10 text-center cursor-pointer transition-all group"
          >
            <div className="p-4 bg-emerald-500/10 rounded-2xl inline-flex mb-4 group-hover:bg-emerald-500/20 transition-colors">
              <FileSpreadsheet size={28} className="text-emerald-400" />
            </div>
            <p className="text-white font-bold mb-1">
              Drop your Excel file here
            </p>
            <p className="text-stone-500 text-sm mb-4">or click to browse</p>
            <span className="text-[11px] bg-white/10 text-stone-400 px-3 py-1.5 rounded-full font-mono">
              .xlsx files only
            </span>
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>
          {parseErrors.length > 0 && (
            <div className="w-full max-w-lg bg-rose-500/10 border border-rose-500/30 rounded-xl p-4">
              {parseErrors.map((e, i) => (
                <p key={i} className="text-rose-400 text-sm">
                  ⚠️ {e}
                </p>
              ))}
            </div>
          )}
          <div className="w-full max-w-lg bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-white font-bold text-sm mb-1">
                  📄 Download Excel Template
                </p>
                <p className="text-stone-500 text-xs">
                  Open in Excel or Google Sheets, fill in your products, then
                  upload back.
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {XLSX_COLS.map((c) => (
                    <span
                      key={c}
                      className="text-[10px] font-mono bg-white/10 text-stone-400 px-2 py-0.5 rounded"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={downloadXLSXTemplate}
                className="flex-shrink-0 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
              >
                <Download size={13} /> Template
              </button>
            </div>
            <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-4 space-y-2">
              <p className="text-amber-400 text-xs font-bold">
                📸 How to add images directly in Excel
              </p>
              <ol className="text-stone-400 text-[11px] space-y-1.5 list-decimal list-inside">
                {[
                  <>
                    Open the downloaded template in{" "}
                    <span className="text-white font-semibold">
                      Microsoft Excel
                    </span>
                  </>,
                  <>
                    Click on a cell in the{" "}
                    <span className="font-mono text-amber-300">image_url</span>{" "}
                    column for the product row
                  </>,
                  <>
                    Go to{" "}
                    <span className="text-white font-semibold">
                      Insert → Pictures → Place in Cell
                    </span>{" "}
                    <span className="text-stone-500">(Excel 365)</span>
                  </>,
                  <>
                    Or paste an image directly into the cell with{" "}
                    <span className="bg-white/10 font-mono text-stone-300 px-1 rounded">
                      Ctrl+V
                    </span>
                  </>,
                  <>
                    Alternatively, leave{" "}
                    <span className="font-mono text-amber-300">image_url</span>{" "}
                    as a regular URL — both work
                  </>,
                  "Save and upload the .xlsx file here",
                ].map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ol>
              <p className="text-stone-600 text-[10px] mt-1">
                ✦ Works with Excel 365 "Place in Cell" images and older floating
                images anchored to the image_url column
              </p>
            </div>
          </div>
        </div>
      )}

      {step === "preview" && (
        <>
          <div className="px-6 py-3 border-b border-white/10 flex flex-wrap items-center gap-3 flex-shrink-0">
            <span className="text-xs text-stone-400">
              {rows.length} rows from{" "}
              <span className="text-white font-bold">{fileName}</span>
            </span>
            <span className="text-xs text-emerald-400 font-bold">
              ✓ {validRows.length} valid
            </span>
            {invalidRows.length > 0 && (
              <span className="text-xs text-rose-400 font-bold">
                ⚠ {invalidRows.length} with errors
              </span>
            )}
            {embeddedImageCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                <ImageIcon size={11} /> {embeddedImageCount} embedded image
                {embeddedImageCount > 1 ? "s" : ""} detected
              </span>
            )}
            <button
              onClick={() => {
                setStep("upload");
                setRows([]);
              }}
              className="ml-auto text-xs text-stone-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              ← Change file
            </button>
          </div>
          <div className="flex-1 overflow-auto px-6 py-4">
            <p className="text-[10px] text-stone-500 mb-2">
              Click any cell to edit · Images extracted from Excel cells show
              automatically · Upload per row if needed
            </p>
            <table className="w-full text-xs min-w-[900px]">
              <thead>
                <tr className="bg-white/5 sticky top-0 z-10">
                  {[
                    "#",
                    "Image",
                    "Name *",
                    "SKU *",
                    "Category *",
                    "Buy ₹",
                    "Sell ₹ *",
                    "Stock",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-3 py-2.5 text-stone-500 font-bold uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => {
                  const hasError = row._errors?.length > 0;
                  return (
                    <tr
                      key={ri}
                      className={`border-b border-white/5 ${hasError ? "bg-rose-500/5" : "hover:bg-white/3"}`}
                    >
                      <td className="px-3 py-2 text-stone-600 text-center text-[10px]">
                        {row._line}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex flex-col items-start gap-1">
                          {row.image_url ? (
                            <div className="relative group">
                              <img
                                src={row.image_url}
                                alt=""
                                className="w-14 h-14 object-cover rounded-lg border border-white/10"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                }}
                              />
                              {row._hasEmbeddedImage && (
                                <span className="absolute -top-1.5 -right-1.5 text-[8px] bg-emerald-500 text-white px-1 rounded-full font-bold leading-4">
                                  xlsx
                                </span>
                              )}
                              <button
                                onClick={() => editCell(ri, "image_url", "")}
                                className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={14} className="text-white" />
                              </button>
                            </div>
                          ) : (
                            <label className="w-14 h-14 rounded-lg border-2 border-dashed border-white/20 hover:border-amber-500/50 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                              <ImageIcon
                                size={14}
                                className="text-stone-600 group-hover:text-amber-400 transition-colors"
                              />
                              <span className="text-[8px] text-stone-700 mt-0.5">
                                Upload
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                  handleRowImage(ri, e.target.files[0])
                                }
                              />
                            </label>
                          )}
                          {!row.image_url && (
                            <input
                              placeholder="or paste URL"
                              className="w-20 h-5 text-[9px] bg-white/5 border border-white/10 rounded px-1 text-stone-400 outline-none focus:border-amber-500/40"
                              onBlur={(e) => {
                                if (e.target.value.trim()) {
                                  editCell(
                                    ri,
                                    "image_url",
                                    e.target.value.trim(),
                                  );
                                  e.target.value = "";
                                }
                              }}
                            />
                          )}
                        </div>
                      </td>
                      {[
                        "name",
                        "sku",
                        "category",
                        "purchase_price",
                        "selling_price",
                        "stock_quantity",
                      ].map((col) => (
                        <td key={col} className="px-2 py-2">
                          <input
                            value={row[col] || ""}
                            onChange={(e) => editCell(ri, col, e.target.value)}
                            className={`w-full h-7 bg-white/5 border rounded px-2 text-white text-xs outline-none focus:ring-1 focus:ring-amber-500/40 ${hasError && ["name", "sku", "category", "selling_price"].includes(col) ? "border-rose-500/50" : "border-white/10"}`}
                          />
                        </td>
                      ))}
                      <td className="px-2 py-2">
                        <button
                          onClick={() => removeRow(ri)}
                          className="p-1 rounded hover:bg-rose-500/20 text-stone-600 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between flex-shrink-0">
            <div>
              {invalidRows.length > 0 && (
                <p className="text-xs text-amber-400 flex items-center gap-1.5">
                  <AlertCircle size={12} /> {invalidRows.length} row
                  {invalidRows.length > 1 ? "s" : ""} with errors will be
                  skipped.
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="h-11 px-5 rounded-xl border border-white/10 text-stone-400 hover:text-white text-sm font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={!validRows.length}
                className="flex items-center gap-2 h-11 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-900 font-black text-sm transition-all disabled:opacity-40"
              >
                <Upload size={15} /> Import {validRows.length} Product
                {validRows.length !== 1 ? "s" : ""}
              </button>
            </div>
          </div>
        </>
      )}

      {step === "importing" && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 gap-6">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-amber-100/20" />
            <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-black text-sm">
                {progress.done}/{progress.total}
              </span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-white font-bold mb-1">Importing products…</p>
            <p className="text-stone-400 text-sm">
              Please wait, do not close this window
            </p>
          </div>
          <div className="w-full max-w-xs bg-white/10 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-amber-500 rounded-full"
              animate={{
                width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}
    </SpringModal>
  );
};

// ── Product View Modal ────────────────────────────────────────
// const ProductViewModal = ({
//   product,
//   onClose,
//   onEdit,
//   canEdit,
//   mockImages,
//   idx,
// }) => {
//   const barcodeCode = product.barcode || product.sku;
//   const barcodeRef = useBarcodeRef(barcodeCode, {
//     width: 2,
//     height: 50,
//     fontSize: 11,
//     margin: 6,
//   });
//   const isLow = product.stock_quantity <= product.low_stock_threshold;
//   const profit = product.selling_price - product.purchase_price;
//   const margin =
//     product.selling_price > 0
//       ? ((profit / product.selling_price) * 100).toFixed(1)
//       : 0;

//   return (
//     <SpringModal onClose={onClose} maxW="max-w-xl">
//       <div className="relative h-52 flex-shrink-0 bg-stone-900 overflow-hidden">
//         <img
//           src={product.image_url || mockImages[idx % mockImages.length]}
//           alt={product.name}
//           className="w-full h-full object-cover"
//           onError={(e) => {
//             e.target.src = mockImages[idx % mockImages.length];
//           }}
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c2e] via-transparent to-transparent" />
//         <div className="absolute top-3 right-3 flex gap-2">
//           {canEdit && (
//             <button
//               onClick={() => {
//                 onClose();
//                 onEdit(product);
//               }}
//               className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-900 font-black text-xs px-3 py-2 rounded-xl transition-all shadow-lg"
//             >
//               <Pencil size={12} /> Edit
//             </button>
//           )}
//           <button
//             onClick={onClose}
//             className="p-2 rounded-xl bg-black/40 hover:bg-black/60 text-white transition-colors"
//           >
//             <X size={15} />
//           </button>
//         </div>
//         <div className="absolute top-3 left-3">
//           <span
//             className={`text-xs font-black px-3 py-1.5 rounded-full ${product.stock_quantity === 0 ? "bg-rose-500 text-white" : isLow ? "bg-amber-500 text-stone-900" : "bg-emerald-500 text-white"}`}
//           >
//             {product.stock_quantity === 0
//               ? "Out of Stock"
//               : isLow
//                 ? "Low Stock"
//                 : "In Stock"}
//           </span>
//         </div>
//         <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
//           <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mb-1">
//             {product.category}
//           </p>
//           <h2 className="text-xl font-black text-white leading-tight">
//             {product.name}
//           </h2>
//           {product.supplier && (
//             <p className="text-xs text-stone-400 mt-0.5">{product.supplier}</p>
//           )}
//         </div>
//       </div>

//       <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
//         <div className="grid grid-cols-3 gap-3">
//           {[
//             {
//               label: "Selling Price",
//               value: `₹${Number(product.selling_price).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`,
//               color: "text-amber-400",
//             },
//             {
//               label: "Purchase Price",
//               value: `₹${Number(product.purchase_price).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`,
//               sub: `Margin ${margin}%`,
//               color: "text-stone-300",
//             },
//             {
//               label: "Stock Qty",
//               value: product.stock_quantity,
//               sub: `Min. ${product.low_stock_threshold}`,
//               color: isLow ? "text-amber-400" : "text-emerald-400",
//             },
//           ].map((s) => (
//             <div
//               key={s.label}
//               className="bg-white/5 border border-white/8 rounded-2xl px-4 py-3 text-center"
//             >
//               <p className="text-[9px] text-stone-500 uppercase tracking-widest font-bold mb-1">
//                 {s.label}
//               </p>
//               <p className={`font-black text-base ${s.color}`}>{s.value}</p>
//               {s.sub && (
//                 <p className="text-[10px] text-stone-600 mt-0.5">{s.sub}</p>
//               )}
//             </div>
//           ))}
//         </div>

//         <div className="flex items-center justify-between bg-emerald-500/8 border border-emerald-500/20 rounded-2xl px-4 py-3">
//           <div className="flex items-center gap-2">
//             <TrendingDown size={14} className="text-emerald-400 rotate-180" />
//             <span className="text-xs text-stone-400 font-semibold">
//               Profit per unit
//             </span>
//           </div>
//           <div className="text-right">
//             <span className="font-black text-emerald-400 text-sm">
//               +₹{profit.toFixed(2)}
//             </span>
//             <span className="text-stone-500 text-xs ml-2">({margin}%)</span>
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-2">
//           {[
//             {
//               label: "SKU / Barcode",
//               value: product.sku || product.barcode,
//               mono: true,
//             },
//             { label: "Category", value: product.category },
//             { label: "Supplier", value: product.supplier || "—" },
//             {
//               label: "Low Stock Alert",
//               value: `≤ ${product.low_stock_threshold} units`,
//             },
//           ].map((d) => (
//             <div
//               key={d.label}
//               className="bg-white/4 border border-white/8 rounded-xl px-3 py-2.5"
//             >
//               <p className="text-[9px] text-stone-600 uppercase tracking-widest font-bold mb-0.5">
//                 {d.label}
//               </p>
//               <p
//                 className={`text-sm text-stone-200 font-semibold truncate ${d.mono ? "font-mono" : ""}`}
//               >
//                 {d.value}
//               </p>
//             </div>
//           ))}
//         </div>

//         {barcodeCode && (
//           <div className="bg-white rounded-2xl p-4 text-center">
//             <p className="text-[8px] text-stone-400 uppercase tracking-widest mb-1">
//               MRB Home Decor Mall
//             </p>
//             <p className="text-xs font-bold text-stone-700 mb-2 truncate px-2">
//               {product.name}
//             </p>
//             <svg ref={barcodeRef} className="mx-auto max-w-full" />
//             <p className="font-black text-stone-900 text-base mt-1">
//               ₹{Number(product.selling_price).toLocaleString("en-IN")}
//             </p>
//           </div>
//         )}
//       </div>

//       <div className="px-5 py-4 border-t border-white/10 flex gap-2 flex-shrink-0">
//         <button
//           onClick={onClose}
//           className="flex-1 h-10 rounded-xl border border-white/10 text-stone-400 hover:text-white text-sm font-semibold transition-all"
//         >
//           Close
//         </button>
//         {canEdit && (
//           <button
//             onClick={() => {
//               onClose();
//               onEdit(product);
//             }}
//             className="flex-1 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-900 font-black text-sm flex items-center justify-center gap-2 transition-all"
//           >
//             <Pencil size={14} /> Edit Product
//           </button>
//         )}
//       </div>
//     </SpringModal>
//   );
// };

// ── Main Inventory Page ───────────────────────────────────────
const Inventory = () => {
  const { token, user } = useAuth();
  const { t } = useTranslation();
  const isAdmin = user?.role === "admin";
  const canEdit = ["admin", "manager"].includes(user?.role);
  const isReadOnly = user?.role === "staff";

  const [products, setProducts] = useState([]);
  const [racks, setRacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [rackProduct, setRackProduct] = useState(null);
  const [barcodeProduct, setBarcodeProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [bulkSelected, setBulkSelected] = useState(new Set());
  const [bulkPrinting, setBulkPrinting] = useState(false);
  const [printMode, setPrintModeState] = useState(getPrintMode);
  const [showCSVModal, setShowCSVModal] = useState(false);

  const headers = useMemo(
    () => ({ Authorization: `Bearer ${token}` }),
    [token],
  );

  const handlePrintModeChange = (mode) => {
    setPrintMode(mode);
    setPrintModeState(mode);
  };

  const fetchAll = useCallback(async () => {
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
  }, [headers]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }, [products, search]);

  const stats = useMemo(
    () => ({
      lowStock: products.filter(
        (p) => p.stock_quantity <= p.low_stock_threshold,
      ).length,
      categories: new Set(products.map((p) => p.category)).size,
      totalValue: products.reduce(
        (s, p) => s + p.selling_price * p.stock_quantity,
        0,
      ),
    }),
    [products],
  );

  const handleSave = useCallback(
    async (data) => {
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
    },
    [editingProduct, headers, fetchAll],
  );

  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm("Delete this product?")) return;
      try {
        await axios.delete(`${API_URL}/products/${id}`, { headers });
        toast.success("Product deleted");
        fetchAll();
      } catch (err) {
        toast.error(err.response?.data?.detail || "Failed to delete");
      }
    },
    [headers, fetchAll],
  );

  const toggleBulkSelect = useCallback((id) => {
    setBulkSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }, []);

  const handleBulkPrint = useCallback(async () => {
    if (!bulkSelected.size) return;
    setBulkPrinting(true);
    try {
      const labels = products
        .filter((p) => bulkSelected.has(p.id))
        .map((p) => ({
          name: p.name,
          sku: p.barcode || p.sku,
          price: p.selling_price,
        }));
      await printLabels(labels, token);
      if (getPrintMode() === "thermal")
        toast.success(
          `${labels.length} label${labels.length > 1 ? "s" : ""} sent to printer!`,
        );
      setBulkSelected(new Set());
    } catch (err) {
      toast.error(err.message || "Failed to print labels");
    } finally {
      setBulkPrinting(false);
    }
  }, [bulkSelected, products, token]);

  const openEditModal = useCallback((product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  }, []);
  const closeProductModal = useCallback(() => {
    setShowProductModal(false);
    setEditingProduct(null);
  }, []);

  return (
    <div
      className="min-h-full bg-[#f7f6f3] p-4 md:p-6 lg:p-8"
      data-testid="inventory-page"
    >
      {/* Hero Header */}
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
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowCSVModal(true)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/15 text-stone-300 hover:text-white font-bold text-sm px-4 py-3 rounded-xl transition-all whitespace-nowrap"
            >
              <Upload size={15} /> Import CSV
            </button>
            <button
              onClick={() =>
                setBulkSelected(new Set(filtered.map((p) => p.id)))
              }
              className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/15 text-stone-300 hover:text-white font-bold text-sm px-4 py-3 rounded-xl transition-all whitespace-nowrap"
            >
              <Barcode size={15} /> Print Labels
            </button>
            {canEdit && (
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setShowProductModal(true);
                }}
                data-testid="add-product-button"
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-900 font-black text-sm px-5 py-3 rounded-xl transition-all shadow-lg shadow-amber-900/30 active:scale-95 whitespace-nowrap"
              >
                <Plus size={16} /> {t("inventory.addProduct")}
              </button>
            )}
          </div>
        </div>
        <div className="relative mt-5 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Total Products",
              value: products.length,
              color: "text-stone-300",
            },
            {
              label: "Categories",
              value: stats.categories,
              color: "text-blue-400",
            },
            {
              label: "Low Stock",
              value: stats.lowStock,
              color: stats.lowStock > 0 ? "text-amber-400" : "text-stone-500",
            },
            {
              label: "Inventory Value",
              value: `₹${stats.totalValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
              color: "text-emerald-400",
            },
          ].map((s) => (
            <div key={s.label}>
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
          data-testid="search-input"
          className="w-full h-11 bg-white border border-stone-200 rounded-xl pl-10 pr-4 text-sm text-stone-700 outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400/50 shadow-sm"
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

      {/* Bulk print bar */}
      <AnimatePresence>
        {bulkSelected.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#1c1c2e] border border-amber-500/30 rounded-2xl px-5 py-3.5 mb-4 flex items-center justify-between shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/15 rounded-xl">
                <Barcode size={15} className="text-amber-400" />
              </div>
              <div>
                <p className="text-white font-black text-sm">
                  {bulkSelected.size} product{bulkSelected.size > 1 ? "s" : ""}{" "}
                  selected
                </p>
                <p className="text-stone-500 text-[10px]">
                  Ready to print barcode labels
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setBulkSelected(new Set())}
                className="h-8 px-3 rounded-lg border border-white/10 text-stone-400 hover:text-white text-xs font-semibold transition-all"
              >
                Clear
              </button>
              <button
                onClick={() =>
                  setBulkSelected(new Set(filtered.map((p) => p.id)))
                }
                className="h-8 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-stone-300 hover:text-white text-xs font-semibold transition-all"
              >
                Select All ({filtered.length})
              </button>
              <button
                onClick={handleBulkPrint}
                disabled={bulkPrinting}
                className="flex items-center gap-2 h-8 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-900 font-black text-xs transition-all disabled:opacity-50"
              >
                {bulkPrinting ? (
                  <RefreshCw size={12} className="animate-spin" />
                ) : (
                  <Printer size={12} />
                )}
                Print {bulkSelected.size} Label
                {bulkSelected.size > 1 ? "s" : ""}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                      className={`border-t border-stone-100 hover:bg-amber-50/30 transition-colors ${i % 2 !== 0 ? "bg-stone-50/40" : ""}`}
                      data-testid={`product-row-${product.id}`}
                    >
                      <td className="px-5 py-3.5">
                        <div
                          className="flex items-center gap-3 cursor-pointer group/name"
                          onClick={() => setViewProduct(product)}
                        >
                          <img
                            src={
                              product.image_url ||
                              mockImages[i % mockImages.length]
                            }
                            alt={product.name}
                            className="w-11 h-11 object-cover rounded-xl border border-stone-100 flex-shrink-0 group-hover/name:ring-2 group-hover/name:ring-amber-400 transition-all"
                            onError={(e) => {
                              e.target.src = mockImages[i % mockImages.length];
                            }}
                          />
                          <div>
                            <p className="font-bold text-stone-800 text-sm leading-tight group-hover/name:text-amber-600 transition-colors">
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
                          className={`inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full ${product.stock_quantity === 0 ? "bg-rose-50 text-rose-600 border border-rose-200" : isLow ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}
                        >
                          {isLow && product.stock_quantity > 0 && (
                            <AlertTriangle size={10} />
                          )}
                          {product.stock_quantity} {t("inventory.units")}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => toggleBulkSelect(product.id)}
                            className={`p-2 rounded-xl transition-colors ${bulkSelected.has(product.id) ? "bg-amber-500/20 text-amber-500" : "hover:bg-stone-100 text-stone-300 hover:text-stone-500"}`}
                          >
                            {bulkSelected.has(product.id) ? (
                              <CheckCheck size={14} />
                            ) : (
                              <Check size={14} />
                            )}
                          </button>
                          <button
                            onClick={() => setBarcodeProduct(product)}
                            className="p-2 rounded-xl hover:bg-amber-50 text-stone-400 hover:text-amber-600 transition-colors"
                            title="View barcode"
                          >
                            <Barcode size={14} />
                          </button>
                          {canEdit && (
                            <button
                              onClick={() => openEditModal(product)}
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
                  className="bg-white border border-stone-100 rounded-2xl p-4 shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
                  onClick={() => setViewProduct(product)}
                  data-testid={`product-card-${product.id}`}
                >
                  <div className="flex gap-3">
                    <img
                      src={
                        product.image_url || mockImages[i % mockImages.length]
                      }
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-xl flex-shrink-0 border border-stone-100"
                      onError={(e) => {
                        e.target.src = mockImages[i % mockImages.length];
                      }}
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
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBulkSelect(product.id);
                            }}
                            className={`p-1.5 rounded-lg transition-colors ${bulkSelected.has(product.id) ? "bg-amber-500/20 text-amber-500" : "bg-stone-50 text-stone-300 hover:text-stone-500"}`}
                          >
                            <Check size={13} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setBarcodeProduct(product);
                            }}
                            className="p-1.5 rounded-lg bg-stone-50 text-stone-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                          >
                            <Barcode size={13} />
                          </button>
                          {canEdit && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(product);
                              }}
                              className="p-1.5 rounded-lg bg-stone-50 text-stone-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                            >
                              <Pencil size={13} />
                            </button>
                          )}
                          {canEdit && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setRackProduct(product);
                              }}
                              className="p-1.5 rounded-lg bg-stone-50 text-stone-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                              <MapPin size={13} />
                            </button>
                          )}
                          {isAdmin && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(product.id);
                              }}
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
            token={token}
            onClose={closeProductModal}
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
      <AnimatePresence>
        {barcodeProduct && (
          <BarcodeModal
            product={barcodeProduct}
            token={token}
            onClose={() => setBarcodeProduct(null)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showCSVModal && (
          <XLSXImportModal
            token={token}
            onClose={() => setShowCSVModal(false)}
            onImport={fetchAll}
          />
        )}
      </AnimatePresence>
      {/* <AnimatePresence>
        {viewProduct && (
          <ProductViewModal
            product={viewProduct}
            idx={filtered.findIndex((p) => p.id === viewProduct.id)}
            mockImages={mockImages}
            canEdit={canEdit}
            onClose={() => setViewProduct(null)}
            onEdit={(p) => {
              setViewProduct(null);
              openEditModal(p);
            }}
          />
        )}
      </AnimatePresence> */}
    </div>
  );
};

export default Inventory;
