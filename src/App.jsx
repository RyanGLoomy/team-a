import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Loader from "./components/Loader.jsx";
import Layout from "./components/Layout.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import Configurator from "./pages/Configurator.jsx";
import Success from "./pages/Success.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminLeads from "./pages/admin/AdminLeads.jsx";
import AdminLeadDetail from "./pages/admin/AdminLeadDetail.jsx";
import RequireAdmin from "./pages/admin/RequireAdmin.jsx";
import { LenisProvider } from "./lib/lenis.jsx";

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Keep loader subtle: short branded fade so it feels premium (not "fake loading").
    const t = setTimeout(() => setReady(true), 420);
    return () => clearTimeout(t);
  }, []);

  return (
    <LenisProvider>
      <Loader show={!ready} />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/configurator" element={<Configurator />} />
          <Route path="/success" element={<Success />} />

          {/* Admin (minimal) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={<AdminLeads />} />
            <Route path="/admin/leads/:id" element={<AdminLeadDetail />} />
          </Route>
        </Route>
      </Routes>
    </LenisProvider>
  );
}
