// components/MainSection/statusBar.tsx
"use client";

import { Stack } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePresaleProgress } from "@/hooks/usePresaleProgress";

// small segment SVG (unchanged, gray w/ stroke)
function SmallSegment() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="18" viewBox="0 0 21 18" fill="none">
      <path
        d="M1.66627 1.83391C1.75265 0.797326 2.61918 0 3.65936 0H18.0846C19.2766 0 20.204 1.03613 20.0723 2.22086L18.5168 16.2209C18.4042 17.2337 17.5481 18 16.529 18H2.49269C1.32261 18 0.402429 16.9999 0.499599 15.8339L1.66627 1.83391Z"
        fill="#171717"
        fillOpacity="0.48"
      />
      <path
        d="M3.65894 0.5H18.0847C18.9787 0.50009 19.6737 1.27752 19.575 2.16602L18.0203 16.166C17.9357 16.9255 17.2933 17.5 16.5291 17.5H2.49292C1.61536 17.5 0.924925 16.7495 0.997803 15.875L2.16479 1.875C2.22978 1.09792 2.87914 0.500216 3.65894 0.5Z"
        stroke="white"
        strokeOpacity="0.31"
      />
    </svg>
  );
}

export default function StatusBar() {
  const { loading, data } = usePresaleProgress();
  // Safe number 0..100
  const pct: number = useMemo(() => {
    const p = !loading && data ? Number(data.purchasedPercent) : 0;
    if (!Number.isFinite(p)) return 0;
    return Math.max(0, Math.min(100, p));
  }, [loading, data]);

  // Layout calc: how many small segments fit in container width
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [count, setCount] = useState<number>(12);

  // constants to match your SVGs and MUI gap (xs: 0.5 -> 4px; lg: 1 -> 8px)
  const SEG_W = 21; // px
  const GAP_XS = 4; // px
  const GAP_LG = 8; // px

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (!entry) return;
        const w = entry.contentRect.width;
        const gap = w >= 1024 ? GAP_LG : GAP_XS;
        const per = SEG_W + gap;
        const n = Math.max(1, Math.floor((w + gap) / per));
        setCount(n);
      });
      
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <Stack
      ref={containerRef}
      position="relative"
      width="100%"
      height={18}
      // the bar is 18px high because your SVGs are 18 high
      sx={{
        overflow: "hidden",
        borderRadius: "9px",
      }}
    >
      {/* Base: fill entire width with small segments */}
      <Stack
        direction="row"
        alignItems="center"
        gap={{ xs: 0.5, lg: 1 }}
        width="100%"
        height="100%"
      >
        {Array.from({ length: count }).map((_, i) => (
          <SmallSegment key={i} />
        ))}
      </Stack>

      {/* Overlay: purchased fill (solid #5EBBC3), grows with pct */}
      {/* We use an absolutely positioned SVG rect so it stays crisp */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="18"
        viewBox="0 0 100 18"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }}
      >
        {/* The rect width is pct% of the viewBox width (0..100) */}
        <rect x="0" y="0" width={pct} height="18" fill="#5EBBC3" rx="9" ry="9" />
      </svg>
    </Stack>
  );
}
