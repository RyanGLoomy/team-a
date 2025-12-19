import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

function formatIDR(value) {
  const n = Number(value ?? 0);
  try {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `Rp ${Math.round(n).toLocaleString("id-ID")}`;
  }
}

const STATUS = [
  { key: "new", label: "New" },
  { key: "contacted", label: "Contacted" },
  { key: "closed", label: "Closed" },
];

export default function AdminLeads() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  async function load() {
    if (!supabase) return;
    setLoading(true);
    setError("");
    try {
      let query = supabase
        .from("leads")
        .select(
          "id, created_at, full_name, phone, email, house_size, total_price, payment_method, status"
        )
        .order("created_at", { ascending: false });

      // Server-side filters are optional; we do client filter to keep it simple.
      const { data, error: err } = await query;
      if (err) throw err;
      setRows(data ?? []);
    } catch (ex) {
      setError(ex?.message || "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (rows ?? []).filter((r) => {
      if (status !== "all" && (r.status ?? "new") !== status) return false;
      if (!term) return true;
      const hay = `${r.full_name ?? ""} ${r.phone ?? ""} ${r.email ?? ""}`.toLowerCase();
      return hay.includes(term);
    });
  }, [rows, q, status]);

  async function updateStatus(id, next) {
    if (!supabase) return;
    setRows((prev) => prev.map((x) => (x.id === id ? { ...x, status: next } : x)));
    const { error: err } = await supabase.from("leads").update({ status: next }).eq("id", id);
    if (err) {
      // revert
      await load();
      alert(err.message);
    }
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
  }

  return (
    <div className="py-10 md:py-14">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs tracking-luxe uppercase text-muted">Admin</div>
          <h1 className="mt-2 text-3xl md:text-4xl">Leads</h1>
          <p className="mt-2 text-muted text-sm">
            Data yang masuk dari form konfigurator (public). Admin bisa melihat & ubah status.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="px-4 py-2 rounded-xl bg-obsidian/40 border border-ivory/10 text-xs tracking-luxe uppercase hover:border-ivory/20 transition"
          >
            View Site
          </Link>
          <button
            onClick={signOut}
            className="px-4 py-2 rounded-xl bg-white text-black text-xs tracking-luxe uppercase font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-graphite border border-ivory/10 p-4 md:p-5 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:justify-between">
          <div className="flex gap-2 w-full md:w-auto">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name/phone/email…"
              className="w-full md:w-80 rounded-xl border border-ivory/10 bg-obsidian/40 px-3 py-2 text-sm text-ivory outline-none focus:ring-2 focus:ring-rolex/40"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-xl border border-ivory/10 bg-obsidian/40 px-3 py-2 text-sm text-ivory"
            >
              <option value="all">All status</option>
              {STATUS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={load}
            className="px-4 py-2 rounded-xl bg-obsidian/40 border border-ivory/10 text-xs tracking-luxe uppercase hover:border-ivory/20 transition"
          >
            Refresh
          </button>
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-pink-400/30 bg-pink-500/10 px-4 py-3 text-sm text-pink-100">
            {error}
          </div>
        ) : null}

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead>
              <tr className="text-left text-muted">
                <th className="py-2">Created</th>
                <th className="py-2">Name</th>
                <th className="py-2">Phone</th>
                <th className="py-2">Size</th>
                <th className="py-2">Payment</th>
                <th className="py-2">Total</th>
                <th className="py-2">Status</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-6 text-muted">
                    Loading…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-6 text-muted">
                    No data.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="border-t border-ivory/10">
                    <td className="py-3 text-muted tabular-nums">
                      {new Date(r.created_at).toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 text-ivory">{r.full_name}</td>
                    <td className="py-3 text-ivory">{r.phone}</td>
                    <td className="py-3 text-ivory">{r.house_size}</td>
                    <td className="py-3 text-ivory uppercase">{r.payment_method}</td>
                    <td className="py-3 text-ivory tabular-nums">{formatIDR(r.total_price)}</td>
                    <td className="py-3">
                      <select
                        value={r.status ?? "new"}
                        onChange={(e) => updateStatus(r.id, e.target.value)}
                        className="rounded-xl border border-ivory/10 bg-obsidian/40 px-3 py-2 text-xs text-ivory"
                      >
                        {STATUS.map((s) => (
                          <option key={s.key} value={s.key}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3">
                      <Link
                        to={`/admin/leads/${r.id}`}
                        className="text-xs text-ivory/80 hover:text-ivory underline"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
