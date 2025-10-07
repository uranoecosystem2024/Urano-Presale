"use client";

import * as React from "react";
import { Box } from "@mui/material";

export default function UranoPreloader() {
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const MIN_SHOWN_MS = 800;
    let timeout: number | undefined;

    const hide = () => {
      timeout = window.setTimeout(() => setVisible(false), MIN_SHOWN_MS);
    };

    if (document.readyState === "complete") {
      hide();
    } else {
      const onLoad = () => {
        hide();
        window.removeEventListener("load", onLoad);
      };
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    }

    return () => clearTimeout(timeout);
  }, []);

  React.useEffect(() => {
    if (visible) {
      const prev = document.documentElement.style.overflow;
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.documentElement.style.overflow = prev;
      };
    }
  }, [visible]);

  if (!visible) return null;

  const size = 360;

  return (
    <Box
      role="status"
      aria-label="Loading Urano"
      aria-live="polite"
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        display: "grid",
        placeItems: "center",
        bgcolor: (t) => t.palette.background.default,
        transition: "opacity 400ms ease",
      }}
    >
      <Box
        sx={{
          width: { xs: 260, sm: 320, md: size },
          height: { xs: 260, sm: 320, md: size },
          filter: "drop-shadow(0 28px 60px rgba(0,0,0,0.25))",
          // Keyframes
          "@keyframes uranoOrbit": {
            to: { transform: "rotate(360deg)" },
          },
          "@keyframes uranoPulse": {
            "0%, 100%": { transform: "scale(1)" },
            "50%": { transform: "scale(1.02)" },
          },
          "@media (prefers-reduced-motion: reduce)": {
            "& svg .orbit, & svg .breath": { animation: "none !important" },
          },
          "& svg .orbit": {
            transformBox: "fill-box",
            transformOrigin: "50% 50%",
            animation: "uranoOrbit 7.5s linear infinite",
            willChange: "transform",
          },
          "& svg .breath": {
            transformBox: "fill-box",
            transformOrigin: "50% 50%",
            animation: "uranoPulse 3s ease-in-out infinite",
            willChange: "transform",
          },
        }}
      >
        <svg
          viewBox="0 0 400 400"
          width="100%"
          height="100%"
          aria-hidden
          focusable="false"
        >
          <defs>
            <linearGradient id="sphereFill" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#5EBBC3" />
              <stop offset="100%" stopColor="#6DE7C2" />
            </linearGradient>

            <radialGradient id="shade" cx="35%" cy="30%" r="60%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.65)" />
              <stop offset="40%" stopColor="rgba(255,255,255,0.15)" />
              <stop offset="60%" stopColor="rgba(0,0,0,0.00)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
            </radialGradient>

            <radialGradient id="spec" cx="30%" cy="28%" r="18%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
              <stop offset="60%" stopColor="rgba(255,255,255,0.0)" />
            </radialGradient>

            <path
              id="orbitPath"
              d="
                M 200,200
                m -138,0
                a 138,56 0 1,0 276,0
                a 138,56 0 1,0 -276,0
              "
            />

            <mask id="frontMask">
              <rect x="0" y="0" width="400" height="400" fill="black" />
              <ellipse cx="200" cy="200" rx="160" ry="70" fill="white" />
            </mask>
          </defs>

          <g className="orbit" style={{ transform: "rotateZ(0deg)" }}>
            <ellipse
              cx="200"
              cy="200"
              rx="150"
              ry="62"
              fill="none"
              stroke="rgba(255,255,255,0.20)"
              strokeWidth="6"
            />
            <text
              fontSize="18"
              fontWeight={600}
              letterSpacing="2"
              fill="rgba(255,255,255,0.32)"
            >
              <textPath href="#orbitPath" startOffset="0%">
                {("  URANO ECOSYSTEM   ·   ").repeat(12)}
              </textPath>
            </text>
          </g>

          <g className="breath">
            <circle cx="200" cy="200" r="120" fill="url(#sphereFill)" />
            <circle cx="200" cy="200" r="120" fill="url(#shade)" />
            <ellipse cx="170" cy="165" rx="36" ry="22" fill="url(#spec)" />
          </g>

          <g className="orbit" style={{ transform: "rotateZ(0deg)" }} mask="url(#frontMask)">
            <ellipse
              cx="200"
              cy="200"
              rx="150"
              ry="62"
              fill="none"
              stroke="rgba(255,255,255,0.60)"
              strokeWidth="6"
            />
            <text
              fontSize="18"
              fontWeight={700}
              letterSpacing="2"
              fill="rgba(255,255,255,0.85)"
            >
              <textPath href="#orbitPath" startOffset="0%">
                {("  URANO ECOSYSTEM   ·   ").repeat(12)}
              </textPath>
            </text>
          </g>
        </svg>
      </Box>
    </Box>
  );
}
