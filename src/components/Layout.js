// import React, { useState, useEffect } from "react";
// import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";
// import { useTranslation } from "react-i18next";
// import {
//   LayoutDashboard,
//   Package,
//   ShoppingCart,
//   FileText,
//   BarChart3,
//   Users,
//   LogOut,
//   Menu,
//   X,
//   MapPin,
//   BookOpen,
//   ArrowRightLeft,
//   Clock,
//   ChevronRight,
//   Gift,
// } from "lucide-react";
// import { AnimatePresence, motion } from "framer-motion";
// import LanguageSelector from "@/components/LanguageSelector";

// // Role → nav items mapping
// const buildNav = (t, role) => {
//   const all = [
//     {
//       path: "/",
//       icon: LayoutDashboard,
//       label: t("nav.dashboard"),
//       roles: ["admin", "manager", "billing", "staff"],
//     },
//     {
//       path: "/daybook",
//       icon: BookOpen,
//       label: t("nav.dayBook"),
//       roles: ["admin", "manager"],
//     },
//     {
//       path: "/attendance",
//       icon: Clock,
//       label: t("nav.attendance"),
//       roles: ["admin", "manager", "billing", "staff"],
//     },
//     {
//       path: "/inventory",
//       icon: Package,
//       label: t("nav.inventory"),
//       roles: ["admin", "manager", "staff"],
//     },
//     {
//       path: "/locations-racks",
//       icon: MapPin,
//       label: t("nav.locationsRacks"),
//       roles: ["admin", "manager"],
//     },
//     {
//       path: "/stock-transfers",
//       icon: ArrowRightLeft,
//       label: t("nav.stockTransfers"),
//       roles: ["admin", "manager"],
//     },
//     {
//       path: "/pos",
//       icon: ShoppingCart,
//       label: t("nav.pos"),
//       roles: ["admin", "billing"],
//     },
//     {
//       path: "/orders",
//       icon: FileText,
//       label: t("nav.orders"),
//       roles: ["admin", "billing", "manager"],
//     },
//     {
//       path: "/commissions",
//       icon: Gift,
//       label: t("nav.commissions"),
//       roles: ["admin", "manager", "staff"],
//     },
//     {
//       path: "/reports",
//       icon: BarChart3,
//       label: t("nav.reports"),
//       roles: ["admin", "manager"],
//     },
//     { path: "/users", icon: Users, label: t("nav.users"), roles: ["admin"] },
//   ];
//   return all.filter((item) => item.roles.includes(role));
// };

// const ROLE_COLORS = {
//   admin: { bg: "bg-amber-500", text: "text-amber-500", label: "Full Admin" },
//   manager: { bg: "bg-blue-500", text: "text-blue-400", label: "Manager" },
//   billing: { bg: "bg-emerald-500", text: "text-emerald-400", label: "Billing" },
//   staff: { bg: "bg-stone-500", text: "text-stone-400", label: "Staff" },
// };

// const Layout = () => {
//   const { user, logout } = useAuth();
//   const { t } = useTranslation();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [collapsed, setCollapsed] = useState(false);

//   const navItems = buildNav(t, user?.role || "staff");
//   const roleStyle = ROLE_COLORS[user?.role] || ROLE_COLORS.staff;

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };
//   const handleNavClick = () => setMobileMenuOpen(false);

//   // Close mobile on route change
//   useEffect(() => {
//     setMobileMenuOpen(false);
//   }, [location.pathname]);

//   return (
//     <div className="flex h-screen bg-[#f7f6f3] overflow-hidden">
//       {/* ── Mobile top bar ── */}
//       <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#1c1c2e] border-b border-white/10 px-4 py-3 flex items-center justify-between shadow-xl">
//         <div className="flex items-center gap-3">
//           <img
//             src="/assets/logo.jpeg"
//             alt="MRB"
//             className="h-8 w-8 rounded-lg object-cover"
//             onError={(e) => {
//               e.target.style.display = "none";
//             }}
//           />
//           <div>
//             <p className="text-white text-sm font-black tracking-wide">MRB</p>
//             <p className="text-amber-400 text-[9px] font-semibold uppercase tracking-widest">
//               Home Decor
//             </p>
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           <LanguageSelector />
//           <button
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             className="p-2 text-stone-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
//           >
//             {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
//           </button>
//         </div>
//       </div>

//       {/* ── Mobile overlay ── */}
//       <AnimatePresence>
//         {mobileMenuOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
//             onClick={() => setMobileMenuOpen(false)}
//           />
//         )}
//       </AnimatePresence>

//       {/* ── Sidebar ── */}
//       <aside
//         className={`
//         fixed lg:relative flex flex-col z-50 h-full top-0 bottom-0 bg-[#1c1c2e]
//         transition-all duration-300 ease-in-out
//         ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
//         ${collapsed ? "lg:w-[72px]" : "w-64"}
//       `}
//       >
//         {/* Top: logo */}
//         <div
//           className={`border-b border-white/10 flex items-center shrink-0 ${collapsed ? "p-4 justify-center" : "px-5 py-5"}`}
//         >
//           <div className="flex items-center gap-3 min-w-0">
//             <div className="relative shrink-0">
//               <img
//                 src="/assets/logo.jpeg"
//                 alt="MRB"
//                 className="h-10 w-10 rounded-xl object-cover ring-2 ring-amber-500/30"
//                 onError={(e) => {
//                   e.target.style.display = "none";
//                   e.target.nextSibling.style.display = "flex";
//                 }}
//               />
//               <div className="h-10 w-10 rounded-xl bg-amber-500 hidden items-center justify-center shrink-0">
//                 <span className="text-white font-black text-sm">M</span>
//               </div>
//               <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#1c1c2e]" />
//             </div>
//             {!collapsed && (
//               <div className="min-w-0">
//                 <p className="text-white font-black text-sm tracking-wide truncate">
//                   MRB HOME DECOR
//                 </p>
//                 <p className="text-amber-400 text-[9px] font-bold uppercase tracking-widest">
//                   Mall · POS System
//                 </p>
//               </div>
//             )}
//           </div>
//           {!collapsed && (
//             <button
//               onClick={() => setCollapsed(true)}
//               className="ml-auto p-1.5 text-stone-600 hover:text-stone-400 rounded-lg hover:bg-white/5 transition-colors hidden lg:block shrink-0"
//             >
//               <ChevronRight size={14} />
//             </button>
//           )}
//         </div>

//         {/* Collapse re-expand button */}
//         {collapsed && (
//           <button
//             onClick={() => setCollapsed(false)}
//             className="hidden lg:flex mx-auto mt-2 p-1.5 text-stone-600 hover:text-stone-400 rounded-lg hover:bg-white/5 transition-colors"
//           >
//             <Menu size={16} />
//           </button>
//         )}

//         {/* Nav */}
//         <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5 mt-14 lg:mt-0 scrollbar-hide">
//           {navItems.map((item, index) => {
//             const Icon = item.icon;
//             const isActive =
//               item.path === "/"
//                 ? location.pathname === "/"
//                 : location.pathname.startsWith(item.path);
//             return (
//               <NavLink
//                 key={item.path}
//                 to={item.path}
//                 end={item.path === "/"}
//                 onClick={handleNavClick}
//               >
//                 <motion.div
//                   initial={{ opacity: 0, x: -10 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: index * 0.04 }}
//                   title={collapsed ? item.label : ""}
//                   className={`
//                     flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative group
//                     ${
//                       isActive
//                         ? "bg-amber-500 text-white shadow-lg shadow-amber-900/40"
//                         : "text-stone-400 hover:text-stone-100 hover:bg-white/8"
//                     }
//                     ${collapsed ? "justify-center" : ""}
//                   `}
//                 >
//                   <Icon
//                     size={18}
//                     strokeWidth={isActive ? 2 : 1.6}
//                     className="shrink-0"
//                   />
//                   {!collapsed && (
//                     <span className="text-sm font-medium">{item.label}</span>
//                   )}
//                   {isActive && !collapsed && (
//                     <motion.div
//                       layoutId="activeIndicator"
//                       className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full opacity-70"
//                     />
//                   )}
//                   {/* Tooltip for collapsed */}
//                   {collapsed && (
//                     <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#2d2d44] text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-xl">
//                       {item.label}
//                     </div>
//                   )}
//                 </motion.div>
//               </NavLink>
//             );
//           })}
//         </nav>

//         {/* Bottom: user + language + logout */}
//         <div className="border-t border-white/10 p-3 space-y-2 shrink-0">
//           {/* Language */}
//           {!collapsed && (
//             <div className="flex items-center justify-between px-3 py-1">
//               <span className="text-[10px] text-stone-600 font-semibold uppercase tracking-widest">
//                 {t("common.language")}
//               </span>
//               <LanguageSelector />
//             </div>
//           )}

//           {/* User card */}
//           {!collapsed ? (
//             <div className="bg-white/5 rounded-xl px-3 py-3 flex items-center gap-3">
//               <div className="relative shrink-0">
//                 <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
//                   <span className="text-white font-black text-sm">
//                     {user?.name?.[0]?.toUpperCase() || "U"}
//                   </span>
//                 </div>
//                 <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#1c1c2e]" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-white text-xs font-bold truncate">
//                   {user?.name}
//                 </p>
//                 <span
//                   className={`text-[9px] font-bold uppercase tracking-widest ${roleStyle.text}`}
//                 >
//                   {roleStyle.label}
//                 </span>
//               </div>
//             </div>
//           ) : (
//             <div className="flex justify-center">
//               <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
//                 <span className="text-white font-black text-sm">
//                   {user?.name?.[0]?.toUpperCase() || "U"}
//                 </span>
//               </div>
//             </div>
//           )}

//           {/* Logout */}
//           <button
//             onClick={handleLogout}
//             className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone-400 hover:text-white hover:bg-white/8 transition-all text-sm font-medium ${collapsed ? "justify-center" : ""}`}
//             title={collapsed ? t("nav.logout") : ""}
//           >
//             <LogOut size={16} strokeWidth={1.6} className="shrink-0" />
//             {!collapsed && <span>{t("nav.logout")}</span>}
//           </button>
//         </div>
//       </aside>

//       {/* ── Main content ── */}
//       <main className="flex-1 overflow-y-auto" style={{ marginTop: "0" }}>
//         <div className="lg:hidden h-14" />
//         {/* spacer for mobile top bar */}
//         <Outlet />
//       </main>
//     </div>
//   );
// };

// export default Layout;

import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  BarChart3,
  Users,
  LogOut,
  Menu,
  X,
  MapPin,
  BookOpen,
  ArrowRightLeft,
  Clock,
  ChevronRight,
  Gift,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import LanguageSelector from "@/components/LanguageSelector";

// ─────────────────────────────────────────────────────────────
// Role → nav items
//  admin   → everything, full CRUD
//  manager → stock & inventory only  (no POS / Orders / Users)
//  billing → POS & Orders only       (no inventory management)
//  staff   → Dashboard, Attendance, Inventory (read-only), Commissions (own)
// ─────────────────────────────────────────────────────────────
const buildNav = (t, role) => {
  const all = [
    {
      path: "/",
      icon: LayoutDashboard,
      label: t("nav.dashboard"),
      roles: ["admin", "manager", "billing", "staff"],
    },
    {
      path: "/daybook",
      icon: BookOpen,
      label: t("nav.dayBook"),
      roles: ["admin", "manager"],
    },
    {
      path: "/attendance",
      icon: Clock,
      label: t("nav.attendance"),
      roles: ["admin", "manager", "billing", "staff"],
    },
    {
      path: "/inventory",
      icon: Package,
      label: t("nav.inventory"),
      roles: ["admin", "manager", "staff"],
    }, // staff: read-only enforced in component
    {
      path: "/locations-racks",
      icon: MapPin,
      label: t("nav.locationsRacks"),
      roles: ["admin", "manager"],
    },
    {
      path: "/stock-transfers",
      icon: ArrowRightLeft,
      label: t("nav.stockTransfers"),
      roles: ["admin", "manager"],
    },
    {
      path: "/pos",
      icon: ShoppingCart,
      label: t("nav.pos"),
      roles: ["admin", "billing"],
    },
    {
      path: "/orders",
      icon: FileText,
      label: t("nav.orders"),
      roles: ["admin", "billing"],
    }, // manager uses Reports not Orders
    {
      path: "/commissions",
      icon: Gift,
      label: t("nav.commissions"),
      roles: ["admin", "manager", "staff"],
    },
    {
      path: "/reports",
      icon: BarChart3,
      label: t("nav.reports"),
      roles: ["admin", "manager"],
    },
    { path: "/users", icon: Users, label: t("nav.users"), roles: ["admin"] },
  ];
  return all.filter((item) => item.roles.includes(role));
};

const ROLE_COLORS = {
  admin: { bg: "bg-amber-500", text: "text-amber-500", label: "Full Admin" },
  manager: { bg: "bg-blue-500", text: "text-blue-400", label: "Manager" },
  billing: { bg: "bg-emerald-500", text: "text-emerald-400", label: "Billing" },
  staff: { bg: "bg-stone-500", text: "text-stone-400", label: "Staff" },
};

const Layout = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const navItems = buildNav(t, user?.role || "staff");
  const roleStyle = ROLE_COLORS[user?.role] || ROLE_COLORS.staff;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const handleNavClick = () => setMobileMenuOpen(false);

  // Close mobile on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-[#f7f6f3] overflow-hidden">
      {/* ── Mobile top bar ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#1c1c2e] border-b border-white/10 px-4 py-3 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <img
            src="/assets/logo.jpeg"
            alt="MRB"
            className="h-8 w-8 rounded-lg object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <div>
            <p className="text-white text-sm font-black tracking-wide">MRB</p>
            <p className="text-amber-400 text-[9px] font-semibold uppercase tracking-widest">
              Home Decor
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <aside
        className={`
        fixed lg:relative flex flex-col z-50 h-full top-0 bottom-0 bg-[#1c1c2e]
        transition-all duration-300 ease-in-out
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        ${collapsed ? "lg:w-[72px]" : "w-64"}
      `}
      >
        {/* Top: logo */}
        <div
          className={`border-b border-white/10 flex items-center shrink-0 ${collapsed ? "p-4 justify-center" : "px-5 py-5"}`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <img
                src="/assets/logo.jpeg"
                alt="MRB"
                className="h-10 w-10 rounded-xl object-cover ring-2 ring-amber-500/30"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <div className="h-10 w-10 rounded-xl bg-amber-500 hidden items-center justify-center shrink-0">
                <span className="text-white font-black text-sm">M</span>
              </div>
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#1c1c2e]" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-white font-black text-sm tracking-wide truncate">
                  MRB HOME DECOR
                </p>
                <p className="text-amber-400 text-[9px] font-bold uppercase tracking-widest">
                  Mall · POS System
                </p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="ml-auto p-1.5 text-stone-600 hover:text-stone-400 rounded-lg hover:bg-white/5 transition-colors hidden lg:block shrink-0"
            >
              <ChevronRight size={14} />
            </button>
          )}
        </div>

        {/* Collapse re-expand button */}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="hidden lg:flex mx-auto mt-2 p-1.5 text-stone-600 hover:text-stone-400 rounded-lg hover:bg-white/5 transition-colors"
          >
            <Menu size={16} />
          </button>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5 mt-14 lg:mt-0 scrollbar-hide">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive =
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={handleNavClick}
              >
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                  title={collapsed ? item.label : ""}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative group
                    ${
                      isActive
                        ? "bg-amber-500 text-white shadow-lg shadow-amber-900/40"
                        : "text-stone-400 hover:text-stone-100 hover:bg-white/8"
                    }
                    ${collapsed ? "justify-center" : ""}
                  `}
                >
                  <Icon
                    size={18}
                    strokeWidth={isActive ? 2 : 1.6}
                    className="shrink-0"
                  />
                  {!collapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                  {isActive && !collapsed && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full opacity-70"
                    />
                  )}
                  {/* Tooltip for collapsed */}
                  {collapsed && (
                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#2d2d44] text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-xl">
                      {item.label}
                    </div>
                  )}
                </motion.div>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom: user + language + logout */}
        <div className="border-t border-white/10 p-3 space-y-2 shrink-0">
          {/* Language */}
          {!collapsed && (
            <div className="flex items-center justify-between px-3 py-1">
              <span className="text-[10px] text-stone-600 font-semibold uppercase tracking-widest">
                {t("common.language")}
              </span>
              <LanguageSelector />
            </div>
          )}

          {/* User card */}
          {!collapsed ? (
            <div className="bg-white/5 rounded-xl px-3 py-3 flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                  <span className="text-white font-black text-sm">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#1c1c2e]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-bold truncate">
                  {user?.name}
                </p>
                <span
                  className={`text-[9px] font-bold uppercase tracking-widest ${roleStyle.text}`}
                >
                  {roleStyle.label}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <span className="text-white font-black text-sm">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone-400 hover:text-white hover:bg-white/8 transition-all text-sm font-medium ${collapsed ? "justify-center" : ""}`}
            title={collapsed ? t("nav.logout") : ""}
          >
            <LogOut size={16} strokeWidth={1.6} className="shrink-0" />
            {!collapsed && <span>{t("nav.logout")}</span>}
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto" style={{ marginTop: "0" }}>
        <div className="lg:hidden h-14" />
        {/* spacer for mobile top bar */}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
