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

export default function StepReview({
   selections,
   payment,
   identity,
   pricing,
   onBack,
   navLocked,
}) {
   const nav = useNavigate();
   const [ok, setOk] = useState(false);
   const [submitting, setSubmitting] = useState(false);

   // NEW: error message for DB insert failures
   const [dbError, setDbError] = useState("");

   const dpAmount = useMemo(() => {
      return pricing.total * (payment.dp ?? 0);
   }, [pricing.total, payment.dp]);

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
            return {
               label: c.label,
               value: s?.label ?? "-",
               price: s?.base ?? 0,
            };
         }
         const picked = getById(OPTIONS[c.key], selections[c.key]);
         return {
            label: c.label,
            value: picked?.label ?? "-",
            price: getOptionPrice(c.key, selections[c.key], selections.size),
         };
      });
   }, [selections]);

   const submit = async () => {
      setDbError("");
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

      // Insert to Supabase (required for admin/dashboard)
      if (!supabase) {
         setDbError(
            "Supabase belum dikonfigurasi. Pastikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY sudah di-set di Vercel, lalu redeploy."
         );
         setSubmitting(false);
         return;
      }

      try {
         // Normalize method to match DB constraint: ('cash','credit')
         const method = String(payment.method || "cash").toLowerCase();
         const isCredit = method === "credit";

         // dp_percent = persen (0-100), dp_amount = nilai rupiah
         const dpPercent = isCredit
            ? Math.round((payment.dp ?? 0) * 100)
            : null;
         const dpAmountNum = isCredit
            ? Math.round(Number(pricing.total ?? 0) * Number(payment.dp ?? 0))
            : null;

         const months = isCredit ? Number(payment.tenor ?? 0) : null;
         const monthly = isCredit && credit ? Math.round(credit.monthly) : null;

         const insertRow = {
            company: "Team A",

            house_size: String(selections.size ?? ""),
            specs: selections,

            // IMPORTANT: ini NOT NULL di schema kamu
            total_price: Number(pricing.total ?? 0),
            base_price: Number(pricing.base ?? 0),
            materials_price: Number(pricing.materials ?? 0),

            payment_method: method,
            dp_amount: dpAmountNum,
            dp_percent: dpPercent,
            tenor_months: months || null,
            interest_rate: 0.12,
            monthly_installment: monthly,

            full_name: identity.fullName,
            phone: identity.phone,
            email: identity.email || null,
            address: identity.address || null,
            contact_person: identity.contactPerson || null,
            notes: identity.notes || null,
            status: "new",

            referrer:
               typeof document !== "undefined"
                  ? document.referrer || null
                  : null,
            user_agent:
               typeof navigator !== "undefined"
                  ? navigator.userAgent || null
                  : null,
         };

         const { error } = await supabase.from("leads").insert([insertRow]);
         if (error) throw error;
      } catch (e) {
         console.warn("Supabase insert failed:", e);
         setDbError(e?.message || "Supabase insert failed");
         setSubmitting(false);
         return; // PENTING: jangan redirect ke /success kalau insert gagal
      }

      // delay kecil biar terasa “premium submit”
      await new Promise((r) => setTimeout(r, 600));

      setSubmitting(false);
      nav("/success");
   };

   return (
      <div>
         <div className="text-xs tracking-luxe uppercase text-muted">
            Step 05
         </div>
         <h2 className="mt-2 text-2xl md:text-3xl">Review & Konfirmasi</h2>
         <p className="mt-3 text-muted leading-relaxed">
            Pastikan spesifikasi & pembayaran sudah benar. Setelah submit, tim
            akan menghubungi calon konsumen.
         </p>

         {/* NEW: show insert error */}
         {dbError && (
            <div className="mt-6 rounded-2xl border border-pink-400/30 bg-pink-500/10 p-4 text-sm text-pink-100">
               <div className="text-xs tracking-luxe uppercase text-pink-200">
                  Supabase Error
               </div>
               <div className="mt-1">{dbError}</div>
            </div>
         )}

         <div className="mt-6 grid lg:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-obsidian/50 border border-ivory/10 p-5">
               <div className="text-xs tracking-luxe uppercase text-muted">
                  Spesifikasi
               </div>
               <div className="mt-4 space-y-2 text-sm">
                  {summary.map((x) => (
                     <div
                        key={x.label}
                        className="flex items-start justify-between gap-3"
                     >
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
               <div className="text-xs tracking-luxe uppercase text-muted">
                  Pembayaran
               </div>

               <div className="mt-4 text-sm">
                  <div className="flex justify-between gap-3">
                     <span className="text-muted">Metode</span>
                     <span className="text-ivory uppercase">
                        {payment.method}
                     </span>
                  </div>

                  {payment.method === "credit" && credit && (
                     <>
                        <div className="mt-2 flex justify-between gap-3">
                           <span className="text-muted">DP</span>
                           <span className="text-ivory tabular-nums">
                              {Math.round((payment.dp ?? 0) * 100)}% · Rp{" "}
                              {dpAmount.toLocaleString("id-ID")}
                           </span>
                        </div>
                        <div className="mt-2 flex justify-between gap-3">
                           <span className="text-muted">Tenor</span>
                           <span className="text-ivory tabular-nums">
                              {payment.tenor} bulan
                           </span>
                        </div>
                        <div className="mt-4 p-4 rounded-xl bg-obsidian/40 border border-ivory/10">
                           <div className="text-xs tracking-luxe uppercase text-muted">
                              Angsuran / Bulan
                           </div>
                           <div className="mt-2 text-2xl text-ivory tabular-nums">
                              Rp{" "}
                              {Math.round(credit.monthly).toLocaleString(
                                 "id-ID"
                              )}
                           </div>
                           <div className="mt-1 text-xs text-muted">
                              Bunga flat 12% (simulasi)
                           </div>
                        </div>
                     </>
                  )}

                  <div className="mt-4 p-4 rounded-xl bg-obsidian/40 border border-ivory/10">
                     <div className="text-xs tracking-luxe uppercase text-muted">
                        Total Estimasi
                     </div>
                     <div className="mt-2 text-2xl text-ivory tabular-nums">
                        Rp {pricing.total.toLocaleString("id-ID")}
                     </div>
                     <div className="mt-1 text-xs text-muted">
                        Base Rp {pricing.base.toLocaleString("id-ID")} ·
                        Material Rp {pricing.materials.toLocaleString("id-ID")}
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="mt-6 rounded-2xl bg-graphite border border-ivory/10 p-5">
            <div className="text-xs tracking-luxe uppercase text-muted">
               Identitas
            </div>
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
                  <div className="text-ivory">
                     {identity.contactPerson || "-"}
                  </div>
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
               Saya sudah yakin dengan kustomisasi material & detail pembayaran,
               dan siap submit pesanan.
            </span>
         </label>

         <div className="mt-7 flex items-center justify-between gap-3">
            <button
               onClick={onBack}
               disabled={navLocked}
               className={[
                  "px-5 py-3 rounded-xl bg-obsidian/40 border border-ivory/10 text-xs tracking-luxe uppercase transition",
                  navLocked
                     ? "opacity-50 cursor-not-allowed"
                     : "hover:border-ivory/20",
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
