import React, { useMemo, useState } from "react";

function Field({
   label,
   value,
   onChange,
   placeholder,
   type = "text",
   inputMode,
   autoComplete,
}) {
   return (
      <label className="block">
         <div className="text-xs tracking-luxe uppercase text-muted">
            {label}
         </div>
         <input
            type={type}
            inputMode={inputMode}
            autoComplete={autoComplete}
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
   const [error, setError] = useState("");

   // Minimal fields untuk enable tombol next
   const isValid = useMemo(() => {
      return Boolean(
         value.fullName?.trim() &&
            value.phone?.trim() &&
            value.contactPerson?.trim()
      );
   }, [value.fullName, value.phone, value.contactPerson]);

   const validateAndNext = () => {
      setError("");

      const fullName = (value.fullName || "").trim();
      const phone = (value.phone || "").trim();
      const email = (value.email || "").trim();
      const contactPerson = (value.contactPerson || "").trim();

      // minimal required
      if (!fullName || !phone || !contactPerson) {
         setError("Isi minimal: Nama Lengkap, No. HP/WA, dan Contact Person.");
         return;
      }

      // nama minimal 3 karakter
      if (fullName.length < 3) {
         setError("Nama Lengkap minimal 3 karakter.");
         return;
      }

      // contact person minimal 2 karakter
      if (contactPerson.length < 2) {
         setError("Contact Person minimal 2 karakter.");
         return;
      }

      // phone digits only + length
      if (!/^[0-9]{9,15}$/.test(phone)) {
         setError("No. HP/WA harus angka (9–15 digit). Contoh: 08123456789");
         return;
      }

      // OPTIONAL: jika kamu ingin nomor WA Indonesia wajib mulai 08, biarkan ON.
      // Kalau kamu mau menerima +62 / 62 / dll, bilang ya nanti aku buat format yang lebih fleksibel.
      if (!phone.startsWith("08")) {
         setError("No. HP/WA harus diawali 08. Contoh: 08123456789");
         return;
      }

      // email optional, but if filled must be valid (boleh domain apa saja)
      // NOTE: validasi ini sengaja tidak membatasi hanya gmail
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
         setError("Format email tidak valid. Contoh: nama@email.com");
         return;
      }

      onNext();
   };

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
               value={value.fullName || ""}
               onChange={(v) => onChange((s) => ({ ...s, fullName: v }))}
               placeholder="Contoh: Adhitiya Ayu Puspitasari"
               autoComplete="name"
            />

            <Field
               label="No. HP / WhatsApp"
               value={value.phone || ""}
               onChange={(v) =>
                  onChange((s) => ({
                     ...s,
                     phone: String(v).replace(/\D/g, ""), // keep digits only
                  }))
               }
               placeholder="08123456789"
               inputMode="numeric"
               autoComplete="tel"
               type="tel"
            />

            <Field
               label="Email (opsional)"
               type="email"
               value={value.email || ""}
               onChange={(v) => onChange((s) => ({ ...s, email: v }))}
               placeholder="nama@email.com (gmail/yahoo/outlook boleh)"
               inputMode="email"
               autoComplete="email"
            />

            <Field
               label="Contact Person"
               value={value.contactPerson || ""}
               onChange={(v) => onChange((s) => ({ ...s, contactPerson: v }))}
               placeholder="Nama PIC yang dapat dihubungi"
            />
         </div>

         <div className="mt-4">
            <div className="text-xs tracking-luxe uppercase text-muted">
               Alamat
            </div>
            <textarea
               value={value.address || ""}
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
               value={value.notes || ""}
               onChange={(e) =>
                  onChange((s) => ({ ...s, notes: e.target.value }))
               }
               placeholder="Contoh: minta opsi tambahan / preferensi desain"
               className="mt-2 w-full min-h-[110px] rounded-xl bg-obsidian/40 border border-ivory/10 px-4 py-3 text-ivory placeholder:text-muted focus:outline-none focus:border-rolex/60"
            />
         </div>

         {/* helper minimal */}
         {!isValid && !error && (
            <div className="mt-4 text-sm text-champagne">
               Isi minimal: Nama Lengkap, No. HP/WA, dan Contact Person.
            </div>
         )}

         {/* error box */}
         {error && (
            <div className="mt-4 text-sm rounded-xl border border-pink-400/30 bg-pink-500/10 px-4 py-3 text-pink-100">
               {error}
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
               onClick={validateAndNext}
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
