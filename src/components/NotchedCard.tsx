import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { type SxProps } from "@mui/material";
type NotchedPanelProps = {
  title: string;
  children?: React.ReactNode;
  borderColor?: string;
  strokeWidth?: number;
  borderRadius?: number;
  tabWidth?: number;
  tabHeight?: number;
  tabSlope?: number;
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
  const r = Math.min(borderRadius, 20);

  const d =
    w && h
      ? [
          `M ${r},${h}`,
          `L ${w - r},${h}`,
          `A ${r} ${r} 0 0 0 ${w},${h - r}`,
          `L ${w},${tabHeight + r}`,
          `A ${r} ${r} 0 0 0 ${w - r},${tabHeight}`,
          `L ${Math.max(tabWidth - tabSlope, r)},${tabHeight}`,
          `L ${tabWidth},0`,
          `L ${r},0`,
          `A ${r} ${r} 0 0 0 0,${r}`,
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
          bgcolor: "#0f1011",
          clipPath: `polygon(0 0, 100% 0, calc(100% - ${tabSlope}px) 100%, 0 100%)`,
          borderTopLeftRadius: borderRadius,
          pointerEvents: "none",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, letterSpacing: 0.2, color: "#62e6d1" }}
        >
          {title}
        </Typography>
      </Box>

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

      <Box sx={{ mt: 1 }}>{children}</Box>
    </Box>
  );
}
