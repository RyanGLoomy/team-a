import React from "react";
import { OPTIONS } from "../../lib/pricing.js";

function Card({ active, title, subtitle, onClick }) {
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
      <div className="mt-1 text-sm text-muted">{subtitle}</div>
    </button>
  );
}

export default function StepSize({ value, onChange, pricing, onNext }) {
  return (
    <div>
      <div className="text-xs tracking-luxe uppercase text-muted">Step 01</div>
      <h2 className="mt-2 text-2xl md:text-3xl">Pilih ukuran rumah</h2>
      <p className="mt-3 text-muted leading-relaxed">
        Tentukan ukuran sebagai basis harga. Setelah itu lanjut pilih material.
      </p>

      <div className="mt-6 grid md:grid-cols-3 gap-3">
        {OPTIONS.size.map((opt) => (
          <Card
            key={opt.id}
            active={value.size === opt.id}
            title={opt.label}
            subtitle={`Base Rp ${opt.base.toLocaleString("id-ID")}`}
            onClick={() => onChange((s) => ({ ...s, size: opt.id }))}
          />
        ))}
      </div>

      <div className="mt-7 flex items-center justify-between gap-4">
        <div className="text-sm text-muted">
          Estimasi saat ini:{" "}
          <span className="text-ivory">
            Rp {pricing.total.toLocaleString("id-ID")}
          </span>
        </div>
        <button
          onClick={onNext}
          className="px-5 py-3 rounded-xl bg-rolex text-xs tracking-luxe uppercase shadow-soft hover:brightness-110 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}
