// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useAuth } from '@/context/AuthContext';
// import { useTranslation } from 'react-i18next';
// import { Button } from '@/components/ui/button';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { FileSpreadsheet } from 'lucide-react';
// import { toast } from 'sonner';
// import { motion } from 'framer-motion';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

// const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

// const Reports = () => {
//   const { token } = useAuth();
//   const { t } = useTranslation();
//   const [period, setPeriod] = useState('daily');
//   const [reportData, setReportData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchReport();
//   }, [period]);

//   const fetchReport = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${API_URL}/reports/sales?period=${period}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setReportData(response.data);
//     } catch (error) {
//       toast.error('Failed to fetch report');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleExportExcel = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/reports/export/excel?period=${period}`, {
//         headers: { Authorization: `Bearer ${token}` },
//         responseType: 'blob',
//       });
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `sales_report_${period}.xlsx`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       toast.success('Report exported successfully');
//     } catch (error) {
//       toast.error('Failed to export report');
//     }
//   };

//   const prepareChartData = () => {
//     if (!reportData?.orders) return [];
//     const dateMap = {};
//     reportData.orders.forEach((order) => {
//       const date = new Date(order.created_at).toLocaleDateString();
//       if (!dateMap[date]) {
//         dateMap[date] = { date, sales: 0, orders: 0 };
//       }
//       dateMap[date].sales += order.total;
//       dateMap[date].orders += 1;
//     });
//     return Object.values(dateMap).slice(-7);
//   };

//   const chartData = prepareChartData();

//   return (
//     <div className="p-4 md:p-6 lg:p-8" data-testid="reports-page">
//       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
//           <div>
//             <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-2">{t('reports.title')}</h1>
//             <p className="text-stone-600 text-sm md:text-base">{t('reports.subtitle')}</p>
//           </div>
//           <div className="flex flex-col sm:flex-row gap-3">
//             <Select value={period} onValueChange={setPeriod}>
//               <SelectTrigger className="w-full sm:w-40" data-testid="period-select">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="daily">{t('reports.daily')}</SelectItem>
//                 <SelectItem value="weekly">{t('reports.weekly')}</SelectItem>
//                 <SelectItem value="monthly">{t('reports.monthly')}</SelectItem>
//               </SelectContent>
//             </Select>
//             <Button
//               onClick={handleExportExcel}
//               className="rounded-full gap-2 w-full sm:w-auto bg-gradient-to-r from-primary to-stone-800 hover:shadow-lg transition-all"
//               data-testid="export-excel-button"
//             >
//               <FileSpreadsheet size={20} />
//               <span className="hidden sm:inline">{t('reports.exportExcel')}</span>
//               <span className="sm:inline md:hidden">{t('reports.export')}</span>
//             </Button>
//           </div>
//         </div>

//         {loading ? (
//           <div className="text-center py-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
//             <p className="text-stone-500">{t('reports.loading')}</p>
//           </div>
//         ) : (
//           <>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 className="bg-white border-2 border-emerald-200 rounded-2xl p-5 md:p-6 hover:shadow-lg transition-all"
//               >
//                 <p className="text-sm text-stone-600 mb-2">{t('reports.totalSales')}</p>
//                 <p className="text-3xl md:text-4xl font-mono font-bold text-emerald-600">
//                   ${reportData?.total_sales.toFixed(2) || 0}
//                 </p>
//               </motion.div>
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ delay: 0.1 }}
//                 className="bg-white border-2 border-blue-200 rounded-2xl p-5 md:p-6 hover:shadow-lg transition-all"
//               >
//                 <p className="text-sm text-stone-600 mb-2">{t('reports.totalOrders')}</p>
//                 <p className="text-3xl md:text-4xl font-mono font-bold text-blue-600">
//                   {reportData?.total_orders || 0}
//                 </p>
//               </motion.div>
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ delay: 0.2 }}
//                 className="bg-white border-2 border-purple-200 rounded-2xl p-5 md:p-6 hover:shadow-lg transition-all"
//               >
//                 <p className="text-sm text-stone-600 mb-2">{t('reports.totalProfit')}</p>
//                 <p className="text-3xl md:text-4xl font-mono font-bold text-purple-600">
//                   ${reportData?.total_profit.toFixed(2) || 0}
//                 </p>
//               </motion.div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
//               <div className="bg-white border-2 border-stone-200 rounded-2xl p-5 md:p-6 shadow-sm">
//                 <h3 className="text-lg md:text-xl font-bold mb-4">{t('reports.salesOverTime')}</h3>
//                 <ResponsiveContainer width="100%" height={250}>
//                   <LineChart data={chartData}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
//                     <XAxis dataKey="date" style={{ fontSize: '10px' }} />
//                     <YAxis style={{ fontSize: '10px' }} />
//                     <Tooltip />
//                     <Line type="monotone" dataKey="sales" stroke="#2D3436" strokeWidth={2} />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>

//               <div className="bg-white border-2 border-stone-200 rounded-2xl p-5 md:p-6 shadow-sm">
//                 <h3 className="text-lg md:text-xl font-bold mb-4">{t('reports.ordersOverTime')}</h3>
//                 <ResponsiveContainer width="100%" height={250}>
//                   <BarChart data={chartData}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
//                     <XAxis dataKey="date" style={{ fontSize: '10px' }} />
//                     <YAxis style={{ fontSize: '10px' }} />
//                     <Tooltip />
//                     <Bar dataKey="orders" fill="#D35400" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             <div className="bg-white border-2 border-stone-200 rounded-2xl p-5 md:p-6 shadow-sm overflow-x-auto">
//               <h3 className="text-lg md:text-xl font-bold mb-4">{t('reports.recentOrders')}</h3>
//               <div className="overflow-x-auto">
//                 <table className="w-full min-w-[600px]">
//                   <thead>
//                     <tr className="bg-stone-50/50">
//                       <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-4 py-3">
//                         {t('orders.invoice')}
//                       </th>
//                       <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-4 py-3">
//                         {t('orders.date')}
//                       </th>
//                       <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-4 py-3">
//                         {t('orders.items')}
//                       </th>
//                       <th className="text-right text-xs font-semibold text-stone-500 uppercase tracking-wider px-4 py-3">
//                         {t('orders.total')}
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {reportData?.orders.slice(0, 10).map((order, index) => (
//                       <tr key={order.id} className="border-b border-stone-100 hover:bg-stone-50">
//                         <td className="px-4 py-3">
//                           <p className="font-mono text-sm">{order.invoice_number}</p>
//                         </td>
//                         <td className="px-4 py-3">
//                           <p className="text-sm">{new Date(order.created_at).toLocaleDateString()}</p>
//                         </td>
//                         <td className="px-4 py-3">
//                           <span className="text-sm">{order.items.length}</span>
//                         </td>
//                         <td className="px-4 py-3 text-right">
//                           <span className="font-mono font-semibold">${order.total.toFixed(2)}</span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </>
//         )}
//       </motion.div>
//     </div>
//   );
// };

// export default Reports;

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  BarChart3,
  FileSpreadsheet,
  TrendingUp,
  ShoppingBag,
  IndianRupee,
  RefreshCw,
  ChevronDown,
  Package,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const rupee = (n) => `₹${(n || 0).toFixed(0)}`;
const rupee2 = (n) => `₹${(n || 0).toFixed(2)}`;
const fmtDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      })
    : "—";

// ── Custom Tooltip ────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1c1c2e] border border-white/15 rounded-xl px-3 py-2.5 shadow-xl">
      <p className="text-[10px] text-stone-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p
          key={i}
          className="text-xs font-black font-mono"
          style={{ color: p.color }}
        >
          {p.name === "sales" ? rupee(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

const PERIOD_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const Reports = () => {
  const { token } = useAuth();
  const { t } = useTranslation();
  const [period, setPeriod] = useState("daily");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [period]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/reports/sales?period=${period}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReportData(res.data);
    } catch {
      toast.error("Failed to fetch report");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await axios.get(
        `${API_URL}/reports/export/excel?period=${period}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        },
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.setAttribute("download", `sales_report_${period}.xlsx`);
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success("Report exported!");
    } catch {
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  };

  const chartData = useMemo(() => {
    if (!reportData?.orders) return [];
    const map = {};
    reportData.orders.forEach((o) => {
      const d = fmtDate(o.created_at);
      if (!map[d]) map[d] = { date: d, sales: 0, orders: 0 };
      map[d].sales += o.total;
      map[d].orders += 1;
    });
    return Object.values(map).slice(-14);
  }, [reportData]);

  const topProducts = useMemo(() => {
    if (!reportData?.orders) return [];
    const map = {};
    reportData.orders.forEach((o) => {
      (o.items || []).forEach((item) => {
        if (!map[item.product_name])
          map[item.product_name] = {
            name: item.product_name,
            qty: 0,
            revenue: 0,
          };
        map[item.product_name].qty += item.quantity;
        map[item.product_name].revenue += item.total;
      });
    });
    return Object.values(map)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [reportData]);

  const avgOrder = reportData?.total_orders
    ? reportData.total_sales / reportData.total_orders
    : 0;

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
              "radial-gradient(circle at 80% 30%, #f59e0b 0%, transparent 50%), radial-gradient(circle at 10% 80%, #8b5cf6 0%, transparent 45%)",
          }}
        />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/15 rounded-2xl border border-amber-500/20">
              <BarChart3 size={24} className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                Sales Reports
              </h1>
              <p className="text-stone-400 text-sm mt-0.5">
                Analyse your business performance
              </p>
            </div>
          </div>

          {/* Period + Export */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="relative">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="h-10 pl-3 pr-8 rounded-xl bg-white/10 border border-white/15 text-white text-sm font-bold outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-amber-500/40"
              >
                {PERIOD_OPTIONS.map((o) => (
                  <option
                    key={o.value}
                    value={o.value}
                    className="bg-[#1c1c2e]"
                  >
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={12}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
              />
            </div>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-2 h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all disabled:opacity-50 shadow-lg shadow-emerald-900/30"
            >
              {exporting ? (
                <RefreshCw size={13} className="animate-spin" />
              ) : (
                <FileSpreadsheet size={14} />
              )}
              <span className="hidden sm:inline">Export Excel</span>
            </button>
          </div>
        </div>

        {/* Stats strip */}
        {!loading && reportData && (
          <div className="relative mt-5 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                label: "Total Sales",
                value: rupee(reportData.total_sales),
                color: "text-amber-400",
              },
              {
                label: "Total Orders",
                value: reportData.total_orders,
                color: "text-blue-400",
              },
              {
                label: "Total Profit",
                value: rupee(reportData.total_profit),
                color: "text-emerald-400",
              },
              {
                label: "Avg Order",
                value: rupee(avgOrder),
                color: "text-purple-400",
              },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-stone-500 text-[10px] uppercase tracking-wider font-semibold mb-0.5">
                  {s.label}
                </p>
                <p
                  className={`font-mono font-black text-xl md:text-2xl ${s.color}`}
                >
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="relative w-14 h-14 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-amber-100" />
              <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
            </div>
            <p className="text-stone-400 text-sm">Loading report…</p>
          </div>
        </div>
      ) : (
        <>
          {/* ── Charts ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
            {/* Sales Over Time */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-black text-stone-800 text-sm">
                    Sales Over Time
                  </h3>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Revenue trend ({period})
                  </p>
                </div>
                <div className="p-2 bg-amber-500/10 rounded-xl">
                  <TrendingUp size={16} className="text-amber-500" />
                </div>
              </div>
              {chartData.length === 0 ? (
                <div className="flex items-center justify-center h-52 text-stone-300 text-sm">
                  No data for this period
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart
                    data={chartData}
                    margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
                  >
                    <defs>
                      <linearGradient
                        id="salesGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#f59e0b"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor="#f59e0b"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 9, fill: "#a8a29e" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 9, fill: "#a8a29e" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="#f59e0b"
                      strokeWidth={2.5}
                      fill="url(#salesGrad)"
                      dot={false}
                      activeDot={{ r: 4, fill: "#f59e0b" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </motion.div>

            {/* Orders Over Time */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-black text-stone-800 text-sm">
                    Orders Over Time
                  </h3>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Order volume ({period})
                  </p>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-xl">
                  <ShoppingBag size={16} className="text-blue-500" />
                </div>
              </div>
              {chartData.length === 0 ? (
                <div className="flex items-center justify-center h-52 text-stone-300 text-sm">
                  No data for this period
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 9, fill: "#a8a29e" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 9, fill: "#a8a29e" }}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="orders"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </motion.div>
          </div>

          {/* ── Bottom grid: Top Products + Recent Orders ── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Top Products */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 bg-[#1c1c2e] border border-white/10 rounded-2xl p-5 shadow-xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <Package size={14} className="text-amber-400" />
                <h3 className="font-black text-white text-sm">Top Products</h3>
                <span className="text-[10px] text-stone-500 ml-1">
                  by revenue
                </span>
              </div>
              {topProducts.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-stone-500 text-sm">
                  No product data
                </div>
              ) : (
                <div className="space-y-3">
                  {topProducts.map((p, i) => {
                    const maxRev = topProducts[0].revenue;
                    const pct = Math.round((p.revenue / maxRev) * 100);
                    const medals = ["🥇", "🥈", "🥉"];
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              {medals[i] || `#${i + 1}`}
                            </span>
                            <span className="text-xs font-semibold text-stone-300 truncate max-w-[140px]">
                              {p.name}
                            </span>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className="text-xs font-black font-mono text-amber-400">
                              {rupee(p.revenue)}
                            </span>
                            <span className="text-[10px] text-stone-500 ml-2">
                              {p.qty} units
                            </span>
                          </div>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{
                              delay: 0.3 + i * 0.06,
                              duration: 0.6,
                              ease: "easeOut",
                            }}
                            className={`h-full rounded-full ${i === 0 ? "bg-amber-500" : i === 1 ? "bg-amber-400/70" : "bg-amber-400/40"}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>

            {/* Recent Orders table */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="lg:col-span-3 bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden"
            >
              <div className="flex items-center gap-2 px-5 py-4 border-b border-stone-100">
                <Receipt size={14} className="text-stone-400" />
                <h3 className="font-black text-stone-800 text-sm">
                  Recent Orders
                </h3>
                <span className="text-[10px] text-stone-400 ml-1">
                  latest 10
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#1c1c2e]">
                      {["Invoice", "Date", "Items", "Total"].map((h, i) => (
                        <th
                          key={i}
                          className={`text-[10px] font-bold text-stone-400 uppercase tracking-widest px-4 py-3 ${i === 3 ? "text-right" : "text-left"}`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(reportData?.orders || []).slice(0, 10).map((order, i) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 + i * 0.02 }}
                        className="border-b border-stone-100 hover:bg-amber-50/30 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <p className="font-mono text-xs font-bold text-stone-700">
                            {order.invoice_number}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs text-stone-600">
                            {fmtDate(order.created_at)}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[10px] font-bold bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">
                            {order.items?.length || 0}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="font-mono font-black text-sm text-stone-800">
                            {rupee2(order.total)}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                {(!reportData?.orders || reportData.orders.length === 0) && (
                  <div className="flex items-center justify-center py-12 text-stone-400 text-sm">
                    No orders in this period
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
