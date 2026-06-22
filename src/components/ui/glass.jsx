"use client";

import {
  GlassWebGLRenderer,
  isRasterChild,
  webglAvailable,
} from "./glass-webgl";
import { cn } from "../lib/utils";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

const SLOTS = 5;
const MAP_CACHE_LIMIT = 64;
const EDGE_BIAS = 0.5;

function clamp01(v) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function erf(x) {
  return Math.tanh(1.7724538509 * x);
}

function sphereAvgSlope(r, halfDim) {
  let sum = 0;
  for (let i = 0; i <= 200; i++) {
    const a = (i / 200) * halfDim;
    const s = a / Math.sqrt(r * r - a * a);
    sum += i === 0 || i === 200 ? 0.5 * s : s;
  }
  return sum / 200;
}

function computeDomeConstants(domeDepth, halfW, halfH) {
  const h = Math.max(0.01, Math.min(domeDepth, Math.min(halfW, halfH) - 1));
  const rx = (halfW * halfW + h * h) / (2 * h);
  const ry = (halfH * halfH + h * h) / (2 * h);
  const ax = sphereAvgSlope(rx, halfW);
  const ay = sphereAvgSlope(ry, halfH);
  return {
    rx,
    ry,
    scaleX: ax > 0 ? 0.5 / ax : 1,
    scaleY: ay > 0 ? 0.5 / ay : 1,
  };
}

function domeGradient(p, r, scale) {
  const c = Math.min(p, 0.999 * r);
  return (c / Math.sqrt(r * r - c * c)) * scale;
}

function generateLensMap(p) {
  if (p.halfW < 2 || p.halfH < 2) {
    return null;
  }
  const sdfBoundary = p.sdfBoundary ?? true;
  const edgeFalloff = p.edgeFalloff ?? true;
  const size = p.size;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return null;
  }
  const image = ctx.createImageData(size, size);
  const data = image.data;
  const half = size >> 1;
  const r0 = Math.min(p.radius, p.halfW, p.halfH);
  const innerHalfW = Math.max(0, p.halfW - p.depth);
  const innerHalfH = Math.max(0, p.halfH - p.depth);
  const innerR = Math.max(0, Math.min(p.radius, Math.min(innerHalfW, innerHalfH)));
  const falloffInv = p.depth > 0 ? 1 / (p.depth * Math.SQRT2) : 1e6;
  const specOn = p.glowStrength > 0 || p.edgeStrength > 0;
  const theta = (p.specularAngle * Math.PI) / 180;
  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);
  const spreadStart = (1 - p.glowSpread) * Math.SQRT2;
  const spreadRange = p.glowSpread * Math.SQRT2;
  const spreadInv = spreadRange > 0.001 ? 1 / spreadRange : 0;
  const edgeWInv = p.edgeWidth > 0 ? 1 / p.edgeWidth : 0;
  const stepX = (2 * p.halfW) / size;
  const stepY = (2 * p.halfH) / size;
  const invW = 1 / p.halfW;
  const invH = 1 / p.halfH;
  const dome = p.domeDepth > 0;
  const splaying = p.splay < 1;
  const proxHalf = 0.5 * Math.min(p.halfW, p.halfH);
  const proxInv = proxHalf > 0 ? 1 / proxHalf : 0;
  let colSlope = null;
  let domeRy = 0;
  let domeScaleY = 0;
  if (dome) {
    const dc = computeDomeConstants(p.domeDepth, p.halfW, p.halfH);
    domeRy = dc.ry;
    domeScaleY = dc.scaleY;
    colSlope = new Float32Array(half);
    const lim = 0.999 * dc.rx;
    for (let col = 0; col < half; col++) {
      const px = p.halfW - (col + 0.5) * stepX;
      const s = px < lim ? px : lim;
      colSlope[col] = (s / Math.sqrt(dc.rx * dc.rx - s * s)) * dc.scaleX;
    }
  }
  for (let row = 0; row < half; row++) {
    const py = p.halfH - (row + 0.5) * stepY;
    const cornerDy = py - p.halfH + r0;
    const innerDy = py - innerHalfH + innerR;
    const yLin = Math.min(py * invH, 1);
    const domeY = dome ? domeGradient(py, domeRy, domeScaleY) : yLin;
    const proxY = splaying ? Math.max(0, 1 - (p.halfH - py) * proxInv) : 0;
    const mr = size - 1 - row;
    for (let col = 0; col < half; col++) {
      const px = p.halfW - (col + 0.5) * stepX;
      const mc = size - 1 - col;
      const cornerDx = px - p.halfW + r0;
      const ux = Math.max(cornerDx, 0);
      const uy = Math.max(cornerDy, 0);
      const sd =
        Math.hypot(ux, uy) + Math.min(Math.max(cornerDx, cornerDy), 0) - r0;
      const i00 = (row * size + col) * 4;
      const i10 = (row * size + mc) * 4;
      const i01 = (mr * size + col) * 4;
      const i11 = (mr * size + mc) * 4;
      if (sdfBoundary && sd >= 0) {
        for (const i of [i00, i10, i01, i11]) {
          data[i] = 128;
          data[i + 1] = 128;
          data[i + 2] = 128;
          data[i + 3] = 255;
        }
        continue;
      }
      let dx = colSlope ? colSlope[col] : Math.min(px * invW, 1);
      let dy = domeY;
      if (splaying) {
        const k = 1 - p.splay;
        const ty = proxY * k;
        const tx = Math.max(0, 1 - (p.halfW - px) * proxInv) * k;
        if (tx > 0.001 || ty > 0.001) {
          const ox = dx;
          const oy = dy;
          dx = ox * (1 - ty);
          dy = oy * (1 - tx);
          const before = Math.hypot(ox, oy);
          const after = Math.hypot(dx, dy);
          if (after > 0.001) {
            const f = before / after;
            dx *= f;
            dy *= f;
          }
        }
      }
      let gate = 1;
      if (edgeFalloff) {
        const innerDx = px - innerHalfW + innerR;
        const iux = Math.max(innerDx, 0);
        const iuy = Math.max(innerDy, 0);
        const isd =
          Math.hypot(iux, iuy) +
          Math.min(Math.max(innerDx, innerDy), 0) -
          innerR;
        gate = 0.5 * (1 + erf(isd * falloffInv));
      }
      const hx = 0.5 * dx * gate;
      const hy = 0.5 * dy * gate;
      const rPos = ((0.5 + hx) * 255 + 0.5) | 0;
      const rNeg = ((0.5 - hx) * 255 + 0.5) | 0;
      const gPos = ((0.5 + hy) * 255 + 0.5) | 0;
      const gNeg = ((0.5 - hy) * 255 + 0.5) | 0;
      let b1 = 128;
      let b2 = 128;
      if (specOn) {
        const sa = Math.min(px * invW, 1) * cosT;
        const sb = yLin * sinT;
        const f1 = Math.abs(sa + sb);
        const f2 = Math.abs(sa - sb);
        let s1 = 0;
        let s2 = 0;
        if (p.glowStrength > 0) {
          s1 +=
            p.glowStrength *
            clamp01((f1 - spreadStart) * spreadInv) ** p.glowExponent *
            gate;
          s2 +=
            p.glowStrength *
            clamp01((f2 - spreadStart) * spreadInv) ** p.glowExponent *
            gate;
        }
        if (p.edgeStrength > 0) {
          const rim = sd < 0 ? Math.max(0, 1 + sd * edgeWInv) : 0;
          s1 += p.edgeStrength * rim * f1 ** p.edgeExponent;
          s2 += p.edgeStrength * rim * f2 ** p.edgeExponent;
        }
        if (s1 > 1) {
          s1 = 1;
        }
        if (s2 > 1) {
          s2 = 1;
        }
        b1 = (127 * s1 + 128 + 0.5) | 0;
        b2 = (127 * s2 + 128 + 0.5) | 0;
      }
      data[i00] = rPos;
      data[i00 + 1] = gPos;
      data[i00 + 2] = b1;
      data[i00 + 3] = 255;
      data[i10] = rNeg;
      data[i10 + 1] = gPos;
      data[i10 + 2] = b2;
      data[i10 + 3] = 255;
      data[i01] = rPos;
      data[i01 + 1] = gNeg;
      data[i01 + 2] = b2;
      data[i01 + 3] = 255;
      data[i11] = rNeg;
      data[i11 + 1] = gNeg;
      data[i11 + 2] = b1;
      data[i11 + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  return canvas.toDataURL("image/png");
}

const maskCache = new Map();

function roundedMaskHref(w, h, rx, ry) {
  const cw = Math.max(1, Math.round(w));
  const ch = Math.max(1, Math.round(h));
  const crx = Math.max(0, Math.min(rx, cw / 2));
  const cry = Math.max(0, Math.min(ry, ch / 2));
  const key = `${cw}|${ch}|${crx}|${cry}`;
  const cached = maskCache.get(key);
  if (cached !== undefined) {
    return cached;
  }
  const canvas = document.createElement("canvas");
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return "";
  }
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.roundRect(0, 0, cw, ch, [{ x: crx, y: cry }]);
  ctx.fill();
  const url = canvas.toDataURL();
  maskCache.set(key, url);
  if (maskCache.size > MAP_CACHE_LIMIT) {
    const first = maskCache.keys().next().value;
    if (first !== undefined) {
      maskCache.delete(first);
    }
  }
  return url;
}

let emptyHref = null;

function placeholderHref() {
  if (emptyHref === null && typeof document !== "undefined") {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    emptyHref = canvas.toDataURL();
  }
  return emptyHref ?? "";
}

const isWebKitOnly =
  typeof navigator !== "undefined" &&
  /AppleWebKit/.test(navigator.userAgent) &&
  !/(Chrome|Chromium|CriOS|FxiOS|EdgiOS|Edg|OPR|Firefox)/.test(
    navigator.userAgent
  );

function isSafariBrowser() {
  return isWebKitOnly;
}

function readForcedRenderer() {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const query = new URLSearchParams(window.location.search).get(
      "glassRenderer"
    );
    if (query === "webgl" || query === "svg") {
      return query;
    }
    const flag = window.__GLASS_RENDERER__;
    if (flag === "webgl" || flag === "svg") {
      return flag;
    }
    const stored = window.localStorage?.getItem("glassRenderer");
    if (stored === "webgl" || stored === "svg") {
      return stored;
    }
  } catch {
    return null;
  }
  return null;
}

const forcedRenderer = readForcedRenderer();

function useGlassDark() {
  const [dark, setDark] = useState(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark")
  );
  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setDark(root.classList.contains("dark"));
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return dark;
}

const subscribeHydration = () => () => {};

function useHydrated() {
  return useSyncExternalStore(
    subscribeHydration,
    () => true,
    () => false
  );
}

function makeSlot() {
  return {
    feImage: null,
    feScale: null,
    feFlood: null,
    feMask: null,
    backdrop: null,
    hrefInit: false,
    lastKey: "",
    lastMaskKey: "",
    lastMatrix: "",
    lastX: "",
    lastY: "",
    lastW: "",
    lastH: "",
    lastWidth: 0,
    lastHeight: 0,
    lastRadius: 0,
    lastBackdrop: "",
    prevW: 0,
    prevH: 0,
  };
}

const OVERRIDE_KEYS = [
  "depth",
  "domeDepth",
  "splay",
  "specularAngle",
  "glow",
  "glowSpread",
  "glowExponent",
  "edgeHighlight",
  "edgeWidth",
  "edgeExponent",
];

function markOverrides(mark) {
  const out = { mul: 1 };
  for (const key of OVERRIDE_KEYS) {
    const raw = mark.dataset[`glass${key[0].toUpperCase()}${key.slice(1)}`];
    if (raw !== undefined) {
      const v = Number(raw);
      if (!Number.isNaN(v)) {
        out[key] = v;
      }
    }
  }
  const mulRaw = mark.dataset.glassMul;
  if (mulRaw !== undefined) {
    const v = Number(mulRaw);
    if (!Number.isNaN(v)) {
      out.mul = clamp01(v);
    }
  }
  return out;
}

function axisMatrix(kx, ky) {
  return `${kx} 0 0 0 ${(1 - kx) / 2}  0 ${ky} 0 0 ${(1 - ky) / 2}  0 0 1 0 0  0 0 0 1 0`;
}

function Glass({
  scaleX = 0.1,
  scaleY = 0.1,
  chroma = 0.2,
  depth = 6,
  domeDepth = 0,
  splay = 1,
  blur = 0,
  glow = 0.12,
  glowSpread = 1,
  glowExponent = 1.5,
  edgeHighlight = 0.3,
  edgeWidth = 3,
  edgeExponent = 1.5,
  specularStrength = 1,
  specularAngle = 45,
  specularDark = false,
  sdfBoundary = true,
  edgeFalloff = true,
  mapSize = 256,
  maxDisplacement = Number.POSITIVE_INFINITY,
  resolution = 1,
  reveal = false,
  tint = 0,
  tintBlur = 12,
  tintColor,
  dynamicsRef,
  lens,
  className,
  children,
  ...props
}) {
  const dark = useGlassDark();
  const tintRGB = tintColor ?? (dark ? "58,58,62" : "255,255,255");
  const baseId = useId().replace(/[^a-zA-Z0-9-]/g, "");
  const filterId = `${baseId}-glass`;
  const contentRef = useRef(null);
  const rootRef = useRef(null);
  const lensLayerRef = useRef(null);
  const filterRef = useRef(null);
  const feBlurRef = useRef(null);
  const dispRefs = useRef([null, null, null]);
  const slotsRef = useRef(Array.from({ length: SLOTS }, makeSlot));
  const mapCache = useRef(new Map());
  const decodedUrls = useRef(new Set());
  const pendingUrls = useRef(new Set());
  const version = useRef(0);
  const lastScale = useRef(-1);
  const [slotCount, setSlotCount] = useState(1);
  const slotCountRef = useRef(1);
  slotCountRef.current = slotCount;

  const scaleMax = Math.max(scaleX, scaleY, 1e-4);
  const kx = scaleX / scaleMax;
  const ky = scaleY / scaleMax;

  const hydrated = useHydrated();
  const rasterKind = isRasterChild(children);
  const useWebGL =
    hydrated &&
    (forcedRenderer === "svg"
      ? false
      : rasterKind !== null &&
        webglAvailable() &&
        (forcedRenderer === "webgl" || isSafariBrowser()));

  const params = useRef({
    depth,
    domeDepth,
    splay,
    specularAngle,
    specularStrength,
    specularDark,
    glow,
    glowSpread,
    glowExponent,
    edgeHighlight,
    edgeWidth,
    edgeExponent,
    mapSize,
    scaleMax,
    maxDisplacement,
    chroma,
    blur,
    sdfBoundary,
    edgeFalloff,
    kx,
    ky,
    resolution,
    tint: clamp01(tint),
    tintBlur,
    tintRGB,
  });
  params.current = {
    depth,
    domeDepth,
    splay,
    specularAngle,
    specularStrength,
    specularDark,
    glow,
    glowSpread,
    glowExponent,
    edgeHighlight,
    edgeWidth,
    edgeExponent,
    mapSize,
    scaleMax,
    maxDisplacement,
    chroma,
    blur,
    sdfBoundary,
    edgeFalloff,
    kx,
    ky,
    resolution,
    tint: clamp01(tint),
    tintBlur,
    tintRGB,
  };

  const attach = useCallback(
    (node) => {
      if (!node || typeof window === "undefined") {
        return;
      }
      rootRef.current = node;
      if (useWebGL) {
        return;
      }
      let raf = 0;
      let lastChroma = -1;
      let lastBlurStd = -1;
      const collapse = (slot) => {
        if (slot.lastW === "0.001") {
          return;
        }
        for (const el of [slot.feImage, slot.feFlood, slot.feMask]) {
          el?.setAttribute("x", "0");
          el?.setAttribute("y", "0");
          el?.setAttribute("width", "0.001");
          el?.setAttribute("height", "0.001");
        }
        if (slot.backdrop) {
          slot.backdrop.style.display = "none";
          slot.lastBackdrop = "";
        }
        slot.lastX = "0";
        slot.lastY = "0";
        slot.lastW = "0.001";
        slot.lastH = "0.001";
        slot.lastWidth = 0;
        slot.lastHeight = 0;
      };
      const getMap = (key, mp) => {
        const cached = mapCache.current.get(key);
        if (cached !== undefined) {
          return cached;
        }
        const url = generateLensMap(mp) ?? "";
        mapCache.current.set(key, url);
        if (mapCache.current.size > MAP_CACHE_LIMIT) {
          const first = mapCache.current.keys().next().value;
          if (first !== undefined) {
            mapCache.current.delete(first);
          }
        }
        return url;
      };
      const preload = (url) => {
        if (!url) {
          return false;
        }
        if (decodedUrls.current.has(url)) {
          return true;
        }
        if (pendingUrls.current.has(url)) {
          return false;
        }
        pendingUrls.current.add(url);
        const img = new Image();
        img.onload = () => {
          pendingUrls.current.delete(url);
          if (decodedUrls.current.size > 256) {
            decodedUrls.current.clear();
          }
          decodedUrls.current.add(url);
        };
        img.onerror = () => {
          pendingUrls.current.delete(url);
        };
        img.src = url;
        return false;
      };
      const tick = () => {
        const layer = lensLayerRef.current;
        for (const slot of slotsRef.current) {
          if (!slot.hrefInit && slot.feImage) {
            if (!slot.feImage.getAttribute("href")) {
              slot.feImage.setAttribute("href", placeholderHref());
            }
            slot.hrefInit = true;
          }
        }
        const p = params.current;
        if (p.chroma !== lastChroma) {
          lastChroma = p.chroma;
          lastScale.current = -1;
        }
        const dyn = dynamicsRef?.current ?? undefined;
        const zoom = dyn?.zoom ?? 1;
        const depthMul = dyn?.depthMul ?? 1;
        const G = p.resolution;
        let mapChanged = false;
        let rectChanged = false;
        let hasLens = false;
        let activeCount = 0;
        let base = null;
        if (layer) {
          base = node.getBoundingClientRect();
          const marks = layer.querySelectorAll("[data-glass-lens]");
          for (let i = 0; i < SLOTS; i++) {
            const slot = slotsRef.current[i];
            const mark = marks[i];
            if (!mark) {
              collapse(slot);
              continue;
            }
            const r = mark.getBoundingClientRect();
            if (r.width < 2 || r.height < 2) {
              collapse(slot);
              continue;
            }
            hasLens = true;
            activeCount += 1;
            const ov = markOverrides(mark);
            const tintRaw = mark.dataset.glassTint;
            const tintNum = tintRaw === undefined ? Number.NaN : Number(tintRaw);
            const lensTint = Number.isNaN(tintNum) ? p.tint : clamp01(tintNum);
            const tintEff = 0.5 * lensTint;
            const md = i === 0 ? dyn?.mapDims : undefined;
            const rectW = Math.round(r.width * 2) / 2;
            const rectH = Math.round(r.height * 2) / 2;
            const genW = md ? Math.round(md.halfW * 4) / 2 : rectW;
            const genH = md ? Math.round(md.halfH * 4) / 2 : rectH;
            const resizing =
              Math.abs(r.width - slot.prevW) > 0.3 ||
              Math.abs(r.height - slot.prevH) > 0.3;
            slot.prevW = r.width;
            slot.prevH = r.height;
            const radiusParts = getComputedStyle(mark)
              .borderTopLeftRadius.split(" ")
              .map((v) => Math.round(Number.parseFloat(v) * 2) / 2 || 0);
            const cssRadius = radiusParts[0] ?? 0;
            const cssRadiusY = radiusParts[1] ?? cssRadius;
            const radius = md ? Math.round(md.radius * 2) / 2 : cssRadius;
            const sizeChanged =
              Math.abs(genW - slot.lastWidth) >= 0.5 ||
              Math.abs(genH - slot.lastHeight) >= 0.5 ||
              Math.abs(radius - slot.lastRadius) >= 0.5;
            const unitsPerPx = md ? genW / Math.max(rectW, 1) : 1;
            const baseDepth = ov.depth ?? p.depth;
            const baseDome = ov.domeDepth ?? p.domeDepth;
            const baseEdgeW = ov.edgeWidth ?? p.edgeWidth;
            const effDepth =
              Math.round(baseDepth * depthMul * unitsPerPx * 10) / 10;
            const effDome = Math.round(baseDome * unitsPerPx * 10) / 10;
            const effEdgeW = Math.round(baseEdgeW * unitsPerPx * 10) / 10;
            const splayV = ov.splay ?? p.splay;
            const angleV = ov.specularAngle ?? p.specularAngle;
            const glowV = ov.glow ?? p.glow;
            const glowSpreadV = ov.glowSpread ?? p.glowSpread;
            const glowExpV = ov.glowExponent ?? p.glowExponent;
            const edgeV = ov.edgeHighlight ?? p.edgeHighlight;
            const edgeExpV = ov.edgeExponent ?? p.edgeExponent;
            const key = `${genW}x${genH}r${radius}d${effDepth}o${effDome}p${splayV}a${angleV}g${glowV},${glowSpreadV},${glowExpV}e${edgeV},${effEdgeW},${edgeExpV}m${p.mapSize}f${p.sdfBoundary ? 1 : 0}${p.edgeFalloff ? 1 : 0}`;
            if (!slot.lastKey || (!resizing && (sizeChanged || key !== slot.lastKey))) {
              const url = getMap(key, {
                halfW: genW / 2,
                halfH: genH / 2,
                radius,
                depth: effDepth,
                domeDepth: effDome,
                splay: splayV,
                specularAngle: angleV,
                glowStrength: glowV,
                glowSpread: glowSpreadV,
                glowExponent: glowExpV,
                edgeStrength: edgeV,
                edgeWidth: effEdgeW,
                edgeExponent: edgeExpV,
                size: p.mapSize,
                sdfBoundary: p.sdfBoundary,
                edgeFalloff: p.edgeFalloff,
              });
              if (preload(url)) {
                slot.feImage?.setAttribute("href", url);
                slot.lastKey = key;
                slot.lastWidth = genW;
                slot.lastHeight = genH;
                slot.lastRadius = radius;
                mapChanged = true;
              }
            }
            const tintFade = 1 - 0.85 * tintEff;
            const matrix = axisMatrix(
              p.kx * ov.mul * tintFade,
              p.ky * ov.mul * tintFade
            );
            if (slot.lastMatrix !== matrix) {
              slot.feScale?.setAttribute("values", matrix);
              slot.lastMatrix = matrix;
              rectChanged = true;
            }
            const fx = Math.round((r.left - base.left) * 2) / 2;
            const fy = Math.round((r.top - base.top) * 2) / 2;
            const bw = base.width || 1;
            const bh = base.height || 1;
            const sx = String((fx + EDGE_BIAS) / bw);
            const sy = String((fy + EDGE_BIAS) / bh);
            const sw = String(Math.max(0, rectW - 2 * EDGE_BIAS) / bw);
            const sh = String(Math.max(0, rectH - 2 * EDGE_BIAS) / bh);
            if (
              slot.lastX !== sx ||
              slot.lastY !== sy ||
              slot.lastW !== sw ||
              slot.lastH !== sh
            ) {
              for (const el of [slot.feImage, slot.feFlood, slot.feMask]) {
                el?.setAttribute("x", sx);
                el?.setAttribute("y", sy);
                el?.setAttribute("width", sw);
                el?.setAttribute("height", sh);
              }
              slot.lastX = sx;
              slot.lastY = sy;
              slot.lastW = sw;
              slot.lastH = sh;
              rectChanged = true;
            }
            if (slot.feMask) {
              const maskKey = `${rectW}|${rectH}|${cssRadius}|${cssRadiusY}|${G}`;
              if (!slot.lastMaskKey || (!resizing && slot.lastMaskKey !== maskKey)) {
                const maskUrl = roundedMaskHref(
                  (rectW - 2 * EDGE_BIAS) * G,
                  (rectH - 2 * EDGE_BIAS) * G,
                  cssRadius * G,
                  cssRadiusY * G
                );
                if (preload(maskUrl)) {
                  slot.feMask.setAttribute("href", maskUrl);
                  slot.lastMaskKey = maskKey;
                  mapChanged = true;
                }
              }
            }
            const bd = slot.backdrop;
            if (bd) {
              const blurPx = Math.max(p.blur, tintEff * p.tintBlur);
              const filter =
                blurPx > 0.05
                  ? `blur(${blurPx}px) saturate(${1 + 0.5 * tintEff})`
                  : "none";
              const bg =
                tintEff > 0.001
                  ? `rgba(${p.tintRGB},${Math.round(tintEff * 700) / 1000})`
                  : "transparent";
              const bdKey = `${fx},${fy},${rectW},${rectH},${cssRadius},${filter},${bg}`;
              if (slot.lastBackdrop !== bdKey) {
                bd.style.transform = `translate3d(${fx}px, ${fy}px, 0)`;
                bd.style.width = `${rectW}px`;
                bd.style.height = `${rectH}px`;
                bd.style.borderRadius = `${cssRadius}px`;
                bd.style.backdropFilter = filter;
                bd.style.setProperty("-webkit-backdrop-filter", filter);
                bd.style.background = bg;
                bd.style.display = "block";
                slot.lastBackdrop = bdKey;
              }
            }
          }
        }
        const desiredSlots = Math.min(Math.max(activeCount, 1), SLOTS);
        if (desiredSlots !== slotCountRef.current) {
          slotCountRef.current = desiredSlots;
          setSlotCount(desiredSlots);
        }
        if (hasLens && base) {
          const blurStd = p.blur / (base.width || 1);
          if (blurStd !== lastBlurStd) {
            lastBlurStd = blurStd;
            feBlurRef.current?.setAttribute("stdDeviation", String(blurStd));
          }
          const dispScale = Math.min(
            p.scaleMax * zoom,
            p.maxDisplacement / (base.width || 1)
          );
          if (Math.abs(dispScale - lastScale.current) > 0.0001) {
            lastScale.current = dispScale;
            const c = p.chroma;
            const scales =
              c > 0
                ? [dispScale * (1 + 0.2 * c), dispScale * (1 + 0.1 * c), dispScale]
                : [dispScale];
            dispRefs.current.forEach((el, i) => {
              if (el && scales[i] !== undefined) {
                el.setAttribute("scale", String(scales[i]));
              }
            });
            rectChanged = true;
          }
        }
        if (
          (mapChanged || (isWebKitOnly && rectChanged)) &&
          filterRef.current &&
          contentRef.current
        ) {
          version.current += 1;
          const id = `${filterId}-v${version.current}`;
          filterRef.current.id = id;
          contentRef.current.style.filter = `url(#${id})`;
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    },
    [filterId, dynamicsRef, useWebGL]
  );

  useEffect(() => {
    if (!useWebGL || typeof window === "undefined") {
      return;
    }
    const node = rootRef.current;
    const lensLayer = lensLayerRef.current;
    const sourceEl =
      contentRef.current?.querySelector("video,canvas,img") ?? null;
    if (!node || !lensLayer || !sourceEl) {
      return;
    }
    const renderer = new GlassWebGLRenderer();
    return renderer.attach(node, lensLayer, sourceEl, {
      getParams: () => params.current,
      getDynamics: () => dynamicsRef?.current ?? undefined,
      reveal,
    });
  }, [useWebGL, reveal, dynamicsRef]);

  const source = blur > 0 ? "blurred" : "SourceGraphic";
  const slotIndexes = Array.from({ length: SLOTS }, (_, i) => i);
  const renderSlots = Array.from({ length: slotCount }, (_, i) => i);
  const axisValues = axisMatrix(kx, ky);

  return (
    <div className={cn("relative", className)} ref={attach} {...props}>
      <div
        className="relative h-full w-full"
        ref={contentRef}
        style={{
          ...(useWebGL
            ? { visibility: reveal ? "hidden" : "visible" }
            : { filter: `url(#${filterId})`, willChange: "filter" }),
          ...(resolution !== 1
            ? {
                width: `${resolution * 100}%`,
                height: `${resolution * 100}%`,
                transform: `scale(${1 / resolution})`,
                transformOrigin: "0 0",
              }
            : null),
        }}
      >
        {resolution !== 1 ? (
          <div
            style={{
              width: `${100 / resolution}%`,
              height: `${100 / resolution}%`,
              transform: `scale(${resolution})`,
              transformOrigin: "0 0",
            }}
          >
            {children}
          </div>
        ) : (
          children
        )}
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {slotIndexes.map((i) => (
          <div
            key={`bd-${i}`}
            ref={(el) => {
              slotsRef.current[i].backdrop = el;
            }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              display: "none",
              willChange: "backdrop-filter, transform",
            }}
          />
        ))}
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        ref={lensLayerRef}
      >
        {lens}
      </div>
      {!useWebGL && (
        <svg aria-hidden="true" className="absolute h-0 w-0" focusable="false">
          <defs>
            <filter
              colorInterpolationFilters="sRGB"
              filterUnits="objectBoundingBox"
              height="1"
              id={filterId}
              primitiveUnits="objectBoundingBox"
              ref={filterRef}
              width="1"
              x="0"
              y="0"
            >
              <feFlood
                floodColor="rgb(128,128,128)"
                floodOpacity="1"
                result="mapBg"
              />
              {renderSlots.map((i) => (
                <feImage
                  key={`img-${i}`}
                  preserveAspectRatio="none"
                  ref={(el) => {
                    slotsRef.current[i].feImage = el;
                  }}
                  result={`raw${i}`}
                />
              ))}
              {renderSlots.map((i) => (
                <feColorMatrix
                  in={`raw${i}`}
                  key={`scale-${i}`}
                  ref={(el) => {
                    slotsRef.current[i].feScale = el;
                  }}
                  result={`scaled${i}`}
                  type="matrix"
                  values={axisValues}
                />
              ))}
              {renderSlots.map((i) => (
                <feComposite
                  in={`scaled${i}`}
                  in2={i === 0 ? "mapBg" : `m${i - 1}`}
                  key={`mc-${i}`}
                  operator="over"
                  result={i === slotCount - 1 ? "map" : `m${i}`}
                />
              ))}
              {blur > 0 && (
                <feGaussianBlur
                  in="SourceGraphic"
                  ref={feBlurRef}
                  result="blurred"
                  stdDeviation="0"
                />
              )}
              {chroma > 0 ? (
                <>
                  <feDisplacementMap
                    in={source}
                    in2="map"
                    ref={(el) => {
                      dispRefs.current[0] = el;
                      if (el && !el.hasAttribute("scale")) {
                        el.setAttribute("scale", "0");
                        lastScale.current = -1;
                      }
                    }}
                    result="dR"
                    xChannelSelector="R"
                    yChannelSelector="G"
                  />
                  <feColorMatrix
                    in="dR"
                    result="cR"
                    type="matrix"
                    values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                  />
                  <feDisplacementMap
                    in={source}
                    in2="map"
                    ref={(el) => {
                      dispRefs.current[1] = el;
                      if (el && !el.hasAttribute("scale")) {
                        el.setAttribute("scale", "0");
                        lastScale.current = -1;
                      }
                    }}
                    result="dG"
                    xChannelSelector="R"
                    yChannelSelector="G"
                  />
                  <feColorMatrix
                    in="dG"
                    result="cG"
                    type="matrix"
                    values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
                  />
                  <feDisplacementMap
                    in={source}
                    in2="map"
                    ref={(el) => {
                      dispRefs.current[2] = el;
                      if (el && !el.hasAttribute("scale")) {
                        el.setAttribute("scale", "0");
                        lastScale.current = -1;
                      }
                    }}
                    result="dB"
                    xChannelSelector="R"
                    yChannelSelector="G"
                  />
                  <feColorMatrix
                    in="dB"
                    result="cB"
                    type="matrix"
                    values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
                  />
                  <feComposite
                    in="cR"
                    in2="cG"
                    k1="0"
                    k2="1"
                    k3="1"
                    k4="0"
                    operator="arithmetic"
                    result="cRG"
                  />
                  <feComposite
                    in="cRG"
                    in2="cB"
                    k1="0"
                    k2="1"
                    k3="1"
                    k4="0"
                    operator="arithmetic"
                    result="lensResult"
                  />
                </>
              ) : (
                <feDisplacementMap
                  in={source}
                  in2="map"
                  ref={(el) => {
                    dispRefs.current[0] = el;
                    if (el && !el.hasAttribute("scale")) {
                      el.setAttribute("scale", "0");
                      lastScale.current = -1;
                    }
                  }}
                  result="lensResult"
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              )}
              {(glow > 0 || edgeHighlight > 0) &&
                (specularDark ? (
                  <>
                    <feColorMatrix
                      in="map"
                      result="spec"
                      type="matrix"
                      values={`0 0 ${-specularStrength} 0 ${1 + (128 * specularStrength) / 255}  0 0 ${-specularStrength} 0 ${1 + (128 * specularStrength) / 255}  0 0 ${-specularStrength} 0 ${1 + (128 * specularStrength) / 255}  0 0 0 0 1`}
                    />
                    <feComposite
                      in="spec"
                      in2="lensResult"
                      k1="1"
                      k2="0"
                      k3="0"
                      k4="0"
                      operator="arithmetic"
                      result="lensResult"
                    />
                  </>
                ) : (
                  <>
                    <feColorMatrix
                      in="map"
                      result="spec"
                      type="matrix"
                      values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 1 0 -0.5019607843"
                    />
                    <feComposite
                      in="spec"
                      in2="lensResult"
                      k1="0"
                      k2={specularStrength}
                      k3="1"
                      k4="0"
                      operator="arithmetic"
                      result="lensResult"
                    />
                  </>
                ))}
              {renderSlots.map((i) =>
                reveal ? (
                  <feImage
                    height="0.001"
                    key={`mask-${i}`}
                    preserveAspectRatio="none"
                    ref={(el) => {
                      slotsRef.current[i].feMask = el;
                    }}
                    result={`mask${i}`}
                    width="0.001"
                    x="0"
                    y="0"
                  />
                ) : (
                  <feFlood
                    floodColor="black"
                    floodOpacity="1"
                    height="0.001"
                    key={`mask-${i}`}
                    ref={(el) => {
                      slotsRef.current[i].feFlood = el;
                    }}
                    result={`mask${i}`}
                    width="0.001"
                    x="0"
                    y="0"
                  />
                )
              )}
              <feMerge result="unionMask">
                {renderSlots.map((i) => (
                  <feMergeNode in={`mask${i}`} key={`mn-${i}`} />
                ))}
              </feMerge>
              {reveal ? (
                <feComposite in="lensResult" in2="unionMask" operator="in" />
              ) : (
                <>
                  <feComposite
                    in="lensResult"
                    in2="unionMask"
                    operator="in"
                    result="lensClipped"
                  />
                  <feComposite
                    in="SourceGraphic"
                    in2="unionMask"
                    operator="out"
                    result="holedSG"
                  />
                  <feComposite in="lensClipped" in2="holedSG" operator="over" />
                </>
              )}
            </filter>
          </defs>
        </svg>
      )}
    </div>
  );
}

export { Glass, generateLensMap, isSafariBrowser, useGlassDark, useHydrated };
