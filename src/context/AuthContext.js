// import React, { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";
// import { can, canView } from "../components/utils/Permissions";

// const AuthContext = createContext();

// const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within AuthProvider");
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem("token"));
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (token) {
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//       fetchUser();
//     } else {
//       setLoading(false);
//     }
//   }, [token]);

//   const fetchUser = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/auth/me`);
//       setUser(response.data);
//     } catch (error) {
//       console.error("Failed to fetch user:", error);
//       logout();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (email, password) => {
//     const response = await axios.post(`${API_URL}/auth/login`, {
//       email,
//       password,
//     });
//     const { token: newToken, user: userData } = response.data;
//     localStorage.setItem("token", newToken);
//     setToken(newToken);
//     setUser(userData);
//     axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
//   };

//   const register = async (email, password, name, role = "staff") => {
//     await axios.post(`${API_URL}/auth/register`, {
//       email,
//       password,
//       name,
//       role,
//     });
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setToken(null);
//     setUser(null);
//     delete axios.defaults.headers.common["Authorization"];
//   };

//   // ── Convenience permission helpers ──────────────────────────
//   // Use these throughout the app instead of user?.role === 'admin' checks.

//   /** Check a specific permission string, e.g. can('pos.create') */
//   const userCan = (permission) => can(user, permission);

//   /** Check if a nav section should be visible, e.g. canSee('pos') */
//   const canSee = (section) => canView(user, section);

//   // ── Role booleans ────────────────────────────────────────────
//   const isFullAdmin = user?.role === "admin";
//   const isBilling = user?.role === "billing";
//   const isManager = user?.role === "manager";
//   const isStaff = user?.role === "staff";

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         token,
//         loading,
//         login,
//         register,
//         logout,
//         // permission helpers
//         userCan,
//         canSee,
//         // role booleans
//         isFullAdmin,
//         isBilling,
//         isManager,
//         isStaff,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import axios from "axios";
import { can, canView } from "../components/utils/Permissions";

const AuthContext = createContext();
const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

// ── localStorage helpers ───────────────────────────────────────
const LS_TOKEN = "mrb_token";
const LS_USER = "mrb_user";

const saveSession = (token, user) => {
  localStorage.setItem(LS_TOKEN, token);
  localStorage.setItem(LS_USER, JSON.stringify(user));
};

const clearSession = () => {
  localStorage.removeItem(LS_TOKEN);
  localStorage.removeItem(LS_USER);
};

const loadSession = () => {
  try {
    const token = localStorage.getItem(LS_TOKEN);
    const user = JSON.parse(localStorage.getItem(LS_USER) || "null");
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
};

// ─────────────────────────────────────────────────────────────
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const { token: savedToken, user: savedUser } = loadSession();

  // Restore both token AND user immediately from localStorage —
  // no flash to login screen while /auth/me is in-flight
  const [user, setUser] = useState(savedUser);
  const [token, setToken] = useState(savedToken);
  const [loading, setLoading] = useState(!!savedToken); // only show loading if we have a token to verify

  // Prevent double-verification on strict mode double-mount
  const verifying = useRef(false);

  // Set axios default header whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // On mount: silently re-verify the token with the server.
  // • If valid  → update user data in case role/name changed
  // • If 401    → token is truly expired/invalid → logout
  // • If network error or 5xx → keep existing session (don't log out)
  useEffect(() => {
    if (!savedToken || verifying.current) {
      setLoading(false);
      return;
    }
    verifying.current = true;

    axios
      .get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${savedToken}` },
        timeout: 8000, // don't hang forever
      })
      .then((res) => {
        setUser(res.data);
        saveSession(savedToken, res.data);
      })
      .catch((err) => {
        const status = err.response?.status;
        if (status === 401 || status === 403) {
          // Token is genuinely invalid/expired — force re-login
          clearSession();
          setToken(null);
          setUser(null);
          delete axios.defaults.headers.common["Authorization"];
        }
        // For network errors (status undefined), timeouts, 5xx — do nothing.
        // User stays logged in with locally cached data.
      })
      .finally(() => {
        setLoading(false);
        verifying.current = false;
      });
  }, []); // run once on mount

  // ── login ──────────────────────────────────────────────────
  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    const { token: newToken, user: userData } = res.data;
    axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    saveSession(newToken, userData);
    setToken(newToken);
    setUser(userData);
  };

  // ── logout ─────────────────────────────────────────────────
  const logout = () => {
    clearSession();
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  // ── register (admin creates users) ────────────────────────
  const register = async (email, password, name, role = "staff") => {
    await axios.post(`${API_URL}/auth/register`, {
      user_data: { email, password, name, role },
    });
  };

  // ── Permission helpers ─────────────────────────────────────
  const userCan = (permission) => can(user, permission);
  const canSee = (section) => canView(user, section);

  // ── Role booleans ──────────────────────────────────────────
  const isFullAdmin = user?.role === "admin";
  const isBilling = user?.role === "billing";
  const isManager = user?.role === "manager";
  const isStaff = user?.role === "staff";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        register,
        userCan,
        canSee,
        isFullAdmin,
        isBilling,
        isManager,
        isStaff,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
