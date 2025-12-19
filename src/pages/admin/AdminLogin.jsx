import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function AdminLogin() {
   const nav = useNavigate();
   const location = useLocation();
   const from = useMemo(() => {
      const target = location.state?.from?.pathname;
      return typeof target === "string" ? target : "/admin";
   }, [location.state]);

   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");

   async function onSubmit(e) {
      e.preventDefault();
      setError("");
      if (!supabase) {
         setError("Supabase is not configured. Set env vars first.");
         return;
      }
      setLoading(true);
      try {
         const { error: err } = await supabase.auth.signInWithPassword({
            email,
            password,
         });
         if (err) throw err;
         nav(from, { replace: true });
      } catch (ex) {
         setError(ex?.message || "Login failed");
      } finally {
         setLoading(false);
      }
   }

   return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
         <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg">
            <div className="text-white text-xl font-semibold">Admin Login</div>
            <p className="mt-1 text-white/70 text-sm">
               Panel admin minimal untuk mengelola data leads (tugas).
            </p>

            {error ? (
               <div className="mt-4 rounded-xl border border-pink-400/30 bg-pink-500/10 px-4 py-3 text-sm text-pink-100">
                  {error}
               </div>
            ) : null}

            <form onSubmit={onSubmit} className="mt-5 space-y-3">
               <div>
                  <label className="text-xs text-white/60">Email</label>
                  <input
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     type="email"
                     required
                     className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-pink-400/40"
                     placeholder="nama@gmail.com"
                  />
               </div>
               <div>
                  <label className="text-xs text-white/60">Password</label>
                  <input
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     type="password"
                     required
                     className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-pink-400/40"
                     placeholder="••••••••"
                  />
               </div>
               <button
                  disabled={loading}
                  className="w-full rounded-xl bg-white text-black px-4 py-2 text-sm font-semibold disabled:opacity-60"
               >
                  {loading ? "Signing in…" : "Sign in"}
               </button>
            </form>

            <div className="mt-4 flex items-center justify-between text-xs text-white/50">
               <Link to="/" className="hover:text-white">
                  ← Back to site
               </Link>
               <span>Route: /admin</span>
            </div>
         </div>
      </div>
   );
}
