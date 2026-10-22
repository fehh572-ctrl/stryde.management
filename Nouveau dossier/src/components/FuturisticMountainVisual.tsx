import React, { useEffect, useRef } from "react";

interface FuturisticMountainVisualProps {
  variant?: "light" | "dark";
  activePeak?: 0 | 1 | 2 | null;
  className?: string;
}

type Pt2 = [number, number];

interface FacetDef {
  id: string;
  peakGroup: 0 | 1 | 2;
  tone: "primary" | "secondary" | "accent";
  pts: Pt2[];
  zOffset: number;
}

/**
 * Exact connected 3-peak Stryde logo geometry centered around (0, 0).
 * All three peaks overlap and weld seamlessly into a single connected mountain range.
 */
const CONNECTED_FACETS: FacetDef[] = [
  // Left Peak — Right Connector Blade (welded behind central peak slope)
  {
    id: "left-connector",
    peakGroup: 0,
    tone: "secondary",
    zOffset: -4,
    pts: [
      [-96, -24],
      [-48, 25],
      [-57, 37],
      [-96, -2],
    ],
  },
  // Right Peak — Left Connector Blade (welded behind central peak slope)
  {
    id: "right-connector",
    peakGroup: 2,
    tone: "secondary",
    zOffset: -4,
    pts: [
      [96, -24],
      [48, 25],
      [57, 37],
      [96, -2],
    ],
  },
  // Left Peak — Main Faceted Wing with Signature Step Notch
  {
    id: "left-wing",
    peakGroup: 0,
    tone: "primary",
    zOffset: -2,
    pts: [
      [-96, -24],
      [-166, 48],
      [-114, 24],
      [-114, 35],
      [-96, 22],
    ],
  },
  // Right Peak — Main Faceted Wing with Signature Step Notch
  {
    id: "right-wing",
    peakGroup: 2,
    tone: "accent",
    zOffset: -2,
    pts: [
      [96, -24],
      [166, 48],
      [114, 24],
      [114, 35],
      [96, 22],
    ],
  },
  // Central Summit — Left Stepped Facet
  {
    id: "center-left",
    peakGroup: 1,
    tone: "primary",
    zOffset: 4,
    pts: [
      [0, -61],
      [-88, 61],
      [-29, 20],
      [-29, 35],
      [0, 15],
    ],
  },
  // Central Summit — Right Razor Chevron Blade
  {
    id: "center-right",
    peakGroup: 1,
    tone: "accent",
    zOffset: 5,
    pts: [
      [0, -61],
      [88, 61],
      [0, -23],
    ],
  },
];

// Single unbroken skyline crest across all 3 welded Stryde peaks
const SKYLINE_PATH: Pt2[] = [
  [-166, 48],
  [-96, -24],
  [-56.1, 16.8],
  [0, -61],
  [56.1, 16.8],
  [96, -24],
  [166, 48],
];

interface Particle {
  x: number;
  y: number;
  z: number;
  vy: number;
  vx: number;
  size: number;
  phase: number;
}

export const FuturisticMountainVisual: React.FC<FuturisticMountainVisualProps> = ({
  variant = "light",
  activePeak = null,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerTarget = useRef({ x: 0, y: 0 });
  const pointerSmooth = useRef({ x: 0, y: 0 });
  const activePeakRef = useRef<0 | 1 | 2 | null>(activePeak);
  activePeakRef.current = activePeak;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    const startTime = performance.now();

    // Subtle rising photon particles anchored near the 3 connected peaks
    const peakAnchors: Pt2[] = [
      [-96, -24],
      [0, -61],
      [96, -24],
    ];
    const particles: Particle[] = Array.from({ length: 26 }, (_, i) => {
      const anchor = peakAnchors[i % 3];
      return {
        x: anchor[0] + (Math.random() - 0.5) * 76,
        y: anchor[1] + (Math.random() - 0.5) * 60,
        z: (Math.random() - 0.5) * 40,
        vy: -10 - Math.random() * 14,
        vx: (Math.random() - 0.5) * 4,
        size: 1.2 + Math.random() * 1.8,
        phase: Math.random() * Math.PI * 2,
      };
    });

    const projectPoint = (
      x: number,
      y: number,
      z: number,
      rotX: number,
      rotY: number,
      cx: number,
      cy: number,
      scale: number
    ): [number, number] => {
      // Rotate around Y
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;

      // Rotate around X
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      const fov = 560;
      const persp = fov / (fov + z2);
      return [cx + x1 * scale * persp, cy + y2 * scale * persp];
    };

    const samplePolyline = (ptsProjected: Pt2[], tNorm: number): Pt2 => {
      const segLengths: number[] = [];
      let total = 0;
      for (let i = 0; i < ptsProjected.length - 1; i++) {
        const dx = ptsProjected[i + 1][0] - ptsProjected[i][0];
        const dy = ptsProjected[i + 1][1] - ptsProjected[i][1];
        const d = Math.hypot(dx, dy);
        segLengths.push(d);
        total += d;
      }
      let target = Math.max(0, Math.min(1, tNorm)) * total;
      for (let i = 0; i < segLengths.length; i++) {
        if (target <= segLengths[i] || i === segLengths.length - 1) {
          const ratio = segLengths[i] > 0 ? target / segLengths[i] : 0;
          return [
            ptsProjected[i][0] + (ptsProjected[i + 1][0] - ptsProjected[i][0]) * ratio,
            ptsProjected[i][1] + (ptsProjected[i + 1][1] - ptsProjected[i][1]) * ratio,
          ];
        }
        target -= segLengths[i];
      }
      return ptsProjected[ptsProjected.length - 1];
    };

    let lastFrameTime = startTime;

    const render = (now: number) => {
      const dt = Math.min(0.05, (now - lastFrameTime) / 1000);
      lastFrameTime = now;
      const t = (now - startTime) / 1000;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      if (width > 0 && height > 0) {
        if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
          canvas.width = Math.round(width * dpr);
          canvas.height = Math.round(height * dpr);
        }

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, height);

        // Smooth cursor spring
        pointerSmooth.current.x += (pointerTarget.current.x - pointerSmooth.current.x) * 0.065;
        pointerSmooth.current.y += (pointerTarget.current.y - pointerSmooth.current.y) * 0.065;

        // Autonomous continuous futuristic 3D motion + cursor tilt
        const autoYaw = Math.sin(t * 0.85) * 0.16 + Math.cos(t * 0.42) * 0.05;
        const autoPitch = Math.cos(t * 0.72) * 0.09 - 0.05;
        const floatY = Math.sin(t * 1.15) * 7;

        const rotY = autoYaw + pointerSmooth.current.x * 0.28;
        const rotX = autoPitch - pointerSmooth.current.y * 0.2;

        const cx = width * 0.5;
        const cy = height * 0.46 + floatY;
        const scale = Math.min(width / 415, height / 285);

        const isDark = variant === "dark";

        // 1. Frameless Soft Radial Volumetric Aura (strictly 0 alpha well inside canvas bounds)
        const auraRadius = Math.min(width, height) * 0.46;
        const aura = ctx.createRadialGradient(cx, cy, 4, cx, cy, auraRadius);
        if (isDark) {
          aura.addColorStop(0, "rgba(86, 198, 224, 0.24)");
          aura.addColorStop(0.45, "rgba(53, 130, 152, 0.09)");
          aura.addColorStop(1, "rgba(2, 22, 46, 0)");
        } else {
          aura.addColorStop(0, "rgba(79, 163, 184, 0.20)");
          aura.addColorStop(0.5, "rgba(2, 27, 58, 0.05)");
          aura.addColorStop(1, "rgba(255, 255, 255, 0)");
        }
        ctx.fillStyle = aura;
        ctx.fillRect(0, 0, width, height);

        // 2. Frameless Flowing Harmonic Telemetry Waves (taper smoothly to 0 alpha at edges)
        const waveCount = 5;
        const waveSpan = Math.min(width * 0.9, 540);
        const waveLeft = cx - waveSpan * 0.5;
        const baseWaveY = cy + 68 * scale;

        for (let wIdx = 0; wIdx < waveCount; wIdx++) {
          ctx.beginPath();
          const steps = 64;
          for (let s = 0; s <= steps; s++) {
            const u = s / steps;
            const env = Math.pow(Math.sin(Math.PI * u), 1.6);
            const wx = waveLeft + u * waveSpan;
            const wy =
              baseWaveY +
              wIdx * 8.5 +
              Math.sin(u * 8.5 - t * 1.9 + wIdx * 0.65) * (6.5 * env) +
              Math.cos(u * 4.2 + t * 1.1) * (3.5 * env);
            if (s === 0) ctx.moveTo(wx, wy);
            else ctx.lineTo(wx, wy);
          }

          const waveGrad = ctx.createLinearGradient(waveLeft, 0, waveLeft + waveSpan, 0);
          if (isDark) {
            const peakAlpha = 0.26 - wIdx * 0.04;
            waveGrad.addColorStop(0, "rgba(127, 224, 238, 0)");
            waveGrad.addColorStop(0.25, `rgba(79, 163, 184, ${peakAlpha * 0.6})`);
            waveGrad.addColorStop(0.5, `rgba(127, 224, 238, ${peakAlpha})`);
            waveGrad.addColorStop(0.75, `rgba(79, 163, 184, ${peakAlpha * 0.6})`);
            waveGrad.addColorStop(1, "rgba(127, 224, 238, 0)");
          } else {
            const peakAlpha = 0.24 - wIdx * 0.038;
            waveGrad.addColorStop(0, "rgba(2, 27, 58, 0)");
            waveGrad.addColorStop(0.25, `rgba(79, 163, 184, ${peakAlpha * 0.7})`);
            waveGrad.addColorStop(0.5, `rgba(2, 27, 58, ${peakAlpha})`);
            waveGrad.addColorStop(0.75, `rgba(79, 163, 184, ${peakAlpha * 0.7})`);
            waveGrad.addColorStop(1, "rgba(2, 27, 58, 0)");
          }
          ctx.strokeStyle = waveGrad;
          ctx.lineWidth = wIdx === 0 ? 1.5 : 1;
          ctx.stroke();
        }

        // 3. Multi-Depth Holographic Echo Planes trailing in Z-space behind the connected mountain
        const echoDepths = [-86, -58, -32];
        echoDepths.forEach((zEcho, idx) => {
          const echoWaveY = Math.sin(t * 1.6 - idx * 0.85) * 4;
          const alpha = isDark ? 0.1 + idx * 0.06 : 0.08 + idx * 0.055;

          CONNECTED_FACETS.forEach((facet) => {
            ctx.beginPath();
            facet.pts.forEach((pt, pIdx) => {
              const [px, py] = projectPoint(
                pt[0],
                pt[1] + echoWaveY,
                zEcho + facet.zOffset,
                rotX,
                rotY,
                cx,
                cy,
                scale
              );
              if (pIdx === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            });
            ctx.closePath();
            ctx.strokeStyle = isDark
              ? `rgba(127, 224, 238, ${alpha})`
              : `rgba(53, 130, 152, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          });
        });

        // 4. Rising Futuristic Photon Particles around the 3 connected peaks
        particles.forEach((p, idx) => {
          p.y += p.vy * dt;
          p.x += p.vx * dt;
          if (p.y < -95) {
            const anchor = peakAnchors[idx % 3];
            p.x = anchor[0] + (Math.random() - 0.5) * 84;
            p.y = 45 + Math.random() * 18;
          }
          const lifeFade = Math.max(0, Math.min(1, 1 - Math.abs(p.y + 20) / 76));
          const [px, py] = projectPoint(p.x, p.y, p.z, rotX, rotY, cx, cy, scale);
          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fillStyle = isDark
            ? `rgba(154, 240, 252, ${lifeFade * 0.55})`
            : `rgba(53, 130, 152, ${lifeFade * 0.45})`;
          ctx.fill();
        });

        // 5. Solid 3D Extruded Connected Stryde Monument (Side Bevels + Metallic/Glass Front Faces)
        const thickness = 18;
        const lightShimmer = Math.sin(t * 1.4) * 35;

        CONNECTED_FACETS.forEach((facet) => {
          const isHighlighted =
            activePeakRef.current === null || activePeakRef.current === facet.peakGroup;
          const dimFactor = isHighlighted ? 1 : 0.52;

          const zFront = facet.zOffset + thickness * 0.5;
          const zBack = facet.zOffset - thickness * 0.5;

          const frontPts = facet.pts.map((pt) =>
            projectPoint(pt[0], pt[1], zFront, rotX, rotY, cx, cy, scale)
          );
          const backPts = facet.pts.map((pt) =>
            projectPoint(pt[0], pt[1], zBack, rotX, rotY, cx, cy, scale)
          );

          // Draw 3D extruded bevel walls along polygon perimeter
          for (let i = 0; i < frontPts.length; i++) {
            const next = (i + 1) % frontPts.length;
            ctx.beginPath();
            ctx.moveTo(frontPts[i][0], frontPts[i][1]);
            ctx.lineTo(frontPts[next][0], frontPts[next][1]);
            ctx.lineTo(backPts[next][0], backPts[next][1]);
            ctx.lineTo(backPts[i][0], backPts[i][1]);
            ctx.closePath();

            ctx.fillStyle = isDark
              ? `rgba(14, 52, 88, ${0.88 * dimFactor})`
              : `rgba(2, 27, 58, ${0.92 * dimFactor})`;
            ctx.fill();

            ctx.strokeStyle = isDark
              ? `rgba(127, 224, 238, ${0.24 * dimFactor})`
              : `rgba(94, 192, 215, ${0.32 * dimFactor})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }

          // Draw futuristic crystalline-metallic front face matching Stryde palette
          ctx.beginPath();
          frontPts.forEach((pt, idx) => {
            if (idx === 0) ctx.moveTo(pt[0], pt[1]);
            else ctx.lineTo(pt[0], pt[1]);
          });
          ctx.closePath();

          const grad = ctx.createLinearGradient(
            cx - 90 * scale + lightShimmer,
            cy - 70 * scale,
            cx + 90 * scale + lightShimmer,
            cy + 75 * scale
          );

          if (isDark) {
            if (facet.tone === "accent") {
              grad.addColorStop(0, `rgba(166, 245, 255, ${0.98 * dimFactor})`);
              grad.addColorStop(0.5, `rgba(88, 194, 219, ${0.95 * dimFactor})`);
              grad.addColorStop(1, `rgba(28, 108, 145, ${0.94 * dimFactor})`);
            } else if (facet.tone === "primary") {
              grad.addColorStop(0, `rgba(122, 224, 242, ${0.96 * dimFactor})`);
              grad.addColorStop(0.55, `rgba(62, 158, 186, ${0.94 * dimFactor})`);
              grad.addColorStop(1, `rgba(16, 78, 114, ${0.94 * dimFactor})`);
            } else {
              grad.addColorStop(0, `rgba(88, 188, 212, ${0.92 * dimFactor})`);
              grad.addColorStop(1, `rgba(12, 62, 96, ${0.92 * dimFactor})`);
            }
          } else {
            if (facet.tone === "accent") {
              grad.addColorStop(0, `rgba(122, 224, 242, ${0.98 * dimFactor})`);
              grad.addColorStop(0.52, `rgba(68, 168, 194, ${0.97 * dimFactor})`);
              grad.addColorStop(1, `rgba(4, 38, 76, ${0.96 * dimFactor})`);
            } else if (facet.tone === "primary") {
              grad.addColorStop(0, `rgba(79, 175, 200, ${0.97 * dimFactor})`);
              grad.addColorStop(0.58, `rgba(18, 86, 126, ${0.96 * dimFactor})`);
              grad.addColorStop(1, `rgba(2, 27, 58, ${0.98 * dimFactor})`);
            } else {
              grad.addColorStop(0, `rgba(62, 152, 178, ${0.95 * dimFactor})`);
              grad.addColorStop(1, `rgba(5, 42, 82, ${0.96 * dimFactor})`);
            }
          }

          ctx.fillStyle = grad;
          ctx.fill();

          // Specular laser-sharp edge highlight
          ctx.strokeStyle = isDark
            ? `rgba(195, 250, 255, ${0.55 * dimFactor})`
            : `rgba(165, 242, 255, ${0.65 * dimFactor})`;
          ctx.lineWidth = 1.25;
          ctx.stroke();
        });

        // 6. Continuous Unbroken Laser Energy Pulse gliding across ALL THREE Connected Peaks
        const projectedSkyline = SKYLINE_PATH.map((pt) =>
          projectPoint(pt[0], pt[1], thickness * 0.5 + 6, rotX, rotY, cx, cy, scale)
        );

        const pulseProgress = (t * 0.34) % 1;
        const trailSteps = 22;
        for (let s = 0; s < trailSteps; s++) {
          const u0 = pulseProgress - (s / trailSteps) * 0.22;
          const u1 = pulseProgress - ((s + 1) / trailSteps) * 0.22;
          if (u1 < 0 || u0 > 1) continue;
          const p0 = samplePolyline(projectedSkyline, Math.max(0, u0));
          const p1 = samplePolyline(projectedSkyline, Math.max(0, u1));
          const fade = 1 - s / trailSteps;

          ctx.beginPath();
          ctx.moveTo(p0[0], p0[1]);
          ctx.lineTo(p1[0], p1[1]);
          ctx.strokeStyle = isDark
            ? `rgba(220, 253, 255, ${fade * 0.95})`
            : `rgba(127, 224, 238, ${fade * 0.95})`;
          ctx.lineWidth = 2.8 * fade + 0.8;
          ctx.lineCap = "round";
          ctx.stroke();
        }

        // Subtle luminous apex nodes on the 3 connected summits (sharp diamonds, not circles/holes!)
        const summitCoords: { pt: Pt2; label: string; idx: 0 | 1 | 2 }[] = [
          { pt: [-96, -24], label: "01 • POSITIONNEMENT", idx: 0 },
          { pt: [0, -61], label: "02 • STRATÉGIE ORGANIQUE", idx: 1 },
          { pt: [96, -24], label: "03 • SYNERGIE ADS", idx: 2 },
        ];

        summitCoords.forEach(({ pt, label, idx }) => {
          const [sx, sy] = projectPoint(
            pt[0],
            pt[1] - 8,
            thickness * 0.5 + 6,
            rotX,
            rotY,
            cx,
            cy,
            scale
          );
          const isFocus = activePeakRef.current === idx;

          // Crisp solid diamond spark at apex
          const dSize = isFocus ? 4.5 : 3.2;
          ctx.beginPath();
          ctx.moveTo(sx, sy - dSize);
          ctx.lineTo(sx + dSize, sy);
          ctx.lineTo(sx, sy + dSize);
          ctx.lineTo(sx - dSize, sy);
          ctx.closePath();
          ctx.fillStyle = isDark ? "#CCF8FF" : "#021B3A";
          ctx.fill();

          // Subtle HUD telemetry micro-label floating above apex
          if (width >= 420) {
            ctx.font = `600 10px "JetBrains Mono", monospace`;
            ctx.textAlign = "center";
            ctx.fillStyle = isDark
              ? isFocus
                ? "rgba(180, 248, 255, 0.98)"
                : "rgba(154, 224, 238, 0.72)"
              : isFocus
              ? "rgba(2, 27, 58, 0.96)"
              : "rgba(2, 27, 58, 0.62)";
            ctx.fillText(label, sx, sy - 12);
          }
        });
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [variant]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    pointerTarget.current = { x: nx, y: ny };
  };

  const handleMouseLeave = () => {
    pointerTarget.current = { x: 0, y: 0 };
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full select-none ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none"
        aria-label="Animation 3D futuriste des trois sommets connectés Stryde"
      />
    </div>
  );
};
