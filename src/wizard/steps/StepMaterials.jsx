import React, { useEffect, useMemo, useRef, useState } from "react";
import { OPTIONS, getById, getOptionPrice } from "../../lib/pricing.js";
import { getMaterialImage } from "../../lib/materialAssets.js";

const INFO_DELAY_MS = 1000; // ubah ini untuk mempercepat/memperlambat tooltip

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

function Lightbox({ open, payload, onClose }) {
   const title = payload?.title ?? "";
   const media = payload?.media ?? null;

   useEffect(() => {
      if (!open) return;
      const onKey = (e) => {
         if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", onKey);
      // lock scroll while open
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
         document.removeEventListener("keydown", onKey);
         document.body.style.overflow = prev;
      };
   }, [open, onClose]);

   if (!open || !media) return null;

   const webpLarge = media.webp1600 ?? media.webp960;
   const jpgLarge = media.jpg1600 ?? media.jpg960;

   return (
      <div className="fixed inset-0 z-50">
         <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 bg-black/70"
         />

         <div className="relative mx-auto mt-10 md:mt-16 w-[92vw] max-w-5xl">
            <div className="rounded-2xl overflow-hidden border border-ivory/15 bg-graphite shadow-soft">
               <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-ivory/10">
                  <div className="text-sm text-ivory truncate">{title}</div>
                  <button
                     type="button"
                     onClick={onClose}
                     className="px-3 py-2 rounded-xl bg-obsidian/50 border border-ivory/10 text-xs tracking-luxe uppercase hover:border-ivory/20 transition"
                  >
                     Close
                  </button>
               </div>

               <div className="relative aspect-[16/10] bg-obsidian/30">
                  <picture>
                     <source
                        type="image/webp"
                        srcSet={`${media.webp960} 960w, ${webpLarge} 1600w`}
                        sizes="(max-width: 768px) 92vw, 70vw"
                     />
                     <img
                        src={jpgLarge}
                        alt={title}
                        loading="eager"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover"
                     />
                  </picture>
               </div>
            </div>
         </div>
      </div>
   );
}

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

function OptionCard({ active, title, subtitle, info, media, onClick, onOpenMedia }) {
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
      tRef.current = setTimeout(() => setShowInfo(true), INFO_DELAY_MS);
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
            {media ? (
               <div
                  className="relative group overflow-hidden rounded-xl border border-ivory/10 bg-obsidian/30 aspect-[16/10] cursor-zoom-in"
                  onClick={(e) => {
                     // buka preview tanpa mengubah pilihan (hindari click bubble ke button)
                     e.preventDefault();
                     e.stopPropagation();
                     onOpenMedia?.({ title, media });
                  }}
               >
                  <picture>
                     <source
                        type="image/webp"
                        srcSet={`${media.webp640} 640w, ${media.webp960} 960w`}
                        sizes="(max-width: 768px) 92vw, 33vw"
                     />
                     <img
                        src={media.jpg960}
                        alt={title}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover"
                     />
                  </picture>
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-transparent to-transparent" />

                  {/* hint icon */}
                  <div className="absolute right-3 top-3 h-9 w-9 rounded-xl bg-obsidian/60 border border-ivory/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                     <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-ivory"
                     >
                        <path
                           d="M10.5 3.75a6.75 6.75 0 104.09 12.1l3.28 3.28a.75.75 0 001.06-1.06l-3.28-3.28A6.75 6.75 0 0010.5 3.75z"
                           stroke="currentColor"
                           strokeWidth="1.5"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                        />
                        <path
                           d="M10.5 7.5v6M7.5 10.5h6"
                           stroke="currentColor"
                           strokeWidth="1.5"
                           strokeLinecap="round"
                        />
                     </svg>
                  </div>
               </div>
            ) : null}

            <div className="mt-4 flex items-start justify-between gap-3">
               <div>
                  <div className="text-ivory">{title}</div>
                  <div className="mt-1 text-sm text-muted">{subtitle}</div>
               </div>

               {active ? (
                  <div className="h-2.5 w-2.5 rounded-full bg-rolex shadow-[0_0_0_4px_rgba(118,112,255,0.18)] mt-1" />
               ) : (
                  <div className="h-2.5 w-2.5 rounded-full border border-ivory/20 mt-1" />
               )}
            </div>
         </button>

         {showInfo && hasInfo ? (
            <div className="pointer-events-none absolute z-20 left-3 right-3 -bottom-2 translate-y-full">
               <div className="rounded-2xl bg-graphite/95 border border-ivory/15 p-4 shadow-soft">
                  <div className="text-[10px] tracking-luxe uppercase text-muted">
                     Ringkasan material
                  </div>

                  <div className="mt-3 grid gap-3">
                     {info?.pros?.length ? (
                        <div>
                           <div className="text-[10px] tracking-luxe uppercase text-rolex">
                              Keunggulan
                           </div>
                           <ul className="mt-2 list-disc pl-4 text-xs text-ivory/90 space-y-1">
                              {info.pros.map((x, i) => (
                                 <li key={i}>{x}</li>
                              ))}
                           </ul>
                        </div>
                     ) : null}

                     {info?.cons?.length ? (
                        <div>
                           <div className="text-[10px] tracking-luxe uppercase text-muted">
                              Kekurangan
                           </div>
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

export default function StepMaterials({
   value,
   onChange,
   pricing,
   onNext,
   onBack,
   navLocked,
}) {
   const [cat, setCat] = useState("foundation");
   const [lightbox, setLightbox] = useState(null);

   const currentOptions = useMemo(() => OPTIONS[cat] ?? [], [cat]);

   return (
      <div>
         <div className="text-xs tracking-luxe uppercase text-muted">
            Step 02
         </div>
         <h2 className="mt-2 text-2xl md:text-3xl">Pilih material</h2>
         <p className="mt-3 text-muted leading-relaxed">
            Kamu bisa ganti material kapan saja sebelum submit.
         </p>

         <div className="mt-6 flex flex-wrap gap-2">
            {CATS.map((c) => (
               <Tab
                  key={c.key}
                  active={cat === c.key}
                  onClick={() => setCat(c.key)}
               >
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
                  subtitle={`+ Rp ${getOptionPrice(cat, opt.id, value.size).toLocaleString("id-ID")}`}
                  media={getMaterialImage(cat, opt.id)}
                  info={{ pros: opt.pros, cons: opt.cons }}
                  onOpenMedia={({ title, media }) => setLightbox({ title, media })}
                  onClick={() => onChange((s) => ({ ...s, [cat]: opt.id }))}
               />
            ))}
         </div>

         <div className="mt-6 rounded-xl bg-obsidian/50 border border-ivory/10 p-4">
            <div className="text-xs tracking-luxe uppercase text-muted">
               Ringkasan pilihan
            </div>
            <div className="mt-3 grid md:grid-cols-2 gap-2 text-sm">
               {CATS.map((c) => {
                  const picked = getById(OPTIONS[c.key], value[c.key]);
                  return (
                     <div
                        key={c.key}
                        className="flex items-center justify-between gap-3"
                     >
                        <span className="text-muted">{c.label}</span>
                        <span className="text-ivory">
                           {picked?.label ?? "-"}
                        </span>
                     </div>
                  );
               })}
            </div>
         </div>

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

         <div className="mt-4 text-sm text-muted">
            Estimasi:{" "}
            <span className="text-ivory">
               Rp {pricing.total.toLocaleString("id-ID")}
            </span>
         </div>

         <Lightbox
            open={Boolean(lightbox)}
            payload={lightbox}
            onClose={() => setLightbox(null)}
         />
      </div>
   );
}
