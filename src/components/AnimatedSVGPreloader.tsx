"use client";

import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";

type Props = {
    src?: string;            // logo svg under /public
    textSrc?: string;        // text svg under /public
    showMs?: number;         // minimum visible time (ms)
    strokeWidth?: number;    // drawing stroke width
    pathDuration?: number;   // ms per path
    stagger?: number;        // ms between paths
    fillFadeMs?: number;     // ms for logo fill fade-in
    scale?: number;          // scale for logo (1 = 100%)
    textScale?: number;      // scale for text (defaults to scale)
    textGapPx?: number;      // gap between logo and text
    textFadeMs?: number;     // fade-in duration for text
};

export default function AnimatedSVGPreloader({
    src = "/main-logo.svg",
    textSrc = "/urano-text.svg",
    showMs = 4_000,
    strokeWidth = 1,
    pathDuration = 1400,
    stagger = 120,
    fillFadeMs = 500,
    scale = 0.7,
    textScale,
    textGapPx = 16,
    textFadeMs,
}: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        let active = true;
        const abort = new AbortController();

        const run = async () => {
            const startedAt = performance.now();
            try {
                // fetch logo + text concurrently
                const [logoMarkup, textMarkup] = await Promise.all([
                    fetch(src, { cache: "force-cache", signal: abort.signal }).then((r) => r.text()),
                    fetch(textSrc, { cache: "force-cache", signal: abort.signal })
                        .then((r) => r.text())
                        .catch(() => null), // text is optional; don't fail the preloader
                ]);
                if (!active) return;

                const host = containerRef.current;
                if (!host) return;

                host.style.display = "flex";
                host.style.flexDirection = "column";
                host.style.alignItems = "center";

                // inject & prep logo (draw layer + final layer)
                const prep = injectAndPrepareLogo(host, logoMarkup, strokeWidth, scale);
                if (!prep) {
                    await waitRemaining(startedAt, showMs);
                    if (active) setVisible(false);
                    return;
                }
                const { finalPaths, drawPaths, lengths } = prep;

                // inject text under the logo and fade it in
                let textEl: SVGSVGElement | null = null;
                if (textMarkup) {
                    const el = createSvgFromMarkup(textMarkup);
                    if (el) {
                        el.setAttribute("preserveAspectRatio", "xMidYMid meet");
                        el.setAttribute("shape-rendering", "geometricPrecision");
                        el.style.display = "block";
                        const tScale = textScale ?? scale;
                        const { px, vw } = computeScaledWidth(tScale);
                        el.style.width = `min(${px}px, ${vw}vw)`;
                        el.style.height = "auto";
                        el.style.marginTop = `${Math.max(0, textGapPx)}px`;
                        el.style.opacity = "0";
                        // hard-center even if host styles change later
                        el.style.marginLeft = "auto";
                        el.style.marginRight = "auto";
                        host.appendChild(el);
                        textEl = el;
                    }
                }

                await drawPathsWithRaf(drawPaths, lengths, {
                    duration: pathDuration,
                    stagger,
                    signal: abort.signal,
                });

                await fadeFillsIn(finalPaths, fillFadeMs, abort.signal);

                // remove the stroke clones
                for (const p of drawPaths) p.remove();

                // --- now just fade the already-laid-out text in (no layout shift) ---
                if (textEl) {
                    await fadeElementOpacity(textEl, textFadeMs ?? fillFadeMs, abort.signal);
                }

                // honor the minimum display time
                await waitRemaining(startedAt, showMs);
                if (active) setVisible(false);
            } catch {
                await waitRemaining(startedAt, showMs);
                if (active) setVisible(false);
            }
        };

        void run(); // no-floating-promises: explicitly ignored

        return () => {
            active = false;
            abort.abort();
        };
    }, [
        fillFadeMs,
        pathDuration,
        scale,
        showMs,
        src,
        stagger,
        strokeWidth,
        textFadeMs,
        textGapPx,
        textScale,
        textSrc,
    ]);

    return (
        <Box
            aria-hidden={!visible}
            sx={{
                position: "fixed",
                inset: 0,
                zIndex: (t) => t.zIndex.modal + 2,
                bgcolor: "background.default",
                display: "grid",
                placeItems: "center",
                transition: "opacity 400ms ease",
                opacity: visible ? 1 : 0,
                pointerEvents: visible ? "auto" : "none",
            }}
        >
            <Box ref={containerRef} />
        </Box>
    );
}

/* ---------------- internals ---------------- */

type LogoPrep = {
    finalPaths: SVGPathElement[];
    drawPaths: SVGPathElement[];
    lengths: number[];
    svgWidthCss: string; // the CSS width we used (for consistency if needed)
};

function injectAndPrepareLogo(
    host: HTMLDivElement,
    svgMarkup: string,
    strokeWidth: number,
    scale: number
): LogoPrep | null {
    const svg = createSvgFromMarkup(svgMarkup);
    if (!svg) return null;

    // quality & sizing (scaled)
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.setAttribute("shape-rendering", "geometricPrecision");
    svg.style.display = "block";

    const { px, vw } = computeScaledWidth(scale);
    const widthCss = `min(${px}px, ${vw}vw)`;
    svg.style.width = widthCss;
    svg.style.height = "auto";

    // originals (final filled logo), start invisible
    const finalPaths = Array.from(svg.querySelectorAll<SVGPathElement>("path"));
    for (const p of finalPaths) (p as SVGElement).style.fillOpacity = "0";

    // clones for drawing (stroke-only), placed AFTER originals so they render on top
    const drawPaths: SVGPathElement[] = [];
    const lengths: number[] = [];
    for (const original of finalPaths) {
        const clone = original.cloneNode(true) as SVGPathElement;
        const origFill = original.getAttribute("fill");
        const stroke = origFill && origFill !== "none" ? origFill : "#14EFC0";

        clone.setAttribute("fill", "none");
        clone.setAttribute("stroke", stroke);
        clone.setAttribute("stroke-width", String(strokeWidth));
        clone.setAttribute("vector-effect", "non-scaling-stroke");
        clone.setAttribute("stroke-linecap", "round");
        clone.setAttribute("stroke-linejoin", "round");
        (clone as SVGElement).style.paintOrder = "stroke fill";

        const len = getPathLengthSafe(clone);
        lengths.push(len);
        const el = clone as unknown as SVGElement;
        el.style.strokeDasharray = `${len}`;
        el.style.strokeDashoffset = `${len}`;

        original.parentNode?.appendChild(clone);
        drawPaths.push(clone);
    }

    host.replaceChildren(svg);
    return { finalPaths, drawPaths, lengths, svgWidthCss: widthCss };
}

function computeScaledWidth(scale: number): { px: number; vw: number } {
    // These match your previous baseline: min(360px, 60vw) * scale
    const basePx = 360;
    const baseVw = 60;
    return { px: Math.round(basePx * scale), vw: baseVw * scale };
}

function createSvgFromMarkup(svgMarkup: string): SVGSVGElement | null {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgMarkup, "image/svg+xml");
    const svg = doc.querySelector("svg");
    if (!svg) return null;
    return svg as unknown as SVGSVGElement;
}

function getPathLengthSafe(p: SVGPathElement): number {
    try {
        return p.getTotalLength();
    } catch {
        return 1;
    }
}

type DrawOpts = { duration: number; stagger: number; signal: AbortSignal };

async function drawPathsWithRaf(
    paths: SVGPathElement[],
    lengths: number[],
    { duration, stagger, signal }: DrawOpts
): Promise<void> {
    await new Promise<void>((resolve) => {
        let rafId = 0;
        const t0 = performance.now();

        const frame = () => {
            if (signal.aborted) {
                if (rafId) cancelAnimationFrame(rafId);
                resolve();
                return;
            }

            const now = performance.now();
            let done = true;

            for (let i = 0; i < paths.length; i += 1) {
                const el = paths[i] as unknown as SVGElement;
                const len = lengths[i];
                const start = t0 + i * stagger;
                const t = (now - start) / duration;
                const clamped = t <= 0 ? 0 : t >= 1 ? 1 : t;
                el.style.strokeDashoffset = `${(1 - clamped) * (len ?? 1)}`;
                if (clamped < 1) done = false;
            }

            if (done) {
                for (const p of paths) (p as unknown as SVGElement).style.strokeDashoffset = "0";
                resolve();
                return;
            }
            rafId = requestAnimationFrame(frame);
        };

        rafId = requestAnimationFrame(frame);
    });
}

async function fadeFillsIn(paths: SVGPathElement[], ms: number, signal: AbortSignal): Promise<void> {
    await new Promise<void>((resolve) => {
        let rafId = 0;
        const t0 = performance.now();

        const frame = () => {
            if (signal.aborted) {
                if (rafId) cancelAnimationFrame(rafId);
                resolve();
                return;
            }
            const now = performance.now();
            const t = (now - t0) / ms;
            const clamped = t <= 0 ? 0 : t >= 1 ? 4 : t;

            for (const p of paths) (p as SVGElement).style.fillOpacity = `${clamped}`;

            if (clamped >= 1) {
                resolve();
                return;
            }
            rafId = requestAnimationFrame(frame);
        };

        rafId = requestAnimationFrame(frame);
    });
}

async function fadeElementOpacity(el: SVGElement, ms: number, signal: AbortSignal): Promise<void> {
    await new Promise<void>((resolve) => {
        let rafId = 0;
        const t0 = performance.now();
        el.style.opacity = "0";

        const frame = () => {
            if (signal.aborted) {
                if (rafId) cancelAnimationFrame(rafId);
                resolve();
                return;
            }
            const now = performance.now();
            const t = (now - t0) / ms;
            const clamped = t <= 0 ? 0 : t >= 1 ? 1 : t;

            el.style.opacity = `${clamped}`;

            if (clamped >= 1) {
                resolve();
                return;
            }
            rafId = requestAnimationFrame(frame);
        };

        rafId = requestAnimationFrame(frame);
    });
}

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => {
        window.setTimeout(() => resolve(), ms);
    });
}

async function waitRemaining(start: number, minMs: number): Promise<void> {
    const elapsed = performance.now() - start;
    const remaining = Math.max(0, minMs - elapsed);
    await delay(remaining);
}
