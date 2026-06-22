"use client";

import { generateLensMap } from "./glass";
import { Children, isValidElement } from "react";

const SLOTS = 5;
const MAP_CACHE_LIMIT = 64;
const DPR_CAP = 2.5;

function clamp01(v) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
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

function isRasterChild(children) {
  const items = Children.toArray(children).filter(
    (c) => !(typeof c === "string" && c.trim() === "")
  );
  if (items.length !== 1) {
    return null;
  }
  const only = items[0];
  if (!isValidElement(only) || typeof only.type !== "string") {
    return null;
  }
  if (only.type === "video") {
    return "video";
  }
  if (only.type === "canvas") {
    return "canvas";
  }
  if (only.type === "img") {
    return "image";
  }
  return null;
}

let webglProbe = null;

function webglAvailable() {
  if (webglProbe !== null) {
    return webglProbe;
  }
  if (typeof document === "undefined") {
    webglProbe = false;
    return false;
  }
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl");
    webglProbe = gl instanceof WebGLRenderingContext;
  } catch {
    webglProbe = false;
  }
  return webglProbe;
}

const VERT_SRC = `
attribute vec2 aPos;
uniform vec4 uRect;
uniform vec2 uContainer;
varying vec2 vLocal;
varying vec2 vGlobalUV;
void main() {
  vLocal = aPos;
  vec2 px = uRect.xy + aPos * uRect.zw;
  vGlobalUV = px / uContainer;
  vec2 clip = vec2(px.x / uContainer.x * 2.0 - 1.0, 1.0 - px.y / uContainer.y * 2.0);
  gl_Position = vec4(clip, 0.0, 1.0);
}
`;

const FRAG_SRC = `
precision highp float;
uniform sampler2D uSrc;
uniform sampler2D uMap;
uniform vec2 uContainer;
uniform vec2 uRectWH;
uniform vec2 uRadius;
uniform vec3 uChromaScale;
uniform vec2 uAxis;
uniform float uSpecStrength;
uniform float uSpecularDark;
uniform vec3 uTintColor;
uniform float uTintAmount;
varying vec2 vLocal;
varying vec2 vGlobalUV;

float rrCoverage(vec2 local, vec2 wh, vec2 rad) {
  vec2 p = (local - 0.5) * wh;
  vec2 b = wh * 0.5 - rad;
  vec2 q = abs(p) - b;
  float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - min(rad.x, rad.y);
  return 1.0 - smoothstep(-1.0, 1.0, d);
}

vec2 mapOffset(float scalePx) {
  vec2 m = texture2D(uMap, vLocal).rg;
  vec2 disp = (m - 0.5) * uAxis * scalePx;
  return disp / uContainer;
}

void main() {
  float cov = rrCoverage(vLocal, uRectWH, uRadius);
  if (cov <= 0.0) {
    discard;
  }
  float r = texture2D(uSrc, vGlobalUV + mapOffset(uChromaScale.r)).r;
  float g = texture2D(uSrc, vGlobalUV + mapOffset(uChromaScale.g)).g;
  float b = texture2D(uSrc, vGlobalUV + mapOffset(uChromaScale.b)).b;
  vec3 col = vec3(r, g, b);
  float spec = max(texture2D(uMap, vLocal).b - 0.50196078, 0.0);
  if (uSpecularDark > 0.5) {
    col *= 1.0 - uSpecStrength * spec;
  } else {
    col += uSpecStrength * spec;
  }
  col = mix(col, uTintColor, uTintAmount);
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), cov);
}
`;

function compileShader(gl, type, src) {
  const shader = gl.createShader(type);
  if (!shader) {
    return null;
  }
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl) {
  const vs = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
  if (!vs || !fs) {
    return null;
  }
  const program = gl.createProgram();
  if (!program) {
    return null;
  }
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.bindAttribLocation(program, 0, "aPos");
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function parseTintRGB(rgb) {
  const parts = rgb.split(",").map((v) => Number(v.trim()) / 255);
  return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
}

class GlassWebGLRenderer {
  constructor() {
    this.gl = null;
    this.program = null;
    this.quad = null;
    this.srcTexture = null;
    this.uniforms = new Map();
    this.mapCache = new Map();
    this.pending = new Set();
    this.raf = 0;
    this.rvfc = 0;
    this.frameReady = false;
    this.srcUploaded = false;
    this.srcW = 0;
    this.srcH = 0;
    this.running = false;
    this.disposed = false;
    this.start = () => undefined;
  }

  attach(container, lensLayer, source, options) {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    container.appendChild(canvas);

    const gl =
      canvas.getContext("webgl", {
        alpha: true,
        premultipliedAlpha: false,
        antialias: true,
        depth: false,
        stencil: false,
        preserveDrawingBuffer: false,
        powerPreference: "low-power",
      }) ?? null;

    if (!(gl instanceof WebGLRenderingContext)) {
      canvas.remove();
      return () => undefined;
    }
    this.gl = gl;

    const onLost = (event) => {
      event.preventDefault();
      this.running = false;
      cancelAnimationFrame(this.raf);
      this.srcUploaded = false;
      this.srcTexture = null;
      this.srcW = 0;
      this.srcH = 0;
      for (const entry of this.mapCache.values()) {
        entry.texture = null;
        entry.ready = false;
      }
    };
    const onRestored = () => {
      if (this.disposed) {
        return;
      }
      this.initGL();
      this.mapCache.clear();
      this.pending.clear();
      this.start();
    };
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);

    this.initGL();

    const isVideo = source instanceof HTMLVideoElement;
    const supportsRVFC =
      isVideo &&
      "requestVideoFrameCallback" in source &&
      typeof source.requestVideoFrameCallback === "function";

    const pumpVideo = () => {
      if (this.disposed || !(source instanceof HTMLVideoElement)) {
        return;
      }
      this.frameReady = true;
      this.rvfc = source.requestVideoFrameCallback(pumpVideo);
    };
    if (supportsRVFC && source instanceof HTMLVideoElement) {
      this.rvfc = source.requestVideoFrameCallback(pumpVideo);
    }

    const tick = () => {
      if (!this.running) {
        return;
      }
      this.render(
        container,
        lensLayer,
        source,
        options,
        isVideo,
        supportsRVFC
      );
      this.raf = requestAnimationFrame(tick);
    };
    this.start = () => {
      if (this.running) {
        return;
      }
      this.running = true;
      this.raf = requestAnimationFrame(tick);
    };
    this.start();

    return () => {
      this.disposed = true;
      this.running = false;
      cancelAnimationFrame(this.raf);
      if (
        supportsRVFC &&
        source instanceof HTMLVideoElement &&
        "cancelVideoFrameCallback" in source
      ) {
        source.cancelVideoFrameCallback(this.rvfc);
      }
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      const ctx = this.gl;
      if (ctx) {
        for (const entry of this.mapCache.values()) {
          if (entry.texture) {
            ctx.deleteTexture(entry.texture);
          }
        }
        if (this.srcTexture) {
          ctx.deleteTexture(this.srcTexture);
        }
        if (this.quad) {
          ctx.deleteBuffer(this.quad);
        }
        if (this.program) {
          ctx.deleteProgram(this.program);
        }
        const lose = ctx.getExtension("WEBGL_lose_context");
        if (lose) {
          lose.loseContext();
        }
      }
      this.mapCache.clear();
      this.pending.clear();
      this.gl = null;
      canvas.remove();
    };
  }

  initGL() {
    const gl = this.gl;
    if (!gl) {
      return;
    }
    const program = createProgram(gl);
    if (!program) {
      return;
    }
    this.program = program;
    const names = [
      "uRect",
      "uContainer",
      "uRectWH",
      "uRadius",
      "uChromaScale",
      "uAxis",
      "uSpecStrength",
      "uSpecularDark",
      "uTintColor",
      "uTintAmount",
      "uSrc",
      "uMap",
    ];
    this.uniforms.clear();
    for (const name of names) {
      this.uniforms.set(name, gl.getUniformLocation(program, name));
    }
    this.quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    this.srcTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.srcTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA,
      gl.ONE,
      gl.ONE_MINUS_SRC_ALPHA
    );
    gl.clearColor(0, 0, 0, 0);
    this.srcUploaded = false;
  }

  ensureMap(key, mp) {
    const existing = this.mapCache.get(key);
    if (existing) {
      return existing;
    }
    const entry = { texture: null, ready: false };
    this.mapCache.set(key, entry);
    if (this.mapCache.size > MAP_CACHE_LIMIT) {
      const first = this.mapCache.keys().next().value;
      if (first !== undefined && first !== key) {
        const old = this.mapCache.get(first);
        if (old?.texture && this.gl) {
          this.gl.deleteTexture(old.texture);
        }
        this.mapCache.delete(first);
      }
    }
    if (this.pending.has(key)) {
      return entry;
    }
    this.pending.add(key);
    const url = generateLensMap(mp);
    if (!url) {
      this.pending.delete(key);
      return entry;
    }
    const image = new Image();
    image.onload = () => {
      this.pending.delete(key);
      const gl = this.gl;
      const live = this.mapCache.get(key);
      if (!gl || this.disposed || !live) {
        return;
      }
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      live.texture = texture;
      live.ready = true;
    };
    image.onerror = () => {
      this.pending.delete(key);
    };
    image.src = url;
    return entry;
  }

  uploadSource(source, isVideo, supportsRVFC) {
    const gl = this.gl;
    if (!gl || !this.srcTexture) {
      return false;
    }
    let w = 0;
    let h = 0;
    if (source instanceof HTMLVideoElement) {
      if (source.readyState < source.HAVE_CURRENT_DATA) {
        return this.srcUploaded;
      }
      w = source.videoWidth;
      h = source.videoHeight;
    } else if (source instanceof HTMLImageElement) {
      w = source.naturalWidth;
      h = source.naturalHeight;
    } else {
      w = source.width;
      h = source.height;
    }
    if (w === 0 || h === 0) {
      return this.srcUploaded;
    }
    const needsUpload =
      !this.srcUploaded ||
      source instanceof HTMLCanvasElement ||
      (isVideo && (!supportsRVFC || this.frameReady)) ||
      (source instanceof HTMLImageElement &&
        (this.srcW !== w || this.srcH !== h));
    if (!needsUpload) {
      return true;
    }
    gl.bindTexture(gl.TEXTURE_2D, this.srcTexture);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    this.srcUploaded = true;
    this.srcW = w;
    this.srcH = h;
    this.frameReady = false;
    return true;
  }

  render(container, lensLayer, source, options, isVideo, supportsRVFC) {
    const gl = this.gl;
    const program = this.program;
    if (!gl || !program) {
      return;
    }
    const base = container.getBoundingClientRect();
    if (base.width < 2 || base.height < 2) {
      return;
    }
    const dpr = Math.min(
      typeof window === "undefined" ? 1 : window.devicePixelRatio || 1,
      DPR_CAP
    );
    const cw = Math.max(1, Math.round(base.width * dpr));
    const ch = Math.max(1, Math.round(base.height * dpr));
    if (gl.canvas.width !== cw || gl.canvas.height !== ch) {
      gl.canvas.width = cw;
      gl.canvas.height = ch;
    }
    gl.viewport(0, 0, cw, ch);
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (!this.uploadSource(source, isVideo, supportsRVFC)) {
      return;
    }

    const p = options.getParams();
    const dyn = options.getDynamics();
    const zoom = dyn?.zoom ?? 1;
    const depthMul = dyn?.depthMul ?? 1;
    const dispScale = Math.min(p.scaleMax * base.width * zoom, p.maxDisplacement);
    const tintColor = parseTintRGB(p.tintRGB);

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(this.uniforms.get("uContainer") ?? null, base.width, base.height);
    gl.uniform1i(this.uniforms.get("uSrc") ?? null, 0);
    gl.uniform1i(this.uniforms.get("uMap") ?? null, 1);
    gl.uniform1f(
      this.uniforms.get("uSpecStrength") ?? null,
      p.specularStrength
    );
    gl.uniform1f(
      this.uniforms.get("uSpecularDark") ?? null,
      p.specularDark ? 1 : 0
    );
    gl.uniform3f(
      this.uniforms.get("uTintColor") ?? null,
      tintColor[0],
      tintColor[1],
      tintColor[2]
    );
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.srcTexture);

    const marks = lensLayer.querySelectorAll("[data-glass-lens]");
    for (let i = 0; i < SLOTS; i++) {
      const mark = marks[i];
      if (!mark) {
        continue;
      }
      const r = mark.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) {
        continue;
      }
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
      const radiusParts = getComputedStyle(mark)
        .borderTopLeftRadius.split(" ")
        .map((v) => Math.round(Number.parseFloat(v) * 2) / 2 || 0);
      const cssRadius = radiusParts[0] ?? 0;
      const cssRadiusY = radiusParts[1] ?? cssRadius;
      const radius = md ? Math.round(md.radius * 2) / 2 : cssRadius;
      const unitsPerPx = md ? genW / Math.max(rectW, 1) : 1;
      const baseDepth = ov.depth ?? p.depth;
      const baseDome = ov.domeDepth ?? p.domeDepth;
      const baseEdgeW = ov.edgeWidth ?? p.edgeWidth;
      const effDepth = Math.round(baseDepth * depthMul * unitsPerPx * 10) / 10;
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
      const entry = this.ensureMap(key, {
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
      if (!entry.ready || !entry.texture) {
        continue;
      }
      const fx = Math.round((r.left - base.left) * 2) / 2;
      const fy = Math.round((r.top - base.top) * 2) / 2;
      const tintFade = 1 - 0.85 * tintEff;
      const axisX = p.kx * ov.mul * tintFade;
      const axisY = p.ky * ov.mul * tintFade;
      const c = p.chroma;
      const chromaR = c > 0 ? dispScale * (1 + 0.2 * c) : dispScale;
      const chromaG = c > 0 ? dispScale * (1 + 0.1 * c) : dispScale;
      gl.uniform4f(this.uniforms.get("uRect") ?? null, fx, fy, rectW, rectH);
      gl.uniform2f(this.uniforms.get("uRectWH") ?? null, rectW, rectH);
      gl.uniform2f(
        this.uniforms.get("uRadius") ?? null,
        Math.min(cssRadius, rectW / 2),
        Math.min(cssRadiusY, rectH / 2)
      );
      gl.uniform3f(
        this.uniforms.get("uChromaScale") ?? null,
        chromaR,
        chromaG,
        dispScale
      );
      gl.uniform2f(this.uniforms.get("uAxis") ?? null, axisX, axisY);
      gl.uniform1f(
        this.uniforms.get("uTintAmount") ?? null,
        Math.round(tintEff * 700) / 1000
      );
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, entry.texture);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  }
}

export { GlassWebGLRenderer, isRasterChild, webglAvailable };
