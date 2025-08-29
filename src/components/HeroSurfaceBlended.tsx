"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

type Patch = {
  x: number;
  y: number;
  r1: number;
  r2: number;
  ease: string;
};

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function HeroSurfaceBlended({ count = 7 }: { count?: number }) {
  const [styleVars, setStyleVars] = useState<CSSProperties | null>(null);
  const [patches, setPatches] = useState<Patch[] | null>(null);

  // Shared duration: 10–30s per half; full cycle is double.
  const fullDuration = useMemo(() => {
    const half = rand(10, 30);
    return (half * 2).toFixed(2) + "s";
  }, []);

  const regenerate = useCallback(() => {
    const eases = [
      "ease-in",
      "ease-out",
      "ease-in-out",
      "cubic-bezier(0.2, 0.7, 0.3, 1)",
      "cubic-bezier(0.4, 0.0, 0.2, 1)",
      "cubic-bezier(0.1, 0.9, 0.2, 1)",
    ];
    const list: Patch[] = [];
    for (let i = 0; i < count; i++) {
      const x = rand(8, 92);
      const y = rand(12, 88);
      const r1 = rand(18, 32);
      const r2 = r1 + rand(6, 16);
      const ease = eases[Math.floor(Math.random() * eases.length)];
      list.push({ x, y, r1, r2, ease });
    }
    setPatches(list);
  }, [count]);

  const handleIter = useCallback(() => {
    // New cycle starting -> randomize patch positions/sizes/easing
    regenerate();
  }, [regenerate]);

  useEffect(() => {
    setStyleVars({ "--surface-total": fullDuration, "--surface-delay": "5s" } as CSSProperties);
    regenerate();
  }, [fullDuration, regenerate]);

  if (!styleVars || !patches) return null;

  return (
    <div style={styleVars} aria-hidden>
      {/* Uniform base overlay ensures full blue/orange states at cycle extremes */}
      <div className="banner-surface" onAnimationIteration={handleIter} />
      {/* Non-uniform patches modulate perceived progression without breaking extremes */}
      <div className="banner-patches">
        {patches.map((p, i) => {
          const style = {
            "--x": `${p.x}%`,
            "--y": `${p.y}%`,
            "--r1": `${p.r1}%`,
            "--r2": `${p.r2}%`,
            "--patch-ease": p.ease,
          } as CSSProperties;
          return <div key={i} className="banner-patch" style={style} />;
        })}
      </div>
    </div>
  );
}
