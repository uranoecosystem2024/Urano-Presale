import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { type SxProps } from "@mui/material";
type NotchedPanelProps = {
  title: string;
  children?: React.ReactNode;
  /** Visual params (tweak to match your design) */
  borderColor?: string;
  strokeWidth?: number;
  borderRadius?: number;
  tabWidth?: number;     // width of the top-left tab (px)
  tabHeight?: number;    // height the tab rises above the panel (px)
  tabSlope?: number;     // the diagonal cut on the tab’s right edge (px)
  sx?: SxProps;
};

export default function NotchedPanel({
  title,
  children,
  borderColor = "#fff",
  strokeWidth = 2,
  borderRadius = 12,
  tabWidth = 190,
  tabHeight = 42,
  tabSlope = 26,
  sx,
}: NotchedPanelProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [size, setSize] = React.useState({ w: 0, h: 0 });

  // Keep the SVG path perfectly in sync with the element’s box
  React.useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry?.contentRect ?? { width: 0, height: 0 };
      setSize({ w: width, h: height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  const { w, h } = size;
  const r = Math.min(borderRadius, 20); // clamp a bit for nicer corners

  // We draw one closed path that goes around: bottom → right → top →
  // tab diagonal → tab top → tab left → down left edge → bottom.
  // (Top-left of the main rectangle is square on purpose for a crisp join.)
  const d =
    w && h
      ? [
          // start bottom-left (after radius)
          `M ${r},${h}`,
          // bottom edge → bottom-right corner
          `L ${w - r},${h}`,
          `A ${r} ${r} 0 0 0 ${w},${h - r}`,
          // right edge → top-right corner
          `L ${w},${tabHeight + r}`,
          `A ${r} ${r} 0 0 0 ${w - r},${tabHeight}`,
          // top edge until the notch
          `L ${Math.max(tabWidth - tabSlope, r)},${tabHeight}`,
          // diagonal up into the tab
          `L ${tabWidth},0`,
          // across the tab top → top-left outer corner (rounded)
          `L ${r},0`,
          `A ${r} ${r} 0 0 0 0,${r}`,
          // down the left edge to bottom-left corner
          `L 0,${h - r}`,
          `A ${r} ${r} 0 0 0 ${r},${h}`,
          "Z",
        ].join(" ")
      : "";

  return (
    <Box
      ref={ref}
      sx={{
        position: "relative",
        bgcolor: "#0f1011",
        borderRadius,
        pt: 3,
        pb: 4,
        px: 4,
        minHeight: 220,
      }}
    >
      {/* Title positioned inside the tab region */}
      <Box
        sx={{
          position: "absolute",
          top: `-${tabHeight}px`,
          left: 0,
          width: tabWidth,
          height: tabHeight,
          display: "flex",
          alignItems: "center",
          pl: 3,
          pr: 2,
          // Make the tab’s fill match the panel
          bgcolor: "#0f1011",
          // visually cut the right edge into a diagonal so the fill matches the outline
          clipPath: `polygon(0 0, 100% 0, calc(100% - ${tabSlope}px) 100%, 0 100%)`,
          borderTopLeftRadius: borderRadius,
          pointerEvents: "none", // tab is decorative; keeps hover/press simple
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, letterSpacing: 0.2, color: "#62e6d1" }}
        >
          {title}
        </Typography>
      </Box>

      {/* The single-stroke outline that goes around both panel and tab */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${Math.max(w, 1)} ${Math.max(h, 1)}`}
          preserveAspectRatio="none"
          style={{ display: "block" }}
        >
          {/* Expand the drawing area upward to include the tab */}
          <g transform={`translate(0,0)`}>
            <path
              d={d}
              fill="none"
              stroke={borderColor}
              strokeWidth={strokeWidth}
              vectorEffect="non-scaling-stroke"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </Box>

      {/* your content */}
      <Box sx={{ mt: 1 }}>{children}</Box>
    </Box>
  );
}
