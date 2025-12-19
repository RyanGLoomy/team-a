import React from "react";
import { useNavigate } from "react-router-dom";

export default function Success() {
  const nav = useNavigate();
  return (
    <div className="py-16">
      <div className="rounded-2xl bg-graphite border border-ivory/10 p-8 shadow-soft">
        <div className="text-xs tracking-luxe uppercase text-rolex">Submitted</div>
        <h1 className="mt-3 text-3xl">Pesanan berhasil dikirim</h1>
        <p className="mt-3 text-muted leading-relaxed">
          Tim Team Adhit akan menghubungi Anda melalui contact person yang Anda cantumkan.
        </p>

        <button
          onClick={() => nav("/")}
          className="mt-7 px-5 py-3 rounded-xl bg-rolex text-xs tracking-luxe uppercase shadow-soft hover:brightness-110 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
