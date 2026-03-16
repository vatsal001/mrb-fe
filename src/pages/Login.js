// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";
// import { useTranslation } from "react-i18next";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { toast } from "sonner";
// import { motion } from "framer-motion";
// import LanguageSelector from "@/components/LanguageSelector";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isRegister, setIsRegister] = useState(false);
//   const [name, setName] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { login, register } = useAuth();
//   const { t } = useTranslation();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       if (isRegister) {
//         await register(email, password, name);
//         toast.success(t("auth.registerSuccess"));
//         setIsRegister(false);
//         setPassword("");
//       } else {
//         await login(email, password);
//         toast.success(t("auth.loginSuccess"));
//         navigate("/");
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.detail || "Authentication failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full blur-3xl"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-500/10 to-primary/10 rounded-full blur-3xl"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl"></div>
//       </div>

//       {/* Left side - Image with overlay */}
//       <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
//         <div className="absolute inset-0">
//           <img
//             src="https://images.unsplash.com/photo-1766802981880-64b6bf946163?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjZXJhbWljJTIwdmFzZSUyMGhvbWUlMjBkZWNvciUyMG1pbmltYWxpc3R8ZW58MHx8fHwxNzcwMzc1OTM3fDA&ixlib=rb-4.1.0&q=85"
//             alt="Home Decor"
//             className="absolute inset-0 w-full h-full object-cover"
//           />
//           <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/50 backdrop-blur-[1px]"></div>
//         </div>

//         {/* Content overlay on image */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 0.2 }}
//           className="relative z-10 text-white max-w-lg"
//         >
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.6, delay: 0.4 }}
//             className="mb-8"
//           >
//             <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6">
//               <span className="text-sm font-medium">Premium Experience</span>
//             </div>
//           </motion.div>

//           <h2 className="text-5xl font-bold mb-6 leading-tight">
//             Elevate Your
//             <br />
//             <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
//               Business Today
//             </span>
//           </h2>

//           <div className="mt-12 flex items-center gap-8">
//             <div className="w-px h-12 bg-white/20"></div>
//             <div>
//               <div className="text-3xl font-bold">99.9%</div>
//               <div className="text-sm text-white/70">Uptime</div>
//             </div>
//             <div className="w-px h-12 bg-white/20"></div>
//             <div>
//               <div className="text-3xl font-bold">24/7</div>
//               <div className="text-sm text-white/70">Support</div>
//             </div>
//           </div>
//         </motion.div>
//       </div>

//       {/* Right side - Form */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
//         <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.6 }}
//           className="w-full max-w-md"
//         >
//           {/* Header */}
//           <div className="text-center mb-10">
//             <motion.div
//               initial={{ scale: 0.8, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               transition={{ duration: 0.5 }}
//               className="inline-block mb-6"
//             >
//               {/* <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 mx-auto">
//                 <svg
//                   className="w-8 h-8 text-white"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
//                   />
//                 </svg>
//               </div> */}
//               <img src="\assets\logo.jpeg" width={200} />
//             </motion.div>

//             <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3">
//               {t("app.title")}
//             </h1>
//             <p className="text-stone-600 text-lg">{t("app.subtitle")}</p>

//             <div className="mt-6 flex justify-center">
//               <div className="bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-stone-200/50 shadow-sm">
//                 <LanguageSelector />
//               </div>
//             </div>
//           </div>

//           {/* Form Card */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.1 }}
//             className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/5 border border-white/50 p-8"
//           >
//             <form
//               onSubmit={handleSubmit}
//               className="space-y-5"
//               data-testid="login-form"
//             >
//               {isRegister && (
//                 <motion.div
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: "auto" }}
//                   exit={{ opacity: 0, height: 0 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <Label
//                     htmlFor="name"
//                     className="text-sm font-semibold text-gray-700"
//                   >
//                     {t("auth.name")}
//                   </Label>
//                   <Input
//                     id="name"
//                     type="text"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     required
//                     className="mt-2 h-12 bg-white/50 border-stone-200/50 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all duration-300"
//                     data-testid="name-input"
//                   />
//                 </motion.div>
//               )}

//               <div>
//                 <Label
//                   htmlFor="email"
//                   className="text-sm font-semibold text-gray-700"
//                 >
//                   {t("auth.email")}
//                 </Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   className="mt-2 h-12 bg-white/50 border-stone-200/50 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all duration-300"
//                   data-testid="email-input"
//                   placeholder="you@example.com"
//                 />
//               </div>

//               <div>
//                 <Label
//                   htmlFor="password"
//                   className="text-sm font-semibold text-gray-700"
//                 >
//                   {t("auth.password")}
//                 </Label>
//                 <Input
//                   id="password"
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   className="mt-2 h-12 bg-white/50 border-stone-200/50 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all duration-300"
//                   data-testid="password-input"
//                   placeholder="••••••••"
//                 />
//               </div>

//               <Button
//                 type="submit"
//                 className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 font-semibold text-base mt-6"
//                 disabled={loading}
//                 data-testid="submit-button"
//               >
//                 {loading ? (
//                   <span className="flex items-center justify-center gap-2">
//                     <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                         fill="none"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                     {t("pos.pleaseWait")}
//                   </span>
//                 ) : isRegister ? (
//                   t("auth.register")
//                 ) : (
//                   t("auth.login")
//                 )}
//               </Button>
//             </form>

//             <div className="mt-6 text-center">
//               <button
//                 type="button"
//                 onClick={() => setIsRegister(!isRegister)}
//                 className="text-sm text-stone-600 hover:text-primary transition-colors font-medium relative group"
//                 data-testid="toggle-mode-button"
//               >
//                 {isRegister
//                   ? t("auth.alreadyHaveAccount")
//                   : t("auth.dontHaveAccount")}
//                 <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
//               </button>
//             </div>
//           </motion.div>

//           {/* Demo Credentials */}
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.3 }}
//             className="mt-6 p-5 bg-gradient-to-br from-slate-50 to-stone-50 rounded-2xl border border-stone-200/50 shadow-sm"
//           >
//             <div className="flex items-start gap-3">
//               <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/25">
//                 <svg
//                   className="w-4 h-4 text-white"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                   />
//                 </svg>
//               </div>
//               <div className="flex-1">
//                 <p className="text-xs font-semibold text-stone-700 mb-2">
//                   {t("auth.demoCredentials")}:
//                 </p>
//                 <div className="space-y-1.5">
//                   <div className="flex items-center gap-2 text-xs">
//                     <span className="text-stone-500 font-medium w-12">
//                       Admin:
//                     </span>
//                     <code className="px-2 py-1 bg-white rounded-md text-stone-700 font-mono border border-stone-200/50">
//                       admin@gallery.com
//                     </code>
//                     <span className="text-stone-400">/</span>
//                     <code className="px-2 py-1 bg-white rounded-md text-stone-700 font-mono border border-stone-200/50">
//                       admin123
//                     </code>
//                   </div>
//                   <div className="flex items-center gap-2 text-xs">
//                     <span className="text-stone-500 font-medium w-12">
//                       Staff:
//                     </span>
//                     <code className="px-2 py-1 bg-white rounded-md text-stone-700 font-mono border border-stone-200/50">
//                       staff@gallery.com
//                     </code>
//                     <span className="text-stone-400">/</span>
//                     <code className="px-2 py-1 bg-white rounded-md text-stone-700 font-mono border border-stone-200/50">
//                       staff123
//                     </code>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </motion.div>

//           {/* Trust indicators */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.6, delay: 0.4 }}
//             className="mt-8 flex items-center justify-center gap-6 text-xs text-stone-500"
//           >
//             <div className="flex items-center gap-1.5">
//               <svg
//                 className="w-4 h-4 text-green-500"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//               <span>Secure Login</span>
//             </div>
//             <div className="w-1 h-1 bg-stone-300 rounded-full"></div>
//             <div className="flex items-center gap-1.5">
//               <svg
//                 className="w-4 h-4 text-blue-500"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
//                 <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
//               </svg>
//               <span>SSL Encrypted</span>
//             </div>
//             <div className="w-1 h-1 bg-stone-300 rounded-full"></div>
//             <div className="flex items-center gap-1.5">
//               <svg
//                 className="w-4 h-4 text-purple-500"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//               <span>Privacy Protected</span>
//             </div>
//           </motion.div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Package,
  ShoppingBag,
  Star,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import LanguageSelector from "@/components/LanguageSelector";

const FormField = ({
  label,
  type: initialType,
  value,
  onChange,
  icon: Icon,
  placeholder,
  autoComplete,
  error,
  testId,
}) => {
  const [showPwd, setShowPwd] = useState(false);
  const type =
    initialType === "password" ? (showPwd ? "text" : "password") : initialType;
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500">
          <Icon size={15} />
        </div>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          data-testid={testId}
          className={`w-full h-12 bg-[#14142a] border rounded-xl pl-10 pr-12 text-sm text-white placeholder-stone-600 outline-none transition-all duration-200 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 ${error ? "border-rose-500/60" : "border-white/10 hover:border-white/20"}`}
        />
        {initialType === "password" && (
          <button
            type="button"
            onClick={() => setShowPwd((v) => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors"
          >
            {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-rose-400 flex items-center gap-1.5 mt-1">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  );
};

const Login = () => {
  const { login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentQuote, setCurrentQuote] = useState(0);

  const quotes = [
    {
      text: "Every great business starts with great organisation.",
      author: "MRB Philosophy",
    },
    {
      text: "Your inventory is your wealth — track it wisely.",
      author: "Retail Wisdom",
    },
    {
      text: "Fast billing, happy customers, growing business.",
      author: "MRB System",
    },
  ];

  useEffect(() => {
    const id = setInterval(
      () => setCurrentQuote((q) => (q + 1) % quotes.length),
      4000,
    );
    return () => clearInterval(id);
  }, []);

  const validate = () => {
    const e = {};
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email, password);
      toast.success(t("auth.loginSuccess"));
      navigate("/");
    } catch (err) {
      const msg = err?.response?.data?.detail || "Invalid email or password";
      toast.error(msg);
      setErrors({ password: msg });
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (type) => {
    if (type === "admin") {
      setEmail("admin@gallery.com");
      setPassword("admin123");
    } else {
      setEmail("staff@gallery.com");
      setPassword("staff123");
    }
    setErrors({});
  };

  return (
    <div className="min-h-screen flex bg-[#0d0d1a]">
      {/* LEFT: Brand Panel */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80"
            alt="Home Decor"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d1a]/95 via-[#1c1c2e]/80 to-[#0d0d1a]/70" />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background:
                "radial-gradient(ellipse at 30% 60%, #f59e0b 0%, transparent 55%)",
            }}
          />
        </div>

        {/* Rotating rings */}
        <div className="absolute top-1/2 left-1/2 pointer-events-none">
          {[200, 320, 440, 560].map((size, i) => (
            <motion.div
              key={i}
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{
                duration: 60 + i * 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute rounded-full"
              style={{
                width: size,
                height: size,
                marginLeft: -size / 2,
                marginTop: -size / 2,
                border: "1px solid rgba(245,158,11,0.08)",
              }}
            />
          ))}
        </div>

        <div className="relative flex flex-col justify-between h-full p-10 z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src="/assets/logo.jpeg"
                  alt="MRB"
                  className="h-14 w-14 rounded-2xl object-cover ring-2 ring-amber-500/40 shadow-2xl"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 hidden items-center justify-center shadow-2xl ring-2 ring-amber-500/40">
                  <span className="text-white font-black text-2xl">M</span>
                </div>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#0d0d1a]" />
              </div>
              <div>
                <h2 className="text-white font-black text-xl tracking-wide">
                  MRB HOME DECOR
                </h2>
                <p className="text-amber-400/80 text-xs font-semibold tracking-widest uppercase">
                  Mall · POS System
                </p>
              </div>
            </div>
          </motion.div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/25 text-amber-400 text-xs font-bold px-4 py-2 rounded-full mb-6">
                <Star size={11} className="fill-amber-400" /> Premium Business
                Intelligence
              </div>
              <h1 className="text-4xl xl:text-5xl font-black text-white leading-[1.1] tracking-tight">
                Manage Smarter.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                  Sell Faster.
                </span>
              </h1>
              <p className="text-stone-400 text-base mt-4 leading-relaxed max-w-md">
                Complete inventory, billing &amp; analytics platform built for
                MRB Home Decor Mall.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 gap-3 max-w-md"
            >
              {[
                { icon: ShoppingBag, text: "GST & Non-GST Billing" },
                { icon: Package, text: "Live Inventory Tracking" },
                { icon: TrendingUp, text: "Sales Analytics" },
                { icon: ShieldCheck, text: "4-Role Access Control" },
              ].map((f, i) => {
                const FIcon = f.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5"
                  >
                    <div className="p-1.5 bg-amber-500/15 rounded-lg shrink-0">
                      <FIcon size={13} className="text-amber-400" />
                    </div>
                    <span className="text-stone-300 text-xs font-medium">
                      {f.text}
                    </span>
                  </div>
                );
              })}
            </motion.div>

            <div className="h-14">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuote}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-stone-300 text-sm italic">
                    "{quotes[currentQuote].text}"
                  </p>
                  <p className="text-amber-500/60 text-xs mt-1 font-medium">
                    — {quotes[currentQuote].author}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-6"
          >
            {[
              { icon: ShieldCheck, text: "Secure Login" },
              { icon: Zap, text: "99.9% Uptime" },
              { icon: Star, text: "Trusted System" },
            ].map(({ icon: TIcon, text }, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 text-stone-500 text-xs"
              >
                <TIcon size={12} className="text-emerald-500" />
                {text}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* RIGHT: Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0f0f1f] relative overflow-hidden px-6 py-10">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 70% 30%, rgba(245,158,11,0.05) 0%, transparent 60%)",
          }}
        />

        <div className="absolute top-5 right-5">
          <LanguageSelector />
        </div>

        {/* Mobile logo */}
        <div className="lg:hidden flex flex-col items-center mb-10">
          <div className="relative mb-3">
            <img
              src="/assets/logo.jpeg"
              alt="MRB"
              className="h-16 w-16 rounded-2xl object-cover ring-2 ring-amber-500/40"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 hidden items-center justify-center">
              <span className="text-white font-black text-2xl">M</span>
            </div>
          </div>
          <h1 className="text-white font-black text-xl tracking-wide text-center">
            MRB HOME DECOR MALL
          </h1>
          <p className="text-amber-400/70 text-xs font-semibold tracking-widest uppercase mt-1">
            POS System
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[400px] relative z-10"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-black text-white">Welcome back 👋</h2>
            <p className="text-stone-500 text-sm mt-1.5">
              Sign in to your MRB dashboard
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            data-testid="login-form"
          >
            <FormField
              label={t("auth.email")}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              placeholder="you@example.com"
              autoComplete="email"
              error={errors.email}
              testId="email-input"
            />

            <FormField
              label={t("auth.password")}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              placeholder="Your password"
              autoComplete="current-password"
              error={errors.password}
              testId="password-input"
            />

            <motion.button
              type="submit"
              disabled={loading}
              data-testid="submit-button"
              whileTap={{ scale: 0.98 }}
              className="w-full h-12 mt-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-900 font-black text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-xl shadow-amber-900/30 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {t("pos.pleaseWait")}
                </>
              ) : (
                <>
                  {t("auth.login")}
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </form>

          {/* Demo credentials */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-7 bg-[#1c1c2e] border border-white/8 rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-amber-500/15 rounded-lg">
                <Zap size={12} className="text-amber-400 fill-amber-400" />
              </div>
              <span className="text-stone-400 text-xs font-bold uppercase tracking-widest">
                {t("auth.demoCredentials")}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: "admin", label: "Admin", email: "admin@gallery.com" },
                { key: "staff", label: "Staff", email: "staff@gallery.com" },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => fillDemo(item.key)}
                  className="group flex flex-col items-start px-3 py-2.5 bg-white/5 hover:bg-amber-500/10 border border-white/8 hover:border-amber-500/30 rounded-xl transition-all text-left"
                >
                  <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                    {item.label}
                  </span>
                  <span className="text-xs text-stone-300 font-mono mt-0.5 truncate w-full">
                    {item.email}
                  </span>
                  <span className="text-[9px] text-amber-500/60 mt-1 group-hover:text-amber-400 transition-colors flex items-center gap-1">
                    Tap to fill <ArrowRight size={8} />
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          <div className="flex items-center justify-center gap-5 mt-7">
            {[
              { icon: ShieldCheck, text: "Secure Login" },
              { icon: Lock, text: "SSL Encrypted" },
              { icon: ShieldCheck, text: "Privacy Protected" },
            ].map(({ icon: TIcon, text }, i) => (
              <div
                key={i}
                className="flex items-center gap-1 text-stone-600 text-[10px]"
              >
                <TIcon size={10} className="text-emerald-600" />
                {text}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
