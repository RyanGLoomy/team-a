import React from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import LuxuryButton from "./LuxuryButton.jsx";

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `text-xs tracking-luxe uppercase transition ${
        isActive ? "text-ivory" : "text-muted hover:text-ivory"
      }`
    }
  >
    {children}
  </NavLink>
);

export default function Layout() {
  const nav = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen text-ivory">
      <div className="sticky top-0 z-50 backdrop-blur bg-obsidian/55 border-b border-ivory/5">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => nav("/")}
            className="flex items-center gap-3 hover:opacity-95 transition"
            aria-label="Team Adhit"
          >
            <div className="flex items-baseline gap-2">
              <span className="text-sm md:text-base font-semibold tracking-tight">
                Team Adhit
              </span>
              <span className="text-xs md:text-sm text-muted tracking-luxe">
                · Custom Home
              </span>
            </div>
</button>

          <div className="hidden md:flex gap-6 items-center">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/configurator">Configurator</NavItem>
          </div>

          <LuxuryButton variant="accent" onClick={() => nav("/configurator")} className="px-4 py-2">
            Start Build
          </LuxuryButton>
        </div>
      </div>

      <main className={isHome ? "w-full" : "mx-auto max-w-6xl px-4"}>
        <Outlet />
      </main>

      <footer className="mt-20 border-t border-ivory/5">
        <div className="mx-auto max-w-6xl px-4 py-10 text-muted text-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              © {new Date().getFullYear()} Team Adhit — Custom Build Experience.
            </div>
            <NavLink to="/admin" className="text-xs tracking-luxe uppercase hover:text-ivory">
              Admin
            </NavLink>
          </div>
        </div>
      </footer>
    </div>
  );
}
