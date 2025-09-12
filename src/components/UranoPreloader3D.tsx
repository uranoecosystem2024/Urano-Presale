"use client";

import * as React from "react";
import { Box } from "@mui/material";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/** Sphere gradient: linear 90° (#5EBBC3 -> #6DE7C2) */
function makeLinearGradientTexture(width = 1024, height = 512): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D context not available");
  const grad = ctx.createLinearGradient(0, 0, width, 0);
  grad.addColorStop(0, "#5EBBC3");
  grad.addColorStop(1, "#6DE7C2");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/** Text texture for the belt */
function makeTextBeltTexture(
  text = "URANO ECOSYSTEM",
  width = 2048,
  height = 256
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D context not available");

  ctx.clearRect(0, 0, width, height);
  const fontPx = Math.round(height * 0.6);
  ctx.font = `700 ${fontPx}px Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"`;
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.textBaseline = "middle";

  const unit = `  ${text}   •   `;
  const w = ctx.measureText(unit).width;
  const y = height / 2;
  for (let x = -w; x < width + w; x += w) ctx.fillText(unit, x, y);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.minFilter = THREE.LinearMipMapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

const GradientSphere: React.FC = () => {
  const gradientTex = React.useMemo(() => makeLinearGradientTexture(), []);
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

const TextBelt: React.FC<{ radius?: number; tube?: number; speed?: number }> = ({
  radius = 2.0,
  tube = 0.12,
  speed = 0.6,
}) => {
  const groupRef = React.useRef<THREE.Group>(null);
  const textTex = React.useMemo(() => makeTextBeltTexture(), []);
  const { gl } = useThree();

  React.useEffect(() => {
    textTex.anisotropy = Math.min(gl.capabilities.getMaxAnisotropy(), 8);
    textTex.needsUpdate = true;
  }, [gl, textTex]);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * speed;
  });

  return (
    <group ref={groupRef}>
      <mesh castShadow receiveShadow>
        {/* Torus sits flat (equatorial) by default */}
        <torusGeometry args={[radius, tube, 40, 360]} />
        <meshStandardMaterial map={textTex} transparent color="#ffffff" roughness={0.4} />
      </mesh>
    </group>
  );
};

const Scene: React.FC<{ reduceMotion: boolean }> = ({ reduceMotion }) => {
  const lightRef = React.useRef<THREE.DirectionalLight>(null);
  React.useEffect(() => {
    if (lightRef.current) lightRef.current.shadow.mapSize.set(1024, 1024);
  }, []);
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight ref={lightRef} position={[3, 4, 5]} intensity={1} castShadow />
      <GradientSphere />
      <TextBelt speed={reduceMotion ? 0 : 0.6} />
    </>
  );
};

const UranoPreloader3D: React.FC = () => {
  const [visible, setVisible] = React.useState(true);     // overlay is SSR-visible
  const [fading, setFading] = React.useState(false);
  const [reduceMotion, setReduceMotion] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);  // gate Canvas only

  React.useEffect(() => {
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduceMotion(m.matches);
    onChange();
    m.addEventListener("change", onChange);
    return () => m.removeEventListener("change", onChange);
  }, []);

  React.useEffect(() => {
    const MIN_MS = 800; // increase if you want it longer
    let t1: number | undefined;
    let t2: number | undefined;

    const finish = () => {
      setFading(true);
      t2 = window.setTimeout(() => setVisible(false), 420);
    };

    if (document.readyState === "complete") {
      // Page already loaded (e.g., from cache) — still show briefly
      t1 = window.setTimeout(finish, MIN_MS);
    } else {
      const onLoad = () => {
        window.removeEventListener("load", onLoad);
        t1 = window.setTimeout(finish, MIN_MS);
      };
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    }

    return () => {
      if (t1) window.clearTimeout(t1);
      if (t2) window.clearTimeout(t2);
    };
  }, []);

  // Lock scroll while visible
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
          width: { xs: 280, sm: 340, md: 420 },
          height: { xs: 280, sm: 340, md: 420 },
          filter: "drop-shadow(0 28px 60px rgba(0,0,0,0.25))",
        }}
      >
        {/* SSR fallback while hydrating to avoid the initial flash */}
        {!hydrated ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "9999px",
              background: "linear-gradient(90deg, #5EBBC3 0%, #6DE7C2 100%)",
            }}
          />
        ) : (
          <Canvas
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
            camera={{ position: [0, 0, 5.5], fov: 45, near: 0.1, far: 100 }}
            shadows
          >
            {/* slight tilt so the belt reads nicely */}
            <group rotation={[0, 0.15, 0]}>
              <Scene reduceMotion={reduceMotion} />
            </group>
          </Canvas>
        )}
      </Box>
    </Box>
  );
};

export default UranoPreloader3D;
