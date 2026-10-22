import React, { useEffect, useRef, useState } from "react";

interface Interactive3DStrydeLogoProps {
  className?: string;
}

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

function norm3(v: Vec3): Vec3 {
  const len = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / len, y: v.y / len, z: v.z / len };
}

function dot3(a: Vec3, b: Vec3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function rotateVec(p: Vec3, rotX: number, rotY: number): Vec3 {
  // Yaw around Y
  const cy = Math.cos(rotY);
  const sy = Math.sin(rotY);
  const x1 = p.x * cy + p.z * sy;
  const z1 = -p.x * sy + p.z * cy;

  // Pitch around X
  const cx = Math.cos(rotX);
  const sx = Math.sin(rotX);
  const y2 = p.y * cx - z1 * sx;
  const z2 = p.y * sx + z1 * cx;

  return { x: x1, y: y2, z: z2 };
}

const KEY_LIGHT = norm3({ x: 0.45, y: -0.58, z: 0.68 });
const FILL_LIGHT = norm3({ x: -0.55, y: 0.35, z: 0.75 });

/**
 * Renders the exact high-resolution circular Stryde token base disc & embossed emblem textures
 * matching the attached round dark navy Stryde medallion.
 */
function createTokenTextures(): {
  baseDiscCanvas: HTMLCanvasElement;
  emblemCanvas: HTMLCanvasElement;
  emblemShadowCanvas: HTMLCanvasElement;
} {
  const TEX = 1024;
  const HALF = TEX / 2;

  // 1. Base Midnight Navy Brushed Token Disc Texture
  const baseDiscCanvas = document.createElement("canvas");
  baseDiscCanvas.width = TEX;
  baseDiscCanvas.height = TEX;
  const bctx = baseDiscCanvas.getContext("2d")!;

  bctx.save();
  bctx.beginPath();
  bctx.arc(HALF, HALF, HALF - 2, 0, Math.PI * 2);
  bctx.closePath();
  bctx.clip();

  // Exact radial studio illumination matching the attached round Stryde badge (top-right slate-blue glow -> deep navy)
  const bgGrad = bctx.createRadialGradient(
    TEX * 0.69,
    TEX * 0.23,
    TEX * 0.02,
    TEX * 0.52,
    TEX * 0.52,
    TEX * 0.66
  );
  bgGrad.addColorStop(0, "#334F76");
  bgGrad.addColorStop(0.28, "#1A3358");
  bgGrad.addColorStop(0.62, "#091B38");
  bgGrad.addColorStop(1, "#040E21");
  bctx.fillStyle = bgGrad;
  bctx.fillRect(0, 0, TEX, TEX);

  // Subtle machined outer bevel ring
  const rimGrad = bctx.createLinearGradient(TEX * 0.85, TEX * 0.1, TEX * 0.15, TEX * 0.9);
  rimGrad.addColorStop(0, "rgba(155, 226, 245, 0.36)");
  rimGrad.addColorStop(0.45, "rgba(62, 114, 158, 0.16)");
  rimGrad.addColorStop(1, "rgba(18, 45, 82, 0.32)");
  bctx.strokeStyle = rimGrad;
  bctx.lineWidth = 7;
  bctx.beginPath();
  bctx.arc(HALF, HALF, HALF - 5.5, 0, Math.PI * 2);
  bctx.stroke();

  bctx.restore();

  // 2. Crisp Vector Emblem Texture (3 Connected Cyan Mountains + White "Stryde" + Tapered Cyan Line)
  const emblemCanvas = document.createElement("canvas");
  emblemCanvas.width = TEX;
  emblemCanvas.height = TEX;
  const ectx = emblemCanvas.getContext("2d")!;

  const drawEmblemShapes = (ctx: CanvasRenderingContext2D, shadowOnly: boolean) => {
    ctx.save();
    ctx.translate(HALF, HALF);

    if (shadowOnly) {
      ctx.fillStyle = "rgba(1, 8, 20, 0.68)";
    }

    // Scale coordinate space to match exact proportions of the attached circular badge
    // Circle diameter = 1024 (-512..+512).
    // Mountains span x in [-210, +210], apex at y = -182, base tips around y = -28
    const mScale = 1.24;
    ctx.save();
    ctx.translate(0, -104);
    ctx.scale(mScale, mScale);

    // Left Flanking Connected Peak
    const leftGrad = ctx.createLinearGradient(-74, -22, -110, 56);
    leftGrad.addColorStop(0, "#93F2FE");
    leftGrad.addColorStop(0.45, "#59BDD5");
    leftGrad.addColorStop(1, "#2E7D9E");

    const leftInnerGrad = ctx.createLinearGradient(-74, -22, -38, 36);
    leftInnerGrad.addColorStop(0, "#8CEEFB");
    leftInnerGrad.addColorStop(1, "#449FB9");

    // Left outer wing with signature step notch
    ctx.beginPath();
    ctx.moveTo(-74, -22);
    ctx.lineTo(-162, 54);
    ctx.lineTo(-104, 24);
    ctx.lineTo(-104, 36);
    ctx.lineTo(-88, 22);
    ctx.lineTo(-88, -2);
    ctx.closePath();
    ctx.fillStyle = shadowOnly ? "rgba(1, 8, 20, 0.68)" : leftGrad;
    ctx.fill();

    // Left inner connector slope joining central peak
    ctx.beginPath();
    ctx.moveTo(-74, -22);
    ctx.lineTo(-34, 18);
    ctx.lineTo(-44, 31);
    ctx.lineTo(-74, 1);
    ctx.closePath();
    ctx.fillStyle = shadowOnly ? "rgba(1, 8, 20, 0.68)" : leftInnerGrad;
    ctx.fill();

    // Right Flanking Connected Peak
    const rightGrad = ctx.createLinearGradient(74, -22, 118, 56);
    rightGrad.addColorStop(0, "#93F2FE");
    rightGrad.addColorStop(0.45, "#59BDD5");
    rightGrad.addColorStop(1, "#2E7D9E");

    const rightInnerGrad = ctx.createLinearGradient(74, -22, 38, 36);
    rightInnerGrad.addColorStop(0, "#86ECFA");
    rightInnerGrad.addColorStop(1, "#3E98B3");

    // Right inner connector slope joining central peak
    ctx.beginPath();
    ctx.moveTo(74, -22);
    ctx.lineTo(34, 18);
    ctx.lineTo(44, 31);
    ctx.lineTo(74, 1);
    ctx.closePath();
    ctx.fillStyle = shadowOnly ? "rgba(1, 8, 20, 0.68)" : rightInnerGrad;
    ctx.fill();

    // Right outer wing with signature step notch
    ctx.beginPath();
    ctx.moveTo(74, -22);
    ctx.lineTo(162, 54);
    ctx.lineTo(104, 24);
    ctx.lineTo(104, 36);
    ctx.lineTo(88, 22);
    ctx.lineTo(88, -2);
    ctx.closePath();
    ctx.fillStyle = shadowOnly ? "rgba(1, 8, 20, 0.68)" : rightGrad;
    ctx.fill();

    // Central Tall Summit Peak — Left Stepped Facet
    const centerLeftGrad = ctx.createLinearGradient(0, -68, -68, 66);
    centerLeftGrad.addColorStop(0, "#A0F7FF");
    centerLeftGrad.addColorStop(0.38, "#6ACBE1");
    centerLeftGrad.addColorStop(1, "#3589AA");

    ctx.beginPath();
    ctx.moveTo(0, -68);
    ctx.lineTo(-86, 66);
    ctx.lineTo(-27, 25);
    ctx.lineTo(-27, 40);
    ctx.lineTo(0, 19);
    ctx.closePath();
    ctx.fillStyle = shadowOnly ? "rgba(1, 8, 20, 0.68)" : centerLeftGrad;
    ctx.fill();

    // Central Tall Summit Peak — Right Luminous Razor Facet
    const centerRightGrad = ctx.createLinearGradient(0, -68, 72, 66);
    centerRightGrad.addColorStop(0, "#B4FBFF");
    centerRightGrad.addColorStop(0.32, "#75D6EA");
    centerRightGrad.addColorStop(1, "#378CAE");

    ctx.beginPath();
    ctx.moveTo(0, -68);
    ctx.lineTo(86, 66);
    ctx.lineTo(0, -24);
    ctx.closePath();
    ctx.fillStyle = shadowOnly ? "rgba(1, 8, 20, 0.68)" : centerRightGrad;
    ctx.fill();

    ctx.restore();

    // Crisp White "Stryde" Wordmark right below mountains
    ctx.font = `700 154px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    if (!shadowOnly) {
      ctx.fillStyle = "#FFFFFF";
    }
    ctx.fillText("Stryde", 0, 56);

    // Signature Tapered Cyan Horizon Line centered below "Stryde"
    const lineHalfW = 122;
    const lineY = 188;
    ctx.beginPath();
    ctx.moveTo(-lineHalfW, lineY);
    ctx.quadraticCurveTo(0, lineY - 3.2, lineHalfW, lineY);
    ctx.quadraticCurveTo(0, lineY + 3.2, -lineHalfW, lineY);
    ctx.closePath();

    if (shadowOnly) {
      ctx.fillStyle = "rgba(1, 8, 20, 0.45)";
    } else {
      const lineGrad = ctx.createLinearGradient(-lineHalfW, lineY, lineHalfW, lineY);
      lineGrad.addColorStop(0, "rgba(86, 190, 216, 0)");
      lineGrad.addColorStop(0.5, "rgba(116, 218, 240, 0.95)");
      lineGrad.addColorStop(1, "rgba(86, 190, 216, 0)");
      ctx.fillStyle = lineGrad;
    }
    ctx.fill();

    ctx.restore();
  };

  drawEmblemShapes(ectx, false);

  // 3. Soft Embossed Drop-Shadow Texture
  const emblemShadowCanvas = document.createElement("canvas");
  emblemShadowCanvas.width = TEX;
  emblemShadowCanvas.height = TEX;
  const sctx = emblemShadowCanvas.getContext("2d")!;
  sctx.filter = "blur(8px)";
  drawEmblemShapes(sctx, true);

  return { baseDiscCanvas, emblemCanvas, emblemShadowCanvas };
}

export const Interactive3DStrydeLogo: React.FC<Interactive3DStrydeLogoProps> = ({
  className = "w-[138px] h-[138px] sm:w-[205px] sm:h-[205px] lg:w-[255px] lg:h-[255px]",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDraggingUI, setIsDraggingUI] = useState(false);

  const stateRef = useRef({
    autoYaw: -0.22,
    dragYaw: 0,
    dragPitch: 0,
    velYaw: 0,
    velPitch: 0,
    hoverYawOffset: 0,
    hoverYawTarget: 0,
    hoverPitchOffset: 0,
    hoverPitchTarget: 0,
    isHovering: false,
    isDragging: false,
    lastPointerX: 0,
    lastPointerY: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let textures = createTokenTextures();

    // Re-bake textures once Google Font "Plus Jakarta Sans" finishes loading so wordmark is 100% exact
    let cancelled = false;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) {
          textures = createTokenTextures();
        }
      });
    }

    let animId = 0;
    const start = performance.now();
    let lastNow = start;

    const RIM_SEGMENTS = 144;

    const render = (now: number) => {
      const dt = Math.min(0.05, (now - lastNow) / 1000);
      lastNow = now;
      const t = (now - start) / 1000;

      const s = stateRef.current;

      if (!s.isDragging) {
        // Apply velvet inertia after drag release
        s.dragYaw += s.velYaw * dt;
        s.dragPitch += s.velPitch * dt;
        s.velYaw *= Math.pow(0.08, dt);
        s.velPitch *= Math.pow(0.08, dt);

        if (!s.isHovering) {
          // Very slow, calm, majestic autonomous 3D coin rotation (~48s per full 360° turn)
          s.autoYaw += dt * 0.13;
          s.hoverYawTarget = 0;
          s.hoverPitchTarget = 0;
        }
      }

      // Smooth damped interpolation for mouse movement
      s.hoverYawOffset += (s.hoverYawTarget - s.hoverYawOffset) * 0.055;
      s.hoverPitchOffset += (s.hoverPitchTarget - s.hoverPitchOffset) * 0.055;

      // Subtle slow levitation & breathing pitch
      const floatY = Math.sin(t * 0.55) * 3.2;
      const idlePitch = Math.sin(t * 0.42) * 0.08;

      const rotY = s.autoYaw + s.dragYaw + s.hoverYawOffset;
      const rotX = idlePitch + s.dragPitch + s.hoverPitchOffset;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      if (width > 0 && height > 0) {
        if (
          canvas.width !== Math.round(width * dpr) ||
          canvas.height !== Math.round(height * dpr)
        ) {
          canvas.width = Math.round(width * dpr);
          canvas.height = Math.round(height * dpr);
        }

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, height);

        const cx = width * 0.5;
        const cy = height * 0.47 + floatY;

        // Coin geometry in local space: Radius R = 1, half-thickness H = 0.072
        const coinRadiusPx = Math.min(width, height) * 0.415;
        const halfThickPx = coinRadiusPx * 0.078;

        // Orthonormal basis of the rotated 3D coin
        const e1 = rotateVec({ x: 1, y: 0, z: 0 }, rotX, rotY);
        const e2 = rotateVec({ x: 0, y: 1, z: 0 }, rotX, rotY);
        const e3 = rotateVec({ x: 0, y: 0, z: 1 }, rotX, rotY);

        // Soft ambient levitation shadow beneath the 3D coin on white page surface
        const shadowY = height * 0.92;
        const apparentWidth = Math.max(0.28, Math.hypot(e1.x, e2.x));
        const shadowGrad = ctx.createRadialGradient(
          cx,
          shadowY,
          0,
          cx,
          shadowY,
          coinRadiusPx * 0.85
        );
        shadowGrad.addColorStop(0, "rgba(2, 27, 58, 0.14)");
        shadowGrad.addColorStop(0.55, "rgba(2, 27, 58, 0.05)");
        shadowGrad.addColorStop(1, "rgba(2, 27, 58, 0)");

        ctx.save();
        ctx.translate(cx, shadowY);
        ctx.scale(apparentWidth * 0.92, 0.14);
        ctx.translate(-cx, -shadowY);
        ctx.fillStyle = shadowGrad;
        ctx.fillRect(
          cx - coinRadiusPx,
          shadowY - coinRadiusPx,
          coinRadiusPx * 2,
          coinRadiusPx * 2
        );
        ctx.restore();

        // =====================================================================
        // 1. SOLID 3D MACHINED METALLIC COIN RIM (CYLINDRICAL TRANCHE)
        // =====================================================================
        for (let i = 0; i < RIM_SEGMENTS; i++) {
          const phi0 = (i / RIM_SEGMENTS) * Math.PI * 2;
          const phi1 = ((i + 1) / RIM_SEGMENTS) * Math.PI * 2;
          const phiMid = (phi0 + phi1) * 0.5;

          const c0 = Math.cos(phi0);
          const s0 = Math.sin(phi0);
          const c1 = Math.cos(phi1);
          const s1 = Math.sin(phi1);
          const cm = Math.cos(phiMid);
          const sm = Math.sin(phiMid);

          // Outward cylinder normal in rotated world space
          const nx = cm * e1.x + sm * e2.x;
          const ny = cm * e1.y + sm * e2.y;
          const nz = cm * e1.z + sm * e2.z;

          // Only front-facing rim facets of the convex cylinder are visible
          if (nz < -0.02) continue;

          const p0x = coinRadiusPx * (c0 * e1.x + s0 * e2.x);
          const p0y = coinRadiusPx * (c0 * e1.y + s0 * e2.y);
          const p1x = coinRadiusPx * (c1 * e1.x + s1 * e2.x);
          const p1y = coinRadiusPx * (c1 * e1.y + s1 * e2.y);

          const offX = halfThickPx * e3.x;
          const offY = halfThickPx * e3.y;

          const nVec: Vec3 = { x: nx, y: ny, z: nz };
          const dKey = Math.max(0, dot3(nVec, KEY_LIGHT));
          const dFill = Math.max(0, dot3(nVec, FILL_LIGHT));
          const halfH = norm3({
            x: KEY_LIGHT.x,
            y: KEY_LIGHT.y,
            z: KEY_LIGHT.z + 1,
          });
          const spec = Math.pow(Math.max(0, dot3(nVec, halfH)), 28);

          // Subtle luxury coin-edge reeding micro-modulation
          const reed = 0.93 + 0.07 * Math.sin(phiMid * 96);
          const lit = (0.35 + dKey * 0.65 + dFill * 0.25) * reed;

          const rCol = Math.min(255, Math.round(14 * lit + spec * 145));
          const gCol = Math.min(255, Math.round(44 * lit + spec * 205));
          const bCol = Math.min(255, Math.round(84 * lit + spec * 235));
          const color = `rgb(${rCol}, ${gCol}, ${bCol})`;

          ctx.beginPath();
          ctx.moveTo(cx + p0x + offX, cy + p0y + offY);
          ctx.lineTo(cx + p1x + offX, cy + p1y + offY);
          ctx.lineTo(cx + p1x - offX, cy + p1y - offY);
          ctx.lineTo(cx + p0x - offX, cy + p0y - offY);
          ctx.closePath();

          ctx.fillStyle = color;
          ctx.fill();
          ctx.strokeStyle = color;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }

        // =====================================================================
        // 2. VISIBLE CIRCULAR TOKEN FACE (FRONT OR REVERSE) WITH 3D RELIEF
        // =====================================================================
        const isFrontVisible = e3.z >= 0;
        const faceSign = isFrontVisible ? 1 : -1;
        // Flip horizontal basis on reverse face so "Stryde" reads upright & non-mirrored from both sides
        const uAxis: Vec3 = isFrontVisible
          ? e1
          : { x: -e1.x, y: -e1.y, z: -e1.z };
        const vAxis: Vec3 = e2;
        const faceNormal: Vec3 = {
          x: e3.x * faceSign,
          y: e3.y * faceSign,
          z: e3.z * faceSign,
        };

        const drawTransformedLayer = (
          img: HTMLCanvasElement,
          zHeightPx: number,
          alpha = 1
        ) => {
          const centerX = cx + zHeightPx * faceNormal.x;
          const centerY = cy + zHeightPx * faceNormal.y;

          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.setTransform(
            dpr * coinRadiusPx * uAxis.x,
            dpr * coinRadiusPx * uAxis.y,
            dpr * coinRadiusPx * vAxis.x,
            dpr * coinRadiusPx * vAxis.y,
            dpr * centerX,
            dpr * centerY
          );
          ctx.drawImage(img, -1, -1, 2, 2);
          ctx.restore();
        };

        // Base navy brushed disc flush at face plane (+halfThickPx)
        drawTransformedLayer(textures.baseDiscCanvas, halfThickPx, 1);

        // Soft cast shadow on disc surface right under the raised emblem
        drawTransformedLayer(
          textures.emblemShadowCanvas,
          halfThickPx + coinRadiusPx * 0.006,
          0.85
        );

        // Subtle metallic 3D extrusion step for the embossed mountains & wordmark
        drawTransformedLayer(
          textures.emblemCanvas,
          halfThickPx + coinRadiusPx * 0.015,
          0.65
        );

        // Topmost razor-sharp raised emblem cap
        drawTransformedLayer(
          textures.emblemCanvas,
          halfThickPx + coinRadiusPx * 0.026,
          1
        );

        // Dynamic physical specular sheen gliding across the 3D coin face as angle changes
        const centerX = cx + halfThickPx * faceNormal.x;
        const centerY = cy + halfThickPx * faceNormal.y;
        ctx.save();
        ctx.setTransform(
          dpr * coinRadiusPx * uAxis.x,
          dpr * coinRadiusPx * uAxis.y,
          dpr * coinRadiusPx * vAxis.x,
          dpr * coinRadiusPx * vAxis.y,
          dpr * centerX,
          dpr * centerY
        );
        ctx.beginPath();
        ctx.arc(0, 0, 0.996, 0, Math.PI * 2);
        ctx.clip();

        const sheenShiftX = -faceNormal.x * 0.85;
        const sheenShiftY = -faceNormal.y * 0.65;
        const sheenGrad = ctx.createLinearGradient(
          -1 + sheenShiftX,
          -1 + sheenShiftY,
          1 + sheenShiftX,
          1 + sheenShiftY
        );
        sheenGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
        sheenGrad.addColorStop(0.46, "rgba(180, 238, 255, 0.02)");
        sheenGrad.addColorStop(0.52, "rgba(225, 250, 255, 0.11)");
        sheenGrad.addColorStop(0.58, "rgba(180, 238, 255, 0.02)");
        sheenGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = sheenGrad;
        ctx.fillRect(-1.2, -1.2, 2.4, 2.4);
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelled = true;
      cancelAnimationFrame(animId);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    stateRef.current.isDragging = true;
    stateRef.current.velYaw = 0;
    stateRef.current.velPitch = 0;
    stateRef.current.lastPointerX = e.clientX;
    stateRef.current.lastPointerY = e.clientY;
    setIsDraggingUI(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;

    stateRef.current.isHovering = true;

    if (stateRef.current.isDragging) {
      const dx = e.clientX - stateRef.current.lastPointerX;
      const dy = e.clientY - stateRef.current.lastPointerY;
      stateRef.current.lastPointerX = e.clientX;
      stateRef.current.lastPointerY = e.clientY;

      stateRef.current.dragYaw += dx * 0.014;
      stateRef.current.dragPitch -= dy * 0.014;
      stateRef.current.velYaw = dx * 0.16;
      stateRef.current.velPitch = -dy * 0.16;
    } else {
      stateRef.current.hoverYawTarget = nx * Math.PI;
      stateRef.current.hoverPitchTarget = -ny * 1.25;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (stateRef.current.isDragging) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore if capture already released
      }
      stateRef.current.isDragging = false;
      setIsDraggingUI(false);
    }
  };

  const handlePointerLeave = () => {
    stateRef.current.isHovering = false;
    stateRef.current.hoverYawTarget = 0;
    stateRef.current.hoverPitchTarget = 0;
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      style={{ touchAction: "none" }}
      className={`relative shrink-0 select-none transition-transform duration-300 ${
        isDraggingUI ? "cursor-grabbing scale-[1.02]" : "cursor-grab"
      } ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none"
        aria-label="Jeton 3D Stryde"
      />
    </div>
  );
};
