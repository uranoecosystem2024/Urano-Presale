"use client";

import * as React from "react";
import { Box } from "@mui/material";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ---------------- SVG fallback (visible on first paint) --------------- */
/* It rotates the belt so the user immediately sees the intended effect. */

function FallbackSVG({ animate = true }: { animate?: boolean }) {
  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%" aria-hidden>
      <defs>
        <linearGradient id="sphereFill" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#5EBBC3" />
          <stop offset="100%" stopColor="#6DE7C2" />
        </linearGradient>
        <radialGradient id="shade" cx="35%" cy="30%" r="60%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.65)" />
          <stop offset="40%" stopColor="rgba(255,255,255,0.15)" />
          <stop offset="60%" stopColor="rgba(0,0,0,0.00)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.30)" />
        </radialGradient>
        <radialGradient id="spec" cx="30%" cy="28%" r="18%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="60%" stopColor="rgba(255,255,255,0.0)" />
        </radialGradient>
        <path
          id="orbitPath"
          d="M 200,200 m -138,0 a 138,56 0 1,0 276,0 a 138,56 0 1,0 -276,0"
        />
        <mask id="frontMask">
          <rect x="0" y="0" width="400" height="400" fill="black" />
          <ellipse cx="200" cy="215" rx="160" ry="70" fill="white" />
        </mask>
      </defs>

      <style>{`
        @keyframes orbit { to { transform: rotate(360deg) } }
        .orbiting { transform-box: fill-box; transform-origin: 50% 50%; ${
          animate ? "animation: orbit 7.5s linear infinite;" : ""
        } }
      `}</style>

      {/* back side of belt */}
      <g className="orbiting">
        <ellipse
          cx="200"
          cy="200"
          rx="150"
          ry="62"
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="8"
        />
        <text fontSize="18" fontWeight={700} letterSpacing="2" fill="rgba(255,255,255,0.9)">
          <textPath href="#orbitPath" startOffset="0%">
            {("  URANO ECOSYSTEM   •   ").repeat(12)}
          </textPath>
        </text>
      </g>

      {/* sphere */}
      <g>
        <circle cx="200" cy="200" r="120" fill="url(#sphereFill)" />
        <circle cx="200" cy="200" r="120" fill="url(#shade)" />
        <ellipse cx="170" cy="165" rx="36" ry="22" fill="url(#spec)" />
      </g>

      {/* front side of belt */}
      <g className="orbiting" mask="url(#frontMask)">
        <ellipse
          cx="200"
          cy="200"
          rx="150"
          ry="62"
          fill="none"
          stroke="rgba(255,255,255,0.65)"
          strokeWidth="8"
        />
        <text fontSize="18" fontWeight={700} letterSpacing="2" fill="rgba(255,255,255,0.9)">
          <textPath href="#orbitPath" startOffset="0%">
            {("  URANO ECOSYSTEM   •   ").repeat(12)}
          </textPath>
        </text>
      </g>
    </svg>
  );
}

/* ---------------- helpers for 3D characters ---------------- */

const glyphCache = new Map<string, THREE.CanvasTexture>();

function makeGlyphTexture(char: string, px = 256): THREE.CanvasTexture {
  const cached = glyphCache.get(char);
  if (cached) return cached;

  const c = document.createElement("canvas");
  c.width = px;
  c.height = px;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("2D context not available");

  ctx.clearRect(0, 0, px, px);
  ctx.fillStyle = "rgba(255,255,255,0.0)";
  ctx.fillRect(0, 0, px, px);

  // Draw the glyph
  const fontPx = Math.round(px * 0.7);
  ctx.font =
    `700 ${fontPx}px Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.fillText(char, px / 2, px / 2);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearMipMapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;

  glyphCache.set(char, tex);
  return tex;
}

function buildCharsToFit(radius: number, charWidthWorld = 0.18): string[] {
  const base = "  URANO ECOSYSTEM  •  ";
  const circumference = 2 * Math.PI * radius;
  const targetCount = Math.max(28, Math.floor(circumference / charWidthWorld));
  let s = base;
  while (s.length < targetCount) s += base;
  return s.slice(0, targetCount).split("");
}

/* ---------------- 3D scene ---------------- */

const GradientSphere: React.FC = () => {
  const gradientTex = React.useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 512;
    const ctx = c.getContext("2d");
    if (!ctx) throw new Error("2D context not available");
    const grad = ctx.createLinearGradient(0, 0, c.width, 0);
    grad.addColorStop(0, "#5EBBC3");
    grad.addColorStop(1, "#6DE7C2");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, c.width, c.height);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
  const { gl } = useThree();
  React.useEffect(() => {
    gradientTex.anisotropy = Math.min(gl.capabilities.getMaxAnisotropy(), 8);
  }, [gl, gradientTex]);

  return (
    <mesh castShadow receiveShadow>
      <sphereGeometry args={[1.25, 64, 64]} />
      <meshPhysicalMaterial
        map={gradientTex}
        color="#ffffff"
        roughness={0.35}
        metalness={0.05}
        clearcoat={0.35}
        clearcoatRoughness={0.4}
      />
    </mesh>
  );
};

const BeltTorus: React.FC<{ radius: number; tube: number }> = ({ radius, tube }) => (
  <mesh castShadow receiveShadow>
    <torusGeometry args={[radius, tube, 40, 360]} />
    <meshStandardMaterial color="#ffffff" roughness={0.45} metalness={0.05} />
  </mesh>
);

const RingLetters3D: React.FC<{
  radius: number;
  tube: number;
  speed: number;
  reduceMotion: boolean;
}> = ({ radius, tube, speed, reduceMotion }) => {
  const groupRef = React.useRef<THREE.Group>(null);
  const chars = React.useMemo(() => buildCharsToFit(radius), [radius]);
  const textures = React.useMemo(() => {
    return chars.map((ch) => makeGlyphTexture(ch));
  }, [chars]);

  // Rotate whole ring around Y (equator)
  useFrame((_, delta) => {
    if (groupRef.current && !reduceMotion) {
      groupRef.current.rotation.y += delta * speed;
    }
  });

  const outwardR = radius + tube + 0.04; // push a bit outside the torus to avoid z-fighting
  const charH = 0.34; // world units
  const charW = 0.18;

  return (
    <group ref={groupRef}>
      {chars.map((ch, i) => {
        // Skip totally empty glyphs (optional)
        const theta = (i / chars.length) * Math.PI * 2;
        const x = outwardR * Math.cos(theta);
        const z = outwardR * Math.sin(theta);
        const rotY = theta + Math.PI / 2; // face outward, perpendicular to tangent
        return (
          <mesh key={`${ch}-${i}`} position={[x, 0, z]} rotation={[0, rotY, 0]}>
            <planeGeometry args={[charW, charH]} />
            <meshBasicMaterial
              map={textures[i]}
              transparent
              depthTest
              depthWrite
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
};

const Scene: React.FC<{ reduceMotion: boolean }> = ({ reduceMotion }) => {
  const lightRef = React.useRef<THREE.DirectionalLight>(null);
  React.useEffect(() => {
    if (lightRef.current) lightRef.current.shadow.mapSize.set(1024, 1024);
  }, []);
  const radius = 1.9;
  const tube = 0.06;
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight ref={lightRef} position={[3, 4, 5]} intensity={1} castShadow />
      <GradientSphere />
      <group /* keep the belt perfectly horizontal */ rotation={[0, 0, 0]}>
        <BeltTorus radius={radius} tube={tube} />
        <RingLetters3D radius={radius} tube={tube} speed={0.6} reduceMotion={reduceMotion} />
      </group>
    </>
  );
};

/* ---------------- Preloader overlay ---------------- */

const UranoPreloader3D: React.FC = () => {
  const [visible, setVisible] = React.useState(true);
  const [fading, setFading] = React.useState(false);
  const [reduceMotion, setReduceMotion] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);

  // Render Canvas after mount, but keep SVG fallback visible immediately
  React.useEffect(() => {
    setHydrated(true);
  }, []);

  // Reduced motion
  React.useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduceMotion(m.matches);
    onChange();
    m.addEventListener("change", onChange);
    return () => m.removeEventListener("change", onChange);
  }, []);

  // Show for >= 4s and until window 'load'
  React.useEffect(() => {
    const MIN_MS = 14000;
    const start = performance.now();

    let tMin: number | undefined;
    let tFade: number | undefined;
    let removeLoad: (() => void) | undefined;

    const waitMin = new Promise<void>((resolve) => {
      const remaining = Math.max(0, MIN_MS - (performance.now() - start));
      tMin = window.setTimeout(resolve, remaining);
    });

    const waitLoad = new Promise<void>((resolve) => {
      if (document.readyState === "complete") {
        resolve();
        return;
      }
      const onLoad = () => {
        window.removeEventListener("load", onLoad);
        resolve();
      };
      window.addEventListener("load", onLoad);
      removeLoad = () => window.removeEventListener("load", onLoad);
    });

    void Promise.all([waitMin, waitLoad])
      .then(() => {
        setFading(true);
        tFade = window.setTimeout(() => setVisible(false), 420);
      })
      .catch(() => {
        setFading(true);
        tFade = window.setTimeout(() => setVisible(false), 420);
      });

    return () => {
      if (tMin) window.clearTimeout(tMin);
      if (tFade) window.clearTimeout(tFade);
      if (removeLoad) removeLoad();
    };
  }, []);

  // Lock scroll
  React.useEffect(() => {
    if (!visible) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <Box
      role="status"
      aria-label="Loading Urano"
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        display: "grid",
        placeItems: "center",
        bgcolor: (t) => t.palette.background.default,
        transition: "opacity 400ms ease",
        opacity: fading ? 0 : 1,
      }}
    >
      <Box
        sx={{
          // animations defined here exist during SSR as well
          "@keyframes orbit": { to: { transform: "rotate(360deg)" } },
          width: { xs: 280, sm: 340, md: 420 },
          height: { xs: 280, sm: 340, md: 420 },
          position: "relative",
          filter: "drop-shadow(0 28px 60px rgba(0,0,0,0.25))",
        }}
      >
        {/* SVG fallback — visible immediately, animated */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            opacity: hydrated ? 0 : 1,
            transition: "opacity 180ms ease",
          }}
        >
          <FallbackSVG animate />
        </Box>

        {/* 3D Canvas — takes over after hydration */}
        {hydrated && (
          <Canvas
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
            camera={{ position: [0, 0, 5.5], fov: 45, near: 0.1, far: 100 }}
            shadows
            style={{ position: "absolute", inset: 0 }}
          >
            {/* keep belt horizontal (no tilt) as requested */}
            <Scene reduceMotion={reduceMotion} />
          </Canvas>
        )}
      </Box>
    </Box>
  );
};

export default UranoPreloader3D;
