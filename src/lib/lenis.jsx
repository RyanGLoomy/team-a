import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import Lenis from "lenis";

/**
 * LenisProvider
 * - Single Lenis instance for the whole app (smooth scrolling)
 * - Exposes `lenis` via context so pages can scrollTo sections and sync ScrollTrigger
 */
const LenisContext = createContext(null);

export function LenisProvider({ children }) {
  const [lenis, setLenis] = useState(null);

  useEffect(() => {
    const instance = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      smoothTouch: false,
    });

    let raf = 0;
    const loop = (time) => {
      instance.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    setLenis(instance);

    return () => {
      cancelAnimationFrame(raf);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  const value = useMemo(() => ({ lenis }), [lenis]);

  return <LenisContext.Provider value={value}>{children}</LenisContext.Provider>;
}

export function useLenis() {
  const ctx = useContext(LenisContext);
  return ctx?.lenis ?? null;
}
