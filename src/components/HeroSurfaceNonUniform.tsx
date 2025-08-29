"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

type Patch = {
  x: number; // percent 0-100
  y: number; // percent 0-100
  r1: number; // inner radius percent
  r2: number; // outer radius percent
  total: string; // full cycle duration, e.g. '30s'
  delay: string; // animation delay
};

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function HeroSurfaceNonUniform({ count = 7 }: { count?: number }) {
  const [patches, setPatches] = useState<Patch[] | null>(null);

  useEffect(() => {
    const list: Patch[] = [];
    for (let i = 0; i < count; i++) {
      const x = rand(8, 92);
      const y = rand(12, 88);
      const r1 = rand(18, 32);
      const r2 = r1 + rand(6, 16);
      // Random half-duration 10–30s (like surface), full is double; vary per patch
      const half = rand(10, 30);
      const full = (half * 2).toFixed(2) + "s";
      const delay = rand(0, 6).toFixed(2) + "s";
      list.push({ x, y, r1, r2, total: full, delay });
    }
    setPatches(list);
  }, [count]);

  if (!patches) return null;

  return (
    <div className="banner-patches" aria-hidden>
      {patches.map((p, i) => {
        const style = {
          "--x": `${p.x}%`,
          "--y": `${p.y}%`,
          "--r1": `${p.r1}%`,
          "--r2": `${p.r2}%`,
          "--patch-total": p.total,
          "--patch-delay": p.delay,
        } as CSSProperties;
        return <div key={i} className="banner-patch" style={style} />;
      })}
    </div>
  );
}

