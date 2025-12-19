import React from "react";
import WizardShell from "../wizard/WizardShell.jsx";

export default function Configurator() {
  return (
    <div className="py-10 md:py-14">
      <div className="text-xs tracking-luxe uppercase text-muted">Configurator</div>
      <h1 className="mt-3 text-3xl md:text-4xl">Bangun spesifikasi rumah Anda</h1>
      <p className="mt-3 text-muted leading-relaxed max-w-2xl">
        Pilih ukuran dan material. Setelah itu tentukan pembayaran cash / credit
        (DP + tenor), lalu isi identitas calon konsumen.
      </p>

      <div className="mt-8">
        <WizardShell />
      </div>
    </div>
  );
}
