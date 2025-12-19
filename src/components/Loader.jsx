import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Loader
 * Keep it subtle and premium: no fake percentages, just a short branded intro.
 */
export default function Loader({ show }) {
  // Avoid flashing the loader for ultra-fast renders.
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!show) {
      setArmed(false);
      return;
    }
    const t = window.setTimeout(() => setArmed(true), 120);
    return () => window.clearTimeout(t);
  }, [show]);

  return (
    <AnimatePresence>
      {show && armed ? (
        <motion.div
          className="fixed inset-0 z-[9999] bg-obsidian flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.22 } }}
          exit={{ opacity: 0, transition: { duration: 0.38 } }}
        >
          <div className="w-[min(560px,86vw)]">
            <div className="flex items-center justify-between">
              <div className="text-ivory tracking-luxe uppercase text-xs">Team Adhit · Custom Home</div>
              <div className="text-muted text-xs tracking-luxe uppercase">Loading</div>
            </div>

            <div className="mt-5 h-[1px] bg-ivory/10 overflow-hidden rounded-full">
              <motion.div
                className="h-full bg-ivory/70"
                initial={{ x: "-40%", width: "35%", opacity: 0.6 }}
                animate={{ x: "120%" }}
                transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            <div className="mt-6 text-muted text-sm leading-relaxed max-w-[56ch]">
              Menyiapkan pengalaman landing page yang sinematik—ringan, rapi, dan fokus ke cerita.
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
