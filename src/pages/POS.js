import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Scan,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Printer,
  Search,
  Package,
  CheckCircle2,
  X,
  Zap,
  ReceiptText,
  User,
  Phone,
  Building2,
  ChevronDown,
  ChevronUp,
  Tag,
  Banknote,
  CreditCard,
  Smartphone,
  Split,
  PauseCircle,
  PlayCircle,
  FileText,
  Percent,
  IndianRupee,
  AlertTriangle,
  ChevronRight,
  Hash,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Scanner } from "@yudiel/react-qr-scanner";

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

// ── Constants ──────────────────────────────────────────────────
const GST_RATES = [0, 5, 12, 18, 28];
const PAYMENT_MODES = ["cash", "card", "upi", "split"];
const PAYMENT_ICONS = {
  cash: Banknote,
  card: CreditCard,
  upi: Smartphone,
  split: Split,
};

const mockImages = [
  "https://images.unsplash.com/photo-1758789898279-82f8cc279444?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=400",
  "https://images.unsplash.com/photo-1765277114329-b3da8e70731e?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=400",
  "https://images.unsplash.com/photo-1765371512379-b6e10ffddc3f?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=400",
];

// ── Invoice HTML builders ──────────────────────────────────────

const buildNonGSTInvoice = (order, userName) => {
  if (!order) return "";
  const rows = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding:5px 3px;border-bottom:1px dashed #ddd;">${item.product_name}</td>
      <td style="padding:5px 3px;border-bottom:1px dashed #ddd;text-align:center;">${item.quantity}</td>
      <td style="padding:5px 3px;border-bottom:1px dashed #ddd;text-align:right;">₹${item.price.toFixed(2)}</td>
      <td style="padding:5px 3px;border-bottom:1px dashed #ddd;text-align:right;font-weight:700;">₹${item.total.toFixed(2)}</td>
    </tr>`,
    )
    .join("");
  const d = new Date(order.created_at);
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
  <style>*{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Courier New',monospace;font-size:12px;width:300px;margin:0 auto;padding:16px;}
  .center{text-align:center;}.bold{font-weight:700;}
  table{width:100%;border-collapse:collapse;}
  th{font-size:10px;font-weight:700;border-bottom:2px solid #000;padding:3px;}
  th:not(:first-child){text-align:right;}
  @media print{body{width:80mm;}@page{margin:0;size:80mm auto;}}</style></head>
  <body>
  <div class="center" style="padding-bottom:10px;border-bottom:2px dashed #000;margin-bottom:10px;">
    <div style="font-size:18px;font-weight:900;letter-spacing:2px;">MRB HOME DECOR</div>
    <div style="font-size:10px;color:#555;margin-top:2px;">Home Decor Mall</div>
    <div style="font-size:10px;margin-top:3px;font-weight:700;">RECEIPT (Non-Tax)</div>
  </div>
  <div style="margin-bottom:10px;line-height:1.9;font-size:11px;">
    <div style="display:flex;justify-content:space-between;"><b>Receipt#</b><span>${order.invoice_number}</span></div>
    <div style="display:flex;justify-content:space-between;"><b>Date</b><span>${d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span></div>
    <div style="display:flex;justify-content:space-between;"><b>Time</b><span>${d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span></div>
    <div style="display:flex;justify-content:space-between;"><b>Cashier</b><span>${userName || "Staff"}</span></div>
    ${order.customer_name ? `<div style="display:flex;justify-content:space-between;"><b>Customer</b><span>${order.customer_name}</span></div>` : ""}
    ${order.customer_phone ? `<div style="display:flex;justify-content:space-between;"><b>Phone</b><span>${order.customer_phone}</span></div>` : ""}
    <div style="display:flex;justify-content:space-between;"><b>Payment</b><span style="text-transform:uppercase;">${order.payment_mode || "CASH"}</span></div>
  </div>
  <div style="border-top:2px dashed #000;border-bottom:2px dashed #000;padding:8px 0;margin-bottom:8px;">
  <table><thead><tr><th style="text-align:left;">ITEM</th><th>QTY</th><th>RATE</th><th>AMT</th></tr></thead>
  <tbody>${rows}</tbody></table></div>
  <div style="line-height:2;font-size:12px;">
    <div style="display:flex;justify-content:space-between;"><span>Subtotal</span><span>₹${order.subtotal.toFixed(2)}</span></div>
    ${order.discount > 0 ? `<div style="display:flex;justify-content:space-between;"><span>Discount</span><span>-₹${order.discount.toFixed(2)}</span></div>` : ""}
    ${order.round_off && order.round_off !== 0 ? `<div style="display:flex;justify-content:space-between;font-size:10px;color:#666;"><span>Round Off</span><span>${order.round_off > 0 ? "+" : ""}₹${order.round_off.toFixed(2)}</span></div>` : ""}
    <div style="display:flex;justify-content:space-between;font-size:15px;font-weight:900;border-top:2px solid #000;padding-top:5px;margin-top:5px;">
      <span>TOTAL</span><span>₹${order.total.toFixed(2)}</span></div>
  </div>
  ${order.narration ? `<div style="margin-top:8px;font-size:10px;color:#666;font-style:italic;">${order.narration}</div>` : ""}
  <div style="text-align:center;margin-top:14px;font-size:10px;color:#666;border-top:2px dashed #000;padding-top:10px;">
    <strong style="font-size:12px;display:block;margin-bottom:2px;">Thank you!</strong>
    Please visit again · Items sold are non-refundable without receipt
  </div></body></html>`;
};

const buildGSTInvoice = (order, userName) => {
  if (!order) return "";
  const isIGST = order.gst_type === "igst";
  const rows = order.items
    .map((item) => {
      const gstRate = item.gst_rate || order.gst_rate || 18;
      const taxable = item.total / (1 + gstRate / 100);
      const gstAmt = item.total - taxable;
      const half = gstAmt / 2;
      return `<tr>
      <td style="padding:4px 3px;border-bottom:1px dashed #ddd;font-size:11px;">${item.product_name}</td>
      <td style="padding:4px 2px;border-bottom:1px dashed #ddd;text-align:center;">${item.quantity}</td>
      <td style="padding:4px 2px;border-bottom:1px dashed #ddd;text-align:right;">₹${(item.price / (1 + gstRate / 100)).toFixed(2)}</td>
      <td style="padding:4px 2px;border-bottom:1px dashed #ddd;text-align:center;">${gstRate}%</td>
      ${
        isIGST
          ? `<td style="padding:4px 2px;border-bottom:1px dashed #ddd;text-align:right;">₹${gstAmt.toFixed(2)}</td>`
          : `<td style="padding:4px 2px;border-bottom:1px dashed #ddd;text-align:right;">₹${half.toFixed(2)}</td>
           <td style="padding:4px 2px;border-bottom:1px dashed #ddd;text-align:right;">₹${half.toFixed(2)}</td>`
      }
      <td style="padding:4px 2px;border-bottom:1px dashed #ddd;text-align:right;font-weight:700;">₹${item.total.toFixed(2)}</td>
    </tr>`;
    })
    .join("");
  const d = new Date(order.created_at);
  const gstRate = order.gst_rate || 18;
  const taxableAmt = order.subtotal / (1 + gstRate / 100);
  const totalGST = order.tax || 0;
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
  <style>*{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Courier New',monospace;font-size:11px;width:320px;margin:0 auto;padding:14px;}
  table{width:100%;border-collapse:collapse;}
  th{font-size:9px;font-weight:700;border-top:2px solid #000;border-bottom:2px solid #000;padding:3px 2px;}
  th:not(:first-child){text-align:right;}
  @media print{body{width:80mm;}@page{margin:0;size:80mm auto;}}</style></head>
  <body>
  <div style="text-align:center;padding-bottom:10px;border-bottom:2px dashed #000;margin-bottom:10px;">
    <div style="font-size:17px;font-weight:900;letter-spacing:2px;">MRB HOME DECOR</div>
    <div style="font-size:10px;color:#555;">Home Decor Mall</div>
    <div style="font-size:11px;font-weight:900;margin-top:3px;">TAX INVOICE</div>
    <div style="font-size:9px;color:#777;margin-top:1px;">GSTIN: [YOUR-GSTIN-HERE]</div>
  </div>
  <div style="margin-bottom:10px;line-height:1.9;font-size:11px;">
    <div style="display:flex;justify-content:space-between;"><b>Invoice#</b><span>${order.invoice_number}</span></div>
    <div style="display:flex;justify-content:space-between;"><b>Date</b><span>${d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span></div>
    <div style="display:flex;justify-content:space-between;"><b>Time</b><span>${d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span></div>
    <div style="display:flex;justify-content:space-between;"><b>Cashier</b><span>${userName || "Staff"}</span></div>
    ${order.customer_name ? `<div style="display:flex;justify-content:space-between;"><b>Bill To</b><span>${order.customer_name}</span></div>` : ""}
    ${order.customer_phone ? `<div style="display:flex;justify-content:space-between;"><b>Phone</b><span>${order.customer_phone}</span></div>` : ""}
    ${order.customer_gstin ? `<div style="display:flex;justify-content:space-between;"><b>GSTIN</b><span>${order.customer_gstin}</span></div>` : ""}
    <div style="display:flex;justify-content:space-between;"><b>Payment</b><span style="text-transform:uppercase;">${order.payment_mode || "CASH"}</span></div>
  </div>
  <table>
    <thead><tr>
      <th style="text-align:left;width:35%;">ITEM</th>
      <th style="text-align:center;">QTY</th>
      <th style="text-align:right;">TAXABLE</th>
      <th style="text-align:center;">GST%</th>
      ${isIGST ? `<th style="text-align:right;">IGST</th>` : `<th style="text-align:right;">CGST</th><th style="text-align:right;">SGST</th>`}
      <th style="text-align:right;">AMT</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div style="margin-top:8px;line-height:2;font-size:11px;">
    <div style="display:flex;justify-content:space-between;"><span>Taxable Value</span><span>₹${taxableAmt.toFixed(2)}</span></div>
    ${
      isIGST
        ? `<div style="display:flex;justify-content:space-between;"><span>IGST (${gstRate}%)</span><span>₹${totalGST.toFixed(2)}</span></div>`
        : `<div style="display:flex;justify-content:space-between;"><span>CGST (${gstRate / 2}%)</span><span>₹${(totalGST / 2).toFixed(2)}</span></div>
         <div style="display:flex;justify-content:space-between;"><span>SGST (${gstRate / 2}%)</span><span>₹${(totalGST / 2).toFixed(2)}</span></div>`
    }
    ${order.discount > 0 ? `<div style="display:flex;justify-content:space-between;"><span>Discount</span><span>-₹${order.discount.toFixed(2)}</span></div>` : ""}
    ${order.round_off && order.round_off !== 0 ? `<div style="display:flex;justify-content:space-between;font-size:10px;color:#666;"><span>Round Off</span><span>${order.round_off > 0 ? "+" : ""}₹${order.round_off.toFixed(2)}</span></div>` : ""}
    <div style="display:flex;justify-content:space-between;font-size:15px;font-weight:900;border-top:2px solid #000;padding-top:5px;margin-top:5px;">
      <span>TOTAL</span><span>₹${order.total.toFixed(2)}</span></div>
    <div style="text-align:right;font-size:10px;font-style:italic;color:#555;margin-top:2px;">Amount in words: [auto-fill]</div>
  </div>
  ${order.narration ? `<div style="margin-top:8px;font-size:10px;color:#555;font-style:italic;">Note: ${order.narration}</div>` : ""}
  <div style="text-align:center;margin-top:12px;font-size:10px;color:#666;border-top:2px dashed #000;padding-top:10px;">
    This is a computer generated invoice · Thank you for your purchase!
  </div></body></html>`;
};

const printInvoice = (order, userName) => {
  const html = order?.gst_type
    ? buildGSTInvoice(order, userName)
    : buildNonGSTInvoice(order, userName);
  if (!html) return;
  const win = window.open("", "_blank", "width=420,height=700,scrollbars=yes");
  if (!win) {
    toast.error("Pop-up blocked! Please allow pop-ups.");
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.onload = () => {
    win.focus();
    win.print();
    setTimeout(() => win.close(), 600);
  };
};

// ── Barcode flash ──────────────────────────────────────────────
const BarcodeFlash = ({ show, productName }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-semibold pointer-events-none"
      >
        <Zap size={15} className="fill-white" />
        <span className="text-sm">Scanned: {productName}</span>
        <CheckCircle2 size={15} />
      </motion.div>
    )}
  </AnimatePresence>
);

// ── Payment mode button ────────────────────────────────────────
const PayBtn = ({ mode, active, onClick, t }) => {
  const Icon = PAYMENT_ICONS[mode];
  return (
    <button
      onClick={() => onClick(mode)}
      className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl border-2 transition-all text-xs font-semibold ${
        active
          ? "border-amber-500 bg-amber-50 text-amber-700"
          : "border-stone-200 text-stone-500 hover:border-stone-300"
      }`}
    >
      <Icon size={16} />
      <span>{t(`pos.pay.${mode}`)}</span>
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN POS
// ═══════════════════════════════════════════════════════════════
const POS = () => {
  const { token, user } = useAuth();
  const { t } = useTranslation();

  // ── Products & search ────────────────────────────────────────
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const searchRef = useRef(null);

  // ── Cart ─────────────────────────────────────────────────────
  const [cart, setCart] = useState([]);
  const [heldOrders, setHeldOrders] = useState([]); // [{id, cart, label}]

  // ── Invoice settings ─────────────────────────────────────────
  const [invoiceType, setInvoiceType] = useState("non_gst"); // "non_gst" | "gst"
  const [gstRate, setGstRate] = useState(18);
  const [gstType, setGstType] = useState("cgst_sgst"); // "cgst_sgst" | "igst"
  const [discountMode, setDiscountMode] = useState("percent"); // "percent" | "flat"
  const [discountVal, setDiscountVal] = useState(0);
  const [paymentMode, setPaymentMode] = useState("cash");
  const [splitCash, setSplitCash] = useState(0);
  const [splitCard, setSplitCard] = useState(0);

  // ── Customer ─────────────────────────────────────────────────
  const [showCustomer, setShowCustomer] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerGSTIN, setCustomerGSTIN] = useState("");
  const [narration, setNarration] = useState("");
  const [referredByStaffId, setReferredByStaffId] = useState("");
  const [staffList, setStaffList] = useState([]);

  // ── UI states ────────────────────────────────────────────────
  const [showScanner, setShowScanner] = useState(false);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [showHoldPanel, setShowHoldPanel] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [flashProduct, setFlashProduct] = useState(null);
  const [barcodeBuffer, setBarcodeBuffer] = useState("");
  const barcodeTimer = useRef(null);
  const lastKeyTime = useRef(0);

  // ── Fetch products + staff ───────────────────────────────────
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const [prodRes, staffRes] = await Promise.allSettled([
        axios.get(`${API_URL}/products`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      if (prodRes.status === "fulfilled") setProducts(prodRes.value.data);
      else toast.error(t("pos.fetchFailed"));
      if (staffRes.status === "fulfilled") {
        const all = Array.isArray(staffRes.value.data)
          ? staffRes.value.data
          : [];
        setStaffList(
          all.filter((u) => ["staff", "billing", "manager"].includes(u.role)),
        );
      }
    } catch {
      toast.error(t("pos.fetchFailed"));
    }
  };

  // ── Categories ────────────────────────────────────────────────
  const categories = useMemo(() => {
    const cats = [
      ...new Set(products.map((p) => p.category).filter(Boolean)),
    ].sort();
    return ["all", ...cats];
  }, [products]);

  // ── External barcode ─────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      const isInput = tag === "input" || tag === "textarea";
      const now = Date.now();
      const gap = now - lastKeyTime.current;
      lastKeyTime.current = now;
      if (e.key === "Enter") {
        const buf = barcodeBuffer.trim();
        if (buf.length >= 4) {
          e.preventDefault();
          processBarcode(buf);
          setBarcodeBuffer("");
        }
        return;
      }
      if (isInput && gap > 80) return;
      if (e.key.length === 1) {
        setBarcodeBuffer((prev) => (gap > 500 ? e.key : prev + e.key));
        if (barcodeTimer.current) clearTimeout(barcodeTimer.current);
        barcodeTimer.current = setTimeout(() => setBarcodeBuffer(""), 2000);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (barcodeTimer.current) clearTimeout(barcodeTimer.current);
    };
  }, [barcodeBuffer]);

  const processBarcode = useCallback(
    async (code) => {
      try {
        const res = await axios.get(`${API_URL}/products/barcode/${code}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        addToCartDirect(res.data);
        setFlashProduct(res.data.name);
        setTimeout(() => setFlashProduct(null), 2000);
      } catch {
        toast.error(`${t("pos.barcodeNotFound")}: ${code}`);
      }
    },
    [token],
  );

  // ── Cart helpers ──────────────────────────────────────────────
  const addToCartDirect = (product) => {
    setCart((prev) => {
      const ex = prev.find((i) => i.id === product.id);
      if (ex) {
        if (ex.quantity >= product.stock_quantity) {
          toast.error(t("pos.notEnoughStock"));
          return prev;
        }
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      if (product.stock_quantity === 0) {
        toast.error(t("pos.outOfStock"));
        return prev;
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id !== id) return item;
          const nq = item.quantity + delta;
          if (nq <= 0) return null;
          if (nq > item.stock_quantity) {
            toast.error(t("pos.notEnoughStock"));
            return item;
          }
          return { ...item, quantity: nq };
        })
        .filter(Boolean),
    );
  };

  const setQuantityDirect = (id, val) => {
    const n = parseInt(val) || 1;
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id !== id) return item;
          if (n > item.stock_quantity) {
            toast.error(t("pos.notEnoughStock"));
            return item;
          }
          if (n <= 0) return null;
          return { ...item, quantity: n };
        })
        .filter(Boolean),
    );
  };

  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((i) => i.id !== id));
  const clearCart = () => {
    setCart([]);
    setDiscountVal(0);
    setCustomerName("");
    setCustomerPhone("");
    setCustomerGSTIN("");
    setNarration("");
    setReferredByStaffId("");
    setPaymentMode("cash");
  };

  // ── Hold/Resume ───────────────────────────────────────────────
  const holdCart = () => {
    if (cart.length === 0) return;
    const label = customerName || `Hold ${heldOrders.length + 1}`;
    setHeldOrders((prev) => [
      ...prev,
      { id: Date.now(), cart: [...cart], label },
    ]);
    clearCart();
    toast.success(t("pos.orderHeld"));
  };

  const resumeHeld = (held) => {
    if (cart.length > 0) {
      toast.error(t("pos.clearCartFirst"));
      return;
    }
    setCart(held.cart);
    setHeldOrders((prev) => prev.filter((h) => h.id !== held.id));
    setShowHoldPanel(false);
  };

  // ── Calculations ──────────────────────────────────────────────
  const subtotal = cart.reduce((s, i) => s + i.selling_price * i.quantity, 0);
  const discountAmount =
    discountMode === "percent"
      ? (subtotal * discountVal) / 100
      : Math.min(discountVal, subtotal);
  const afterDiscount = subtotal - discountAmount;
  const taxAmount = invoiceType === "gst" ? (afterDiscount * gstRate) / 100 : 0;
  const preRound = afterDiscount + taxAmount;
  const roundedTotal = Math.round(preRound);
  const roundOff = roundedTotal - preRound;
  const total = roundedTotal;

  // Split payment validation
  const splitTotal = parseFloat(splitCash || 0) + parseFloat(splitCard || 0);
  const splitValid =
    paymentMode !== "split" || Math.abs(splitTotal - total) < 0.01;

  // ── Checkout ──────────────────────────────────────────────────
  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error(t("pos.cartEmpty"));
      return;
    }
    if (!splitValid) {
      toast.error(t("pos.splitMismatch"));
      return;
    }
    setCheckingOut(true);
    try {
      const payload = {
        items: cart.map((i) => ({
          product_id: i.id,
          product_name: i.name,
          quantity: i.quantity,
          price: i.selling_price,
          total: i.selling_price * i.quantity,
          gst_rate: invoiceType === "gst" ? gstRate : 0,
        })),
        subtotal,
        tax: taxAmount,
        discount: discountAmount,
        total,
        round_off: roundOff,
        payment_mode: paymentMode,
        gst_type: invoiceType === "gst" ? gstType : null,
        gst_rate: invoiceType === "gst" ? gstRate : null,
        customer_name: customerName || null,
        customer_phone: customerPhone || null,
        customer_gstin: customerGSTIN || null,
        narration: narration || null,
        salesman_id: user?.id,
        referred_by_staff_id: referredByStaffId || null,
        invoice_type: invoiceType,
      };
      const res = await axios.post(`${API_URL}/orders`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Attach metadata for print
      res.data.gst_type = invoiceType === "gst" ? gstType : null;
      res.data.gst_rate = gstRate;
      res.data.customer_name = customerName;
      res.data.customer_phone = customerPhone;
      res.data.customer_gstin = customerGSTIN;
      res.data.payment_mode = paymentMode;
      res.data.narration = narration;
      res.data.round_off = roundOff;
      setLastOrder(res.data);
      clearCart();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3500);
      fetchProducts();
    } catch {
      toast.error(t("pos.checkoutFailed"));
    } finally {
      setCheckingOut(false);
    }
  };

  // ── Camera scan ───────────────────────────────────────────────
  const handleCameraScan = async (result) => {
    if (result?.[0]?.rawValue) {
      const code = result[0].rawValue;
      try {
        const res = await axios.get(`${API_URL}/products/barcode/${code}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        addToCartDirect(res.data);
        setShowScanner(false);
        toast.success(`${t("pos.added")}: ${res.data.name}`);
      } catch {
        toast.error(t("pos.productNotFound"));
      }
    }
  };

  // ── Filtered products ─────────────────────────────────────────
  const filteredProducts = useMemo(
    () =>
      products.filter((p) => {
        const matchSearch =
          !searchQuery ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchCat =
          activeCategory === "all" || p.category === activeCategory;
        return matchSearch && matchCat;
      }),
    [products, searchQuery, activeCategory],
  );

  const cartItemCount = cart.reduce((s, i) => s + i.quantity, 0);

  // ──────────────────────────────────────────────────────────────
  return (
    <div
      className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-4rem)]"
      data-testid="pos-page"
    >
      <BarcodeFlash show={!!flashProduct} productName={flashProduct} />

      {/* ── Order success overlay ── */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.7 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center gap-4 pointer-events-none"
            >
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle2 size={44} className="text-emerald-500" />
              </div>
              <p className="text-2xl font-bold text-stone-800">
                {t("pos.orderComplete")}
              </p>
              <p className="text-stone-400 text-sm">
                {t("pos.invoice")} #{lastOrder?.invoice_number}
              </p>
              <p className="text-3xl font-mono font-bold text-emerald-600">
                ₹{lastOrder?.total?.toFixed(2)}
              </p>
              <p className="text-xs text-stone-400 capitalize">
                {lastOrder?.payment_mode}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ LEFT: Product Grid ═══════════ */}
      <div className="w-full lg:w-[62%] flex flex-col overflow-hidden bg-[#FAFAFA]">
        {/* Header */}
        <div className="px-4 md:px-6 pt-5 pb-3 bg-white border-b border-stone-100">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-stone-800">
                {t("pos.title")}
              </h1>
              <p className="text-xs text-stone-400 mt-0.5 flex items-center gap-1">
                <Zap size={10} className="text-emerald-500" />
                {t("pos.scannerReady")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {heldOrders.length > 0 && (
                <button
                  onClick={() => setShowHoldPanel(true)}
                  className="relative flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl hover:bg-amber-100 transition-colors"
                >
                  <PauseCircle size={15} />
                  {t("pos.held")}
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {heldOrders.length}
                  </span>
                </button>
              )}
              <button
                onClick={() => setShowScanner(true)}
                className="flex items-center gap-2 text-sm font-semibold bg-stone-800 text-white px-4 py-2 rounded-xl hover:bg-stone-700 transition-colors"
              >
                <Scan size={16} />
                {t("pos.scanBarcode")}
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              ref={searchRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("pos.searchPlaceholder")}
              className="w-full pl-9 pr-9 h-10 rounded-xl border border-stone-200 bg-stone-50 text-sm outline-none focus:ring-2 focus:ring-stone-200 focus:border-stone-300 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Category tabs */}
        <div className="px-4 md:px-6 py-2 bg-white border-b border-stone-100 overflow-x-auto flex gap-1.5 scrollbar-hide shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                activeCategory === cat
                  ? "bg-stone-800 text-white"
                  : "bg-stone-100 text-stone-500 hover:bg-stone-200"
              }`}
            >
              {cat === "all" ? t("pos.allProducts") : cat}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Package size={44} className="text-stone-200 mb-4" />
              <p className="text-stone-400 font-medium text-sm">
                {t("pos.noProducts")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredProducts.map((product, index) => {
                const inCart = cart.find((i) => i.id === product.id);
                const isLow =
                  product.stock_quantity > 0 &&
                  product.stock_quantity <= product.low_stock_threshold;
                const isOut = product.stock_quantity === 0;
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.01 }}
                    onClick={() => !isOut && addToCartDirect(product)}
                    className={`group relative bg-white border-2 rounded-2xl overflow-hidden cursor-pointer active:scale-95 transition-all ${
                      isOut
                        ? "border-stone-100 opacity-40 cursor-not-allowed"
                        : inCart
                          ? "border-stone-800 shadow-md shadow-stone-200"
                          : "border-stone-200 hover:border-stone-400 hover:shadow-md"
                    }`}
                  >
                    {/* Qty badge */}
                    {inCart && (
                      <div className="absolute top-2 left-2 z-10 bg-stone-800 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow">
                        {inCart.quantity}
                      </div>
                    )}
                    {/* Low stock badge */}
                    {isLow && (
                      <div className="absolute top-2 right-2 z-10 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        {t("pos.low")}
                      </div>
                    )}
                    {/* Image */}
                    <div className="aspect-square overflow-hidden bg-stone-50">
                      <img
                        src={
                          product.image_url ||
                          mockImages[index % mockImages.length]
                        }
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {isOut && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                          <span className="text-xs font-bold text-stone-500 bg-white px-3 py-1 rounded-full border border-stone-200">
                            {t("pos.outOfStock")}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="p-2.5">
                      <p className="font-semibold text-xs text-stone-800 line-clamp-2 min-h-[2rem] leading-snug">
                        {product.name}
                      </p>
                      <p className="text-[10px] text-stone-400 mt-0.5 truncate">
                        {product.category}
                      </p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="font-mono font-bold text-stone-800 text-sm">
                          ₹{product.selling_price}
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                            isOut
                              ? "bg-red-100 text-red-600"
                              : isLow
                                ? "bg-amber-100 text-amber-600"
                                : "bg-stone-100 text-stone-500"
                          }`}
                        >
                          {product.stock_quantity}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ═══════════ RIGHT: Cart + Billing Panel ═══════════ */}
      <div className="w-full lg:w-[38%] bg-stone-900 flex flex-col text-white shadow-2xl max-h-[75vh] lg:max-h-none">
        {/* Cart header */}
        <div className="flex items-center gap-2 px-5 py-4 border-b border-stone-700 shrink-0">
          <ShoppingCart size={18} className="text-amber-400" />
          <h2 className="text-base font-bold text-white">{t("pos.cart")}</h2>
          <span className="ml-auto text-xs font-mono text-stone-400 bg-stone-800 px-2.5 py-1 rounded-full">
            {cartItemCount} {t("pos.items")}
          </span>
          {cart.length > 0 && (
            <>
              <button
                onClick={holdCart}
                title={t("pos.holdOrder")}
                className="p-1.5 text-stone-400 hover:text-amber-400 hover:bg-stone-800 rounded-lg transition-colors"
              >
                <PauseCircle size={15} />
              </button>
              <button
                onClick={clearCart}
                title={t("pos.clearCart")}
                className="p-1.5 text-stone-400 hover:text-rose-400 hover:bg-stone-800 rounded-lg transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </>
          )}
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-4 py-3 min-h-0">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <div className="p-4 bg-stone-800 rounded-2xl mb-3">
                <ShoppingCart className="text-stone-600" size={36} />
              </div>
              <p className="text-stone-500 font-medium text-sm">
                {t("pos.cartEmpty")}
              </p>
              <p className="text-xs text-stone-600 mt-1">
                {t("pos.addProducts")}
              </p>
              <p className="text-xs text-stone-700 mt-3 flex items-center gap-1">
                <Zap size={10} className="text-emerald-500" />
                {t("pos.scanHint")}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="flex items-center gap-2.5 p-2.5 bg-stone-800 rounded-xl border border-stone-700 hover:border-stone-600 transition-all"
                  >
                    <img
                      src={
                        item.image_url ||
                        mockImages[
                          products.findIndex((p) => p.id === item.id) %
                            mockImages.length
                        ]
                      }
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded-lg shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-stone-200 truncate">
                        {item.name}
                      </p>
                      <p className="text-[10px] font-mono text-stone-500 mt-0.5">
                        ₹{item.selling_price} {t("pos.each")}
                      </p>
                      {/* Qty controls */}
                      <div className="flex items-center gap-1 mt-1.5">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-5 h-5 rounded-full bg-stone-700 hover:bg-stone-600 flex items-center justify-center transition-colors"
                        >
                          <Minus size={9} />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          min={1}
                          max={item.stock_quantity}
                          onChange={(e) =>
                            setQuantityDirect(item.id, e.target.value)
                          }
                          className="w-8 h-5 text-center text-xs font-mono font-bold bg-transparent text-stone-200 outline-none border-b border-stone-600"
                        />
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-5 h-5 rounded-full bg-stone-700 hover:bg-amber-500 flex items-center justify-center transition-colors"
                        >
                          <Plus size={9} />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="font-mono font-bold text-amber-400 text-sm">
                        ₹{(item.selling_price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-0.5 text-stone-600 hover:text-rose-400 transition-colors"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* ─── Billing Panel (bottom, fixed) ─── */}
        <div className="border-t border-stone-700 px-4 pt-3 pb-4 space-y-3 shrink-0 bg-stone-900">
          {/* Invoice type toggle */}
          <div className="flex items-center gap-1 bg-stone-800 p-1 rounded-xl">
            <button
              onClick={() => setInvoiceType("non_gst")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                invoiceType === "non_gst"
                  ? "bg-white text-stone-800 shadow"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <ReceiptText size={13} />
              {t("pos.nonGST")}
            </button>
            <button
              onClick={() => setInvoiceType("gst")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                invoiceType === "gst"
                  ? "bg-emerald-500 text-white shadow"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <FileText size={13} />
              {t("pos.gstInvoice")}
            </button>
          </div>

          {/* GST settings (only when GST selected) */}
          {invoiceType === "gst" && (
            <div className="bg-stone-800 rounded-xl p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wide">
                  {t("pos.gstRate")}
                </span>
                <div className="flex gap-1">
                  {GST_RATES.map((r) => (
                    <button
                      key={r}
                      onClick={() => setGstRate(r)}
                      className={`w-7 h-6 text-[10px] font-bold rounded transition-all ${
                        gstRate === r
                          ? "bg-emerald-500 text-white"
                          : "bg-stone-700 text-stone-400 hover:bg-stone-600"
                      }`}
                    >
                      {r}%
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wide">
                  {t("pos.gstType")}
                </span>
                <div className="flex gap-1">
                  {["cgst_sgst", "igst"].map((gt) => (
                    <button
                      key={gt}
                      onClick={() => setGstType(gt)}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all ${
                        gstType === gt
                          ? "bg-emerald-500 text-white"
                          : "bg-stone-700 text-stone-400 hover:bg-stone-600"
                      }`}
                    >
                      {gt === "cgst_sgst" ? "CGST+SGST" : "IGST"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Discount row */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400 font-medium shrink-0">
              {t("pos.discount")}
            </span>
            <button
              onClick={() =>
                setDiscountMode((m) => (m === "percent" ? "flat" : "percent"))
              }
              className="flex items-center gap-1 text-[10px] font-bold text-stone-400 bg-stone-800 border border-stone-700 px-2 py-1.5 rounded-lg hover:border-stone-500 transition-colors shrink-0"
            >
              {discountMode === "percent" ? (
                <>
                  <Percent size={10} /> %
                </>
              ) : (
                <>
                  <IndianRupee size={10} /> ₹
                </>
              )}
            </button>
            <div className="relative flex-1">
              <input
                type="number"
                min={0}
                value={discountVal}
                onChange={(e) =>
                  setDiscountVal(parseFloat(e.target.value) || 0)
                }
                className="w-full h-8 bg-stone-800 border border-stone-700 rounded-lg px-3 pr-7 text-sm font-mono text-stone-200 outline-none focus:border-amber-500 transition-colors"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 text-xs">
                {discountMode === "percent" ? "%" : "₹"}
              </span>
            </div>
          </div>

          {/* Payment mode */}
          <div>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wide mb-1.5">
              {t("pos.paymentMode")}
            </p>
            <div className="flex gap-1.5">
              {PAYMENT_MODES.map((m) => (
                <PayBtn
                  key={m}
                  mode={m}
                  active={paymentMode === m}
                  onClick={setPaymentMode}
                  t={t}
                />
              ))}
            </div>
            {paymentMode === "split" && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <label className="text-[10px] text-stone-400 mb-0.5 block">
                    {t("pos.pay.cash")} (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={splitCash}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value) || 0;
                      setSplitCash(v);
                      setSplitCard(Math.max(0, total - v));
                    }}
                    className="w-full h-8 bg-stone-800 border border-stone-700 rounded-lg px-2 text-xs font-mono text-stone-200 outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-stone-400 mb-0.5 block">
                    {t("pos.pay.card")} (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={splitCard}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value) || 0;
                      setSplitCard(v);
                      setSplitCash(Math.max(0, total - v));
                    }}
                    className="w-full h-8 bg-stone-800 border border-stone-700 rounded-lg px-2 text-xs font-mono text-stone-200 outline-none focus:border-amber-500"
                  />
                </div>
                {!splitValid && (
                  <p className="col-span-2 text-[10px] text-rose-400 flex items-center gap-1">
                    <AlertTriangle size={10} />
                    {t("pos.splitMismatch")}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Customer (collapsible) */}
          <div className="bg-stone-800 rounded-xl overflow-hidden">
            <button
              onClick={() => setShowCustomer((v) => !v)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold text-stone-300 hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <User
                  size={13}
                  className={customerName ? "text-amber-400" : "text-stone-500"}
                />
                {customerName || t("pos.customerDetails")}
                {customerName && (
                  <span className="text-[9px] text-amber-400 font-normal">
                    {customerPhone}
                  </span>
                )}
              </span>
              {showCustomer ? (
                <ChevronUp size={13} />
              ) : (
                <ChevronDown size={13} />
              )}
            </button>
            {showCustomer && (
              <div className="px-3 pb-3 space-y-2 border-t border-stone-700">
                <input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={t("pos.customerName")}
                  className="w-full h-8 mt-2 bg-stone-700 border border-stone-600 rounded-lg px-3 text-xs text-stone-200 outline-none focus:border-amber-500 placeholder-stone-500"
                />
                <input
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder={t("pos.customerPhone")}
                  type="tel"
                  className="w-full h-8 bg-stone-700 border border-stone-600 rounded-lg px-3 text-xs text-stone-200 outline-none focus:border-amber-500 placeholder-stone-500"
                />
                {invoiceType === "gst" && (
                  <input
                    value={customerGSTIN}
                    onChange={(e) =>
                      setCustomerGSTIN(e.target.value.toUpperCase())
                    }
                    placeholder={t("pos.customerGSTIN")}
                    className="w-full h-8 bg-stone-700 border border-stone-600 rounded-lg px-3 text-xs font-mono text-stone-200 outline-none focus:border-emerald-500 placeholder-stone-500"
                  />
                )}
                <input
                  value={narration}
                  onChange={(e) => setNarration(e.target.value)}
                  placeholder={t("pos.narration")}
                  className="w-full h-8 bg-stone-700 border border-stone-600 rounded-lg px-3 text-xs text-stone-200 outline-none focus:border-amber-500 placeholder-stone-500"
                />
                {/* Referred by Staff — for commission tracking */}
                <div>
                  <p className="text-[9px] text-stone-500 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span>🏆</span> Referred by Staff (for commission)
                  </p>
                  <select
                    value={referredByStaffId}
                    onChange={(e) => setReferredByStaffId(e.target.value)}
                    className="w-full h-8 bg-stone-700 border border-stone-600 rounded-lg px-2 text-xs text-stone-200 outline-none focus:border-amber-500"
                  >
                    <option value="">— No referral —</option>
                    {staffList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.role})
                      </option>
                    ))}
                  </select>
                  {referredByStaffId && (
                    <p className="text-[9px] text-amber-400 mt-1 flex items-center gap-1">
                      ✓ Commission will be credited to{" "}
                      {staffList.find((s) => s.id === referredByStaffId)?.name}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Totals */}
          <div className="bg-stone-800 rounded-xl px-3 py-3 space-y-1.5">
            <div className="flex justify-between text-xs text-stone-400">
              <span>{t("pos.subtotal")}</span>
              <span className="font-mono text-stone-300">
                ₹{subtotal.toFixed(2)}
              </span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-xs text-stone-400">
                <span>
                  {t("pos.discount")}
                  {discountMode === "percent" ? ` (${discountVal}%)` : ""}
                </span>
                <span className="font-mono text-emerald-400">
                  -₹{discountAmount.toFixed(2)}
                </span>
              </div>
            )}
            {invoiceType === "gst" && (
              <>
                {gstType === "cgst_sgst" ? (
                  <>
                    <div className="flex justify-between text-xs text-stone-400">
                      <span>CGST ({gstRate / 2}%)</span>
                      <span className="font-mono text-stone-300">
                        +₹{(taxAmount / 2).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-stone-400">
                      <span>SGST ({gstRate / 2}%)</span>
                      <span className="font-mono text-stone-300">
                        +₹{(taxAmount / 2).toFixed(2)}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between text-xs text-stone-400">
                    <span>IGST ({gstRate}%)</span>
                    <span className="font-mono text-stone-300">
                      +₹{taxAmount.toFixed(2)}
                    </span>
                  </div>
                )}
              </>
            )}
            {Math.abs(roundOff) >= 0.01 && (
              <div className="flex justify-between text-[10px] text-stone-500">
                <span>{t("pos.roundOff")}</span>
                <span className="font-mono">
                  {roundOff > 0 ? "+" : ""}₹{roundOff.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between font-bold border-t border-stone-700 pt-2 mt-1">
              <span className="text-sm text-white">{t("pos.total")}</span>
              <span className="font-mono text-xl text-amber-400">
                ₹{total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Checkout button */}
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || checkingOut || !splitValid}
            className="w-full h-12 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-amber-900/30 active:scale-[0.98]"
          >
            {checkingOut ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                {t("pos.pleaseWait")}
              </>
            ) : (
              <>
                <ReceiptText size={18} />
                {t("pos.checkout")} — ₹{total.toFixed(2)}
              </>
            )}
          </button>

          {/* Print last invoice */}
          {lastOrder && (
            <button
              onClick={() => setShowPrintDialog(true)}
              className="w-full h-9 rounded-xl border border-stone-700 text-stone-400 hover:border-stone-500 hover:text-stone-200 transition-all flex items-center justify-center gap-2 text-xs font-medium"
            >
              <Printer size={14} />
              {t("pos.printInvoice")} — #{lastOrder.invoice_number}
            </button>
          )}
        </div>
      </div>

      {/* ── Camera Scanner Dialog ── */}
      <Dialog open={showScanner} onOpenChange={setShowScanner}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Scan size={18} />
              {t("pos.scanBarcode")}
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs text-stone-500 text-center -mt-2 mb-1">
            {t("pos.scanHint")}
          </p>
          <div className="aspect-square overflow-hidden rounded-2xl border-2 border-stone-200">
            <Scanner
              onScan={handleCameraScan}
              constraints={{ facingMode: "environment" }}
              formats={[
                "qr_code",
                "code_128",
                "code_39",
                "ean_13",
                "ean_8",
                "upc_a",
                "upc_e",
              ]}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowScanner(false)}
            className="w-full rounded-xl mt-2"
          >
            {t("common.cancel")}
          </Button>
        </DialogContent>
      </Dialog>

      {/* ── Print Preview Dialog ── */}
      <Dialog open={showPrintDialog} onOpenChange={setShowPrintDialog}>
        <DialogContent className="max-w-sm max-h-[88vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Printer size={18} />
              {t("pos.invoicePreview")}
            </DialogTitle>
          </DialogHeader>
          {lastOrder && (
            <div className="border border-stone-200 rounded-xl overflow-hidden bg-white text-xs font-mono p-5 space-y-2">
              <div className="text-center border-b border-dashed pb-3 mb-3">
                <p className="text-lg font-black tracking-widest">
                  MRB HOME DECOR
                </p>
                <p className="text-[10px] text-stone-500">Home Decor Mall</p>
                <p className="text-xs font-bold mt-1">
                  {lastOrder.gst_type ? "TAX INVOICE" : "RECEIPT (Non-Tax)"}
                </p>
              </div>
              <div className="space-y-1 text-[11px]">
                {[
                  ["Invoice#", lastOrder.invoice_number],
                  [
                    "Date",
                    new Date(lastOrder.created_at).toLocaleDateString("en-IN"),
                  ],
                  ["Cashier", user?.name || "Staff"],
                  ...(lastOrder.customer_name
                    ? [["Bill To", lastOrder.customer_name]]
                    : []),
                  ...(lastOrder.customer_phone
                    ? [["Phone", lastOrder.customer_phone]]
                    : []),
                  ...(lastOrder.customer_gstin
                    ? [["GSTIN", lastOrder.customer_gstin]]
                    : []),
                  ["Payment", (lastOrder.payment_mode || "cash").toUpperCase()],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <b>{k}</b>
                    <span>{v}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-b border-dashed py-2 my-2 space-y-1">
                {lastOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-[11px]">
                    <span className="flex-1 pr-2">
                      {item.product_name} × {item.quantity}
                    </span>
                    <span className="font-bold">₹{item.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{lastOrder.subtotal.toFixed(2)}</span>
                </div>
                {lastOrder.tax > 0 && (
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>+₹{lastOrder.tax.toFixed(2)}</span>
                  </div>
                )}
                {lastOrder.discount > 0 && (
                  <div className="flex justify-between">
                    <span>Discount</span>
                    <span className="text-emerald-600">
                      -₹{lastOrder.discount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-black border-t border-stone-300 pt-1.5 mt-1.5 text-sm">
                  <span>TOTAL</span>
                  <span>₹{lastOrder.total.toFixed(2)}</span>
                </div>
              </div>
              <p className="text-center text-[10px] text-stone-400 border-t border-dashed pt-2 mt-2">
                Thank you for your purchase!
              </p>
            </div>
          )}
          <div className="flex gap-3 mt-2">
            <Button
              variant="outline"
              onClick={() => setShowPrintDialog(false)}
              className="flex-1 rounded-xl"
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={() => {
                setShowPrintDialog(false);
                setTimeout(() => printInvoice(lastOrder, user?.name), 100);
              }}
              className="flex-1 rounded-xl gap-2 bg-stone-800"
            >
              <Printer size={15} />
              {t("pos.print")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Held Orders Panel ── */}
      <Dialog open={showHoldPanel} onOpenChange={setShowHoldPanel}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PauseCircle size={18} />
              {t("pos.heldOrders")}
            </DialogTitle>
          </DialogHeader>
          {heldOrders.length === 0 ? (
            <div className="text-center py-8 text-stone-400 text-sm">
              {t("pos.noHeldOrders")}
            </div>
          ) : (
            <div className="space-y-2">
              {heldOrders.map((held) => (
                <div
                  key={held.id}
                  className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200"
                >
                  <div>
                    <p className="text-sm font-semibold text-stone-800">
                      {held.label}
                    </p>
                    <p className="text-xs text-stone-400">
                      {held.cart.reduce((s, i) => s + i.quantity, 0)}{" "}
                      {t("pos.items")} · ₹
                      {held.cart
                        .reduce((s, i) => s + i.selling_price * i.quantity, 0)
                        .toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setHeldOrders((prev) =>
                          prev.filter((h) => h.id !== held.id),
                        )
                      }
                      className="p-1.5 text-stone-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                    <button
                      onClick={() => resumeHeld(held)}
                      className="flex items-center gap-1.5 text-xs font-semibold bg-stone-800 text-white px-3 py-1.5 rounded-lg hover:bg-stone-700 transition-colors"
                    >
                      <PlayCircle size={13} />
                      {t("pos.resume")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default POS;
