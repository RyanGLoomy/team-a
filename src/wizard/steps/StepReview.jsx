import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { OPTIONS, getById, getOptionPrice } from "../../lib/pricing.js";
import { calcFlatInstallment } from "../../lib/finance.js";
import { supabase } from "../../lib/supabase.js";

const CATS = [
  { key: "size", label: "Ukuran" },
  { key: "foundation", label: "Pondasi" },
  { key: "walls", label: "Dinding" },
  { key: "floor", label: "Lantai" },
  { key: "frame", label: "Kaso & Reng" },
  { key: "roof", label: "Genteng" },
  { key: "ceiling", label: "Plafon" },
  { key: "doors", label: "Pintu & Jendela" },
  { key: "electricity", label: "Daya Listrik" },
  { key: "fence", label: "Pagar" },
];

export default function StepReview({ selections, payment, identity, pricing, onBack, navLocked }) {
  const nav = useNavigate();
  const [ok, setOk] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const dpAmount = useMemo(() => pricing.total * (payment.dp ?? 0), [pricing.total, payment.dp]);

  const credit = useMemo(() => {
    if (payment.method !== "credit") return null;
    return calcFlatInstallment({
      totalPrice: pricing.total,
      dpAmount,
      months: payment.tenor,
      annualRate: 0.12,
    });
  }, [payment.method, payment.tenor, pricing.total, dpAmount]);

  const summary = useMemo(() => {
    return CATS.map((c) => {
      if (c.key === "size") {
        const s = getById(OPTIONS.size, selections.size);
        return { label: c.label, value: s?.label ?? "-", price: s?.base ?? 0 };
      }
      const picked = getById(OPTIONS[c.key], selections[c.key]);
      return { label: c.label, value: picked?.label ?? "-", price: getOptionPrice(c.key, selections[c.key], selections.size) };
    });
  }, [selections]);

  const submit = async () => {
    setSubmitting(true);

    const payload = {
      createdAt: new Date().toISOString(),
      pricing,
      selections,
      payment,
      identity,
      credit,
    };

    // Always keep local copy for demo / offline
    localStorage.setItem("trias_last_order", JSON.stringify(payload));
    console.log("ORDER_PAYLOAD:", payload);

    // If Supabase is configured, also insert to DB
    if (supabase) {
      try {
        const dpNum = payment.method === "credit" ? dpAmount : null;
        const months = payment.method === "credit" ? payment.tenor : null;
        const monthly = payment.method === "credit" && credit ? Math.round(credit.monthly) : null;

        const insertRow = {
          company: "Team Adhit",
          house_size: selections.size,
          specs: selections,
          total_price: pricing.total,
          payment_method: payment.method,
          dp: dpNum,
          tenor_months: months,
          interest_rate: 0.12,
          monthly_installment: monthly,
          full_name: identity.fullName,
          phone: identity.phone,
          email: identity.email || null,
          address: identity.address || null,
          contact_person: identity.contactPerson || null,
          notes: identity.notes || null,
          status: "new",
        };

        const { error } = await supabase.from("leads").insert([insertRow]);
        if (error) throw error;
      } catch (e) {
        // Don't block UX for task demo, but log for debugging
        console.warn("Supabase insert failed:", e);
      }
    }

    // delay kecil biar terasa “premium submit”
    await new Promise((r) => setTimeout(r, 600));
    nav("/success");
  };

  return (
    <div>
      <div className="text-xs tracking-luxe uppercase text-muted">Step 05</div>
      <h2 className="mt-2 text-2xl md:text-3xl">Review & Konfirmasi</h2>
      <p className="mt-3 text-muted leading-relaxed">
        Pastikan spesifikasi & pembayaran sudah benar. Setelah submit, tim akan menghubungi calon konsumen.
      </p>

      <div className="mt-6 grid lg:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-obsidian/50 border border-ivory/10 p-5">
          <div className="text-xs tracking-luxe uppercase text-muted">Spesifikasi</div>
          <div className="mt-4 space-y-2 text-sm">
            {summary.map((x) => (
              <div key={x.label} className="flex items-start justify-between gap-3">
                <span className="text-muted">{x.label}</span>
                <span className="text-ivory text-right">
                  {x.value}
                  <span className="block text-muted tabular-nums">
                    Rp {x.price.toLocaleString("id-ID")}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-obsidian/50 border border-ivory/10 p-5">
          <div className="text-xs tracking-luxe uppercase text-muted">Pembayaran</div>

          <div className="mt-4 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-muted">Metode</span>
              <span className="text-ivory uppercase">{payment.method}</span>
            </div>

            {payment.method === "credit" && credit && (
              <>
                <div className="mt-2 flex justify-between gap-3">
                  <span className="text-muted">DP</span>
                  <span className="text-ivory tabular-nums">
                    {Math.round((payment.dp ?? 0) * 100)}% · Rp {dpAmount.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="mt-2 flex justify-between gap-3">
                  <span className="text-muted">Tenor</span>
                  <span className="text-ivory tabular-nums">{payment.tenor} bulan</span>
                </div>
                <div className="mt-4 p-4 rounded-xl bg-obsidian/40 border border-ivory/10">
                  <div className="text-xs tracking-luxe uppercase text-muted">Angsuran / Bulan</div>
                  <div className="mt-2 text-2xl text-ivory tabular-nums">
                    Rp {Math.round(credit.monthly).toLocaleString("id-ID")}
                  </div>
                  <div className="mt-1 text-xs text-muted">Bunga flat 12% (simulasi)</div>
                </div>
              </>
            )}

            <div className="mt-4 p-4 rounded-xl bg-obsidian/40 border border-ivory/10">
              <div className="text-xs tracking-luxe uppercase text-muted">Total Estimasi</div>
              <div className="mt-2 text-2xl text-ivory tabular-nums">
                Rp {pricing.total.toLocaleString("id-ID")}
              </div>
              <div className="mt-1 text-xs text-muted">
                Base Rp {pricing.base.toLocaleString("id-ID")} · Material Rp {pricing.materials.toLocaleString("id-ID")}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-graphite border border-ivory/10 p-5">
        <div className="text-xs tracking-luxe uppercase text-muted">Identitas</div>
        <div className="mt-3 grid md:grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-muted">Nama</div>
            <div className="text-ivory">{identity.fullName || "-"}</div>
          </div>
          <div>
            <div className="text-muted">No. HP/WA</div>
            <div className="text-ivory">{identity.phone || "-"}</div>
          </div>
          <div>
            <div className="text-muted">Email</div>
            <div className="text-ivory">{identity.email || "-"}</div>
          </div>
          <div>
            <div className="text-muted">Contact Person</div>
            <div className="text-ivory">{identity.contactPerson || "-"}</div>
          </div>
        </div>
      </div>

      <label className="mt-6 flex items-start gap-3 text-sm text-muted">
        <input
          type="checkbox"
          className="mt-1"
          checked={ok}
          onChange={(e) => setOk(e.target.checked)}
        />
        <span>
          Saya sudah yakin dengan kustomisasi material & detail pembayaran, dan siap submit pesanan.
        </span>
      </label>

      <div className="mt-7 flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          disabled={navLocked}
          className={[
            "px-5 py-3 rounded-xl bg-obsidian/40 border border-ivory/10 text-xs tracking-luxe uppercase transition",
            navLocked ? "opacity-50 cursor-not-allowed" : "hover:border-ivory/20",
          ].join(" ")}
        >
          Back
        </button>

        <button
          onClick={submit}
          disabled={navLocked || !ok || submitting}
          className={[
            "px-5 py-3 rounded-xl text-xs tracking-luxe uppercase shadow-soft transition",
            !navLocked && ok && !submitting
              ? "bg-rolex hover:brightness-110"
              : "bg-ivory/10 text-muted cursor-not-allowed",
          ].join(" ")}
        >
          {submitting ? "Submitting..." : "Submit Order"}
        </button>
      </div>
    </div>
  );
}
