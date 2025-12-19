import React from "react";
import { motion } from "framer-motion";

/**
 * LuxuryButton
 * Minimal, premium button styles consistent across the site.
 */
export default function LuxuryButton({
  as = "button",
  variant = "primary",
  href,
  onClick,
  className = "",
  children,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl2 px-5 py-3 text-xs sm:text-sm tracking-luxe uppercase transition select-none";

  // Back-compat: some parts of the app still pass variant="green".
  const v = variant === "green" ? "accent" : variant;

  const styles =
    v === "primary"
      ? "bg-ivory text-obsidian hover:bg-ivory/95 active:scale-[.99]"
      : v === "accent"
        ? "bg-rolex text-ivory hover:brightness-110 active:scale-[.99] shadow-soft"
        : "border border-ivory/15 bg-graphite/35 text-ivory/90 hover:border-ivory/30 hover:bg-graphite/45 active:scale-[.99]";

  const Comp = motion[as] || motion.button;
  const common = {
    className: `${base} ${styles} ${className}`.trim(),
    whileTap: { scale: 0.985 },
    onClick,
    ...props,
  };

  if (as === "a") {
    return (
      <Comp href={href} {...common}>
        {children}
      </Comp>
    );
  }

  return <Comp {...common}>{children}</Comp>;
}
