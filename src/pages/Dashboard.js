// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "@/context/AuthContext";
// import { useTranslation } from "react-i18next";
// import {
//   TrendingUp,
//   Package,
//   ShoppingBag,
//   AlertTriangle,
//   DollarSign,
// } from "lucide-react";
// import { motion } from "framer-motion";

// const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

// const Dashboard = () => {
//   const { token } = useAuth();
//   const { t } = useTranslation();
//   const [stats, setStats] = useState(null);
//   const [locationStats, setLocationStats] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   const fetchStats = async () => {
//     try {
//       const [statsRes, locationRes] = await Promise.all([
//         axios.get(`${API_URL}/dashboard/stats`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         axios.get(`${API_URL}/dashboard/low-stock-by-location`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);
//       setStats(statsRes.data);
//       setLocationStats(locationRes.data);
//     } catch (error) {
//       console.error("Failed to fetch stats:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-4 md:p-8 flex items-center justify-center h-full">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
//           <p className="text-stone-500">{t("dashboard.loading")}</p>
//         </div>
//       </div>
//     );
//   }

//   const statCards = [
//     {
//       title: t("dashboard.todaySales"),
//       value: `₹${stats?.today_sales || 0}`,
//       icon: DollarSign,
//       color: "text-emerald-600",
//       bg: "bg-emerald-50",
//       border: "border-emerald-200",
//     },
//     {
//       title: t("dashboard.totalRevenue"),
//       value: `₹${stats?.total_sales || 0}`,
//       icon: TrendingUp,
//       color: "text-blue-600",
//       bg: "bg-blue-50",
//       border: "border-blue-200",
//     },
//     {
//       title: t("dashboard.totalProfit"),
//       value: `₹${stats?.total_profit || 0}`,
//       icon: TrendingUp,
//       color: "text-purple-600",
//       bg: "bg-purple-50",
//       border: "border-purple-200",
//     },
//     {
//       title: t("dashboard.products"),
//       value: stats?.total_products || 0,
//       icon: Package,
//       color: "text-amber-600",
//       bg: "bg-amber-50",
//       border: "border-amber-200",
//     },
//   ];

//   return (
//     <div className="p-4 md:p-6 lg:p-8" data-testid="dashboard-page">
//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3 }}
//       >
//         <div className="mb-6 md:mb-8">
//           <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-2">
//             {t("dashboard.title")}
//           </h1>
//           <p className="text-stone-600 text-sm md:text-base">
//             {t("dashboard.welcome")}
//           </p>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
//           {statCards.map((stat, index) => (
//             <motion.div
//               key={stat.title}
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ delay: index * 0.1 }}
//               className={`bg-white border-2 ${stat.border} rounded-2xl p-5 md:p-6 hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1`}
//               data-testid={`stat-card-${stat.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
//             >
//               <div className="flex items-start justify-between mb-4">
//                 <div className={`p-3 rounded-xl ${stat.bg}`}>
//                   <stat.icon className={stat.color} size={24} strokeWidth={2} />
//                 </div>
//               </div>
//               <h3 className="text-2xl md:text-3xl font-bold font-mono text-primary mb-1">
//                 {stat.value}
//               </h3>
//               <p className="text-xs md:text-sm text-stone-600">{stat.title}</p>
//             </motion.div>
//           ))}
//         </div>

//         {/* Location-Based Low Stock Alerts */}
//         {(locationStats?.mall_count > 0 ||
//           locationStats?.warehouse_count > 0) && (
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 md:mb-8">
//             {locationStats?.mall_count > 0 && (
//               <motion.div
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.4 }}
//                 className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-2xl p-5 md:p-6 shadow-md"
//                 data-testid="mall-low-stock-alert"
//               >
//                 <div className="flex items-start gap-4">
//                   <div className="p-3 bg-blue-100 rounded-xl">
//                     <AlertTriangle
//                       className="text-blue-600"
//                       size={24}
//                       strokeWidth={2}
//                     />
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="text-lg md:text-xl font-bold text-blue-900 mb-2">
//                       {t("dashboard.mallLowStock")}
//                     </h3>
//                     <p className="text-sm text-blue-800 mb-4">
//                       {locationStats.mall_count}{" "}
//                       {t("dashboard.productsNeedTransfer")}.
//                     </p>
//                     <div className="space-y-2">
//                       {locationStats.mall_low_stock?.map((product) => (
//                         <motion.div
//                           key={product.id}
//                           whileHover={{ scale: 1.02 }}
//                           className="flex items-center justify-between bg-white rounded-xl p-3 md:p-4 shadow-sm"
//                         >
//                           <div className="flex-1 min-w-0 mr-4">
//                             <p className="text-sm md:text-base font-semibold text-primary truncate">
//                               {product.name}
//                             </p>
//                             <p className="text-xs text-stone-600">
//                               SKU: {product.sku}
//                             </p>
//                           </div>
//                           <div className="text-right flex-shrink-0">
//                             <p className="text-sm md:text-base font-mono font-bold text-blue-600">
//                               {product.current_quantity} {t("dashboard.inMall")}
//                             </p>
//                             <p className="text-xs text-stone-500">
//                               {t("dashboard.threshold")}: {product.threshold}
//                             </p>
//                           </div>
//                         </motion.div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             )}

//             {locationStats?.warehouse_count > 0 && (
//               <motion.div
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.5 }}
//                 className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-5 md:p-6 shadow-md"
//                 data-testid="warehouse-low-stock-alert"
//               >
//                 <div className="flex items-start gap-4">
//                   <div className="p-3 bg-amber-100 rounded-xl">
//                     <AlertTriangle
//                       className="text-amber-600"
//                       size={24}
//                       strokeWidth={2}
//                     />
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="text-lg md:text-xl font-bold text-amber-900 mb-2">
//                       {t("dashboard.warehouseLowStock")}
//                     </h3>
//                     <p className="text-sm text-amber-800 mb-4">
//                       {locationStats.warehouse_count}{" "}
//                       {t("dashboard.productsNeedReorder")}.
//                     </p>
//                     <div className="space-y-2">
//                       {locationStats.warehouse_low_stock?.map((product) => (
//                         <motion.div
//                           key={product.id}
//                           whileHover={{ scale: 1.02 }}
//                           className="flex items-center justify-between bg-white rounded-xl p-3 md:p-4 shadow-sm"
//                         >
//                           <div className="flex-1 min-w-0 mr-4">
//                             <p className="text-sm md:text-base font-semibold text-primary truncate">
//                               {product.name}
//                             </p>
//                             <p className="text-xs text-stone-600">
//                               SKU: {product.sku}
//                             </p>
//                           </div>
//                           <div className="text-right flex-shrink-0">
//                             <p className="text-sm md:text-base font-mono font-bold text-amber-600">
//                               {product.current_quantity}{" "}
//                               {t("dashboard.inWarehouse")}
//                             </p>
//                             <p className="text-xs text-stone-500">
//                               {t("dashboard.threshold")}: {product.threshold}
//                             </p>
//                           </div>
//                         </motion.div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             )}
//           </div>
//         )}

//         {stats?.low_stock_count > 0 && !locationStats && (
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4 }}
//             className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-5 md:p-6 mb-6 md:mb-8 shadow-md"
//             data-testid="low-stock-alert"
//           >
//             <div className="flex items-start gap-4">
//               <div className="p-3 bg-amber-100 rounded-xl">
//                 <AlertTriangle
//                   className="text-amber-600"
//                   size={24}
//                   strokeWidth={2}
//                 />
//               </div>
//               <div className="flex-1">
//                 <h3 className="text-lg md:text-xl font-bold text-amber-900 mb-2">
//                   {t("dashboard.lowStockAlert")}
//                 </h3>
//                 <p className="text-sm text-amber-800 mb-4">
//                   {stats.low_stock_count} {t("dashboard.lowStockDesc")}.
//                 </p>
//                 <div className="space-y-2">
//                   {stats.low_stock_products?.map((product) => (
//                     <motion.div
//                       key={product.id}
//                       whileHover={{ scale: 1.02 }}
//                       className="flex items-center justify-between bg-white rounded-xl p-3 md:p-4 shadow-sm"
//                       data-testid={`low-stock-product-${product.id}`}
//                     >
//                       <div className="flex-1 min-w-0 mr-4">
//                         <p className="text-sm md:text-base font-semibold text-primary truncate">
//                           {product.name}
//                         </p>
//                         <p className="text-xs text-stone-600">
//                           SKU: {product.sku}
//                         </p>
//                       </div>
//                       <div className="text-right flex-shrink-0">
//                         <p className="text-sm md:text-base font-mono font-bold text-amber-600">
//                           {product.stock_quantity} {t("common.left")}
//                         </p>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.5 }}
//             className="bg-white border border-stone-200 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow"
//           >
//             <h3 className="text-lg md:text-xl font-bold mb-4 text-primary">
//               {t("dashboard.quickStats")}
//             </h3>
//             <div className="space-y-4">
//               <div className="flex justify-between items-center py-3 border-b border-stone-100">
//                 <span className="text-stone-600 text-sm md:text-base">
//                   {t("dashboard.totalOrders")}
//                 </span>
//                 <span className="font-mono font-bold text-primary text-lg">
//                   {stats?.total_orders || 0}
//                 </span>
//               </div>
//               <div className="flex justify-between items-center py-3 border-b border-stone-100">
//                 <span className="text-stone-600 text-sm md:text-base">
//                   {t("dashboard.productsInStock")}
//                 </span>
//                 <span className="font-mono font-bold text-primary text-lg">
//                   {stats?.total_products || 0}
//                 </span>
//               </div>
//               <div className="flex justify-between items-center py-3">
//                 <span className="text-stone-600 text-sm md:text-base">
//                   {t("dashboard.lowStockItems")}
//                 </span>
//                 <span className="font-mono font-bold text-amber-600 text-lg">
//                   {stats?.low_stock_count || 0}
//                 </span>
//               </div>
//             </div>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.6 }}
//             className="bg-gradient-to-br from-stone-50 to-stone-100 border border-stone-200 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow"
//           >
//             <h3 className="text-lg md:text-xl font-bold mb-4 text-primary">
//               {t("dashboard.businessSummary")}
//             </h3>
//             <div className="space-y-5">
//               <div>
//                 <p className="text-xs md:text-sm text-stone-600 mb-2">
//                   {t("dashboard.averageOrderValue")}
//                 </p>
//                 <p className="text-2xl md:text-3xl font-mono font-bold text-primary">
//                   ₹
//                   {stats?.total_orders > 0
//                     ? (stats?.total_sales / stats?.total_orders).toFixed(2)
//                     : 0}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-xs md:text-sm text-stone-600 mb-2">
//                   {t("dashboard.profitMargin")}
//                 </p>
//                 <div className="flex items-baseline gap-2">
//                   <p className="text-2xl md:text-3xl font-mono font-bold text-emerald-600">
//                     {stats?.total_sales > 0
//                       ? (
//                           (stats?.total_profit / stats?.total_sales) *
//                           100
//                         ).toFixed(1)
//                       : 0}
//                     %
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingBag,
  AlertTriangle,
  IndianRupee,
  ShoppingCart,
  BarChart3,
  ArrowRight,
  Clock,
  Users,
  Zap,
  Star,
  Award,
  Target,
  Activity,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

// ── Animated counter ──────────────────────────────────────────
const AnimatedNumber = ({ value, prefix = "", suffix = "", decimals = 0 }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseFloat(value) || 0;
    if (end === 0) return;
    const duration = 1200;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setDisplay(end);
        clearInterval(timer);
      } else setDisplay(start);
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return (
    <span>
      {prefix}
      {decimals > 0
        ? display.toFixed(decimals)
        : Math.floor(display).toLocaleString("en-IN")}
      {suffix}
    </span>
  );
};

// ── Custom chart tooltip ─────────────────────────────────────
const ChartTooltip = ({ active, payload, label, prefix = "₹" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1c1c2e] border border-amber-500/20 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-amber-300 text-xs font-bold mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-white text-sm font-mono font-bold">
          {p.name}: {prefix}
          {typeof p.value === "number" ? p.value.toFixed(2) : p.value}
        </p>
      ))}
    </div>
  );
};

// ── KPI Card ──────────────────────────────────────────────────
const KPICard = ({
  title,
  value,
  prefix,
  suffix,
  decimals,
  icon: Icon,
  color,
  trend,
  trendValue,
  delay,
  onClick,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    onClick={onClick}
    className={`relative overflow-hidden bg-white rounded-2xl border border-stone-100 p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${onClick ? "cursor-pointer" : ""} group`}
  >
    {/* Subtle corner glow */}
    <div
      className={`absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-10 blur-2xl ${color.glow}`}
    />

    <div className="flex items-start justify-between mb-4">
      <div className={`p-2.5 rounded-xl ${color.bg}`}>
        <Icon size={20} className={color.text} strokeWidth={1.8} />
      </div>
      {trendValue !== undefined && (
        <div
          className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
            trend === "up"
              ? "bg-emerald-50 text-emerald-600"
              : trend === "down"
                ? "bg-rose-50 text-rose-500"
                : "bg-stone-100 text-stone-500"
          }`}
        >
          {trend === "up" ? (
            <TrendingUp size={11} />
          ) : trend === "down" ? (
            <TrendingDown size={11} />
          ) : null}
          {trendValue}
        </div>
      )}
    </div>

    <p
      className={`text-2xl font-black font-mono tracking-tight ${color.text} mb-1`}
    >
      <AnimatedNumber
        value={value}
        prefix={prefix}
        suffix={suffix}
        decimals={decimals}
      />
    </p>
    <p className="text-xs text-stone-500 font-medium">{title}</p>

    {onClick && (
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight size={14} className="text-stone-400" />
      </div>
    )}
  </motion.div>
);

// ── Section header ─────────────────────────────────────────────
const SectionHeader = ({ title, subtitle, action }) => (
  <div className="flex items-center justify-between mb-5">
    <div>
      <h2 className="text-base font-bold text-stone-800">{title}</h2>
      {subtitle && <p className="text-xs text-stone-400 mt-0.5">{subtitle}</p>}
    </div>
    {action}
  </div>
);

// ─────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { token, user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [locationStats, setLocationStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting("Good Morning");
    else if (h < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
    const id = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const [statsRes, locationRes, ordersRes] = await Promise.allSettled([
        axios.get(`${API_URL}/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/dashboard/low-stock-by-location`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      if (statsRes.status === "fulfilled") setStats(statsRes.value.data);
      if (locationRes.status === "fulfilled")
        setLocationStats(locationRes.value.data);
      if (ordersRes.status === "fulfilled")
        setRecentOrders(ordersRes.value.data.slice(0, 50));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ── Derive chart data from orders ─────────────────────────
  const last7DaysData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      const label = d.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
      });
      const dayOrders = recentOrders.filter((o) =>
        o.created_at?.startsWith(key),
      );
      days.push({
        day: label,
        Revenue: parseFloat(
          dayOrders.reduce((s, o) => s + (o.total || 0), 0).toFixed(2),
        ),
        Orders: dayOrders.length,
      });
    }
    return days;
  }, [recentOrders]);

  const paymentModeData = useMemo(() => {
    const map = {};
    recentOrders.forEach((o) => {
      const m = o.payment_mode || "cash";
      map[m] = (map[m] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  }, [recentOrders]);

  const hourlyData = useMemo(() => {
    const hours = Array.from({ length: 12 }, (_, i) => ({
      time: `${(i + 8) % 12 || 12}${i + 8 < 12 ? "am" : "pm"}`,
      Sales: 0,
    }));
    recentOrders.forEach((o) => {
      if (!o.created_at) return;
      const d = new Date(o.created_at);
      const h = d.getHours();
      if (h >= 8 && h < 20) hours[h - 8].Sales += o.total || 0;
    });
    return hours;
  }, [recentOrders]);

  const DONUT_COLORS = ["#f59e0b", "#1c1c2e", "#10b981", "#3b82f6", "#f43f5e"];

  const avgOrderValue =
    stats?.total_orders > 0 ? stats.total_sales / stats.total_orders : 0;
  const profitMargin =
    stats?.total_sales > 0 ? (stats.total_profit / stats.total_sales) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#fafaf8]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-amber-100" />
            <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
          </div>
          <p className="text-stone-400 text-sm font-medium">
            {t("dashboard.loading")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-full bg-[#f7f6f3] p-4 md:p-6 lg:p-8"
      data-testid="dashboard-page"
    >
      {/* ── Hero greeting bar ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-[#1c1c2e] rounded-2xl p-6 mb-6 shadow-xl"
      >
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #f59e0b 0%, transparent 50%), radial-gradient(circle at 80% 20%, #f59e0b 0%, transparent 40%)",
          }}
        />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-amber-400 text-sm font-semibold tracking-wide uppercase mb-1 flex items-center gap-2">
              <Zap size={13} className="fill-amber-400" />
              {greeting}, {user?.name?.split(" ")[0]}!
            </p>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              MRB Home Decor Mall
            </h1>
            <p className="text-stone-400 text-sm mt-1">
              {t("dashboard.welcome")}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-white font-mono font-bold text-lg">
                {currentTime.toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-stone-400 text-xs">
                {currentTime.toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
            </div>
            <button
              onClick={() => fetchAll(true)}
              disabled={refreshing}
              className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-stone-300 transition-colors"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
            </button>
          </div>
        </div>

        {/* Quick today strip */}
        <div className="relative mt-5 pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Today's Revenue",
              value: `₹${(stats?.today_sales || 0).toLocaleString("en-IN")}`,
              color: "text-amber-400",
            },
            {
              label: "Today's Orders",
              value: recentOrders.filter((o) =>
                o.created_at?.startsWith(
                  new Date().toISOString().split("T")[0],
                ),
              ).length,
              color: "text-emerald-400",
            },
            {
              label: "Low Stock Alert",
              value: `${stats?.low_stock_count || 0} items`,
              color:
                (stats?.low_stock_count || 0) > 0
                  ? "text-rose-400"
                  : "text-stone-400",
            },
            {
              label: "Profit Margin",
              value: `${profitMargin.toFixed(1)}%`,
              color: "text-blue-400",
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

      {/* ── 6 KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4 mb-6">
        {[
          {
            title: t("dashboard.todaySales"),
            value: stats?.today_sales || 0,
            prefix: "₹",
            icon: IndianRupee,
            color: {
              text: "text-amber-600",
              bg: "bg-amber-50",
              glow: "bg-amber-500",
            },
            delay: 0,
          },
          {
            title: t("dashboard.totalRevenue"),
            value: stats?.total_sales || 0,
            prefix: "₹",
            icon: TrendingUp,
            color: {
              text: "text-blue-600",
              bg: "bg-blue-50",
              glow: "bg-blue-500",
            },
            delay: 0.05,
          },
          {
            title: t("dashboard.totalProfit"),
            value: stats?.total_profit || 0,
            prefix: "₹",
            icon: Award,
            color: {
              text: "text-emerald-600",
              bg: "bg-emerald-50",
              glow: "bg-emerald-500",
            },
            delay: 0.1,
          },
          {
            title: t("dashboard.totalOrders"),
            value: stats?.total_orders || 0,
            icon: ShoppingBag,
            color: {
              text: "text-violet-600",
              bg: "bg-violet-50",
              glow: "bg-violet-500",
            },
            delay: 0.15,
            onClick: () => navigate("/orders"),
          },
          {
            title: t("dashboard.averageOrderValue"),
            value: avgOrderValue,
            prefix: "₹",
            decimals: 0,
            icon: Target,
            color: {
              text: "text-rose-600",
              bg: "bg-rose-50",
              glow: "bg-rose-500",
            },
            delay: 0.2,
          },
          {
            title: t("dashboard.products"),
            value: stats?.total_products || 0,
            icon: Package,
            color: {
              text: "text-stone-700",
              bg: "bg-stone-100",
              glow: "bg-stone-500",
            },
            delay: 0.25,
            onClick: () => navigate("/inventory"),
          },
        ].map((card, i) => (
          <KPICard key={i} {...card} />
        ))}
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-5 mb-6">
        {/* Revenue Trend (large) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-2 bg-white rounded-2xl border border-stone-100 p-5 shadow-sm"
        >
          <SectionHeader
            title="Revenue Trend — Last 7 Days"
            subtitle="Daily revenue and order volume"
          />
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={last7DaysData}
              margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1c1c2e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1c1c2e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="Revenue"
                name="Revenue"
                stroke="#f59e0b"
                strokeWidth={2.5}
                fill="url(#revGrad)"
                dot={{ fill: "#f59e0b", r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Payment Mode Donut */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm"
        >
          <SectionHeader
            title="Payment Methods"
            subtitle="All time breakdown"
          />
          {paymentModeData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-stone-300">
              <Activity size={32} className="mb-2" />
              <p className="text-xs">No data yet</p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={paymentModeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {paymentModeData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={DONUT_COLORS[i % DONUT_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#1c1c2e",
                      border: "none",
                      borderRadius: 12,
                      fontSize: 11,
                    }}
                    itemStyle={{ color: "#fbbf24" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 justify-center mt-1">
                {paymentModeData.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 text-[11px] text-stone-600"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length],
                      }}
                    />
                    {item.name} ({item.value})
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* ── Hourly Sales Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm mb-6"
      >
        <SectionHeader
          title="Sales by Hour"
          subtitle="When your customers buy (8 AM – 8 PM)"
        />
        <ResponsiveContainer width="100%" height={160}>
          <BarChart
            data={hourlyData}
            margin={{ top: 0, right: 5, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f0ede8"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="Sales" fill="#1c1c2e" radius={[4, 4, 0, 0]}>
              {hourlyData.map((entry, i) => (
                <Cell key={i} fill={entry.Sales > 0 ? "#f59e0b" : "#e5e3de"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* ── Bottom row: Recent Orders + Stats + Alerts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
        {/* Recent Orders (wide) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.45 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-stone-100 p-5 shadow-sm"
        >
          <SectionHeader
            title="Recent Orders"
            subtitle="Latest transactions"
            action={
              <button
                onClick={() => navigate("/orders")}
                className="flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors"
              >
                {t("common.view")} all <ArrowRight size={12} />
              </button>
            }
          />
          {recentOrders.length === 0 ? (
            <div className="text-center py-10 text-stone-300">
              <ShoppingCart size={36} className="mx-auto mb-3" />
              <p className="text-sm">{t("orders.noOrders")}</p>
            </div>
          ) : (
            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {recentOrders.slice(0, 8).map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.04 }}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-stone-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
                      <ReceiptIcon size={14} className="text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-800">
                        #{order.invoice_number}
                      </p>
                      <p className="text-[10px] text-stone-400">
                        {new Date(order.created_at).toLocaleDateString(
                          "en-IN",
                          { day: "2-digit", month: "short" },
                        )}
                        {" · "}
                        {new Date(order.created_at).toLocaleTimeString(
                          "en-IN",
                          { hour: "2-digit", minute: "2-digit" },
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        order.payment_mode === "cash"
                          ? "bg-emerald-50 text-emerald-600"
                          : order.payment_mode === "upi"
                            ? "bg-blue-50 text-blue-600"
                            : order.payment_mode === "card"
                              ? "bg-violet-50 text-violet-600"
                              : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      {order.payment_mode || "cash"}
                    </span>
                    <span className="font-mono font-bold text-sm text-stone-800">
                      ₹{(order.total || 0).toFixed(2)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Right column: Quick stats + Low stock */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          {/* Business metrics card */}
          <div className="bg-[#1c1c2e] rounded-2xl p-5 text-white shadow-xl">
            <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <Star size={11} className="fill-amber-400" /> Business Health
            </p>
            <div className="space-y-4">
              {[
                {
                  label: t("dashboard.totalOrders"),
                  value: stats?.total_orders || 0,
                  suffix: " orders",
                },
                {
                  label: t("dashboard.averageOrderValue"),
                  value: `₹${avgOrderValue.toFixed(0)}`,
                },
                {
                  label: t("dashboard.profitMargin"),
                  value: `${profitMargin.toFixed(1)}%`,
                  color:
                    profitMargin > 30 ? "text-emerald-400" : "text-amber-400",
                },
                {
                  label: t("dashboard.lowStockItems"),
                  value: stats?.low_stock_count || 0,
                  color:
                    (stats?.low_stock_count || 0) > 0
                      ? "text-rose-400"
                      : "text-emerald-400",
                },
              ].map((m, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border-b border-white/5 pb-3 last:border-0 last:pb-0"
                >
                  <span className="text-stone-400 text-xs">{m.label}</span>
                  <span
                    className={`font-mono font-black text-sm ${m.color || "text-white"}`}
                  >
                    {typeof m.value === "number"
                      ? m.value.toLocaleString("en-IN") + (m.suffix || "")
                      : m.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
            <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-3">
              Quick Actions
            </p>
            <div className="space-y-2">
              {[
                {
                  label: "New Sale",
                  icon: ShoppingCart,
                  path: "/pos",
                  color: "bg-amber-500 text-white",
                },
                {
                  label: "View Inventory",
                  icon: Package,
                  path: "/inventory",
                  color: "bg-[#1c1c2e] text-white",
                },
                {
                  label: "Reports",
                  icon: BarChart3,
                  path: "/reports",
                  color: "bg-stone-100 text-stone-700",
                },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.path}
                    onClick={() => navigate(action.path)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] ${action.color}`}
                  >
                    <Icon size={15} />
                    {action.label}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Low Stock Alerts ── */}
      {(locationStats?.mall_count > 0 ||
        locationStats?.warehouse_count > 0 ||
        stats?.low_stock_count > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-600 px-3 py-1.5 rounded-full">
              <AlertTriangle size={13} />
              <span className="text-xs font-bold">Stock Alerts</span>
            </div>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {locationStats?.mall_count > 0 && (
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <AlertTriangle size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-900 text-sm">
                      {t("dashboard.mallLowStock")}
                    </h3>
                    <p className="text-xs text-blue-600">
                      {locationStats.mall_count}{" "}
                      {t("dashboard.productsNeedTransfer")}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {locationStats.mall_low_stock?.slice(0, 4).map((p) => (
                    <div
                      key={p.id}
                      className="flex justify-between items-center bg-white rounded-xl px-4 py-2.5 shadow-sm"
                    >
                      <div>
                        <p className="text-xs font-bold text-stone-800 truncate max-w-[160px]">
                          {p.name}
                        </p>
                        <p className="text-[10px] text-stone-400">
                          SKU: {p.sku}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono font-black text-blue-600">
                          {p.current_quantity}
                        </p>
                        <p className="text-[10px] text-stone-400">
                          /{p.threshold}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {locationStats?.warehouse_count > 0 && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-amber-100 rounded-xl">
                    <AlertTriangle size={18} className="text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-900 text-sm">
                      {t("dashboard.warehouseLowStock")}
                    </h3>
                    <p className="text-xs text-amber-600">
                      {locationStats.warehouse_count}{" "}
                      {t("dashboard.productsNeedReorder")}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {locationStats.warehouse_low_stock?.slice(0, 4).map((p) => (
                    <div
                      key={p.id}
                      className="flex justify-between items-center bg-white rounded-xl px-4 py-2.5 shadow-sm"
                    >
                      <div>
                        <p className="text-xs font-bold text-stone-800 truncate max-w-[160px]">
                          {p.name}
                        </p>
                        <p className="text-[10px] text-stone-400">
                          SKU: {p.sku}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono font-black text-amber-600">
                          {p.current_quantity}
                        </p>
                        <p className="text-[10px] text-stone-400">
                          /{p.threshold}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!locationStats && stats?.low_stock_count > 0 && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-5 lg:col-span-2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-amber-100 rounded-xl">
                    <AlertTriangle size={18} className="text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-900 text-sm">
                      {t("dashboard.lowStockAlert")}
                    </h3>
                    <p className="text-xs text-amber-600">
                      {stats.low_stock_count} {t("dashboard.lowStockDesc")}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {stats.low_stock_products?.map((p) => (
                    <div
                      key={p.id}
                      className="flex justify-between items-center bg-white rounded-xl px-4 py-2.5 shadow-sm"
                    >
                      <div>
                        <p className="text-xs font-bold text-stone-800 truncate max-w-[140px]">
                          {p.name}
                        </p>
                        <p className="text-[10px] text-stone-400">
                          SKU: {p.sku}
                        </p>
                      </div>
                      <p className="text-sm font-mono font-black text-amber-600">
                        {p.stock_quantity}{" "}
                        <span className="text-[10px] font-normal text-stone-400">
                          {t("common.left")}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

// ── Small receipt icon inline ──────────────────────────────────
const ReceiptIcon = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
    <path d="M16 8H8M16 12H8M12 16H8" />
  </svg>
);

export default Dashboard;
