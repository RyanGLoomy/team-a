import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function RequireAdmin() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    async function init() {
      if (!supabase) {
        if (mounted) {
          setSession(null);
          setLoading(false);
        }
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (mounted) {
        setSession(data.session ?? null);
        setLoading(false);
      }
    }

    init();

    if (!supabase) return;
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s ?? null);
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center text-white/70">
        <div className="text-sm">Checking admin session…</div>
      </div>
    );
  }

  if (!supabase) {
    return (
      <div className="min-h-[60vh] grid place-items-center px-6 text-center">
        <div className="max-w-lg rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-white text-lg font-semibold">Supabase not configured</div>
          <p className="mt-2 text-white/70 text-sm">
            Set <code className="text-white">VITE_SUPABASE_URL</code> dan{" "}
            <code className="text-white">VITE_SUPABASE_ANON_KEY</code> (local: .env, deploy: Vercel env vars).
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
