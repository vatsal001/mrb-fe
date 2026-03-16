import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Inventory from "@/pages/Inventory";
import POS from "@/pages/POS";
import Orders from "@/pages/Orders";
import DayBook from "@/pages/DayBook";
import Reports from "@/pages/Reports";
import Attendance from "@/pages/Attendance";

import Users from "@/pages/Users";
import LocationsRacks from "@/pages/LocationsRacks";
import StockTransfers from "@/pages/StockTransfers";
import RackView from "@/pages/RackView";
import Layout from "@/components/Layout";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import "@/App.css";
import Commission from "./pages/Commition";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="locations-racks" element={<LocationsRacks />} />
            <Route path="stock-transfers" element={<StockTransfers />} />
            <Route path="rack/:rackId" element={<RackView />} />
            <Route path="pos" element={<POS />} />
            <Route path="daybook" element={<DayBook />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="orders" element={<Orders />} />
            <Route path="commissions" element={<Commission />} />

            <Route path="reports" element={<Reports />} />
            <Route path="users" element={<Users />} />
          </Route>
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
