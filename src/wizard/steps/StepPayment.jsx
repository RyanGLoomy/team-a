import React, { useMemo } from "react";
import { calcFlatInstallment } from "../../lib/finance.js";

const TENORS = [12, 24, 36, 48, 60, 72, 84, 96, 108, 120];

function PayCard({ active, title, desc, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        "text-left p-5 rounded-2xl border transition w-full",
        active
          ? "bg-obsidian/60 border-rolex/60"
          : "bg-obsidian/35 border-ivory/10 hover:border-ivory/20",
      ].join(" ")}
    >
      <div className="text-ivory">{title}</div>
      <div className="mt-1 text-sm text-muted">{desc}</div>
    </button>
  );
}

export default function StepPayment({ value, onChange, pricing, onNext, onBack, navLocked }) {
  const dpAmount = useMemo(() => pricing.total * (value.dp ?? 0), [pricing.total, value.dp]);

  const credit = useMemo(() => {
    if (value.method !== "credit") return null;
    return calcFlatInstallment({
      totalPrice: pricing.total,
      dpAmount,
      months: value.tenor,
      annualRate: 0.12,
    });
  }, [value.method, value.tenor, pricing.total, dpAmount]);

  return (
    <div>
      <div className="text-xs tracking-luxe uppercase text-muted">Step 03</div>
      <h2 className="mt-2 text-2xl md:text-3xl">Pilih metode pembayaran</h2>
      <p className="mt-3 text-muted leading-relaxed">
        Cash atau Credit. Untuk credit ditampilkan simulasi bunga flat 12% dan angsuran per bulan.
      </p>

      <div className="mt-6 grid md:grid-cols-2 gap-3">
        <PayCard
          active={value.method === "cash"}
          title="Cash"
          desc="Bayar tunai setelah finalisasi spesifikasi."
          onClick={() => onChange((p) => ({ ...p, method: "cash" }))}
        />
        <PayCard
          active={value.method === "credit"}
          title="Credit"
          desc="Tentukan DP & tenor (12–120 bulan)."
          onClick={() => onChange((p) => ({ ...p, method: "credit" }))}
        />
      </div>

      {value.method === "credit" && (
        <div className="mt-6 rounded-2xl bg-obsidian/50 border border-ivory/10 p-5">
          <div className="text-xs tracking-luxe uppercase text-muted">DP & Tenor</div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">DP</span>
              <span className="text-ivory tabular-nums">
                {Math.round((value.dp ?? 0) * 100)}% · Rp {dpAmount.toLocaleString("id-ID")}
              </span>
            </div>
            <input
              className="mt-3 w-full"
              type="range"
              min={10}
              max={60}
              step={5}
              value={Math.round((value.dp ?? 0.2) * 100)}
              onChange={(e) =>
                onChange((p) => ({ ...p, dp: Number(e.target.value) / 100 }))
              }
            />
            <div className="mt-1 text-xs text-muted">Range 10% – 60% (step 5%)</div>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Tenor</span>
              <span className="text-ivory tabular-nums">{value.tenor} bulan</span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {TENORS.map((t) => (
                <button
                  key={t}
                  onClick={() => onChange((p) => ({ ...p, tenor: t }))}
                  className={[
                    "px-3 py-2 rounded-xl text-xs tracking-luxe uppercase border transition",
                    value.tenor === t
                      ? "bg-rolex border-rolex/60 text-ivory"
                      : "bg-obsidian/35 border-ivory/10 text-muted hover:text-ivory hover:border-ivory/20",
                  ].join(" ")}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {credit && (
            <div className="mt-6 grid md:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-obsidian/40 border border-ivory/10">
                <div className="text-xs tracking-luxe uppercase text-muted">Pokok Kredit</div>
                <div className="mt-2 text-ivory tabular-nums">
                  Rp {credit.principal.toLocaleString("id-ID")}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-obsidian/40 border border-ivory/10">
                <div className="text-xs tracking-luxe uppercase text-muted">Total Bunga (12% Flat)</div>
                <div className="mt-2 text-ivory tabular-nums">
                  Rp {credit.totalInterest.toLocaleString("id-ID")}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-obsidian/40 border border-ivory/10">
                <div className="text-xs tracking-luxe uppercase text-muted">Total Bayar</div>
                <div className="mt-2 text-ivory tabular-nums">
                  Rp {credit.totalPayable.toLocaleString("id-ID")}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-obsidian/40 border border-ivory/10">
                <div className="text-xs tracking-luxe uppercase text-muted">Angsuran / Bulan</div>
                <div className="mt-2 text-2xl text-ivory tabular-nums">
                  Rp {Math.round(credit.monthly).toLocaleString("id-ID")}
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 text-xs text-muted">
            Catatan: Simulasi ini untuk kebutuhan studi kasus (bunga flat 12%).
          </div>
        </div>
      )}

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
          onClick={onNext}
          disabled={navLocked}
          className={[
            "px-5 py-3 rounded-xl bg-rolex text-xs tracking-luxe uppercase shadow-soft transition",
            navLocked ? "opacity-50 cursor-not-allowed" : "hover:brightness-110",
          ].join(" ")}
        >
          Next
        </button>
      </div>
    </div>
  );
}
