"use client";

import { Fragment, useEffect, useState } from "react";
import type { CSSProperties } from "react";

type Bubble = {
  className: string; // rise-1 | rise-2 | fall-1 | fall-2
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  width: string;
  height: string;
  delay: string;
  colorClass: "lava-accent-1" | "lava-accent-2" | "lava-accent-3";
  innerStop: string; // e.g., 70%
  outerStop: string; // e.g., 72%
  blur: string; // e.g., 18px
  appear: string; // e.g., 1.4s
};

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function pick<T extends readonly unknown[]>(arr: T): T[number] {
  return arr[Math.floor(Math.random() * arr.length)] as T[number];
}

function makeBubbles(count: number): Bubble[] {
  const list: Bubble[] = [];
  for (let i = 0; i < count; i++) {
      const fromTop = Math.random() < 0.5; // origin: top or bottom
      const side = Math.random() < 0.5 ? "left" : "right";
      const className = fromTop ? pick(["fall-1", "fall-2"]) : pick(["rise-1", "rise-2"]);
      const colorClass: Bubble["colorClass"] = pick(["lava-accent-1", "lava-accent-2", "lava-accent-3"] as const);
      // Size buckets to ensure some much smaller bubbles
      const bucket = Math.random();
      let widthV: number;
      if (bucket < 0.35) {
        // small
        widthV = rand(6, 14);
      } else if (bucket < 0.75) {
        // medium
        widthV = rand(16, 34);
      } else {
        // large
        widthV = rand(36, 68);
      }
      const heightV = widthV * rand(0.7, 1.35); // vary ellipse shape
      const pos = rand(-42, 52).toFixed(1) + "%";
      const crossOffset = rand(18, 34); // how far beyond edge to emerge
      // Harder edges: higher inner stop, very narrow outer band, and lower blur
      const inner = rand(74, 84).toFixed(1) + "%";
      const outer = (parseFloat(inner) + rand(0.15, 0.8)).toFixed(1) + "%";
      const blur = rand(6, 16).toFixed(0) + "px";
      // Control when the first bubble becomes visible: ensure within first ~5s
      let delayNum = rand(0, 12); // slower, wider staggering
      let appearNum = rand(4.0, 16.0); // significantly slower and more varied
      if (i === 0) {
        delayNum = rand(0, 2.0);
        appearNum = rand(1.0, 3.5);
      }
      const delay = delayNum.toFixed(1) + "s";
      const appear = appearNum.toFixed(1) + "s";
      const b: Bubble = {
        className,
        width: `${widthV}vmax`,
        height: `${heightV}vmax`,
        delay,
        colorClass,
        innerStop: inner,
        outerStop: outer,
        blur,
        appear,
      };
      if (side === "left") b.left = pos; else b.right = pos;
      if (fromTop) b.top = `-${crossOffset}%`; else b.bottom = `-${crossOffset}%`;
      list.push(b);
  }
  return list;
}

export default function HeroLava({ count = 7 }: { count?: number }) {
  // Generate bubbles only on client after mount to avoid SSR hydration mismatches
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  useEffect(() => {
    setBubbles(makeBubbles(count));
  }, [count]);

  return (
    <div className="lava-container" aria-hidden>
      {bubbles.map((b, idx) => {
        // Randomize fade-in/out durations (5-10s each) while honoring first-bubble faster setup
        // Slower opacity cycles: 10–20s to reach 80% and 10–20s back to ~20%
        const fadeIn = idx === 0
          ? Math.min(5.0, Math.max(1.0, parseFloat(b.appear)))
          : (Math.random() * 10 + 10); // 10–20s
        const fadeOut = Math.random() * 10 + 10; // 10–20s
        const total = fadeIn + fadeOut;
        const pct = Math.max(5, Math.min(95, Math.round((fadeIn / total) * 100)));

        const opacityKey = `blobOpacity_${idx}_${Math.floor(Math.random() * 100000)}`;
        let moveAnim = "";
        switch (b.className) {
          case "rise-1":
            moveAnim = "blob-rise-1 18s ease-in-out infinite alternate";
            break;
          case "rise-2":
            moveAnim = "blob-rise-2 22s ease-in-out infinite alternate";
            break;
          case "fall-1":
            moveAnim = "blob-fall-1 20s ease-in-out infinite alternate";
            break;
          default:
            moveAnim = "blob-fall-2 24s ease-in-out infinite alternate";
        }

        const style: CSSProperties & Record<string, string> = {
          left: b.left,
          right: b.right,
          top: b.top,
          bottom: b.bottom,
          width: b.width,
          height: b.height,
          ["--inner-stop"]: b.innerStop,
          ["--outer-stop"]: b.outerStop,
          ["--blur"]: b.blur,
          // Combine movement with per-bubble opacity cycle
          animation: `${moveAnim}, ${opacityKey} ${total.toFixed(1)}s linear ${b.delay} infinite`,
        };

        // Fade between ~20% and 80% opacity, starting near 0% for first cycle visually
        const keyframes = `@keyframes ${opacityKey} { 0%{opacity:0.2} ${pct}%{opacity:0.8} 100%{opacity:0.2} }`;

        return (
          <Fragment key={idx}>
            <style dangerouslySetInnerHTML={{ __html: keyframes }} />
            <div className={`lava-blob ${b.colorClass}`} style={style} />
          </Fragment>
        );
      })}
    </div>
  );
}
