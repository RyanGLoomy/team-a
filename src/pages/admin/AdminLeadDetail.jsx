import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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

export default function AdminLeadDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [row, setRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [nextStatus, setNextStatus] = useState("new");

  async function load() {
    if (!supabase) return;
    setLoading(true);
    setError("");
    try {
      const { data, error: err } = await supabase
        .from("leads")
        .select("*")
        .eq("id", id)
        .single();
      if (err) throw err;
      setRow(data);
      setNextStatus(data?.status ?? "new");
    } catch (ex) {
      setError(ex?.message || "Failed to load lead");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const specsPretty = useMemo(() => {
    try {
      return JSON.stringify(row?.specs ?? {}, null, 2);
    } catch {
      return "{}";
    }
  }, [row?.specs]);

  async function saveStatus() {
    if (!supabase || !row) return;
    setSaving(true);
    const { error: err } = await supabase
      .from("leads")
      .update({ status: nextStatus })
      .eq("id", row.id);
    setSaving(false);
    if (err) {
      alert(err.message);
      return;
    }
    await load();
  }

  if (loading) {
    return (
      <div className="py-10 md:py-14 text-muted">Loading…</div>
    );
  }

  if (error) {
    return (
      <div className="py-10 md:py-14">
        <div className="rounded-xl border border-pink-400/30 bg-pink-500/10 px-4 py-3 text-sm text-pink-100">
          {error}
        </div>
        <div className="mt-4">
          <Link to="/admin" className="underline text-ivory/80 hover:text-ivory">
            ← Back
          </Link>
        </div>
      </div>
    );
  }

  if (!row) {
    return (
      <div className="py-10 md:py-14 text-muted">Not found.</div>
    );
  }

  return (
    <div className="py-10 md:py-14">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs tracking-luxe uppercase text-muted">Lead Detail</div>
          <h1 className="mt-2 text-2xl md:text-3xl text-ivory">{row.full_name}</h1>
          <div className="mt-1 text-sm text-muted tabular-nums">
            {new Date(row.created_at).toLocaleString("id-ID")} · ID: {row.id}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => nav(-1)}
            className="px-4 py-2 rounded-xl bg-obsidian/40 border border-ivory/10 text-xs tracking-luxe uppercase hover:border-ivory/20 transition"
          >
            Back
          </button>
          <Link
            to="/admin"
            className="px-4 py-2 rounded-xl bg-obsidian/40 border border-ivory/10 text-xs tracking-luxe uppercase hover:border-ivory/20 transition"
          >
            Leads
          </Link>
        </div>
      </div>

      <div className="mt-6 grid lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5 rounded-2xl bg-graphite border border-ivory/10 p-5 shadow-soft">
          <div className="text-xs tracking-luxe uppercase text-muted">Contact</div>
          <div className="mt-4 space-y-3 text-sm">
            <div>
              <div className="text-muted">Phone</div>
              <div className="text-ivory">{row.phone}</div>
            </div>
            <div>
              <div className="text-muted">Email</div>
              <div className="text-ivory">{row.email || "-"}</div>
            </div>
            <div>
              <div className="text-muted">Address</div>
              <div className="text-ivory">{row.address || "-"}</div>
            </div>
            <div>
              <div className="text-muted">Contact Person</div>
              <div className="text-ivory">{row.contact_person || "-"}</div>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-obsidian/40 border border-ivory/10 p-4">
            <div className="text-xs tracking-luxe uppercase text-muted">Status</div>
            <div className="mt-2 flex items-center gap-2">
              <select
                value={nextStatus}
                onChange={(e) => setNextStatus(e.target.value)}
                className="rounded-xl border border-ivory/10 bg-obsidian/40 px-3 py-2 text-xs text-ivory"
              >
                {STATUS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
              <button
                onClick={saveStatus}
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-white text-black text-xs tracking-luxe uppercase font-semibold disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 rounded-2xl bg-graphite border border-ivory/10 p-5 shadow-soft">
          <div className="text-xs tracking-luxe uppercase text-muted">Order</div>

          <div className="mt-4 grid md:grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-muted">Company</div>
              <div className="text-ivory">{row.company}</div>
            </div>
            <div>
              <div className="text-muted">House Size</div>
              <div className="text-ivory">{row.house_size}</div>
            </div>
            <div>
              <div className="text-muted">Payment</div>
              <div className="text-ivory uppercase">{row.payment_method}</div>
            </div>
            <div>
              <div className="text-muted">Total</div>
              <div className="text-ivory tabular-nums">{formatIDR(row.total_price)}</div>
            </div>
            <div>
              <div className="text-muted">DP</div>
              <div className="text-ivory tabular-nums">{row.dp ? formatIDR(row.dp) : "-"}</div>
            </div>
            <div>
              <div className="text-muted">Tenor</div>
              <div className="text-ivory tabular-nums">{row.tenor_months ? `${row.tenor_months} bulan` : "-"}</div>
            </div>
            <div>
              <div className="text-muted">Angsuran / bulan</div>
              <div className="text-ivory tabular-nums">
                {row.monthly_installment ? formatIDR(row.monthly_installment) : "-"}
              </div>
            </div>
            <div>
              <div className="text-muted">Notes</div>
              <div className="text-ivory">{row.notes || "-"}</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-xs tracking-luxe uppercase text-muted">Specs (JSON)</div>
            <pre className="mt-2 max-h-[420px] overflow-auto rounded-xl border border-ivory/10 bg-obsidian/40 p-4 text-xs text-ivory/90">
{specsPretty}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
