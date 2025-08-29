"use client";

import { useEffect, useState } from "react";

type Direction = "from-left" | "from-right" | "from-top" | "from-bottom";

export default function HeroSweep({ direction }: { direction?: Direction }) {
  // Avoid SSR/client mismatch: choose direction after mount if not provided.
  const [dir, setDir] = useState<Direction | null>(null);
  useEffect(() => {
    if (direction) {
      setDir(direction);
    } else {
      const dirs: Direction[] = ["from-left", "from-right", "from-top", "from-bottom"];
      setDir(dirs[Math.floor(Math.random() * dirs.length)]);
    }
  }, [direction]);

  if (!dir) return null;
  return <div className={`banner-sweep ${dir}`} aria-hidden />;
}
