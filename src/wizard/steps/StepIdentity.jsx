import React, { useMemo } from "react";

function Field({ label, value, onChange, placeholder, type = "text" }) {
   return (
      <label className="block">
         <div className="text-xs tracking-luxe uppercase text-muted">
            {label}
         </div>
         <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="mt-2 w-full rounded-xl bg-obsidian/40 border border-ivory/10 px-4 py-3 text-ivory placeholder:text-muted focus:outline-none focus:border-rolex/60"
         />
      </label>
   );
}

export default function StepIdentity({
   value,
   onChange,
   onNext,
   onBack,
   navLocked,
}) {
   const isValid = useMemo(() => {
      return Boolean(
         value.fullName?.trim() &&
            value.phone?.trim() &&
            value.contactPerson?.trim()
      );
   }, [value.fullName, value.phone, value.contactPerson]);

   return (
      <div>
         <div className="text-xs tracking-luxe uppercase text-muted">
            Step 04
         </div>
         <h2 className="mt-2 text-2xl md:text-3xl">Identitas calon konsumen</h2>
         <p className="mt-3 text-muted leading-relaxed">
            Data ini digunakan sebagai bahan komunikasi Team Adhit dengan calon
            konsumen.
         </p>

         <div className="mt-6 grid md:grid-cols-2 gap-4">
            <Field
               label="Nama Lengkap"
               value={value.fullName}
               onChange={(v) => onChange((s) => ({ ...s, fullName: v }))}
               placeholder="Contoh: Adhitiya Ayu Puspitasari"
            />
            <Field
               label="No. HP / WhatsApp"
               value={value.phone}
               onChange={(v) => onChange((s) => ({ ...s, phone: v }))}
               placeholder="08xxxxxxxxxx"
            />
            <Field
               label="Email"
               type="email"
               value={value.email}
               onChange={(v) => onChange((s) => ({ ...s, email: v }))}
               placeholder="nama@email.com"
            />
            <Field
               label="Contact Person"
               value={value.contactPerson}
               onChange={(v) => onChange((s) => ({ ...s, contactPerson: v }))}
               placeholder="Nama PIC yang dapat dihubungi"
            />
         </div>

         <div className="mt-4">
            <div className="text-xs tracking-luxe uppercase text-muted">
               Alamat
            </div>
            <textarea
               value={value.address}
               onChange={(e) =>
                  onChange((s) => ({ ...s, address: e.target.value }))
               }
               placeholder="Alamat calon konsumen"
               className="mt-2 w-full min-h-[110px] rounded-xl bg-obsidian/40 border border-ivory/10 px-4 py-3 text-ivory placeholder:text-muted focus:outline-none focus:border-rolex/60"
            />
         </div>

         <div className="mt-4">
            <div className="text-xs tracking-luxe uppercase text-muted">
               Catatan tambahan
            </div>
            <textarea
               value={value.notes}
               onChange={(e) =>
                  onChange((s) => ({ ...s, notes: e.target.value }))
               }
               placeholder="Contoh: minta opsi tambahan / preferensi desain"
               className="mt-2 w-full min-h-[110px] rounded-xl bg-obsidian/40 border border-ivory/10 px-4 py-3 text-ivory placeholder:text-muted focus:outline-none focus:border-rolex/60"
            />
         </div>

         {!isValid && (
            <div className="mt-4 text-sm text-champagne">
               Isi minimal: Nama Lengkap, No. HP/WA, dan Contact Person.
            </div>
         )}

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
               onClick={onNext}
               disabled={navLocked || !isValid}
               className={[
                  "px-5 py-3 rounded-xl text-xs tracking-luxe uppercase shadow-soft transition",
                  navLocked
                     ? "bg-ivory/10 text-muted cursor-not-allowed"
                     : isValid
                     ? "bg-rolex hover:brightness-110"
                     : "bg-ivory/10 text-muted cursor-not-allowed",
               ].join(" ")}
            >
               Next
            </button>
         </div>
      </div>
   );
}
