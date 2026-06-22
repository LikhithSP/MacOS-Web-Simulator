const VELOCITY_RESET_MS = 80;

class MotionValue {
  constructor(initial) {
    this.current = initial;
    this.prevTime = 0;
    this.velocityValue = 0;
    this.subs = new Set();
    this.cancelFn = null;
  }

  get() {
    return this.current;
  }

  getVelocity() {
    if (performance.now() - this.prevTime > VELOCITY_RESET_MS) {
      return 0;
    }
    return this.velocityValue;
  }

  set(next, timestamp = performance.now()) {
    const elapsed = timestamp - this.prevTime;
    if (elapsed > VELOCITY_RESET_MS) {
      this.velocityValue = 0;
    } else if (elapsed > 0) {
      const dt = Math.min(Math.max(elapsed, 8), 30);
      this.velocityValue = ((next - this.current) / dt) * 1000;
    }
    this.prevTime = timestamp;
    this.current = next;
    for (const fn of this.subs) {
      fn(next);
    }
  }

  jump(next) {
    this.stop();
    this.velocityValue = 0;
    this.prevTime = performance.now();
    this.current = next;
    for (const fn of this.subs) {
      fn(next);
    }
  }

  on(fn) {
    this.subs.add(fn);
    return () => this.subs.delete(fn);
  }

  setCancel(fn) {
    this.cancelFn = fn;
  }

  stop() {
    this.cancelFn?.();
    this.cancelFn = null;
  }
}

function cubicBezier(x1, y1, x2, y2) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t) => ((ay * t + by) * t + cy) * t;
  const sampleDX = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (x) => {
    if (x <= 0) {
      return 0;
    }
    if (x >= 1) {
      return 1;
    }
    let t = x;
    for (let i = 0; i < 8; i++) {
      const err = sampleX(t) - x;
      if (Math.abs(err) < 1e-6) {
        return sampleY(t);
      }
      const d = sampleDX(t);
      if (Math.abs(d) < 1e-6) {
        break;
      }
      t -= err / d;
    }
    let lo = 0;
    let hi = 1;
    t = x;
    while (hi - lo > 1e-6) {
      if (sampleX(t) < x) {
        lo = t;
      } else {
        hi = t;
      }
      t = (lo + hi) / 2;
    }
    return sampleY(t);
  };
}

const glassEase = cubicBezier(0.22, 1.15, 0.36, 1.06);

const PRESS_DURATION = 0.32;
const RELEASE_DURATION = 0.52;
const TRAVEL_DURATION = 0.6;

function tween(value, to, duration, ease, onComplete) {
  value.stop();
  if (duration <= 0) {
    value.jump(to);
    onComplete?.();
    return () => undefined;
  }
  const from = value.get();
  const start = performance.now();
  let raf = 0;
  const step = (now) => {
    const t = Math.min((now - start) / (duration * 1000), 1);
    value.set(from + (to - from) * ease(t), now);
    if (t < 1) {
      raf = requestAnimationFrame(step);
    } else {
      value.setCancel(null);
      onComplete?.();
    }
  };
  raf = requestAnimationFrame(step);
  const cancel = () => cancelAnimationFrame(raf);
  value.setCancel(cancel);
  return cancel;
}

class SpringDriver {
  constructor(value, options, getTarget, canRest = () => true) {
    this.value = value;
    this.options = options;
    this.getTarget = getTarget;
    this.canRest = canRest;
    this.vel = 0;
    this.raf = 0;
    this.last = 0;
    this.running = false;
    this.restDelta = options.restDelta ?? 5e-4;
    this.restSpeed = options.restSpeed ?? 0.005;
  }

  start() {
    if (this.running) {
      return;
    }
    this.value.stop();
    this.value.setCancel(() => this.stop());
    this.running = true;
    this.last = performance.now();
    const step = (now) => {
      if (!this.running) {
        return;
      }
      const dt = Math.min((now - this.last) / 1000, 0.033);
      this.last = now;
      const target = this.getTarget();
      const x = this.value.get();
      const accel =
        -this.options.stiffness * (x - target) - this.options.damping * this.vel;
      this.vel += accel * dt;
      const next = x + this.vel * dt;
      this.value.set(next, now);
      const settled =
        Math.abs(next - target) < this.restDelta &&
        Math.abs(this.vel) < this.restSpeed;
      if (settled && this.canRest()) {
        this.running = false;
        this.vel = 0;
        this.value.setCancel(null);
        this.value.set(target, now);
        return;
      }
      this.raf = requestAnimationFrame(step);
    };
    this.raf = requestAnimationFrame(step);
  }

  stop() {
    this.running = false;
    this.vel = 0;
    cancelAnimationFrame(this.raf);
  }
}

function rubberBand(distance, overshoot, dampening) {
  if (overshoot <= 0 || distance === 0) {
    return 0;
  }
  const range = overshoot * dampening;
  const t = Math.min(1, Math.abs(distance) / range);
  return Math.sign(distance) * overshoot * (1 - (1 - t) ** 3);
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export {
  cubicBezier,
  glassEase,
  MotionValue,
  PRESS_DURATION,
  prefersReducedMotion,
  RELEASE_DURATION,
  rubberBand,
  SpringDriver,
  TRAVEL_DURATION,
  tween,
};
