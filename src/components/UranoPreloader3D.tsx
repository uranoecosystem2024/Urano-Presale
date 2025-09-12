"use client";

import * as React from "react";
import { Box } from "@mui/material";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ---------------- Sphere texture (exact requested gradient) ---------------- */
function makeSphereGradient(): THREE.CanvasTexture {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 512;
    const ctx = c.getContext("2d");
    if (!ctx) throw new Error("2D context not available");
    // 90deg = left -> right
    const g = ctx.createLinearGradient(0, 0, c.width, 0);
    g.addColorStop(0, "#5EBBC3");
    g.addColorStop(1, "#6DE7C2");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, c.width, c.height);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
}

/* ---------------- Glyph textures ---------------- */
const glyphCache = new Map<string, THREE.CanvasTexture>();

function makeGlyph(char: string, px = 1536): THREE.CanvasTexture {
    const cached = glyphCache.get(char);
    if (cached) return cached;

    const c = document.createElement("canvas");
    c.width = px;
    c.height = px;
    const ctx = c.getContext("2d");
    if (!ctx) throw new Error("2D context not available");

    ctx.clearRect(0, 0, px, px);
    ctx.font =
        `700 ${Math.round(px * 0.7)}px Conthrax`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(255,255,255,1)";
    ctx.fillText(char, px / 2, px / 2);

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearMipMapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.premultiplyAlpha = true;
    tex.needsUpdate = true;

    glyphCache.set(char, tex);
    return tex;
}

/* ---------------- 3D primitives ---------------- */
const Sphere: React.FC<{ radius: number }> = ({ radius }) => {
    const tex = React.useMemo(() => makeSphereGradient(), []);
    const { gl } = useThree();
    React.useEffect(() => {
        tex.anisotropy = Math.min(gl.capabilities.getMaxAnisotropy(), 8);
    }, [gl, tex]);

    return (
        <mesh castShadow receiveShadow>
            <sphereGeometry args={[radius, 64, 64]} />
            {/* Keep lighting for 3D feel; the map carries the exact gradient */}
            <meshPhysicalMaterial
                map={tex}
                color="#ffffff"
                roughness={0.35}
                metalness={0.05}
                clearcoat={0.35}
                clearcoatRoughness={0.4}
            />
        </mesh>
    );
};

/** Characters around the equator; no solid torus, just letters. */
const RingLetters: React.FC<{
    radius: number;          // distance of letters from center
    speed: number;
    reduceMotion: boolean;
    text?: string;
}> = ({ radius, speed, reduceMotion, text = "URANO | URANO | URANO | URANO | " }) => {
    const group = React.useRef<THREE.Group>(null);
    const { gl } = useThree();

    // Larger letters so they're clearer next to the bigger sphere
    const charW = 0.56;   // world units
    const charH = 1.04;   // world units

    const circumference = 2 * Math.PI * radius;
    const count = Math.max(24, Math.floor(circumference / charW));
    const base = `${text}`;

    const chars = React.useMemo(() => {
        let s = "";
        while (s.length < count) s += base;
        // Reverse so at the front the text reads left->right
        return s.slice(0, count).split("").reverse();
    }, [base, count]);

    const textures = React.useMemo(() => chars.map((ch) => makeGlyph(ch)), [chars]);

    React.useEffect(() => {
        const maxAniso = Math.min(gl.capabilities.getMaxAnisotropy(), 8);
        textures.forEach((t) => (t.anisotropy = maxAniso));
    }, [gl, textures]);

    useFrame((_, d) => {
        if (group.current && !reduceMotion) group.current.rotation.y -= d * speed;
    });

    return (
        <group ref={group}>
            {chars.map((ch, i) => {
                const theta = (i / count) * Math.PI * 2; // negative => front reads L->R
                const x = radius * Math.cos(theta);
                const z = radius * Math.sin(theta);
                const rotY = Math.atan2(x, z); // face outward

                return (
                    <mesh key={`${ch}-${i}`} position={[x, 0, z]} rotation={[0, rotY, 0]}>
                        <planeGeometry args={[charW, charH]} />
                        <meshBasicMaterial
                            map={textures[i]}
                            transparent
                            alphaTest={0.06}
                            depthTest
                            depthWrite
                            side={THREE.DoubleSide}
                            toneMapped={false}
                        />
                    </mesh>
                );
            })}
        </group>
    );
};

const Scene: React.FC<{ reduceMotion: boolean }> = ({ reduceMotion }) => {
    // Bigger sphere + belt closer
    const sphereRadius = 1.6;  // was 1.25
    const beltRadius = 1.74; // closer to sphere (≈ 0.12 gap)

    const lightRef = React.useRef<THREE.DirectionalLight>(null);
    React.useEffect(() => {
        if (lightRef.current) lightRef.current.shadow.mapSize.set(1024, 1024);
    }, []);

    const beltTiltZ = 0.2;

    return (
        <>
            <ambientLight intensity={0.45} />
            <directionalLight ref={lightRef} position={[3, 4, 5]} intensity={1} castShadow />
            <Sphere radius={sphereRadius} />
            {/* strictly horizontal, equatorial text ring */}
            <group rotation={[0, 0, beltTiltZ]}>
                <RingLetters radius={beltRadius} speed={0.6} reduceMotion={reduceMotion} />
            </group>
        </>
    );
};

/* ---------------- Preloader overlay (Canvas only) ---------------- */
const UranoPreloader3D: React.FC = () => {
    const [visible, setVisible] = React.useState(true);
    const [fading, setFading] = React.useState(false);
    const [reduceMotion, setReduceMotion] = React.useState(false);

    React.useEffect(() => {
        const m = window.matchMedia("(prefers-reduced-motion: reduce)");
        const onChange = () => setReduceMotion(m.matches);
        onChange();
        m.addEventListener("change", onChange);
        return () => m.removeEventListener("change", onChange);
    }, []);

    // >= 10s AND wait for window 'load'
    React.useEffect(() => {
        const MIN_MS = 10000; // ⬅️ 10 seconds
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
                    width: { xs: 320, sm: 420, md: 520 }, // a bit larger container to fit bigger sphere
                    height: { xs: 320, sm: 420, md: 520 },
                    position: "relative",
                    filter: "drop-shadow(0 28px 60px rgba(0,0,0,0.25))",
                }}
            >
                <Canvas
                    dpr={[1, 2]}
                    gl={{ antialias: true, alpha: true }}
                    camera={{ position: [0, 0, 6.2], fov: 45, near: 0.1, far: 100 }} // pull camera back to frame larger scene
                    shadows
                    style={{ position: "absolute", inset: 0 }}
                >
                    <Scene reduceMotion={reduceMotion} />
                </Canvas>
            </Box>
        </Box>
    );
};

export default UranoPreloader3D;
