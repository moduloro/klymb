"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

export default function HeroSurface() {
  const [total, setTotal] = useState<string | null>(null);
  useEffect(() => {
    const half = Math.random() * (30 - 10) + 10; // seconds from one color to the other
    const full = (half * 2).toFixed(2) + "s"; // full cycle (orange back to blue)
    setTotal(full);
  }, []);

  const style = (total
    ? ({ "--surface-total": total } as unknown as CSSProperties)
    : undefined);

  return <div className="banner-surface" aria-hidden style={style} />;
}
