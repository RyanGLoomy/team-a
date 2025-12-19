import React, { useEffect, useMemo, useRef, useState } from "react";
import { OPTIONS, getById } from "../../lib/pricing.js";

const CATS = [
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

function Tab({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        "px-3 py-2 rounded-xl text-xs tracking-luxe uppercase transition border",
        active
          ? "bg-obsidian/60 border-rolex/60 text-ivory"
          : "bg-obsidian/35 border-ivory/10 text-muted hover:text-ivory hover:border-ivory/20",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function OptionCard({ active, title, subtitle, info, onClick }) {
  const [showInfo, setShowInfo] = useState(false);
  const tRef = useRef(null);

  const clearTimer = () => {
    if (tRef.current) {
      clearTimeout(tRef.current);
      tRef.current = null;
    }
  };

  const startTimer = () => {
    clearTimer();
    // tampilkan info setelah hover/hold ~2.2 detik
    tRef.current = setTimeout(() => setShowInfo(true), 2200);
  };

  const stopTimer = () => {
    clearTimer();
    setShowInfo(false);
  };

  useEffect(() => () => clearTimer(), []);

  const hasInfo = Boolean(info?.pros?.length || info?.cons?.length);

  return (
    <div
      className="relative"
      onMouseEnter={hasInfo ? startTimer : undefined}
      onMouseLeave={hasInfo ? stopTimer : undefined}
      onPointerDown={
        hasInfo
          ? (e) => {
              // untuk mobile: tekan & tahan
              if (e.pointerType !== "mouse") startTimer();
            }
          : undefined
      }
      onPointerUp={
        hasInfo
          ? (e) => {
              if (e.pointerType !== "mouse") stopTimer();
            }
          : undefined
      }
      onPointerCancel={hasInfo ? stopTimer : undefined}
    >
      <button
        type="button"
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

      {showInfo && hasInfo ? (
        <div className="pointer-events-none absolute z-20 left-3 right-3 -bottom-2 translate-y-full">
          <div className="rounded-2xl bg-graphite/95 border border-ivory/15 p-4 shadow-soft">
            <div className="text-[10px] tracking-luxe uppercase text-muted">Ringkasan material</div>

            <div className="mt-3 grid gap-3">
              {info?.pros?.length ? (
                <div>
                  <div className="text-[10px] tracking-luxe uppercase text-rolex">Keunggulan</div>
                  <ul className="mt-2 list-disc pl-4 text-xs text-ivory/90 space-y-1">
                    {info.pros.map((x, i) => (
                      <li key={i}>{x}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {info?.cons?.length ? (
                <div>
                  <div className="text-[10px] tracking-luxe uppercase text-muted">Kekurangan</div>
                  <ul className="mt-2 list-disc pl-4 text-xs text-ivory/80 space-y-1">
                    {info.cons.map((x, i) => (
                      <li key={i}>{x}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function StepMaterials({ value, onChange, pricing, onNext, onBack }) {
  const [cat, setCat] = useState("foundation");

  const currentOptions = useMemo(() => OPTIONS[cat] ?? [], [cat]);

  return (
    <div>
      <div className="text-xs tracking-luxe uppercase text-muted">Step 02</div>
      <h2 className="mt-2 text-2xl md:text-3xl">Pilih material</h2>
      <p className="mt-3 text-muted leading-relaxed">
        Kamu bisa ganti material kapan saja sebelum submit.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {CATS.map((c) => (
          <Tab key={c.key} active={cat === c.key} onClick={() => setCat(c.key)}>
            {c.label}
          </Tab>
        ))}
      </div>

      <div className="mt-5 grid md:grid-cols-3 gap-3">
        {currentOptions.map((opt) => (
          <OptionCard
            key={opt.id}
            active={value[cat] === opt.id}
            title={opt.label}
            subtitle={`+ Rp ${(opt.price ?? 0).toLocaleString("id-ID")}`}
            info={{ pros: opt.pros, cons: opt.cons }}
            onClick={() => onChange((s) => ({ ...s, [cat]: opt.id }))}
          />
        ))}
      </div>

      <div className="mt-6 rounded-xl bg-obsidian/50 border border-ivory/10 p-4">
        <div className="text-xs tracking-luxe uppercase text-muted">Ringkasan pilihan</div>
        <div className="mt-3 grid md:grid-cols-2 gap-2 text-sm">
          {CATS.map((c) => {
            const picked = getById(OPTIONS[c.key], value[c.key]);
            return (
              <div key={c.key} className="flex items-center justify-between gap-3">
                <span className="text-muted">{c.label}</span>
                <span className="text-ivory">{picked?.label ?? "-"}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-7 flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="px-5 py-3 rounded-xl bg-obsidian/40 border border-ivory/10 text-xs tracking-luxe uppercase hover:border-ivory/20 transition"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-5 py-3 rounded-xl bg-rolex text-xs tracking-luxe uppercase shadow-soft hover:brightness-110 transition"
        >
          Next
        </button>
      </div>

      <div className="mt-4 text-sm text-muted">
        Estimasi: <span className="text-ivory">Rp {pricing.total.toLocaleString("id-ID")}</span>
      </div>
    </div>
  );
}
