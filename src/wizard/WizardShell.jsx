import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StepSize from "./steps/StepSize.jsx";
import StepMaterials from "./steps/StepMaterials.jsx";
import StepPayment from "./steps/StepPayment.jsx";
import StepIdentity from "./steps/StepIdentity.jsx";
import StepReview from "./steps/StepReview.jsx";
import { calcMaterialsTotal } from "../lib/pricing.js";

const steps = [
   { key: "size", label: "Ukuran Rumah" },
   { key: "materials", label: "Material" },
   { key: "payment", label: "Pembayaran" },
   { key: "identity", label: "Identitas" },
   { key: "review", label: "Review" },
];

export default function WizardShell() {
   const [i, setI] = useState(0);
   const [navLocked, setNavLocked] = useState(false);
   const NAV_LOCK_MS = 450;

   const [sel, setSel] = useState({
      size: "30-60",
      foundation: "batu_kali",
      walls: "batako",
      floor: "keramik",
      frame: "baja_ringan",
      roof: "spandek",
      ceiling: "gipsum",
      doors: "kayu_meranti",
      electricity: "1300",
      fence: "hollow_hitam",
   });

   const [pay, setPay] = useState({
      method: "cash", // cash | credit
      dp: 0.2, // persen
      tenor: 24, // bulan
   });

   const [idn, setIdn] = useState({
      fullName: "",
      phone: "",
      email: "",
      address: "",
      contactPerson: "",
      notes: "",
   });

   const pricing = useMemo(() => calcMaterialsTotal(sel), [sel]);

   const withLock = (fn) => () => {
      if (navLocked) return;
      setNavLocked(true);
      fn();
      window.setTimeout(() => setNavLocked(false), NAV_LOCK_MS);
   };

   const next = withLock(() => setI((v) => Math.min(v + 1, steps.length - 1)));
   const back = withLock(() => setI((v) => Math.max(v - 1, 0)));

   const Current = [
      <StepSize
         value={sel}
         onChange={setSel}
         pricing={pricing}
         onNext={next}
         navLocked={navLocked}
         key="s"
      />,
      <StepMaterials
         value={sel}
         onChange={setSel}
         pricing={pricing}
         onNext={next}
         onBack={back}
         navLocked={navLocked}
         key="m"
      />,
      <StepPayment
         value={pay}
         onChange={setPay}
         pricing={pricing}
         onNext={next}
         onBack={back}
         navLocked={navLocked}
         key="p"
      />,
      <StepIdentity
         value={idn}
         onChange={setIdn}
         onNext={next}
         onBack={back}
         navLocked={navLocked}
         key="i"
      />,
      <StepReview
         selections={sel}
         payment={pay}
         identity={idn}
         pricing={pricing}
         onBack={back}
         navLocked={navLocked}
         key="r"
      />,
   ][i];

   return (
      <div className="grid lg:grid-cols-12 gap-6">
         {/* progress */}
         <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 rounded-2xl bg-graphite border border-ivory/10 p-5 shadow-soft">
               <div className="text-xs tracking-luxe uppercase text-muted">
                  Progress
               </div>
               <div className="mt-4 space-y-3">
                  {steps.map((s, idx) => (
                     <div
                        key={s.key}
                        className="flex items-center justify-between"
                     >
                        <div
                           className={`text-sm ${
                              idx === i ? "text-ivory" : "text-muted"
                           }`}
                        >
                           {String(idx + 1).padStart(2, "0")} · {s.label}
                        </div>
                        <div
                           className={`h-2 w-2 rounded-full ${
                              idx <= i ? "bg-rolex" : "bg-ivory/10"
                           }`}
                        />
                     </div>
                  ))}
               </div>

               <div className="mt-6 rounded-xl bg-obsidian/60 border border-ivory/5 p-4">
                  <div className="text-xs tracking-luxe uppercase text-muted">
                     Estimasi
                  </div>
                  <div className="mt-2 text-2xl md:text-3xl tabular-nums">
                     Rp {pricing.total.toLocaleString("id-ID")}
                  </div>
                  <div className="mt-2 text-muted text-sm">
                     Base: Rp {pricing.base.toLocaleString("id-ID")} · Material:
                     Rp {pricing.materials.toLocaleString("id-ID")}
                  </div>
               </div>
            </div>
         </div>

         {/* step content */}
         <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
               <motion.div
                  key={steps[i].key}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="rounded-2xl bg-graphite border border-ivory/10 p-6 md:p-8 shadow-soft"
               >
                  {Current}
               </motion.div>
            </AnimatePresence>
         </div>
      </div>
   );
}
