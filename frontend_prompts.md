## Integrate the <MicroSlats /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: MicroSlats
### Variant: JavaScript + CSS
### Dependencies: ogl

---

### Usage Example
```jsx
import MicroSlats from './MicroSlats';

<div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <MicroSlats
    preset="swell"
    color="#A855F7"
    glintColor="#ffffff"
    backgroundColor="#000000"
    slatWidth={10}
    slatHeight={25}
    gap={3}
    roundness={0.75}
    interactive
    cursorStrength={1}
    cursorSize={40}
    swirl={0}
    trail={1.4}
    lean={0}
    intro
  />
</div>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| preset | 'swell' | 'tide' | 'storm' | 'signal' | 'swell' | A starting look for the sea. Every wave prop below overrides the preset value when you pass it. Signal turns the field into a flat, equalizer style wall. |
| color | string | '#A855F7' | Color of the slats. |
| glintColor | string | '#ffffff' | Color the slats shift towards on wave crests and in the light the cursor leaves. |
| backgroundColor | string | '#000000' | Color behind the slats. Pass transparent to show the page through. |
| slatWidth | number | 10 | Width of one slat in CSS pixels. |
| slatHeight | number | 25 | Full height of one slat in CSS pixels. |
| gap | number | 3 | Space between slats in CSS pixels. |
| roundness | number | 0.75 | Corner rounding of each slat, from square at 0 to a full pill at 1. |
| scale | number | from preset | Size of the swell. Larger values give longer, calmer waves. |
| speed | number | from preset | How fast the waves roll. 0 freezes the sea while the cursor can still stir it. |
| direction | number | from preset | Heading of the swell in degrees. 270 rolls straight towards the viewer. |
| chop | number | from preset | Sharpens the crests and flattens the troughs, like wind on the water. |
| stretch | number | from preset | How much each slat grows and shrinks with the wave under it. 0 keeps every slat full length. |
| glint | number | from preset | Strength of the light caught on the crests. |
| contrast | number | from preset | Spread between dark troughs and bright crests. |
| perspective | number | from preset | How far the sea recedes towards a horizon above the top edge. 0 is a flat wall. |
| fog | number | from preset | Haze that fades the far rows into the background. |
| interactive | boolean | true | Lets the cursor stir the water. Moving it pushes a real fluid that bends the swell and carries a swirling trail of light, and a click spins out a splash. |
| cursorStrength | number | 1 | Brightness of the light the cursor leaves in the water. |
| cursorSize | number | 40 | Radius of the patch of water the cursor pushes, in CSS pixels. |
| swirl | number | 0 | How strongly the stirred water curls into eddies. |
| trail | number | 1.4 | How long the stirred water and its light linger, in seconds. |
| lean | number | 0 | How far the slats tilt with the current. 0 keeps them upright. |
| intro | boolean | true | Rolls the sea in from the horizon on mount, unfolding the slats row by row. |
| introDuration | number | 1.5 | Length of the intro in seconds. |
| paused | boolean | false | Freezes the waves. The cursor can still stir the water. |
| className | string | '' | Extra class names for the root element. |
| style | CSSProperties | - | Inline styles for the root element. |

### Full Component Source
```jsx
'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle, RenderTarget, Texture } from 'ogl';

import './MicroSlats.css';

const SWELL_PRESETS = {
  swell: {
    scale: 1.5,
    speed: 0.6,
    direction: 250,
    chop: 0.55,
    stretch: 0,
    glint: 0.7,
    contrast: 1.25,
    perspective: 0.55,
    fog: 0.55
  },
  tide: {
    scale: 1.3,
    speed: 0.5,
    direction: 262,
    chop: 0.2,
    stretch: 0.12,
    glint: 0.45,
    contrast: 1.1,
    perspective: 0.5,
    fog: 0.4
  },
  storm: {
    scale: 0.55,
    speed: 1.6,
    direction: 236,
    chop: 1,
    stretch: 0.3,
    glint: 1.3,
    contrast: 1.8,
    perspective: 0.8,
    fog: 0.35
  },
  signal: {
    scale: 0.85,
    speed: 1.2,
    direction: 180,
    chop: 0.6,
    stretch: 0.85,
    glint: 0.25,
    contrast: 1.2,
    perspective: 0,
    fog: 0
  }
};

const FLUID_SIZE = 96;
const PRESSURE_STEPS = 16;
const SPLAT_FORCE = 6900;
const SPLASH_JETS = 3;
const PIXEL_BUDGET = 4.5e6;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const parseColor = (value, fallback) => {
  try {
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) return fallback;
    ctx.fillStyle = '#000000';
    ctx.fillStyle = value;
    const resolved = ctx.fillStyle;
    if (resolved.startsWith('#')) {
      const n = parseInt(resolved.slice(1), 16);
      return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255, 1];
    }
    const parts = resolved.match(/[\d.]+/g);
    if (!parts || parts.length < 3) return fallback;
    return [Number(parts[0]) / 255, Number(parts[1]) / 255, Number(parts[2]) / 255, parts[3] ? Number(parts[3]) : 1];
  } catch {
    return fallback;
  }
};

const passVertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fluidVertex = `#version 300 es
in vec2 position;
uniform vec2 uTexel;
out vec2 vUv;
out vec2 vL;
out vec2 vR;
out vec2 vT;
out vec2 vB;
void main() {
  vUv = position * 0.5 + 0.5;
  vL = vUv - vec2(uTexel.x, 0.0);
  vR = vUv + vec2(uTexel.x, 0.0);
  vT = vUv + vec2(0.0, uTexel.y);
  vB = vUv - vec2(0.0, uTexel.y);
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fluidHead = `#version 300 es
precision highp float;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
out vec4 fragColor;
`;

const splatFragment = `${fluidHead}
uniform sampler2D uTarget;
uniform float uAspect;
uniform vec2 uPoint;
uniform vec3 uValue;
uniform float uRadius;
void main() {
  vec2 offset = vUv - uPoint;
  offset.x *= uAspect;
  float falloff = exp(-dot(offset, offset) / uRadius);
  fragColor = vec4(texture(uTarget, vUv).xyz + uValue * falloff, 1.0);
}
`;

const curlFragment = `${fluidHead}
uniform sampler2D uVelocity;
void main() {
  float left = texture(uVelocity, vL).y;
  float right = texture(uVelocity, vR).y;
  float top = texture(uVelocity, vT).x;
  float bottom = texture(uVelocity, vB).x;
  fragColor = vec4(0.5 * (right - left - top + bottom), 0.0, 0.0, 1.0);
}
`;

const vorticityFragment = `${fluidHead}
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float uSwirl;
uniform float uDt;
void main() {
  float left = texture(uCurl, vL).x;
  float right = texture(uCurl, vR).x;
  float top = texture(uCurl, vT).x;
  float bottom = texture(uCurl, vB).x;
  float middle = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(top) - abs(bottom), abs(right) - abs(left));
  force = force / (length(force) + 0.0001) * uSwirl * middle;
  force.y = -force.y;
  vec2 velocity = texture(uVelocity, vUv).xy + force * uDt;
  fragColor = vec4(clamp(velocity, -1000.0, 1000.0), 0.0, 1.0);
}
`;

const divergenceFragment = `${fluidHead}
uniform sampler2D uVelocity;
void main() {
  vec2 middle = texture(uVelocity, vUv).xy;
  float left = vL.x < 0.0 ? -middle.x : texture(uVelocity, vL).x;
  float right = vR.x > 1.0 ? -middle.x : texture(uVelocity, vR).x;
  float top = vT.y > 1.0 ? -middle.y : texture(uVelocity, vT).y;
  float bottom = vB.y < 0.0 ? -middle.y : texture(uVelocity, vB).y;
  fragColor = vec4(0.5 * (right - left + top - bottom), 0.0, 0.0, 1.0);
}
`;

const pressureFragment = `${fluidHead}
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
void main() {
  float left = texture(uPressure, vL).x;
  float right = texture(uPressure, vR).x;
  float top = texture(uPressure, vT).x;
  float bottom = texture(uPressure, vB).x;
  float divergence = texture(uDivergence, vUv).x;
  fragColor = vec4((left + right + top + bottom - divergence) * 0.25, 0.0, 0.0, 1.0);
}
`;

const projectFragment = `${fluidHead}
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
void main() {
  float left = texture(uPressure, vL).x;
  float right = texture(uPressure, vR).x;
  float top = texture(uPressure, vT).x;
  float bottom = texture(uPressure, vB).x;
  vec2 velocity = texture(uVelocity, vUv).xy - vec2(right - left, top - bottom);
  fragColor = vec4(velocity, 0.0, 1.0);
}
`;

const advectFragment = `${fluidHead}
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 uTexel;
uniform float uDt;
uniform float uFade;
void main() {
  vec2 from = vUv - uDt * texture(uVelocity, vUv).xy * uTexel;
  fragColor = texture(uSource, from) / (1.0 + uFade * uDt);
}
`;

const scaleFragment = `${fluidHead}
uniform sampler2D uSource;
uniform float uValue;
void main() {
  fragColor = texture(uSource, vUv) * uValue;
}
`;

const fieldFragment = `#version 300 es
precision highp float;
uniform vec2 uSize;
uniform vec4 uGrid;
uniform vec2 uOrigin;
uniform vec2 uSlat;
uniform float uTime;
uniform float uScale;
uniform float uDirection;
uniform float uChop;
uniform float uStretch;
uniform float uGlint;
uniform float uContrast;
uniform float uPerspective;
uniform float uFog;
uniform float uIntro;
uniform sampler2D tVelocity;
uniform sampler2D tInk;
uniform vec2 uFluidTexel;
uniform float uFluid;
uniform float uInk;
uniform float uLean;
out vec4 fragColor;

const float TURN[4] = float[4](0.0, -0.95, 0.78, 1.62);
const float LENGTH[4] = float[4](2.6, 1.7, 1.12, 0.76);
const float HEIGHT[4] = float[4](1.0, 0.75, 0.5, 0.3);
const float SHIFT[4] = float[4](0.0, 2.3, 4.1, 1.1);

void main() {
  vec2 cell = floor(gl_FragCoord.xy);
  float row = uGrid.y - 1.0 - cell.y;
  vec2 center = uOrigin + vec2(cell.x, row) * uGrid.zw + uSlat * 0.5;
  float v = clamp(center.y / uSize.y, 0.0, 1.0);

  vec2 flow = vec2(0.0);
  float ink = 0.0;
  if (uFluid > 0.5) {
    vec2 fluidUv = clamp(vec2(center.x / uSize.x, 1.0 - center.y / uSize.y), 0.0, 1.0);
    flow = texture(tVelocity, fluidUv).xy * uFluidTexel * uSize;
    ink = texture(tInk, fluidUv).x;
  }

  float horizon = mix(8.0, 0.5, uPerspective);
  float depth = (1.0 + horizon) / (v + horizon);
  vec2 world = vec2((center.x - uSize.x * 0.5) / uSize.y * depth, (depth - 1.0) * horizon * 2.2);
  world -= flow * 0.00018 * depth;
  world /= max(uScale, 0.05);

  float meander = 0.55 * sin(dot(world, vec2(0.23, 0.41)) * 0.9 + uTime * 0.13)
    + 0.3 * sin(dot(world, vec2(-0.37, 0.19)) * 1.4 - uTime * 0.09);

  float steep = uChop * 0.45;
  float height = 0.0;
  float total = 0.0;
  for (int i = 0; i < 4; i++) {
    float angle = uDirection + TURN[i];
    vec2 heading = vec2(cos(angle), sin(angle));
    float k = 6.2831853 / LENGTH[i];
    float omega = sqrt(9.81 * k) * 0.35;
    float theta = k * dot(world, heading) - omega * uTime + SHIFT[i] + meander * (0.6 + 0.3 * float(i));
    height += HEIGHT[i] * (cos(theta) + steep * cos(2.0 * theta));
    total += HEIGHT[i] * (1.0 + steep);
  }
  float level = clamp(0.5 + 0.5 * height / (total * 0.85), 0.0, 1.0);
  float crest = smoothstep(0.6, 1.0, level);
  float glint = crest * crest * uGlint;

  float haze = mix(1.0, 1.0 - uFog, pow(1.0 - v, 1.4));
  float light = (pow(level, uContrast) + glint * 0.8) * haze;
  float glow = 1.0 - exp(-max(ink, 0.0) * uInk * 1.6);
  light = 1.0 - (1.0 - clamp(light, 0.0, 1.0)) * (1.0 - glow);

  float front = uIntro * 1.35;
  float reveal = 1.0 - smoothstep(front - 0.35, front, v);
  float sweep = exp(-pow((v - front + 0.22) / 0.07, 2.0)) * (1.0 - uIntro);
  light = (light + sweep * 0.8) * reveal;
  light = max(light, 0.045 * reveal);
  float span = mix(1.0 - uStretch, 1.0, level) + glow * 0.3;
  span = clamp(span, 0.08, 1.0) * mix(0.1, 1.0, reveal);
  float tint = clamp(max(glint * 1.4, glow * 0.9) + sweep, 0.0, 1.0);
  float lean = clamp(flow.x / 1400.0, -1.0, 1.0) * uLean * reveal;

  fragColor = vec4(clamp(light, 0.0, 1.0), span, tint, 0.5 + 0.5 * lean);
}
`;

const slatFragment = `#version 300 es
precision highp float;
uniform sampler2D tField;
uniform vec2 uSize;
uniform float uDpr;
uniform vec4 uGrid;
uniform vec2 uOrigin;
uniform vec2 uSlat;
uniform float uRound;
uniform float uTilt;
uniform vec3 uColor;
uniform vec3 uGlintColor;
uniform vec4 uBackground;
out vec4 fragColor;

float pill(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uSize.y * uDpr - gl_FragCoord.y) / uDpr;
  vec2 local = p - uOrigin;
  vec2 cell = floor(local / uGrid.zw);
  vec4 background = vec4(uBackground.rgb * uBackground.a, uBackground.a);
  vec4 slat = vec4(0.0);
  int reach = uTilt > 0.0 ? 1 : 0;
  for (int dx = -1; dx <= 1; dx++) {
    if (abs(dx) > reach) continue;
    vec2 neighbour = cell + vec2(float(dx), 0.0);
    if (neighbour.x < 0.0 || neighbour.y < 0.0 || neighbour.x >= uGrid.x || neighbour.y >= uGrid.y) continue;
    vec4 field = texelFetch(tField, ivec2(int(neighbour.x), int(uGrid.y - 1.0 - neighbour.y)), 0);
    vec2 offset = local - neighbour * uGrid.zw - uSlat * 0.5;
    float angle = (field.a - 0.5) * 2.0 * uTilt;
    float c = cos(angle);
    float s = sin(angle);
    vec2 turned = vec2(c * offset.x + s * offset.y, c * offset.y - s * offset.x);
    vec2 halfSize = vec2(uSlat.x * 0.5, uSlat.y * 0.5 * field.g);
    float radius = uRound * min(halfSize.x, halfSize.y);
    float alpha = clamp(0.5 - pill(turned, halfSize, radius) * uDpr, 0.0, 1.0) * field.r;
    if (alpha > slat.a) slat = vec4(mix(uColor, uGlintColor, field.b) * alpha, alpha);
  }
  fragColor = slat + background * (1.0 - slat.a);
}
`;

const MicroSlats = ({
  preset = 'swell',
  color = '#A855F7',
  glintColor = '#ffffff',
  backgroundColor = '#000000',
  slatWidth = 10,
  slatHeight = 25,
  gap = 3,
  roundness = 0.75,
  scale,
  speed,
  direction,
  chop,
  stretch,
  glint,
  contrast,
  perspective,
  fog,
  interactive = true,
  cursorStrength = 1,
  cursorSize = 40,
  swirl = 0,
  trail = 1.4,
  lean = 0,
  intro = true,
  introDuration = 1.5,
  paused = false,
  className = '',
  style
}) => {
  const containerRef = useRef(null);
  const settingsRef = useRef(null);
  const wakeRef = useRef(null);

  const base = SWELL_PRESETS[preset] || SWELL_PRESETS.swell;
  const pick = (value, key) => (value === undefined || value === null ? base[key] : value);

  const colors = useMemo(
    () => ({
      color: parseColor(color, [0.66, 0.33, 0.97, 1]),
      glintColor: parseColor(glintColor, [1, 1, 1, 1]),
      backgroundColor: parseColor(backgroundColor, [0, 0, 0, 1])
    }),
    [color, glintColor, backgroundColor]
  );

  useEffect(() => {
    settingsRef.current = {
      ...colors,
      slatWidth,
      slatHeight,
      gap,
      roundness,
      scale: pick(scale, 'scale'),
      speed: pick(speed, 'speed'),
      direction: pick(direction, 'direction'),
      chop: pick(chop, 'chop'),
      stretch: pick(stretch, 'stretch'),
      glint: pick(glint, 'glint'),
      contrast: pick(contrast, 'contrast'),
      perspective: pick(perspective, 'perspective'),
      fog: pick(fog, 'fog'),
      interactive,
      cursorStrength,
      cursorSize,
      swirl,
      trail,
      lean,
      intro,
      introDuration,
      paused
    };
    wakeRef.current?.();
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: false, depth: false });
    const gl = renderer.gl;
    if (!renderer.isWebgl2) {
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return undefined;
    }
    gl.clearColor(0, 0, 0, 0);
    const canvas = gl.canvas;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.setAttribute('aria-hidden', 'true');
    container.appendChild(canvas);

    const geometry = new Triangle(gl);
    const blank = new Texture(gl);
    const floatTargets = !!(
      gl.getExtension('EXT_color_buffer_float') || gl.getExtension('EXT_color_buffer_half_float')
    );

    const dispose = target => {
      gl.deleteFramebuffer(target.buffer);
      gl.deleteTexture(target.texture.texture);
    };

    let fieldTarget = new RenderTarget(gl, {
      width: 1,
      height: 1,
      depth: false,
      minFilter: gl.NEAREST,
      magFilter: gl.NEAREST
    });

    const fieldUniforms = {
      uSize: { value: [1, 1] },
      uGrid: { value: [1, 1, 1, 1] },
      uOrigin: { value: [0, 0] },
      uSlat: { value: [1, 1] },
      uTime: { value: 0 },
      uScale: { value: 1 },
      uDirection: { value: 0 },
      uChop: { value: 0.5 },
      uStretch: { value: 0.3 },
      uGlint: { value: 1 },
      uContrast: { value: 1 },
      uPerspective: { value: 0.7 },
      uFog: { value: 0.5 },
      uIntro: { value: 0 },
      tVelocity: { value: blank },
      tInk: { value: blank },
      uFluidTexel: { value: [1, 1] },
      uFluid: { value: 0 },
      uInk: { value: 1 },
      uLean: { value: 0.5 }
    };
    const fieldMesh = new Mesh(gl, {
      geometry,
      program: new Program(gl, {
        vertex: passVertex,
        fragment: fieldFragment,
        uniforms: fieldUniforms,
        depthTest: false,
        depthWrite: false
      })
    });

    const slatUniforms = {
      tField: { value: fieldTarget.texture },
      uSize: { value: [1, 1] },
      uDpr: { value: 1 },
      uGrid: { value: [1, 1, 1, 1] },
      uOrigin: { value: [0, 0] },
      uSlat: { value: [1, 1] },
      uRound: { value: 1 },
      uTilt: { value: 0 },
      uColor: { value: [1, 1, 1] },
      uGlintColor: { value: [1, 1, 1] },
      uBackground: { value: [0, 0, 0, 1] }
    };
    const slatMesh = new Mesh(gl, {
      geometry,
      program: new Program(gl, {
        vertex: passVertex,
        fragment: slatFragment,
        uniforms: slatUniforms,
        depthTest: false,
        depthWrite: false
      })
    });

    const fluidTexel = { value: [1, 1] };
    const fluidPass = (fragment, uniforms) =>
      new Mesh(gl, {
        geometry,
        program: new Program(gl, {
          vertex: fluidVertex,
          fragment,
          uniforms: { uTexel: fluidTexel, ...uniforms },
          depthTest: false,
          depthWrite: false
        })
      });
    const splatPass = fluidPass(splatFragment, {
      uTarget: { value: blank },
      uAspect: { value: 1 },
      uPoint: { value: [0, 0] },
      uValue: { value: [0, 0, 0] },
      uRadius: { value: 0.01 }
    });
    const curlPass = fluidPass(curlFragment, { uVelocity: { value: blank } });
    const vorticityPass = fluidPass(vorticityFragment, {
      uVelocity: { value: blank },
      uCurl: { value: blank },
      uSwirl: { value: 20 },
      uDt: { value: 0.016 }
    });
    const divergencePass = fluidPass(divergenceFragment, { uVelocity: { value: blank } });
    const pressurePass = fluidPass(pressureFragment, { uPressure: { value: blank }, uDivergence: { value: blank } });
    const projectPass = fluidPass(projectFragment, { uPressure: { value: blank }, uVelocity: { value: blank } });
    const advectPass = fluidPass(advectFragment, {
      uVelocity: { value: blank },
      uSource: { value: blank },
      uDt: { value: 0.016 },
      uFade: { value: 1 }
    });
    const scalePass = fluidPass(scaleFragment, { uSource: { value: blank }, uValue: { value: 0 } });

    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    let width = 1;
    let height = 1;
    let raf = 0;
    let last = performance.now();
    let time = 0;
    let introClock = 0;
    let visible = true;
    let alive = true;
    let fluid = null;
    let fluidUntil = 0;
    let fluidDirty = false;
    let splashTurn = 0;
    const splats = [];
    const pointer = { x: 0, y: 0, tracked: false };

    const run = (mesh, target) => renderer.render({ scene: mesh, target, clear: false });

    const floatTarget = (w, h) =>
      new RenderTarget(gl, {
        width: w,
        height: h,
        depth: false,
        type: gl.HALF_FLOAT,
        format: gl.RGBA,
        internalFormat: gl.RGBA16F,
        minFilter: gl.LINEAR,
        magFilter: gl.LINEAR
      });

    const swapPair = (w, h) => ({
      read: floatTarget(w, h),
      write: floatTarget(w, h),
      swap() {
        const next = this.read;
        this.read = this.write;
        this.write = next;
      }
    });

    const disposeFluid = () => {
      if (!fluid) return;
      [fluid.velocity, fluid.ink, fluid.pressure].forEach(pair => {
        dispose(pair.read);
        dispose(pair.write);
      });
      dispose(fluid.divergence);
      dispose(fluid.curl);
      fluid = null;
    };

    const buildFluid = () => {
      if (!floatTargets) return;
      const aspect = width / height;
      const w = Math.max(8, Math.round(aspect >= 1 ? FLUID_SIZE * aspect : FLUID_SIZE));
      const h = Math.max(8, Math.round(aspect >= 1 ? FLUID_SIZE : FLUID_SIZE / aspect));
      if (fluid && fluid.width === w && fluid.height === h) return;
      disposeFluid();
      fluid = {
        width: w,
        height: h,
        velocity: swapPair(w, h),
        ink: swapPair(w, h),
        pressure: swapPair(w, h),
        divergence: floatTarget(w, h),
        curl: floatTarget(w, h)
      };
      fluidTexel.value = [1 / w, 1 / h];
    };

    const resize = () => {
      width = Math.max(1, container.clientWidth);
      height = Math.max(1, container.clientHeight);
      renderer.dpr = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(PIXEL_BUDGET / (width * height)));
      renderer.setSize(width, height);
      buildFluid();
      start();
    };

    const layout = s => {
      const slatW = clamp(s.slatWidth, 1, 64);
      const slatH = clamp(s.slatHeight, 2, 240);
      const gapSize = clamp(s.gap, 0, 64);
      const pitchX = slatW + gapSize;
      const pitchY = slatH + gapSize;
      const cols = Math.min(2048, Math.ceil((width + gapSize) / pitchX) + 1);
      const rows = Math.min(2048, Math.ceil((height + gapSize) / pitchY) + 1);
      const originX = (width - (cols * pitchX - gapSize)) / 2;
      const originY = (height - (rows * pitchY - gapSize)) / 2;
      if (fieldTarget.width !== cols || fieldTarget.height !== rows) {
        dispose(fieldTarget);
        fieldTarget = new RenderTarget(gl, {
          width: cols,
          height: rows,
          depth: false,
          minFilter: gl.NEAREST,
          magFilter: gl.NEAREST
        });
        slatUniforms.tField.value = fieldTarget.texture;
      }
      const tilt = Math.min(0.42, Math.asin(clamp((pitchX * 1.5 - slatW * 0.5) / (slatH * 0.5), 0, 1)));
      return { slatW, slatH, tilt, grid: [cols, rows, pitchX, pitchY], origin: [originX, originY] };
    };

    const splat = (pair, point, value, radius) => {
      const u = splatPass.program.uniforms;
      u.uTarget.value = pair.read.texture;
      u.uAspect.value = width / height;
      u.uPoint.value = point;
      u.uValue.value = value;
      u.uRadius.value = radius;
      run(splatPass, pair.write);
      pair.swap();
    };

    const stepFluid = (f, dt, s) => {
      if (s.swirl > 0) {
        curlPass.program.uniforms.uVelocity.value = f.velocity.read.texture;
        run(curlPass, f.curl);

        const vorticity = vorticityPass.program.uniforms;
        vorticity.uVelocity.value = f.velocity.read.texture;
        vorticity.uCurl.value = f.curl.texture;
        vorticity.uSwirl.value = clamp(s.swirl, 0, 2) * 40;
        vorticity.uDt.value = dt;
        run(vorticityPass, f.velocity.write);
        f.velocity.swap();
      }

      divergencePass.program.uniforms.uVelocity.value = f.velocity.read.texture;
      run(divergencePass, f.divergence);

      scalePass.program.uniforms.uSource.value = f.pressure.read.texture;
      scalePass.program.uniforms.uValue.value = 0.8;
      run(scalePass, f.pressure.write);
      f.pressure.swap();

      pressurePass.program.uniforms.uDivergence.value = f.divergence.texture;
      for (let i = 0; i < PRESSURE_STEPS; i++) {
        pressurePass.program.uniforms.uPressure.value = f.pressure.read.texture;
        run(pressurePass, f.pressure.write);
        f.pressure.swap();
      }

      projectPass.program.uniforms.uPressure.value = f.pressure.read.texture;
      projectPass.program.uniforms.uVelocity.value = f.velocity.read.texture;
      run(projectPass, f.velocity.write);
      f.velocity.swap();

      const fade = 1 / clamp(s.trail, 0.1, 10);
      const advect = advectPass.program.uniforms;
      advect.uDt.value = dt;
      advect.uVelocity.value = f.velocity.read.texture;
      advect.uSource.value = f.velocity.read.texture;
      advect.uFade.value = fade * 1.4;
      run(advectPass, f.velocity.write);
      f.velocity.swap();

      advect.uVelocity.value = f.velocity.read.texture;
      advect.uSource.value = f.ink.read.texture;
      advect.uFade.value = fade;
      run(advectPass, f.ink.write);
      f.ink.swap();
    };

    const clearFluid = f => {
      scalePass.program.uniforms.uValue.value = 0;
      [f.velocity, f.ink, f.pressure].forEach(pair => {
        scalePass.program.uniforms.uSource.value = pair.read.texture;
        run(scalePass, pair.write);
        pair.swap();
      });
    };

    const frame = now => {
      raf = 0;
      if (!alive) return;
      const s = settingsRef.current;
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      if (!s) return;

      if (!s.paused && !reducedMotion) time += dt * s.speed;
      introClock = s.intro && !reducedMotion ? introClock + dt / Math.max(0.2, s.introDuration) : 1;
      const introLinear = Math.min(introClock, 1);
      const introEase =
        introLinear < 0.5 ? 4 * introLinear * introLinear * introLinear : 1 - Math.pow(-2 * introLinear + 2, 3) / 2;

      if (fluid && splats.length) {
        const radius = Math.pow(clamp(s.cursorSize, 4, 600) / height, 2) * 0.35;
        const aspect = width / height;
        for (const [u, v, du, dv, turn] of splats) {
          if (turn === null) {
            splat(fluid.velocity, [u, v], [du * SPLAT_FORCE, dv * SPLAT_FORCE, 0], radius);
            splat(fluid.ink, [u, v], [0.13, 0, 0], radius);
            continue;
          }
          const jet = radius * 0.55;
          const reach = Math.sqrt(jet * 0.5) * 1.9;
          const push = SPLAT_FORCE * 0.08;
          for (let i = 0; i < SPLASH_JETS; i++) {
            const angle = turn + (i / SPLASH_JETS) * Math.PI * 2;
            const dx = Math.cos(angle);
            const dy = Math.sin(angle);
            const point = [u + (dx * reach) / aspect, v + dy * reach];
            const spin = [(dx - dy) * Math.SQRT1_2 * push, (dy + dx) * Math.SQRT1_2 * push, 0];
            splat(fluid.velocity, point, spin, jet);
            splat(fluid.ink, point, [0.75, 0, 0], jet);
          }
          splat(fluid.ink, [u, v], [0.45, 0, 0], radius);
        }
        splats.length = 0;
        fluidDirty = true;
      }
      const fluidActive = fluid !== null && now < fluidUntil;
      if (fluid) {
        if (fluidActive) stepFluid(fluid, Math.min(Math.max(dt, 1 / 240), 1 / 30), s);
        else if (fluidDirty) {
          clearFluid(fluid);
          fluidDirty = false;
        }
      }

      const grid = layout(s);

      fieldUniforms.uSize.value = [width, height];
      fieldUniforms.uGrid.value = grid.grid;
      fieldUniforms.uOrigin.value = grid.origin;
      fieldUniforms.uSlat.value = [grid.slatW, grid.slatH];
      fieldUniforms.uTime.value = time;
      fieldUniforms.uScale.value = s.scale;
      fieldUniforms.uDirection.value = (s.direction * Math.PI) / 180;
      fieldUniforms.uChop.value = clamp(s.chop, 0, 1.5);
      fieldUniforms.uStretch.value = clamp(s.stretch, 0, 0.95);
      fieldUniforms.uGlint.value = Math.max(0, s.glint);
      fieldUniforms.uContrast.value = clamp(s.contrast, 0.2, 4);
      fieldUniforms.uPerspective.value = clamp(s.perspective, 0, 1);
      fieldUniforms.uFog.value = clamp(s.fog, 0, 1);
      fieldUniforms.uIntro.value = introEase;
      fieldUniforms.uFluid.value = fluidActive ? 1 : 0;
      fieldUniforms.tVelocity.value = fluid ? fluid.velocity.read.texture : blank;
      fieldUniforms.tInk.value = fluid ? fluid.ink.read.texture : blank;
      fieldUniforms.uFluidTexel.value = fluidTexel.value;
      fieldUniforms.uInk.value = clamp(s.cursorStrength, 0, 3);
      fieldUniforms.uLean.value = clamp(s.lean, 0, 1);
      renderer.render({ scene: fieldMesh, target: fieldTarget });

      slatUniforms.uSize.value = [width, height];
      slatUniforms.uDpr.value = renderer.dpr;
      slatUniforms.uGrid.value = grid.grid;
      slatUniforms.uOrigin.value = grid.origin;
      slatUniforms.uSlat.value = [grid.slatW, grid.slatH];
      slatUniforms.uRound.value = clamp(s.roundness, 0, 1);
      slatUniforms.uTilt.value = fluidActive && s.lean > 0 ? grid.tilt : 0;
      slatUniforms.uColor.value = s.color.slice(0, 3);
      slatUniforms.uGlintColor.value = s.glintColor.slice(0, 3);
      slatUniforms.uBackground.value = s.backgroundColor;
      renderer.render({ scene: slatMesh });

      const moving = (!s.paused && !reducedMotion && s.speed !== 0) || introClock < 1;
      if (visible && (moving || fluidActive || fluidDirty)) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (raf || !visible || !alive) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const locate = e => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const w = Math.max(1, rect.width);
      const h = Math.max(1, rect.height);
      return { x, y, u: x / w, v: 1 - y / h, h, inside: x >= 0 && y >= 0 && x <= w && y <= h };
    };

    const queue = (u, v, du, dv, turn) => {
      if (splats.length > 32) splats.shift();
      splats.push([u, v, du, dv, turn]);
      const s = settingsRef.current;
      fluidUntil = performance.now() + Math.max(1.5, (s ? s.trail : 1.4) * 5) * 1000;
      start();
    };

    const onPointerMove = e => {
      const s = settingsRef.current;
      const spot = locate(e);
      if (!fluid || !s || !s.interactive || reducedMotion || !spot.inside) {
        pointer.tracked = false;
        return;
      }
      if (pointer.tracked && (spot.x !== pointer.x || spot.y !== pointer.y)) {
        queue(spot.u, spot.v, (spot.x - pointer.x) / spot.h, (pointer.y - spot.y) / spot.h, null);
      }
      pointer.x = spot.x;
      pointer.y = spot.y;
      pointer.tracked = true;
    };

    const onPointerDown = e => {
      const s = settingsRef.current;
      const spot = locate(e);
      if (!fluid || !s || !s.interactive || reducedMotion || !spot.inside) return;
      splashTurn += 2.39996;
      queue(spot.u, spot.v, 0, 0, splashTurn);
    };

    const onPointerLeave = () => {
      pointer.tracked = false;
    };

    const onPointerOut = e => {
      if (!e.relatedTarget) onPointerLeave();
    };

    const onVisibility = () => {
      if (!document.hidden) start();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerout', onPointerOut, { passive: true });
    window.addEventListener('blur', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibility);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    intersectionObserver.observe(container);

    wakeRef.current = start;
    resize();

    return () => {
      alive = false;
      visible = false;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerout', onPointerOut);
      window.removeEventListener('blur', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      wakeRef.current = null;
      disposeFluid();
      dispose(fieldTarget);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, []);

  return <div ref={containerRef} className={`micro-slats ${className}`.trim()} style={style} />;
};

export default MicroSlats;

```

### Component CSS
```css
.micro-slats {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.



## Integrate the <SquishSwitch /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: SquishSwitch
### Variant: JavaScript + CSS
### Dependencies: motion

---

### Usage Example
```jsx
import { useState } from 'react';
import SquishSwitch from './SquishSwitch';

const [airplane, setAirplane] = useState(false);

<SquishSwitch
  checked={airplane}
  onChange={setAirplane}
  label="Airplane mode"
  trackColor="#27272a"
  trackOnColor="#f5f5f5"
  width={76}
  height={38}
  radius={19}
  speed={50}
  stretch={36}
  hoverScale={1.035}
  colorDuration={320}
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| checked | boolean | undefined | Controlled state. Leave it out to let the switch keep its own. |
| defaultChecked | boolean | false | Initial state when uncontrolled. |
| onChange | (checked: boolean) => void | - | A tap, a drag past the middle, or a key. |
| label | string | "" | A label beside the switch, wired to it. |
| disabled | boolean | false | Dimmed and inert. |
| trackColor | string | "#27272a" | The track while off. |
| trackOnColor | string | "#f5f5f5" | The track while on. |
| thumbColor | string | "" | The thumb while off. Empty mixes the on colour faintly into the track. |
| thumbOnColor | string | "" | The thumb while on. Empty uses the off track colour. |
| width | number | 76 | Track width in px. |
| height | number | 38 | Track height in px. The thumb and its inset follow. |
| radius | number | 19 | Track corner radius in px, capped at half the height. |
| speed | number | 50 | Stiffness of the settle spring, 0 to 100. Low is lazy, high is snappy. |
| stretch | number | 36 | How much the thumb lengthens with speed, 0 to 100. It narrows to keep its area. |
| hoverScale | number | 1.035 | The thumb swells to this on hover. |
| colorDuration | number | 320 | The colour cross-fade, in ms. |
| ariaLabel | string | - | Accessible name when there is no label. |
| className | string | "" | Extra classes for the root element. |
| id | string | - | Id for the switch button; the label uses it. |

### Full Component Source
```jsx
'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform, useVelocity } from 'motion/react';
import './SquishSwitch.css';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const FLOW_SPRING = { stiffness: 320, damping: 40, mass: 0.6 };
const SWELL_SPRING = { stiffness: 520, damping: 34, mass: 0.6 };
const MAX_STRETCH = 0.4;
const STRETCH_SPEED = 600;
const TAP_SLOP = { fine: 4, coarse: 8 };

export default function SquishSwitch({
  checked,
  defaultChecked = false,
  onChange,
  label = '',
  disabled = false,
  trackColor = '#27272a',
  trackOnColor = '#f5f5f5',
  thumbColor = '',
  thumbOnColor = '',
  width = 76,
  height = 38,
  radius = 19,
  speed = 50,
  stretch = 36,
  hoverScale = 1.035,
  colorDuration = 320,
  ariaLabel,
  className = '',
  id
}) {
  const reduce = useReducedMotion();
  const inset = Math.max(3, Math.round(height * 0.11));
  const thumb = height - inset * 2;
  const min = inset;
  const max = width - inset - thumb;
  const mid = (min + max) / 2;
  const trackRadius = Math.min(radius, height / 2);
  const thumbRadius = Math.max(2, trackRadius - inset);

  const isControlled = checked !== undefined;
  const [inner, setInner] = useState(defaultChecked);
  const on = isControlled ? checked : inner;
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef(null);
  const grip = useRef(null);
  const onRef = useRef(on);
  onRef.current = on;
  const skipClick = useRef(false);
  const autoId = useId();
  const buttonId = id ?? autoId;

  const x = useMotionValue(on ? max : min);
  const flow = useSpring(useVelocity(x), FLOW_SPRING);
  const swell = useSpring(1, SWELL_SPRING);
  const gain = reduce ? 0 : clamp(stretch, 0, 100) / 100;
  const stretchOf = v => 1 + Math.min(MAX_STRETCH, Math.abs(v) / STRETCH_SPEED) * gain;
  const scaleX = useTransform([flow, swell], ([v, h]) => stretchOf(v) * h);
  const scaleY = useTransform([flow, swell], ([v, h]) => h / stretchOf(v));

  const commit = next => {
    if (next === onRef.current) return;
    onRef.current = next;
    if (!isControlled) setInner(next);
    onChange?.(next);
  };

  useEffect(() => {
    if (dragging) return undefined;
    const target = on ? max : min;
    if (reduce) {
      x.jump(target);
      return undefined;
    }
    const controls = animate(x, target, {
      type: 'spring',
      stiffness: 170 - (50 - clamp(speed, 0, 100)) * 1.1,
      damping: 21.5,
      mass: 0.9,
      restDelta: 0.001,
      restSpeed: 0.01
    });
    return () => controls.stop();
  }, [on, dragging, min, max, speed, reduce, x]);

  const localX = clientX => {
    const el = trackRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const scale = rect.width / (el.offsetWidth || rect.width) || 1;
    return (clientX - rect.left) / scale;
  };
  const down = e => {
    if (disabled || grip.current || e.button !== 0) return;
    grip.current = {
      id: e.pointerId,
      grab: null,
      moved: false,
      startX: e.clientX,
      onAtPress: onRef.current,
      slop: e.pointerType === 'touch' ? TAP_SLOP.coarse : TAP_SLOP.fine
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    setDragging(true);
  };
  const move = e => {
    const g = grip.current;
    if (!g || g.id !== e.pointerId) return;
    const lx = localX(e.clientX);
    if (g.grab === null) {
      g.grab = lx - x.get();
      return;
    }
    if (!g.moved && Math.abs(e.clientX - g.startX) > g.slop) g.moved = true;
    if (!g.moved) return;
    const nx = clamp(lx - g.grab, min, max);
    x.set(nx);
    commit(nx > mid);
  };
  const up = (e, cancelled) => {
    const g = grip.current;
    if (!g || g.id !== e.pointerId) return;
    grip.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    if (cancelled) commit(g.onAtPress);
    else if (!g.moved) commit(!onRef.current);
    skipClick.current = true;
    setTimeout(() => {
      skipClick.current = false;
    }, 0);
    setDragging(false);
  };
  const click = () => {
    if (skipClick.current) {
      skipClick.current = false;
      return;
    }
    if (!disabled) commit(!onRef.current);
  };

  return (
    <span className={`squish-switch-root${className ? ` ${className}` : ''}`}>
      <button
        id={buttonId}
        type="button"
        role="switch"
        aria-checked={on}
        aria-disabled={disabled || undefined}
        aria-label={ariaLabel}
        className="squish-switch"
        data-on={on ? '' : undefined}
        data-held={dragging ? '' : undefined}
        style={{
          '--ss-w': `${width}px`,
          '--ss-h': `${height}px`,
          '--ss-inset': `${inset}px`,
          '--ss-thumb': `${thumb}px`,
          '--ss-r': `${trackRadius}px`,
          '--ss-thumb-r': `${thumbRadius}px`,
          '--ss-track': trackColor,
          '--ss-track-on': trackOnColor,
          '--ss-thumb-color': thumbColor || `color-mix(in srgb, ${trackOnColor} 19%, ${trackColor})`,
          '--ss-thumb-on': thumbOnColor || trackColor,
          '--ss-fade': `${colorDuration}ms`
        }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={e => up(e, false)}
        onPointerCancel={e => up(e, true)}
        onPointerEnter={e => {
          if (e.pointerType === 'mouse' && !disabled) swell.set(hoverScale);
        }}
        onPointerLeave={() => swell.set(1)}
        onKeyDown={e => {
          if (e.key === 'Escape' && grip.current)
            up({ pointerId: grip.current.id, currentTarget: e.currentTarget }, true);
        }}
        onClick={click}
      >
        <span ref={trackRef} className="squish-switch__track">
          <motion.span className="squish-switch__thumb" aria-hidden="true" style={{ x, scaleX, scaleY }} />
        </span>
      </button>
      {label ? (
        <label htmlFor={buttonId} className="squish-switch__label">
          {label}
        </label>
      ) : null}
    </span>
  );
}

```

### Component CSS
```css
.squish-switch-root {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.squish-switch {
  --ss-w: 76px;
  --ss-h: 38px;
  --ss-inset: 4px;
  --ss-thumb: 30px;
  --ss-r: 19px;
  --ss-thumb-r: 15px;
  --ss-track: #27272a;
  --ss-track-on: #f5f5f5;
  --ss-thumb-color: #4e4e51;
  --ss-thumb-on: #27272a;
  --ss-fade: 320ms;

  position: relative;
  display: inline-block;
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  outline: none;
  touch-action: pan-y;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
}

.squish-switch::after {
  content: '';
  position: absolute;
  inset: -8px;
}

.squish-switch[data-held] {
  cursor: grabbing;
}

.squish-switch[aria-disabled='true'] {
  cursor: not-allowed;
  opacity: 0.5;
}

.squish-switch__track {
  position: relative;
  display: block;
  width: var(--ss-w);
  height: var(--ss-h);
  border-radius: var(--ss-r);
  background: var(--ss-track);
  transition: background-color var(--ss-fade) ease;
}

.squish-switch[data-on] .squish-switch__track {
  background: var(--ss-track-on);
}

.squish-switch__thumb {
  position: absolute;
  top: var(--ss-inset);
  left: 0;
  width: var(--ss-thumb);
  height: var(--ss-thumb);
  border-radius: var(--ss-thumb-r);
  background: var(--ss-thumb-color);
  transition: background-color var(--ss-fade) ease;
}

.squish-switch[data-on] .squish-switch__thumb {
  background: var(--ss-thumb-on);
}

.squish-switch__label {
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
}

@media (prefers-reduced-motion: reduce) {
  .squish-switch__track,
  .squish-switch__thumb {
    transition-duration: 1ms;
  }
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.


## Integrate the <Scanner /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: Scanner
### Variant: JavaScript + CSS


---

### Usage Example
```jsx
import Scanner from './Scanner';

<div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <Scanner
    color1="#5227FF"
    color2="#FF9FFC"
    color3="#FFFFFF"
    speed={0.5}
    sweepSpeed={0.25}
    sweepWidth={1.6}
    trail={0.5}
    ripple={0.22}
    bandDensity={11}
    glow={0.6}
    scanDirection="vertical"
    colorSpread={0.7}
    scanline
    scanlineIntensity={0.5}
    mouseInteraction
    clickEffect="ping"
  />
</div>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| color1 | string | '#5227FF' | Color of the resting lines. |
| color2 | string | '#FF9FFC' | Color the lines take as the scan lights them. |
| color3 | string | '#FFFFFF' | Color of the hot scan head itself. |
| speed | number | 0.5 | How fast the wave moves through the lines. |
| sweepSpeed | number | 0.25 | How fast the scan travels across. |
| sweepWidth | number | 1.6 | Distance between one scan and the next. Larger values leave longer dark gaps. |
| trail | number | 0.5 | Length of the afterglow the scan leaves behind, from 0 to 1. |
| reverse | boolean | false | Runs the scan in the opposite direction. |
| scale | number | 1.5 | Zooms the whole pattern in or out. |
| frequency | number | 2 | How many waves fit across the field. |
| ripple | number | 0.22 | How tall the waves are. 0 keeps the lines straight. |
| bandDensity | number | 11 | How many lines fill the field. |
| lineWidth | number | 1.2 | Width of the resting lines, in px. Lit lines get thicker. |
| glow | number | 0.6 | Soft glow around the lit lines. |
| scanDirection | 'vertical' | 'horizontal' | 'diagonal' | 'vertical' | Direction the scan travels in. The lines run across it. |
| colorSpread | number | 0.7 | Fine color fringes on the edges of lit lines, from 0 to 1. |
| brightness | number | 1 | Overall brightness of the lines. |
| vignette | number | 0.3 | Fades the lines out toward the edges, from 0 to 1. |
| scanline | boolean | true | Turns on the CRT look: fine horizontal scanlines across the field. |
| scanlineIntensity | number | 0.5 | How dark the scanlines are, from 0 to 1. |
| grain | boolean | true | Adds a little film grain. |
| grainIntensity | number | 0.04 | Strength of the grain. |
| opacity | number | 1 | Overall opacity of the effect. |
| mouseInteraction | boolean | true | The lines bend around the cursor and light up near it. |
| mouseMode | 'repel' | 'attract' | 'repel' | Lines part around the cursor, or pinch in toward it. |
| mouseRadius | number | 0.5 | Size of the area around the cursor. |
| mouseStrength | number | 0.7 | How strongly the cursor bends the lines. |
| clickEffect | 'ping' | 'none' | 'ping' | Clicking sends a ring of light rippling out through the lines. |
| intro | boolean | true | The lines power on with a first scan on mount. |
| lightMode | boolean | false | Draws the lines as crisp ink for light backgrounds instead of glowing light. |
| dpr | number | auto | Maximum device pixel ratio, capped at 2. |
| className | string | '' | Extra class names for the container. |
| style | CSSProperties | - | Inline styles for the container. |

### Full Component Source
```jsx
'use client';

import { useEffect, useRef } from 'react';
import './Scanner.css';

const MAX_PINGS = 6;
const INTRO_SECONDS = 2;
const DIRECTIONS = { vertical: 0, horizontal: 1, diagonal: 2 };

const VERTEX = `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAGMENT = `#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform float uWave;
uniform float uSweep;
uniform float uSweepWidth;
uniform float uTrail;
uniform float uScale;
uniform float uFrequency;
uniform float uRipple;
uniform float uDensity;
uniform float uLineWidth;
uniform float uGlow;
uniform float uDirection;
uniform float uSpread;
uniform float uBrightness;
uniform float uVignette;
uniform float uOpacity;
uniform float uScanline;
uniform float uRatio;
uniform float uGrain;
uniform float uTime;
uniform vec2 uMouse;
uniform float uPresence;
uniform float uMouseRadius;
uniform float uMouseStrength;
uniform float uAttract;
uniform vec3 uPings[${MAX_PINGS}];
uniform float uIntro;
uniform float uLightMode;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;

out vec4 fragColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float signal(vec2 p, float t) {
  float w = sin(p.x * 1.3 + t * 0.7);
  w += sin(p.y * 1.7 - t * 0.52) * 0.8;
  w += sin((p.x + p.y) * 0.9 + t * 0.91) * 0.6;
  w += sin((p.x - p.y) * 1.53 - t * 0.63) * 0.42;
  return w * 0.35;
}

float smoother(float x) {
  x = clamp(x, 0.0, 1.0);
  return x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
}

vec2 axes(vec2 p) {
  if (uDirection < 0.5) return vec2(p.y, p.x);
  if (uDirection < 1.5) return vec2(p.x, -p.y);
  return vec2((p.x + p.y) * 0.70710678, (p.x - p.y) * 0.70710678);
}

float coverage(float lc, float width) {
  float fw = max(fwidth(lc), 1e-5);
  float dist = abs(fract(lc + 0.5) - 0.5) / fw;
  float crowd = smoothstep(0.2, 0.55, fw);
  float cover = clamp(width * 0.5 + 0.5 - dist, 0.0, 1.0) * min(width, 1.0);
  return mix(cover, min(width * fw, 1.0), crowd);
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution) / uResolution.y;
  vec2 p = uv / max(uScale, 0.001);
  vec2 ax = axes(p);

  float sig = signal(p * uFrequency, uWave);
  float coord = ax.x + sig * uRipple;

  vec2 mp = uMouse / max(uScale, 0.001);
  vec2 md = p - mp;
  float radius = max(uMouseRadius / max(uScale, 0.001), 0.01);
  float lens = exp(-dot(md, md) / (radius * radius)) * uPresence;
  float mouseAxis = axes(mp).x + signal(mp * uFrequency, uWave) * uRipple;
  coord -= (coord - mouseAxis) * lens * uMouseStrength * mix(0.55, -0.9, uAttract);

  float pingLight = 0.0;
  for (int i = 0; i < ${MAX_PINGS}; i++) {
    vec3 ping = uPings[i];
    if (ping.z < 0.0) continue;
    float d = length(uv - ping.xy);
    float age = ping.z;
    float r = age * 1.1;
    float w = 0.12 + age * 0.1;
    float band = exp(-((d - r) * (d - r)) / (w * w));
    float fade = exp(-age * 0.9) * smoothstep(0.0, 0.12, age);
    coord += band * fade * 0.018 / max(uScale, 0.001);
    pingLight += band * fade;
  }

  float u = fract(uSweep - coord / max(uSweepWidth, 0.05));
  float tail = mix(11.0, 1.8, clamp(uTrail, 0.0, 1.0));
  float lead = smoothstep(0.84, 1.0, u);
  lead *= lead;
  float sweep = max(exp(-u * tail), lead);
  float head = max(exp(-u * 26.0), lead * lead * lead);

  float introFront = mix(-1.6, 1.6, smoother(uIntro)) / max(uScale, 0.001);
  float reveal = 1.0 - smoothstep(introFront - 0.05, introFront + 0.3, coord);
  float introHead = exp(-abs(coord - introFront) * 14.0) * (1.0 - uIntro) * step(0.0001, 1.0 - uIntro);
  reveal = mix(reveal, 1.0, step(0.9999, uIntro));

  float lit = clamp(sweep * 0.86 + lens * uMouseStrength * 0.7 + pingLight * 0.9 + introHead, 0.0, 1.6);
  float hot = clamp(head + introHead + pingLight * 0.35, 0.0, 1.0);

  float lc = coord * uDensity;
  float width = uLineWidth * (1.0 + lit * 1.4 + hot * 0.9);
  float thread = 0.62 + 0.38 * hash(vec2(floor(lc + 0.5), 3.7));
  float split = uSpread * (0.5 + lit * 1.3) * max(fwidth(lc), 1e-5);
  float cg = coverage(lc, width);
  float cr = coverage(lc + split, width);
  float cb = coverage(lc - split, width);

  float fw = max(fwidth(lc), 1e-5);
  float dist = abs(fract(lc + 0.5) - 0.5) / fw;
  float crowd = smoothstep(0.2, 0.55, fw);
  float halo = exp(-dist / (3.0 + uGlow * 9.0)) * (1.0 - crowd) * uGlow * lit * 1.15;

  float base = 0.11 * reveal;
  float level = (base + lit * (1.0 - base)) * thread * uBrightness;

  vec3 tone = mix(uColor1, uColor2, smoothstep(0.05, 0.75, lit));
  tone = mix(tone, uColor3, hot);
  vec3 haloTone = mix(uColor1, uColor2, 0.65);

  float vx = smoother((1.0 - abs(uv.x / (uResolution.x / uResolution.y))) / 0.6);
  float vy = smoother((1.0 - abs(uv.y)) / 0.6);
  float vignette = mix(1.0, vx * vy, uVignette);

  vec3 cover3 = vec3(cr, cg, cb);
  float alphaLine = max(max(cr, cg), cb) * level;
  vec3 colLine = tone * cover3 * level;

  float grain = (hash(gl_FragCoord.xy + fract(uTime) * 91.7) - 0.5) * uGrain;
  float scan = 1.0 - uScanline * 0.55 * (0.5 + 0.5 * cos(gl_FragCoord.y * 6.2831853 / (3.0 * uRatio)));

  if (uLightMode > 0.5) {
    float ink = clamp(alphaLine * vignette * scan, 0.0, 1.0);
    float wash = clamp(halo * 0.28 * vignette, 0.0, 1.0);
    float alpha = clamp(ink + wash * (1.0 - ink) + grain * 0.5 * ink, 0.0, 1.0) * uOpacity;
    vec3 col = (tone * ink + haloTone * wash * (1.0 - ink)) / max(ink + wash * (1.0 - ink), 1e-4);
    fragColor = vec4(col * alpha, alpha);
    return;
  }

  vec3 col = (colLine + haloTone * halo) * vignette * scan;
  float alpha = clamp(max(alphaLine, halo) * vignette * scan + grain * max(alphaLine, 0.04), 0.0, 1.0);
  col = clamp(col + grain * 0.6 * alpha, 0.0, 1.0);
  col = min(col, vec3(alpha));
  fragColor = vec4(col * uOpacity, alpha * uOpacity);
}`;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const compile = (gl, type, source) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
};

const link = gl => {
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  const uniforms = {};
  const total = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < total; i++) {
    const info = gl.getActiveUniform(program, i);
    if (info) uniforms[info.name.replace(/\[0\]$/, '')] = gl.getUniformLocation(program, info.name);
  }
  return { program, uniforms };
};

const toRgb = hex => {
  let h = String(hex || '#ffffff')
    .replace('#', '')
    .trim();
  if (h.length === 3 || h.length === 4)
    h = h
      .slice(0, 3)
      .split('')
      .map(c => c + c)
      .join('');
  const num = parseInt(h.slice(0, 6), 16);
  if (Number.isNaN(num)) return [1, 1, 1];
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
};

const Scanner = ({
  color1 = '#5227FF',
  color2 = '#FF9FFC',
  color3 = '#FFFFFF',
  speed = 0.5,
  sweepSpeed = 0.25,
  sweepWidth = 1.6,
  trail = 0.5,
  reverse = false,
  scale = 1.5,
  frequency = 2,
  ripple = 0.22,
  bandDensity = 11,
  lineWidth = 1.2,
  glow = 0.6,
  scanDirection = 'vertical',
  colorSpread = 0.7,
  brightness = 1,
  vignette = 0.3,
  scanline = true,
  scanlineIntensity = 0.5,
  grain = true,
  grainIntensity = 0.04,
  opacity = 1,
  mouseInteraction = true,
  mouseRadius = 0.5,
  mouseStrength = 0.7,
  mouseMode = 'repel',
  clickEffect = 'ping',
  intro = true,
  lightMode = false,
  dpr,
  className = '',
  style
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const wakeRef = useRef(null);
  const settings = {
    color1,
    color2,
    color3,
    speed,
    sweepSpeed: reverse ? -sweepSpeed : sweepSpeed,
    sweepWidth: Math.max(0.05, sweepWidth),
    trail: clamp(trail, 0, 1),
    scale: Math.max(0.05, scale),
    frequency,
    ripple,
    bandDensity: Math.max(0.5, bandDensity),
    lineWidth: Math.max(0.2, lineWidth),
    glow: Math.max(0, glow),
    direction: DIRECTIONS[scanDirection] ?? 0,
    colorSpread: clamp(colorSpread, 0, 1),
    brightness: Math.max(0, brightness),
    vignette: clamp(vignette, 0, 1),
    scanline: scanline ? clamp(scanlineIntensity, 0, 1) : 0,
    grain: grain ? Math.max(0, grainIntensity) : 0,
    opacity: clamp(opacity, 0, 1),
    mouseInteraction,
    mouseRadius: Math.max(0.05, mouseRadius),
    mouseStrength: Math.max(0, mouseStrength),
    attract: mouseMode === 'attract',
    clickEffect,
    intro,
    lightMode,
    dpr
  };
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const gl = canvas?.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false
    });
    if (!container || !canvas || !gl) return undefined;
    const shader = link(gl);
    if (!shader) return undefined;
    const u = shader.uniforms;
    const vao = gl.createVertexArray();

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const view = { width: 1, height: 1, ratio: 1 };
    const pointer = { x: 0, y: 0, inside: false };
    const mouse = { x: 0, y: 0, ready: false };
    const pings = new Float32Array(MAX_PINGS * 3);
    for (let k = 0; k < MAX_PINGS; k++) pings[k * 3 + 2] = -1;
    let pingIndex = 0;
    let presence = 0;
    let wave = 0;
    let sweep = -0.39;
    let clock = 0;
    let introClock = settingsRef.current.intro && !reduce ? 0 : 1;
    let raf = 0;
    let last = 0;
    let visible = true;
    let quiet = 0;

    const toUv = (x, y) => [(x * 2 - view.width) / view.height, (view.height - y * 2) / view.height];

    const draw = () => {
      const s = settingsRef.current;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(shader.program);
      gl.uniform2f(u.uResolution, canvas.width, canvas.height);
      gl.uniform1f(u.uWave, wave);
      gl.uniform1f(u.uSweep, sweep);
      gl.uniform1f(u.uSweepWidth, s.sweepWidth);
      gl.uniform1f(u.uTrail, s.trail);
      gl.uniform1f(u.uScale, s.scale);
      gl.uniform1f(u.uFrequency, s.frequency);
      gl.uniform1f(u.uRipple, s.ripple);
      gl.uniform1f(u.uDensity, s.bandDensity);
      gl.uniform1f(u.uLineWidth, s.lineWidth * view.ratio);
      gl.uniform1f(u.uGlow, s.glow);
      gl.uniform1f(u.uDirection, s.direction);
      gl.uniform1f(u.uSpread, s.colorSpread);
      gl.uniform1f(u.uBrightness, s.brightness);
      gl.uniform1f(u.uVignette, s.vignette);
      gl.uniform1f(u.uOpacity, s.opacity);
      gl.uniform1f(u.uScanline, s.scanline);
      gl.uniform1f(u.uRatio, view.ratio);
      gl.uniform1f(u.uGrain, s.grain);
      gl.uniform1f(u.uTime, clock);
      gl.uniform2f(u.uMouse, mouse.x, mouse.y);
      gl.uniform1f(u.uPresence, s.mouseInteraction ? presence : 0);
      gl.uniform1f(u.uMouseRadius, s.mouseRadius);
      gl.uniform1f(u.uMouseStrength, s.mouseStrength);
      gl.uniform1f(u.uAttract, s.attract ? 1 : 0);
      gl.uniform3fv(u.uPings, pings);
      gl.uniform1f(u.uIntro, introClock);
      gl.uniform1f(u.uLightMode, s.lightMode ? 1 : 0);
      gl.uniform3fv(u.uColor1, toRgb(s.color1));
      gl.uniform3fv(u.uColor2, toRgb(s.color2));
      gl.uniform3fv(u.uColor3, toRgb(s.color3));
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    let sizedDpr = settingsRef.current.dpr;

    const resize = () => {
      const s = settingsRef.current;
      sizedDpr = s.dpr;
      view.width = Math.max(1, container.clientWidth);
      view.height = Math.max(1, container.clientHeight);
      view.ratio = Math.min(s.dpr || window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(view.width * view.ratio));
      canvas.height = Math.max(1, Math.round(view.height * view.ratio));
      draw();
      wake();
    };

    const frame = now => {
      raf = 0;
      if (!visible || document.hidden) return;
      const s = settingsRef.current;
      if (s.dpr !== sizedDpr) resize();
      const dt = last ? clamp((now - last) / 1000, 0, 1 / 20) : 1 / 60;
      last = now;
      clock += dt;
      if (!reduce) {
        wave += dt * s.speed;
        sweep += dt * s.sweepSpeed;
      }
      if (introClock < 1) introClock = Math.min(1, introClock + dt / INTRO_SECONDS);
      const target = toUv(pointer.x, pointer.y);
      const follow = 1 - Math.exp(-dt / 0.09);
      mouse.x += (target[0] - mouse.x) * follow;
      mouse.y += (target[1] - mouse.y) * follow;
      presence += ((pointer.inside && s.mouseInteraction ? 1 : 0) - presence) * (1 - Math.exp(-dt / 0.3));
      let busy = (!reduce && (s.speed !== 0 || s.sweepSpeed !== 0)) || introClock < 1 || presence > 0.001;
      for (let k = 0; k < MAX_PINGS; k++) {
        if (pings[k * 3 + 2] < 0) continue;
        pings[k * 3 + 2] += dt;
        if (pings[k * 3 + 2] > 4) pings[k * 3 + 2] = -1;
        else busy = true;
      }
      draw();
      quiet = busy ? 0 : quiet + dt;
      if (quiet < 0.5) raf = requestAnimationFrame(frame);
    };

    function wake() {
      quiet = 0;
      if (!raf && visible && !document.hidden) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    }

    const locate = event => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      return { x, y, inside: x >= 0 && y >= 0 && x <= rect.width && y <= rect.height };
    };

    const onPointerMove = event => {
      const { x, y, inside } = locate(event);
      const was = pointer.inside;
      pointer.inside = inside;
      if (inside) {
        pointer.x = x;
        pointer.y = y;
        if (!was || !mouse.ready) {
          const [ux, uy] = toUv(x, y);
          mouse.x = ux;
          mouse.y = uy;
          mouse.ready = true;
        }
      }
      if (inside || was) wake();
    };

    const onPointerDown = event => {
      const s = settingsRef.current;
      if (s.clickEffect !== 'ping' || reduce) return;
      const { x, y, inside } = locate(event);
      if (!inside) return;
      const [ux, uy] = toUv(x, y);
      pings[pingIndex * 3] = ux;
      pings[pingIndex * 3 + 1] = uy;
      pings[pingIndex * 3 + 2] = 0;
      pingIndex = (pingIndex + 1) % MAX_PINGS;
      wake();
    };

    const onPointerLeave = () => {
      pointer.inside = false;
      wake();
    };

    const onVisibility = () => wake();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const intersection = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      if (visible) wake();
    });
    intersection.observe(container);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibility);
    resize();
    wakeRef.current = wake;

    return () => {
      cancelAnimationFrame(raf);
      wakeRef.current = null;
      resizeObserver.disconnect();
      intersection.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(shader.program);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  useEffect(() => {
    wakeRef.current?.();
  });

  return (
    <div ref={containerRef} className={`scanner-container ${className}`.trim()} style={style}>
      <canvas ref={canvasRef} className="scanner-canvas" aria-hidden="true" />
    </div>
  );
};

export default Scanner;

```

### Component CSS
```css
.scanner-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.scanner-canvas {
  display: block;
  width: 100%;
  height: 100%;
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.


## Integrate the <FoldText /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: FoldText
### Variant: JavaScript + CSS
### Dependencies: gsap

---

### Usage Example
```jsx
import FoldText from './FoldText';

<FoldText
  text="Launch with clarity"
  foldStyle="paper"
  splitBy="char"
  hinge="top"
  trigger="scroll"
  foldAngle={92}
  duration={0.65}
  stagger={0.045}
  staggerFrom="start"
  ease="power3.out"
  loopDelay={1.4}
  hoverRefold={true}
  refoldRadius={140}
  refoldAngle={45}
  perspective={700}
  creaseShading={0.55}
  fontSize="clamp(3rem, 10vw, 7rem)"
  fontWeight={800}
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| text | string | "Design unfolds" | The text to split and fold into place. Line breaks are kept. |
| foldStyle | "paper" | "blinds" | "flip" | "paper" | How each piece folds. Paper swings open from its hinge edge, blinds splits it into two slats that turn open one after the other, and flip turns it over like a card, lifting toward you mid-turn. |
| splitBy | "char" | "word" | "line" | "char" | Whether each character, word or line folds as its own panel. |
| hinge | "top" | "bottom" | "left" | "right" | "top" | The edge each panel folds around. For blinds and flip it picks the axis and the turning direction. |
| foldAngle | number | 92 | How far the panels start folded away, in degrees. Past 90 they flip over from behind. Flip always turns a full half turn. |
| duration | number | 0.65 | How long each panel takes to unfold, in seconds. |
| stagger | number | 0.045 | Delay between panels, in seconds. |
| staggerFrom | "start" | "center" | "end" | "edges" | "random" | "start" | Where the cascade starts. |
| ease | string | "power3.out" | GSAP ease used for the unfold. |
| perspective | number | 700 | Camera distance for the fold, in px. Lower values look deeper. |
| creaseShading | number | 0.55 | How dark the crease shading gets while a panel is folded, from 0 to 1. |
| trigger | "mount" | "hover" | "scroll" | "loop" | "mount" | When the text unfolds. Loop holds the text, folds it back up and plays again. |
| loopDelay | number | 1.4 | How long the unfolded text holds before folding back up, in seconds. Only applies when trigger is 'loop'. |
| hoverRefold | boolean | false | Panels near the cursor fold partly away and ease back open once it passes. |
| refoldRadius | number | 140 | How far from the cursor panels react with hoverRefold, in px. The fold fades out toward the edge. |
| refoldAngle | number | 45 | How far a panel right under the cursor folds away with hoverRefold, in degrees. |
| fontSize | string | number | 80 | Font size of the text. Numbers are in px. |
| fontWeight | string | number | 800 | Font weight of the text. |
| color | string | "currentColor" | Color of the text. Follows the surrounding text color by default. |
| className | string | "" | Extra class names for the root element. |
| style | CSSProperties | {} | Inline styles for the root element. |

### Full Component Source
```jsx
'use client';

import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './FoldText.css';

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const HINGES = {
  top: { origin: '50% 0%', axis: 'rotateX', sign: -1 },
  bottom: { origin: '50% 100%', axis: 'rotateX', sign: 1 },
  left: { origin: '0% 50%', axis: 'rotateY', sign: 1 },
  right: { origin: '100% 50%', axis: 'rotateY', sign: -1 }
};

const SLATS = {
  rotateX: {
    origins: ['50% 25%', '50% 75%'],
    clips: ['inset(-40% -20% 50% -20%)', 'inset(50% -20% -40% -20%)']
  },
  rotateY: {
    origins: ['25% 50%', '75% 50%'],
    clips: ['inset(-40% 50% -40% -20%)', 'inset(-40% -20% -40% 50%)']
  }
};

const FOLD_STYLES = ['paper', 'blinds', 'flip'];
const SLAT_DELAY = 0.24;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const FoldText = ({
  text = 'Design unfolds',
  splitBy = 'char',
  hinge = 'top',
  foldStyle = 'paper',
  duration = 0.65,
  stagger = 0.045,
  staggerFrom = 'start',
  foldAngle = 92,
  ease = 'power3.out',
  perspective = 700,
  creaseShading = 0.55,
  trigger = 'mount',
  loopDelay = 1.4,
  hoverRefold = false,
  refoldRadius = 140,
  refoldAngle = 45,
  fontSize = 80,
  fontWeight = 800,
  color = 'currentColor',
  className = '',
  style = {}
}) => {
  const rootRef = useRef(null);
  const safeHinge = HINGES[hinge] ? hinge : 'top';
  const hingeConfig = HINGES[safeHinge];
  const safeStyle = FOLD_STYLES.includes(foldStyle) ? foldStyle : 'paper';
  const safeCrease = clamp(creaseShading, 0, 1);
  const safeAngle = clamp(foldAngle, 0, 180);
  const safeStagger = Math.max(0, stagger);
  const safeDelay = Math.max(0, loopDelay);
  const safeRadius = Math.max(1, refoldRadius);
  const safeRefold = clamp(refoldAngle, 0, 180);
  const startsFolded = trigger !== 'hover';

  const segments = useMemo(() => {
    const renderPiece = (content, key, isLine = false) => (
      <span className="fold-text-segment" data-fold-split={isLine ? 'line' : undefined} key={key}>
        {safeStyle === 'blinds' ? (
          <span
            className="fold-text-piece"
            data-fold-hinge={safeHinge}
            data-fold-style="blinds"
            style={startsFolded ? { opacity: 0 } : undefined}
          >
            <span className="fold-text-slat" data-fold-text={content}>
              {content}
            </span>
            <span className="fold-text-slat" data-fold-slat="b" data-fold-text={content}>
              {content}
            </span>
          </span>
        ) : (
          <span
            className="fold-text-piece"
            data-fold-hinge={safeHinge}
            data-fold-style={safeStyle}
            data-fold-text={content}
            style={startsFolded ? { opacity: 0 } : undefined}
          >
            {content}
          </span>
        )}
      </span>
    );

    if (splitBy === 'line') {
      return text.split('\n').map((line, index) => renderPiece(line || '\u00A0', `line-${index}`, true));
    }

    return text.split(/(\s+)/).flatMap((part, partIndex) => {
      if (!part) return [];

      if (/^\s+$/.test(part)) {
        return part
          .split('\n')
          .flatMap((spaces, lineIndex) => [lineIndex > 0 ? <br key={`br-${partIndex}-${lineIndex}`} /> : null, spaces])
          .filter(Boolean);
      }

      if (splitBy === 'word') return [renderPiece(part, `word-${partIndex}`)];

      return [
        <span className="fold-text-word" key={`word-${partIndex}`}>
          {Array.from(part).map((char, charIndex) => renderPiece(char, `char-${partIndex}-${charIndex}`))}
        </span>
      ];
    });
  }, [text, splitBy, safeHinge, safeStyle, startsFolded]);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const elements = Array.from(root.querySelectorAll('.fold-text-piece'));
    if (!elements.length) return undefined;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const { axis, sign, origin } = hingeConfig;
    const slats = SLATS[axis];
    const unfoldEase = gsap.parseEase(reduceMotion ? 'power1.out' : ease) || gsap.parseEase('power3.out');
    const foldEase = gsap.parseEase(reduceMotion ? 'power1.in' : 'power2.in');
    const angle = reduceMotion ? 0 : safeStyle === 'flip' ? 180 : safeAngle;
    const crease = reduceMotion ? 0 : safeCrease;
    const refold = hoverRefold && !reduceMotion ? safeRefold : 0;
    const lift = safeStyle === 'flip' && !reduceMotion ? 0.45 : 0;
    const unfoldDuration = reduceMotion ? Math.min(duration, 0.22) : duration;
    const staggerVars = { each: reduceMotion ? Math.min(safeStagger, 0.02) : safeStagger, from: staggerFrom };

    const pieces = elements.map(element => {
      const parts = safeStyle === 'blinds' ? Array.from(element.children) : [element];
      if (safeStyle === 'blinds') {
        element.style.opacity = '1';
        parts.forEach((part, index) => {
          part.style.transformOrigin = slats.origins[index];
          if (index > 0) part.style.clipPath = slats.clips[index];
        });
      } else {
        element.style.transformOrigin = safeStyle === 'flip' ? '50% 50%' : origin;
        element.style.backfaceVisibility = safeStyle === 'flip' ? 'visible' : '';
      }
      return { element, parts, t: startsFolded ? 0 : 1, f: 0, r: 0, aim: 0 };
    });

    const shade = (progress, tilt) => String(crease * clamp(1 - progress + tilt / 90, 0, 1));

    const render = () => {
      pieces.forEach(piece => {
        const tilt = piece.r * refold;

        if (safeStyle === 'blinds') {
          let resting = tilt < 0.05;
          piece.parts.forEach((part, index) => {
            const offset = index * SLAT_DELAY;
            const open = unfoldEase(clamp((piece.t - offset) / (1 - SLAT_DELAY), 0, 1));
            const close = foldEase(clamp((piece.f - offset) / (1 - SLAT_DELAY), 0, 1));
            const progress = open * (1 - close);
            if (Math.abs(1 - progress) > 0.002) resting = false;
            part.style.transform = `${axis}(${sign * ((1 - progress) * angle + tilt)}deg)`;
            part.style.opacity = String(clamp(progress, 0, 1));
            part.style.setProperty('--fold-crease', shade(progress, tilt));
          });
          piece.parts[0].style.clipPath = resting ? 'none' : slats.clips[0];
          piece.parts[1].style.visibility = resting ? 'hidden' : 'visible';
          return;
        }

        const progress = unfoldEase(piece.t) * (1 - foldEase(piece.f));
        const rise = lift * Math.sin(Math.PI * clamp(progress, 0, 1));
        const turn = `${axis}(${sign * ((1 - progress) * angle + tilt)}deg)`;
        piece.element.style.transform = rise > 0.001 ? `translateZ(${rise}em) ${turn}` : turn;
        piece.element.style.opacity = String(clamp(progress, 0, 1));
        piece.element.style.setProperty('--fold-crease', shade(progress, tilt));
      });
    };

    let timeline = null;
    let scrollTrigger = null;

    const play = loop => {
      timeline?.kill();
      timeline = gsap.timeline({ onUpdate: render, ...(loop ? { repeat: -1, repeatDelay: 0.35 } : {}) });
      timeline.fromTo(pieces, { t: 0, f: 0 }, { t: 1, duration: unfoldDuration, ease: 'none', stagger: staggerVars });
      if (loop) {
        timeline.to(
          pieces,
          { f: 1, duration: unfoldDuration * 0.75, ease: 'none', stagger: staggerVars },
          `+=${safeDelay}`
        );
      }
      render();
    };

    const handleEnter = () => play(false);

    if (trigger === 'hover') {
      render();
      root.addEventListener('mouseenter', handleEnter);
    } else if (trigger === 'scroll') {
      render();
      scrollTrigger = ScrollTrigger.create({
        trigger: root,
        start: 'top 82%',
        once: true,
        onEnter: handleEnter
      });
    } else {
      play(trigger === 'loop');
    }

    let pointer = null;
    let centers = null;
    let measured = null;
    let relaxing = false;

    const measure = box => {
      centers = pieces.map(piece => {
        const rect = piece.element.parentElement.getBoundingClientRect();
        return { x: rect.left - box.left + rect.width / 2, y: rect.top - box.top + rect.height / 2 };
      });
      measured = { width: box.width, height: box.height };
    };

    const relax = (time, deltaTime) => {
      const step = Math.min(deltaTime, 64) / 1000;
      let moving = false;
      pieces.forEach(piece => {
        const rate = piece.aim > piece.r ? 14 : 6;
        piece.r += (piece.aim - piece.r) * (1 - Math.exp(-rate * step));
        if (Math.abs(piece.aim - piece.r) > 0.001) moving = true;
        else piece.r = piece.aim;
      });
      render();
      if (!moving) {
        gsap.ticker.remove(relax);
        relaxing = false;
      }
    };

    const aim = () => {
      const box = root.getBoundingClientRect();
      const near =
        pointer &&
        pointer.x > box.left - safeRadius &&
        pointer.x < box.right + safeRadius &&
        pointer.y > box.top - safeRadius &&
        pointer.y < box.bottom + safeRadius;
      if (near && (!centers || Math.abs(box.width - measured.width) + Math.abs(box.height - measured.height) > 1)) {
        measure(box);
      }
      let changed = false;
      pieces.forEach((piece, index) => {
        let value = 0;
        if (near) {
          const center = centers[index];
          const distance = Math.hypot(box.left + center.x - pointer.x, box.top + center.y - pointer.y) / safeRadius;
          if (distance < 1) value = 1 - distance * distance * (3 - 2 * distance);
        }
        if (value !== piece.aim) changed = true;
        piece.aim = value;
      });
      if (changed && !relaxing) {
        relaxing = true;
        gsap.ticker.add(relax);
      }
    };

    const handleMove = event => {
      pointer = { x: event.clientX, y: event.clientY };
      aim();
    };

    const handleLeave = () => {
      pointer = null;
      aim();
    };

    const handleScroll = () => {
      if (pointer) aim();
    };

    if (refold) {
      window.addEventListener('pointermove', handleMove, { passive: true });
      window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
      document.documentElement.addEventListener('pointerleave', handleLeave);
    }

    return () => {
      root.removeEventListener('mouseenter', handleEnter);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('scroll', handleScroll, { capture: true });
      document.documentElement.removeEventListener('pointerleave', handleLeave);
      gsap.ticker.remove(relax);
      scrollTrigger?.kill();
      timeline?.kill();
      gsap.killTweensOf(pieces);
    };
  }, [
    segments,
    hingeConfig,
    safeStyle,
    duration,
    safeStagger,
    staggerFrom,
    safeAngle,
    ease,
    safeCrease,
    trigger,
    safeDelay,
    hoverRefold,
    safeRadius,
    safeRefold,
    startsFolded
  ]);

  const rootStyle = {
    '--fold-text-font-size': typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
    '--fold-text-font-weight': fontWeight,
    '--fold-text-color': color,
    '--fold-perspective': `${Math.max(120, perspective)}px`,
    ...style
  };

  return (
    <span ref={rootRef} className={`fold-text ${className}`.trim()} style={rootStyle}>
      <span className="fold-text-sr-only">{text}</span>
      <span className="fold-text-visual" aria-hidden="true">
        {segments}
      </span>
    </span>
  );
};

export default FoldText;

```

### Component CSS
```css
.fold-text {
  display: inline-block;
  color: var(--fold-text-color, currentColor);
  font-size: var(--fold-text-font-size, inherit);
  font-weight: var(--fold-text-font-weight, inherit);
  line-height: 0.95;
  letter-spacing: -0.04em;
  white-space: pre-wrap;
  user-select: text;
}

.fold-text-sr-only {
  position: absolute;
  user-select: none;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.fold-text-visual {
  display: inline;
}

.fold-text-word {
  display: inline-block;
  white-space: nowrap;
}

.fold-text-segment {
  display: inline-block;
  perspective: var(--fold-perspective, 700px);
  vertical-align: baseline;
}

.fold-text-segment[data-fold-split='line'] {
  display: block;
}

.fold-text-piece {
  --fold-shade: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.58) 0%,
    rgba(0, 0, 0, 0.22) 42%,
    rgba(255, 255, 255, 0.26) 100%
  );
  position: relative;
  display: inline-block;
  backface-visibility: hidden;
  transform-origin: 50% 0%;
}

.fold-text-piece[data-fold-hinge='bottom'] {
  --fold-shade: linear-gradient(0deg, rgba(0, 0, 0, 0.58) 0%, rgba(0, 0, 0, 0.22) 42%, rgba(255, 255, 255, 0.26) 100%);
  transform-origin: 50% 100%;
}

.fold-text-piece[data-fold-hinge='left'] {
  --fold-shade: linear-gradient(90deg, rgba(0, 0, 0, 0.58) 0%, rgba(0, 0, 0, 0.22) 42%, rgba(255, 255, 255, 0.26) 100%);
  transform-origin: 0% 50%;
}

.fold-text-piece[data-fold-hinge='right'] {
  --fold-shade: linear-gradient(
    270deg,
    rgba(0, 0, 0, 0.58) 0%,
    rgba(0, 0, 0, 0.22) 42%,
    rgba(255, 255, 255, 0.26) 100%
  );
  transform-origin: 100% 50%;
}

.fold-text-piece[data-fold-style='blinds'] {
  perspective: var(--fold-perspective, 700px);
}

.fold-text-slat {
  position: relative;
  display: inline-block;
  backface-visibility: hidden;
}

.fold-text-slat[data-fold-slat='b'] {
  position: absolute;
  inset: 0;
  visibility: hidden;
}

.fold-text-piece::after,
.fold-text-slat::after {
  content: attr(data-fold-text);
  position: absolute;
  inset: 0;
  pointer-events: none;
  color: transparent;
  -webkit-text-fill-color: transparent;
  background-image: var(--fold-shade);
  -webkit-background-clip: text;
  background-clip: text;
  opacity: var(--fold-crease, 0);
}

@media (prefers-reduced-motion: reduce) {
  .fold-text-piece,
  .fold-text-slat {
    transform: none !important;
  }

  .fold-text-piece::after,
  .fold-text-slat::after {
    opacity: 0 !important;
  }
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.


## Integrate the <SplitText /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: SplitText
### Variant: JavaScript + CSS
### Dependencies: gsap @gsap/react

---

### Usage Example
```jsx
import SplitText from "./SplitText";

const handleAnimationComplete = () => {
  console.log('All letters have animated!');
};

<SplitText
  text="Hello, GSAP!"
  className="text-2xl font-semibold text-center"
  effect="rise"
  splitType="chars"
  delay={50}
  duration={1.25}
  staggerFrom="start"
  trigger="view"
  hoverEffect="lift"
  loop={false}
  loopDelay={1.5}
  mask={false}
  threshold={0.1}
  rootMargin="-100px"
  textAlign="center"
  onLetterAnimationComplete={handleAnimationComplete}
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| tag | string | "p" | HTML tag to render: "h1", "h2", "h3", "h4", "h5", "h6", "p" or "span". |
| text | string | "" | The text content to animate. |
| className | string | "" | Additional class names to style the component. |
| effect | "rise" | "fade" | "blur" | "flip" | "pop" | "skew" | "wave" | "rise" | Reveal style. Rise slides pieces up, fade dissolves them in, blur pulls them into focus, flip swings them up in 3D, pop scales them in with a soft overshoot, skew slides them in leaning and wave lets a crest travel across. Ignored when from or to is set. |
| trigger | "view" | "load" | "hover" | "click" | "view" | When the reveal plays. View waits until the text scrolls into view, load plays right away, hover and click play it in view and replay it on every hover or click. |
| loop | boolean | false | Animates the pieces out and back in again, over and over. |
| loopDelay | number | 1.5 | Pause in seconds between the end of a reveal and the next loop. |
| hoverEffect | "none" | "lift" | "wave" | "none" | Interaction after the reveal. Lift raises the pieces near the cursor with a soft falloff, wave sends a ripple through the text from where the cursor enters. |
| color | string | undefined | Text color. Follows the surrounding text color when not set. |
| accentColor | string | undefined | Color each piece passes through while it reveals before settling on the text color. |
| delay | number | 50 | Delay between animations for each letter (in ms). |
| duration | number | 1.25 | Duration of each letter animation (in seconds). |
| ease | string | function | undefined | GSAP easing for the reveal. Each effect brings its own ease when not set. |
| splitType | string | "chars" | Split type: "chars", "words", "lines", or "words, chars". |
| staggerFrom | "start" | "center" | "end" | "edges" | "random" | "start" | Where the stagger starts, so pieces can ripple out from the middle, the ends or in random order. |
| mask | boolean | false | Clips each piece to its own box so it slides out from behind an edge instead of floating in. |
| from | object | undefined | Custom starting GSAP properties for each piece, replacing the effect. Defaults to { opacity: 0, y: 40 }. |
| to | object | undefined | Custom target GSAP properties for each piece, replacing the effect. Defaults to { opacity: 1, y: 0 }. |
| threshold | number | 0.1 | Intersection threshold to trigger the animation (0-1). |
| rootMargin | string | "-100px" | Root margin for the ScrollTrigger. |
| textAlign | string | "center" | Text alignment: 'left', 'center', 'right', etc. |
| onLetterAnimationComplete | function | undefined | Callback function when the first reveal completes. |

### Full Component Source
```jsx
'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

const DEFAULT_FROM = { opacity: 0, y: 40 };
const DEFAULT_TO = { opacity: 1, y: 0 };
const STIFFNESS = 180;
const DAMPING = 19;
const KICK = 0.024;

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const fontsAreLoaded = () => typeof document !== 'undefined' && (!document.fonts || document.fonts.status === 'loaded');

const waveEase = t => 1 - Math.cos(t * Math.PI * 1.5) * Math.pow(1 - t, 1.2);

const getEffect = (effect, em) => {
  switch (effect) {
    case 'fade':
      return { from: { opacity: 0 }, to: { opacity: 1 }, ease: 'power2.inOut' };
    case 'blur':
      return {
        from: { opacity: 0, filter: `blur(${Math.round(em * 1.4) / 10}px)` },
        to: { opacity: 1, filter: 'blur(0px)' },
        ease: 'power2.out'
      };
    case 'flip': {
      const setup = { transformPerspective: em * 6, transformOrigin: '50% 100%' };
      return {
        from: { ...setup, opacity: 0, rotationX: -90 },
        to: { ...setup, opacity: 1, rotationX: 0 },
        ease: 'power3.out'
      };
    }
    case 'pop':
      return { from: { opacity: 0, scale: 0 }, to: { opacity: 1, scale: 1 }, ease: 'back.out(1.6)' };
    case 'skew':
      return {
        from: { transformOrigin: '50% 100%', opacity: 0, x: -em * 0.4, skewX: -24 },
        to: { transformOrigin: '50% 100%', opacity: 1, x: 0, skewX: 0 },
        ease: 'expo.out'
      };
    case 'wave':
      return { from: { opacity: 0, y: em * 0.45 }, to: { opacity: 1, y: 0 }, ease: waveEase };
    default:
      return { from: { ...DEFAULT_FROM }, to: { ...DEFAULT_TO }, ease: 'power3.out' };
  }
};

const SplitText = ({
  text,
  className = '',
  delay = 50,
  duration = 1.25,
  ease,
  splitType = 'chars',
  from,
  to,
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  tag = 'p',
  staggerFrom = 'start',
  mask = false,
  effect = 'rise',
  trigger = 'view',
  loop = false,
  loopDelay = 1.5,
  hoverEffect = 'none',
  color,
  accentColor,
  onLetterAnimationComplete
}) => {
  const ref = useRef(null);
  const completedTextRef = useRef(null);
  const onCompleteRef = useRef(onLetterAnimationComplete);
  const liveRef = useRef({ trigger, hoverEffect, accentColor });
  const [fontsLoaded, setFontsLoaded] = useState(fontsAreLoaded);
  const [ready, setReady] = useState(false);

  useIsoLayoutEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
    liveRef.current = { trigger, hoverEffect, accentColor };
  });

  useEffect(() => {
    if (fontsLoaded) return undefined;
    let active = true;
    document.fonts.ready.then(() => {
      if (active) setFontsLoaded(true);
    });
    return () => {
      active = false;
    };
  }, [fontsLoaded]);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !text || !fontsLoaded) return;
      el.getBoundingClientRect();
      if (!fontsAreLoaded()) {
        setFontsLoaded(false);
        return;
      }

      const finish = () => {
        if (completedTextRef.current === text) return;
        completedTextRef.current = text;
        onCompleteRef.current?.();
      };

      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
        setReady(true);
        finish();
        return;
      }

      const startPct = (1 - threshold) * 100;
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
      const marginUnit = marginMatch ? marginMatch[2] || 'px' : 'px';
      const sign =
        marginValue === 0
          ? ''
          : marginValue < 0
            ? `-=${Math.abs(marginValue)}${marginUnit}`
            : `+=${marginValue}${marginUnit}`;
      const start = `top ${startPct}%${sign}`;
      const unit = splitType.includes('chars') ? 'chars' : splitType.includes('words') ? 'words' : 'lines';

      const em = parseFloat(getComputedStyle(el).fontSize) || 16;
      const custom = from !== undefined || to !== undefined;
      const look = getEffect(effect, em);
      const fromVars = custom ? { ...(from || DEFAULT_FROM) } : look.from;
      const toVars = custom ? { ...(to || DEFAULT_TO) } : look.to;
      const easing = ease || (custom ? 'power3.out' : look.ease);
      const settle = custom ? 'willChange' : 'transform,filter,willChange';
      const exit = Math.max(0.35, duration * 0.55);

      let pieces = [];
      let movers = [];
      let order = gsap.utils.distribute({ each: delay / 1000, from: staggerFrom });
      let revealed = completedTextRef.current === text;
      let intro = null;
      let busy = null;
      let queued = null;
      let raf = 0;
      let last = 0;
      let centers = null;
      const lift = em * 0.2;
      const springs = [];
      const kicks = [];
      const pointer = { x: 0, y: 0, inside: false };

      const reveal = (initial, vars) => {
        const accent = liveRef.current.accentColor;
        const tl = gsap.timeline(vars);
        tl.fromTo(
          pieces,
          { ...fromVars, willChange: 'transform, opacity' },
          { ...toVars, duration, ease: easing, stagger: order, immediateRender: initial },
          0
        );
        if (accent) {
          tl.fromTo(
            pieces,
            { color: accent },
            {
              color: getComputedStyle(el).color,
              duration: duration * 0.7,
              ease: 'power1.inOut',
              stagger: order,
              immediateRender: initial
            },
            duration * 0.3
          );
        }
        tl.set(pieces, { clearProps: accent ? `${settle},color` : settle });
        return tl;
      };

      const conceal = () => {
        const accent = liveRef.current.accentColor;
        const tl = gsap.timeline();
        tl.fromTo(
          pieces,
          { ...toVars, willChange: 'transform, opacity' },
          { ...fromVars, duration: exit, ease: 'power2.in', stagger: order, immediateRender: false },
          0
        );
        if (accent) tl.to(pieces, { color: accent, duration: exit, ease: 'power1.in', stagger: order }, 0);
        return tl;
      };

      const cycle = () => {
        if (busy || !revealed || !pieces.length) return;
        queued?.kill();
        queued = null;
        busy = gsap
          .timeline({
            onComplete: () => {
              busy = null;
              queue();
            }
          })
          .add(conceal(), 0)
          .add(reveal(false), exit);
      };

      const queue = () => {
        queued?.kill();
        queued = loop ? gsap.delayedCall(loopDelay, cycle) : null;
      };

      const measure = () => {
        const box = el.getBoundingClientRect();
        centers = movers.map((node, i) => {
          const rect = node.getBoundingClientRect();
          return {
            x: rect.left + rect.width / 2 - box.left,
            y: rect.top + rect.height / 2 - box.top - (springs[i]?.y || 0)
          };
        });
      };

      const tick = now => {
        raf = 0;
        const dt = Math.min(0.032, Math.max(0.001, (now - last) / 1000));
        last = now;
        const spots = liveRef.current.hoverEffect === 'lift' && pointer.inside && revealed ? centers : null;
        const radius = em * 1.15;
        let moving = false;
        for (let k = kicks.length - 1; k >= 0; k--) {
          if (now < kicks[k].at) continue;
          const spring = springs[kicks[k].index];
          if (spring) spring.v -= kicks[k].velocity;
          kicks.splice(k, 1);
        }
        movers.forEach((node, i) => {
          const spring = springs[i] || (springs[i] = { y: 0, v: 0 });
          const spot = spots?.[i];
          let target = 0;
          if (spot) {
            const dx = (spot.x - pointer.x) / radius;
            const dy = (spot.y - pointer.y) / (radius * 1.4);
            target = -lift * Math.exp(-(dx * dx + dy * dy) * 0.5);
          }
          spring.v += (STIFFNESS * (target - spring.y) - DAMPING * spring.v) * dt;
          spring.y += spring.v * dt;
          if (Math.abs(target - spring.y) < 0.02 && Math.abs(spring.v) < 0.05) {
            spring.y = target;
            spring.v = 0;
          } else {
            moving = true;
          }
          node.style.translate = Math.abs(spring.y) > 0.01 ? `0 ${spring.y.toFixed(2)}px` : '';
        });
        if (moving || kicks.length) raf = requestAnimationFrame(tick);
      };

      const wake = () => {
        if (raf) return;
        last = performance.now();
        raf = requestAnimationFrame(tick);
      };

      const locate = e => {
        const box = el.getBoundingClientRect();
        pointer.x = e.clientX - box.left;
        pointer.y = e.clientY - box.top;
      };

      const onEnter = e => {
        locate(e);
        pointer.inside = true;
        if (!revealed) return;
        const live = liveRef.current;
        if (live.trigger === 'hover') cycle();
        if (live.hoverEffect === 'none') return;
        measure();
        if (live.hoverEffect === 'wave') {
          const now = performance.now();
          const speed = em * 9;
          const velocity = (em * 0.16) / KICK;
          centers.forEach((center, index) => {
            kicks.push({ index, velocity, at: now + (Math.abs(center.x - pointer.x) / speed) * 1000 });
          });
        }
        wake();
      };

      const onMove = e => {
        locate(e);
        pointer.inside = true;
        if (!revealed || liveRef.current.hoverEffect !== 'lift') return;
        if (!centers) measure();
        wake();
      };

      const onLeave = () => {
        pointer.inside = false;
        wake();
      };

      const onClick = () => {
        if (liveRef.current.trigger === 'click') cycle();
      };

      const splitInstance = new GSAPSplitText(el, {
        type: splitType,
        smartWrap: true,
        autoSplit: splitType === 'lines',
        mask: mask ? unit : undefined,
        linesClass: 'split-line',
        wordsClass: 'split-word',
        charsClass: 'split-char',
        reduceWhiteSpace: false,
        onSplit: self => {
          pieces = [self[unit], self.chars, self.words, self.lines].find(list => list.length) || [];
          movers = mask && self.masks?.length === pieces.length ? self.masks : pieces;
          order = gsap.utils.distribute({ each: delay / 1000, from: staggerFrom });
          centers = null;
          springs.length = 0;
          kicks.length = 0;
          if (busy && busy !== intro) {
            busy.kill();
            busy = null;
          }
          if (revealed) return undefined;
          intro = reveal(true, {
            scrollTrigger:
              trigger === 'load'
                ? undefined
                : { trigger: el, start, once: true, fastScrollEnd: true, anticipatePin: 0.4 },
            onComplete: () => {
              revealed = true;
              intro = null;
              busy = null;
              finish();
              queue();
            }
          });
          busy = intro;
          return intro;
        }
      });
      setReady(true);
      if (revealed) queue();

      el.addEventListener('pointerenter', onEnter);
      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);
      el.addEventListener('click', onClick);

      return () => {
        cancelAnimationFrame(raf);
        queued?.kill();
        busy?.kill();
        el.removeEventListener('pointerenter', onEnter);
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerleave', onLeave);
        el.removeEventListener('click', onClick);
        movers.forEach(node => {
          node.style.translate = '';
        });
        ScrollTrigger.getAll().forEach(st => {
          if (st.trigger === el) st.kill();
        });
        splitInstance.revert();
      };
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin,
        staggerFrom,
        mask,
        effect,
        trigger,
        loop,
        loopDelay,
        fontsLoaded
      ],
      scope: ref,
      revertOnUpdate: true
    }
  );

  const Tag = tag || 'p';
  const clip =
    hoverEffect === 'none' && (from !== undefined || to !== undefined || effect === 'rise' || effect === 'fade');

  return (
    <Tag
      key={text}
      ref={ref}
      className={`split-parent ${className}`}
      style={{
        textAlign,
        overflow: clip ? 'hidden' : 'visible',
        display: 'inline-block',
        whiteSpace: 'normal',
        wordWrap: 'break-word',
        color,
        cursor: trigger === 'click' ? 'pointer' : undefined,
        visibility: ready ? undefined : 'hidden'
      }}
    >
      {text}
    </Tag>
  );
};

export default SplitText;

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import and render the component using the usage example above as a starting point.
4. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.


## Integrate the <DecryptedText /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: DecryptedText
### Variant: JavaScript + CSS
### Dependencies: motion

---

### Usage Example
```jsx
import DecryptedText from './DecryptedText';

<DecryptedText
  text="Hacking into the mainframe..."
  animateOn="inViewHover"
  effect="scramble"
  sequential={true}
  revealDirection="start"
  speed={60}
  maxIterations={10}
  hoverRadius={100}
  scrambleColor="#2bb673"
  loop={false}
  loopDelay={2000}
  useOriginalCharsOnly={false}
  characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+"
  className="revealed"
  encryptedClassName="encrypted"
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| text | string | - | The text to decrypt. |
| effect | 'scramble' | 'flip' | 'fade' | 'scramble' | How letters decode. Scramble swaps glyphs in place, flip rolls each glyph in vertically and lands the real letter with a soft bounce, fade keeps scrambled glyphs faint and brightens them as they resolve. |
| scrambleColor | string | '' | Color of letters while they are scrambled. Each letter eases back to the text color as it decodes. Leave empty to keep the text color. |
| speed | number | 50 | Time between steps, in ms. |
| maxIterations | number | 10 | How many steps the letters scramble before settling when not sequential. Also sets how long letters keep scrambling after the cursor passes with hoverRadius. |
| sequential | boolean | false | Reveals one letter per step instead of all at once. |
| revealDirection | 'start' | 'end' | 'center' | 'random' | 'start' | Where the sequential reveal starts. Random uncovers the letters in a shuffled order. |
| useOriginalCharsOnly | boolean | false | Scrambles using only the letters already in the text. |
| characters | string | 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+' | The pool of characters used while scrambling. |
| animateOn | 'view' | 'hover' | 'inViewHover' | 'click' | 'hover' | What starts the decryption. View and click start scrambled, so the real text never flashes first. |
| clickMode | 'once' | 'toggle' | 'once' | With click, decrypt once or toggle back and forth. Only applies when animateOn is 'click'. |
| hoverRadius | number | 0 | With hover, only letters within this many px of the cursor scramble, fading out toward the edge, and they settle once it passes. 0 decrypts the whole text on hover. |
| loop | boolean | false | After decrypting, holds, scrambles the text again and repeats. Pauses while off screen. |
| loopDelay | number | 2000 | How long the decrypted text holds before scrambling again when looping, in ms. |
| className | string | '' | Class names for revealed letters. |
| parentClassName | string | '' | Class names for the wrapper around all letters. |
| encryptedClassName | string | '' | Class names for letters that are still scrambled. |

### Full Component Source
```jsx
'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';

const styles = {
  wrapper: {
    display: 'inline-block',
    whiteSpace: 'pre-wrap'
  },
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0,0,0,0)',
    whiteSpace: 'nowrap',
    border: 0
  },
  word: {
    whiteSpace: 'nowrap'
  },
  cell: {
    position: 'relative',
    display: 'inline-block'
  },
  ghost: {
    visibility: 'hidden'
  },
  glyph: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)'
  }
};

const FADE_FLOOR = 0.16;
const FADE_PEAK = 0.62;
const FADE_LEAD = 6;
const SETTLE = 'color 0.7s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1)';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const isSpace = char => /\s/.test(char);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);

const glyphWidths = new Map();
let measureContext = null;

const readFont = node => {
  const style = window.getComputedStyle(node);
  return {
    font: `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`,
    spacing: parseFloat(style.letterSpacing) || 0
  };
};

const advance = (font, glyph) => {
  let widths = glyphWidths.get(font);
  if (!widths) {
    widths = new Map();
    glyphWidths.set(font, widths);
  }
  let width = widths.get(glyph);
  if (width === undefined) {
    measureContext = measureContext || document.createElement('canvas').getContext('2d');
    if (!measureContext) return 0;
    measureContext.font = font;
    width = measureContext.measureText(glyph).width;
    widths.set(glyph, width);
  }
  return width;
};

const flipFrames = (angle, opacity) => [
  { transform: `perspective(4em) translateZ(-0.42em) rotateX(${angle}deg) translateZ(0.42em)`, opacity },
  { transform: 'perspective(4em) translateZ(-0.42em) rotateX(0deg) translateZ(0.42em)', opacity: 1 }
];

export default function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'hover',
  clickMode = 'once',
  effect = 'scramble',
  scrambleColor = '',
  loop = false,
  loopDelay = 2000,
  hoverRadius = 0,
  ...props
}) {
  const chars = useMemo(() => Array.from(String(text ?? '')), [text]);

  const pool = useMemo(() => {
    const letters = chars.filter(char => !isSpace(char));
    const source = useOriginalCharsOnly ? Array.from(new Set(letters)) : Array.from(characters);
    return source.length ? source : letters;
  }, [useOriginalCharsOnly, chars, characters]);

  const startsHidden = animateOn === 'click' || animateOn === 'view' || animateOn === 'inViewHover';
  const hoverable = animateOn === 'hover' || animateOn === 'inViewHover';
  const local = hoverable && hoverRadius > 0;
  const step = Math.max(16, speed);

  const [frame, setFrame] = useState(() => {
    const revealed = chars.map(char => !startsHidden || isSpace(char));
    return {
      shown: chars.map((char, index) =>
        revealed[index] ? char : pool[(char.codePointAt(0) + index * 7) % pool.length]
      ),
      revealed,
      tint: revealed.map(shown => (shown ? 0 : 1)),
      dim: revealed.map(shown => (shown ? 1 : FADE_FLOOR)),
      squeeze: revealed.map(() => 1)
    };
  });

  const containerRef = useRef(null);
  const cellsRef = useRef([]);
  const centersRef = useRef([]);
  const maskRef = useRef(frame.revealed);
  const heatRef = useRef([]);
  const warmRef = useRef(false);
  const pointerRef = useRef(null);
  const runRef = useRef(null);
  const timerRef = useRef(null);
  const holdRef = useRef(null);
  const pendingRef = useRef(null);
  const visibleRef = useRef(true);
  const targetRef = useRef(!startsHidden);
  const playedRef = useRef(false);
  const previousRef = useRef(frame);
  const engineRef = useRef(null);
  const fontRef = useRef(null);

  const revealOrder = () => {
    const order = [];
    chars.forEach((char, index) => {
      if (!isSpace(char)) order.push(index);
    });
    if (revealDirection === 'end') return order.reverse();
    if (revealDirection === 'center') {
      const middle = Math.floor(chars.length / 2);
      return order.sort((a, b) => Math.abs(a - middle) - Math.abs(b - middle));
    }
    if (revealDirection === 'random') {
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
    }
    return order;
  };

  const fit = (index, glyph) => {
    const node = containerRef.current;
    if (!fontRef.current && node) fontRef.current = readFont(node);
    const metrics = fontRef.current;
    if (!metrics) return 1;
    const room = advance(metrics.font, chars[index] ?? glyph) + metrics.spacing;
    const need = advance(metrics.font, glyph) + metrics.spacing;
    return need > room + 0.01 ? Math.round(Math.max(0.05, room / need) * 1000) / 1000 : 1;
  };

  const paint = () => {
    const mask = maskRef.current;
    const heat = heatRef.current;
    const run = runRef.current;
    const ranks = run?.forward && sequential ? new Map(run.queue.map((index, rank) => [index, rank])) : null;
    const ramp = run?.forward && !sequential ? Math.min(1, run.iteration / Math.max(1, maxIterations)) : 0;
    const next = { shown: [], revealed: [], tint: [], dim: [], squeeze: [] };

    chars.forEach((char, index) => {
      const blank = isSpace(char);
      const hot = blank ? 0 : heat[index] || 0;
      const hidden = !blank && !mask[index];
      const scrambled = hidden || (hot > 0 && Math.random() < hot * 2);

      const glyph = scrambled ? pool[Math.floor(Math.random() * pool.length)] : char;
      next.revealed.push(!scrambled);
      next.shown.push(glyph);
      next.squeeze.push(scrambled ? fit(index, glyph) : 1);

      if (!scrambled) {
        next.tint.push(0);
        next.dim.push(1);
      } else if (!hidden) {
        const level = Math.min(1, hot * 1.5);
        next.tint.push(level);
        next.dim.push(1 - (1 - FADE_FLOOR) * level);
      } else {
        const rank = ranks?.get(index);
        const lift = rank === undefined ? ramp : Math.max(0, 1 - rank / FADE_LEAD);
        next.tint.push(1);
        next.dim.push(FADE_FLOOR + (FADE_PEAK - FADE_FLOOR) * lift);
      }
    });

    setFrame(next);
  };

  const refit = () => {
    setFrame(previous => ({
      ...previous,
      squeeze: previous.shown.map((glyph, index) => (previous.revealed[index] ? 1 : fit(index, glyph)))
    }));
  };

  const stopTicker = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const ensureTicker = () => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => engineRef.current?.tick(), step);
  };

  const stopRun = () => {
    runRef.current = null;
    clearTimeout(holdRef.current);
    holdRef.current = null;
    pendingRef.current = null;
  };

  const schedule = (task, delay) => {
    clearTimeout(holdRef.current);
    holdRef.current = setTimeout(() => {
      holdRef.current = null;
      if (visibleRef.current) task();
      else pendingRef.current = task;
    }, delay);
  };

  const startRun = (forward, { from, cycle = false, lead = 0 } = {}) => {
    stopRun();
    targetRef.current = forward;
    if (from) maskRef.current = from;

    if (prefersReducedMotion()) {
      maskRef.current = chars.map(char => forward || isSpace(char));
      paint();
      return;
    }

    const mask = maskRef.current;
    const order = forward ? revealOrder() : revealOrder().reverse();
    const queue = sequential ? order.filter(index => mask[index] !== forward) : [];

    runRef.current = {
      forward,
      cycle,
      iteration: 0,
      queue: [...new Array(lead).fill(null), ...queue]
    };
    paint();
    ensureTicker();
  };

  const finishRun = run => {
    if (!loop) return;
    if (run.forward) {
      schedule(() => engineRef.current?.startRun(false, { cycle: true }), Math.max(0, loopDelay));
    } else if (run.cycle) {
      startRun(true, { cycle: true, lead: sequential ? Math.max(2, Math.round(320 / step)) : 0 });
    }
  };

  const warm = () => {
    const heat = heatRef.current;
    const pointer = pointerRef.current;
    const box = pointer && containerRef.current ? containerRef.current.getBoundingClientRect() : null;
    const cool = 1 / Math.max(1, maxIterations);
    let active = false;

    chars.forEach((char, index) => {
      if (isSpace(char)) return;
      let target = 0;
      const center = centersRef.current[index];
      if (box && center) {
        const distance =
          Math.hypot(box.left + center.x - pointer.x, box.top + center.y - pointer.y) / Math.max(1, hoverRadius);
        if (distance < 1) target = 1 - distance * distance * (3 - 2 * distance);
      }
      const value = Math.max((heat[index] || 0) - cool, target);
      heat[index] = value > 0.001 ? value : 0;
      if (heat[index] > 0) active = true;
    });

    warmRef.current = active;
  };

  const tick = () => {
    const run = runRef.current;

    if (run) {
      run.iteration += 1;
      let mask = maskRef.current;
      let done;

      if (sequential) {
        const index = run.queue.shift();
        if (index !== undefined && index !== null) {
          mask = mask.slice();
          mask[index] = run.forward;
        }
        done = run.queue.length === 0;
      } else if (run.forward) {
        done = run.iteration >= maxIterations;
        if (done) mask = chars.map(() => true);
      } else {
        const visible = [];
        mask.forEach((shown, index) => {
          if (shown && !isSpace(chars[index])) visible.push(index);
        });
        const hideCount = Math.max(
          1,
          Math.ceil(chars.filter(char => !isSpace(char)).length / Math.max(1, maxIterations))
        );
        mask = mask.slice();
        for (let i = 0; i < hideCount && visible.length; i++) {
          mask[visible.splice(Math.floor(Math.random() * visible.length), 1)[0]] = false;
        }
        done = visible.length === 0 || run.iteration >= maxIterations;
        if (done) mask = chars.map(char => isSpace(char));
      }

      maskRef.current = mask;
      if (done) {
        runRef.current = null;
        finishRun(run);
      }
    }

    if (local) warm();
    else warmRef.current = false;

    paint();
    if (!runRef.current && !warmRef.current) stopTicker();
  };

  const measure = () => {
    const node = containerRef.current;
    if (!node) return;
    const box = node.getBoundingClientRect();
    centersRef.current = chars.map((char, index) => {
      const cell = cellsRef.current[index];
      if (isSpace(char) || !cell) return null;
      const rect = cell.getBoundingClientRect();
      return { x: rect.left - box.left + rect.width / 2, y: rect.top - box.top + rect.height / 2 };
    });
  };

  useIsomorphicLayoutEffect(() => {
    engineRef.current = { tick, paint, startRun, stopRun, ensureTicker, refit };
  });

  useIsomorphicLayoutEffect(() => {
    const engine = engineRef.current;
    engine.stopRun();
    playedRef.current = false;
    const hidden =
      animateOn === 'click' || ((animateOn === 'view' || animateOn === 'inViewHover') && !prefersReducedMotion());
    targetRef.current = !hidden;
    maskRef.current = chars.map(char => !hidden || isSpace(char));
    heatRef.current = chars.map(() => 0);
    pointerRef.current = null;
    engine.paint();
  }, [animateOn, chars]);

  useEffect(
    () => () => {
      clearInterval(timerRef.current);
      clearTimeout(holdRef.current);
    },
    []
  );

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => {
      const metrics = readFont(node);
      glyphWidths.delete(metrics.font);
      fontRef.current = metrics;
      engineRef.current?.refit();
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!timerRef.current) return;
    clearInterval(timerRef.current);
    timerRef.current = null;
    engineRef.current?.ensureTicker();
  }, [step]);

  useEffect(() => {
    if (loop) return;
    clearTimeout(holdRef.current);
    holdRef.current = null;
    pendingRef.current = null;
  }, [loop]);

  useEffect(() => {
    const viewTrigger = animateOn === 'view' || animateOn === 'inViewHover';
    if (!viewTrigger && !loop) return;
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.some(entry => entry.isIntersecting);
        visibleRef.current = visible;
        if (!visible) return;
        if (viewTrigger && !playedRef.current) {
          playedRef.current = true;
          engineRef.current?.startRun(true);
        }
        const resume = pendingRef.current;
        pendingRef.current = null;
        resume?.();
        if (!loop) observer.disconnect();
      },
      { threshold: 0.1 }
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      visibleRef.current = true;
    };
  }, [animateOn, loop, chars]);

  useIsomorphicLayoutEffect(() => {
    const previous = previousRef.current;
    previousRef.current = frame;
    if (effect !== 'flip' || previous.shown === frame.shown || prefersReducedMotion()) return;
    frame.revealed.forEach((revealed, index) => {
      const node = cellsRef.current[index];
      if (!node || typeof node.animate !== 'function' || isSpace(chars[index] ?? ' ')) return;
      if (!revealed) {
        node.animate(flipFrames(58 + Math.random() * 26, 0.3), {
          duration: Math.min(step * 0.92, 240),
          easing: 'cubic-bezier(0.3, 0.7, 0.4, 1)'
        });
      } else if (previous.revealed[index] === false) {
        node.animate(flipFrames(90, 0), {
          duration: Math.min(Math.max(step * 7, 360), 760),
          easing: 'cubic-bezier(0.34, 1.45, 0.64, 1)'
        });
      }
    });
  }, [frame, effect, chars, step]);

  const trackPointer = event => {
    if (prefersReducedMotion()) return;
    if (!pointerRef.current) measure();
    pointerRef.current = { x: event.clientX, y: event.clientY };
    ensureTicker();
  };

  const handleMouseEnter = event => {
    if (local) {
      trackPointer(event);
      return;
    }
    if (runRef.current) return;
    startRun(true, { from: chars.map(char => isSpace(char)) });
  };

  const handleMouseMove = event => {
    if (local) trackPointer(event);
  };

  const handleMouseLeave = () => {
    if (local) {
      pointerRef.current = null;
      return;
    }
    stopRun();
    targetRef.current = true;
    maskRef.current = chars.map(() => true);
    paint();
    if (loop && animateOn === 'inViewHover') {
      schedule(() => engineRef.current?.startRun(false, { cycle: true }), Math.max(0, loopDelay));
    }
  };

  const handleClick = () => {
    if (clickMode === 'toggle') {
      startRun(!targetRef.current);
      return;
    }
    if (!targetRef.current) startRun(true);
  };

  const groups = useMemo(() => {
    const result = [];
    let word = null;
    chars.forEach((char, index) => {
      if (isSpace(char)) {
        result.push(char);
        word = null;
        return;
      }
      if (!word) {
        word = { key: index, letters: [] };
        result.push(word);
      }
      word.letters.push(index);
    });
    return result;
  }, [chars]);

  const tinted = Boolean(scrambleColor);
  const fading = effect === 'fade';
  const flipping = effect === 'flip';
  const settles = tinted || fading;

  const glyphStyle = index => {
    const squeeze = frame.squeeze[index] ?? 1;
    return squeeze < 1 ? { ...styles.glyph, transform: `translateX(-50%) scaleX(${squeeze})` } : styles.glyph;
  };

  const cellStyle = (index, revealed) => {
    const style = revealed && !flipping ? {} : { ...styles.cell };
    if (settles) style.transition = revealed ? SETTLE : `color 0.12s linear, opacity ${step}ms linear`;
    if (tinted && !revealed) {
      const amount = Math.round((frame.tint[index] ?? 1) * 100);
      style.color = amount >= 100 ? scrambleColor : `color-mix(in srgb, ${scrambleColor} ${amount}%, currentColor)`;
    }
    if (fading) style.opacity = revealed ? 1 : (frame.dim[index] ?? FADE_FLOOR);
    return style;
  };

  const animateProps = hoverable
    ? { onMouseEnter: handleMouseEnter, onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave }
    : animateOn === 'click'
      ? { onClick: handleClick }
      : {};

  return (
    <motion.span className={parentClassName} ref={containerRef} style={styles.wrapper} {...animateProps} {...props}>
      <span style={styles.srOnly}>{chars.join('')}</span>

      <span aria-hidden="true">
        {groups.map(group =>
          typeof group === 'string' ? (
            group
          ) : (
            <span key={group.key} style={styles.word}>
              {group.letters.map(index => {
                const char = chars[index];
                const revealed = frame.revealed[index] ?? true;
                return (
                  <span
                    key={index}
                    ref={node => {
                      cellsRef.current[index] = node;
                    }}
                    className={revealed ? className : encryptedClassName}
                    style={cellStyle(index, revealed)}
                  >
                    {revealed ? (
                      char
                    ) : (
                      <>
                        <span style={styles.ghost}>{char}</span>
                        <span style={glyphStyle(index)}>{frame.shown[index] ?? char}</span>
                      </>
                    )}
                  </span>
                );
              })}
            </span>
          )
        )}
      </span>
    </motion.span>
  );
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import and render the component using the usage example above as a starting point.
4. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.


## Integrate the <RotatingText /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: RotatingText
### Variant: JavaScript + CSS
### Dependencies: motion

---

### Usage Example
```jsx
import RotatingText from './RotatingText';

<RotatingText
  texts={['React', 'Bits', 'Is', 'Cool!']}
  effect="slide"
  direction="up"
  highlight={true}
  highlightColor="#a855f7"
  staggerFrom="last"
  staggerDuration={0.025}
  splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
  rotationInterval={2000}
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| texts | string[] | [] | The texts to rotate through. |
| effect | 'slide' | 'flip' | 'blur' | 'scale' | 'drop' | "slide" | How letters swap. Flip rolls them over like a drum, blur dissolves them, scale zooms through and drop lets them fall in with a small bounce. |
| direction | 'up' | 'down' | "up" | Which way letters travel. Drop always falls from above. |
| highlight | boolean | false | Puts the rotating text on a colored block that smoothly resizes to fit each new text, with a text color picked for contrast. |
| highlightColor | string | "#a855f7" | Color of the highlight block. Hex or rgb colors also set a readable text color automatically. |
| rotationInterval | number | 2000 | Time each text stays on screen, in milliseconds. |
| blur | number | 0 | Blurs letters as they come and go, in px. The blur effect uses 10 when this is 0. |
| staggerDuration | number | 0 | Delay between letters, in seconds. |
| staggerFrom | 'first' | 'last' | 'center' | 'random' | number | "first" | Which letter moves first. A number starts from that letter, random shuffles the order. |
| splitBy | 'characters' | 'words' | 'lines' | string | "characters" | How each text is split into moving pieces. Any other string is used as the separator. |
| loop | boolean | true | Goes back to the first text after the last one. |
| auto | boolean | true | Rotates on its own. Turn off to drive it with the ref methods. |
| pauseOnHover | boolean | false | Holds the current text while the pointer is over it. |
| initial | object | - | Overrides the state each letter enters from. Leave unset to use the effect. |
| animate | object | - | Overrides the state each letter settles into. |
| exit | object | - | Overrides the state each letter leaves to. |
| transition | object | - | Overrides the Motion transition used for every letter. Each effect brings its own by default. |
| animatePresenceMode | 'wait' | 'sync' | "wait" | 'wait' lets the old text leave before the new one enters, 'sync' runs both at once. |
| animatePresenceInitial | boolean | false | Animates the first text in on mount. |
| onNext | (index: number) => void | undefined | Called with the new index whenever the text changes. |
| mainClassName | string | '' | Extra class names for the outer element. |
| splitLevelClassName | string | '' | Extra class names for each group of letters. Add overflow hidden here for a masked slide. |
| elementLevelClassName | string | '' | Extra class names for each moving letter. |

### Full Component Source
```jsx
'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  motion,
  AnimatePresence,
  MotionConfig,
  animate as animateValue,
  useMotionValue,
  useReducedMotion
} from 'motion/react';

import './RotatingText.css';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const segmenter =
  typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter('en', { granularity: 'grapheme' }) : null;

const splitIntoCharacters = text =>
  segmenter ? Array.from(segmenter.segment(text), segment => segment.segment) : Array.from(text);

const withFilter = (state, filter) =>
  state && typeof state === 'object' && !Array.isArray(state) ? { ...state, filter } : state;

const LAYOUT_SPRING = { type: 'spring', damping: 25, stiffness: 300 };
const WIDTH_SPRING = { type: 'spring', damping: 34, stiffness: 320 };
const FLIP_STYLE = { transformOrigin: '50% 50% -0.45em', backfaceVisibility: 'hidden' };

const EFFECTS = {
  slide: up => ({
    initial: { y: up ? '100%' : '-100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: up ? '-120%' : '120%', opacity: 0 },
    transition: { type: 'spring', damping: 25, stiffness: 300 }
  }),
  flip: up => ({
    initial: { rotateX: up ? -90 : 90, opacity: 0, transformPerspective: 480 },
    animate: { rotateX: 0, opacity: 1, transformPerspective: 480 },
    exit: { rotateX: up ? 90 : -90, opacity: 0, transformPerspective: 480 },
    transition: { type: 'tween', duration: 0.6, ease: [0.34, 1.4, 0.64, 1] },
    exitTransition: { type: 'tween', duration: 0.32, ease: [0.5, 0, 0.75, 0] }
  }),
  blur: up => ({
    initial: { y: up ? '45%' : '-45%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: up ? '-45%' : '45%', opacity: 0 },
    transition: { type: 'tween', duration: 0.55, ease: [0.22, 1, 0.36, 1] }
  }),
  scale: up => ({
    initial: { scale: up ? 0.35 : 1.7, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: up ? 1.7 : 0.35, opacity: 0 },
    transition: { type: 'spring', damping: 17, stiffness: 240 }
  }),
  drop: () => ({
    initial: { y: '-110%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '110%', opacity: 0 },
    transition: { type: 'spring', damping: 18, stiffness: 320, mass: 0.9 },
    exitTransition: { type: 'tween', duration: 0.3, ease: [0.55, 0, 1, 0.45] }
  })
};

const readableText = color => {
  const value = String(color ?? '').trim();
  let rgb = null;
  const hex = value.match(/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
  if (hex) {
    const digits = hex[1].length < 6 ? [...hex[1].slice(0, 3)].map(c => c + c).join('') : hex[1].slice(0, 6);
    rgb = [0, 2, 4].map(i => parseInt(digits.slice(i, i + 2), 16));
  } else {
    const fn = value.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
    if (fn) rgb = fn.slice(1, 4).map(Number);
  }
  if (!rgb) return undefined;
  const [r, g, b] = rgb.map(channel => {
    const c = Math.min(Math.max(channel / 255, 0), 1);
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.3 ? '#0b0b0c' : '#ffffff';
};

const RotatingText = forwardRef((props, ref) => {
  const {
    texts,
    transition,
    initial,
    animate,
    exit,
    effect = 'slide',
    direction = 'up',
    highlight = false,
    highlightColor = '#a855f7',
    animatePresenceMode = 'wait',
    animatePresenceInitial = false,
    rotationInterval = 2000,
    staggerDuration = 0,
    staggerFrom = 'first',
    loop = true,
    auto = true,
    pauseOnHover = false,
    blur = 0,
    splitBy = 'characters',
    onNext,
    onMouseEnter,
    onMouseLeave,
    mainClassName,
    splitLevelClassName,
    elementLevelClassName,
    style,
    ...rest
  } = props;

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const indexRef = useRef(0);
  const onNextRef = useRef(onNext);
  onNextRef.current = onNext;

  const contentRef = useRef(null);
  const width = useMotionValue('auto');
  const reduceMotion = useReducedMotion();

  const lastIndex = Math.max(texts.length - 1, 0);
  const activeIndex = Math.min(currentTextIndex, lastIndex);

  const elements = useMemo(() => {
    const currentText = texts[activeIndex] ?? '';
    if (splitBy === 'characters') {
      const words = currentText.split(' ');
      return words.map((word, i) => ({
        characters: splitIntoCharacters(word),
        needsSpace: i !== words.length - 1
      }));
    }
    if (splitBy === 'words') {
      return currentText.split(' ').map((word, i, arr) => ({
        characters: [word],
        needsSpace: i !== arr.length - 1
      }));
    }
    if (splitBy === 'lines') {
      return currentText.split('\n').map((line, i, arr) => ({
        characters: [line],
        needsSpace: i !== arr.length - 1
      }));
    }

    return currentText.split(splitBy).map((part, i, arr) => ({
      characters: [part],
      needsSpace: i !== arr.length - 1
    }));
  }, [texts, activeIndex, splitBy]);

  const order = useMemo(() => {
    const total = elements.reduce((sum, word) => sum + word.characters.length, 0);
    const shuffled = Array.from({ length: total }, (_, i) => i).sort(() => Math.random() - 0.5);
    return { total, shuffled };
  }, [elements]);

  const getStaggerDelay = index => {
    const { total, shuffled } = order;
    if (staggerFrom === 'first') return index * staggerDuration;
    if (staggerFrom === 'last') return (total - 1 - index) * staggerDuration;
    if (staggerFrom === 'center') return Math.abs(Math.floor(total / 2) - index) * staggerDuration;
    if (staggerFrom === 'random') return shuffled[index] * staggerDuration;
    return Math.abs(staggerFrom - index) * staggerDuration;
  };

  const goTo = useCallback(index => {
    if (index === indexRef.current) return;
    indexRef.current = index;
    setCurrentTextIndex(index);
    onNextRef.current?.(index);
  }, []);

  const next = useCallback(() => {
    const current = Math.min(indexRef.current, lastIndex);
    goTo(current < lastIndex ? current + 1 : loop ? 0 : current);
  }, [lastIndex, loop, goTo]);

  const previous = useCallback(() => {
    const current = Math.min(indexRef.current, lastIndex);
    goTo(current > 0 ? current - 1 : loop ? lastIndex : current);
  }, [lastIndex, loop, goTo]);

  const jumpTo = useCallback(index => goTo(Math.max(0, Math.min(index, lastIndex))), [lastIndex, goTo]);

  const reset = useCallback(() => goTo(0), [goTo]);

  useImperativeHandle(
    ref,
    () => ({
      next,
      previous,
      jumpTo,
      reset
    }),
    [next, previous, jumpTo, reset]
  );

  const paused = pauseOnHover && hovered;

  useEffect(() => {
    if (!auto || paused) return;
    const timeoutId = setTimeout(next, rotationInterval);
    return () => clearTimeout(timeoutId);
  }, [next, rotationInterval, auto, paused, activeIndex]);

  useIsomorphicLayoutEffect(() => {
    const content = contentRef.current;
    if (!highlight || !content) {
      width.set('auto');
      return undefined;
    }
    let controls = null;
    let settled = false;
    const fit = () => {
      const target = content.offsetWidth + 1;
      controls?.stop();
      if (!settled || reduceMotion) {
        settled = true;
        width.set(target);
        return;
      }
      controls = animateValue(width, target, WIDTH_SPRING);
    };
    fit();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(fit) : null;
    observer?.observe(content);
    return () => {
      observer?.disconnect();
      controls?.stop();
    };
  }, [highlight, reduceMotion, width]);

  const handleMouseEnter = event => {
    if (pauseOnHover) setHovered(true);
    onMouseEnter?.(event);
  };

  const handleMouseLeave = event => {
    setHovered(false);
    onMouseLeave?.(event);
  };

  const motionPreset = (EFFECTS[effect] ?? EFFECTS.slide)(direction !== 'down');
  const blurAmount = blur > 0 ? blur : effect === 'blur' ? 10 : 0;
  const enterState = initial ?? motionPreset.initial;
  const restState = animate ?? motionPreset.animate;
  const leaveState = exit ?? motionPreset.exit;
  const charTransition = transition ?? motionPreset.transition;
  const exitTransition = transition || exit ? null : motionPreset.exitTransition;
  const enterFrom = blurAmount > 0 ? withFilter(enterState, `blur(${blurAmount}px)`) : enterState;
  const enterTo = blurAmount > 0 ? withFilter(restState, 'blur(0px)') : restState;
  const leaveTo = blurAmount > 0 ? withFilter(leaveState, `blur(${blurAmount}px)`) : leaveState;
  const charStyle = effect === 'flip' ? FLIP_STYLE : undefined;

  const blockStyle = highlight
    ? { ...style, width, backgroundColor: highlightColor, color: readableText(highlightColor) ?? style?.color }
    : style;

  const presence = (
    <AnimatePresence mode={animatePresenceMode} initial={animatePresenceInitial}>
      <motion.span
        key={activeIndex}
        className={cn(splitBy === 'lines' ? 'text-rotate-lines' : 'text-rotate')}
        layout={!highlight}
        aria-hidden="true"
      >
        {elements.map((wordObj, wordIndex, array) => {
          const previousCharsCount = array.slice(0, wordIndex).reduce((sum, word) => sum + word.characters.length, 0);
          return (
            <span key={wordIndex} className={cn('text-rotate-word', splitLevelClassName)}>
              {wordObj.characters.map((char, charIndex) => {
                const delay = getStaggerDelay(previousCharsCount + charIndex);
                return (
                  <motion.span
                    key={charIndex}
                    initial={enterFrom}
                    animate={enterTo}
                    exit={exitTransition ? { ...leaveTo, transition: { ...exitTransition, delay } } : leaveTo}
                    transition={{ ...charTransition, delay }}
                    className={cn('text-rotate-element', elementLevelClassName)}
                    style={charStyle}
                  >
                    {char}
                  </motion.span>
                );
              })}
              {wordObj.needsSpace && <span className="text-rotate-space"> </span>}
            </span>
          );
        })}
      </motion.span>
    </AnimatePresence>
  );

  return (
    <MotionConfig reducedMotion="user">
      <motion.span
        className={cn('text-rotate', highlight && 'text-rotate-highlight', mainClassName)}
        {...rest}
        style={blockStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        layout={!highlight}
        transition={transition ?? LAYOUT_SPRING}
      >
        <span className="text-rotate-sr-only">{texts[activeIndex]}</span>
        {highlight ? (
          <span ref={contentRef} className="text-rotate-highlight-content">
            {presence}
          </span>
        ) : (
          presence
        )}
      </motion.span>
    </MotionConfig>
  );
});

RotatingText.displayName = 'RotatingText';
export default RotatingText;

```

### Component CSS
```css
.text-rotate {
  display: flex;
  flex-wrap: wrap;
  white-space: pre-wrap;
  position: relative;
}

.text-rotate-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.text-rotate-word {
  display: inline-flex;
}

.text-rotate-lines {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.text-rotate-element {
  display: inline-block;
}

.text-rotate-space {
  white-space: pre;
}

.text-rotate-highlight {
  box-sizing: content-box;
  flex-wrap: nowrap;
  justify-content: center;
  overflow: hidden;
  padding: 0.1em 0.28em;
  border-radius: 0.16em;
}

.text-rotate-highlight-content {
  display: flex;
  flex-shrink: 0;
  white-space: pre;
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.


## Integrate the <VariableProximity /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: VariableProximity
### Variant: JavaScript + CSS


---

### Usage Example
```jsx
import { useRef } from 'react';
import VariableProximity from './VariableProximity';

const containerRef = useRef(null);

<div
ref={containerRef}
style={{position: 'relative'}}
>
  <VariableProximity
    label={'Hover me! And then star React Bits on GitHub, or else...'}
    className={'variable-proximity-demo'}
    fromFontVariationSettings="'wght' 400, 'opsz' 9"
    toFontVariationSettings="'wght' 1000, 'opsz' 40"
    containerRef={containerRef}
    radius={100}
    falloff='linear'
    smoothing={0.2}
    scale={1}
    lift={0}
    idleWave={false}
    fontSize={64}
  />
</div>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | string | "" | The text content to display. |
| fromFontVariationSettings | string | 'wght' 400, 'opsz' 9 | The variation settings letters rest at, away from the cursor. |
| toFontVariationSettings | string | 'wght' 1000, 'opsz' 40 | The variation settings to reach at cursor proximity. |
| containerRef | RefObject<HTMLElement> | undefined | Optional element around the text. Letters skip their distance checks while the cursor is farther than the radius from it. |
| radius | number | 50 | Proximity radius to influence the effect. |
| falloff | 'linear' | 'exponential' | 'gaussian' | "linear" | Type of falloff for the effect. |
| smoothing | number | 0.2 | How gently letters ease toward their new settings, from 0 (instant) to 1 (a slow, trailing wake). |
| fromColor | string | undefined | Color letters rest at. Leave unset to keep the text color. |
| toColor | string | undefined | Color letters shift toward as the cursor gets close. Leave unset to keep the text color. |
| scale | number | 1 | Size a letter grows to right under the cursor. 1 keeps letters at their normal size. |
| lift | number | 0 | How far, in em, a letter right under the cursor rises. |
| idleWave | boolean | false | While the cursor is away, a gentle wave of weight travels across the text. It fades out as the cursor comes near. |
| fontSize | number | string | undefined | Font size of the text. Numbers are pixels. Inherits the surrounding size when unset. |

### Full Component Source
```jsx
'use client';

import { Fragment, forwardRef, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import './VariableProximity.css';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const GAUSSIAN_EDGE = Math.exp(-2);
const WAVE_PERIOD = 3.2;
const WAVE_PEAK = 0.7;

const parseSettings = settings =>
  new Map(
    settings
      .split(',')
      .map(part => part.trim())
      .filter(Boolean)
      .map(part => {
        const [name, value] = part.split(/\s+/);
        return [name.replace(/['"]/g, ''), parseFloat(value)];
      })
  );

const strengthAt = (distance, radius, falloff) => {
  if (distance >= radius) return 0;
  const norm = 1 - distance / radius;
  switch (falloff) {
    case 'exponential':
      return norm * norm;
    case 'gaussian':
      return (Math.exp(-2 * (distance / radius) ** 2) - GAUSSIAN_EDGE) / (1 - GAUSSIAN_EDGE);
    case 'linear':
    default:
      return norm;
  }
};

const VariableProximity = forwardRef((props, ref) => {
  const {
    label = '',
    fromFontVariationSettings = "'wght' 400, 'opsz' 9",
    toFontVariationSettings = "'wght' 1000, 'opsz' 40",
    containerRef,
    radius = 50,
    falloff = 'linear',
    smoothing = 0.2,
    fromColor,
    toColor,
    scale = 1,
    lift = 0,
    idleWave = false,
    fontSize,
    className = '',
    onClick,
    style,
    ...restProps
  } = props;

  const rootRef = useRef(null);
  const letterRefs = useRef([]);
  const stateRef = useRef({ pointer: { x: 0, y: 0, active: false }, levels: [], targets: [] });
  const [lineStarts, setLineStarts] = useState(null);

  const setRoot = useCallback(
    node => {
      rootRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref]
  );

  const axes = useMemo(() => {
    const fromSettings = parseSettings(fromFontVariationSettings);
    const toSettings = parseSettings(toFontVariationSettings);
    return Array.from(fromSettings.entries()).map(([axis, fromValue]) => ({
      axis,
      fromValue,
      toValue: toSettings.get(axis) ?? fromValue
    }));
  }, [fromFontVariationSettings, toFontVariationSettings]);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let frame = 0;
    let live = true;
    let lastWidth = -1;

    const measure = () => {
      frame = 0;
      if (!live) return;
      const words = Array.from(root.querySelectorAll('[data-word]'));
      const breaks = Array.from(root.querySelectorAll('br'));
      const letters = letterRefs.current.filter(Boolean);
      const saved = letters.map(letter => letter.style.fontVariationSettings);
      const wrap = root.style.whiteSpace;
      root.style.whiteSpace = 'normal';
      breaks.forEach(node => (node.style.display = 'none'));
      letters.forEach(letter => (letter.style.fontVariationSettings = fromFontVariationSettings));
      const starts = [];
      let lastTop = null;
      words.forEach((word, index) => {
        const top = word.getBoundingClientRect().top;
        if (lastTop !== null && top > lastTop + 2) starts.push(index);
        lastTop = top;
      });
      letters.forEach((letter, index) => (letter.style.fontVariationSettings = saved[index]));
      breaks.forEach(node => (node.style.display = ''));
      root.style.whiteSpace = wrap;
      const key = starts.join(',');
      setLineStarts(previous => (previous === key ? previous : key));
    };

    const queue = entries => {
      const width = entries?.[0]?.contentRect.width;
      if (width !== undefined) {
        if (Math.abs(width - lastWidth) < 1) return;
        lastWidth = width;
      }
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    const parent = root.parentElement;
    const observer = parent && typeof ResizeObserver !== 'undefined' ? new ResizeObserver(queue) : null;
    if (parent) observer?.observe(parent);
    document.fonts?.ready.then(() => queue());

    return () => {
      live = false;
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [label, fromFontVariationSettings, fontSize]);

  useEffect(() => {
    const { pointer, levels, targets } = stateRef.current;
    const written = [];
    const painted = [];
    const moved = [];
    const anchors = [];
    const tinted = Boolean(fromColor || toColor);
    const restColor = fromColor || 'currentColor';
    const nearColor = toColor || 'currentColor';
    const growth = (Number(scale) || 1) - 1;
    const rise = Number(lift) || 0;
    const transformed = growth !== 0 || rise !== 0;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const waving = idleWave && !reduced;
    let frame = 0;
    let lastTime = 0;
    let dirty = true;
    let layoutDirty = true;
    let nearAny = false;
    let lastNear = -Infinity;
    let waveMix = 0;
    let span = 1;
    let visible = true;

    letterRefs.current.forEach(letter => {
      if (!letter) return;
      if (!tinted) letter.style.color = '';
      if (!transformed) letter.style.transform = '';
    });

    const settingsAt = level =>
      axes.map(({ axis, fromValue, toValue }) => `'${axis}' ${fromValue + (toValue - fromValue) * level}`).join(', ');

    const measureAnchors = () => {
      const letters = letterRefs.current;
      let left = Infinity;
      let top = Infinity;
      let right = -Infinity;
      letters.forEach((letter, index) => {
        if (!letter) return;
        const rect = letter.getBoundingClientRect();
        anchors[index] = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        left = Math.min(left, rect.left);
        top = Math.min(top, rect.top);
        right = Math.max(right, rect.right);
      });
      anchors.forEach(anchor => {
        anchor.x -= left;
        anchor.y -= top;
      });
      span = Math.max(220, (right - left) * 0.85);
    };

    const measure = () => {
      const letters = letterRefs.current;
      targets.length = letters.length;
      targets.fill(0);
      nearAny = false;
      if (!pointer.active) return;

      const area = containerRef?.current?.getBoundingClientRect();
      if (area) {
        const dx = Math.max(area.left - pointer.x, 0, pointer.x - area.right);
        const dy = Math.max(area.top - pointer.y, 0, pointer.y - area.bottom);
        if (dx * dx + dy * dy >= radius * radius) return;
      }

      letters.forEach((letter, index) => {
        if (!letter) return;
        const rect = letter.getBoundingClientRect();
        const distance = Math.hypot(pointer.x - (rect.left + rect.width / 2), pointer.y - (rect.top + rect.height / 2));
        targets[index] = strengthAt(distance, radius, falloff);
        if (targets[index] > 0) nearAny = true;
      });
    };

    const waveAt = (index, time) => {
      const anchor = anchors[index];
      if (!anchor) return 0;
      const phase = ((anchor.x + anchor.y * 0.6) / span - time / WAVE_PERIOD) * Math.PI * 2;
      return WAVE_PEAK * ((1 + Math.cos(phase)) / 2) ** 2.2;
    };

    const tick = now => {
      frame = 0;
      const delta = lastTime ? Math.min(now - lastTime, 64) : 16;
      lastTime = now;

      if (dirty) {
        measure();
        dirty = false;
      }
      if (waving && layoutDirty) {
        measureAnchors();
        layoutDirty = false;
      }

      if (nearAny) lastNear = now;
      const idle = waving && visible && !nearAny && now - lastNear > 500;
      const goal = idle ? 1 : 0;
      waveMix += (goal - waveMix) * (1 - Math.exp(-delta / 600));
      if (Math.abs(goal - waveMix) < 0.002) waveMix = goal;

      const ease = smoothing > 0 ? 1 - Math.exp(-delta / (smoothing * 400)) : 1;
      const time = now / 1000;
      let settling = false;

      letterRefs.current.forEach((letter, index) => {
        if (!letter) return;
        let target = targets[index] ?? 0;
        if (waveMix > 0) target = Math.max(target, waveMix * waveAt(index, time));
        const current = levels[index] ?? 0;
        let next = current + (target - current) * ease;
        if (Math.abs(target - next) < 0.002) {
          next = target;
        } else {
          settling = true;
        }
        levels[index] = next;

        const settings = next === 0 ? fromFontVariationSettings : settingsAt(next);
        if (written[index] !== settings) {
          written[index] = settings;
          letter.style.fontVariationSettings = settings;
        }

        if (tinted) {
          const paint =
            next === 0
              ? fromColor || ''
              : `color-mix(in oklab, ${restColor} ${((1 - next) * 100).toFixed(1)}%, ${nearColor})`;
          if (painted[index] !== paint) {
            painted[index] = paint;
            letter.style.color = paint;
          }
        }

        if (transformed) {
          const shift =
            next === 0 ? '' : `translateY(${(-rise * next).toFixed(3)}em) scale(${(1 + growth * next).toFixed(3)})`;
          if (moved[index] !== shift) {
            moved[index] = shift;
            letter.style.transform = shift;
          }
        }
      });

      if (settling || waveMix > 0 || (waving && visible && !nearAny)) {
        frame = requestAnimationFrame(tick);
      } else {
        lastTime = 0;
      }
    };

    const schedule = () => {
      dirty = true;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const relayout = () => {
      layoutDirty = true;
      schedule();
    };

    const handleMove = (x, y) => {
      pointer.x = x;
      pointer.y = y;
      pointer.active = true;
      schedule();
    };

    const handleMouseMove = event => handleMove(event.clientX, event.clientY);
    const handleTouchMove = event => {
      const touch = event.touches[0];
      if (touch) handleMove(touch.clientX, touch.clientY);
    };
    const handleLeave = () => {
      pointer.active = false;
      schedule();
    };

    const root = document.documentElement;
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleLeave);
    window.addEventListener('touchcancel', handleLeave);
    window.addEventListener('scroll', schedule, { capture: true, passive: true });
    window.addEventListener('resize', relayout);
    root.addEventListener('mouseleave', handleLeave);

    let observer = null;
    if (waving && rootRef.current && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        visible = entries.some(entry => entry.isIntersecting);
        schedule();
      });
      observer.observe(rootRef.current);
    }
    if (waving) document.fonts?.ready.then(relayout);

    schedule();

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleLeave);
      window.removeEventListener('touchcancel', handleLeave);
      window.removeEventListener('scroll', schedule, { capture: true });
      window.removeEventListener('resize', relayout);
      root.removeEventListener('mouseleave', handleLeave);
    };
  }, [
    axes,
    fromFontVariationSettings,
    containerRef,
    radius,
    falloff,
    smoothing,
    fromColor,
    toColor,
    scale,
    lift,
    idleWave,
    fontSize,
    label,
    lineStarts
  ]);

  const words = label.split(' ');
  const breakSet = new Set(lineStarts ? lineStarts.split(',').map(Number) : []);
  let letterIndex = 0;

  return (
    <span
      ref={setRoot}
      className={`${className} variable-proximity`}
      onClick={onClick}
      style={{
        display: 'inline',
        ...(fontSize !== undefined ? { fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize } : {}),
        ...(lineStarts !== null ? { whiteSpace: 'nowrap' } : {}),
        ...style
      }}
      {...restProps}
    >
      {words.map((word, wordIndex) => (
        <Fragment key={wordIndex}>
          {breakSet.has(wordIndex) && <br />}
          <span data-word="" style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            {word.split('').map(letter => {
              const currentLetterIndex = letterIndex++;
              return (
                <span
                  key={currentLetterIndex}
                  ref={el => {
                    letterRefs.current[currentLetterIndex] = el;
                  }}
                  style={{
                    display: 'inline-block',
                    fontVariationSettings: fromFontVariationSettings,
                    color: fromColor || undefined,
                    transformOrigin: '50% 80%'
                  }}
                  aria-hidden="true"
                >
                  {letter}
                </span>
              );
            })}
            {wordIndex < words.length - 1 && <span style={{ display: 'inline-block' }}>&nbsp;</span>}
          </span>
        </Fragment>
      ))}
      <span className="sr-only">{label}</span>
    </span>
  );
});

VariableProximity.displayName = 'VariableProximity';
export default VariableProximity;

```

### Component CSS
```css
@import url('https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap');

.variable-proximity {
  font-family: 'Roboto Flex', sans-serif;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.



## Integrate the <ScrollExpand /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: ScrollExpand
### Variant: JavaScript + CSS


---

### Usage Example
```jsx
import ScrollExpand from './ScrollExpand';

<ScrollExpand
  src="/hero.jpg"
  alt="Product hero"
  title="Built to scale"
  scrollHint="Scroll"
  useWindowScroll
>
  <h2>Every pixel, everywhere</h2>
  <p>The frame opens up as you scroll and hands the whole stage to your media.</p>
</ScrollExpand>

<div style={{ height: '520px' }}>
  <ScrollExpand src="/hero.jpg" title="Built to scale" mediaZoom={1.35} />
</div>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| src | string | '' | Image or video URL shown inside the frame. |
| mediaType | "image" | "video" | "image" | Whether the source is an image or a looping muted video. |
| poster | string | '' | Poster frame used while a video loads. |
| alt | string | '' | Alt text for the image. |
| title | string | '' | Headline held over the frame that lifts away as the media takes over. |
| scrollHint | string | '' | Small cue shown under the resting frame that fades away as soon as the scroll begins. |
| startWidth | number | 42 | Frame width before expanding, as a percentage of the stage. |
| startHeight | number | 58 | Frame height before expanding, as a percentage of the stage. |
| startRadius | number | 24 | Corner radius of the resting frame, in px. |
| endRadius | number | 0 | Corner radius once fully expanded, in px. |
| mediaZoom | number | 1.35 | How far the media is zoomed in at rest. It eases back to 1 as the frame opens up. |
| scrollDistance | number | 1.2 | Scroll length of the expansion, in multiples of the stage height. |
| holdDistance | number | 0.35 | Extra scroll the frame stays pinned at full bleed before releasing. |
| smoothing | number | 0.1 | Follow time in seconds. 0 locks the frame exactly to the scrollbar. |
| overlayScrim | number | 0.45 | Strength of the gradient scrim that fades in to keep overlay content readable. |
| useWindowScroll | boolean | false | Drive the expansion from the page scroll instead of the component’s own scroller. |
| enabled | boolean | true | Enable or disable the expansion. |
| children | React.ReactNode | — | Content that fades in over the media once it reaches full bleed. |
| className | string | '' | Additional class names for the container. |
| style | object | — | Inline styles for the container. |

### Full Component Source
```jsx
'use client';

import { useCallback, useEffect, useRef } from 'react';

import './ScrollExpand.css';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

const smoothstep = (edge0, edge1, x) => {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1e-6), 0, 1);
  return t * t * (3 - 2 * t);
};

const ScrollExpand = ({
  src = '',
  mediaType = 'image',
  poster = '',
  alt = '',
  title = '',
  scrollHint = '',
  startWidth = 42,
  startHeight = 58,
  startRadius = 24,
  endRadius = 0,
  mediaZoom = 1.35,
  scrollDistance = 1.2,
  holdDistance = 0.35,
  smoothing = 0.1,
  overlayScrim = 0.45,
  useWindowScroll = false,
  enabled = true,
  children,
  className = '',
  style,
  ...rest
}) => {
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const frameRef = useRef(null);
  const mediaRef = useRef(null);
  const titleRef = useRef(null);
  const overlayRef = useRef(null);
  const scrimRef = useRef(null);
  const hintRef = useRef(null);

  const propsRef = useRef({});
  propsRef.current = {
    startWidth,
    startHeight,
    startRadius,
    endRadius,
    mediaZoom,
    scrollDistance,
    holdDistance,
    smoothing,
    overlayScrim,
    useWindowScroll,
    enabled
  };

  const applyProgress = useCallback(p => {
    const frame = frameRef.current;
    const media = mediaRef.current;
    if (!frame || !media) return;
    const c = propsRef.current;

    const e = smoothstep(0, 1, p);

    const w = c.startWidth + (100 - c.startWidth) * e;
    const h = c.startHeight + (100 - c.startHeight) * e;
    const ix = Math.max(0, (100 - w) / 2);
    const iy = Math.max(0, (100 - h) / 2);
    const r = c.startRadius + (c.endRadius - c.startRadius) * e;
    frame.style.clipPath = `inset(${iy}% ${ix}% ${iy}% ${ix}% round ${r}px)`;

    media.style.transform = `scale(${c.mediaZoom + (1 - c.mediaZoom) * e})`;

    if (scrimRef.current) scrimRef.current.style.opacity = `${c.overlayScrim * e}`;

    if (titleRef.current) {
      const out = smoothstep(0.4, 0.88, p);
      titleRef.current.style.opacity = `${1 - out}`;
      titleRef.current.style.transform = `translate3d(0, ${-28 * out}px, 0) scale(${1 + 0.06 * out})`;
    }

    if (hintRef.current) {
      const gone = smoothstep(0, 0.12, p);
      hintRef.current.style.opacity = `${1 - gone}`;
      hintRef.current.style.transform = `translate3d(0, ${8 * gone}px, 0)`;
    }

    if (overlayRef.current) {
      const inn = smoothstep(0.68, 1, p);
      overlayRef.current.style.opacity = `${inn}`;
      overlayRef.current.style.transform = `translate3d(0, ${18 * (1 - inn)}px, 0)`;
    }
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!root || !track || !stage) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    let current = 0;
    let target = 0;
    let stageH = 0;
    let running = false;

    const measure = () => {
      const c = propsRef.current;
      stageH = c.useWindowScroll ? window.innerHeight : root.clientHeight;
      if (stageH <= 0) return;
      stage.style.height = `${stageH}px`;
      track.style.height = `${stageH * (1 + Math.max(0, c.scrollDistance) + Math.max(0, c.holdDistance))}px`;

      const w = root.clientWidth || stageH;
      stage.style.setProperty('--se-title-size', `${clamp(w * 0.075, 20, 84)}px`);
    };

    const readProgress = () => {
      const c = propsRef.current;
      if (!c.enabled) return 1;
      const span = stageH * Math.max(0.01, c.scrollDistance);
      if (c.useWindowScroll) {
        const top = track.getBoundingClientRect().top;
        return clamp(-top / span, 0, 1);
      }
      return clamp(root.scrollTop / span, 0, 1);
    };

    const tick = () => {
      const c = propsRef.current;
      const k = c.smoothing <= 0 ? 1 : 1 - Math.exp(-1 / (60 * c.smoothing));
      current += (target - current) * k;
      if (Math.abs(target - current) < 0.0004) {
        current = target;
        running = false;
      }
      applyProgress(current);
      raf = running ? requestAnimationFrame(tick) : 0;
    };

    const kick = () => {
      if (running) return;
      running = true;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      target = readProgress();
      if (propsRef.current.smoothing <= 0 || reduceMotion) {
        current = target;
        applyProgress(current);
        return;
      }
      kick();
    };

    const onResize = () => {
      measure();
      target = readProgress();
      current = target;
      applyProgress(current);
    };

    measure();
    target = readProgress();
    current = target;
    applyProgress(current);

    const scroller = useWindowScroll ? window : root;
    scroller.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(root);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      scroller.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      ro.disconnect();
    };
  }, [applyProgress, useWindowScroll]);

  const media =
    mediaType === 'video' ? (
      <video
        ref={mediaRef}
        className="scroll-expand__media"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
      />
    ) : (
      <img ref={mediaRef} className="scroll-expand__media" src={src} alt={alt} draggable={false} />
    );

  return (
    <div
      ref={rootRef}
      className={`scroll-expand ${useWindowScroll ? '' : 'scroll-expand--scroller'} ${className}`.trim()}
      style={style}
      {...rest}
    >
      <div ref={trackRef} className="scroll-expand__track">
        <div ref={stageRef} className="scroll-expand__stage">
          <div ref={frameRef} className="scroll-expand__frame">
            {media}
            <div ref={scrimRef} className="scroll-expand__scrim" />
            {children ? (
              <div ref={overlayRef} className="scroll-expand__overlay">
                {children}
              </div>
            ) : null}
          </div>
          {title ? (
            <div ref={titleRef} className="scroll-expand__title">
              {title}
            </div>
          ) : null}
          {scrollHint ? (
            <div ref={hintRef} className="scroll-expand__hint">
              {scrollHint}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ScrollExpand;

```

### Component CSS
```css
.scroll-expand {
  position: relative;
  width: 100%;
  height: 100%;
}

.scroll-expand--scroller {
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  overscroll-behavior: contain;
}

.scroll-expand--scroller::-webkit-scrollbar {
  display: none;
}

.scroll-expand__track {
  position: relative;
  width: 100%;
}

.scroll-expand__stage {
  position: sticky;
  top: 0;
  width: 100%;
  overflow: hidden;
  --se-title-size: 4rem;
}

.scroll-expand__frame {
  position: absolute;
  inset: 0;
  clip-path: inset(21% 29% 21% 29% round 24px);
  will-change: clip-path;
}

.scroll-expand__media {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  will-change: transform;
  transform-origin: center;
  user-select: none;
  -webkit-user-drag: none;
}

.scroll-expand__scrim {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.1) 45%, rgba(0, 0, 0, 0.35));
  opacity: 0;
}

.scroll-expand__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 6%;
  opacity: 0;
  will-change: opacity, transform;
}

.scroll-expand__title {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0 6%;
  text-align: center;
  font-size: var(--se-title-size);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1;
  color: #fff;
  text-shadow: 0 2px 24px rgba(0, 0, 0, 0.45);
  pointer-events: none;
  will-change: opacity, transform;
}

.scroll-expand__hint {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 1.25rem;
  text-align: center;
  font-size: 0.8125rem;
  letter-spacing: 0.02em;
  color: rgba(255, 255, 255, 0.55);
  pointer-events: none;
  will-change: opacity, transform;
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.


## Integrate the <GlowCursor /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: GlowCursor
### Variant: JavaScript + CSS


---

### Usage Example
```jsx
import GlowCursor from './GlowCursor';

<div style={{ position: 'relative', width: '100%', height: '500px' }}>
  <GlowCursor
    color="#5f8bff"
    intensity={1.3}
    trailWidth={3}
    linger={1.4}
    glow={1.2}
    clickBurst
    theme="dark"
  >
    {/* Your content here */}
  </GlowCursor>
</div>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| color | string | '#5f8bff' | Color of the light where it is freshly drawn. |
| secondaryColor | string | - | Color the light cools to as it drifts. Leave it out for a deeper shade of the main color. |
| intensity | number | 1.3 | Brightness of the light. |
| trailWidth | number | 3 | Thickness of the light where it is drawn, in pixels. |
| linger | number | 1.4 | Seconds the light stays visible before it fades. |
| glow | number | 1.2 | Strength of the soft glow around the light. |
| hotspot | number | 0.8 | Strength of the white-hot core near the cursor. |
| followSpeed | number | 0.6 | How tightly the light follows the cursor, from 0 to 1. |
| grain | number | 0 | Amount of film grain in the light. |
| clickBurst | boolean | true | Releases a burst of light when you click. |
| quality | 'low' | 'medium' | 'high' | 'high' | Resolution of the simulation. Lower it for weaker devices. |
| theme | 'dark' | 'light' | 'dark' | Use light on light backgrounds for an ink-like look. |
| blendMode | string | auto | CSS blend mode of the canvas. Defaults to screen in dark and normal in light. |
| maxDevicePixelRatio | number | 2 | Maximum pixel density of the canvas. |
| enabled | boolean | true | Stops drawing new light while keeping what is already there. |
| children | ReactNode | - | Content rendered above the light. |
| className | string | '' | Extra class names for the container. |
| style | CSSProperties | - | Inline styles for the container. |

### Full Component Source
```jsx
'use client';

import { useEffect, useRef } from 'react';

import './GlowCursor.css';

const VERTEX = `#version 300 es
in vec2 aPosition;
uniform vec2 uTexel;
out vec2 vUv;
out vec2 vL;
out vec2 vR;
out vec2 vT;
out vec2 vB;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(uTexel.x, 0.0);
  vR = vUv + vec2(uTexel.x, 0.0);
  vT = vUv + vec2(0.0, uTexel.y);
  vB = vUv - vec2(0.0, uTexel.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const HEADER = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
out vec4 outColor;
`;

const SPLAT = `${HEADER}
uniform sampler2D uTarget;
uniform float uAspect;
uniform vec2 uA;
uniform vec2 uB;
uniform float uRadius;
uniform float uWide;
uniform vec3 uValue;
uniform float uMode;
uniform float uStrength;
float erf(float x) {
  float x2 = x * x;
  float a = 0.147;
  return sign(x) * sqrt(1.0 - exp(-x2 * (1.2732395 + a * x2) / (1.0 + a * x2)));
}
float sweep(float along, float length, float across, float radius) {
  return exp(-across * across / (radius * radius)) * 0.5 * (erf(along / radius) - erf((along - length) / radius));
}
void main() {
  vec2 p = vec2(vUv.x * uAspect, vUv.y);
  vec2 a = vec2(uA.x * uAspect, uA.y);
  vec2 ab = vec2(uB.x * uAspect, uB.y) - a;
  float len = length(ab);
  vec2 dir = len > 1e-6 ? ab / len : vec2(1.0, 0.0);
  vec2 ap = p - a;
  vec3 base = texture(uTarget, vUv).xyz;
  if (uMode > 1.5) {
    float along = dot(ap, dir);
    float across = dot(ap, vec2(-dir.y, dir.x));
    if (uMode > 2.5) {
      outColor = vec4(mix(base, uValue, sweep(along, len, across, uRadius) * uStrength), 1.0);
      return;
    }
    vec3 add = vec3(uValue.xy * sweep(along, len, across, uRadius), uValue.z * sweep(along, len, across, uWide));
    outColor = vec4(base + add, 1.0);
    return;
  }
  float h = clamp(dot(ap, ab) / max(dot(ab, ab), 1e-9), 0.0, 1.0);
  vec2 d = ap - ab * h;
  float r2 = dot(d, d);
  float falloff = exp(-r2 / (uRadius * uRadius));
  float wide = exp(-r2 / (uWide * uWide));
  vec3 result = uMode > 0.5 ? mix(base, uValue, falloff * uStrength) : base + vec3(uValue.xy * falloff, uValue.z * wide);
  outColor = vec4(result, 1.0);
}`;

const ADVECT = `${HEADER}
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 uVelocityTexel;
uniform float uDt;
uniform vec4 uDecay;
void main() {
  vec2 coord = vUv - uDt * texture(uVelocity, vUv).xy * uVelocityTexel;
  outColor = texture(uSource, coord) * uDecay;
}`;

const MACCORMACK = `${HEADER}
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform sampler2D uForward;
uniform sampler2D uBack;
uniform vec2 uVelocityTexel;
uniform vec2 uSourceTexel;
uniform float uDt;
uniform vec4 uDecay;
void main() {
  vec2 coord = vUv - uDt * texture(uVelocity, vUv).xy * uVelocityTexel;
  vec4 forward = texture(uForward, vUv);
  vec4 corrected = forward + 0.5 * (texture(uSource, vUv) - texture(uBack, vUv));
  vec2 base = (floor(coord / uSourceTexel - 0.5) + 0.5) * uSourceTexel;
  vec4 a = texture(uSource, base);
  vec4 b = texture(uSource, base + vec2(uSourceTexel.x, 0.0));
  vec4 c = texture(uSource, base + vec2(0.0, uSourceTexel.y));
  vec4 d = texture(uSource, base + uSourceTexel);
  vec4 low = min(min(a, b), min(c, d));
  vec4 high = max(max(a, b), max(c, d));
  outColor = clamp(corrected, low, high) * uDecay;
}`;

const DIVERGENCE = `${HEADER}
uniform sampler2D uVelocity;
void main() {
  float left = texture(uVelocity, vL).x;
  float right = texture(uVelocity, vR).x;
  float top = texture(uVelocity, vT).y;
  float bottom = texture(uVelocity, vB).y;
  vec2 center = texture(uVelocity, vUv).xy;
  if (vL.x < 0.0) left = -center.x;
  if (vR.x > 1.0) right = -center.x;
  if (vT.y > 1.0) top = -center.y;
  if (vB.y < 0.0) bottom = -center.y;
  outColor = vec4(0.5 * (right - left + top - bottom), 0.0, 0.0, 1.0);
}`;

const SCALE = `${HEADER}
uniform sampler2D uSource;
uniform float uValue;
void main() {
  outColor = texture(uSource, vUv) * uValue;
}`;

const PRESSURE = `${HEADER}
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
void main() {
  float left = texture(uPressure, vL).x;
  float right = texture(uPressure, vR).x;
  float top = texture(uPressure, vT).x;
  float bottom = texture(uPressure, vB).x;
  float divergence = texture(uDivergence, vUv).x;
  outColor = vec4((left + right + bottom + top - divergence) * 0.25, 0.0, 0.0, 1.0);
}`;

const GRADIENT = `${HEADER}
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
void main() {
  float left = texture(uPressure, vL).x;
  float right = texture(uPressure, vR).x;
  float top = texture(uPressure, vT).x;
  float bottom = texture(uPressure, vB).x;
  vec2 velocity = texture(uVelocity, vUv).xy - vec2(right - left, top - bottom);
  outColor = vec4(velocity, 0.0, 1.0);
}`;

const SHADE = `
uniform vec3 uColor;
uniform vec3 uSecondary;
uniform float uIntensity;
uniform float uHotspot;
vec3 shade(vec3 dye) {
  float energy = max(dye.x, 0.0);
  float heat = clamp(dye.y, 0.0, energy);
  float gas = max(dye.z, 0.0);
  float fresh = heat / max(energy, 0.0001);
  vec3 tint = mix(uSecondary, uColor, fresh);
  return (tint * energy + uSecondary * gas + vec3(heat * heat * 0.3 * uHotspot)) * uIntensity;
}
`;

const PREFILTER = `${HEADER}${SHADE}
uniform sampler2D uDye;
uniform vec2 uDyeTexel;
void main() {
  vec2 o = uDyeTexel * 0.5;
  vec3 light = shade(texture(uDye, vUv + vec2(-o.x, -o.y)).xyz);
  light += shade(texture(uDye, vUv + vec2(o.x, -o.y)).xyz);
  light += shade(texture(uDye, vUv + vec2(-o.x, o.y)).xyz);
  light += shade(texture(uDye, vUv + vec2(o.x, o.y)).xyz);
  outColor = vec4(light * 0.25, 1.0);
}`;

const DOWN = `${HEADER}
uniform sampler2D uSource;
uniform vec2 uSourceTexel;
void main() {
  vec2 o = uSourceTexel;
  vec3 color = texture(uSource, vUv).rgb * 4.0;
  color += texture(uSource, vUv + vec2(-o.x, -o.y)).rgb;
  color += texture(uSource, vUv + vec2(o.x, -o.y)).rgb;
  color += texture(uSource, vUv + vec2(-o.x, o.y)).rgb;
  color += texture(uSource, vUv + vec2(o.x, o.y)).rgb;
  outColor = vec4(color / 8.0, 1.0);
}`;

const UP = `${HEADER}
uniform sampler2D uSource;
uniform vec2 uSourceTexel;
void main() {
  vec2 o = uSourceTexel;
  vec3 color = texture(uSource, vUv + vec2(-o.x * 2.0, 0.0)).rgb;
  color += texture(uSource, vUv + vec2(o.x * 2.0, 0.0)).rgb;
  color += texture(uSource, vUv + vec2(0.0, -o.y * 2.0)).rgb;
  color += texture(uSource, vUv + vec2(0.0, o.y * 2.0)).rgb;
  color += texture(uSource, vUv + vec2(-o.x, -o.y)).rgb * 2.0;
  color += texture(uSource, vUv + vec2(o.x, -o.y)).rgb * 2.0;
  color += texture(uSource, vUv + vec2(-o.x, o.y)).rgb * 2.0;
  color += texture(uSource, vUv + vec2(o.x, o.y)).rgb * 2.0;
  outColor = vec4(color / 12.0, 1.0);
}`;

const DISPLAY = `${HEADER}${SHADE}
uniform sampler2D uDye;
uniform sampler2D uBloom;
uniform float uGlow;
uniform float uGrain;
uniform float uTime;
uniform float uLight;
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
void main() {
  vec3 dye = texture(uDye, vUv).xyz;
  vec3 light = shade(dye);
  vec3 bloom = texture(uBloom, vUv).rgb * uGlow;
  float edge = smoothstep(0.0, 0.02, min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y)));
  float grain = 1.0 + (hash(gl_FragCoord.xy + fract(uTime * 13.7) * 97.0) - 0.5) * uGrain * 2.0;
  if (uLight > 0.5) {
    float energy = max(dye.x, 0.0);
    float heat = clamp(dye.y, 0.0, energy);
    float gas = max(dye.z, 0.0);
    float fresh = heat / max(energy, 0.0001);
    vec3 tint = mix(uSecondary, uColor, fresh);
    float halo = dot(bloom, vec3(0.2126, 0.7152, 0.0722));
    float density = 1.0 - exp(-((energy * 1.1 + gas * 0.8) * uIntensity + halo * 0.25));
    float tone = dot(tint, vec3(0.2126, 0.7152, 0.0722));
    vec3 ink = tint * min(1.0, 0.5 / max(tone, 0.001)) * mix(0.95, 0.72, smoothstep(0.5, 3.0, energy));
    ink = mix(ink, vec3(1.0), clamp(heat * heat * 0.05 * uHotspot, 0.0, 0.45));
    density = clamp(density * grain, 0.0, 1.0) * edge;
    outColor = vec4(ink * density, density);
  } else {
    vec3 color = 1.0 - exp(-(light + bloom) * grain);
    color *= edge;
    outColor = vec4(color, max(color.r, max(color.g, color.b)));
  }
}`;

const QUALITY = {
  low: { sim: 96, dye: 384 },
  medium: { sim: 128, dye: 576 },
  high: { sim: 160, dye: 768 }
};

const PRESSURE_STEPS = 20;
const FLOW = 0.75;
const BLOOM_LEVELS = 5;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const compile = (gl, type, source) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
};

const toHsv = ([r, g, b]) => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let hue = 0;
  if (delta > 0) {
    if (max === r) hue = ((g - b) / delta) % 6;
    else if (max === g) hue = (b - r) / delta + 2;
    else hue = (r - g) / delta + 4;
  }
  return [(hue * 60 + 360) % 360, max > 0 ? delta / max : 0, max];
};

const fromHsv = (hue, saturation, value) => {
  const h = (((hue % 360) + 360) % 360) / 60;
  const c = value * saturation;
  const x = c * (1 - Math.abs((h % 2) - 1));
  const m = value - c;
  const [r, g, b] =
    h < 1 ? [c, x, 0] : h < 2 ? [x, c, 0] : h < 3 ? [0, c, x] : h < 4 ? [0, x, c] : h < 5 ? [x, 0, c] : [c, 0, x];
  return [r + m, g + m, b + m];
};

const GlowCursor = ({
  color = '#5f8bff',
  secondaryColor,
  intensity = 1.3,
  trailWidth = 3,
  linger = 1.4,
  glow = 1.2,
  hotspot = 0.8,
  followSpeed = 0.6,
  grain = 0,
  clickBurst = true,
  quality = 'high',
  theme = 'dark',
  blendMode,
  maxDevicePixelRatio = 2,
  enabled = true,
  children,
  className = '',
  style,
  ...rest
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const settingsRef = useRef(null);
  settingsRef.current = {
    color: String(color),
    secondaryColor: secondaryColor ? String(secondaryColor) : '',
    intensity: Math.max(0, intensity),
    trailWidth: clamp(trailWidth, 0.5, 40),
    linger: clamp(linger, 0.1, 10),
    glow: Math.max(0, glow),
    hotspot: Math.max(0, hotspot),
    followSpeed: clamp(followSpeed, 0, 1),
    grain: Math.max(0, grain),
    clickBurst,
    quality: QUALITY[quality] ? quality : 'high',
    theme,
    maxDevicePixelRatio,
    enabled
  };

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const gl = canvas?.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false
    });
    if (!container || !canvas || !gl || !gl.getExtension('EXT_color_buffer_float')) return undefined;

    const vertexShader = compile(gl, gl.VERTEX_SHADER, VERTEX);
    if (!vertexShader) return undefined;

    const build = source => {
      const fragment = compile(gl, gl.FRAGMENT_SHADER, source);
      const program = gl.createProgram();
      if (!fragment || !program) return null;
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragment);
      gl.bindAttribLocation(program, 0, 'aPosition');
      gl.linkProgram(program);
      gl.deleteShader(fragment);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.deleteProgram(program);
        return null;
      }
      const uniforms = {};
      const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < count; i++) {
        const info = gl.getActiveUniform(program, i);
        if (info) uniforms[info.name] = gl.getUniformLocation(program, info.name);
      }
      return { program, uniforms };
    };

    const passes = {
      splat: build(SPLAT),
      advect: build(ADVECT),
      maccormack: build(MACCORMACK),
      divergence: build(DIVERGENCE),
      scale: build(SCALE),
      pressure: build(PRESSURE),
      gradient: build(GRADIENT),
      prefilter: build(PREFILTER),
      down: build(DOWN),
      up: build(UP),
      display: build(DISPLAY)
    };
    if (Object.values(passes).some(pass => !pass)) return undefined;

    const vao = gl.createVertexArray();
    const buffer = gl.createBuffer();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const probe = document.createElement('canvas');
    probe.width = 1;
    probe.height = 1;
    const probeContext = probe.getContext('2d', { willReadFrequently: true });
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    const state = {
      width: 1,
      height: 1,
      ratio: 1,
      colorKey: '',
      color: [0.37, 0.55, 1],
      secondary: [0.25, 0.3, 1],
      pointer: { x: 0, y: 0, inside: false },
      emitter: { x: 0, y: 0, vx: 0, vy: 0, px: 0, py: 0, travelled: 0 },
      ready: false,
      bursts: [],
      active: -Infinity,
      time: 0,
      allocated: '',
      targets: null
    };
    let raf = 0;
    let last = 0;
    let alive = true;
    let visible = true;

    const toRgb = (value, fallback) => {
      if (!probeContext || !value) return fallback;
      const css = /^[0-9a-f]{3,8}$/i.test(value) ? `#${value}` : value;
      probeContext.clearRect(0, 0, 1, 1);
      probeContext.fillStyle = '#000000';
      probeContext.fillStyle = css;
      probeContext.fillRect(0, 0, 1, 1);
      const [r, g, b] = probeContext.getImageData(0, 0, 1, 1).data;
      return [r / 255, g / 255, b / 255];
    };

    const resolveColors = s => {
      const key = `${s.color}|${s.secondaryColor}`;
      if (key === state.colorKey) return;
      state.colorKey = key;
      state.color = toRgb(s.color, [0.37, 0.55, 1]);
      if (s.secondaryColor) {
        state.secondary = toRgb(s.secondaryColor, state.color);
      } else {
        const [hue, saturation, value] = toHsv(state.color);
        state.secondary = fromHsv(hue + 8, Math.min(1, saturation * 1.1 + 0.05), value);
      }
    };

    const createTarget = (width, height, internalFormat, format, filter) => {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, format, gl.HALF_FLOAT, null);
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.viewport(0, 0, width, height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return { texture, fbo, width, height, texel: [1 / width, 1 / height] };
    };

    const createPair = (width, height, internalFormat, format, filter) => {
      let read = createTarget(width, height, internalFormat, format, filter);
      let write = createTarget(width, height, internalFormat, format, filter);
      return {
        get read() {
          return read;
        },
        get write() {
          return write;
        },
        swap() {
          const next = read;
          read = write;
          write = next;
        },
        targets() {
          return [read, write];
        }
      };
    };

    const destroyTarget = target => {
      gl.deleteTexture(target.texture);
      gl.deleteFramebuffer(target.fbo);
    };

    const release = () => {
      const t = state.targets;
      if (!t) return;
      [
        ...t.velocity.targets(),
        ...t.dye.targets(),
        ...t.pressure.targets(),
        t.divergence,
        t.forward,
        t.back,
        ...t.bloom
      ].forEach(destroyTarget);
      state.targets = null;
    };

    const clearTargets = () => {
      const t = state.targets;
      if (!t) return;
      gl.clearColor(0, 0, 0, 0);
      [...t.velocity.targets(), ...t.dye.targets(), ...t.pressure.targets()].forEach(target => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
        gl.clear(gl.COLOR_BUFFER_BIT);
      });
    };

    const allocate = () => {
      const s = settingsRef.current;
      const key = `${s.quality}|${state.width}|${state.height}|${canvas.width}|${canvas.height}`;
      if (key === state.allocated && state.targets) return;
      release();
      state.allocated = key;
      const preset = QUALITY[s.quality];
      const aspect = state.width / state.height;
      const dims = base => (aspect >= 1 ? [Math.round(base * aspect), base] : [base, Math.round(base / aspect)]);
      const [simW, simH] = dims(preset.sim);
      let [dyeW, dyeH] = dims(preset.dye);
      const shrink = Math.min(1, canvas.width / dyeW, canvas.height / dyeH);
      dyeW = Math.max(2, Math.round(dyeW * shrink));
      dyeH = Math.max(2, Math.round(dyeH * shrink));
      const bloom = [];
      let bloomW = dyeW >> 1;
      let bloomH = dyeH >> 1;
      for (let i = 0; i < BLOOM_LEVELS; i++) {
        bloom.push(createTarget(Math.max(1, bloomW), Math.max(1, bloomH), gl.RGBA16F, gl.RGBA, gl.LINEAR));
        bloomW >>= 1;
        bloomH >>= 1;
      }
      state.targets = {
        velocity: createPair(simW, simH, gl.RG16F, gl.RG, gl.LINEAR),
        dye: createPair(dyeW, dyeH, gl.RGBA16F, gl.RGBA, gl.LINEAR),
        forward: createTarget(dyeW, dyeH, gl.RGBA16F, gl.RGBA, gl.LINEAR),
        back: createTarget(dyeW, dyeH, gl.RGBA16F, gl.RGBA, gl.LINEAR),
        pressure: createPair(simW, simH, gl.R16F, gl.RED, gl.NEAREST),
        divergence: createTarget(simW, simH, gl.R16F, gl.RED, gl.NEAREST),
        bloom
      };
    };

    const resize = () => {
      const s = settingsRef.current;
      const width = Math.max(1, container.clientWidth);
      const height = Math.max(1, container.clientHeight);
      const ratio = Math.min(window.devicePixelRatio || 1, Math.max(0.5, s.maxDevicePixelRatio || 2));
      const pixelWidth = Math.max(1, Math.round(width * ratio));
      const pixelHeight = Math.max(1, Math.round(height * ratio));
      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }
      state.width = width;
      state.height = height;
      state.ratio = ratio;
      allocate();
    };

    const draw = target => {
      if (target) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
        gl.viewport(0, 0, target.width, target.height);
      } else {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const use = (pass, texel) => {
      gl.useProgram(pass.program);
      if (pass.uniforms.uTexel) gl.uniform2f(pass.uniforms.uTexel, texel[0], texel[1]);
      return pass.uniforms;
    };

    const bind = (unit, target) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, target.texture);
      return unit;
    };

    const splat = (pair, ax, ay, bx, by, radius, value, mode, strength, wide = radius) => {
      const u = use(passes.splat, pair.read.texel);
      gl.uniform1i(u.uTarget, bind(0, pair.read));
      gl.uniform1f(u.uAspect, state.width / state.height);
      gl.uniform2f(u.uA, ax / state.width, 1 - ay / state.height);
      gl.uniform2f(u.uB, bx / state.width, 1 - by / state.height);
      gl.uniform1f(u.uRadius, radius / state.height);
      gl.uniform1f(u.uWide, wide / state.height);
      gl.uniform3f(u.uValue, value[0], value[1], value[2]);
      gl.uniform1f(u.uMode, mode);
      gl.uniform1f(u.uStrength, strength);
      draw(pair.write);
      pair.swap();
    };

    const toGrid = (vx, vy) => {
      const { velocity } = state.targets;
      return [(vx * velocity.read.width) / state.width, (-vy * velocity.read.height) / state.height];
    };

    const lightRadius = s => Math.max(s.trailWidth * 0.5, (state.height / state.targets.dye.read.height) * 0.9);

    const emit = (s, dt, now) => {
      const { emitter, pointer } = state;
      const { velocity, dye } = state.targets;
      emitter.px = emitter.x;
      emitter.py = emitter.y;
      if (reduce || s.followSpeed >= 1) {
        emitter.x = pointer.x;
        emitter.y = pointer.y;
      } else {
        const omega = 10 + s.followSpeed * 50;
        const steps = Math.max(1, Math.ceil(dt / 0.004));
        const h = dt / steps;
        for (let k = 0; k < steps; k++) {
          emitter.vx += (omega * omega * (pointer.x - emitter.x) - 2 * omega * emitter.vx) * h;
          emitter.vy += (omega * omega * (pointer.y - emitter.y) - 2 * omega * emitter.vy) * h;
          emitter.x += emitter.vx * h;
          emitter.y += emitter.vy * h;
        }
      }
      const dx = emitter.x - emitter.px;
      const dy = emitter.y - emitter.py;
      const length = Math.hypot(dx, dy);
      if (length < 0.05 || !s.enabled) return;
      const radius = lightRadius(s);
      if (!reduce) {
        const target = toGrid(dx / Math.max(dt, 1e-3), dy / Math.max(dt, 1e-3));
        splat(
          velocity,
          emitter.px,
          emitter.py,
          emitter.x,
          emitter.y,
          radius * 4 + 18,
          [target[0], target[1], 0],
          3,
          FLOW * 0.6
        );
      }
      splat(dye, emitter.px, emitter.py, emitter.x, emitter.y, radius, [5.6, 5.6, 0.7], 2, 1, radius * 5 + 6);
      state.active = now;
    };

    const burst = (s, x, y, now) => {
      const { velocity, dye } = state.targets;
      const radius = lightRadius(s);
      const jets = 6;
      const base = Math.random() * Math.PI * 2;
      for (let k = 0; k < jets; k++) {
        const angle = base + (k / jets) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        const cx = Math.cos(angle);
        const cy = Math.sin(angle);
        const reach = 20 + Math.random() * 14;
        const ax = x + cx * 3;
        const ay = y + cy * 3;
        const bx = x + cx * reach;
        const by = y + cy * reach;
        if (!reduce) {
          const target = toGrid(Math.cos(angle + 0.6) * 760, Math.sin(angle + 0.6) * 760);
          splat(velocity, ax, ay, bx, by, 18, [target[0], target[1], 0], 1, 0.9);
        }
        splat(dye, ax, ay, bx, by, radius * 1.1, [2.4, 2.4, 0.3], 0, 1, radius * 5 + 6);
      }
      splat(dye, x, y, x + 0.01, y, radius * 2.2, [1.8, 1.8, 0.4], 0, 1, radius * 7 + 10);
      state.active = now;
    };

    const step = (s, dt) => {
      const { velocity, dye, pressure, divergence } = state.targets;
      if (!reduce) {
        let u = use(passes.divergence, velocity.read.texel);
        gl.uniform1i(u.uVelocity, bind(0, velocity.read));
        draw(divergence);

        u = use(passes.scale, pressure.read.texel);
        gl.uniform1i(u.uSource, bind(0, pressure.read));
        gl.uniform1f(u.uValue, 0.8);
        draw(pressure.write);
        pressure.swap();

        u = use(passes.pressure, pressure.read.texel);
        gl.uniform1i(u.uDivergence, bind(1, divergence));
        for (let i = 0; i < PRESSURE_STEPS; i++) {
          gl.uniform1i(u.uPressure, bind(0, pressure.read));
          draw(pressure.write);
          pressure.swap();
        }

        u = use(passes.gradient, velocity.read.texel);
        gl.uniform1i(u.uPressure, bind(0, pressure.read));
        gl.uniform1i(u.uVelocity, bind(1, velocity.read));
        draw(velocity.write);
        velocity.swap();

        u = use(passes.advect, velocity.read.texel);
        gl.uniform2f(u.uVelocityTexel, velocity.read.texel[0], velocity.read.texel[1]);
        gl.uniform1i(u.uVelocity, bind(0, velocity.read));
        gl.uniform1i(u.uSource, bind(0, velocity.read));
        gl.uniform1f(u.uDt, dt);
        const calm = Math.exp(-dt * 1.2);
        gl.uniform4f(u.uDecay, calm, calm, 1, 1);
        draw(velocity.write);
        velocity.swap();
      }

      const decay = [
        Math.exp((-dt * 4.6) / (s.linger * 0.8)),
        Math.exp((-dt * 4.6) / (s.linger * 0.2)),
        Math.exp((-dt * 4.6) / (s.linger * 1.2)),
        1
      ];
      const { forward, back } = state.targets;
      if (reduce) {
        const u = use(passes.advect, dye.read.texel);
        gl.uniform2f(u.uVelocityTexel, velocity.read.texel[0], velocity.read.texel[1]);
        gl.uniform1i(u.uVelocity, bind(0, velocity.read));
        gl.uniform1i(u.uSource, bind(1, dye.read));
        gl.uniform1f(u.uDt, 0);
        gl.uniform4f(u.uDecay, decay[0], decay[1], decay[2], decay[3]);
        draw(dye.write);
        dye.swap();
        return;
      }
      let u = use(passes.advect, dye.read.texel);
      gl.uniform2f(u.uVelocityTexel, velocity.read.texel[0], velocity.read.texel[1]);
      gl.uniform1i(u.uVelocity, bind(0, velocity.read));
      gl.uniform1i(u.uSource, bind(1, dye.read));
      gl.uniform1f(u.uDt, dt);
      gl.uniform4f(u.uDecay, 1, 1, 1, 1);
      draw(forward);
      gl.uniform1i(u.uSource, bind(1, forward));
      gl.uniform1f(u.uDt, -dt);
      draw(back);
      u = use(passes.maccormack, dye.read.texel);
      gl.uniform2f(u.uVelocityTexel, velocity.read.texel[0], velocity.read.texel[1]);
      gl.uniform2f(u.uSourceTexel, dye.read.texel[0], dye.read.texel[1]);
      gl.uniform1i(u.uVelocity, bind(0, velocity.read));
      gl.uniform1i(u.uSource, bind(1, dye.read));
      gl.uniform1i(u.uForward, bind(2, forward));
      gl.uniform1i(u.uBack, bind(3, back));
      gl.uniform1f(u.uDt, dt);
      gl.uniform4f(u.uDecay, decay[0], decay[1], decay[2], decay[3]);
      draw(dye.write);
      dye.swap();
    };

    const setShade = (u, s) => {
      gl.uniform3f(u.uColor, state.color[0], state.color[1], state.color[2]);
      gl.uniform3f(u.uSecondary, state.secondary[0], state.secondary[1], state.secondary[2]);
      gl.uniform1f(u.uIntensity, s.intensity);
      gl.uniform1f(u.uHotspot, s.hotspot);
    };

    const render = s => {
      const { dye, bloom } = state.targets;
      if (s.glow > 0) {
        let u = use(passes.prefilter, bloom[0].texel);
        gl.uniform1i(u.uDye, bind(0, dye.read));
        gl.uniform2f(u.uDyeTexel, dye.read.texel[0], dye.read.texel[1]);
        setShade(u, s);
        draw(bloom[0]);
        u = use(passes.down, bloom[0].texel);
        for (let i = 1; i < bloom.length; i++) {
          gl.uniform1i(u.uSource, bind(0, bloom[i - 1]));
          gl.uniform2f(u.uSourceTexel, bloom[i - 1].texel[0], bloom[i - 1].texel[1]);
          draw(bloom[i]);
        }
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE);
        u = use(passes.up, bloom[0].texel);
        for (let i = bloom.length - 1; i > 0; i--) {
          gl.uniform1i(u.uSource, bind(0, bloom[i]));
          gl.uniform2f(u.uSourceTexel, bloom[i].texel[0], bloom[i].texel[1]);
          draw(bloom[i - 1]);
        }
        gl.disable(gl.BLEND);
      }
      const u = use(passes.display, [1 / canvas.width, 1 / canvas.height]);
      gl.uniform1i(u.uDye, bind(0, dye.read));
      gl.uniform1i(u.uBloom, bind(1, bloom[0]));
      setShade(u, s);
      gl.uniform1f(u.uGlow, s.glow > 0 ? (s.glow * 1.4) / BLOOM_LEVELS : 0);
      gl.uniform1f(u.uGrain, s.grain);
      gl.uniform1f(u.uTime, state.time);
      gl.uniform1f(u.uLight, s.theme === 'light' ? 1 : 0);
      draw(null);
    };

    const blank = () => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    };

    const frame = now => {
      raf = 0;
      if (!alive || !visible || document.hidden) return;
      const s = settingsRef.current;
      const dt = last ? Math.min(1 / 30, (now - last) / 1000) : 1 / 60;
      last = now;
      state.time += dt;
      const wanted = Math.min(window.devicePixelRatio || 1, Math.max(0.5, s.maxDevicePixelRatio || 2));
      if (Math.abs(wanted - state.ratio) > 0.01) resize();
      allocate();
      resolveColors(s);
      gl.bindVertexArray(vao);
      gl.disable(gl.BLEND);

      if (state.ready) emit(s, dt, now);
      while (state.bursts.length) {
        const [x, y] = state.bursts.shift();
        burst(s, x, y, now);
      }
      step(s, dt);
      render(s);

      const quiet = now - state.active > s.linger * 1200 + 900;
      const resting = Math.hypot(state.emitter.vx, state.emitter.vy) < 1;
      if (quiet && resting) {
        clearTargets();
        blank();
        last = 0;
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (!raf && alive && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };

    const onPointerMove = event => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      if (!inside) {
        if (state.pointer.inside) {
          state.pointer.inside = false;
          state.ready = false;
          wake();
        }
        return;
      }
      if (!state.ready) {
        state.emitter.x = x;
        state.emitter.y = y;
        state.emitter.px = x;
        state.emitter.py = y;
        state.emitter.vx = 0;
        state.emitter.vy = 0;
        state.ready = true;
      }
      state.pointer.x = x;
      state.pointer.y = y;
      state.pointer.inside = true;
      wake();
    };

    const onPointerDown = event => {
      const s = settingsRef.current;
      if (!s.clickBurst || !s.enabled) return;
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      state.bursts.push([x, y]);
      wake();
    };

    const onPointerLeave = () => {
      state.pointer.inside = false;
      state.ready = false;
      wake();
    };

    const onVisibility = () => {
      last = 0;
      wake();
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      wake();
    });
    resizeObserver.observe(container);
    const intersection = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      if (visible) {
        last = 0;
        wake();
      }
    });
    intersection.observe(container);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibility);
    resize();
    blank();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersection.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      release();
      Object.values(passes).forEach(pass => gl.deleteProgram(pass.program));
      gl.deleteShader(vertexShader);
      gl.deleteBuffer(buffer);
      gl.deleteVertexArray(vao);
    };
  }, []);

  const mode = blendMode ?? (theme === 'light' ? 'normal' : 'screen');

  return (
    <div ref={containerRef} className={`glow-cursor${className ? ` ${className}` : ''}`} style={style} {...rest}>
      <canvas ref={canvasRef} className="glow-cursor__canvas" style={{ mixBlendMode: mode }} aria-hidden="true" />
      {children && <div className="glow-cursor__content">{children}</div>}
    </div>
  );
};

export default GlowCursor;

```

### Component CSS
```css
.glow-cursor {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.glow-cursor__canvas {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none;
  user-select: none;
}

.glow-cursor__content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.


## Integrate the <AccordionGallery /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: AccordionGallery
### Variant: JavaScript + CSS
### Dependencies: gsap

---

### Usage Example
```jsx
import AccordionGallery from './AccordionGallery'

const items = [
  { image: 'https://picsum.photos/id/1015/900/1200', label: 'Canyon', link: '#' },
  { image: 'https://picsum.photos/id/1018/900/1200', label: 'Ridgeline', link: '#' },
  { image: 'https://picsum.photos/id/1039/900/1200', label: 'Falls', link: '#' },
  { image: 'https://picsum.photos/id/1043/900/1200', label: 'Harbour', link: '#' },
  { image: 'https://picsum.photos/id/1044/900/1200', label: 'Skyline', link: '#' }
];

<AccordionGallery
  items={items}
  defaultIndex={2}
  expandRatio={0.52}
  trigger="hover"
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| items | Array<{ image: string; label?: string; link?: string; alt?: string }> | 5 sample panels | The panels to render. Each needs an image, and optionally a label, link and alt text. |
| defaultIndex | number | 2 | Index of the panel that is expanded on load, so the gallery never looks dead. |
| accentColor | string | "#ffffff" | Colour of the caption accent bar and the focus ring. |
| overlayColor | string | "#060010" | Colour used for the bottom legibility gradient and the dimming of collapsed panels. |
| textColor | string | "#ffffff" | Colour of the caption text. |
| grayscale | boolean | true | Desaturate collapsed panels and restore full colour on the expanded one. |
| showLabels | boolean | true | Whether captions reveal on the expanded panel. |
| duration | number | 0.6 | Duration of the expand / collapse transition in seconds. |
| ease | string | "power3.out" | GSAP easing used for every transition. |
| parallax | number | 0.5 | Strength of the internal image drift as panels resize (0 disables it). |
| tilt | number | 8 | Degrees of 3D rotation applied to collapsed panels, easing to flat on the open one. |
| stagger | number | 0.06 | Delay between the caption bar and text reveal, in seconds. |
| trigger | "hover" | "click" | "hover" | How a panel expands on pointer devices. Focus and tap always expand too. |
| height | number | 460 | Height of the row in pixels (width of the column when vertical). |
| gap | number | 10 | Gap between panels in pixels. |
| radius | number | 16 | Corner radius of each panel in pixels. |
| expandRatio | number | 0.52 | Fraction of the row the expanded panel occupies (0.2 – 0.9). |
| orientation | "horizontal" | "vertical" | "horizontal" | Lay the accordion out as a row or a column. |

### Full Component Source
```jsx
'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';

import './AccordionGallery.css';

const DEFAULT_ITEMS = [
  { image: 'https://picsum.photos/id/1015/900/1200', label: 'Canyon', link: '#' },
  { image: 'https://picsum.photos/id/1018/900/1200', label: 'Ridgeline', link: '#' },
  { image: 'https://picsum.photos/id/1039/900/1200', label: 'Falls', link: '#' },
  { image: 'https://picsum.photos/id/1043/900/1200', label: 'Harbour', link: '#' },
  { image: 'https://picsum.photos/id/1044/900/1200', label: 'Skyline', link: '#' }
];

const AccordionGallery = ({
  items = DEFAULT_ITEMS,
  defaultIndex = 2,
  accentColor = '#ffffff',
  overlayColor = '#060010',
  textColor = '#ffffff',
  height = 460,
  gap = 10,
  radius = 16,
  expandRatio = 0.52,
  orientation = 'horizontal',
  duration = 0.6,
  ease = 'power3.out',
  parallax = 0.5,
  tilt = 8,
  stagger = 0.06,
  trigger = 'hover',
  showLabels = true,
  grayscale = true,
  className = ''
}) => {
  const rootRef = useRef(null);
  const panelRefs = useRef([]);
  const mediaRefs = useRef([]);
  const barRefs = useRef([]);
  const textRefs = useRef([]);
  const tlRef = useRef(null);
  const firstRunRef = useRef(true);
  const mediaSizeRef = useRef(320);

  const vertical = orientation === 'vertical';
  const count = items.length;
  const [active, setActive] = useState(Math.min(Math.max(defaultIndex, 0), count - 1));

  const prefersReduced =
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  const applyLayout = useCallback(
    animate => {
      const panels = panelRefs.current;
      if (!panels.length) return;

      const r = Math.min(Math.max(expandRatio, 0.2), 0.9);
      const grow = count > 1 ? (r * (count - 1)) / (1 - r) : 1;
      const mediaSize = mediaSizeRef.current;

      tlRef.current?.kill();
      const dur = animate && !prefersReduced ? duration : 0;
      const tl = gsap.timeline();

      panels.forEach((panel, i) => {
        if (!panel) return;
        const isActive = i === active;
        const media = mediaRefs.current[i];
        const bar = barRefs.current[i];
        const text = textRefs.current[i];

        const rot = isActive ? 0 : i < active ? tilt : -tilt;
        const rotProp = vertical ? { rotateX: -rot } : { rotateY: rot };

        tl.to(panel, { flexGrow: isActive ? grow : 1, ...rotProp, duration: dur, ease }, 0);

        if (media) {
          const drift = Math.max(-1.5, Math.min(1.5, active - i));
          const shift = drift * parallax * mediaSize * 0.06;
          const gray = grayscale ? (isActive ? 0 : 1) : 0;
          tl.to(
            media,
            {
              xPercent: -50,
              yPercent: -50,
              x: vertical ? 0 : isActive ? 0 : shift,
              y: vertical ? (isActive ? 0 : shift) : 0,
              '--ag-gray': gray,
              '--ag-dim': isActive ? 0 : 0.35,
              duration: dur,
              ease
            },
            0
          );
        }

        if (showLabels && bar && text) {
          if (isActive) {
            tl.to([bar, text], { opacity: 1, x: 0, duration: dur, ease, stagger: prefersReduced ? 0 : stagger }, 0);
          } else {
            tl.to([bar, text], { opacity: 0, x: -14, duration: dur * 0.6, ease }, 0);
          }
        }
      });

      tlRef.current = tl;
    },
    [
      active,
      count,
      expandRatio,
      duration,
      ease,
      vertical,
      tilt,
      parallax,
      grayscale,
      showLabels,
      stagger,
      prefersReduced
    ]
  );

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const total = vertical ? rect.height : rect.width;
      const usable = Math.max(total - gap * (count - 1), 120);
      const size = Math.max(140, usable * Math.min(Math.max(expandRatio, 0.2), 0.9) * 1.22);
      mediaSizeRef.current = size;
      el.style.setProperty('--ag-media-size', `${size}px`);
      applyLayout(!firstRunRef.current);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [applyLayout, gap, count, expandRatio, vertical]);

  useEffect(() => {
    applyLayout(!firstRunRef.current);
    firstRunRef.current = false;
  }, [applyLayout]);

  useEffect(
    () => () => {
      tlRef.current?.kill();
    },
    []
  );

  const handleEnter = i => {
    if (trigger === 'hover') setActive(i);
  };

  const handleClick = (i, e) => {
    if (i !== active) {
      e.preventDefault();
      setActive(i);
    }
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i + 1) % count);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i - 1 + count) % count);
    }
  };

  return (
    <div
      ref={rootRef}
      className={`accordion-gallery${vertical ? ' accordion-gallery--vertical' : ''}${className ? ` ${className}` : ''}`}
      style={{
        '--ag-accent': accentColor,
        '--ag-overlay': overlayColor,
        '--ag-text': textColor,
        '--ag-gap': `${gap}px`,
        '--ag-radius': `${radius}px`,
        height: vertical ? `${Math.round(height * 1.6)}px` : `${height}px`
      }}
      role="list"
      aria-label="Image accordion gallery"
    >
      {items.map((item, i) => {
        const isActive = i === active;
        const Tag = item.link ? 'a' : 'div';
        return (
          <Tag
            key={i}
            ref={el => (panelRefs.current[i] = el)}
            className={`ag-panel${isActive ? ' ag-panel--active' : ''}`}
            style={{ borderRadius: `${radius}px` }}
            href={item.link || undefined}
            onClick={e => handleClick(i, e)}
            onMouseEnter={() => handleEnter(i)}
            onFocus={() => setActive(i)}
            onKeyDown={e => handleKeyDown(i, e)}
            role="listitem"
            tabIndex={0}
            aria-current={isActive ? 'true' : undefined}
            aria-label={item.label}
          >
            <span className="ag-panel__frame">
              <span className="ag-panel__media" ref={el => (mediaRefs.current[i] = el)}>
                <img src={item.image} alt={item.alt || item.label || ''} draggable="false" />
              </span>
              <span className="ag-panel__overlay" aria-hidden="true" />
            </span>
            {showLabels && (
              <span className="ag-panel__label" aria-hidden="true">
                <span className="ag-panel__bar" ref={el => (barRefs.current[i] = el)} />
                <span className="ag-panel__text" ref={el => (textRefs.current[i] = el)}>
                  {item.label}
                </span>
              </span>
            )}
          </Tag>
        );
      })}
    </div>
  );
};

export default AccordionGallery;

```

### Component CSS
```css
.accordion-gallery {
  --ag-accent: #ffffff;
  --ag-overlay: #060010;
  --ag-text: #ffffff;
  --ag-gap: 10px;
  --ag-radius: 16px;
  --ag-media-size: 320px;

  display: flex;
  flex-direction: row;
  gap: var(--ag-gap);
  width: 100%;
  max-width: 100%;
  perspective: 1400px;
  perspective-origin: 50% 50%;
}

.accordion-gallery--vertical {
  flex-direction: column;
}

.ag-panel {
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  border-radius: var(--ag-radius);
  cursor: pointer;
  display: block;
  text-decoration: none;
  outline: none;
  transform-style: preserve-3d;
  transform-origin: center center;
  background: #0a0713;
  box-shadow: 0 10px 30px -18px rgba(0, 0, 0, 0.8);
  will-change: flex-grow, transform;
  -webkit-tap-highlight-color: transparent;
}

.ag-panel:focus-visible {
  box-shadow:
    0 0 0 2px var(--ag-accent),
    0 10px 30px -18px rgba(0, 0, 0, 0.8);
}

.ag-panel__frame {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: inherit;
}

.ag-panel__media {
  --ag-gray: 1;
  --ag-dim: 0.35;
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--ag-media-size);
  height: 100%;
  filter: grayscale(var(--ag-gray));
  will-change: transform, filter;
}

.accordion-gallery--vertical .ag-panel__media {
  width: 100%;
  height: var(--ag-media-size);
}

.ag-panel__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  user-select: none;
  -webkit-user-drag: none;
}

.ag-panel__overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(180deg, transparent 45%, color-mix(in srgb, var(--ag-overlay) 78%, transparent) 100%),
    color-mix(in srgb, var(--ag-overlay) calc(var(--ag-dim, 0.35) * 100%), transparent);
}

.ag-panel__label {
  position: absolute;
  left: 20px;
  bottom: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  pointer-events: none;
  z-index: 2;
}

.ag-panel__bar {
  flex: 0 0 auto;
  width: 3px;
  height: 26px;
  border-radius: 3px;
  background: var(--ag-accent);
  opacity: 0;
  box-shadow: 0 0 12px color-mix(in srgb, var(--ag-accent) 60%, transparent);
}

.ag-panel__text {
  color: var(--ag-text);
  font-family: inherit;
  font-weight: 600;
  font-size: clamp(1rem, 1.4vw, 1.4rem);
  letter-spacing: 0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.55);
}

@media (max-width: 520px) {
  .accordion-gallery {
    flex-direction: column;
    perspective: none;
    height: auto !important;
  }
  .ag-panel {
    min-height: 84px;
    transform: none !important;
  }
  .accordion-gallery .ag-panel__media {
    width: 100%;
    height: var(--ag-media-size);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ag-panel,
  .ag-panel__media {
    will-change: auto;
  }
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.


## Integrate the <SpecularButton /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: SpecularButton
### Variant: JavaScript + CSS


---

### Usage Example
```jsx
import SpecularButton from './SpecularButton';

<SpecularButton
  size="lg"
  radius={18}
  tint="#ffffff"
  tintOpacity={0.04}
  textColor="#f5f5f5"
  lineColor="#ffffff"
  baseColor="#525252"
  intensity={1}
  idleIntensity={0.35}
  shineSize={10}
  shineFade={34}
  thickness={1.2}
  glow={1}
  followMouse
  proximity={250}
  onClick={() => console.log('clicked')}
>
  Get Started
</SpecularButton>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | 'Get Started' | Button label or any content. |
| size | 'sm' | 'md' | 'lg' | 'lg' | Padding and font size of the button. |
| radius | number | 18 | Corner radius in px. Values past half the height make a pill. |
| tint | string | '#ffffff' | Color of the glass body. |
| tintOpacity | number | 0.04 | How strongly the tint fills the body, from 0 for clear glass to 1 for a solid button. |
| blur | number | 0 | Blur of whatever sits behind the button, in px. |
| textColor | string | '#f5f5f5' | Color of the label. |
| lineColor | string | '#ffffff' | Color of the light on the edge. |
| baseColor | string | '#525252' | Color of the thin edge line that stays visible under the light. |
| intensity | number | 1 | Brightness of the light on the edge. |
| idleIntensity | number | 0.35 | How much of the light stays on when the cursor is away, from 0 to 1. |
| shineSize | number | 10 | How much of the edge the light covers at full strength, in degrees around the button. |
| shineFade | number | 34 | How far the light fades out past that, in degrees around the button. |
| thickness | number | 1.2 | Width of the lit edge in px. |
| glow | number | 1 | Soft light around the lit edge and inside the glass. 0 keeps only the crisp line. |
| followMouse | boolean | true | Moves the light to the part of the edge nearest the cursor. |
| proximity | number | 250 | Distance in px at which the light starts to follow the cursor and brighten. |
| autoAnimate | boolean | false | Keeps the light on and circling the edge whenever the cursor is away. |
| speed | number | 0.35 | How fast the light circles when autoAnimate is on. |
| disabled | boolean | false | Disables the button. |
| onClick | MouseEventHandler | - | Click handler. |
| type | 'button' | 'submit' | 'reset' | 'button' | Native button type. |
| className | string | '' | Extra class names for the button. |
| style | CSSProperties | - | Inline styles for the button. |

### Full Component Source
```jsx
'use client';

import { useEffect, useRef } from 'react';

import './SpecularButton.css';

const PAD = 24;
const TAU = Math.PI * 2;

const VERTEX = `#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const FRAGMENT = `#version 300 es
precision highp float;
uniform vec2 uCenter;
uniform vec2 uHalf;
uniform float uRadius;
uniform float uPx;
uniform float uSpot;
uniform vec2 uEntry;
uniform vec3 uLineColor;
uniform vec3 uBaseColor;
uniform float uIntensity;
uniform vec2 uWindow;
uniform float uThickness;
uniform float uGlow;
out vec4 outColor;

float roundedBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float loopPosition(vec2 p, vec2 b, float r) {
  vec2 inner = b - r;
  float arc = 1.5707963 * r;
  float quarter = inner.x + inner.y + arc;
  vec2 a = abs(p);
  vec2 q = a - inner;
  float s = q.x > 0.0 && q.y > 0.0
    ? inner.y + atan(q.y, q.x) * r
    : (q.x > q.y ? min(a.y, inner.y) : inner.y + arc + inner.x - min(a.x, inner.x));
  if (p.x < 0.0) s = p.y >= 0.0 ? 2.0 * quarter - s : 2.0 * quarter + s;
  else if (p.y < 0.0) s = 4.0 * quarter - s;
  return s / max(4.0 * quarter, 0.0001);
}

float lobe(float position, float center) {
  float gap = abs(fract(position - center + 0.5) - 0.5);
  return 1.0 - smoothstep(uWindow.x, uWindow.x + uWindow.y, gap);
}

void main() {
  vec2 p = gl_FragCoord.xy - uCenter;
  float d = roundedBox(p, uHalf, uRadius);
  float position = loopPosition(p, uHalf, uRadius);
  float key = lobe(position, uSpot);
  float back = lobe(position, uSpot + 0.5);
  float streak = key + back * 0.45;
  float width = max(uThickness * uPx * mix(1.0, max(key, back), 0.6), 0.35);
  float band = smoothstep(-width - 0.6, -width + 0.6, d) * (1.0 - smoothstep(-0.6, 0.6, d));
  float hair = smoothstep(-uPx - 0.6, -uPx + 0.6, d) * (1.0 - smoothstep(-0.6, 0.6, d));
  float inside = 1.0 - smoothstep(-0.6, 0.6, d);
  vec2 pool = (p - uEntry) / (uHalf.y * vec2(1.6, 1.1));
  float glow = streak * 0.2 * exp(-abs(d + width * 0.5) / (5.0 * uPx)) + inside * 0.08 * exp(-dot(pool, pool));
  float light = clamp((band * streak + glow * uGlow) * uIntensity, 0.0, 1.0);
  vec4 base = vec4(uBaseColor, 1.0) * hair * 0.6;
  outColor = vec4(uLineColor, 1.0) * light + base * (1.0 - light);
}`;

const UNIFORMS = [
  'uCenter',
  'uHalf',
  'uRadius',
  'uPx',
  'uSpot',
  'uEntry',
  'uLineColor',
  'uBaseColor',
  'uIntensity',
  'uWindow',
  'uThickness',
  'uGlow'
];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const wrap = value => value - Math.floor(value);

const loopPosition = (x, y, halfX, halfY, r) => {
  const innerX = halfX - r;
  const innerY = halfY - r;
  const arc = (Math.PI / 2) * r;
  const quarter = innerX + innerY + arc;
  const ax = Math.abs(x);
  const ay = Math.abs(y);
  const qx = ax - innerX;
  const qy = ay - innerY;
  let s;
  if (qx > 0 && qy > 0) s = innerY + Math.atan2(qy, qx) * r;
  else if (qx > qy) s = Math.min(ay, innerY);
  else s = innerY + arc + innerX - Math.min(ax, innerX);
  if (x < 0) s = y >= 0 ? 2 * quarter - s : 2 * quarter + s;
  else if (y < 0) s = 4 * quarter - s;
  return wrap(s / Math.max(4 * quarter, 0.0001));
};

const rimPoint = (position, halfX, halfY, r) => {
  const innerX = halfX - r;
  const innerY = halfY - r;
  const arc = (Math.PI / 2) * r;
  const quarter = innerX + innerY + arc;
  let s = wrap(position) * 4 * quarter;
  let signX = 1;
  let signY = 1;
  if (s > 3 * quarter) {
    s = 4 * quarter - s;
    signY = -1;
  } else if (s > 2 * quarter) {
    s -= 2 * quarter;
    signX = -1;
    signY = -1;
  } else if (s > quarter) {
    s = 2 * quarter - s;
    signX = -1;
  }
  let x = innerX - (s - innerY - arc);
  let y = halfY;
  if (s <= innerY) {
    x = halfX;
    y = s;
  } else if (s <= innerY + arc) {
    const angle = (s - innerY) / Math.max(r, 0.0001);
    x = innerX + Math.cos(angle) * r;
    y = innerY + Math.sin(angle) * r;
  }
  return [x * signX, y * signY];
};

const compile = (gl, type, source) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
};

const link = gl => {
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.bindAttribLocation(program, 0, 'aPosition');
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
  gl.deleteProgram(program);
  return null;
};

const SpecularButton = ({
  children = 'Get Started',
  size = 'lg',
  radius = 18,
  tint = '#ffffff',
  tintOpacity = 0.04,
  blur = 0,
  textColor = '#f5f5f5',
  lineColor = '#ffffff',
  baseColor = '#525252',
  intensity = 1,
  idleIntensity = 0.35,
  shineSize = 10,
  shineFade = 34,
  thickness = 1.2,
  glow = 1,
  speed = 0.35,
  followMouse = true,
  proximity = 250,
  autoAnimate = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  style,
  ...rest
}) => {
  const buttonRef = useRef(null);
  const canvasRef = useRef(null);
  const wakeRef = useRef(null);
  const settings = {
    radius: Math.max(0, radius),
    lineColor: String(lineColor),
    baseColor: String(baseColor),
    intensity: Math.max(0, intensity),
    idleIntensity: clamp(idleIntensity, 0, 1),
    shineSize: Math.max(0, shineSize),
    shineFade: Math.max(0, shineFade),
    thickness: Math.max(0, thickness),
    glow: Math.max(0, glow),
    speed,
    followMouse,
    proximity: Math.max(1, proximity),
    autoAnimate,
    disabled
  };
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    const button = buttonRef.current;
    const canvas = canvasRef.current;
    const gl = canvas?.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false
    });
    if (!button || !canvas || !gl) return undefined;
    const program = link(gl);
    if (!program) return undefined;
    const uniforms = {};
    for (const name of UNIFORMS) uniforms[name] = gl.getUniformLocation(program, name);
    const buffer = gl.createBuffer();
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);

    const probe = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const colors = new Map();
    const view = { width: 1, height: 1, ratio: 1 };
    const pointer = { x: 0, y: 0, known: false };
    const state = { spot: 0, level: 0, press: 0, ready: false };
    let raf = 0;
    let last = 0;
    let visible = true;

    const toRgb = value => {
      if (colors.has(value)) return colors.get(value);
      let rgb = [1, 1, 1];
      if (probe) {
        probe.clearRect(0, 0, 1, 1);
        probe.fillStyle = '#000000';
        probe.fillStyle = value;
        probe.fillRect(0, 0, 1, 1);
        const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
        rgb = [r / 255, g / 255, b / 255];
      }
      colors.set(value, rgb);
      return rgb;
    };

    const cornerRadius = s => Math.min(s.radius, view.width / 2, view.height / 2);

    const restSpot = s => {
      const r = cornerRadius(s);
      const inset = r * (1 - Math.SQRT1_2);
      return loopPosition(inset - view.width / 2, view.height / 2 - inset, view.width / 2, view.height / 2, r);
    };

    const aim = s => {
      if (!s.followMouse || s.disabled || !pointer.known) return null;
      const rect = button.getBoundingClientRect();
      const scale = rect.width / view.width || 1;
      const halfX = view.width / 2;
      const halfY = view.height / 2;
      const x = (pointer.x - rect.left - rect.width / 2) / scale;
      const y = (rect.top + rect.height / 2 - pointer.y) / scale;
      const distance = Math.hypot(Math.max(Math.abs(x) - halfX, 0), Math.max(Math.abs(y) - halfY, 0));
      const t = clamp(1 - distance / s.proximity, 0, 1);
      const near = t * t * (3 - 2 * t);
      const nearest = loopPosition(x, y, halfX, halfY, cornerRadius(s));
      if (distance > 0) return { spot: nearest, near };
      const depth = clamp(Math.min(halfX - Math.abs(x), halfY - Math.abs(y)) / (halfY * 0.8), 0, 1);
      const sway = restSpot(s) - (x / halfX) * 0.06 - (y / halfY) * 0.02;
      const offset = sway - nearest - Math.round(sway - nearest);
      return { spot: wrap(nearest + offset * depth * depth * (3 - 2 * depth)), near };
    };

    const draw = s => {
      const { width, height } = view;
      const scaleX = canvas.width / (width + PAD * 2);
      const scaleY = canvas.height / (height + PAD * 2);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform2f(uniforms.uCenter, (PAD + width / 2) * scaleX, (PAD + height / 2) * scaleY);
      gl.uniform2f(uniforms.uHalf, (width / 2) * scaleX, (height / 2) * scaleY);
      gl.uniform1f(uniforms.uRadius, Math.min(s.radius, width / 2, height / 2) * scaleX);
      gl.uniform1f(uniforms.uPx, view.ratio);
      const r = Math.min(s.radius, width / 2, height / 2);
      const [rimX, rimY] = rimPoint(state.spot, width / 2, height / 2, r);
      const pull = 1 - Math.min(0.35 * (height / 2), Math.hypot(rimX, rimY)) / Math.max(Math.hypot(rimX, rimY), 0.0001);
      gl.uniform1f(uniforms.uSpot, state.spot);
      gl.uniform2f(uniforms.uEntry, rimX * pull * scaleX, rimY * pull * scaleY);
      gl.uniform3fv(uniforms.uLineColor, toRgb(s.lineColor));
      gl.uniform3fv(uniforms.uBaseColor, toRgb(s.baseColor));
      gl.uniform1f(uniforms.uIntensity, s.intensity * (state.level + state.press * 0.8));
      gl.uniform2f(uniforms.uWindow, s.shineSize / 360 + state.press * 0.06, s.shineFade / 360 + 0.0001);
      gl.uniform1f(uniforms.uThickness, s.thickness);
      gl.uniform1f(uniforms.uGlow, s.glow);
      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.bindVertexArray(null);
    };

    const frame = now => {
      raf = 0;
      if (!visible) return;
      const s = settingsRef.current;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      const target = aim(s);
      const spinning = s.autoAnimate && !reduce;
      const steering = !!target && target.near > 0;
      if (!state.ready) {
        state.spot = restSpot(s);
        state.level = s.autoAnimate ? 1 : s.idleIntensity;
        state.ready = true;
      }
      let diff = 0;
      if (spinning && !steering) state.spot = wrap(state.spot + (s.speed / TAU) * dt);
      else {
        diff = (steering ? target.spot : restSpot(s)) - state.spot;
        diff -= Math.round(diff);
        state.spot = wrap(state.spot + diff * (1 - Math.exp(-dt * 8)));
      }
      const level = s.autoAnimate ? 1 : s.idleIntensity + (1 - s.idleIntensity) * (target ? target.near : 0);
      state.level += (level - state.level) * (1 - Math.exp(-dt * 7));
      state.press *= Math.exp(-dt * 5);
      draw(s);
      const settling = Math.abs(diff) > 0.0002 || Math.abs(level - state.level) > 0.001 || state.press > 0.002;
      if (settling || (spinning && !steering)) raf = requestAnimationFrame(frame);
      else last = 0;
    };

    const wake = () => {
      if (!raf && visible) raf = requestAnimationFrame(frame);
    };

    const measure = entry => {
      const box = entry?.borderBoxSize?.[0];
      view.width = Math.max(1, box ? box.inlineSize : button.offsetWidth);
      view.height = Math.max(1, box ? box.blockSize : button.offsetHeight);
      view.ratio = Math.min(window.devicePixelRatio || 1, 3);
      canvas.width = Math.max(1, Math.round((view.width + PAD * 2) * view.ratio));
      canvas.height = Math.max(1, Math.round((view.height + PAD * 2) * view.ratio));
      if (state.ready) draw(settingsRef.current);
      wake();
    };

    const onPointerMove = event => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.known = true;
      wake();
    };

    const onPointerDown = event => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.known = true;
      if (!settingsRef.current.disabled) state.press = 1;
      wake();
    };

    const onPointerEnd = event => {
      if (event.pointerType === 'mouse') return;
      pointer.known = false;
      wake();
    };

    const onPointerLeave = () => {
      pointer.known = false;
      wake();
    };

    const resizeObserver = new ResizeObserver(entries => measure(entries[entries.length - 1]));
    resizeObserver.observe(button);
    const intersection = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      if (visible) {
        last = 0;
        wake();
      }
    });
    intersection.observe(button);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerEnd, { passive: true });
    window.addEventListener('pointercancel', onPointerEnd, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
    button.addEventListener('pointerdown', onPointerDown);
    measure();
    wakeRef.current = wake;

    return () => {
      cancelAnimationFrame(raf);
      wakeRef.current = null;
      resizeObserver.disconnect();
      intersection.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerEnd);
      window.removeEventListener('pointercancel', onPointerEnd);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      button.removeEventListener('pointerdown', onPointerDown);
      gl.deleteBuffer(buffer);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  useEffect(() => {
    wakeRef.current?.();
  });

  return (
    <button
      ref={buttonRef}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`specular-button specular-button--${size}${className ? ` ${className}` : ''}`}
      style={{
        '--sb-radius': `${radius}px`,
        '--sb-tint': tint,
        '--sb-tint-opacity': tintOpacity,
        '--sb-blur': `${blur}px`,
        '--sb-text-color': textColor,
        ...style
      }}
      {...rest}
    >
      <canvas ref={canvasRef} className="specular-button__light" aria-hidden="true" />
      <span className="specular-button__label">{children}</span>
    </button>
  );
};

export default SpecularButton;

```

### Component CSS
```css
.specular-button {
  --sb-radius: 18px;
  --sb-tint: #ffffff;
  --sb-tint-opacity: 0.04;
  --sb-blur: 0px;
  --sb-text-color: #f5f5f5;

  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  margin: 0;
  border: 0;
  border-radius: var(--sb-radius);
  font: inherit;
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0.01em;
  color: var(--sb-text-color);
  background: color-mix(in srgb, var(--sb-tint) calc(var(--sb-tint-opacity) * 100%), transparent);
  box-shadow: 0 10px 24px -14px rgba(0, 0, 0, 0.45);
  -webkit-backdrop-filter: blur(var(--sb-blur));
  backdrop-filter: blur(var(--sb-blur));
  cursor: pointer;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.specular-button:active {
  transform: scale(0.97);
}

.specular-button:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--sb-text-color) 55%, transparent);
  outline-offset: 3px;
}

.specular-button:disabled {
  opacity: 0.5;
  cursor: default;
}

.specular-button:disabled:active {
  transform: none;
}

.specular-button--sm {
  padding: 10px 20px;
  font-size: 0.875rem;
}

.specular-button--md {
  padding: 14px 28px;
  font-size: 1rem;
}

.specular-button--lg {
  padding: 18px 38px;
  font-size: 1.125rem;
}

.specular-button__light {
  position: absolute;
  inset: -24px;
  z-index: 1;
  display: block;
  width: calc(100% + 48px);
  height: calc(100% + 48px);
  pointer-events: none;
}

.specular-button__label {
  position: relative;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: inherit;
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.


## Integrate the <AnimatedList /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: AnimatedList
### Variant: JavaScript + CSS
### Dependencies: @hugeicons/react @hugeicons/core-free-icons

---

### Usage Example
```jsx
import AnimatedList from './AnimatedList'

const items = [
  { title: 'Brand assets', description: '24 files', meta: '2m' },
  { title: 'Launch hero.png', description: '2.4 MB', meta: '18m' },
  { title: 'Product tour.mp4', description: '148 MB', meta: '1h' },
  { title: 'Pricing notes', description: '1,240 words', meta: '3h' }
];

<AnimatedList
  items={items}
  onItemSelect={(item, index) => console.log(item, index)}
  animation="pop"
  theme="dark"
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| items | (string | { id?, icon?, image?, title, description?, meta? })[] | sample files | The rows to show. Strings become plain rows. Objects can add an icon or image, a description and a label on the right. |
| onItemSelect | (item, index) => void | - | Called when a row is clicked, or when Enter is pressed on the selected row. |
| renderItem | (item, index, selected) => ReactNode | - | Renders your own content inside each row instead of the built-in layout. |
| initialSelectedIndex | number | -1 | Which row starts selected. Use -1 for none. |
| selectOnHover | boolean | true | Moves the selection to the row under the cursor. |
| enableArrowNavigation | boolean | true | Arrow keys, Home and End move the selection while the list is hovered or focused. |
| loop | boolean | false | Wraps keyboard navigation from the last row back to the first. |
| animation | 'pop' | 'slide' | 'fade' | 'none' | 'pop' | How rows animate in as they scroll into view. |
| animateOnce | boolean | false | Animates each row only the first time it appears. |
| stagger | number | 0.05 | Delay between rows when the list first appears, in seconds. |
| showGradients | boolean | true | Fades rows out at the top and bottom edges while there is more to scroll. |
| fadeSize | number | 56 | Height of the edge fades, in px. |
| displayScrollbar | boolean | true | Shows a thin scrollbar when the list overflows. |
| frame | boolean | true | Shows the frosted panel around the list. |
| theme | 'dark' | 'light' | 'dark' | Color theme of the panel and rows. |
| accentColor | string | - | Color of the selection outline. Uses a soft tint of the text color when not set. |
| radius | number | 14 | Corner radius of the rows, in px. |
| gap | number | 8 | Space between rows, in px. |
| width | number | string | 420 | Maximum width of the list. |
| maxHeight | number | string | 440 | Height at which the list starts to scroll. |
| className | string | '' | Extra class names for the list. |
| itemClassName | string | '' | Extra class names for each row. |
| style | CSSProperties | - | Inline styles for the list. |

### Full Component Source
```jsx
'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  CodeIcon,
  FigmaIcon,
  File01Icon,
  FileZipIcon,
  Folder01Icon,
  Image01Icon,
  MusicNote01Icon,
  Note01Icon,
  Pdf01Icon,
  Presentation01Icon,
  Table01Icon,
  Video01Icon
} from '@hugeicons/core-free-icons';

import './AnimatedList.css';

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const THEMES = {
  dark: {
    '--al-frame': 'rgba(38, 35, 46, 0.66)',
    '--al-frame-edge': 'rgba(255, 255, 255, 0.08)',
    '--al-frame-highlight': 'rgba(255, 255, 255, 0.07)',
    '--al-frame-shadow': '0 22px 44px -20px rgba(0, 0, 0, 0.8), 0 6px 16px -8px rgba(0, 0, 0, 0.5)',
    '--al-tile': 'linear-gradient(180deg, #3a3644 0%, #27242f 100%)',
    '--al-tile-edge': 'rgba(255, 255, 255, 0.07)',
    '--al-tile-highlight': 'rgba(255, 255, 255, 0.12)',
    '--al-tile-shadow': '0 4px 10px -4px rgba(0, 0, 0, 0.7)',
    '--al-well': 'rgba(255, 255, 255, 0.08)',
    '--al-ink': '#f4f4f5',
    '--al-muted': 'rgba(244, 244, 245, 0.55)',
    '--al-thumb': 'rgba(255, 255, 255, 0.16)',
    '--al-ring': 'rgba(244, 244, 245, 0.3)',
    '--al-ring-fill': 'rgba(244, 244, 245, 0.05)',
    '--al-hover': 'brightness(1.12)',
    '--al-press': 'brightness(0.85)',
    '--al-active': 'brightness(1.16)'
  },
  light: {
    '--al-frame': 'rgba(240, 240, 243, 0.8)',
    '--al-frame-edge': 'rgba(24, 24, 27, 0.07)',
    '--al-frame-highlight': 'rgba(255, 255, 255, 0.95)',
    '--al-frame-shadow': '0 22px 44px -22px rgba(24, 24, 27, 0.3), 0 6px 16px -10px rgba(24, 24, 27, 0.16)',
    '--al-tile': 'linear-gradient(180deg, #ffffff 0%, #f6f6f8 100%)',
    '--al-tile-edge': 'rgba(24, 24, 27, 0.08)',
    '--al-tile-highlight': 'rgba(255, 255, 255, 1)',
    '--al-tile-shadow': '0 4px 10px -5px rgba(24, 24, 27, 0.25)',
    '--al-well': 'rgba(24, 24, 27, 0.05)',
    '--al-ink': '#27272a',
    '--al-muted': 'rgba(39, 39, 42, 0.55)',
    '--al-thumb': 'rgba(24, 24, 27, 0.16)',
    '--al-ring': 'rgba(24, 24, 27, 0.28)',
    '--al-ring-fill': 'transparent',
    '--al-hover': 'brightness(0.97)',
    '--al-press': 'brightness(0.92)',
    '--al-active': 'none'
  }
};

const glyph = icon => <HugeiconsIcon icon={icon} size={18} strokeWidth={1.8} />;

const DEFAULT_ITEMS = [
  { icon: glyph(Folder01Icon), title: 'Brand assets', description: '24 files', meta: '2m' },
  { icon: glyph(Image01Icon), title: 'Launch hero.png', description: '2.4 MB', meta: '18m' },
  { icon: glyph(Video01Icon), title: 'Product tour.mp4', description: '148 MB', meta: '1h' },
  { icon: glyph(Note01Icon), title: 'Pricing notes', description: '1,240 words', meta: '3h' },
  { icon: glyph(CodeIcon), title: 'landing-page.tsx', description: '12 KB', meta: '5h' },
  { icon: glyph(FigmaIcon), title: 'Onboarding flow', description: '38 frames', meta: '8h' },
  { icon: glyph(MusicNote01Icon), title: 'Ambient loop.wav', description: '9.1 MB', meta: '1d' },
  { icon: glyph(Table01Icon), title: 'Q3 forecast', description: '4 sheets', meta: '1d' },
  { icon: glyph(Pdf01Icon), title: 'Brand guidelines.pdf', description: '6.8 MB', meta: '2d' },
  { icon: glyph(Presentation01Icon), title: 'Investor update', description: '22 slides', meta: '3d' },
  { icon: glyph(FileZipIcon), title: 'Icon set.zip', description: '1.2 MB', meta: '4d' },
  { icon: glyph(Image01Icon), title: 'Moodboard.jpg', description: '3.6 MB', meta: '5d' },
  { icon: glyph(File01Icon), title: 'Release notes', description: 'Version 2.4', meta: '1w' },
  { icon: glyph(Folder01Icon), title: 'Archive', description: '118 files', meta: '2w' },
  { icon: glyph(Video01Icon), title: 'Teaser cut.mov', description: '86 MB', meta: '3w' }
];

const HIDDEN = {
  pop: { above: 'translate3d(0, -12px, 0) scale(0.8)', below: 'translate3d(0, 12px, 0) scale(0.8)' },
  slide: { above: 'translate3d(0, -28px, 0) scale(0.98)', below: 'translate3d(0, 28px, 0) scale(0.98)' },
  fade: { above: 'translate3d(0, -4px, 0)', below: 'translate3d(0, 4px, 0)' }
};

const SPRING =
  'linear(0, 0.0603, 0.2033, 0.3821, 0.5633, 0.7258, 0.8584, 0.9574, 1.0242, 1.0634, 1.0809, 1.0828, 1.0747, 1.0613, 1.046, 1.0313, 1.0186, 1.0085, 1.0012, 0.9965, 0.994, 0.9931, 0.9933, 0.9941, 0.9953, 0.9966, 0.9978, 0.9988, 1)';

const smootherstep = t => t * t * t * (t * (t * 6 - 15) + 10);

const FADE_MASK = (() => {
  const steps = [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1];
  const top = steps.map(t => `rgba(0, 0, 0, ${smootherstep(t).toFixed(3)}) calc(var(--al-fade-top) * ${t})`);
  const bottom = [...steps]
    .reverse()
    .map(t => `rgba(0, 0, 0, ${smootherstep(t).toFixed(3)}) calc(100% - var(--al-fade-bottom) * ${t})`);
  return `linear-gradient(to bottom, ${[...top, ...bottom].join(', ')})`;
})();

const size = value => (typeof value === 'number' ? `${value}px` : value);

const AnimatedList = ({
  items = DEFAULT_ITEMS,
  onItemSelect,
  renderItem,
  initialSelectedIndex = -1,
  selectOnHover = true,
  enableArrowNavigation = true,
  loop = false,
  animation = 'pop',
  animateOnce = false,
  stagger = 0.05,
  showGradients = true,
  fadeSize = 56,
  displayScrollbar = true,
  frame = true,
  theme = 'dark',
  accentColor,
  radius = 14,
  gap = 8,
  width = 420,
  maxHeight = 440,
  className = '',
  itemClassName = '',
  style
}) => {
  const rootRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const indicatorRef = useRef(null);
  const ringRef = useRef(null);
  const itemRefs = useRef([]);
  const engineRef = useRef(null);
  const keyboardRef = useRef(false);
  const navigatingRef = useRef(false);
  const [selected, setSelected] = useState(initialSelectedIndex);
  const baseId = useId();
  const settings = {
    items,
    onItemSelect,
    selected,
    selectOnHover,
    enableArrowNavigation,
    loop,
    animation,
    animateOnce,
    stagger,
    showGradients,
    fadeSize
  };
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const indicator = indicatorRef.current;
    const ring = ringRef.current;
    if (!root || !viewport || !track || !indicator || !ring) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const springEase = CSS.supports?.('transition-timing-function', 'linear(0, 1)')
      ? SPRING
      : 'cubic-bezier(0.34, 1.4, 0.64, 1)';
    const transition = `transform 620ms ${springEase}, opacity 300ms cubic-bezier(0.22, 1, 0.36, 1), filter 200ms ease`;
    const motion = { y: 0, h: 0, vy: 0, vh: 0, ty: 0, th: 0, ready: false };
    const fades = { top: '', bottom: '' };
    let boxes = [];
    let current = null;
    let entered = false;
    let engaged = false;
    let pointer = [0, 0];
    let raf = 0;
    let last = 0;

    const mode = () => {
      const chosen = settingsRef.current.animation;
      if (chosen === 'none' || !HIDDEN[chosen]) return 'none';
      return reduced ? 'fade' : chosen;
    };

    const apply = (element, state) => {
      element.dataset.state = state;
      const pose = current && current !== 'none' && state !== 'in' ? HIDDEN[current][state] : '';
      element.style.transform = pose;
      element.style.opacity = pose ? '0' : '';
    };

    const syncRing = () => {
      const item = itemRefs.current[settingsRef.current.selected];
      if (!item) return;
      const state = item.dataset.state || 'in';
      if (state === ring.dataset.state) return;
      ring.style.transitionDelay = item.style.transitionDelay;
      apply(ring, state);
    };

    const write = () => {
      indicator.style.transform = `translate3d(0, ${motion.y.toFixed(2)}px, 0)`;
      indicator.style.height = `${motion.h.toFixed(2)}px`;
    };

    const frame = now => {
      raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      const omega = 30;
      const zeta = 0.78;
      const steps = Math.max(1, Math.ceil(dt / (1 / 240)));
      const h = dt / steps;
      for (let i = 0; i < steps; i++) {
        motion.vy += (omega * omega * (motion.ty - motion.y) - 2 * zeta * omega * motion.vy) * h;
        motion.vh += (omega * omega * (motion.th - motion.h) - 2 * zeta * omega * motion.vh) * h;
        motion.y += motion.vy * h;
        motion.h += motion.vh * h;
      }
      const moving =
        Math.abs(motion.ty - motion.y) > 0.05 ||
        Math.abs(motion.th - motion.h) > 0.05 ||
        Math.abs(motion.vy) + Math.abs(motion.vh) > 0.5;
      if (!moving) {
        motion.y = motion.ty;
        motion.h = motion.th;
        motion.vy = motion.vh = 0;
      }
      write();
      if (moving) raf = requestAnimationFrame(frame);
    };

    const place = snap => {
      const item = itemRefs.current[settingsRef.current.selected];
      if (!item) {
        indicator.style.opacity = '0';
        motion.ready = false;
        return;
      }
      indicator.style.opacity = '1';
      motion.ty = item.offsetTop;
      motion.th = item.offsetHeight;
      if (snap || reduced || !motion.ready) {
        motion.y = motion.ty;
        motion.h = motion.th;
        motion.vy = motion.vh = 0;
        motion.ready = true;
        write();
        return;
      }
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    const updateFades = () => {
      const s = settingsRef.current;
      const span = Math.max(1, s.fadeSize);
      const { scrollTop, scrollHeight, clientHeight } = viewport;
      const top = s.showGradients ? Math.min(span, Math.max(0, scrollTop)) : 0;
      const bottom = s.showGradients ? Math.min(span, Math.max(0, scrollHeight - clientHeight - scrollTop)) : 0;
      const nextTop = `${top.toFixed(1)}px`;
      const nextBottom = `${bottom.toFixed(1)}px`;
      if (nextTop !== fades.top) {
        fades.top = nextTop;
        viewport.style.setProperty('--al-fade-top', nextTop);
      }
      if (nextBottom !== fades.bottom) {
        fades.bottom = nextBottom;
        viewport.style.setProperty('--al-fade-bottom', nextBottom);
      }
    };

    const measure = () => {
      const offset = track.offsetTop;
      boxes = itemRefs.current.map(item => (item ? [offset + item.offsetTop, item.offsetHeight] : null));
    };

    const reveal = entrance => {
      if (!entered) return;
      const s = settingsRef.current;
      const top = viewport.scrollTop;
      const view = viewport.clientHeight;
      let order = 0;
      itemRefs.current.forEach((item, index) => {
        const box = boxes[index];
        if (!item || !box) return;
        const start = box[0] - top;
        const overlap = Math.min(view, start + box[1]) - Math.max(0, start);
        const hidden =
          current !== 'none' && overlap < Math.min(box[1], view) * 0.5 && !(s.animateOnce && item.dataset.seen);
        const state = hidden ? (start + box[1] / 2 < view / 2 ? 'above' : 'below') : 'in';
        if (state === item.dataset.state) return;
        const delay = entrance && !hidden ? (order++ * Math.max(0, s.stagger)).toFixed(3) : 0;
        item.style.transitionDelay = delay ? `${delay}s, ${delay}s, 0s` : '';
        if (!hidden) item.dataset.seen = 'true';
        apply(item, state);
      });
      syncRing();
    };

    const sync = () => {
      const s = settingsRef.current;
      itemRefs.current.length = s.items.length;
      const items = itemRefs.current.filter(Boolean);
      const next = mode();
      const changed = next !== current;
      const restyle = changed ? items : items.filter(item => !item.dataset.state);
      current = next;
      if (current === 'none') entered = true;
      if (restyle.length) {
        const elements = changed ? [...restyle, ring] : restyle;
        for (const element of elements) element.style.transition = 'none';
        for (const item of restyle) apply(item, current === 'none' ? 'in' : item.dataset.state || 'below');
        if (changed) apply(ring, itemRefs.current[s.selected]?.dataset.state || 'in');
        void root.offsetHeight;
        for (const element of elements) element.style.transition = transition;
      }
      measure();
      reveal(restyle.length > 0);
    };

    sync();

    const gate =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(
            (entries, observer) => {
              if (!entries.some(entry => entry.isIntersecting)) return;
              observer.disconnect();
              if (entered) return;
              entered = true;
              measure();
              reveal(true);
            },
            { rootMargin: '0px 0px -10% 0px' }
          );
    if (!entered) {
      if (gate) gate.observe(root);
      else {
        entered = true;
        reveal(true);
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      place(true);
      updateFades();
      measure();
      reveal(false);
    });
    resizeObserver.observe(viewport);
    resizeObserver.observe(track);

    const onScroll = () => {
      updateFades();
      reveal(false);
    };

    const onKey = event => {
      const s = settingsRef.current;
      if (!s.enableArrowNavigation || event.defaultPrevented) return;
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const active = document.activeElement;
      const focused = active === viewport;
      const idle = !active || active === document.body || active === document.documentElement;
      if (!focused && !(engaged && idle)) return;
      const count = s.items.length;
      if (!count) return;
      const index = s.selected;
      let next = null;
      if (event.key === 'ArrowDown') next = index < 0 ? 0 : index + 1;
      else if (event.key === 'ArrowUp') next = index < 0 ? count - 1 : index - 1;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = count - 1;
      else if ((event.key === 'Enter' || (focused && event.key === ' ')) && index >= 0 && index < count) {
        event.preventDefault();
        s.onItemSelect?.(s.items[index], index);
        return;
      }
      if (next === null) return;
      event.preventDefault();
      next = s.loop ? (next + count) % count : Math.min(count - 1, Math.max(0, next));
      keyboardRef.current = true;
      navigatingRef.current = true;
      setSelected(next);
    };

    const onPointerMove = event => {
      const moved = event.clientX !== pointer[0] || event.clientY !== pointer[1];
      pointer = [event.clientX, event.clientY];
      if (!navigatingRef.current || !moved) return;
      navigatingRef.current = false;
      const item = event.target instanceof Element ? event.target.closest('[data-index]') : null;
      if (item && root.contains(item) && settingsRef.current.selectOnHover) setSelected(Number(item.dataset.index));
    };

    const onEnter = () => {
      engaged = true;
    };
    const onLeave = () => {
      engaged = false;
    };

    viewport.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKey);
    root.addEventListener('pointerenter', onEnter);
    root.addEventListener('pointerleave', onLeave);
    root.addEventListener('pointermove', onPointerMove);

    updateFades();
    place(true);
    syncRing();

    engineRef.current = { place, syncRing, updateFades, sync };

    return () => {
      cancelAnimationFrame(raf);
      gate?.disconnect();
      resizeObserver.disconnect();
      viewport.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKey);
      root.removeEventListener('pointerenter', onEnter);
      root.removeEventListener('pointerleave', onLeave);
      root.removeEventListener('pointermove', onPointerMove);
      engineRef.current = null;
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    engineRef.current?.sync();
  }, [items, animation]);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.place(false);
    engine.syncRing();
    if (!keyboardRef.current) return;
    keyboardRef.current = false;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const item = itemRefs.current[selected];
    if (!viewport || !track || !item) return;
    const top = track.offsetTop + item.offsetTop;
    const bottom = top + item.offsetHeight;
    const room = Math.max(0, (viewport.clientHeight - item.offsetHeight) / 2);
    const margin = Math.min(showGradients ? Math.max(12, fadeSize) : 12, room);
    if (top < viewport.scrollTop + margin) {
      viewport.scrollTo({ top: Math.max(0, top - margin), behavior: 'smooth' });
    } else if (bottom > viewport.scrollTop + viewport.clientHeight - margin) {
      viewport.scrollTo({ top: bottom - viewport.clientHeight + margin, behavior: 'smooth' });
    }
  }, [selected, fadeSize, showGradients]);

  useEffect(() => {
    engineRef.current?.updateFades();
  }, [showGradients, fadeSize, maxHeight, gap]);

  const hover = index => {
    if (!navigatingRef.current) setSelected(index);
  };

  const choose = (item, index) => {
    setSelected(index);
    onItemSelect?.(item, index);
  };

  return (
    <div
      ref={rootRef}
      className={`animated-list${frame ? ' animated-list--framed' : ''} ${className}`.trim()}
      data-animated={animation !== 'none' ? '' : undefined}
      style={{
        ...(THEMES[theme] ?? THEMES.dark),
        '--al-radius': `${Math.max(0, radius)}px`,
        '--al-gap': `${Math.max(0, gap)}px`,
        '--al-width': size(width),
        '--al-accent': accentColor || 'var(--al-ink)',
        ...(accentColor
          ? { '--al-ring': accentColor, '--al-ring-fill': `color-mix(in srgb, ${accentColor} 8%, transparent)` }
          : {}),
        ...style
      }}
    >
      <div
        ref={viewportRef}
        className={`animated-list__viewport${displayScrollbar ? '' : ' animated-list__viewport--bare'}`}
        role="listbox"
        tabIndex={0}
        aria-activedescendant={selected >= 0 && selected < items.length ? `${baseId}-${selected}` : undefined}
        style={{
          maxHeight: size(maxHeight),
          maskImage: showGradients ? FADE_MASK : undefined,
          WebkitMaskImage: showGradients ? FADE_MASK : undefined
        }}
      >
        <div ref={trackRef} className="animated-list__track">
          {items.map((item, index) => {
            const entry = item !== null && typeof item === 'object' ? item : { title: item };
            const isSelected = index === selected;
            return (
              <div
                key={entry.id ?? index}
                ref={element => {
                  itemRefs.current[index] = element;
                }}
                id={`${baseId}-${index}`}
                className={`animated-list__item ${itemClassName}`.trim()}
                role="option"
                aria-selected={isSelected}
                data-index={index}
                data-selected={isSelected ? '' : undefined}
                onPointerEnter={selectOnHover ? () => hover(index) : undefined}
                onClick={() => choose(item, index)}
              >
                {renderItem ? (
                  renderItem(item, index, isSelected)
                ) : (
                  <>
                    {(entry.image || entry.icon) && (
                      <span className="animated-list__lead">
                        {entry.image ? <img src={entry.image} alt="" draggable={false} /> : entry.icon}
                      </span>
                    )}
                    <span className="animated-list__text">
                      <span className="animated-list__title">{entry.title}</span>
                      {entry.description && <span className="animated-list__description">{entry.description}</span>}
                    </span>
                    {entry.meta && <span className="animated-list__meta">{entry.meta}</span>}
                  </>
                )}
                <span className="animated-list__rim" aria-hidden="true" />
              </div>
            );
          })}
          <span ref={indicatorRef} className="animated-list__indicator" aria-hidden="true">
            <span ref={ringRef} className="animated-list__ring" />
          </span>
        </div>
      </div>
      {frame && <span className="animated-list__frame-rim" aria-hidden="true" />}
    </div>
  );
};

export default AnimatedList;

```

### Component CSS
```css
.animated-list {
  position: relative;
  width: min(100%, var(--al-width));
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
  border-radius: calc(var(--al-radius) + 12px);
  color: var(--al-ink);
  -webkit-tap-highlight-color: transparent;
}

.animated-list--framed {
  padding: 6px;
  background: var(--al-frame);
  box-shadow: var(--al-frame-shadow);
  -webkit-backdrop-filter: blur(20px) saturate(1.6);
  backdrop-filter: blur(20px) saturate(1.6);
}

.animated-list:has(> .animated-list__viewport:focus-visible) {
  outline: 2px solid var(--al-accent);
  outline-offset: 3px;
}

.animated-list__frame-rim {
  position: absolute;
  inset: 0;
  z-index: 3;
  border-radius: inherit;
  box-shadow:
    inset 0 0 0 1px var(--al-frame-edge),
    inset 0 1px 0 var(--al-frame-highlight);
  pointer-events: none;
}

.animated-list__viewport {
  --al-fade-top: 0px;
  --al-fade-bottom: 0px;
  position: relative;
  box-sizing: border-box;
  padding: 6px;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  border-radius: calc(var(--al-radius) + 6px);
  outline: none;
  scrollbar-width: thin;
  scrollbar-color: var(--al-thumb) transparent;
}

.animated-list__viewport::-webkit-scrollbar {
  width: 6px;
}

.animated-list__viewport::-webkit-scrollbar-track {
  background: transparent;
}

.animated-list__viewport::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: var(--al-thumb);
}

.animated-list__viewport--bare {
  scrollbar-width: none;
}

.animated-list__viewport--bare::-webkit-scrollbar {
  display: none;
}

.animated-list__track {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--al-gap);
}

.animated-list__item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding: 10px 14px 10px 10px;
  box-sizing: border-box;
  border-radius: var(--al-radius);
  background: var(--al-tile);
  box-shadow: var(--al-tile-shadow);
  color: var(--al-ink);
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
}

.animated-list[data-animated] .animated-list__item:not([data-state]) {
  opacity: 0;
}

@media (hover: hover) {
  .animated-list__item:hover {
    filter: var(--al-hover);
  }
}

.animated-list__item[data-selected]:not(:active) {
  filter: var(--al-active);
}

.animated-list__item:active {
  filter: var(--al-press);
}

.animated-list__lead {
  display: grid;
  place-items: center;
  flex: none;
  width: 36px;
  height: 36px;
  overflow: hidden;
  border-radius: max(8px, calc(var(--al-radius) - 4px));
  background: var(--al-well);
  color: var(--al-ink);
}

.animated-list__lead img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.animated-list__text {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.animated-list__title {
  overflow: hidden;
  font-size: 14.5px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.01em;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.animated-list__description {
  overflow: hidden;
  font-size: 13px;
  line-height: 1.35;
  color: var(--al-muted);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.animated-list__meta {
  flex: none;
  font-size: 12.5px;
  font-variant-numeric: tabular-nums;
  color: var(--al-muted);
}

.animated-list__rim {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow:
    inset 0 0 0 1px var(--al-tile-edge),
    inset 0 1px 0 var(--al-tile-highlight);
  pointer-events: none;
}

.animated-list__indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
  height: 0;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.animated-list__ring {
  position: absolute;
  inset: 0;
  border-radius: var(--al-radius);
  background: var(--al-ring-fill);
  box-shadow: inset 0 0 0 1px var(--al-ring);
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.


## Integrate the <CardNav /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: CardNav
### Variant: JavaScript + CSS
### Dependencies: @hugeicons/react @hugeicons/core-free-icons

---

### Usage Example
```jsx
import CardNav from './CardNav';
import logo from './logo.svg';

const items = [
  {
    label: 'About',
    description: 'The people and the story behind the studio.',
    links: [
      { label: 'Company', href: '/company' },
      { label: 'Careers', href: '/careers' }
    ]
  },
  {
    label: 'Projects',
    description: 'Selected work from the last few years.',
    links: [
      { label: 'Featured', href: '/featured' },
      { label: 'Case studies', href: '/case-studies' }
    ]
  },
  {
    label: 'Contact',
    description: 'Say hello, we read everything.',
    links: [
      { label: 'Email', href: 'mailto:hello@example.com' },
      { label: 'LinkedIn', href: 'https://linkedin.com' }
    ]
  }
];

<CardNav
  logo={logo}
  logoAlt="Company"
  items={items}
  cta={{ label: 'Get started', href: '/signup' }}
  cardEffect="rise"
  openOn="click"
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| items | { label: string; description?: string; bgColor?: string; textColor?: string; links: { label: string; href?: string; ariaLabel?: string }[] }[] | - | The cards in the menu. Give a card a bgColor to tint it, and links without an href render as buttons. |
| logo | string | ReactNode | - | Image URL or element shown in the middle of the bar. |
| logoAlt | string | 'Logo' | Accessible label for the logo link. |
| logoHref | string | '#' | Where the logo links to. |
| cta | { label: string; href?: string; onClick?: (event) => void } | - | Button on the right of the bar. On narrow screens it moves to the bottom of the menu. |
| theme | 'dark' | 'light' | 'dark' | Color scheme of the bar, cards and button. |
| surface | 'glass' | 'solid' | 'glass' | Frosted glass that blurs what is behind the bar, or an opaque fill. |
| openOn | 'click' | 'hover' | 'click' | Opens the menu from the button, or as soon as the pointer moves over the bar. |
| cardEffect | 'rise' | 'unfold' | 'fade' | 'rise' | How the cards arrive: rising into place, folding down from the bar, or fading in from a soft blur. |
| stagger | number | 0.12 | How far each card trails the one before it, from 0 to 0.3. |
| bounce | number | 0.2 | How much the menu overshoots as it opens, from 0 to 1. |
| speed | number | 1 | Speed of the open and close animation. |
| cardHeight | number | 176 | Minimum height of the cards in px. |
| maxWidth | number | 800 | Maximum width of the bar in px. |
| accentColor | string | - | Color of the button. Its label picks black or white for contrast. |
| menuLabel | boolean | true | Shows Menu and Close next to the menu icon, rolling between them. |
| intro | boolean | true | Unrolls the bar from its center on mount. |
| defaultOpen | boolean | false | Starts with the menu open. |
| open | boolean | - | Controls the menu from outside. Pair it with onOpenChange. |
| onOpenChange | (open: boolean) => void | - | Called when the menu opens or closes. |
| linkComponent | ElementType | 'a' | Renders the links, so you can pass your router's link. It receives href, className and children. |
| onLinkClick | (link, item, event) => void | - | Called when a link is clicked. The menu closes afterwards. |
| ariaLabel | string | 'Main' | Accessible name of the nav landmark. |
| className | string | '' | Extra class names for the root. |
| style | CSSProperties | - | Inline styles for the root. |

### Full Component Source
```jsx
'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowUpRight01Icon } from '@hugeicons/core-free-icons';
import './CardNav.css';

const THEMES = {
  dark: {
    '--cn-panel': 'rgba(38, 35, 46, 0.72)',
    '--cn-solid': '#26232e',
    '--cn-edge': 'rgba(255, 255, 255, 0.08)',
    '--cn-highlight': 'rgba(255, 255, 255, 0.07)',
    '--cn-shadow': '0 24px 48px -20px rgba(0, 0, 0, 0.8), 0 6px 16px -8px rgba(0, 0, 0, 0.5)',
    '--cn-text': '#f4f4f5',
    '--cn-muted': 'rgba(244, 244, 245, 0.56)',
    '--cn-hover': 'rgba(255, 255, 255, 0.06)',
    '--cn-ring': 'rgba(244, 244, 245, 0.55)',
    '--cn-tile': 'linear-gradient(180deg, #34303d 0%, #27242f 100%)',
    '--cn-tile-rim':
      'inset 0 0 0 1px rgba(255, 255, 255, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 10px -4px rgba(0, 0, 0, 0.6)',
    '--cn-cta': 'linear-gradient(180deg, #ffffff 0%, #ebebf0 100%)',
    '--cn-cta-ink': '#121016',
    '--cn-cta-shadow': 'inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 6px 16px -6px rgba(0, 0, 0, 0.6)',
    '--cn-cta-hover': 'brightness(0.94)'
  },
  light: {
    '--cn-panel': 'rgba(244, 244, 246, 0.84)',
    '--cn-solid': '#f4f4f6',
    '--cn-edge': 'rgba(24, 24, 27, 0.07)',
    '--cn-highlight': 'rgba(255, 255, 255, 0.95)',
    '--cn-shadow': '0 24px 48px -24px rgba(24, 24, 27, 0.3), 0 6px 16px -10px rgba(24, 24, 27, 0.16)',
    '--cn-text': '#18181b',
    '--cn-muted': 'rgba(24, 24, 27, 0.56)',
    '--cn-hover': 'rgba(24, 24, 27, 0.05)',
    '--cn-ring': 'rgba(24, 24, 27, 0.45)',
    '--cn-tile': 'linear-gradient(180deg, #ffffff 0%, #f8f8fa 100%)',
    '--cn-tile-rim':
      'inset 0 0 0 1px rgba(24, 24, 27, 0.07), inset 0 1px 0 rgba(255, 255, 255, 1), 0 4px 10px -5px rgba(24, 24, 27, 0.22)',
    '--cn-cta': 'linear-gradient(180deg, #2c2c31 0%, #18181b 100%)',
    '--cn-cta-ink': '#ffffff',
    '--cn-cta-shadow': 'inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 6px 14px -6px rgba(24, 24, 27, 0.45)',
    '--cn-cta-hover': 'brightness(1.25)'
  }
};

const ROOT = 'card-nav';
const PANEL = 'card-nav__panel';
const RIM = 'card-nav__rim';
const BAR = 'card-nav__bar';
const MENU = 'card-nav__menu';
const BURGER = 'card-nav__burger';
const LINE_TOP = 'card-nav__line card-nav__line--top';
const LINE_BOTTOM = 'card-nav__line card-nav__line--bottom';
const MENU_LABEL = 'card-nav__menu-label';
const WORD_OPEN = 'card-nav__word card-nav__word--open';
const WORD_CLOSE = 'card-nav__word card-nav__word--close';
const LOGO = 'card-nav__logo';
const CTA = 'card-nav__cta';
const CTA_WIDE = 'card-nav__cta card-nav__cta--wide';
const CONTENT = 'card-nav__content';
const CARDS = 'card-nav__cards';
const CARD = 'card-nav__card';
const CARD_HEAD = 'card-nav__card-head';
const LABEL = 'card-nav__label';
const DESCRIPTION = 'card-nav__description';
const LINKS = 'card-nav__links';
const LINK = 'card-nav__link';
const ARROW = 'card-nav__arrow';
const ARROW_OUT = 'card-nav__arrow-icon card-nav__arrow-icon--out';
const ARROW_IN = 'card-nav__arrow-icon card-nav__arrow-icon--in';

const DEFAULT_ITEMS = [
  {
    label: 'About',
    description: 'The people and the story behind the studio.',
    links: [
      { label: 'Company', href: '#' },
      { label: 'Careers', href: '#' }
    ]
  },
  {
    label: 'Projects',
    description: 'Selected work from the last few years.',
    links: [
      { label: 'Featured', href: '#' },
      { label: 'Case studies', href: '#' }
    ]
  },
  {
    label: 'Contact',
    description: 'Say hello, we read everything.',
    links: [
      { label: 'Email', href: '#' },
      { label: 'X', href: '#' },
      { label: 'LinkedIn', href: '#' }
    ]
  }
];

const NARROW = 560;
const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const easeOut = t => 1 - (1 - t) ** 3;

const contrastInk = color => {
  const hex = String(color || '')
    .trim()
    .replace('#', '');
  if (!/^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) return null;
  const full =
    hex.length === 3
      ? hex
          .split('')
          .map(c => c + c)
          .join('')
      : hex;
  const channel = index => {
    const value = parseInt(full.slice(index, index + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  const luminance = 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
  return luminance > 0.36 ? '#121016' : '#ffffff';
};

const CardNav = ({
  logo,
  logoAlt = 'Logo',
  logoHref = '#',
  items = DEFAULT_ITEMS,
  cta,
  theme = 'dark',
  surface = 'glass',
  openOn = 'click',
  cardEffect = 'rise',
  stagger = 0.12,
  bounce = 0.2,
  speed = 1,
  cardHeight = 176,
  maxWidth = 800,
  accentColor,
  menuLabel = true,
  intro = true,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  linkComponent: LinkComponent = 'a',
  onLinkClick,
  ariaLabel = 'Main',
  className = '',
  style
}) => {
  const contentId = useId();
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const contentRef = useRef(null);
  const menuRef = useRef(null);
  const cardRefs = useRef([]);
  const engineRef = useRef(null);
  const leaveRef = useRef(0);
  const barRef = useRef(null);
  const introRef = useRef(intro);
  const [openState, setOpenState] = useState(defaultOpen);
  const [narrow, setNarrow] = useState(false);
  const [shown, setShown] = useState(defaultOpen);

  const controlled = openProp !== undefined;
  const hasCta = Boolean(cta);
  const open = controlled ? openProp : openState;

  const settings = {
    open,
    cardEffect,
    stagger: clamp(stagger, 0, 0.3),
    bounce: clamp(bounce, 0, 1),
    speed: clamp(speed, 0.2, 3)
  };
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const palette = THEMES[theme] ?? THEMES.dark;
  const vars = {
    ...palette,
    '--cn-max': `${maxWidth}px`,
    '--cn-bar': '60px',
    '--cn-inset': '8px',
    '--cn-gap': '8px',
    '--cn-radius': '18px',
    '--cn-logo': '24px',
    '--cn-card': `${cardHeight}px`
  };
  if (surface === 'glass') vars['--cn-blur'] = 'blur(20px) saturate(1.6)';
  if (surface === 'solid') {
    vars['--cn-panel'] = palette['--cn-solid'];
    vars['--cn-blur'] = 'none';
  }
  if (accentColor) {
    vars['--cn-cta'] = accentColor;
    vars['--cn-cta-ink'] = contrastInk(accentColor) || '#ffffff';
    vars['--cn-cta-shadow'] = 'inset 0 1px 0 rgba(255, 255, 255, 0.22), 0 6px 16px -6px rgba(0, 0, 0, 0.45)';
    vars['--cn-cta-hover'] = 'brightness(1.08)';
  }

  const setOpen = next => {
    if (next === open) return;
    if (!controlled) setOpenState(next);
    onOpenChange?.(next);
  };
  const setOpenRef = useRef(setOpen);
  setOpenRef.current = setOpen;

  useEffect(() => {
    const panel = panelRef.current;
    const content = contentRef.current;
    if (!panel || !content) return undefined;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const state = { p: settingsRef.current.open ? 1 : 0, v: 0, height: content.offsetHeight, bar: 60 };
    let raf = 0;
    let last = 0;

    const render = () => {
      const s = settingsRef.current;
      state.bar = parseFloat(getComputedStyle(panel).getPropertyValue('--cn-bar')) || 60;
      panel.style.height = `${state.bar + Math.max(0, state.p) * state.height}px`;
      const cards = cardRefs.current.filter(Boolean);
      const count = cards.length;
      const lag = count > 1 ? Math.min(s.stagger, 0.7 / (count - 1)) : 0;
      const span = 1 - lag * (count - 1);
      cards.forEach((card, index) => {
        const local = clamp((state.p - index * lag) / Math.max(span, 0.05), 0, 1);
        const e = easeOut(local);
        if (s.cardEffect === 'unfold') {
          card.style.transform = `translateY(${(1 - e) * -10}px) rotateX(${(1 - e) * -72}deg)`;
          card.style.opacity = `${clamp(local * 1.8, 0, 1)}`;
          card.style.filter = '';
        } else if (s.cardEffect === 'fade') {
          card.style.transform = `translateY(${(1 - e) * 6}px)`;
          card.style.opacity = `${e}`;
          card.style.filter = e < 0.999 ? `blur(${(1 - e) * 6}px)` : '';
        } else {
          card.style.transform = `translateY(${(1 - e) * 26}px) scale(${0.97 + 0.03 * e})`;
          card.style.opacity = `${e}`;
          card.style.filter = '';
        }
      });
    };

    const tick = now => {
      raf = 0;
      const s = settingsRef.current;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      const target = s.open ? 1 : 0;
      if (reduce) {
        state.p = target;
        state.v = 0;
      } else {
        const k = 160 * s.speed * s.speed;
        const zeta = s.open ? 1 - 0.68 * s.bounce : 1;
        const steps = Math.ceil(dt / (1 / 240));
        const h = dt / steps;
        for (let i = 0; i < steps; i++) {
          state.v += (-k * (state.p - target) - 2 * zeta * Math.sqrt(k) * state.v) * h;
          state.p += state.v * h;
        }
      }
      const done = Math.abs(state.p - target) < 0.0005 && Math.abs(state.v) < 0.002;
      if (done) {
        state.p = target;
        state.v = 0;
      }
      render();
      if (done && target === 0) setShown(false);
      if (!done) raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    };

    engineRef.current = {
      wake,
      refresh: () => {
        state.height = content.offsetHeight;
        render();
      }
    };

    render();
    const observer = new ResizeObserver(() => {
      state.height = content.offsetHeight;
      render();
    });
    observer.observe(content);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      engineRef.current = null;
    };
  }, [items.length, hasCta, narrow]);

  useLayoutEffect(() => {
    if (open) setShown(true);
    engineRef.current?.refresh();
    engineRef.current?.wake();
  }, [open]);

  useEffect(() => {
    engineRef.current?.refresh();
  });

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const measure = () => setNarrow(root.offsetWidth < NARROW);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = event => {
      const target = event.target;
      if (target instanceof Node && rootRef.current?.contains(target)) return;
      setOpenRef.current(false);
    };
    const onKeyDown = event => {
      if (event.key !== 'Escape') return;
      setOpenRef.current(false);
      menuRef.current?.focus();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  useEffect(() => () => window.clearTimeout(leaveRef.current), []);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const bar = barRef.current;
    if (!panel || !bar || !introRef.current) return;
    introRef.current = false;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const width = panel.offsetWidth;
    const height = panel.offsetHeight;
    const radius = parseFloat(getComputedStyle(panel).borderTopLeftRadius) || 18;
    panel.animate(
      [
        { clipPath: `inset(0px ${Math.max(0, (width - height) / 2)}px round ${height / 2}px)`, opacity: 0 },
        { clipPath: `inset(0px 0px round ${radius}px)`, opacity: 1 }
      ],
      { duration: 820, easing: EASE_OUT, fill: 'backwards' }
    );
    Array.from(bar.children).forEach((child, index) => {
      child.animate(
        [
          { opacity: 0, transform: 'translateY(8px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ],
        { duration: 560, delay: 220 + index * 70, easing: EASE_OUT, fill: 'backwards' }
      );
    });
  }, []);

  const hover = openOn === 'hover';

  const onPointerEnter = event => {
    if (!hover || event.pointerType === 'touch') return;
    window.clearTimeout(leaveRef.current);
    setOpen(true);
  };

  const onPointerLeave = event => {
    if (!hover || event.pointerType === 'touch') return;
    window.clearTimeout(leaveRef.current);
    leaveRef.current = window.setTimeout(() => setOpenRef.current(false), 160);
  };

  const anchor = (target, props, children) => {
    if (!target.href) {
      return (
        <button type="button" {...props}>
          {children}
        </button>
      );
    }
    return (
      <LinkComponent href={target.href} {...props}>
        {children}
      </LinkComponent>
    );
  };

  const ctaButton = (target, wide) =>
    anchor(
      target,
      {
        className: wide ? CTA_WIDE : CTA,
        tabIndex: wide && !open ? -1 : undefined,
        onClick: event => {
          target.onClick?.(event);
          if (wide) setOpen(false);
        }
      },
      target.label
    );

  return (
    <div
      ref={rootRef}
      className={[ROOT, className].filter(Boolean).join(' ')}
      data-open={open ? '' : undefined}
      data-shown={shown || open ? '' : undefined}
      data-narrow={narrow ? '' : undefined}
      style={{ ...vars, ...style }}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <nav ref={panelRef} className={PANEL} aria-label={ariaLabel}>
        <div ref={barRef} className={BAR}>
          <button
            ref={menuRef}
            type="button"
            className={MENU}
            data-icon-only={menuLabel ? undefined : ''}
            aria-expanded={open}
            aria-controls={contentId}
            aria-label={menuLabel ? undefined : open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen(!open)}
          >
            <span className={BURGER} aria-hidden="true">
              <span className={LINE_TOP} />
              <span className={LINE_BOTTOM} />
            </span>
            {menuLabel && (
              <span className={MENU_LABEL}>
                <span className={WORD_OPEN} aria-hidden={open}>
                  Menu
                </span>
                <span className={WORD_CLOSE} aria-hidden={!open}>
                  Close
                </span>
              </span>
            )}
          </button>

          {logo && (
            <LinkComponent href={logoHref} className={LOGO} aria-label={logoAlt}>
              {typeof logo === 'string' ? <img src={logo} alt="" draggable={false} /> : logo}
            </LinkComponent>
          )}

          {cta && !narrow && ctaButton(cta, false)}
        </div>

        <div ref={contentRef} id={contentId} className={CONTENT} aria-hidden={!open}>
          <div className={CARDS}>
            {items.map((item, index) => (
              <div
                key={`${item.label}-${index}`}
                ref={element => {
                  cardRefs.current[index] = element;
                }}
                className={CARD}
                data-tinted={item.bgColor ? '' : undefined}
                style={item.bgColor ? { background: item.bgColor, color: item.textColor } : undefined}
              >
                <div className={CARD_HEAD}>
                  <span className={LABEL}>{item.label}</span>
                  {item.description && <p className={DESCRIPTION}>{item.description}</p>}
                </div>
                <ul className={LINKS}>
                  {(item.links ?? []).map((link, linkIndex) => (
                    <li key={`${link.label}-${linkIndex}`}>
                      {anchor(
                        link,
                        {
                          className: LINK,
                          'aria-label': link.ariaLabel,
                          tabIndex: open ? undefined : -1,
                          onClick: event => {
                            onLinkClick?.(link, item, event);
                            setOpen(false);
                          }
                        },
                        <>
                          <span className={ARROW} aria-hidden="true">
                            <HugeiconsIcon className={ARROW_OUT} icon={ArrowUpRight01Icon} size={14} strokeWidth={2} />
                            <HugeiconsIcon className={ARROW_IN} icon={ArrowUpRight01Icon} size={14} strokeWidth={2} />
                          </span>
                          {link.label}
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {cta && narrow && (
            <div
              ref={element => {
                cardRefs.current[items.length] = element;
              }}
            >
              {ctaButton(cta, true)}
            </div>
          )}
        </div>
        <span className={RIM} />
      </nav>
    </div>
  );
};

export default CardNav;

```

### Component CSS
```css
.card-nav {
  position: relative;
  width: 100%;
  max-width: var(--cn-max);
  height: var(--cn-bar);
  margin: 0 auto;
  font-size: 14px;
  line-height: 1.4;
  -webkit-tap-highlight-color: transparent;
}

.card-nav__panel {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 10;
  height: var(--cn-bar);
  border-radius: var(--cn-radius);
  overflow: hidden;
  background: var(--cn-panel);
  box-shadow: var(--cn-shadow);
  -webkit-backdrop-filter: var(--cn-blur);
  backdrop-filter: var(--cn-blur);
}

.card-nav__rim {
  position: absolute;
  inset: 0;
  z-index: 3;
  border-radius: inherit;
  box-shadow:
    inset 0 0 0 1px var(--cn-edge),
    inset 0 1px 0 var(--cn-highlight);
  pointer-events: none;
}

.card-nav__bar {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  height: var(--cn-bar);
  padding: 0 var(--cn-inset);
  box-sizing: border-box;
}

.card-nav__menu {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  justify-self: start;
  height: calc(var(--cn-bar) - var(--cn-inset) * 2);
  padding: 0 14px 0 16px;
  border: 0;
  border-radius: calc(var(--cn-radius) - var(--cn-inset));
  background: none;
  color: var(--cn-text);
  font-family: inherit;
  font-size: inherit;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  transition: background-color 0.2s ease;
}

.card-nav__menu[data-icon-only] {
  justify-content: center;
  width: calc(var(--cn-bar) - var(--cn-inset) * 2);
  padding: 0;
}

.card-nav__menu:hover {
  background: var(--cn-hover);
}

.card-nav__menu:focus-visible,
.card-nav__logo:focus-visible,
.card-nav__cta:focus-visible,
.card-nav__link:focus-visible {
  outline: 2px solid var(--cn-ring);
  outline-offset: 2px;
}

.card-nav__burger {
  position: relative;
  width: 18px;
  height: 12px;
}

.card-nav__line {
  position: absolute;
  left: 0;
  width: 100%;
  height: 1.5px;
  border-radius: 2px;
  background: currentColor;
  transition:
    transform 0.5s cubic-bezier(0.22, 1, 0.36, 1),
    top 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.card-nav__line--top {
  top: 2.25px;
}

.card-nav__line--bottom {
  top: 8.25px;
}

.card-nav[data-open] .card-nav__line--top {
  top: 5.25px;
  transform: rotate(45deg);
}

.card-nav[data-open] .card-nav__line--bottom {
  top: 5.25px;
  transform: rotate(-45deg);
}

.card-nav__menu-label {
  position: relative;
  display: inline-grid;
  overflow: hidden;
}

.card-nav__word {
  grid-area: 1 / 1;
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.card-nav__word--close {
  transform: translateY(110%);
}

.card-nav[data-open] .card-nav__word--open {
  transform: translateY(-110%);
}

.card-nav[data-open] .card-nav__word--close {
  transform: translateY(0);
}

.card-nav__logo {
  display: inline-flex;
  align-items: center;
  justify-self: center;
  height: var(--cn-logo);
  color: var(--cn-text);
  text-decoration: none;
  outline: none;
}

.card-nav__logo img,
.card-nav__logo svg {
  display: block;
  height: 100%;
  width: auto;
}

.card-nav__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  justify-self: end;
  height: calc(var(--cn-bar) - var(--cn-inset) * 2);
  padding: 0 16px;
  border: 0;
  border-radius: calc(var(--cn-radius) - var(--cn-inset));
  background: var(--cn-cta);
  box-shadow: var(--cn-cta-shadow);
  color: var(--cn-cta-ink);
  font-family: inherit;
  font-size: inherit;
  font-weight: 600;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  outline: none;
  transition: filter 0.2s ease;
}

.card-nav__cta:hover {
  filter: var(--cn-cta-hover);
}

.card-nav[data-narrow] .card-nav__bar {
  grid-template-columns: auto 1fr auto;
}

.card-nav[data-narrow] .card-nav__logo {
  grid-column: 1;
  grid-row: 1;
  justify-self: start;
  padding-left: 14px;
}

.card-nav[data-narrow] .card-nav__menu {
  grid-column: 3;
  grid-row: 1;
  justify-self: end;
}

.card-nav__content {
  position: absolute;
  top: var(--cn-bar);
  right: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  gap: var(--cn-gap);
  padding: 0 var(--cn-inset) var(--cn-inset);
  box-sizing: border-box;
  perspective: 900px;
}

.card-nav__content {
  visibility: hidden;
}

.card-nav[data-shown] .card-nav__content {
  visibility: visible;
}

.card-nav__cards {
  display: flex;
  gap: var(--cn-gap);
}

.card-nav[data-narrow] .card-nav__cards {
  flex-direction: column;
}

.card-nav__card {
  position: relative;
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  gap: 18px;
  min-width: 0;
  min-height: var(--cn-card);
  padding: 16px 16px 14px;
  border-radius: calc(var(--cn-radius) - var(--cn-inset));
  box-sizing: border-box;
  background: var(--cn-tile);
  box-shadow: var(--cn-tile-rim);
  color: var(--cn-text);
  transform-origin: 50% 0;
  will-change: transform, opacity;
}

.card-nav[data-narrow] .card-nav__card {
  flex: none;
  min-height: 0;
  gap: 10px;
  padding: 14px 14px 12px;
}

.card-nav[data-narrow] .card-nav__links {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 2px 16px;
}

.card-nav__card[data-tinted] {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.16),
    0 4px 10px -4px rgba(0, 0, 0, 0.45);
}

.card-nav__card-head {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-nav__label {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.015em;
}

.card-nav__description {
  margin: 0;
  color: var(--cn-muted);
  font-size: 13px;
  line-height: 1.45;
}

.card-nav__card[data-tinted] .card-nav__description {
  color: inherit;
  opacity: 0.7;
}

.card-nav__links {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: auto 0 0;
  padding: 0;
  list-style: none;
}

.card-nav__link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 3px 0;
  border: 0;
  border-radius: 6px;
  background: none;
  color: inherit;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  outline: none;
  opacity: 0.82;
  transition: opacity 0.2s ease;
}

.card-nav__link:hover {
  opacity: 1;
}

.card-nav__arrow {
  position: relative;
  display: inline-block;
  flex: none;
  width: 14px;
  height: 14px;
  overflow: hidden;
}

.card-nav__arrow-icon {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.card-nav__arrow-icon--in {
  transform: translate(-110%, 110%);
}

.card-nav__link:hover .card-nav__arrow-icon--out,
.card-nav__link:focus-visible .card-nav__arrow-icon--out {
  transform: translate(110%, -110%);
}

.card-nav__link:hover .card-nav__arrow-icon--in,
.card-nav__link:focus-visible .card-nav__arrow-icon--in {
  transform: translate(0, 0);
}

.card-nav__cta--wide {
  display: flex;
  width: 100%;
  height: 44px;
}

@media (prefers-reduced-motion: reduce) {
  .card-nav__line,
  .card-nav__word,
  .card-nav__arrow-icon {
    transition: none;
  }
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.


## Integrate the <PillNav /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: PillNav
### Variant: JavaScript + CSS


---

### Usage Example
```jsx
import PillNav from './PillNav';
import logo from './logo.svg';

<PillNav
  logo={logo}
  logoAlt="Company"
  items={[
    { label: 'Home', href: '/' },
    { label: 'Journal', href: '/journal' },
    { label: 'Photos', href: '/photos' },
    { label: 'About', href: '/about' }
  ]}
  activeHref="/"
  itemStyle="pill"
  hoverEffect="fill"
  indicator="dot"
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| items | { label: string; href?: string; icon?: ReactNode; ariaLabel?: string }[] | - | The navigation links. Items without an href render as buttons. |
| logo | string | ReactNode | - | Image URL or element shown in the round logo button. It spins on hover. |
| logoAlt | string | 'Logo' | Accessible label for the logo link. |
| logoHref | string | '#' | Where the logo links to. |
| activeHref | string | - | Marks the item with this href as the current page. Leave it out to let the nav track clicks itself. |
| defaultActiveIndex | number | 0 | Which item starts active when activeHref is not set. |
| onItemClick | (item, index, event) => void | - | Called when an item is clicked. |
| linkComponent | ElementType | 'a' | Renders the links, so you can pass your router's link. It receives href, className and children. |
| theme | 'dark' | 'light' | 'dark' | Color scheme of the surfaces, labels and highlight. |
| layout | 'split' | 'joined' | 'split' | Split puts the logo in its own bubble beside the bar. Joined holds everything in one capsule. |
| itemStyle | 'pill' | 'plain' | 'pill' | Pill gives every item its own raised pill. Plain shows the labels straight on the bar. |
| hoverEffect | 'fill' | 'glide' | 'none' | 'fill' | Fill rises a circle through the hovered pill as its label rolls over. Glide slides one pill to the item under the cursor. |
| indicator | 'dot' | 'pill' | 'none' | 'dot' | How the current page is marked: a small dot that slides between items, or a filled pill. |
| surface | 'glass' | 'solid' | 'none' | 'glass' | Background of the bar and logo: frosted glass, an opaque fill, or nothing. |
| size | 'sm' | 'md' | 'lg' | 'md' | Height, padding and text size. |
| highlightColor | string | - | Color of the fill, the gliding pill and the dot. Labels on it pick black or white for contrast. |
| highlightTextColor | string | - | Overrides the label color on the highlight. |
| barColor | string | - | Overrides the background of the bar and logo. |
| textColor | string | - | Overrides the label color. |
| bounce | number | 0.3 | How much the gliding pill and the dot overshoot as they settle, from 0 to 1. |
| stretch | number | 0.5 | How far the gliding pill stretches toward its target before the back edge catches up, from 0 to 1. |
| collapse | 'auto' | 'always' | 'never' | 'auto' | When the links fold into a menu button. Auto folds them only when they no longer fit. |
| onMenuToggle | (open: boolean) => void | - | Called when the folded menu opens or closes. |
| intro | boolean | true | Pops the logo in and unrolls the bar on mount. |
| ariaLabel | string | 'Main' | Accessible name of the nav landmark. |
| className | string | '' | Extra class names for the nav. |
| style | CSSProperties | - | Inline styles for the nav. |

### Full Component Source
```jsx
'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import './PillNav.css';

const THEMES = {
  dark: {
    '--pn-surface': 'rgba(38, 35, 46, 0.66)',
    '--pn-solid': '#26232e',
    '--pn-edge': 'rgba(255, 255, 255, 0.08)',
    '--pn-rim': 'rgba(255, 255, 255, 0.07)',
    '--pn-shadow': '0 22px 44px -20px rgba(0, 0, 0, 0.8), 0 6px 16px -8px rgba(0, 0, 0, 0.5)',
    '--pn-text': 'rgba(244, 244, 245, 0.64)',
    '--pn-strong': '#f4f4f5',
    '--pn-pill': 'linear-gradient(180deg, #ffffff 0%, #ebebf0 100%)',
    '--pn-pill-ink': '#121016',
    '--pn-pill-shadow': 'inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 6px 16px -6px rgba(0, 0, 0, 0.6)',
    '--pn-dot': '#f4f4f5',
    '--pn-ring': 'rgba(244, 244, 245, 0.55)',
    '--pn-row-hover': 'rgba(255, 255, 255, 0.06)',
    '--pn-tile': 'linear-gradient(180deg, #3a3644 0%, #27242f 100%)',
    '--pn-tile-rim':
      'inset 0 0 0 1px rgba(255, 255, 255, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 4px 10px -4px rgba(0, 0, 0, 0.7)'
  },
  light: {
    '--pn-surface': 'rgba(240, 240, 243, 0.8)',
    '--pn-solid': '#f0f0f3',
    '--pn-edge': 'rgba(24, 24, 27, 0.07)',
    '--pn-rim': 'rgba(255, 255, 255, 0.95)',
    '--pn-shadow': '0 22px 44px -22px rgba(24, 24, 27, 0.3), 0 6px 16px -10px rgba(24, 24, 27, 0.16)',
    '--pn-text': 'rgba(24, 24, 27, 0.6)',
    '--pn-strong': '#18181b',
    '--pn-pill': 'linear-gradient(180deg, #2c2c31 0%, #18181b 100%)',
    '--pn-pill-ink': '#ffffff',
    '--pn-pill-shadow': 'inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 6px 14px -6px rgba(24, 24, 27, 0.45)',
    '--pn-dot': '#18181b',
    '--pn-ring': 'rgba(24, 24, 27, 0.45)',
    '--pn-row-hover': 'rgba(24, 24, 27, 0.05)',
    '--pn-tile': 'linear-gradient(180deg, #ffffff 0%, #f6f6f8 100%)',
    '--pn-tile-rim':
      'inset 0 0 0 1px rgba(24, 24, 27, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1), 0 4px 10px -5px rgba(24, 24, 27, 0.25)'
  }
};

const SIZES = {
  sm: {
    '--pn-h': '36px',
    '--pn-pad': '3px',
    '--pn-inner': '30px',
    '--pn-x': '12px',
    '--pn-font': '13px',
    '--pn-gap': '6px',
    '--pn-mark': '18px'
  },
  md: {
    '--pn-h': '44px',
    '--pn-pad': '4px',
    '--pn-inner': '36px',
    '--pn-x': '16px',
    '--pn-font': '14px',
    '--pn-gap': '8px',
    '--pn-mark': '22px'
  },
  lg: {
    '--pn-h': '52px',
    '--pn-pad': '5px',
    '--pn-inner': '42px',
    '--pn-x': '20px',
    '--pn-font': '15px',
    '--pn-gap': '10px',
    '--pn-mark': '26px'
  }
};

const ROOT = 'pill-nav';
const SURFACE = 'pill-nav__surface';
const RIM = 'pill-nav__rim';
const ROOT_RIM = 'pill-nav__rim pill-nav__rim--root';
const LOGO = 'pill-nav__logo';
const LOGO_LINK = 'pill-nav__logo-link';
const MARK = 'pill-nav__mark';
const BAR = 'pill-nav__bar';
const TRACK = 'pill-nav__track';
const LIST = 'pill-nav__list';
const SLOT = 'pill-nav__slot';
const ITEM = 'pill-nav__item';
const FACE = 'pill-nav__face';
const FACE_ALT = 'pill-nav__face-alt';
const FILL = 'pill-nav__fill';
const GLIDE = 'pill-nav__glide';
const INK = 'pill-nav__ink';
const INK_ITEM = 'pill-nav__ink-item';
const DOT = 'pill-nav__dot';
const TOGGLE = 'pill-nav__toggle';
const TOGGLE_BARE = 'pill-nav__toggle--bare';
const BURGER = 'pill-nav__burger';
const LINE_TOP = 'pill-nav__line pill-nav__line--top';
const LINE_BOTTOM = 'pill-nav__line pill-nav__line--bottom';
const PANEL = 'pill-nav__panel';
const MENU = 'pill-nav__menu';
const ROW = 'pill-nav__row';
const MEASURE = 'pill-nav__measure';

const DEFAULT_ITEMS = [
  { label: 'Home', href: '#' },
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' }
];

const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const contrastInk = color => {
  const hex = String(color || '')
    .trim()
    .replace('#', '');
  if (!/^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) return null;
  const full =
    hex.length === 3
      ? hex
          .split('')
          .map(c => c + c)
          .join('')
      : hex;
  const channel = index => {
    const value = parseInt(full.slice(index, index + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  const luminance = 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
  return luminance > 0.36 ? '#121016' : '#ffffff';
};

const readVar = (element, name) => parseFloat(getComputedStyle(element).getPropertyValue(name)) || 0;

const PillNav = ({
  logo,
  logoAlt = 'Logo',
  logoHref = '#',
  items = DEFAULT_ITEMS,
  activeHref,
  defaultActiveIndex = 0,
  onItemClick,
  linkComponent: LinkComponent = 'a',
  theme = 'dark',
  layout = 'split',
  size = 'md',
  surface = 'glass',
  itemStyle = 'pill',
  hoverEffect = 'fill',
  indicator = 'dot',
  highlightColor,
  highlightTextColor,
  barColor,
  textColor,
  bounce = 0.3,
  stretch = 0.5,
  intro = true,
  collapse = 'auto',
  onMenuToggle,
  ariaLabel = 'Main',
  className = '',
  style
}) => {
  const panelId = useId();
  const rootRef = useRef(null);
  const barRef = useRef(null);
  const trackRef = useRef(null);
  const glideRef = useRef(null);
  const inkRef = useRef(null);
  const dotRef = useRef(null);
  const logoRef = useRef(null);
  const markRef = useRef(null);
  const toggleRef = useRef(null);
  const panelRef = useRef(null);
  const measureRef = useRef(null);
  const measureListRef = useRef(null);
  const slotRefs = useRef([]);
  const engineRef = useRef(null);
  const introRef = useRef(intro);
  const slideRef = useRef(false);
  const pendingRef = useRef(null);
  const [selected, setSelected] = useState(defaultActiveIndex);
  const [collapsed, setCollapsed] = useState(collapse === 'always');
  const [open, setOpen] = useState(false);
  const [panelShown, setPanelShown] = useState(false);

  const controlled = activeHref !== undefined;
  const activeIndex = controlled ? items.findIndex(item => item.href === activeHref) : selected;
  const joined = layout === 'joined';
  const hasLogo = Boolean(logo);
  const fill = hoverEffect === 'fill';
  const glide = !fill && (hoverEffect === 'glide' || indicator === 'pill');

  const settings = {
    hoverEffect,
    indicator,
    activeIndex,
    bounce: clamp(bounce, 0, 1),
    stretch: clamp(stretch, 0, 1)
  };
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const palette = THEMES[theme] ?? THEMES.dark;
  const vars = { ...palette, ...(SIZES[size] ?? SIZES.md) };
  if (surface === 'glass') vars['--pn-blur'] = 'blur(20px) saturate(1.6)';
  if (surface === 'solid') {
    vars['--pn-surface'] = palette['--pn-solid'];
    vars['--pn-blur'] = 'none';
  }
  if (surface === 'none') {
    vars['--pn-surface'] = 'transparent';
    vars['--pn-shadow'] = 'none';
    vars['--pn-blur'] = 'none';
    vars['--pn-edge'] = 'transparent';
    vars['--pn-rim'] = 'transparent';
  }
  if (barColor) {
    vars['--pn-surface'] = barColor;
    vars['--pn-solid'] = barColor;
  }
  if (textColor) {
    vars['--pn-strong'] = textColor;
    vars['--pn-text'] = `color-mix(in srgb, ${textColor} 64%, transparent)`;
  }
  if (highlightColor) {
    vars['--pn-pill'] = highlightColor;
    vars['--pn-dot'] = highlightColor;
    vars['--pn-pill-shadow'] = 'inset 0 1px 0 rgba(255, 255, 255, 0.22), 0 6px 16px -6px rgba(0, 0, 0, 0.45)';
    vars['--pn-pill-ink'] = highlightTextColor || contrastInk(highlightColor) || palette['--pn-pill-ink'];
  } else if (highlightTextColor) {
    vars['--pn-pill-ink'] = highlightTextColor;
  }

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const state = {
      x0: 0,
      x1: 0,
      v0: 0,
      v1: 0,
      alpha: 0,
      pop: 1,
      press: 1,
      pressVelocity: 0,
      dotX: 0,
      dotVelocity: 0,
      dotAlpha: 0,
      hover: -1,
      focus: false,
      sliding: false,
      pressing: false,
      waiting: slideRef.current && !reduce
    };
    slideRef.current = false;
    const rects = [];
    let trackWidth = 0;
    let trackHeight = 0;
    let raf = 0;
    let last = 0;

    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      trackWidth = track.offsetWidth;
      trackHeight = track.offsetHeight;
      slotRefs.current.forEach((slot, index) => {
        if (!slot) return;
        rects[index] = { left: slot.offsetLeft, width: slot.offsetWidth };
        const reach = Math.ceil(2 * Math.sqrt((slot.offsetWidth / 2) ** 2 + slot.offsetHeight ** 2)) + 2;
        slot.style.setProperty('--pn-fill', `${reach}px`);
      });
    };

    const glideIndex = () => {
      const s = settingsRef.current;
      if (s.hoverEffect === 'fill') return -1;
      if (s.hoverEffect === 'glide' && state.hover >= 0) return state.hover;
      return s.indicator === 'pill' ? s.activeIndex : -1;
    };

    const sync = () => {
      const s = settingsRef.current;
      slotRefs.current.forEach((slot, index) => {
        if (!slot) return;
        const hovered = state.hover === index;
        slot.toggleAttribute('data-lit', hovered);
        slot.toggleAttribute('data-hover', hovered && s.hoverEffect === 'fill');
      });
      root.toggleAttribute('data-focus', state.focus && state.hover >= 0);
      root.toggleAttribute(
        'data-dot-lit',
        s.hoverEffect === 'fill' && state.hover >= 0 && state.hover === s.activeIndex
      );
    };

    const render = () => {
      const glideEl = glideRef.current;
      const ink = inkRef.current;
      const dot = dotRef.current;
      const width = Math.max(0, state.x1 - state.x0);
      const scale = state.press * state.pop;
      const target = rects[glideIndex()];
      const squash = target ? 1 - clamp((width / Math.max(target.width, 1) - 1) * 0.3, 0, 0.14) : 1;
      if (glideEl) {
        glideEl.style.width = `${width}px`;
        glideEl.style.transform = `translate3d(${state.x0}px, 0, 0) scale(${scale}, ${scale * squash})`;
        glideEl.style.opacity = `${state.alpha}`;
      }
      if (ink) {
        const half = (width * scale) / 2;
        const center = (state.x0 + state.x1) / 2;
        const inset = (trackHeight * (1 - scale * squash)) / 2;
        ink.style.clipPath = `inset(${inset}px ${trackWidth - center - half}px ${inset}px ${center - half}px round ${trackHeight / 2}px)`;
        ink.style.opacity = `${state.alpha}`;
      }
      if (dot) {
        const pull = clamp(Math.abs(state.dotVelocity) / 700, 0, 2.2);
        dot.style.transform = `translate3d(${state.dotX}px, 0, 0) scaleX(${1 + pull})`;
        dot.style.opacity = `${state.dotAlpha}`;
      }
    };

    const tick = now => {
      raf = 0;
      const s = settingsRef.current;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      const index = glideIndex();
      const target = rects[index];
      const zeta = 1 - 0.55 * s.bounce;
      const base = 520;
      let busy = false;

      if (target && !state.waiting) {
        const t0 = target.left;
        const t1 = target.left + target.width;
        if (state.alpha < 0.02 && !state.sliding) {
          state.x0 = t0;
          state.x1 = t1;
          state.v0 = 0;
          state.v1 = 0;
          state.pop = 0.9;
        }
        if (reduce) {
          state.x0 = t0;
          state.x1 = t1;
          state.v0 = 0;
          state.v1 = 0;
        } else {
          const direction = Math.sign((t0 + t1) / 2 - (state.x0 + state.x1) / 2);
          const lead = base * (1 + 0.9 * s.stretch);
          const trail = base * (1 - 0.5 * s.stretch);
          const k0 = direction < 0 ? lead : direction > 0 ? trail : base;
          const k1 = direction > 0 ? lead : direction < 0 ? trail : base;
          const steps = Math.ceil(dt / (1 / 240));
          const h = dt / steps;
          for (let i = 0; i < steps; i++) {
            state.v0 += (-k0 * (state.x0 - t0) - 2 * zeta * Math.sqrt(k0) * state.v0) * h;
            state.x0 += state.v0 * h;
            state.v1 += (-k1 * (state.x1 - t1) - 2 * zeta * Math.sqrt(k1) * state.v1) * h;
            state.x1 += state.v1 * h;
          }
        }
        state.alpha += (1 - state.alpha) * (reduce ? 1 : 1 - Math.exp(-dt / 0.06));
        busy =
          Math.abs(state.x0 - t0) > 0.05 ||
          Math.abs(state.x1 - t1) > 0.05 ||
          Math.abs(state.v0) > 0.5 ||
          Math.abs(state.v1) > 0.5 ||
          state.alpha < 0.999;
        if (!busy) state.sliding = false;
      } else {
        state.alpha += (0 - state.alpha) * (reduce ? 1 : 1 - Math.exp(-dt / 0.07));
        if (state.alpha > 0.002) busy = true;
        else state.alpha = 0;
      }

      state.pop += (1 - state.pop) * (reduce ? 1 : 1 - Math.exp(-dt / 0.09));
      if (Math.abs(1 - state.pop) > 0.001) busy = true;

      const pressTarget = state.pressing ? 0.95 : 1;
      if (reduce) {
        state.press = pressTarget;
        state.pressVelocity = 0;
      } else {
        state.pressVelocity += (-700 * (state.press - pressTarget) - 30 * state.pressVelocity) * dt;
        state.press += state.pressVelocity * dt;
      }
      if (Math.abs(state.press - pressTarget) > 0.0005 || Math.abs(state.pressVelocity) > 0.01) busy = true;

      const dotTarget = s.indicator === 'dot' ? rects[s.activeIndex] : null;
      if (dotTarget && !state.waiting) {
        const center = dotTarget.left + dotTarget.width / 2;
        if (state.dotAlpha < 0.02) {
          state.dotX = center;
          state.dotVelocity = 0;
        }
        if (reduce) {
          state.dotX = center;
          state.dotVelocity = 0;
        } else {
          const k = 360;
          const steps = Math.ceil(dt / (1 / 240));
          const h = dt / steps;
          for (let i = 0; i < steps; i++) {
            state.dotVelocity +=
              (-k * (state.dotX - center) - 2 * (1 - 0.5 * s.bounce) * Math.sqrt(k) * state.dotVelocity) * h;
            state.dotX += state.dotVelocity * h;
          }
        }
        state.dotAlpha += (1 - state.dotAlpha) * (reduce ? 1 : 1 - Math.exp(-dt / 0.1));
        if (Math.abs(state.dotX - center) > 0.05 || Math.abs(state.dotVelocity) > 0.5 || state.dotAlpha < 0.999)
          busy = true;
      } else {
        state.dotAlpha += (0 - state.dotAlpha) * (reduce ? 1 : 1 - Math.exp(-dt / 0.1));
        if (state.dotAlpha > 0.002) busy = true;
        else state.dotAlpha = 0;
      }

      render();
      if (busy) raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    };

    const engine = {
      enter: (index, event) => {
        if (event?.pointerType === 'touch') return;
        state.hover = index;
        state.focus = false;
        sync();
        wake();
      },
      leave: () => {
        if (state.focus) return;
        state.hover = -1;
        sync();
        wake();
      },
      focus: (index, event) => {
        const target = event?.target;
        const visible = target instanceof Element && target.matches(':focus-visible');
        state.focus = visible;
        state.hover = visible ? index : state.hover;
        sync();
        wake();
      },
      blur: () => {
        if (!state.focus) return;
        state.focus = false;
        state.hover = -1;
        sync();
        wake();
      },
      press: event => {
        if (event && event.button > 0) return;
        state.pressing = true;
        wake();
      },
      release: () => {
        if (!state.pressing) return;
        state.pressing = false;
        wake();
      },
      refresh: () => {
        measure();
        sync();
        wake();
      }
    };
    engineRef.current = engine;

    measure();
    sync();
    render();
    wake();

    let timer = 0;
    if (state.waiting) {
      state.x0 = 0;
      state.x1 = 0;
      timer = window.setTimeout(() => {
        state.waiting = false;
        if (glideIndex() >= 0) {
          state.alpha = 1;
          state.sliding = true;
        }
        wake();
      }, 420);
    }

    const resizeObserver = new ResizeObserver(() => {
      measure();
      render();
      wake();
    });
    if (trackRef.current) resizeObserver.observe(trackRef.current);
    document.fonts?.ready?.then(() => engine.refresh()).catch(() => {});
    window.addEventListener('pointerup', engine.release);
    window.addEventListener('pointercancel', engine.release);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      resizeObserver.disconnect();
      window.removeEventListener('pointerup', engine.release);
      window.removeEventListener('pointercancel', engine.release);
      engineRef.current = null;
    };
  }, [collapsed, items.length]);

  useEffect(() => {
    engineRef.current?.refresh();
  });

  useLayoutEffect(() => {
    const root = rootRef.current;
    const measureEl = measureRef.current;
    if (!root || !measureEl) return undefined;
    const evaluate = () => {
      if (collapse === 'always' || collapse === 'never') {
        setCollapsed(collapse === 'always');
        return;
      }
      const parent = root.parentElement;
      if (!parent) return;
      const styles = getComputedStyle(parent);
      const available =
        parent.clientWidth - (parseFloat(styles.paddingLeft) || 0) - (parseFloat(styles.paddingRight) || 0);
      const listWidth = measureListRef.current?.offsetWidth ?? 0;
      const height = readVar(root, '--pn-h');
      const pad = readVar(root, '--pn-pad');
      const gap = readVar(root, '--pn-gap');
      const inner = readVar(root, '--pn-inner');
      const need = joined
        ? pad * 2 + (hasLogo ? inner + 2 : 0) + listWidth
        : (hasLogo ? height + gap : 0) + listWidth + pad * 2;
      const next = need > available + 0.5;
      if (introRef.current && next !== collapsed) pendingRef.current = next;
      setCollapsed(next);
    };
    evaluate();
    const observer = new ResizeObserver(evaluate);
    if (root.parentElement) observer.observe(root.parentElement);
    observer.observe(measureEl);
    return () => observer.disconnect();
  }, [collapse, collapsed, joined, hasLogo, size]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !introRef.current) return;
    if (pendingRef.current !== null && pendingRef.current !== collapsed) return;
    pendingRef.current = null;
    introRef.current = false;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const pop = (element, delay) =>
      element?.animate(
        [
          { opacity: 0, transform: 'scale(0.6)' },
          { opacity: 1, transform: 'scale(1)' }
        ],
        { duration: 700, delay, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', fill: 'backwards' }
      );
    const reveal = element => {
      if (!element) return;
      const width = element.offsetWidth;
      const height = element.offsetHeight;
      element.animate(
        [
          { clipPath: `inset(0px ${Math.max(0, width - height)}px 0px 0px round ${height / 2}px)` },
          { clipPath: `inset(0px 0px 0px 0px round ${height / 2}px)` }
        ],
        { duration: 760, delay: 90, easing: EASE_OUT, fill: 'backwards' }
      );
    };
    pop(logoRef.current, 0);
    if (collapsed) {
      pop(toggleRef.current, 120);
      return;
    }
    slideRef.current = true;
    reveal(joined ? root : barRef.current);
    slotRefs.current.forEach((slot, index) => {
      slot?.animate(
        [
          { opacity: 0, transform: 'translateX(-10px)' },
          { opacity: 1, transform: 'translateX(0)' }
        ],
        { duration: 560, delay: 200 + index * 50, easing: EASE_OUT, fill: 'backwards' }
      );
    });
  }, [collapsed, joined]);

  useEffect(() => {
    if (!collapsed && open) setOpen(false);
  }, [collapsed, open]);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const root = rootRef.current;
    if (!panel || !root) return undefined;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const width = panel.offsetWidth;
    const height = panel.offsetHeight;
    const header = joined ? root.offsetHeight : (toggleRef.current?.offsetHeight ?? 44);
    const start = joined
      ? `inset(0px 0px ${Math.max(0, height - header)}px 0px round ${header / 2}px)`
      : `inset(0px 0px ${Math.max(0, height - header)}px ${Math.max(0, width - header)}px round ${header / 2}px)`;
    const end = 'inset(0px 0px 0px 0px round 24px)';
    const rows = panel.querySelectorAll('li');
    const running = [];
    if (open) {
      if (reduce) return undefined;
      running.push(panel.animate([{ clipPath: start }, { clipPath: end }], { duration: 560, easing: EASE_OUT }));
      rows.forEach((row, index) => {
        running.push(
          row.animate(
            [
              { opacity: 0, transform: 'translateY(-8px)' },
              { opacity: 1, transform: 'translateY(0)' }
            ],
            { duration: 420, delay: 90 + index * 40, easing: EASE_OUT, fill: 'backwards' }
          )
        );
      });
    } else {
      if (reduce) {
        setPanelShown(false);
        return undefined;
      }
      const morph = panel.animate([{ clipPath: end }, { clipPath: start }], {
        duration: 380,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards'
      });
      morph.onfinish = () => setPanelShown(false);
      running.push(morph);
      rows.forEach(row => {
        running.push(row.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: 'forwards' }));
      });
    }
    return () => {
      running.forEach(animation => {
        animation.onfinish = null;
        animation.cancel();
      });
    };
  }, [open, panelShown, joined]);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = event => {
      const target = event.target;
      if (target instanceof Node && rootRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKeyDown = event => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const spin = event => {
    const mark = markRef.current;
    if (!mark || event.pointerType === 'touch' || mark.getAnimations().length) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    mark.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], {
      duration: 900,
      easing: 'cubic-bezier(0.65, 0, 0.25, 1)'
    });
  };

  const choose = (item, index, event) => {
    onItemClick?.(item, index, event);
    if (!controlled) setSelected(index);
  };

  const toggle = () => {
    const next = !open;
    if (next) setPanelShown(true);
    setOpen(next);
    onMenuToggle?.(next);
  };

  const link = (item, props, children) => {
    if (!item.href) {
      return (
        <button type="button" {...props}>
          {children}
        </button>
      );
    }
    return (
      <LinkComponent href={item.href} {...props}>
        {children}
      </LinkComponent>
    );
  };

  const face = item => (
    <>
      {item.icon}
      {item.label}
    </>
  );

  return (
    <nav
      ref={rootRef}
      className={[ROOT, joined ? SURFACE : '', className].filter(Boolean).join(' ')}
      data-layout={layout}
      data-items={itemStyle}
      data-collapsed={collapsed ? '' : undefined}
      data-open={open ? '' : undefined}
      data-panel={panelShown ? '' : undefined}
      style={{ ...vars, ...style }}
      aria-label={ariaLabel}
    >
      {logo && (
        <span ref={logoRef} className={[LOGO, joined ? '' : SURFACE].filter(Boolean).join(' ')}>
          <LinkComponent href={logoHref} className={LOGO_LINK} aria-label={logoAlt} onPointerEnter={spin}>
            <span ref={markRef} className={MARK}>
              {typeof logo === 'string' ? <img src={logo} alt="" draggable={false} /> : logo}
            </span>
          </LinkComponent>
          {!joined && <span className={RIM} />}
        </span>
      )}

      {!collapsed && (
        <div ref={barRef} className={[BAR, joined ? '' : SURFACE].filter(Boolean).join(' ')}>
          <div ref={trackRef} className={TRACK} onPointerLeave={() => engineRef.current?.leave()}>
            <ul className={LIST}>
              {items.map((item, index) => (
                <li
                  key={`${item.label}-${index}`}
                  ref={element => {
                    slotRefs.current[index] = element;
                  }}
                  className={SLOT}
                  data-on={fill && indicator === 'pill' && index === activeIndex ? '' : undefined}
                  onPointerEnter={event => engineRef.current?.enter(index, event)}
                  onPointerDown={event => engineRef.current?.press(event)}
                  onFocus={event => engineRef.current?.focus(index, event)}
                  onBlur={() => engineRef.current?.blur()}
                >
                  {link(
                    item,
                    {
                      className: ITEM,
                      'aria-current': index === activeIndex ? 'page' : undefined,
                      'aria-label': item.ariaLabel,
                      onClick: event => choose(item, index, event)
                    },
                    <>
                      {fill && <span className={FILL} aria-hidden="true" />}
                      <span className={FACE}>{face(item)}</span>
                      {fill && (
                        <span className={FACE_ALT} aria-hidden="true">
                          {face(item)}
                        </span>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
            {glide && <span ref={glideRef} className={GLIDE} aria-hidden="true" />}
            {glide && (
              <div ref={inkRef} className={INK} aria-hidden="true">
                {items.map((item, index) => (
                  <span key={`${item.label}-${index}`} className={INK_ITEM}>
                    {face(item)}
                  </span>
                ))}
              </div>
            )}
            {indicator === 'dot' && <span ref={dotRef} className={DOT} aria-hidden="true" />}
          </div>
          {!joined && <span className={RIM} />}
        </div>
      )}

      {collapsed && (
        <button
          ref={toggleRef}
          type="button"
          className={[TOGGLE, joined ? TOGGLE_BARE : SURFACE].join(' ')}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={toggle}
        >
          <span className={BURGER} aria-hidden="true">
            <span className={LINE_TOP} />
            <span className={LINE_BOTTOM} />
          </span>
          {!joined && <span className={RIM} />}
        </button>
      )}

      {collapsed && panelShown && (
        <div ref={panelRef} id={panelId} className={[PANEL, SURFACE].join(' ')}>
          <ul className={MENU}>
            {items.map((item, index) => (
              <li key={`${item.label}-${index}`}>
                {link(
                  item,
                  {
                    className: ROW,
                    'aria-current': index === activeIndex ? 'page' : undefined,
                    tabIndex: open ? undefined : -1,
                    onClick: event => {
                      choose(item, index, event);
                      setOpen(false);
                      onMenuToggle?.(false);
                    }
                  },
                  face(item)
                )}
              </li>
            ))}
          </ul>
          <span className={RIM} />
        </div>
      )}

      <div ref={measureRef} className={MEASURE} aria-hidden="true">
        <div ref={measureListRef} className={LIST}>
          {items.map((item, index) => (
            <span key={`${item.label}-${index}`} className={INK_ITEM}>
              {face(item)}
            </span>
          ))}
        </div>
      </div>

      {joined && <span className={ROOT_RIM} />}
    </nav>
  );
};

export default PillNav;

```

### Component CSS
```css
.pill-nav {
  --pn-roll: calc(var(--pn-inner) / 2 + 0.7em);
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--pn-gap);
  max-width: 100%;
  font-size: var(--pn-font);
  line-height: 1;
  -webkit-tap-highlight-color: transparent;
}

.pill-nav[data-collapsed] {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.pill-nav[data-layout='joined'] {
  gap: 2px;
  padding: var(--pn-pad);
  border-radius: 999px;
}

.pill-nav__surface {
  background: var(--pn-surface);
  box-shadow: var(--pn-shadow);
  -webkit-backdrop-filter: var(--pn-blur);
  backdrop-filter: var(--pn-blur);
}

.pill-nav[data-layout='joined'][data-panel] {
  background: transparent;
  box-shadow: none;
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
}

.pill-nav[data-panel] .pill-nav__rim--root {
  opacity: 0;
}

.pill-nav__rim {
  position: absolute;
  inset: 0;
  z-index: 4;
  border-radius: inherit;
  box-shadow:
    inset 0 0 0 1px var(--pn-edge),
    inset 0 1px 0 var(--pn-rim);
  pointer-events: none;
}

.pill-nav__logo {
  position: relative;
  z-index: 2;
  display: inline-grid;
  flex: none;
  place-items: center;
  width: var(--pn-h);
  height: var(--pn-h);
  border-radius: 999px;
}

.pill-nav__logo-link {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  border-radius: inherit;
  color: var(--pn-strong);
  text-decoration: none;
  outline: none;
}

.pill-nav[data-layout='joined'] .pill-nav__logo {
  width: var(--pn-inner);
  height: var(--pn-inner);
}

.pill-nav__logo-link:focus-visible,
.pill-nav__toggle:focus-visible {
  outline: 2px solid var(--pn-ring);
  outline-offset: 2px;
}

.pill-nav__mark {
  display: grid;
  place-items: center;
  width: var(--pn-mark);
  height: var(--pn-mark);
}

.pill-nav__mark img,
.pill-nav__mark svg {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.pill-nav__bar {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  min-width: 0;
  height: var(--pn-h);
  padding: var(--pn-pad);
  border-radius: 999px;
  box-sizing: border-box;
}

.pill-nav[data-layout='joined'] .pill-nav__bar {
  height: var(--pn-inner);
  padding: 0;
}

.pill-nav__track {
  position: relative;
  height: 100%;
}

.pill-nav__list {
  display: flex;
  align-items: stretch;
  gap: var(--pn-item-gap, 2px);
  height: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
}

.pill-nav__slot {
  display: flex;
}

.pill-nav__item {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 var(--pn-x);
  border: 0;
  border-radius: 999px;
  background: none;
  color: var(--pn-text);
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  font-weight: 500;
  letter-spacing: -0.005em;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  outline: none;
  overflow: hidden;
  isolation: isolate;
  transition: color 0.25s ease;
}

.pill-nav__slot[data-lit] .pill-nav__item,
.pill-nav__item[aria-current] {
  color: var(--pn-strong);
}

.pill-nav[data-items='pill'] {
  --pn-item-gap: 3px;
}

.pill-nav[data-items='pill'] .pill-nav__item {
  background: var(--pn-tile);
  box-shadow: var(--pn-tile-rim);
  color: var(--pn-strong);
}

.pill-nav__item:focus-visible,
.pill-nav__row:focus-visible {
  outline: 2px solid var(--pn-ring);
  outline-offset: -2px;
}

.pill-nav__face {
  display: inline-flex;
  align-items: center;
  gap: 0.45em;
  transition: transform 0.36s cubic-bezier(0.22, 1, 0.36, 1);
}

.pill-nav__face svg {
  width: 1.15em;
  height: 1.15em;
  flex: none;
}

.pill-nav__face-alt {
  position: absolute;
  inset: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45em;
  color: var(--pn-pill-ink);
  transform: translateY(var(--pn-roll));
  transition: transform 0.36s cubic-bezier(0.22, 1, 0.36, 1);
}

.pill-nav__face-alt svg {
  width: 1.15em;
  height: 1.15em;
  flex: none;
}

.pill-nav__slot[data-on] .pill-nav__face,
.pill-nav__slot[data-hover] .pill-nav__face {
  transform: translateY(calc(var(--pn-roll) * -1));
  transition-duration: 0.5s;
}

.pill-nav__slot[data-on] .pill-nav__face-alt,
.pill-nav__slot[data-hover] .pill-nav__face-alt {
  transform: translateY(0);
  transition-duration: 0.5s;
}

.pill-nav__fill {
  position: absolute;
  top: 100%;
  left: 50%;
  z-index: -1;
  width: var(--pn-fill, 200%);
  height: var(--pn-fill, 200%);
  margin: calc(var(--pn-fill, 200%) / -2) 0 0 calc(var(--pn-fill, 200%) / -2);
  border-radius: 50%;
  background: var(--pn-pill);
  transform: scale(0);
  transition: transform 0.36s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.pill-nav__slot[data-on] .pill-nav__fill,
.pill-nav__slot[data-hover] .pill-nav__fill {
  transform: scale(1);
  transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}

.pill-nav__glide {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 0;
  border-radius: 999px;
  background: var(--pn-pill);
  box-shadow: var(--pn-pill-shadow);
  opacity: 0;
  pointer-events: none;
  transform-origin: 50% 50%;
  will-change: transform, width, opacity;
}

.pill-nav[data-focus] .pill-nav__glide {
  box-shadow:
    var(--pn-pill-shadow),
    0 0 0 2px var(--pn-ring);
}

.pill-nav__ink {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: stretch;
  gap: var(--pn-item-gap, 2px);
  color: var(--pn-pill-ink);
  pointer-events: none;
  clip-path: inset(0 100% 0 0);
}

.pill-nav__ink-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45em;
  height: 100%;
  padding: 0 var(--pn-x);
  font-weight: 500;
  letter-spacing: -0.005em;
  white-space: nowrap;
}

.pill-nav__ink-item svg {
  width: 1.15em;
  height: 1.15em;
  flex: none;
}

.pill-nav__dot {
  position: absolute;
  bottom: calc((var(--pn-inner) - var(--pn-font)) / 4 - 2px);
  left: 0;
  width: 4px;
  height: 4px;
  margin-left: -2px;
  border-radius: 999px;
  background: var(--pn-dot);
  opacity: 0;
  pointer-events: none;
  transition: background-color 0.3s ease;
  will-change: transform, opacity;
}

.pill-nav[data-dot-lit] .pill-nav__dot {
  background: var(--pn-pill-ink);
}

.pill-nav__toggle {
  position: relative;
  z-index: 3;
  display: inline-grid;
  flex: none;
  place-items: center;
  width: var(--pn-h);
  height: var(--pn-h);
  padding: 0;
  border: 0;
  border-radius: 999px;
  color: var(--pn-strong);
  cursor: pointer;
  outline: none;
}

.pill-nav__toggle--bare {
  background: transparent;
}

.pill-nav[data-layout='joined'] .pill-nav__toggle {
  width: var(--pn-inner);
  height: var(--pn-inner);
}

.pill-nav__burger {
  position: relative;
  width: 16px;
  height: 10px;
}

.pill-nav__line {
  position: absolute;
  left: 0;
  width: 100%;
  height: 1.5px;
  border-radius: 2px;
  background: currentColor;
  transition:
    transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    top 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.pill-nav__line--top {
  top: 1.5px;
}

.pill-nav__line--bottom {
  top: 7px;
}

.pill-nav[data-open] .pill-nav__line--top {
  top: 4.25px;
  transform: rotate(45deg);
}

.pill-nav[data-open] .pill-nav__line--bottom {
  top: 4.25px;
  transform: rotate(-45deg);
}

.pill-nav__panel {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1;
  padding: calc(var(--pn-h) + 10px) 6px 6px;
  border-radius: 24px;
  box-sizing: border-box;
}

.pill-nav[data-layout='joined'] .pill-nav__panel {
  padding-top: calc(var(--pn-h) + 4px);
}

.pill-nav__menu {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.pill-nav__row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: calc(var(--pn-h) + 2px);
  padding: 0 16px;
  border: 0;
  border-radius: 18px;
  box-sizing: border-box;
  background: none;
  color: var(--pn-strong);
  font-family: inherit;
  font-size: calc(var(--pn-font) + 1px);
  line-height: 1;
  font-weight: 500;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  outline: none;
  transition: background-color 0.2s ease;
}

.pill-nav__row svg {
  width: 1.15em;
  height: 1.15em;
  flex: none;
}

.pill-nav__row:hover {
  background: var(--pn-row-hover);
}

.pill-nav__row[aria-current] {
  background: var(--pn-pill);
  box-shadow: var(--pn-pill-shadow);
  color: var(--pn-pill-ink);
}

.pill-nav__measure {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  gap: 2px;
  visibility: hidden;
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .pill-nav__face,
  .pill-nav__face-alt,
  .pill-nav__fill,
  .pill-nav__line,
  .pill-nav__item,
  .pill-nav__row {
    transition: none;
  }
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.


## Integrate the <GlassSurface /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: GlassSurface
### Variant: JavaScript + CSS


---

### Usage Example
```jsx
import GlassSurface from './GlassSurface';

<GlassSurface
  width={320}
  height={76}
  borderRadius={38}
  distortionScale={-180}
  displace={0.5}
  backgroundOpacity={0.1}
>
  <span>Your content</span>
</GlassSurface>

<GlassSurface shape="/logo.svg" width={280} height={280} />

const photo = useRef(null);

<img ref={photo} src="/photo.jpg" alt="" />
<GlassSurface backdrop={photo} width={320} height={76} borderRadius={38} />
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | Content shown on the glass. |
| width | number | string | 200 | Width in px, or any CSS value like '100%'. |
| height | number | string | 80 | Height in px, or any CSS value like '100vh'. |
| borderRadius | number | 20 | Corner radius in px. Not used with a shape. |
| shape | string | - | URL of an SVG or transparent PNG that gives the glass its outline, fitted inside the width and height. Files from another origin need CORS headers. |
| refraction | boolean | true | Bends what is behind the glass at its edges. Set it to false to use the frosted glass look everywhere. |
| renderer | 'auto' | 'svg' | 'webgl' | 'auto' | How the glass bends light. Auto uses SVG filters in Chromium, which bend anything behind the glass, and WebGL in Safari and Firefox when a backdrop is given. Without a backdrop, those browsers get a frosted glass look. WebGL forces the WebGL glass whenever a backdrop is given. |
| backdrop | RefObject<HTMLImageElement | HTMLVideoElement | HTMLCanvasElement> | - | The image, video or canvas behind the glass. WebGL can only bend what it is given, so pass this to get real refraction outside Chromium. Images from another origin need CORS headers. |
| distortionScale | number | -180 | How strongly the edge bends what is behind it. Negative values pull the view inward. |
| borderWidth | number | 0.07 | Width of the bending edge, as a fraction of the shorter side. |
| blur | number | 11 | Softness of the transition from the bending edge to the calm center, in px. |
| brightness | number | 50 | Brightness of the calm center, in %. 50 leaves it undistorted. |
| opacity | number | 0.93 | How strongly the calm center holds the view still, from 0 to 1. |
| displace | number | 0 | Blurs the light coming through the glass, for a frosted look. |
| redOffset | number | 0 | Extra bending for the red channel. Different offsets split light into colored fringes. |
| greenOffset | number | 10 | Extra bending for the green channel. |
| blueOffset | number | 20 | Extra bending for the blue channel. |
| backgroundOpacity | number | 0 | Opacity of a soft frosted tint over the glass, from 0 to 1. |
| saturation | number | 1 | Saturation of what is seen through the glass. |
| xChannel | 'R' | 'G' | 'B' | 'R' | Channel of the displacement map that moves pixels sideways. |
| yChannel | 'R' | 'G' | 'B' | 'G' | Channel of the displacement map that moves pixels up and down. |
| mixBlendMode | BlendMode | 'difference' | How the two edge gradients of the displacement map are combined. |
| className | string | '' | Extra class names for the glass. |
| style | CSSProperties | {} | Inline styles for the glass. |

### Full Component Source
```jsx
'use client';

/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef, useId } from 'react';
import './GlassSurface.css';

const FAR = 1e20;

const GLASS_VERTEX = `#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const GLASS_FRAGMENT = `#version 300 es
precision highp float;
uniform sampler2D uBackdrop;
uniform sampler2D uMap;
uniform vec2 uCanvas;
uniform vec2 uSize;
uniform vec2 uOrigin;
uniform vec2 uStep;
uniform vec3 uScale;
uniform ivec2 uChannel;
uniform float uSpread;
uniform float uLod;
uniform float uSaturation;
out vec4 outColor;

vec4 bend(vec2 p) {
  vec4 map = texture(uMap, clamp(p / uSize, 0.0, 1.0));
  vec2 shift = vec2(map[uChannel.x], map[uChannel.y]) - 0.5;
  vec2 base = uOrigin + p * uStep;
  vec4 red = textureLod(uBackdrop, base + shift * uScale.r * uStep, uLod);
  vec4 green = textureLod(uBackdrop, base + shift * uScale.g * uStep, uLod);
  vec4 blue = textureLod(uBackdrop, base + shift * uScale.b * uStep, uLod);
  return vec4(red.r, green.g, blue.b, (red.a + green.a + blue.a) / 3.0);
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uCanvas.y - gl_FragCoord.y) / uCanvas * uSize;
  vec4 color = vec4(0.0);
  if (uSpread < 0.05) {
    color = bend(p);
  } else {
    float total = 0.0;
    for (int j = -2; j <= 2; j++) {
      for (int i = -2; i <= 2; i++) {
        vec2 offset = vec2(float(i), float(j)) * uSpread * 0.8;
        float weight = exp(-dot(offset, offset) / (2.0 * uSpread * uSpread));
        color += bend(p + offset) * weight;
        total += weight;
      }
    }
    color /= total;
  }
  vec3 rgb = color.a > 0.0 ? color.rgb / color.a : vec3(0.0);
  float s = uSaturation;
  mat3 tone = mat3(
    0.213 + 0.787 * s, 0.213 - 0.213 * s, 0.213 - 0.213 * s,
    0.715 - 0.715 * s, 0.715 + 0.285 * s, 0.715 - 0.715 * s,
    0.072 - 0.072 * s, 0.072 - 0.072 * s, 0.072 + 0.928 * s
  );
  rgb = clamp(tone * rgb, 0.0, 1.0);
  outColor = vec4(rgb * color.a, color.a);
}`;

const CHANNELS = { R: 0, G: 1, B: 2, A: 3 };

const compileGlass = gl => {
  const make = (type, source) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
    gl.deleteShader(shader);
    return null;
  };
  const vertex = make(gl.VERTEX_SHADER, GLASS_VERTEX);
  const fragment = make(gl.FRAGMENT_SHADER, GLASS_FRAGMENT);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.bindAttribLocation(program, 0, 'aPosition');
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
  gl.deleteProgram(program);
  return null;
};

const resolveBackdrop = backdrop => {
  if (typeof window === 'undefined' || !backdrop) return null;
  const node = typeof backdrop === 'object' && 'current' in backdrop ? backdrop.current : backdrop;
  if (node instanceof HTMLImageElement || node instanceof HTMLVideoElement || node instanceof HTMLCanvasElement) {
    return node;
  }
  return null;
};

const sourceSize = node => {
  if (node instanceof HTMLImageElement) return [node.naturalWidth, node.naturalHeight];
  if (node instanceof HTMLVideoElement) return [node.videoWidth, node.videoHeight];
  return [node.width, node.height];
};

const placeAxis = (value, free) => {
  if (!value) return free / 2;
  if (value.endsWith('%')) return (parseFloat(value) / 100) * free;
  const px = parseFloat(value);
  return Number.isFinite(px) ? px : free / 2;
};

const contentBox = node => {
  const rect = node.getBoundingClientRect();
  const [naturalWidth, naturalHeight] = sourceSize(node);
  const style = getComputedStyle(node);
  const fit = style.objectFit || 'fill';
  if (!naturalWidth || !naturalHeight || fit === 'fill') {
    return { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
  }
  const contain = Math.min(rect.width / naturalWidth, rect.height / naturalHeight);
  const cover = Math.max(rect.width / naturalWidth, rect.height / naturalHeight);
  const scale = fit === 'cover' ? cover : fit === 'contain' ? contain : fit === 'none' ? 1 : Math.min(1, contain);
  const width = naturalWidth * scale;
  const height = naturalHeight * scale;
  const [px, py] = (style.objectPosition || '50% 50%').split(' ');
  return {
    x: rect.left + placeAxis(px, rect.width - width),
    y: rect.top + placeAxis(py ?? px, rect.height - height),
    width,
    height
  };
};

const distanceLine = (f, d, v, z, n) => {
  let k = 0;
  v[0] = 0;
  z[0] = -FAR;
  z[1] = FAR;
  for (let q = 1; q < n; q++) {
    let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    while (s <= z[k]) {
      k--;
      s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    }
    k++;
    v[k] = q;
    z[k] = s;
    z[k + 1] = FAR;
  }
  k = 0;
  for (let q = 0; q < n; q++) {
    while (z[k + 1] < q) k++;
    d[q] = (q - v[k]) * (q - v[k]) + f[v[k]];
  }
};

const distanceGrid = (grid, w, h) => {
  const n = Math.max(w, h);
  const f = new Float64Array(n);
  const d = new Float64Array(n);
  const v = new Int32Array(n);
  const z = new Float64Array(n + 1);
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) f[y] = grid[y * w + x];
    distanceLine(f, d, v, z, h);
    for (let y = 0; y < h; y++) grid[y * w + x] = d[y];
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) f[x] = grid[y * w + x];
    distanceLine(f, d, v, z, w);
    for (let x = 0; x < w; x++) grid[y * w + x] = d[x];
  }
};

const blurLine = (src, dst, offset, stride, n, r) => {
  const scale = 1 / (2 * r + 1);
  let sum = src[offset] * (r + 1);
  for (let i = 1; i <= r; i++) sum += src[offset + Math.min(i, n - 1) * stride];
  for (let i = 0; i < n; i++) {
    dst[offset + i * stride] = sum * scale;
    sum += src[offset + Math.min(i + r + 1, n - 1) * stride] - src[offset + Math.max(i - r, 0) * stride];
  }
};

const blurGrid = (grid, w, h, r) => {
  const tmp = new Float32Array(w * h);
  for (let pass = 0; pass < 3; pass++) {
    for (let y = 0; y < h; y++) blurLine(grid, tmp, y * w, 1, w, r);
    for (let x = 0; x < w; x++) blurLine(tmp, grid, x, w, h, r);
  }
};

const settle = x => 1 / (1 + Math.exp(-1.702 * x));

const paint = (w, h, fill) => {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const context = canvas.getContext('2d');
  const image = context.createImageData(w, h);
  fill(image.data);
  context.putImageData(image, 0, 0);
  return canvas.toDataURL();
};

const shade = (depth, w, h, falloff) =>
  paint(w, h, data => {
    data.fill(255);
    for (let i = 0; i < w * h; i++) data[i * 4 + 3] = 255 * (1 - falloff(depth[i]));
  });

const traceShape = (image, width, height, ratio) => {
  const naturalWidth = image.naturalWidth || width;
  const naturalHeight = image.naturalHeight || height;
  const fit = Math.min(width / naturalWidth, height / naturalHeight);
  const box = {
    x: (width - naturalWidth * fit) / 2,
    y: (height - naturalHeight * fit) / 2,
    width: naturalWidth * fit,
    height: naturalHeight * fit
  };
  const w = Math.max(2, Math.round(width * ratio));
  const h = Math.max(2, Math.round(height * ratio));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  context.drawImage(image, box.x * ratio, box.y * ratio, box.width * ratio, box.height * ratio);
  const pixels = context.getImageData(0, 0, w, h).data;
  const outside = new Float32Array(w * h);
  const inside = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const edge = 0.5 - pixels[i * 4 + 3] / 255;
    outside[i] = edge >= 0.5 ? FAR : Math.max(edge, 0) ** 2;
    inside[i] = edge <= -0.5 ? FAR : Math.min(edge, 0) ** 2;
  }
  distanceGrid(outside, w, h);
  distanceGrid(inside, w, h);
  const depth = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) depth[i] = (Math.sqrt(inside[i]) - Math.sqrt(outside[i])) / ratio;
  return {
    box,
    depth,
    w,
    h,
    ratio,
    line: shade(depth, w, h, t => settle(t - 1)),
    glow: shade(depth, w, h, t => settle((t - 4) / 5))
  };
};

const bendShape = (trace, edge, softness, calm, level) => {
  const { depth, w, h, ratio } = trace;
  const reach = edge + softness * 2;
  const field = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) field[i] = Math.min(Math.max(depth[i], -6), reach);
  blurGrid(field, w, h, Math.max(1, Math.round(Math.max(1.5, softness * 0.35) * ratio)));
  return paint(w, h, data => {
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        const dx = field[i + (x < w - 1 ? 1 : 0)] - field[i - (x > 0 ? 1 : 0)];
        const dy = field[i + (y < h - 1 ? w : 0)] - field[i - (y > 0 ? w : 0)];
        const still = calm * settle((depth[i] - edge) / softness);
        const bend = (1 - still) * ratio * 0.25;
        const shift = still * (level - 0.5);
        data[i * 4] = 255 * (0.5 + dx * bend + shift);
        data[i * 4 + 1] = 255 * (0.5 + dy * bend + shift);
        data[i * 4 + 2] = 255 * (0.5 + shift);
        data[i * 4 + 3] = 255;
      }
    }
  });
};

const GlassSurface = ({
  children,
  width = 200,
  height = 80,
  borderRadius = 20,
  borderWidth = 0.07,
  brightness = 50,
  opacity = 0.93,
  blur = 11,
  displace = 0,
  backgroundOpacity = 0,
  saturation = 1,
  distortionScale = -180,
  redOffset = 0,
  greenOffset = 10,
  blueOffset = 20,
  xChannel = 'R',
  yChannel = 'G',
  mixBlendMode = 'difference',
  refraction = true,
  renderer = 'auto',
  backdrop,
  shape,
  className = '',
  style = {}
}) => {
  const uniqueId = useId().replace(/:/g, '-');
  const filterId = `glass-filter-${uniqueId}`;
  const redGradId = `red-grad-${uniqueId}`;
  const blueGradId = `blue-grad-${uniqueId}`;
  const softId = `soft-${uniqueId}`;

  const [svgSupported, setSvgSupported] = useState(false);
  const [checked, setChecked] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);
  const [boxSize, setBoxSize] = useState('');
  const [loaded, setLoaded] = useState({ src: '', image: null });
  const [art, setArt] = useState(null);

  const containerRef = useRef(null);
  const feImageRef = useRef(null);
  const redChannelRef = useRef(null);
  const greenChannelRef = useRef(null);
  const blueChannelRef = useRef(null);
  const gaussianBlurRef = useRef(null);
  const traceRef = useRef(null);
  const shapeMapRef = useRef('');
  const mapUrlRef = useRef('');
  const canvasRef = useRef(null);
  const settingsRef = useRef(null);
  settingsRef.current = {
    backdrop,
    displace,
    saturation,
    distortionScale,
    redOffset,
    greenOffset,
    blueOffset,
    xChannel,
    yChannel
  };

  const generateDisplacementMap = () => {
    const rect = containerRef.current?.getBoundingClientRect();
    const actualWidth = rect?.width || 400;
    const actualHeight = rect?.height || 200;
    const edgeSize = Math.min(actualWidth, actualHeight) * (borderWidth * 0.5);

    const svgContent = `
      <svg width="${actualWidth}" height="${actualHeight}" viewBox="0 0 ${actualWidth} ${actualHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="red"/>
          </linearGradient>
          <linearGradient id="${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="blue"/>
          </linearGradient>
          <filter id="${softId}" filterUnits="userSpaceOnUse" x="0" y="0" width="${actualWidth}" height="${actualHeight}" color-interpolation-filters="sRGB">
            <feGaussianBlur stdDeviation="${blur}" />
          </filter>
        </defs>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" fill="black"></rect>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${borderRadius}" fill="url(#${redGradId})" />
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${borderRadius}" fill="url(#${blueGradId})" style="mix-blend-mode: ${mixBlendMode}" />
        <rect x="${edgeSize}" y="${edgeSize}" width="${actualWidth - edgeSize * 2}" height="${actualHeight - edgeSize * 2}" rx="${borderRadius}" fill="hsl(0 0% ${brightness}% / ${opacity})" filter="url(#${softId})" />
      </svg>
    `;

    return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
  };

  const updateDisplacementMap = () => {
    mapUrlRef.current = shapeMapRef.current || generateDisplacementMap();
    feImageRef.current?.setAttribute('href', mapUrlRef.current);
  };

  useEffect(() => {
    updateDisplacementMap();
    [
      { ref: redChannelRef, offset: redOffset },
      { ref: greenChannelRef, offset: greenOffset },
      { ref: blueChannelRef, offset: blueOffset }
    ].forEach(({ ref, offset }) => {
      if (ref.current) {
        ref.current.setAttribute('scale', (distortionScale + offset).toString());
        ref.current.setAttribute('xChannelSelector', xChannel);
        ref.current.setAttribute('yChannelSelector', yChannel);
      }
    });

    gaussianBlurRef.current?.setAttribute('stdDeviation', displace.toString());
  }, [
    boxSize,
    width,
    height,
    borderRadius,
    borderWidth,
    brightness,
    opacity,
    blur,
    displace,
    distortionScale,
    redOffset,
    greenOffset,
    blueOffset,
    xChannel,
    yChannel,
    mixBlendMode
  ]);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      const element = containerRef.current;
      if (element) setBoxSize(`${element.offsetWidth}x${element.offsetHeight}`);
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!shape) return undefined;
    let alive = true;
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.decoding = 'async';
    image.onload = () => alive && setLoaded({ src: shape, image });
    image.onerror = () => alive && setLoaded({ src: shape, image: null });
    image.src = shape;
    return () => {
      alive = false;
    };
  }, [shape]);

  const shapeImage = shape && loaded.src === shape ? loaded.image : null;

  useEffect(() => {
    const element = containerRef.current;
    const w = element?.offsetWidth || 0;
    const h = element?.offsetHeight || 0;
    let map = '';
    let trace = null;
    if (shapeImage && w && h) {
      const ratio = Math.min(2, window.devicePixelRatio || 1, Math.sqrt(400000 / (w * h)));
      trace = traceRef.current;
      try {
        if (!trace || trace.image !== shapeImage || trace.width !== w || trace.height !== h || trace.ratio !== ratio) {
          trace = { image: shapeImage, width: w, height: h, ...traceShape(shapeImage, w, h, ratio) };
          traceRef.current = trace;
        }
        map = bendShape(trace, Math.min(w, h) * borderWidth * 0.5, Math.max(blur, 0.5), opacity, brightness / 100);
      } catch {
        trace = null;
        traceRef.current = null;
      }
    }
    shapeMapRef.current = map;
    updateDisplacementMap();
    if (shape && trace) setArt({ src: shape, box: trace.box, line: trace.line, glow: trace.glow });
    else if (shape && loaded.src === shape) setArt({ src: shape, failed: true });
  }, [shape, loaded, boxSize, borderWidth, blur, opacity, brightness]);

  useEffect(() => {
    setSvgSupported(supportsSVGFilters());
    setChecked(true);
  }, []);

  const webgl =
    checked &&
    refraction &&
    Boolean(backdrop) &&
    !webglFailed &&
    (renderer === 'webgl' || (renderer === 'auto' && !svgSupported));
  const refractive = !webgl && svgSupported && refraction;
  const frosted = !webgl && !refractive;

  useEffect(() => {
    if (!webgl) return undefined;
    const canvas = canvasRef.current;
    const element = containerRef.current;
    const gl = canvas?.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false
    });
    const program = gl ? compileGlass(gl) : null;
    if (!canvas || !element || !gl || !program) {
      setWebglFailed(true);
      return undefined;
    }

    const uniforms = {};
    [
      'uBackdrop',
      'uMap',
      'uCanvas',
      'uSize',
      'uOrigin',
      'uStep',
      'uScale',
      'uChannel',
      'uSpread',
      'uLod',
      'uSaturation'
    ].forEach(name => {
      uniforms[name] = gl.getUniformLocation(program, name);
    });
    const vao = gl.createVertexArray();
    const buffer = gl.createBuffer();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

    const makeTexture = () => {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      return texture;
    };
    const backdropTexture = makeTexture();
    const mapTexture = makeTexture();
    const mapCanvas = document.createElement('canvas');
    const mapContext = mapCanvas.getContext('2d');
    const picture = { node: null, key: '', width: 0, height: 0, mipmapped: false, ready: false };
    const map = { url: '', ready: false };
    let frame = 0;
    let visible = true;
    let drawn = '';

    const loadMap = url => {
      map.url = url;
      const image = new Image();
      image.onload = () => {
        if (map.url !== url || !mapContext) return;
        const ratio = Math.min(2, window.devicePixelRatio || 1);
        mapCanvas.width = Math.max(1, Math.round(element.offsetWidth * ratio));
        mapCanvas.height = Math.max(1, Math.round(element.offsetHeight * ratio));
        mapContext.clearRect(0, 0, mapCanvas.width, mapCanvas.height);
        mapContext.drawImage(image, 0, 0, mapCanvas.width, mapCanvas.height);
        gl.bindTexture(gl.TEXTURE_2D, mapTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mapCanvas);
        map.ready = true;
        drawn = '';
      };
      image.src = url;
    };

    const upload = node => {
      const still = node instanceof HTMLImageElement;
      gl.bindTexture(gl.TEXTURE_2D, backdropTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, node);
      if (still) gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, still ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
      [picture.width, picture.height] = sourceSize(node);
      picture.mipmapped = still;
      picture.ready = true;
    };

    const tick = () => {
      frame = 0;
      if (!visible || document.hidden) return;
      frame = requestAnimationFrame(tick);
      const s = settingsRef.current;
      if (!s) return;
      if (mapUrlRef.current && mapUrlRef.current !== map.url) loadMap(mapUrlRef.current);
      const node = resolveBackdrop(s.backdrop);
      if (!node) return;
      let key = '';
      if (node instanceof HTMLImageElement) key = node.complete && node.naturalWidth ? node.currentSrc || node.src : '';
      else if (node instanceof HTMLVideoElement)
        key = node.readyState >= 2 ? `${node.currentSrc}|${node.currentTime}` : '';
      else key = `${node.width}x${node.height}|${performance.now()}`;
      if (key && (node !== picture.node || key !== picture.key)) {
        try {
          upload(node);
        } catch {
          setWebglFailed(true);
          return;
        }
        picture.node = node;
        picture.key = key;
        drawn = '';
      }
      if (!picture.ready || !map.ready) return;

      const layoutWidth = element.offsetWidth;
      const layoutHeight = element.offsetHeight;
      if (!layoutWidth || !layoutHeight) return;
      const box = element.getBoundingClientRect();
      const content = contentBox(node);
      if (!content.width || !content.height) return;
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      const width = Math.max(1, Math.round(layoutWidth * ratio));
      const height = Math.max(1, Math.round(layoutHeight * ratio));
      const signature = [
        box.left,
        box.top,
        box.width,
        box.height,
        content.x,
        content.y,
        content.width,
        content.height,
        width,
        height,
        picture.key,
        map.url,
        s.displace,
        s.saturation,
        s.distortionScale,
        s.redOffset,
        s.greenOffset,
        s.blueOffset,
        s.xChannel,
        s.yChannel
      ].join('|');
      if (signature === drawn) return;
      drawn = signature;

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      const scaleX = box.width / layoutWidth;
      const scaleY = box.height / layoutHeight;
      const texelsPerPixel = (picture.width / content.width) * (scaleX / ratio);
      const spreadTexels = (picture.width / content.width) * scaleX * Math.max(0, s.displace);
      const lod = picture.mipmapped
        ? Math.max(0, Math.log2(Math.max(texelsPerPixel, spreadTexels * 0.5, 0.000001)))
        : 0;
      gl.viewport(0, 0, width, height);
      gl.useProgram(program);
      gl.bindVertexArray(vao);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, backdropTexture);
      gl.uniform1i(uniforms.uBackdrop, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, mapTexture);
      gl.uniform1i(uniforms.uMap, 1);
      gl.uniform2f(uniforms.uCanvas, width, height);
      gl.uniform2f(uniforms.uSize, layoutWidth, layoutHeight);
      gl.uniform2f(uniforms.uOrigin, (box.left - content.x) / content.width, (box.top - content.y) / content.height);
      gl.uniform2f(uniforms.uStep, scaleX / content.width, scaleY / content.height);
      gl.uniform3f(
        uniforms.uScale,
        s.distortionScale + s.redOffset,
        s.distortionScale + s.greenOffset,
        s.distortionScale + s.blueOffset
      );
      gl.uniform2i(uniforms.uChannel, CHANNELS[s.xChannel] ?? 0, CHANNELS[s.yChannel] ?? 1);
      gl.uniform1f(uniforms.uSpread, Math.max(0, s.displace));
      gl.uniform1f(uniforms.uLod, lod);
      gl.uniform1f(uniforms.uSaturation, s.saturation);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const wake = () => {
      if (!frame && visible && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const onLost = event => {
      event.preventDefault();
      setWebglFailed(true);
    };
    const intersection = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      wake();
    });
    intersection.observe(element);
    document.addEventListener('visibilitychange', wake);
    canvas.addEventListener('webglcontextlost', onLost);
    wake();

    return () => {
      cancelAnimationFrame(frame);
      intersection.disconnect();
      document.removeEventListener('visibilitychange', wake);
      canvas.removeEventListener('webglcontextlost', onLost);
      gl.deleteTexture(backdropTexture);
      gl.deleteTexture(mapTexture);
      gl.deleteBuffer(buffer);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
    };
  }, [webgl]);

  const supportsSVGFilters = () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return false;
    }

    const isWebkit = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    const isFirefox = /Firefox/.test(navigator.userAgent);

    if (isWebkit || isFirefox) {
      return false;
    }

    const div = document.createElement('div');
    div.style.backdropFilter = `url(#${filterId})`;

    return div.style.backdropFilter !== '';
  };

  const outline = shape && art?.src === shape && !art.failed ? art : null;
  const maskUrl = outline ? `url("${outline.src.replace(/"/g, '%22').replace(/[\n\r]+/g, ' ')}")` : '';
  const maskPlace = outline
    ? `${outline.box.x}px ${outline.box.y}px / ${outline.box.width}px ${outline.box.height}px no-repeat`
    : '';
  const shapeStyle = outline
    ? { borderRadius: 0, boxShadow: 'none', WebkitMask: `${maskUrl} ${maskPlace}`, mask: `${maskUrl} ${maskPlace}` }
    : shape && art?.src !== shape
      ? { opacity: 0, transition: 'none' }
      : {};

  const containerStyle = {
    ...style,
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    borderRadius: `${borderRadius}px`,
    '--glass-frost': backgroundOpacity,
    '--glass-saturation': saturation,
    '--filter-id': `url(#${filterId})`,
    ...shapeStyle
  };

  return (
    <div
      ref={containerRef}
      className={`glass-surface ${webgl ? 'glass-surface--webgl' : refractive ? 'glass-surface--svg' : 'glass-surface--fallback'} ${className}`}
      style={containerStyle}
    >
      <svg className="glass-surface__filter" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB" x="0%" y="0%" width="100%" height="100%">
            <feImage ref={feImageRef} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />

            <feDisplacementMap ref={redChannelRef} in="SourceGraphic" in2="map" id="redchannel" result="dispRed" />
            <feColorMatrix
              in="dispRed"
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="red"
            />

            <feDisplacementMap
              ref={greenChannelRef}
              in="SourceGraphic"
              in2="map"
              id="greenchannel"
              result="dispGreen"
            />
            <feColorMatrix
              in="dispGreen"
              type="matrix"
              values="0 0 0 0 0
                      0 1 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="green"
            />

            <feDisplacementMap ref={blueChannelRef} in="SourceGraphic" in2="map" id="bluechannel" result="dispBlue" />
            <feColorMatrix
              in="dispBlue"
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
              result="blue"
            />

            <feBlend in="red" in2="green" mode="screen" result="rg" />
            <feBlend in="rg" in2="blue" mode="screen" result="output" />
            <feGaussianBlur ref={gaussianBlurRef} in="output" stdDeviation="0.7" />
          </filter>
        </defs>
      </svg>

      {webgl && <canvas ref={canvasRef} className="glass-surface__canvas" aria-hidden="true" />}
      {webgl && (
        <span className="glass-surface__frame" aria-hidden="true" style={outline ? { boxShadow: 'none' } : undefined} />
      )}
      {frosted && <span className="glass-surface__sheen" aria-hidden="true" />}
      {frosted && !outline && <span className="glass-surface__rim" aria-hidden="true" />}
      {outline && (
        <span
          className="glass-surface__glow"
          aria-hidden="true"
          style={{ WebkitMaskImage: `url(${outline.glow})`, maskImage: `url(${outline.glow})` }}
        />
      )}
      {outline && (
        <span
          className="glass-surface__line"
          aria-hidden="true"
          style={{ WebkitMaskImage: `url(${outline.line})`, maskImage: `url(${outline.line})` }}
        />
      )}

      <div className="glass-surface__content">{children}</div>
    </div>
  );
};

export default GlassSurface;

```

### Component CSS
```css
.glass-surface {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: opacity 0.26s ease-out;
}

.glass-surface__filter {
  width: 100%;
  height: 100%;
  pointer-events: none;
  position: absolute;
  inset: 0;
  opacity: 0;
  z-index: -1;
}

.glass-surface__content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: inherit;
  position: relative;
  z-index: 1;
}

.glass-surface--svg {
  background: light-dark(hsl(0 0% 100% / var(--glass-frost, 0)), hsl(0 0% 0% / var(--glass-frost, 0)));
  backdrop-filter: var(--filter-id, url(#glass-filter)) saturate(var(--glass-saturation, 1));
  box-shadow:
    0 0 2px 1px light-dark(color-mix(in oklch, black, transparent 85%), color-mix(in oklch, white, transparent 65%))
      inset,
    0 0 10px 4px light-dark(color-mix(in oklch, black, transparent 90%), color-mix(in oklch, white, transparent 85%))
      inset,
    0px 4px 16px rgba(17, 17, 26, 0.05),
    0px 8px 24px rgba(17, 17, 26, 0.05),
    0px 16px 56px rgba(17, 17, 26, 0.05),
    0px 4px 16px rgba(17, 17, 26, 0.05) inset,
    0px 8px 24px rgba(17, 17, 26, 0.05) inset,
    0px 16px 56px rgba(17, 17, 26, 0.05) inset;
}

.glass-surface--webgl {
  box-shadow:
    0px 4px 16px rgba(17, 17, 26, 0.05),
    0px 8px 24px rgba(17, 17, 26, 0.05),
    0px 16px 56px rgba(17, 17, 26, 0.05);
}

.glass-surface__canvas,
.glass-surface__frame {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  pointer-events: none;
}

.glass-surface__frame {
  background: light-dark(hsl(0 0% 100% / var(--glass-frost, 0)), hsl(0 0% 0% / var(--glass-frost, 0)));
  box-shadow:
    0 0 2px 1px light-dark(color-mix(in oklch, black, transparent 85%), color-mix(in oklch, white, transparent 65%))
      inset,
    0 0 10px 4px light-dark(color-mix(in oklch, black, transparent 90%), color-mix(in oklch, white, transparent 85%))
      inset,
    0px 4px 16px rgba(17, 17, 26, 0.05) inset,
    0px 8px 24px rgba(17, 17, 26, 0.05) inset,
    0px 16px 56px rgba(17, 17, 26, 0.05) inset;
}

.glass-surface--fallback {
  background: light-dark(
    hsl(0 0% 100% / calc(0.12 + var(--glass-frost, 0) * 0.5)),
    hsl(0 0% 100% / calc(0.04 + var(--glass-frost, 0) * 0.3))
  );
  -webkit-backdrop-filter: blur(12px) saturate(calc(var(--glass-saturation, 1) * 1.4)) brightness(1.04);
  backdrop-filter: blur(12px) saturate(calc(var(--glass-saturation, 1) * 1.4)) brightness(1.04);
  box-shadow:
    inset 0 1px 0 0 light-dark(hsl(0 0% 100% / 0.85), hsl(0 0% 100% / 0.3)),
    inset 0 -1px 0 0 light-dark(hsl(0 0% 100% / 0.35), hsl(0 0% 100% / 0.08)),
    0 0 2px 1px light-dark(color-mix(in oklch, black, transparent 88%), color-mix(in oklch, white, transparent 72%))
      inset,
    0 0 12px 3px light-dark(color-mix(in oklch, white, transparent 72%), color-mix(in oklch, white, transparent 90%))
      inset,
    0px 4px 16px rgba(17, 17, 26, 0.06),
    0px 8px 24px rgba(17, 17, 26, 0.06),
    0px 16px 56px rgba(17, 17, 26, 0.06);
}

.glass-surface__sheen,
.glass-surface__rim {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
}

.glass-surface__sheen {
  background: linear-gradient(
    135deg,
    light-dark(hsl(0 0% 100% / 0.42), hsl(0 0% 100% / 0.14)) 0%,
    transparent 42%,
    transparent 64%,
    light-dark(hsl(0 0% 100% / 0.18), hsl(0 0% 100% / 0.05)) 100%
  );
}

.glass-surface__rim {
  padding: 3px;
  background: linear-gradient(
    150deg,
    light-dark(hsl(0 0% 100% / 0.7), hsl(0 0% 100% / 0.34)),
    light-dark(hsl(0 0% 100% / 0.1), hsl(0 0% 100% / 0.03)) 45%,
    light-dark(hsl(0 0% 100% / 0.08), hsl(0 0% 100% / 0.02)) 60%,
    light-dark(hsl(0 0% 100% / 0.42), hsl(0 0% 100% / 0.18))
  );
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask:
    linear-gradient(#000 0 0) content-box exclude,
    linear-gradient(#000 0 0);
}

.glass-surface__line,
.glass-surface__glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
}

.glass-surface--svg .glass-surface__line,
.glass-surface--webgl .glass-surface__line {
  background: light-dark(color-mix(in oklch, black, transparent 85%), color-mix(in oklch, white, transparent 65%));
}

.glass-surface--svg .glass-surface__glow,
.glass-surface--webgl .glass-surface__glow {
  background: light-dark(color-mix(in oklch, black, transparent 90%), color-mix(in oklch, white, transparent 85%));
}

.glass-surface--fallback .glass-surface__line {
  background: light-dark(color-mix(in oklch, black, transparent 88%), color-mix(in oklch, white, transparent 72%));
}

.glass-surface--fallback .glass-surface__glow {
  background: light-dark(color-mix(in oklch, white, transparent 72%), color-mix(in oklch, white, transparent 90%));
}

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .glass-surface--fallback {
    background: light-dark(hsl(0 0% 100% / 0.72), hsl(0 0% 12% / 0.72));
  }
}

.glass-surface:focus-visible {
  outline: 2px solid light-dark(#007aff, #0a84ff);
  outline-offset: 2px;
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.


## Integrate the <Stepper /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: Stepper
### Variant: JavaScript + CSS
### Dependencies: @hugeicons/react @hugeicons/core-free-icons

---

### Usage Example
```jsx
import Stepper, { Step } from './Stepper';

<Stepper
  initialStep={1}
  onStepChange={step => console.log(step)}
  onFinalStepCompleted={() => console.log('All steps completed!')}
  backButtonText="Back"
  nextButtonText="Continue"
>
  <Step title="Welcome">
    <h3>Welcome aboard</h3>
    <p>Set up your workspace in a few quick steps.</p>
  </Step>
  <Step title="Plan">
    <h3>Choose a plan</h3>
    <p>You can change this at any time.</p>
  </Step>
  <Step title="Profile">
    <h3>What should we call you?</h3>
    <input placeholder="Your name" />
  </Step>
  <Step title="Review">
    <h3>Looking good</h3>
    <p>Complete setup to open your workspace.</p>
  </Step>
</Stepper>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | The steps. Wrap each one in Step, which can also take a title, description and icon. |
| Step title | ReactNode | - | Label shown under the indicator, or beside it in the vertical layout. |
| Step description | ReactNode | - | Second line shown beside the indicator in the vertical layout. |
| Step icon | ReactNode | - | Icon shown inside the indicator instead of the number. |
| step | number | - | Controls the current step yourself. Use it with onStepChange. |
| initialStep | number | 1 | The step shown first. |
| onStepChange | (step: number) => void | () => {} | Called when the step changes. |
| onFinalStepCompleted | () => void | () => {} | Called when the last step is completed. |
| indicator | 'numbers' | 'dots' | 'bars' | 'numbers' | Style of the step indicators in the horizontal layout. |
| orientation | 'horizontal' | 'vertical' | 'horizontal' | Indicators across the top, or a rail of numbered steps beside the content. |
| transition | 'slide' | 'fade' | 'none' | 'slide' | How the content changes between steps. The height always animates. |
| linear | boolean | false | Only lets the indicators jump back to steps that have been reached. |
| disableStepIndicators | boolean | false | Stops the indicators from changing the step when clicked. |
| renderStepIndicator | ({ step, currentStep, onStepClick }) => ReactNode | - | Renders your own numbered indicator. |
| showFooter | boolean | true | Shows the Back and Continue buttons. |
| backButtonText | string | 'Back' | Text of the Back button. |
| nextButtonText | string | 'Continue' | Text of the Continue button. |
| completeButtonText | string | 'Complete' | Text of the Continue button on the last step. |
| backButtonProps | ButtonHTMLAttributes | {} | Extra props for the Back button. |
| nextButtonProps | ButtonHTMLAttributes | {} | Extra props for the Continue button, such as disabled while a step is incomplete. |
| completedContent | ReactNode | - | Shown in place of the steps once the last one is completed. |
| theme | 'dark' | 'light' | 'dark' | Color theme of the panel and controls. |
| accentColor | string | - | Color of completed steps, the progress lines and the Continue button. |
| frame | boolean | true | Shows the frosted panel around the stepper. |
| radius | number | 24 | Corner radius of the panel, in px. |
| width | number | string | 440 | Maximum width of the stepper. |
| className | string | '' | Extra class names for the stepper. |
| stepContainerClassName | string | '' | Extra class names for the indicator row. |
| contentClassName | string | '' | Extra class names for the content area. |
| footerClassName | string | '' | Extra class names for the footer. |
| style | CSSProperties | - | Inline styles for the stepper. |

### Full Component Source
```jsx
'use client';

import { Children, isValidElement, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon, ArrowRight01Icon, Tick02Icon } from '@hugeicons/core-free-icons';

import './Stepper.css';

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const THEMES = {
  dark: {
    '--stepper-frame': 'rgba(38, 35, 46, 0.66)',
    '--stepper-frame-edge': 'rgba(255, 255, 255, 0.08)',
    '--stepper-frame-highlight': 'rgba(255, 255, 255, 0.07)',
    '--stepper-frame-shadow': '0 22px 44px -20px rgba(0, 0, 0, 0.8), 0 6px 16px -8px rgba(0, 0, 0, 0.5)',
    '--stepper-tile': 'linear-gradient(180deg, #3a3644 0%, #27242f 100%)',
    '--stepper-tile-edge': 'rgba(255, 255, 255, 0.07)',
    '--stepper-tile-highlight': 'rgba(255, 255, 255, 0.12)',
    '--stepper-tile-shadow': '0 4px 10px -4px rgba(0, 0, 0, 0.7)',
    '--stepper-well': 'rgba(255, 255, 255, 0.07)',
    '--stepper-track': 'rgba(255, 255, 255, 0.1)',
    '--stepper-ink': '#f4f4f5',
    '--stepper-muted': 'rgba(244, 244, 245, 0.55)',
    '--stepper-faint': 'rgba(255, 255, 255, 0.22)',
    '--stepper-ring': 'rgba(244, 244, 245, 0.3)',
    '--stepper-solid': '#f4f4f5',
    '--stepper-solid-ink': '#18181b',
    '--stepper-hover': 'brightness(1.12)',
    '--stepper-hover-fill': 'rgba(255, 255, 255, 0.04)',
    '--stepper-solid-hover': 'brightness(0.9)',
    '--stepper-press': 'brightness(0.85)'
  },
  light: {
    '--stepper-frame': 'rgba(240, 240, 243, 0.8)',
    '--stepper-frame-edge': 'rgba(24, 24, 27, 0.07)',
    '--stepper-frame-highlight': 'rgba(255, 255, 255, 0.95)',
    '--stepper-frame-shadow': '0 22px 44px -22px rgba(24, 24, 27, 0.3), 0 6px 16px -10px rgba(24, 24, 27, 0.16)',
    '--stepper-tile': 'linear-gradient(180deg, #ffffff 0%, #f6f6f8 100%)',
    '--stepper-tile-edge': 'rgba(24, 24, 27, 0.08)',
    '--stepper-tile-highlight': 'rgba(255, 255, 255, 1)',
    '--stepper-tile-shadow': '0 4px 10px -5px rgba(24, 24, 27, 0.25)',
    '--stepper-well': 'rgba(24, 24, 27, 0.05)',
    '--stepper-track': 'rgba(24, 24, 27, 0.08)',
    '--stepper-ink': '#27272a',
    '--stepper-muted': 'rgba(39, 39, 42, 0.55)',
    '--stepper-faint': 'rgba(24, 24, 27, 0.16)',
    '--stepper-ring': 'rgba(24, 24, 27, 0.28)',
    '--stepper-solid': '#27272a',
    '--stepper-solid-ink': '#ffffff',
    '--stepper-hover': 'brightness(0.97)',
    '--stepper-hover-fill': 'rgba(24, 24, 27, 0.035)',
    '--stepper-solid-hover': 'brightness(1.3)',
    '--stepper-press': 'brightness(0.92)'
  }
};

const SPRING =
  'linear(0, 0.0603, 0.2033, 0.3821, 0.5633, 0.7258, 0.8584, 0.9574, 1.0242, 1.0634, 1.0809, 1.0828, 1.0747, 1.0613, 1.046, 1.0313, 1.0186, 1.0085, 1.0012, 0.9965, 0.994, 0.9931, 0.9933, 0.9941, 0.9953, 0.9966, 0.9978, 0.9988, 1)';
const SETTLE = 'cubic-bezier(0.22, 1, 0.36, 1)';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const size = value => (typeof value === 'number' ? `${value}px` : value);

const readableOn = color => {
  let hex = String(color || '')
    .trim()
    .replace('#', '');
  if (hex.length === 3) hex = hex.replace(/./g, c => c + c);
  if (!/^[0-9a-f]{6}$/i.test(hex)) return '#ffffff';
  const [r, g, b] = [0, 2, 4].map(index => {
    const c = parseInt(hex.slice(index, index + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.4 ? '#18181b' : '#ffffff';
};

const ease = () =>
  typeof CSS !== 'undefined' && CSS.supports?.('transition-timing-function', 'linear(0, 1)')
    ? SPRING
    : 'cubic-bezier(0.34, 1.4, 0.64, 1)';

function Check() {
  const ref = useRef(null);

  useIsomorphicLayoutEffect(() => {
    const path = ref.current?.querySelector('path');
    if (!path || typeof path.animate !== 'function') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    path.style.strokeDasharray = '24';
    path.animate([{ strokeDashoffset: 24 }, { strokeDashoffset: 0 }], {
      duration: 360,
      easing: SETTLE
    });
  }, []);

  return (
    <span ref={ref} className="stepper__check">
      <HugeiconsIcon icon={Tick02Icon} size={16} strokeWidth={2.4} />
    </span>
  );
}

export function Step({ children }) {
  return <div className="stepper__step">{children}</div>;
}

export default function Stepper({
  children,
  step,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  indicator = 'numbers',
  orientation = 'horizontal',
  transition = 'slide',
  linear = false,
  disableStepIndicators = false,
  renderStepIndicator,
  showFooter = true,
  backButtonText = 'Back',
  nextButtonText = 'Continue',
  completeButtonText = 'Complete',
  backButtonProps = {},
  nextButtonProps = {},
  completedContent,
  theme = 'dark',
  accentColor,
  frame = true,
  radius = 24,
  width = 440,
  className = '',
  stepCircleContainerClassName = '',
  stepContainerClassName = '',
  contentClassName = '',
  footerClassName = '',
  style,
  ...rest
}) {
  const steps = Children.toArray(children).filter(isValidElement);
  const total = steps.length;
  const controlled = typeof step === 'number';
  const [internal, setInternal] = useState(initialStep);
  const current = clamp(Math.round(controlled ? step : internal), 1, total + 1);
  const completed = current > total;
  const vertical = orientation === 'vertical';
  const kind = vertical ? 'numbers' : indicator;
  const labelled = steps.some(entry => entry.props.title);

  const [compact, setCompact] = useState(false);
  const [tight, setTight] = useState(false);
  const rail = vertical && !compact;
  const [reached, setReached] = useState(current);
  if (current > reached) setReached(current);

  const [view, setView] = useState({ step: current, previous: null, direction: 1, id: 0 });
  if (view.step !== current) {
    setView({ step: current, previous: view.step, direction: current > view.step ? 1 : -1, id: view.id + 1 });
  }

  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const gliderRef = useRef(null);
  const markerRefs = useRef([]);
  const titleRefs = useRef([]);
  const viewportRef = useRef(null);
  const paneRef = useRef(null);
  const leavingRef = useRef(null);
  const heightRef = useRef(0);
  const labelWidths = useRef([]);
  const tightRef = useRef(false);
  tightRef.current = tight;
  const placedRef = useRef(false);

  const go = target => {
    const next = clamp(target, 1, total + 1);
    if (next === current) return;
    if (!controlled) setInternal(next);
    if (next > total) onFinalStepCompleted();
    else onStepChange(next);
  };

  const reachable = number =>
    !disableStepIndicators && number !== current && (!linear || number <= Math.min(reached, total));

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const measure = () => {
      const folded = vertical && root.clientWidth < 520;
      setCompact(folded);
      const track = trackRef.current;
      if (!track || !labelled || (vertical && !folded)) {
        setTight(false);
        return;
      }
      const segments = markerRefs.current.slice(0, total);
      if (!tightRef.current) {
        segments.forEach((segment, index) => {
          const title = titleRefs.current[index];
          labelWidths.current[index] = title && segment?.contains(title) ? title.scrollWidth + 8 : 0;
        });
      }
      const badges = segments.reduce(
        (sum, segment) => sum + (segment?.firstElementChild?.getBoundingClientRect().width ?? 22) + 20,
        0
      );
      const labels = labelWidths.current.slice(0, total).reduce((sum, value) => sum + (value || 0), 0);
      const room = track.clientWidth - 8 - 4 * Math.max(0, total - 1);
      setTight(badges + labels > room + 0.5);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, [vertical, labelled, frame, total, kind]);

  useIsomorphicLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    heightRef.current = viewport.offsetHeight;
    const observer = new ResizeObserver(() => {
      heightRef.current = viewport.offsetHeight;
    });
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (view.id === 0) return;
    const viewport = viewportRef.current;
    const pane = paneRef.current;
    const leaving = leavingRef.current;
    const id = view.id;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mode = transition === 'none' ? 'none' : reduced ? 'fade' : transition;
    const finish = () => setView(state => (state.id === id ? { ...state, previous: null } : state));
    if (leaving && pane && leaving.contains(document.activeElement)) pane.focus({ preventScroll: true });
    if (!viewport || typeof viewport.animate !== 'function' || mode === 'none') {
      finish();
      return;
    }
    for (const element of [viewport, pane, leaving]) element?.getAnimations().forEach(animation => animation.cancel());
    const from = heightRef.current;
    const to = viewport.offsetHeight;
    const spring = ease();
    if (Math.abs(from - to) > 0.5) {
      viewport.animate([{ height: `${from}px` }, { height: `${to}px` }], {
        duration: reduced ? 200 : 560,
        easing: reduced ? SETTLE : spring
      });
    }
    const axis = vertical ? 'Y' : 'X';
    const shift = mode === 'slide' ? 36 : 0;
    if (pane) {
      if (shift) {
        pane.animate([{ transform: `translate${axis}(${view.direction * shift}px)` }, { transform: 'none' }], {
          duration: 560,
          easing: spring
        });
      }
      pane.animate([{ opacity: 0 }, { opacity: 0, offset: 0.25 }, { opacity: 1 }], {
        duration: 420,
        easing: 'ease-out'
      });
    }
    if (leaving) {
      leaving.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 140,
        easing: 'cubic-bezier(0.2, 0, 0.4, 1)',
        fill: 'forwards'
      });
      const exit = leaving.animate(
        [{ transform: 'none' }, { transform: `translate${axis}(${-view.direction * shift}px)` }],
        { duration: 200, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' }
      );
      exit.onfinish = finish;
    } else finish();
  }, [view.id]);

  useIsomorphicLayoutEffect(() => {
    const track = trackRef.current;
    const glider = gliderRef.current;
    if (!track || !glider) return;
    const place = animate => {
      const segment = markerRefs.current[Math.min(current, total) - 1];
      if (!segment) return;
      const spring = ease();
      glider.style.transition = animate
        ? `transform 560ms ${spring}, width 560ms ${spring}, height 560ms ${spring}, opacity 200ms ease`
        : 'opacity 200ms ease';
      glider.style.transform = `translate3d(${segment.offsetLeft}px, ${segment.offsetTop}px, 0)`;
      glider.style.width = `${segment.offsetWidth}px`;
      glider.style.height = `${segment.offsetHeight}px`;
      glider.style.opacity = completed ? '0' : '1';
    };
    place(placedRef.current && !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    placedRef.current = true;
    const observer = new ResizeObserver(() => place(false));
    observer.observe(track);
    return () => observer.disconnect();
  }, [current, total, completed, kind, labelled, vertical, compact, tight]);

  const paneContent = number => (number > total ? (completedContent ?? null) : steps[number - 1]);
  const accentVars = accentColor
    ? { '--stepper-solid': accentColor, '--stepper-solid-ink': readableOn(accentColor) }
    : {};

  const badge = (entry, number, status) => (
    <span className="stepper__badge" data-status={status}>
      {status === 'complete' ? (
        <Check />
      ) : entry.props.icon ? (
        <span className="stepper__glyph">{entry.props.icon}</span>
      ) : (
        number
      )}
    </span>
  );

  const header = () => {
    if (kind === 'dots') {
      return (
        <div className="stepper__dots">
          {steps.map((entry, index) => {
            const number = index + 1;
            const status = completed || number < current ? 'complete' : number === current ? 'active' : 'upcoming';
            return (
              <button
                key={number}
                type="button"
                className="stepper__dot"
                data-status={status}
                aria-label={entry.props.title ? `Step ${number}: ${entry.props.title}` : `Step ${number}`}
                aria-current={number === current ? 'step' : undefined}
                disabled={!reachable(number)}
                onClick={() => go(number)}
              >
                <span className="stepper__dot-mark" data-status={status} />
              </button>
            );
          })}
        </div>
      );
    }
    if (kind === 'bars') {
      return (
        <div className="stepper__bars">
          {steps.map((entry, index) => {
            const number = index + 1;
            const filled = completed || number <= current;
            return (
              <button
                key={number}
                type="button"
                className="stepper__bar"
                data-status={completed || number < current ? 'complete' : number === current ? 'active' : 'upcoming'}
                aria-label={entry.props.title ? `Step ${number}: ${entry.props.title}` : `Step ${number}`}
                aria-current={number === current ? 'step' : undefined}
                disabled={!reachable(number)}
                onClick={() => go(number)}
              >
                <span className="stepper__bar-track">
                  <span className="stepper__bar-fill" data-filled={filled ? '' : undefined} />
                </span>
              </button>
            );
          })}
        </div>
      );
    }
    return (
      <div ref={trackRef} className="stepper__track" data-layout={rail ? 'rail' : 'row'}>
        <span ref={gliderRef} className="stepper__glider" aria-hidden="true" />
        {steps.map((entry, index) => {
          const number = index + 1;
          const status = completed || number < current ? 'complete' : number === current ? 'active' : 'upcoming';
          const title = entry.props.title;
          const text = title && !(tight && !rail) && (
            <span className="stepper__text">
              <span
                ref={element => {
                  titleRefs.current[index] = element;
                }}
                className="stepper__title"
                data-status={status}
              >
                {title}
              </span>
              {rail && entry.props.description && (
                <span className="stepper__description">{entry.props.description}</span>
              )}
            </span>
          );
          const ref = element => {
            markerRefs.current[index] = element;
          };
          if (renderStepIndicator) {
            return (
              <div key={number} ref={ref} className="stepper__segment" data-status={status}>
                {renderStepIndicator({ step: number, currentStep: current, onStepClick: clicked => go(clicked) })}
                {text}
              </div>
            );
          }
          return (
            <button
              key={number}
              ref={ref}
              type="button"
              className="stepper__segment"
              data-status={status}
              aria-label={typeof title === 'string' ? `Step ${number}: ${title}` : `Step ${number}`}
              aria-current={number === current ? 'step' : undefined}
              disabled={!reachable(number)}
              onClick={() => go(number)}
            >
              {badge(entry, number, status)}
              {text}
            </button>
          );
        })}
      </div>
    );
  };

  const isLast = current === total;
  const nextLabel = isLast ? completeButtonText : nextButtonText;
  const { className: backClass = '', onClick: onBackClick, ...backRest } = backButtonProps;
  const { className: nextClass = '', onClick: onNextClick, ...nextRest } = nextButtonProps;

  return (
    <div
      {...rest}
      ref={rootRef}
      className={`stepper stepper--${rail ? 'vertical' : 'horizontal'}${frame ? ' stepper--framed' : ''} ${stepCircleContainerClassName} ${className}`
        .replace(/\s+/g, ' ')
        .trim()}
      data-completed={completed ? '' : undefined}
      style={{
        ...(THEMES[theme] ?? THEMES.dark),
        '--stepper-radius': `${Math.max(0, radius)}px`,
        '--stepper-spring': SPRING,
        '--stepper-width': size(width),
        ...accentVars,
        ...style
      }}
    >
      <div className={`stepper__header stepper__header--${kind} ${stepContainerClassName}`.trim()}>{header()}</div>
      <div className="stepper__body">
        <div ref={viewportRef} className={`stepper__viewport ${contentClassName}`.trim()} aria-live="polite">
          {view.previous !== null && (
            <div key={view.id - 1} ref={leavingRef} className="stepper__pane stepper__pane--leaving" aria-hidden="true">
              {paneContent(view.previous)}
            </div>
          )}
          <div key={view.id} ref={paneRef} className="stepper__pane" tabIndex={-1}>
            {paneContent(view.step)}
          </div>
        </div>
        {showFooter && (
          <div
            className="stepper__footer-wrap"
            data-hidden={completed ? '' : undefined}
            aria-hidden={completed ? true : undefined}
          >
            <div className="stepper__footer-clip">
              <div className={`stepper__footer ${footerClassName}`.trim()}>
                <button
                  type="button"
                  {...backRest}
                  className={`stepper__button stepper__button--back ${backClass}`.trim()}
                  data-hidden={current <= 1 ? '' : undefined}
                  tabIndex={completed ? -1 : backRest.tabIndex}
                  onClick={event => {
                    onBackClick?.(event);
                    if (!event.defaultPrevented) go(current - 1);
                  }}
                >
                  <HugeiconsIcon icon={ArrowLeft01Icon} size={16} strokeWidth={2} />
                  <span>{backButtonText}</span>
                </button>
                <button
                  type="button"
                  {...nextRest}
                  className={`stepper__button stepper__button--next ${nextClass}`.trim()}
                  tabIndex={completed ? -1 : nextRest.tabIndex}
                  onClick={event => {
                    onNextClick?.(event);
                    if (!event.defaultPrevented) go(current + 1);
                  }}
                >
                  <span>{nextLabel}</span>
                  <HugeiconsIcon icon={isLast ? Tick02Icon : ArrowRight01Icon} size={16} strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {frame && <span className="stepper__rim" aria-hidden="true" />}
    </div>
  );
}

```

### Component CSS
```css
.stepper {
  --stepper-pad: 0px;
  --stepper-inset: 0px;
  --stepper-bleed: 8px;
  --stepper-well-radius: max(6px, calc(var(--stepper-radius) - 8px));
  --stepper-tile-radius: max(4px, calc(var(--stepper-well-radius) - 4px));
  position: relative;
  display: flex;
  flex-direction: column;
  width: min(100%, var(--stepper-width));
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
  border-radius: var(--stepper-radius);
  color: var(--stepper-ink);
  -webkit-tap-highlight-color: transparent;
}

.stepper--framed {
  --stepper-pad: 8px;
  --stepper-inset: 12px;
  --stepper-bleed: 20px;
  padding: var(--stepper-pad);
  background: var(--stepper-frame);
  box-shadow: var(--stepper-frame-shadow);
  -webkit-backdrop-filter: blur(20px) saturate(1.6);
  backdrop-filter: blur(20px) saturate(1.6);
}

.stepper__rim {
  position: absolute;
  inset: 0;
  z-index: 2;
  border-radius: inherit;
  box-shadow:
    inset 0 0 0 1px var(--stepper-frame-edge),
    inset 0 1px 0 var(--stepper-frame-highlight);
  pointer-events: none;
}

.stepper__header--dots,
.stepper__header--bars {
  padding: var(--stepper-inset) var(--stepper-inset) 0;
}

.stepper__track {
  position: relative;
  display: flex;
  gap: 4px;
  padding: 4px;
  border-radius: var(--stepper-well-radius);
  background: var(--stepper-well);
}

.stepper__glider {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: var(--stepper-tile-radius);
  background: var(--stepper-tile);
  box-shadow:
    inset 0 0 0 1px var(--stepper-tile-edge),
    inset 0 1px 0 var(--stepper-tile-highlight),
    var(--stepper-tile-shadow);
  opacity: 0;
  pointer-events: none;
}

.stepper__segment {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 0;
  height: 40px;
  padding: 0 10px;
  box-sizing: border-box;
  border: none;
  border-radius: var(--stepper-tile-radius);
  background: none;
  color: var(--stepper-muted);
  font-family: inherit;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.stepper__segment:disabled {
  cursor: default;
}

.stepper__badge {
  display: grid;
  flex: none;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px var(--stepper-faint);
  color: var(--stepper-muted);
  font-size: 11.5px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  transition:
    background-color 0.15s ease,
    box-shadow 0.15s ease,
    color 0.15s ease;
}

.stepper__badge[data-status='active'] {
  box-shadow: inset 0 0 0 1.5px var(--stepper-ink);
  color: var(--stepper-ink);
}

.stepper__badge[data-status='complete'] {
  background: var(--stepper-solid);
  box-shadow: none;
  color: var(--stepper-solid-ink);
}

.stepper__glyph,
.stepper__check {
  display: grid;
  place-items: center;
}

.stepper__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  text-align: left;
}

.stepper__title {
  overflow: hidden;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.2;
  color: var(--stepper-muted);
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.2s ease;
}

.stepper__title:not([data-status='upcoming']) {
  color: var(--stepper-ink);
}

.stepper__description {
  overflow: hidden;
  font-size: 12px;
  line-height: 1.35;
  color: var(--stepper-muted);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stepper__track[data-layout='rail'] {
  flex: 1;
  flex-direction: column;
}

.stepper__track[data-layout='rail'] .stepper__segment {
  flex: none;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 10px;
  height: auto;
  padding: 10px;
}

.stepper__track[data-layout='rail'] .stepper__text {
  padding-top: 3px;
}

.stepper__dots {
  display: flex;
  justify-content: center;
  gap: 2px;
}

.stepper__dot {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: none;
  cursor: pointer;
}

.stepper__dot-mark {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--stepper-faint);
  transition:
    background-color 0.25s ease,
    transform 0.45s var(--stepper-spring);
}

.stepper__dot-mark[data-status='complete'] {
  background: var(--stepper-muted);
}

.stepper__dot-mark[data-status='active'] {
  background: var(--stepper-solid);
  transform: scale(1.3);
}

.stepper__bars {
  display: flex;
  gap: 6px;
}

.stepper__bar {
  display: flex;
  flex: 1;
  align-items: center;
  height: 18px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}

.stepper__bar-track {
  position: relative;
  width: 100%;
  height: 4px;
  overflow: hidden;
  border-radius: 4px;
  background: var(--stepper-track);
}

.stepper__bar-fill {
  position: absolute;
  inset: 0;
  background: var(--stepper-solid);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 560ms var(--stepper-spring);
}

.stepper__bar-fill[data-filled] {
  transform: none;
}

.stepper__dot:disabled,
.stepper__bar:disabled {
  cursor: default;
}

.stepper__body {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 20px var(--stepper-inset) var(--stepper-inset);
}

.stepper__viewport {
  position: relative;
  margin: -6px calc(var(--stepper-bleed) * -1);
  overflow: hidden;
}

.stepper__pane {
  box-sizing: border-box;
  padding: 6px var(--stepper-bleed);
  outline: none;
}

.stepper__pane--leaving {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  pointer-events: none;
}

.stepper__step {
  min-width: 0;
}

.stepper__footer-wrap {
  display: grid;
  grid-template-rows: 1fr;
  transition:
    grid-template-rows 480ms var(--stepper-spring),
    opacity 0.2s ease;
}

.stepper__footer-wrap[data-hidden] {
  grid-template-rows: 0fr;
  opacity: 0;
  pointer-events: none;
}

.stepper__footer-clip {
  min-height: 0;
}

.stepper__footer-wrap[data-hidden] .stepper__footer-clip {
  overflow: hidden;
}

.stepper__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 20px;
}

.stepper__button {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 6px;
  height: 38px;
  padding: 0 14px;
  border: none;
  border-radius: max(8px, calc(var(--stepper-radius) * 0.5));
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  transition:
    filter 0.2s ease,
    transform 0.2s ease,
    opacity 0.2s ease;
}

.stepper__button--back {
  padding-left: 10px;
  background: var(--stepper-tile);
  box-shadow:
    inset 0 0 0 1px var(--stepper-tile-edge),
    inset 0 1px 0 var(--stepper-tile-highlight),
    var(--stepper-tile-shadow);
  color: var(--stepper-ink);
}

.stepper__button--back[data-hidden] {
  visibility: hidden;
  opacity: 0;
  transition:
    opacity 0.2s ease,
    visibility 0s 0.2s;
}

.stepper__button--next {
  margin-left: auto;
  padding-right: 11px;
  background: var(--stepper-solid);
  box-shadow: 0 4px 12px -6px rgba(0, 0, 0, 0.5);
  color: var(--stepper-solid-ink);
}

.stepper__button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.stepper__button:focus-visible,
.stepper__segment:focus-visible,
.stepper__dot:focus-visible,
.stepper__bar:focus-visible {
  outline: 2px solid var(--stepper-ink);
  outline-offset: 2px;
}

.stepper--vertical {
  flex-direction: row;
  align-items: stretch;
}

.stepper--vertical .stepper__header {
  display: flex;
  flex: none;
  width: 212px;
  max-width: 42%;
}

.stepper--vertical .stepper__body {
  flex: 1;
  padding: var(--stepper-inset) var(--stepper-inset) var(--stepper-inset) 20px;
}

@media (hover: hover) {
  .stepper__segment:not(:disabled):hover {
    background: var(--stepper-hover-fill);
  }

  .stepper__button--back:not(:disabled):hover {
    filter: var(--stepper-hover);
  }

  .stepper__button--next:not(:disabled):hover {
    filter: var(--stepper-solid-hover);
  }

  .stepper__dot:not(:disabled):hover .stepper__dot-mark {
    transform: scale(1.3);
  }

  .stepper__bar:not(:disabled):hover .stepper__bar-track {
    background: var(--stepper-faint);
  }
}

.stepper__button:not(:disabled):active {
  filter: var(--stepper-press);
  transform: scale(0.96);
  transition-duration: 0s;
}

@media (prefers-reduced-motion: reduce) {
  .stepper__bar-fill,
  .stepper__dot-mark,
  .stepper__footer-wrap {
    transition-duration: 0.01ms;
  }
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.


## Integrate the <undefined /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: undefined
### Variant: JavaScript + CSS
### Dependencies: @hugeicons/react @hugeicons/core-free-icons

---

### Usage Example
```jsx
import { Download04Icon, Rocket01Icon, Settings02Icon } from '@hugeicons/core-free-icons';
import BranchedMenu from './BranchedMenu';

<BranchedMenu
  items={[
    {
      label: 'Getting started',
      children: [
        { value: 'install', label: 'Installation', icon: Download04Icon },
        { value: 'quick', label: 'Quick start', icon: Rocket01Icon },
        { value: 'config', label: 'Configuration', icon: Settings02Icon }
      ]
    },
    { label: 'Components', children: [{ value: 'buttons', label: 'Buttons' }, { value: 'overlays', label: 'Overlays' }] }
  ]}
  defaultOpen={[0]}
  defaultActive="quick"
  onSelect={(value, item) => navigate(value)}
  color="#f5f5f5"
  accentColor="#f5f5f5"
  lineColor="#3f3f46"
  width={240}
  rowHeight={36}
  indent={40}
  trunk={14}
  radius={10}
  lineWidth={1.5}
  fontSize={14}
  drawDuration={400}
  foldDuration={300}
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| items | BranchedMenuItem[] | DEFAULT_ITEMS | Sections: label plus children (value, label, icon), or a leaf with a value. A section with children folds; a leaf selects. |
| defaultOpen | number | number[] | 0 | The section, or sections, open at first. -1 for none. |
| defaultActive | string | "" | Value selected at first. Empty picks the open section's first child. |
| onSelect | (value, item) => void | - | A child or a leaf was picked. |
| onToggle | (index, open) => void | - | A section folded or unfolded. |
| color | string | "#f5f5f5" | The ink. Lines and idle text are mixes of it. |
| accentColor | string | "#f5f5f5" | The active line, the active label and the marker. |
| lineColor | string | "#3f3f46" | The rail, trunk and branches. A solid colour, so joints never darken. |
| width | number | 240 | The widest the menu may be, in px. It shrinks to its content. |
| rowHeight | number | 36 | Height of a child row in px. |
| indent | number | 40 | Where child rows start, in px. Branches end just before it. |
| trunk | number | 14 | The trunk line's x position, in px. |
| radius | number | 10 | The curve of each branch, in px. |
| lineWidth | number | 1.5 | Stroke width of the lines. |
| fontSize | number | 14 | Child text size in px. Headers are 1px larger. |
| drawDuration | number | 400 | The accent line's travel, in ms. |
| foldDuration | number | 300 | A section's fold and unfold, in ms. |
| className | string | "" | Extra classes for the nav. |

### Full Component Source
```jsx
'use client';

import { isValidElement, useLayoutEffect, useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  CursorPointer01Icon,
  Download04Icon,
  Layers01Icon,
  Notification03Icon,
  PaintBoardIcon,
  Rocket01Icon,
  Settings02Icon,
  TextFontIcon
} from '@hugeicons/core-free-icons';
import './BranchedMenu.css';

const DEFAULT_ITEMS = [
  {
    label: 'Getting started',
    children: [
      { value: 'install', label: 'Installation', icon: Download04Icon },
      { value: 'quick', label: 'Quick start', icon: Rocket01Icon },
      { value: 'config', label: 'Configuration', icon: Settings02Icon },
      { value: 'theming', label: 'Theming', icon: PaintBoardIcon }
    ]
  },
  {
    label: 'Components',
    children: [
      { value: 'buttons', label: 'Buttons', icon: CursorPointer01Icon },
      { value: 'typography', label: 'Typography', icon: TextFontIcon },
      { value: 'overlays', label: 'Overlays', icon: Layers01Icon },
      { value: 'toasts', label: 'Toasts', icon: Notification03Icon }
    ]
  }
];
const PAD = 6;
const MARK = 16;

const renderIcon = icon => (isValidElement(icon) ? icon : <HugeiconsIcon icon={icon} size={16} strokeWidth={1.8} />);
const toSet = open => new Set(Array.isArray(open) ? open : open >= 0 ? [open] : []);

export default function BranchedMenu({
  items = DEFAULT_ITEMS,
  defaultOpen = 0,
  defaultActive = '',
  onSelect,
  onToggle,
  color = '#f5f5f5',
  accentColor = '#f5f5f5',
  lineColor = '#3f3f46',
  width = 240,
  rowHeight = 36,
  indent = 40,
  trunk = 14,
  radius = 10,
  lineWidth = 1.5,
  fontSize = 14,
  drawDuration = 400,
  foldDuration = 300,
  className = ''
}) {
  const [open, setOpen] = useState(() => toSet(defaultOpen));
  const [active, setActive] = useState(() => {
    if (defaultActive) return defaultActive;
    const first = items.find((it, i) => it.children && toSet(defaultOpen).has(i));
    return first?.children?.[0]?.value ?? '';
  });
  const navRef = useRef(null);
  const heads = useRef([]);
  const markerRef = useRef(null);
  const latest = useRef({});
  latest.current = { onSelect, onToggle };

  const activeSection = items.findIndex(it => it.children?.some(kid => kid.value === active));
  const markerShown = activeSection >= 0 && open.has(activeSection);
  useLayoutEffect(() => {
    const place = glide => {
      const m = markerRef.current;
      const el = heads.current[activeSection];
      if (!m) return;
      const on = markerShown && el;
      if (!glide) m.style.transition = 'none';
      if (on) m.style.top = `${el.offsetTop + (el.offsetHeight - MARK) / 2}px`;
      m.toggleAttribute('data-on', Boolean(on));
      if (!glide) {
        void m.offsetHeight;
        m.style.transition = '';
      }
    };
    place(true);
    let first = true;
    const ro = new ResizeObserver(() => {
      if (first) {
        first = false;
        return;
      }
      place(false);
    });
    if (navRef.current) ro.observe(navRef.current);
    return () => ro.disconnect();
  }, [activeSection, markerShown, items, fontSize, rowHeight]);

  const select = (value, item) => {
    setActive(value);
    latest.current.onSelect?.(value, item);
  };
  const toggle = i => {
    setOpen(prev => {
      const next = new Set(prev);
      const isOpen = !next.has(i);
      if (isOpen) next.add(i);
      else next.delete(i);
      latest.current.onToggle?.(i, isOpen);
      return next;
    });
  };

  const r = Math.min(radius, rowHeight / 2 - 2);
  const endX = indent - 8;
  const rowY = k => PAD + k * rowHeight + rowHeight / 2;
  const branch = k => `M ${trunk} ${rowY(k) - r} A ${r} ${r} 0 0 0 ${trunk + r} ${rowY(k)} H ${endX}`;
  const reach = k => `M ${trunk} 0 V ${rowY(k) - r} A ${r} ${r} 0 0 0 ${trunk + r} ${rowY(k)} H ${endX}`;
  const length = k => rowY(k) - r + (Math.PI * r) / 2 + (endX - trunk - r);

  return (
    <nav
      ref={navRef}
      className={`branched-menu${className ? ` ${className}` : ''}`}
      style={{
        '--bm-w': `${width}px`,
        '--bm-ink': color,
        '--bm-accent': accentColor,
        '--bm-line': lineColor,
        '--bm-font': `${fontSize}px`,
        '--bm-row': `${rowHeight}px`,
        '--bm-indent': `${indent}px`,
        '--bm-line-w': lineWidth,
        '--bm-draw': `${drawDuration}ms`,
        '--bm-fold': `${foldDuration}ms`
      }}
    >
      <span ref={markerRef} className="branched-menu__marker" aria-hidden="true" />
      {items.map((item, i) => {
        const kids = item.children;
        const isOpen = kids ? open.has(i) : false;
        const leafValue = item.value ?? item.label;
        const leafActive = !kids && leafValue === active;
        const bodyH = kids ? PAD * 2 + kids.length * rowHeight : 0;
        return (
          <div key={item.value ?? item.label} className="branched-menu__section" data-open={isOpen ? '' : undefined}>
            <button
              ref={el => {
                heads.current[i] = el;
              }}
              type="button"
              className="branched-menu__head"
              aria-expanded={kids ? isOpen : undefined}
              aria-current={leafActive ? 'true' : undefined}
              data-active={leafActive ? '' : undefined}
              onClick={() => (kids ? toggle(i) : select(leafValue, item))}
            >
              {item.label}
            </button>
            {kids ? (
              <div className="branched-menu__body">
                <div className="branched-menu__fold">
                  <div className="branched-menu__tree" style={{ height: bodyH }}>
                    <svg className="branched-menu__lines" width={indent} height={bodyH} aria-hidden="true">
                      <path className="branched-menu__base" d={`M ${trunk} 0 V ${rowY(kids.length - 1) - r}`} />
                      {kids.map((kid, k) => (
                        <path key={kid.value} className="branched-menu__base" d={branch(k)} />
                      ))}
                      {kids.map((kid, k) => (
                        <path
                          key={kid.value}
                          className="branched-menu__reach"
                          d={reach(k)}
                          style={{
                            strokeDasharray: length(k),
                            strokeDashoffset: kid.value === active ? 0 : length(k)
                          }}
                        />
                      ))}
                    </svg>
                    {kids.map(kid => (
                      <button
                        key={kid.value}
                        type="button"
                        className="branched-menu__item"
                        aria-current={kid.value === active ? 'true' : undefined}
                        data-active={kid.value === active ? '' : undefined}
                        tabIndex={isOpen ? 0 : -1}
                        onClick={() => select(kid.value, kid)}
                      >
                        {kid.icon ? (
                          <span className="branched-menu__icon" aria-hidden="true">
                            {renderIcon(kid.icon)}
                          </span>
                        ) : null}
                        <span className="branched-menu__label">{kid.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}

```

### Component CSS
```css
.branched-menu {
  --bm-w: 240px;
  --bm-ink: #f5f5f5;
  --bm-accent: #f5f5f5;
  --bm-line: #3f3f46;
  --bm-font: 14px;
  --bm-row: 36px;
  --bm-indent: 40px;
  --bm-line-w: 1.5;
  --bm-draw: 400ms;
  --bm-fold: 300ms;
  --bm-ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --bm-muted: color-mix(in srgb, var(--bm-ink) 55%, transparent);

  position: relative;
  display: flex;
  flex-direction: column;
  width: fit-content;
  max-width: min(var(--bm-w), 100%);
  padding-left: 14px;
  color: var(--bm-ink);
  font-family: inherit;
  font-size: var(--bm-font);
  line-height: 1.2;
}

.branched-menu::before {
  content: '';
  position: absolute;
  top: 8px;
  bottom: 0;
  left: 0;
  width: 2px;
  border-radius: 1px;
  background: linear-gradient(to bottom, var(--bm-line) 0%, var(--bm-line) 55%, transparent 100%);
}

.branched-menu__marker {
  position: absolute;
  top: -1px;
  left: 0;
  z-index: 1;
  width: 2px;
  height: 16px;
  border-radius: 1px;
  background: var(--bm-accent);
  opacity: 0;
  transition:
    top 220ms var(--bm-ease-out),
    opacity 150ms ease;
}

.branched-menu__marker[data-on] {
  opacity: 1;
}

.branched-menu__section {
  display: flex;
  flex-direction: column;
}

.branched-menu__head {
  display: block;
  margin: 0;
  padding: 9px 0;
  border: 0;
  background: none;
  color: var(--bm-muted);
  font: inherit;
  font-size: calc(var(--bm-font) + 1px);
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  transition: color 200ms ease;
}

.branched-menu__section[data-open] .branched-menu__head,
.branched-menu__head[data-active] {
  color: var(--bm-ink);
}

@media (hover: hover) and (pointer: fine) {
  .branched-menu__head:hover {
    color: var(--bm-ink);
  }
}

.branched-menu__body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--bm-fold) var(--bm-ease-out);
}

.branched-menu__section[data-open] .branched-menu__body {
  grid-template-rows: 1fr;
}

.branched-menu__fold {
  min-height: 0;
  overflow: hidden;
}

.branched-menu__tree {
  position: relative;
  padding: 6px 0;
  box-sizing: border-box;
}

.branched-menu__lines {
  position: absolute;
  top: 0;
  left: 0;
  overflow: visible;
  opacity: 0;
  pointer-events: none;
  transition: opacity 200ms ease;
}

.branched-menu__section[data-open] .branched-menu__lines {
  opacity: 1;
  transition: opacity 250ms ease 100ms;
}

.branched-menu__base,
.branched-menu__reach {
  fill: none;
  stroke-width: var(--bm-line-w);
  stroke-linecap: round;
  stroke-linejoin: round;
}

.branched-menu__base {
  stroke: var(--bm-line);
}

.branched-menu__reach {
  stroke: var(--bm-accent);
  transition: stroke-dashoffset var(--bm-draw) var(--bm-ease-out);
}

.branched-menu__item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: var(--bm-row);
  margin: 0;
  padding: 0 0 0 var(--bm-indent);
  border: 0;
  background: none;
  color: var(--bm-muted);
  font: inherit;
  text-align: left;
  cursor: pointer;
  outline: none;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  transition: color 200ms ease;
}

@media (hover: hover) and (pointer: fine) {
  .branched-menu__item:hover {
    color: var(--bm-ink);
  }
}

.branched-menu__item[data-active] {
  color: var(--bm-accent);
  font-weight: 500;
}

.branched-menu__icon {
  display: inline-flex;
  flex: none;
}

.branched-menu__label {
  white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .branched-menu__marker {
    transition: opacity 150ms ease;
  }

  .branched-menu__body {
    transition: none;
  }

  .branched-menu__reach {
    transition: none;
  }
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.


## Integrate the <undefined /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: undefined
### Variant: JavaScript + CSS
### Dependencies: motion @hugeicons/react @hugeicons/core-free-icons

---

### Usage Example
```jsx
import ThoughtLine from './ThoughtLine';

<ThoughtLine
  working={isStreaming}
  steps={['Reading the question', 'Searching your notes', 'Drafting an answer']}
  label="Thinking…"
  doneLabel="Thought for"
  glyph="sparkle"
  fontSize={16}
  breathPeriod={1.6}
  breathDepth={0.45}
  settleDuration={350}
  settleBlur={2}
  collapsible
  collapseOnSettle
  showTimer
  onSettle={seconds => console.log(`thought for ${seconds}s`)}
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | string | "Thinking…" | The working line. It breathes, and it is the spoken text. |
| doneLabel | string | "" | The settled line. Empty gives "Thought for", or "Done thinking" without the timer. |
| renderLabel | (text, working) => ReactNode | - | Wraps either string, for a sheen or a link. Inline content only. |
| glyph | 'sparkle' | 'dot' | 'none' | ReactNode | 'sparkle' | The mark that breathes and dims. |
| steps | string[] | [] | The trace beneath the line. Append as the agent progresses; the last step is current, earlier ones tick. |
| collapsible | boolean | true | The line becomes a toggle for the trace, with a chevron. |
| collapseOnSettle | boolean | true | Fold the trace into the line when it settles. |
| color | string | "currentColor" | The ink of the line and the trace. |
| glyphColor | string | "" | The glyph alone. Empty follows the ink. |
| fontSize | number | 16 | Type size in px. Everything scales in em. |
| breathPeriod | number | 1.6 | One breath, up and down, in seconds. |
| breathDepth | number | 0.45 | How far the glyph and label dim at the trough. 0 is no breath. |
| shimmer | boolean | true | A band of ink sweeps the working label. The label then leaves the breath to the glyph. |
| shimmerDuration | number | 1.8 | One sweep, in seconds. |
| settleDuration | number | 350 | The settle chord, in ms: crossfade, dim, glide, fold. |
| settleBlur | number | 2 | Blur through the crossfade seam, in px. |
| working | boolean | true | Working or settled. True again starts a new clock. |
| settleAfter | number | 0 | Seconds after which the line settles by itself. 0 waits for working. |
| elapsed | number | undefined | Controlled seconds. The internal clock never runs. |
| showTimer | boolean | true | The live clock that freezes into the sentence. |
| onSettle | (seconds) => void | - | Once per settle, with the frozen time. |
| className | string | "" | Extra classes for the root. |
| style | CSSProperties | - | Inline styles for the root. |

### Full Component Source
```jsx
'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { animate, useReducedMotion } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon, SparklesIcon, Tick02Icon } from '@hugeicons/core-free-icons';
import './ThoughtLine.css';

const EASE_OUT = [0.23, 1, 0.32, 1];
const EASE_IN_OUT = [0.77, 0, 0.175, 1];
const GLYPH_DONE = 0.55;
const EMPTY_STEPS = [];

const fmt = ds => (ds < 600 ? `${(ds / 10).toFixed(1)}s` : `${Math.floor(ds / 600)}m ${((ds % 600) / 10).toFixed(1)}s`);
const spoken = ds =>
  ds < 600
    ? `${(ds / 10).toFixed(1)} seconds`
    : `${Math.floor(ds / 600)} minutes ${((ds % 600) / 10).toFixed(1)} seconds`;

export default function ThoughtLine({
  label = 'Thinking…',
  doneLabel = '',
  renderLabel,
  glyph = 'sparkle',
  steps = EMPTY_STEPS,
  collapsible = true,
  collapseOnSettle = true,
  color = 'currentColor',
  glyphColor = '',
  fontSize = 16,
  breathPeriod = 1.6,
  breathDepth = 0.45,
  shimmer = true,
  shimmerDuration = 1.8,
  settleDuration = 350,
  settleBlur = 2,
  working = true,
  settleAfter = 0,
  elapsed,
  showTimer = true,
  onSettle,
  className = '',
  style
}) {
  const reduce = useReducedMotion();
  const [autoSettled, setAutoSettled] = useState(false);
  const [open, setOpen] = useState(true);
  const isWorking = working && !autoSettled;
  const doneText = doneLabel || (showTimer ? 'Thought for' : 'Done thinking');
  const hasTrace = steps.length > 0;
  const depth = reduce ? Math.min(breathDepth, 0.2) : breathDepth;
  const period = reduce ? breathPeriod * 1.5 : breathPeriod;
  const trough = 1 - depth;
  const sheen = shimmer && !reduce;

  const glyphRef = useRef(null);
  const breathRef = useRef(null);
  const timerRef = useRef(null);
  const stackRef = useRef(null);
  const workRef = useRef(null);
  const doneRef = useRef(null);
  const dsRef = useRef(0);
  const prevWorking = useRef(isWorking);
  const latest = useRef({});
  latest.current = { onSettle };
  const [announce, setAnnounce] = useState(label);

  useEffect(() => {
    if (working) setAutoSettled(false);
  }, [working]);
  useEffect(() => {
    if (isWorking) setOpen(true);
    else if (collapseOnSettle) setOpen(false);
  }, [isWorking, collapseOnSettle]);

  useEffect(() => {
    const glyphEl = glyphRef.current;
    const breathEl = breathRef.current;
    if (!breathEl) return undefined;
    const s = settleDuration / 1000;
    const loop = (el, delay) =>
      animate(el, { opacity: [trough, 1, trough] }, { duration: period, ease: EASE_IN_OUT, repeat: Infinity, delay });
    let cancelled = false;
    const running = [];
    if (isWorking) {
      if (depth > 0) {
        if (sheen) running.push(animate(breathEl, { opacity: 1 }, { duration: 0.2, ease: EASE_OUT }));
        if (glyphEl) {
          const lead = animate(glyphEl, { opacity: trough }, { duration: 0.2, ease: EASE_OUT });
          running.push(lead);
          lead.then(() => {
            if (cancelled) return;
            running.push(loop(glyphEl, 0));
            if (!sheen) running.push(loop(breathEl, 0.14));
          });
        } else if (!sheen) {
          running.push(loop(breathEl, 0.14));
        }
      } else {
        if (glyphEl) running.push(animate(glyphEl, { opacity: 1 }, { duration: 0.2, ease: EASE_OUT }));
        running.push(animate(breathEl, { opacity: 1 }, { duration: 0.2, ease: EASE_OUT }));
      }
    } else {
      if (glyphEl) running.push(animate(glyphEl, { opacity: GLYPH_DONE }, { duration: s, ease: EASE_OUT }));
      running.push(animate(breathEl, { opacity: 1 }, { duration: s, ease: EASE_OUT }));
    }
    return () => {
      cancelled = true;
      running.forEach(a => a.stop());
    };
  }, [isWorking, period, depth, trough, settleDuration, glyph, sheen]);

  const paint = ds => {
    dsRef.current = ds;
    if (timerRef.current) timerRef.current.textContent = fmt(ds);
  };
  useLayoutEffect(() => {
    if (elapsed != null) {
      paint(Math.round(elapsed * 10));
      return undefined;
    }
    if (!isWorking) return undefined;
    const startedAt = performance.now();
    paint(0);
    const id = setInterval(() => {
      const ds = Math.floor((performance.now() - startedAt) / 100);
      paint(ds);
      if (settleAfter > 0 && ds >= Math.round(settleAfter * 10)) setAutoSettled(true);
    }, 100);
    return () => clearInterval(id);
  }, [isWorking, elapsed, settleAfter]);

  useLayoutEffect(() => {
    const t = timerRef.current;
    const stack = stackRef.current;
    if (!t || !stack) return undefined;
    const place = glide => {
      const active = isWorking ? workRef.current : doneRef.current;
      if (!active) return;
      const shift = active.offsetWidth - stack.offsetWidth;
      if (!glide) t.style.transition = 'none';
      t.style.transform = `translateX(${shift}px)`;
      if (!glide) {
        void t.offsetWidth;
        t.style.transition = '';
      }
    };
    place(prevWorking.current !== isWorking);
    prevWorking.current = isWorking;
    const ro = new ResizeObserver(() => place(false));
    if (workRef.current) ro.observe(workRef.current);
    if (doneRef.current) ro.observe(doneRef.current);
    return () => ro.disconnect();
  }, [isWorking, label, doneText, fontSize, showTimer]);

  useEffect(() => {
    if (isWorking) {
      setAnnounce(label);
      return;
    }
    setAnnounce(showTimer ? `${doneText} ${spoken(dsRef.current)}` : doneText);
    latest.current.onSettle?.(dsRef.current / 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWorking]);

  const toggle = hasTrace && collapsible;
  const head = (
    <>
      {glyph !== 'none' ? (
        <span ref={glyphRef} className="thought-line__glyph" aria-hidden="true">
          {glyph === 'sparkle' ? (
            <HugeiconsIcon icon={SparklesIcon} size="100%" strokeWidth={2} />
          ) : glyph === 'dot' ? (
            <span className="thought-line__dot" />
          ) : (
            glyph
          )}
        </span>
      ) : null}
      <span ref={stackRef} className="thought-line__label" aria-hidden="true">
        <span ref={workRef} className="thought-line__text" data-active={isWorking ? '' : undefined}>
          <span ref={breathRef} className="thought-line__breath" data-shimmer={sheen ? '' : undefined}>
            {renderLabel ? renderLabel(label, true) : label}
          </span>
        </span>
        <span
          ref={doneRef}
          className="thought-line__text thought-line__text--done"
          data-active={isWorking ? undefined : ''}
        >
          {renderLabel ? renderLabel(doneText, false) : doneText}
        </span>
      </span>
      {showTimer ? (
        <span ref={timerRef} className="thought-line__timer" data-done={isWorking ? undefined : ''} aria-hidden="true">
          0.0s
        </span>
      ) : null}
      {collapsible ? (
        <span className="thought-line__chevron" data-on={hasTrace ? '' : undefined} aria-hidden="true">
          <HugeiconsIcon icon={ArrowDown01Icon} size="1em" strokeWidth={2.2} />
        </span>
      ) : null}
      <span className="thought-line__sr" role="status">
        {announce}
      </span>
    </>
  );

  return (
    <div
      className={`thought-line${className ? ` ${className}` : ''}`}
      data-working={isWorking ? '' : undefined}
      data-open={open && hasTrace ? '' : undefined}
      style={{
        '--tl-font': `${fontSize}px`,
        '--tl-color': color,
        '--tl-glyph': glyphColor || color,
        '--tl-settle': `${settleDuration}ms`,
        '--tl-blur': `${settleBlur}px`,
        '--tl-shimmer': `${shimmerDuration}s`,
        ...style
      }}
    >
      {collapsible ? (
        <button
          type="button"
          className="thought-line__head"
          data-toggle={toggle ? '' : undefined}
          aria-expanded={toggle ? open : undefined}
          tabIndex={toggle ? 0 : -1}
          onClick={() => {
            if (toggle) setOpen(v => !v);
          }}
        >
          {head}
        </button>
      ) : (
        <div className="thought-line__head">{head}</div>
      )}
      {hasTrace ? (
        <div className="thought-line__trace" data-open={open ? '' : undefined} aria-hidden={!open}>
          <div className="thought-line__fold">
            <div className="thought-line__steps">
              {steps.map((text, i) => {
                const done = !isWorking || i < steps.length - 1;
                return (
                  <div key={`${i}-${text}`} className="thought-line__step" data-done={done ? '' : undefined}>
                    <span className="thought-line__mark" aria-hidden="true">
                      {done ? (
                        <HugeiconsIcon icon={Tick02Icon} size="1em" strokeWidth={2.5} />
                      ) : (
                        <i className="thought-line__pulse" />
                      )}
                    </span>
                    <span className="thought-line__step-text">{text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

```

### Component CSS
```css
.thought-line {
  --tl-ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --tl-ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  --tl-font: 16px;
  --tl-color: currentColor;
  --tl-glyph: currentColor;
  --tl-settle: 350ms;
  --tl-blur: 2px;
  --tl-shimmer: 1.8s;
  --tl-done: 0.75;
  --tl-timer: 0.55;

  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  color: var(--tl-color);
  font-family: inherit;
  font-size: var(--tl-font);
  font-weight: 500;
  line-height: 1.2;
}

.thought-line__head {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-align: left;
  white-space: nowrap;
  outline: none;
  cursor: default;
}

.thought-line__head[data-toggle] {
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.thought-line__glyph {
  display: inline-flex;
  flex: none;
  width: 1.1em;
  height: 1.1em;
  margin-right: 0.2em;
  color: var(--tl-glyph);
}

.thought-line__glyph svg {
  display: block;
  width: 100%;
  height: 100%;
}

.thought-line__dot {
  width: 0.5em;
  height: 0.5em;
  margin: auto;
  border-radius: 50%;
  background: currentColor;
}

.thought-line__label {
  display: inline-grid;
}

.thought-line__text {
  grid-area: 1 / 1;
  width: max-content;
  opacity: 0;
  filter: blur(var(--tl-blur));
  transition:
    opacity var(--tl-settle) var(--tl-ease-out),
    filter var(--tl-settle) var(--tl-ease-out);
}

.thought-line__text[data-active] {
  opacity: 1;
  filter: blur(0);
}

.thought-line__text--done[data-active] {
  opacity: var(--tl-done);
}

.thought-line__breath {
  display: inline-block;
}

.thought-line[data-working] .thought-line__breath[data-shimmer] {
  background: linear-gradient(
    100deg,
    color-mix(in srgb, var(--tl-color) 50%, transparent) 30%,
    var(--tl-color) 50%,
    color-mix(in srgb, var(--tl-color) 50%, transparent) 70%
  );
  background-size: 250% 100%;
  background-position: 125% 0;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  animation: thought-line-shimmer var(--tl-shimmer) linear infinite;
}

@keyframes thought-line-shimmer {
  to {
    background-position: -125% 0;
  }
}

.thought-line__timer {
  font-variant-numeric: tabular-nums;
  opacity: var(--tl-timer);
  transition:
    opacity var(--tl-settle) ease,
    transform var(--tl-settle) var(--tl-ease-in-out);
}

.thought-line__timer[data-done] {
  opacity: var(--tl-done);
}

.thought-line__chevron {
  display: inline-flex;
  margin-left: 0.1em;
  opacity: 0;
  transition:
    opacity 200ms ease,
    transform 200ms var(--tl-ease-out);
}

.thought-line__chevron[data-on] {
  opacity: 0.55;
}

.thought-line[data-open] .thought-line__chevron {
  transform: rotate(180deg);
}

.thought-line__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

.thought-line__trace {
  display: grid;
  grid-template-rows: 0fr;
  width: 0;
  min-width: 100%;
  transition: grid-template-rows var(--tl-settle) var(--tl-ease-out);
}

.thought-line__trace[data-open] {
  grid-template-rows: 1fr;
}

.thought-line__fold {
  min-height: 0;
  overflow-x: visible;
  overflow-y: clip;
}

.thought-line__steps {
  display: flex;
  flex-direction: column;
  gap: 0.45em;
  width: max-content;
  padding: 0.6em 0 0.2em 1.6em;
  font-size: 0.875em;
  font-weight: 400;
  white-space: nowrap;
}

.thought-line__step {
  display: flex;
  align-items: center;
  gap: 0.5em;
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 200ms var(--tl-ease-out),
    transform 200ms var(--tl-ease-out);
}

@starting-style {
  .thought-line__step {
    opacity: 0;
    transform: translateY(-4px);
  }
}

.thought-line__mark {
  display: inline-grid;
  flex: none;
  place-items: center;
  width: 1em;
  height: 1em;
  opacity: 0.55;
}

.thought-line__pulse {
  display: block;
  width: 0.4em;
  height: 0.4em;
  border-radius: 50%;
  background: currentColor;
  animation: thought-line-pulse 1.6s var(--tl-ease-in-out) infinite;
}

@keyframes thought-line-pulse {
  0%,
  100% {
    opacity: 0.55;
  }

  50% {
    opacity: 1;
  }
}

.thought-line__step-text {
  transition: opacity var(--tl-settle) ease;
}

.thought-line__step[data-done] .thought-line__step-text {
  opacity: 0.55;
}

@media (prefers-reduced-motion: reduce) {
  .thought-line__text {
    filter: none !important;
    transition: opacity var(--tl-settle) ease;
  }

  .thought-line__timer {
    transition: opacity var(--tl-settle) ease;
  }

  .thought-line__step {
    transform: none !important;
    transition: opacity 200ms ease;
  }

  .thought-line__pulse {
    animation-duration: 2.4s;
  }
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.


## Integrate the <BellToggle /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: BellToggle
### Variant: JavaScript + CSS
### Dependencies: motion @hugeicons/react @hugeicons/core-free-icons

---

### Usage Example
```jsx
import BellToggle from './BellToggle';

<BellToggle
  offLabel="Notify me"
  onLabel="You'll be notified"
  color="#f5f5f5"
  background="#27272a"
  onColor="#18181b"
  onBackground="#f5f5f5"
  size="md"
  radius={22}
  ringAmplitude={17}
  ringPasses={5}
  ringDecay={1}
  ringDuration={820}
  ringPivot={16}
  crossfadeMs={200}
  revealBounce={0}
  count={unread}
  badge
  badgeColor="#ef4444"
  waves
  clapper={false}
  defaultPressed={false}
  onChange={pressed => console.log(pressed)}
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| offLabel | string | "Notify me" | The face at rest. Its width sets how far the pill is clipped. |
| onLabel | string | "You'll be notified" | The face after the yes press. The pill reserves the width of the longer label; only the visible part changes, so neighbours never shift. |
| icon | ReactNode | undefined | Replaces the bell. Adjust ringPivot for a glyph that hangs elsewhere. |
| label | string | undefined | Constant accessible name. Falls back to offLabel. |
| color | string | "#f5f5f5" | Ink at rest: label, bell and hover tint. |
| background | string | "#27272a" | Pill fill at rest. |
| onColor | string | "#18181b" | Ink when pressed. |
| onBackground | string | "#f5f5f5" | Fill when pressed. |
| size | "sm" | "md" | "lg" | "md" | 36, 44 or 52 pixels tall with matching type, icon and padding. |
| radius | number | 22 | Corner radius of the pill and of the clip cap. |
| ringAmplitude | number | 17 | Degrees of the first swing. Every later swing scales from it. |
| ringPasses | number | 5 | Half-swings before rest. 2 is a nod, 9 a peal. |
| ringDecay | number | 1 | How fast the swings die. 1 evenly, 2 the second is already small, 0.5 keeps shaking. |
| ringDuration | number | 820 | Milliseconds for the whole ring. |
| ringPivot | number | 16 | Where the icon hangs from, as a percentage of its height. 16 is the crown, 50 the centre. |
| crossfadeMs | number | 200 | The label and fill crossfade. Also all a keyboard toggle gets. |
| revealBounce | number | 0 | Overshoot of the unfurl. 0 is critically damped; 0.2 lets the cap pass its mark and return. |
| count | number | 0 | Notifications waiting. A rise while on rolls the badge and wobbles the bell. |
| badge | boolean | true | Show the count on the bell while on. |
| badgeColor | string | "#ef4444" | The badge. |
| badgeTextColor | string | "#ffffff" | The count on the badge. |
| waves | boolean | true | Sound waves leave the rim on every swing. |
| clapper | boolean | false | Draw a bell with a clapper that swings a beat behind the body. |
| pressed | boolean | undefined | Controlled state. Outside changes only crossfade. |
| defaultPressed | boolean | false | Initial state when uncontrolled. |
| onChange | (pressed: boolean) => void | - | Called on every toggle. |
| disabled | boolean | false | Dims the pill and ignores input. The state is kept. |
| className | string | "" | Extra classes for the root. |

### Full Component Source
```jsx
'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Notification03Icon } from '@hugeicons/core-free-icons';
import './BellToggle.css';

const SPRING_UI = { type: 'spring', duration: 0.3, bounce: 0 };
const SEG_EASE = 'cubic-bezier(0.77, 0, 0.175, 1)';
const WARP = 0.6;
const SIZES = { sm: [36, 12.5, 14, 15, 8], md: [44, 13.5, 16, 19, 9], lg: [52, 15, 18, 23, 10] };
const WOBBLE = { amplitude: 0.4, passes: 3, duration: 420 };
const BELL_BODY = 'M6 16.5V10a6 6 0 0 1 12 0v6.5l1.6 2.3H4.4L6 16.5z';

const passOffset = (k, passes) => 1 - Math.pow(1 - (k + 2 / 3) / (passes + 1), WARP);
const ringKeyframes = (from, amplitude, passes, decay) => {
  const frames = [{ transform: `rotate(${from}deg)`, offset: 0, easing: SEG_EASE }];
  for (let k = 0; k < passes; k++) {
    const angle = amplitude * Math.pow(1 - k / passes, decay) * (k % 2 ? 1 : -1);
    frames.push({ transform: `rotate(${angle.toFixed(2)}deg)`, offset: passOffset(k, passes), easing: SEG_EASE });
  }
  frames.push({ transform: 'rotate(0deg)', offset: 1 });
  return frames;
};
const liveAngle = el => {
  const tf = getComputedStyle(el).transform;
  if (!tf || tf === 'none') return 0;
  const m = new DOMMatrix(tf);
  return (Math.atan2(m.b, m.a) * 180) / Math.PI;
};

export default function BellToggle({
  offLabel = 'Notify me',
  onLabel = "You'll be notified",
  icon,
  label,
  color = '#f5f5f5',
  background = '#27272a',
  onColor = '#18181b',
  onBackground = '#f5f5f5',
  size = 'md',
  radius = 22,
  ringAmplitude = 17,
  ringPasses = 5,
  ringDecay = 1,
  ringDuration = 820,
  ringPivot = 16,
  crossfadeMs = 200,
  revealBounce = 0,
  count = 0,
  badge = true,
  badgeColor = '#ef4444',
  badgeTextColor = '#ffffff',
  waves = true,
  clapper = false,
  pressed,
  defaultPressed = false,
  onChange,
  disabled = false,
  className = ''
}) {
  const [inner, setInner] = useState(defaultPressed);
  const on = pressed ?? inner;
  const reduce = useReducedMotion();
  const rootRef = useRef(null);
  const glyphRef = useRef(null);
  const clapperRef = useRef(null);
  const waveLeft = useRef(null);
  const waveRight = useRef(null);
  const offRef = useRef(null);
  const onRef = useRef(null);
  const lastInput = useRef('pointer');
  const pending = useRef(null);
  const spring = useRef(null);
  const prevCount = useRef(count);
  const [h, fs, iconSize, px, gap] = SIZES[size] ?? SIZES.md;

  const t = useMotionValue(on ? 1 : 0);
  const wOff = useMotionValue(0);
  const wOn = useMotionValue(0);
  const clip = useTransform([t, wOff, wOn], ([v, a, b]) => `${Math.max(a, b) - (a + (b - a) * v)}px`);

  useLayoutEffect(() => {
    const measure = () => {
      if (offRef.current) wOff.set(offRef.current.offsetWidth);
      if (onRef.current) wOn.set(onRef.current.offsetWidth);
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (offRef.current) observer.observe(offRef.current);
    if (onRef.current) observer.observe(onRef.current);
    document.fonts?.ready.then(measure);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offLabel, onLabel, size]);

  const swing = (amplitude, passes, duration) => {
    const el = glyphRef.current;
    if (!el) return;
    el.getAnimations().forEach(a => a.cancel());
    el.animate(ringKeyframes(liveAngle(el), amplitude, passes, ringDecay), { duration, easing: 'linear' });
    const c = clapperRef.current;
    if (c) {
      c.getAnimations().forEach(a => a.cancel());
      c.animate(ringKeyframes(liveAngle(c), amplitude * 1.6, passes, ringDecay), {
        duration,
        delay: 70,
        easing: 'linear'
      });
    }
    if (!waves) return;
    for (let k = 0; k < passes; k++) {
      const side = k % 2 ? waveRight.current : waveLeft.current;
      if (!side) continue;
      const strength = Math.pow(1 - k / passes, ringDecay);
      side.animate(
        [
          { opacity: 0, transform: 'scale(0.55)' },
          { opacity: 0.9 * strength, offset: 0.3 },
          { opacity: 0, transform: 'scale(1.25)' }
        ],
        { duration: 380, delay: passOffset(k, passes) * duration, easing: 'ease-out' }
      );
    }
  };

  useLayoutEffect(() => {
    const pointer = pending.current === 'pointer' && !reduce;
    pending.current = null;
    spring.current?.stop();
    if (pointer) spring.current = animate(t, on ? 1 : 0, { ...SPRING_UI, bounce: revealBounce });
    else t.jump(on ? 1 : 0);
    if (on && pointer) swing(ringAmplitude, ringPasses, ringDuration);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on]);
  useLayoutEffect(() => () => spring.current?.stop(), []);

  useEffect(() => {
    const was = prevCount.current;
    prevCount.current = count;
    if (count > was && on && !reduce) swing(ringAmplitude * WOBBLE.amplitude, WOBBLE.passes, WOBBLE.duration);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const toggle = () => {
    pending.current = lastInput.current;
    if (pressed === undefined) setInner(!on);
    onChange?.(!on);
  };
  const press = e => {
    lastInput.current = 'pointer';
    if (e.button === 0 && !disabled && rootRef.current) rootRef.current.dataset.pressed = '';
  };
  const release = () => {
    if (rootRef.current) delete rootRef.current.dataset.pressed;
  };
  const key = e => {
    if (e.key === 'Enter' || e.key === ' ') lastInput.current = 'keyboard';
  };

  const showBadge = badge && on && count > 0;

  return (
    <motion.span
      ref={rootRef}
      className={`bell-toggle${className ? ` ${className}` : ''}`}
      data-on={on ? 'true' : 'false'}
      data-disabled={disabled ? '' : undefined}
      style={{
        '--bt-clip': clip,
        '--bt-color': color,
        '--bt-bg': background,
        '--bt-on-color': onColor,
        '--bt-on-bg': onBackground,
        '--bt-badge': badgeColor,
        '--bt-badge-ink': badgeTextColor,
        '--bt-radius': `${radius}px`,
        '--bt-fade': `${crossfadeMs}ms`,
        '--bt-pivot': `${ringPivot}%`,
        '--bt-h': `${h}px`,
        '--bt-fs': `${fs}px`,
        '--bt-icon': `${iconSize}px`,
        '--bt-px': `${px}px`,
        '--bt-gap': `${gap}px`
      }}
    >
      <button
        type="button"
        className="bell-toggle__button"
        aria-pressed={on}
        aria-label={label ?? offLabel}
        disabled={disabled}
        onPointerDown={press}
        onPointerUp={release}
        onPointerCancel={release}
        onPointerLeave={release}
        onKeyDown={key}
        onClick={toggle}
      >
        <span className="bell-toggle__bell" aria-hidden="true">
          <span ref={glyphRef} className="bell-toggle__glyph">
            {clapper ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={BELL_BODY} />
                <path d="M12 2.5V4" />
              </svg>
            ) : (
              (icon ?? <HugeiconsIcon icon={Notification03Icon} size={iconSize} strokeWidth={2} />)
            )}
          </span>
          {clapper ? (
            <span ref={clapperRef} className="bell-toggle__clapper">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="20.4" r="1.7" fill="currentColor" />
              </svg>
            </span>
          ) : null}
          {waves ? (
            <>
              <svg ref={waveLeft} className="bell-toggle__wave bell-toggle__wave--left" viewBox="0 0 14 14">
                <path d="M14 8a6 6 0 0 0-6 6" />
                <path d="M14 4A10 10 0 0 0 4 14" />
              </svg>
              <svg ref={waveRight} className="bell-toggle__wave bell-toggle__wave--right" viewBox="0 0 14 14">
                <path d="M0 8a6 6 0 0 1 6 6" />
                <path d="M0 4a10 10 0 0 1 10 10" />
              </svg>
            </>
          ) : null}
          {badge ? (
            <span className="bell-toggle__badge" data-show={showBadge ? '' : undefined}>
              <span key={count} className="bell-toggle__digit">
                {count > 9 ? '9+' : count}
              </span>
            </span>
          ) : null}
        </span>
        <span className="bell-toggle__say" aria-hidden="true">
          <span ref={offRef} className="bell-toggle__face bell-toggle__face--off">
            {offLabel}
          </span>
          <span ref={onRef} className="bell-toggle__face bell-toggle__face--on">
            {onLabel}
          </span>
        </span>
      </button>
    </motion.span>
  );
}

```

### Component CSS
```css
.bell-toggle {
  --bt-clip: 0px;
  --bt-color: #f5f5f5;
  --bt-bg: #27272a;
  --bt-on-color: #18181b;
  --bt-on-bg: #f5f5f5;
  --bt-badge: #ef4444;
  --bt-badge-ink: #ffffff;
  --bt-radius: 22px;
  --bt-fade: 200ms;
  --bt-pivot: 16%;
  --bt-h: 44px;
  --bt-fs: 13.5px;
  --bt-icon: 16px;
  --bt-px: 19px;
  --bt-gap: 9px;
  --bt-press: 0.97;
  --bt-ease-out: cubic-bezier(0.23, 1, 0.32, 1);

  position: relative;
  display: inline-grid;
  grid-template-columns: max-content;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  transition: transform 160ms var(--bt-ease-out);
}

.bell-toggle[data-pressed] {
  transform: scale(var(--bt-press));
}

.bell-toggle[data-disabled] {
  opacity: 0.55;
}

.bell-toggle[data-disabled][data-pressed] {
  transform: none;
}

.bell-toggle__button {
  grid-area: 1 / 1;
  display: inline-flex;
  align-items: center;
  gap: var(--bt-gap);
  height: var(--bt-h);
  margin: 0;
  padding: 0 var(--bt-px);
  border: 0;
  border-radius: var(--bt-radius);
  background: var(--bt-bg);
  color: var(--bt-color);
  font: inherit;
  font-size: var(--bt-fs);
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0.01em;
  white-space: nowrap;
  cursor: pointer;
  outline: none;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  clip-path: inset(0 var(--bt-clip) 0 0 round var(--bt-radius));
  transition:
    background-color var(--bt-fade) ease,
    color var(--bt-fade) ease;
}

.bell-toggle__button:disabled {
  cursor: default;
}

.bell-toggle[data-on='true'] .bell-toggle__button {
  background: var(--bt-on-bg);
  color: var(--bt-on-color);
}

@media (hover: hover) and (pointer: fine) {
  .bell-toggle__button:enabled:hover {
    background: color-mix(in srgb, var(--bt-color) 6%, var(--bt-bg));
  }

  .bell-toggle[data-on='true'] .bell-toggle__button:enabled:hover {
    background: color-mix(in srgb, var(--bt-on-color) 6%, var(--bt-on-bg));
  }
}

.bell-toggle__bell {
  position: relative;
  display: inline-grid;
  flex: none;
  width: var(--bt-icon);
  height: var(--bt-icon);
}

.bell-toggle__glyph {
  display: inline-grid;
  place-items: center;
  grid-area: 1 / 1;
  width: var(--bt-icon);
  height: var(--bt-icon);
  transform-origin: 50% var(--bt-pivot);
}

.bell-toggle__glyph svg {
  width: 100%;
  height: 100%;
}

.bell-toggle__clapper {
  position: absolute;
  inset: 0;
  transform-origin: 50% var(--bt-pivot);
  pointer-events: none;
}

.bell-toggle__clapper svg {
  display: block;
  width: 100%;
  height: 100%;
}

.bell-toggle__wave {
  position: absolute;
  top: -3px;
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  opacity: 0;
  pointer-events: none;
}

.bell-toggle__wave--left {
  right: calc(100% - 2px);
  transform-origin: 100% 100%;
}

.bell-toggle__wave--right {
  left: calc(100% - 2px);
  transform-origin: 0% 100%;
}

.bell-toggle__badge {
  position: absolute;
  top: -6px;
  right: -7px;
  display: grid;
  place-items: center;
  min-width: 14px;
  height: 14px;
  padding: 0 3px;
  box-sizing: border-box;
  border-radius: 7px;
  background: var(--bt-badge);
  color: var(--bt-badge-ink);
  font-size: 9.5px;
  font-weight: 600;
  line-height: 1;
  opacity: 0;
  transform: translateY(5px) scale(0.6);
  pointer-events: none;
  transition:
    transform 180ms var(--bt-ease-out),
    opacity 140ms ease;
}

.bell-toggle__badge[data-show] {
  opacity: 1;
  transform: translateY(0) scale(1);
  transition:
    transform 280ms cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 120ms ease;
}

.bell-toggle__digit {
  display: block;
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 200ms ease,
    transform 200ms var(--bt-ease-out);
}

@starting-style {
  .bell-toggle__digit {
    opacity: 0;
    transform: translateY(5px);
  }
}

.bell-toggle__say {
  display: inline-grid;
  grid-template-columns: max-content;
  height: 18px;
  line-height: 18px;
}

.bell-toggle__face {
  grid-area: 1 / 1;
  justify-self: start;
  opacity: 0;
  filter: blur(2px);
  transition:
    opacity var(--bt-fade) ease,
    filter var(--bt-fade) ease;
}

.bell-toggle[data-on='false'] .bell-toggle__face--off,
.bell-toggle[data-on='true'] .bell-toggle__face--on {
  opacity: 1;
  filter: blur(0);
}

@media (prefers-reduced-motion: reduce) {
  .bell-toggle[data-pressed] {
    transform: none;
  }

  .bell-toggle__face {
    filter: none !important;
    transition: opacity var(--bt-fade) ease;
  }

  .bell-toggle__badge,
  .bell-toggle__badge[data-show] {
    transition: opacity 140ms ease;
    transform: none;
  }

  .bell-toggle__digit {
    transition: opacity 200ms ease;
    transform: none;
  }
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.


## Integrate the <CallChip /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: CallChip
### Variant: JavaScript + CSS
### Dependencies: @hugeicons/react @hugeicons/core-free-icons

---

### Usage Example
```jsx
import CallChip from './CallChip';

<CallChip
  icon="terminal"
  name="bash"
  argument="npm test"
  status="done"
  expectedMs={2500}
  size={34}
  radius={10}
  color="currentColor"
  surfaceColor="#27272a"
  progressColor="currentColor"
  progressOpacity={0.08}
  doneColor="#22c55e"
  errorColor="#ef4444"
  washOpacity={0.14}
  shake={6}
  showTimer
  onRetry={() => rerun(call.id)}
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| icon | "terminal" | "file" | "search" | "edit" | ReactNode | "terminal" | The tool glyph. It rolls out when the call resolves. |
| name | string | "bash" | The tool name. |
| argument | string | "npm test" | The argument. |
| status | "idle" | "running" | "done" | "error" | "running" | Running wipes the fill across and ticks the counter. Done completes it with a wash. Error stops it, tints and shakes. |
| expectedMs | number | 2500 | Milliseconds the fill takes to reach its 90% park, the time you expect the call to take. |
| size | number | 34 | Chip height in pixels. Font, padding and glyph follow. |
| radius | number | 10 | Corner radius in pixels. Half the height is a pill. |
| color | string | "currentColor" | Ink for the text and the tool glyph. |
| surfaceColor | string | "#27272a" | The chip surface. |
| progressColor | string | "currentColor" | The fill that wipes across while running. |
| progressOpacity | number | 0.08 | How strong that fill is. |
| doneColor | string | "#22c55e" | The success wash and the check. |
| errorColor | string | "#ef4444" | The stopped fill and the retry glyph on error. |
| washOpacity | number | 0.14 | Strength of the success wash and of the error tint. |
| shake | number | 6 | Error shake amplitude in pixels. 0 tints only. |
| showTimer | boolean | true | Shows the millisecond counter. |
| onRetry | () => void | - | When set, the failed chip becomes a retry button. |
| className | string | "" | Extra classes for the root. |
| style | CSSProperties | undefined | Inline styles merged onto the root. |

### Full Component Source
```jsx
'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  CommandLineIcon,
  File02Icon,
  PencilEdit01Icon,
  RefreshIcon,
  Search01Icon,
  Tick02Icon
} from '@hugeicons/core-free-icons';

import './CallChip.css';

const HOLD_AT = 0.9;
const SHAKE = [0, -1, 1, -0.66, 0.66, -0.33, 0];
const ICONS = { terminal: CommandLineIcon, file: File02Icon, search: Search01Icon, edit: PencilEdit01Icon };
const WORDS = { running: 'running', done: 'done', error: 'failed', idle: 'queued' };

const fmt = ms => (ms < 10000 ? `${Math.round(ms)} ms` : `${(ms / 1000).toFixed(1)} s`);
const reduceMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
const glyphOf = s => (s === 'done' ? 'check' : s === 'error' ? 'retry' : 'tool');

export default function CallChip({
  icon = 'terminal',
  name = 'bash',
  argument = 'npm test',
  status = 'running',
  expectedMs = 2500,
  size = 34,
  radius = 10,
  color = 'currentColor',
  surfaceColor = '#27272a',
  progressColor = 'currentColor',
  progressOpacity = 0.08,
  doneColor = '#22c55e',
  errorColor = '#ef4444',
  washOpacity = 0.14,
  shake = 6,
  showTimer = true,
  onRetry,
  className = '',
  style
}) {
  const rootRef = useRef(null);
  const fillRef = useRef(null);
  const timerRef = useRef(null);
  const mountedRef = useRef(false);
  const fraction = useRef(0);
  const clock = useRef({ ms: 0 });
  const shakeAnim = useRef(null);
  const statusRef = useRef(status);
  statusRef.current = status;
  const [mounted, setMounted] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [announce, setAnnounce] = useState('');
  const roll = useRef({ cur: glyphOf(status), prev: null });
  if (glyphOf(status) !== roll.current.cur) roll.current = { cur: glyphOf(status), prev: roll.current.cur };

  const setFraction = (f, instant) => {
    const fill = fillRef.current;
    if (!fill) return;
    fraction.current = f;
    if (instant) fill.style.transition = 'none';
    fill.style.transform = `scaleX(${f})`;
    if (instant) {
      void fill.getBoundingClientRect();
      fill.style.transition = '';
    }
  };
  const apply = (s, animate) => {
    if (s === 'running') {
      shakeAnim.current?.cancel();
      setFraction(0, true);
      if (animate) setFraction(HOLD_AT, false);
    } else if (s === 'done') {
      setFraction(1, !animate);
    } else if (s === 'error') {
      const fill = fillRef.current;
      const live = fill ? new DOMMatrix(getComputedStyle(fill).transform).a : fraction.current;
      setFraction(Math.min(1, Math.max(0, live)), true);
      if (animate && shake > 0 && !reduceMotion() && rootRef.current) {
        shakeAnim.current = rootRef.current.animate(
          SHAKE.map(k => ({ transform: `translateX(${k * shake}px)`, easing: 'cubic-bezier(0.77, 0, 0.175, 1)' })),
          { duration: 450, composite: 'add' }
        );
      }
    } else setFraction(0, true);
  };

  useEffect(() => {
    mountedRef.current = true;
    setMounted(true);
    apply(statusRef.current, statusRef.current === 'running');
    return () => {
      mountedRef.current = false;
      shakeAnim.current?.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useLayoutEffect(() => {
    if (mountedRef.current) apply(status, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    const write = ms => {
      clock.current.ms = ms;
      if (timerRef.current) timerRef.current.textContent = fmt(ms);
    };
    if (status !== 'running') {
      if ((status === 'idle' || !clock.current.ms) && timerRef.current) timerRef.current.textContent = '—';
      return undefined;
    }
    const startedAt = performance.now();
    write(0);
    if (reduceMotion()) {
      const id = setInterval(() => write(performance.now() - startedAt), 100);
      return () => {
        clearInterval(id);
        write(performance.now() - startedAt);
      };
    }
    let raf = 0;
    const tick = () => {
      write(performance.now() - startedAt);
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      write(performance.now() - startedAt);
    };
  }, [status]);
  useEffect(() => {
    const ms = showTimer && clock.current.ms ? Math.round(clock.current.ms) : 0;
    const when = status === 'done' && ms ? ` in ${ms} ms` : status === 'error' && ms ? ` after ${ms} ms` : '';
    setAnnounce(`${name} ${argument}, ${WORDS[status] ?? status}${when}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const font = Math.max(11, Math.round(size * 0.38));
  const glyphState = g => (g === roll.current.cur ? 'in' : g === roll.current.prev ? 'out' : undefined);
  const toolIcon = typeof icon === 'string' ? (ICONS[icon] ?? ICONS.terminal) : null;
  const iconSize = font + 2;

  return (
    <span
      ref={rootRef}
      role="status"
      aria-busy={status === 'running' || undefined}
      data-status={status}
      data-mounted={mounted ? '' : undefined}
      data-pressed={pressed ? '' : undefined}
      className={`call-chip${className ? ` ${className}` : ''}`}
      style={{
        '--cc-size': `${size}px`,
        '--cc-font': `${font}px`,
        '--cc-pad': `${Math.round(size * 0.35)}px`,
        '--cc-gap': `${Math.round(font * 0.55)}px`,
        '--cc-radius': `${radius}px`,
        '--cc-color': color,
        '--cc-surface': surfaceColor,
        '--cc-progress': progressColor,
        '--cc-progress-pct': `${progressOpacity * 100}%`,
        '--cc-done': doneColor,
        '--cc-error': errorColor,
        '--cc-wash-pct': `${washOpacity * 100}%`,
        '--cc-expected': `${expectedMs}ms`,
        ...style
      }}
    >
      <span ref={fillRef} className="call-chip__fill" aria-hidden="true" />
      <span className="call-chip__slot" aria-hidden="true">
        <span className="call-chip__glyph" data-state={glyphState('tool')}>
          {toolIcon ? <HugeiconsIcon icon={toolIcon} size={iconSize} strokeWidth={1.8} /> : icon}
        </span>
        <span className="call-chip__glyph" data-state={glyphState('check')}>
          <HugeiconsIcon icon={Tick02Icon} size={iconSize} strokeWidth={2.2} />
        </span>
        <span className="call-chip__glyph" data-state={glyphState('retry')}>
          <HugeiconsIcon icon={RefreshIcon} size={iconSize} strokeWidth={2} />
        </span>
      </span>
      <span className="call-chip__name" aria-hidden="true">
        {name}
      </span>
      <span className="call-chip__arg" aria-hidden="true">
        {argument}
      </span>
      {showTimer ? (
        <span ref={timerRef} className="call-chip__timer" aria-hidden="true">
          0 ms
        </span>
      ) : null}
      {status === 'error' && onRetry ? (
        <button
          type="button"
          className="call-chip__retry"
          aria-label={`Retry ${name} ${argument}`}
          onClick={() => onRetry()}
          onPointerDown={() => setPressed(true)}
          onPointerUp={() => setPressed(false)}
          onPointerCancel={() => setPressed(false)}
        />
      ) : null}
      <span className="call-chip__sr">{announce}</span>
    </span>
  );
}

```

### Component CSS
```css
.call-chip {
  --cc-size: 34px;
  --cc-font: 13px;
  --cc-pad: 12px;
  --cc-gap: 7px;
  --cc-radius: 10px;
  --cc-color: currentColor;
  --cc-surface: #27272a;
  --cc-progress: currentColor;
  --cc-progress-pct: 8%;
  --cc-done: #22c55e;
  --cc-error: #ef4444;
  --cc-wash-pct: 14%;
  --cc-expected: 2500ms;
  --cc-ease-out: cubic-bezier(0.23, 1, 0.32, 1);

  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--cc-gap);
  box-sizing: border-box;
  height: var(--cc-size);
  padding: 0 var(--cc-pad);
  border-radius: var(--cc-radius);
  overflow: hidden;
  background: var(--cc-surface);
  color: var(--cc-color);
  font-size: var(--cc-font);
  line-height: 1;
  white-space: nowrap;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  transition: transform 160ms var(--cc-ease-out);
}

.call-chip[data-status='error'] {
  cursor: pointer;
}

.call-chip[data-pressed] {
  transform: scale(0.97);
}

.call-chip__fill {
  position: absolute;
  inset: 0;
  background: color-mix(in srgb, var(--cc-progress) var(--cc-progress-pct), transparent);
  transform: scaleX(0);
  transform-origin: left center;
  clip-path: inset(0 0 0 0);
  pointer-events: none;
}

.call-chip[data-status='running'] .call-chip__fill {
  transition: transform var(--cc-expected) linear;
}

.call-chip[data-status='done'] .call-chip__fill {
  background: color-mix(in srgb, var(--cc-done) var(--cc-wash-pct), transparent);
  clip-path: inset(100% 0 0 0);
  transition:
    transform 200ms var(--cc-ease-out),
    background-color 120ms ease,
    clip-path 400ms var(--cc-ease-out) 200ms;
}

.call-chip[data-status='error'] .call-chip__fill {
  background: color-mix(in srgb, var(--cc-error) var(--cc-wash-pct), transparent);
  transition: background-color 200ms ease;
}

.call-chip:not([data-mounted]) .call-chip__fill,
.call-chip:not([data-mounted]) .call-chip__glyph {
  transition: none !important;
}

.call-chip__slot {
  position: relative;
  flex: none;
  width: calc(var(--cc-font) + 2px);
  height: calc(var(--cc-font) + 2px);
  overflow: hidden;
}

.call-chip__glyph {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  opacity: 0;
  transform: translateY(70%);
  filter: blur(3px);
}

.call-chip__glyph[data-state='in'] {
  opacity: 1;
  transform: none;
  filter: blur(0);
  transition:
    opacity 240ms var(--cc-ease-out),
    transform 240ms var(--cc-ease-out),
    filter 240ms var(--cc-ease-out);
}

.call-chip__glyph[data-state='out'] {
  transform: translateY(-70%);
  transition:
    opacity 160ms var(--cc-ease-out),
    transform 160ms var(--cc-ease-out),
    filter 160ms var(--cc-ease-out);
}

.call-chip[data-status='done'] .call-chip__glyph[data-state='in'] {
  color: var(--cc-done);
}

.call-chip[data-status='error'] .call-chip__glyph[data-state='in'] {
  color: var(--cc-error);
}

.call-chip__name,
.call-chip__arg,
.call-chip__timer {
  position: relative;
}

.call-chip__name {
  font-weight: 500;
}

.call-chip__arg {
  opacity: 0.72;
}

.call-chip__timer {
  min-width: 6ch;
  font-variant-numeric: tabular-nums;
  text-align: right;
  opacity: 0.5;
}

.call-chip__retry {
  position: absolute;
  inset: -5px;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: var(--cc-radius);
  background: transparent;
  appearance: none;
  cursor: pointer;
  outline: none;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.call-chip__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .call-chip[data-status='done'] .call-chip__fill {
    clip-path: inset(0 0 0 0);
    transition: background-color 120ms ease;
  }

  .call-chip__glyph {
    transform: none !important;
    filter: none !important;
  }

  .call-chip[data-pressed] {
    transform: none;
  }
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.


## Integrate the <StatusMark /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: StatusMark
### Variant: JavaScript + CSS
### Dependencies: motion

---

### Usage Example
```jsx
import StatusMark from './StatusMark';

<StatusMark
  status="running"
  progress={0.62}
  label="Draft supplier emails"
  color="currentColor"
  doneColor="#22c55e"
  errorColor="#ef4444"
  size={20}
  strokeWidth={2}
  dashes={8}
  fontSize={14}
  spinDuration={1100}
  arcLength={0.68}
  drawDuration={240}
  fillOpacity={0.06}
  strike
  strikeDelay={60}
/>

<StatusMark status="done" size={16} />
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| status | "pending" | "running" | "done" | "failed" | "cancelled" | "pending" | The lifecycle state. Every change morphs the glyph in place. |
| progress | number | undefined | 0 to 1 while running. Leave it out for an indeterminate spinning arc. |
| label | ReactNode | undefined | Text beside the glyph. It dims and gets struck. |
| color | string | "currentColor" | Ring, arc, cancelled cross and label. |
| doneColor | string | "#22c55e" | Ring, wash and check when done. |
| errorColor | string | "#ef4444" | Ring, wash and cross when failed. |
| size | number | 20 | Glyph size in pixels. The label gap is half of it. |
| strokeWidth | number | 2 | Stroke width in the 24-unit box. The ring shrinks to keep its margin. |
| dashes | number | 8 | Dashes in the idle ring, the ones that fuse into the arc. |
| fontSize | number | 14 | Label size in pixels. The strike scales with it. |
| spinDuration | number | 1100 | Milliseconds per turn of the indeterminate arc. |
| arcLength | number | 0.68 | Share of the ring the indeterminate arc covers. |
| drawDuration | number | 240 | Milliseconds the check or cross takes to draw. |
| fillOpacity | number | 0.06 | The wash inside a finished ring. |
| strike | boolean | true | Strikes the label through when done. |
| strikeDelay | number | 60 | Milliseconds after the check starts before the strike wipes in. |
| className | string | "" | Extra classes for the root. |
| style | CSSProperties | undefined | Inline styles merged onto the root. |

### Full Component Source
```jsx
'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { animate, useMotionValue, useReducedMotion } from 'motion/react';

import './StatusMark.css';

const UI = { type: 'spring', duration: 0.3, bounce: 0 };
const MORPH = { duration: 0.3, ease: [0.77, 0, 0.175, 1] };
const CHECK = 'M7.5 12.25 10.5 15.25 16.75 8.75';
const CROSS = 'M8.5 8.5 15.5 15.5M15.5 8.5 8.5 15.5';
const TEXT = {
  pending: 'Pending',
  running: 'In progress',
  done: 'Completed',
  failed: 'Failed',
  cancelled: 'Cancelled'
};
const IDLE_DASH = 0.3;

const clamp01 = v => Math.min(1, Math.max(0, v));

export default function StatusMark({
  status = 'pending',
  progress,
  label,
  color = 'currentColor',
  doneColor = '#22c55e',
  errorColor = '#ef4444',
  size = 20,
  strokeWidth = 2,
  dashes = 8,
  fontSize = 14,
  spinDuration = 1100,
  arcLength = 0.68,
  drawDuration = 240,
  fillOpacity = 0.06,
  strike = true,
  strikeDelay = 60,
  className = '',
  style
}) {
  const reduce = useReducedMotion();
  const r = 10 - strokeWidth / 2;
  const C = 2 * Math.PI * r;
  const P = C / Math.max(1, dashes);
  const determinate = status === 'running' && Number.isFinite(progress);
  const indeterminate = status === 'running' && !determinate;
  const solid = status === 'running' || status === 'done' || status === 'failed';
  const targetArc = indeterminate ? arcLength : determinate ? clamp01(progress) : 1;

  const mode = useMotionValue(solid ? 1 : 0);
  const arc = useMotionValue(targetArc);
  const travel = useMotionValue(0);
  const ringRef = useRef(null);
  const geo = useRef({ C, P });
  geo.current = { C, P };
  const gen = useRef(0);

  const writeDash = () => {
    const g = geo.current;
    const m = mode.get();
    const a = arc.get();
    const dash = IDLE_DASH * g.P + (a * g.C - IDLE_DASH * g.P) * m;
    const gap = (1 - IDLE_DASH) * g.P + ((1 - a) * g.C - (1 - IDLE_DASH) * g.P) * m;
    ringRef.current?.setAttribute('stroke-dasharray', `${Math.max(0, dash)} ${Math.max(0, gap)}`);
  };
  useLayoutEffect(() => {
    writeDash();
    ringRef.current?.setAttribute('stroke-dashoffset', String(travel.get()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [C, P]);
  useEffect(() => {
    const offs = [
      mode.on('change', writeDash),
      arc.on('change', writeDash),
      travel.on('change', v => ringRef.current?.setAttribute('stroke-dashoffset', String(v)))
    ];
    return () => {
      offs.forEach(off => off());
      mode.stop();
      arc.stop();
      travel.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const g = ++gen.current;
    if (reduce) {
      mode.jump(solid ? 1 : 0);
      arc.jump(targetArc);
      travel.jump(0);
      return;
    }
    if (mode.get() === 0) arc.jump(targetArc);
    animate(mode, solid ? 1 : 0, MORPH);
    animate(arc, targetArc, UI);
    if (indeterminate) {
      const t0 = travel.get();
      animate(travel, [t0, t0 - C], { duration: spinDuration / 1000, ease: 'linear', repeat: Infinity });
      return;
    }
    const unit = determinate ? C : P;
    const to = Math.floor(travel.get() / unit) * unit;
    animate(travel, to, UI).then(() => {
      if (gen.current === g) travel.jump(0);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, determinate, targetArc, reduce, C, P, spinDuration]);

  const spoken = TEXT[status] + (determinate ? `, ${Math.round(clamp01(progress) * 100)}%` : '');
  const hasLabel = label !== undefined && label !== null;

  return (
    <span
      className={`status-mark${className ? ` ${className}` : ''}`}
      data-status={status}
      data-indeterminate={indeterminate ? '' : undefined}
      data-strike={strike ? '' : undefined}
      style={{
        '--sm-size': `${size}px`,
        '--sm-stroke': strokeWidth,
        '--sm-color': color,
        '--sm-done': doneColor,
        '--sm-error': errorColor,
        '--sm-fill': fillOpacity,
        '--sm-font': `${fontSize}px`,
        '--sm-draw': `${drawDuration}ms`,
        '--sm-strike-delay': `${120 + strikeDelay}ms`,
        ...style
      }}
    >
      <svg
        className="status-mark__glyph"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        role={hasLabel ? undefined : 'img'}
        aria-label={hasLabel ? undefined : spoken}
        aria-hidden={hasLabel || undefined}
      >
        <circle className="status-mark__track" cx="12" cy="12" r={r} transform="rotate(-90 12 12)" />
        <circle ref={ringRef} className="status-mark__ring" cx="12" cy="12" r={r} transform="rotate(-90 12 12)" />
        <path className="status-mark__check" d={CHECK} pathLength="1" />
        <path className="status-mark__cross" d={CROSS} pathLength="1" />
      </svg>
      {hasLabel ? <span className="status-mark__sr">{spoken}: </span> : null}
      {hasLabel ? (
        <span className="status-mark__label">
          {label}
          <span className="status-mark__strike" aria-hidden="true" />
        </span>
      ) : null}
    </span>
  );
}

```

### Component CSS
```css
.status-mark {
  --sm-size: 20px;
  --sm-stroke: 2;
  --sm-color: currentColor;
  --sm-done: #22c55e;
  --sm-error: #ef4444;
  --sm-fill: 0.06;
  --sm-font: 14px;
  --sm-draw: 240ms;
  --sm-strike-delay: 180ms;
  --sm-muted: 0.55;
  --sm-check-delay: 120ms;
  --sm-label-o: 0.65;
  --sm-ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --sm-ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);

  position: relative;
  display: inline-flex;
  align-items: center;
  gap: calc(var(--sm-size) * 0.5);
  vertical-align: middle;
  line-height: 1;
}

.status-mark__glyph {
  flex: none;
  overflow: visible;
  color: var(--sm-color);
  transition: color 200ms ease;
}

.status-mark[data-status='done'] .status-mark__glyph {
  color: var(--sm-done);
}

.status-mark[data-status='failed'] .status-mark__glyph {
  color: var(--sm-error);
}

.status-mark__track {
  fill: currentColor;
  stroke: currentColor;
  stroke-width: var(--sm-stroke);
  fill-opacity: 0;
  stroke-opacity: 0;
  transition:
    fill-opacity 180ms ease,
    stroke-opacity 200ms ease;
}

.status-mark[data-status='running'] .status-mark__track {
  stroke-opacity: 0.2;
}

.status-mark[data-status='done'] .status-mark__track,
.status-mark[data-status='failed'] .status-mark__track {
  fill-opacity: var(--sm-fill);
}

.status-mark__ring {
  fill: none;
  stroke: currentColor;
  stroke-width: var(--sm-stroke);
  stroke-linecap: round;
  opacity: var(--sm-muted);
  transition: opacity 200ms ease;
}

.status-mark[data-status='running'] .status-mark__ring,
.status-mark[data-status='done'] .status-mark__ring,
.status-mark[data-status='failed'] .status-mark__ring {
  opacity: 1;
}

.status-mark__check,
.status-mark__cross {
  fill: none;
  stroke: currentColor;
  stroke-width: var(--sm-stroke);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 1 2;
  stroke-dashoffset: 1.05;
  opacity: 0;
  transition:
    stroke-dashoffset 160ms var(--sm-ease-out),
    opacity 0ms linear 160ms;
}

.status-mark[data-status='done'] .status-mark__check,
.status-mark[data-status='failed'] .status-mark__cross,
.status-mark[data-status='cancelled'] .status-mark__cross {
  stroke-dashoffset: 0;
  opacity: 1;
  transition:
    stroke-dashoffset var(--sm-draw) var(--sm-ease-out) var(--sm-check-delay),
    opacity 0ms linear var(--sm-check-delay);
}

.status-mark__label {
  position: relative;
  color: var(--sm-color);
  font-size: var(--sm-font);
  line-height: 1.25;
  opacity: var(--sm-label-o);
  transition: opacity 200ms ease;
}

.status-mark[data-status='running'] {
  --sm-label-o: 1;
}

.status-mark[data-status='done'] {
  --sm-label-o: 0.6;
}

.status-mark[data-status='failed'] {
  --sm-label-o: 1;
}

.status-mark[data-status='cancelled'] {
  --sm-label-o: 0.55;
}

.status-mark__strike {
  position: absolute;
  top: 50%;
  right: 0;
  left: 0;
  height: max(1px, calc(var(--sm-font) / 14));
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left center;
  translate: 0 -50%;
  pointer-events: none;
  transition: transform 160ms var(--sm-ease-out);
}

.status-mark[data-status='done'][data-strike] .status-mark__strike {
  transform: scaleX(1);
  transition: transform 280ms var(--sm-ease-out) var(--sm-strike-delay);
}

.status-mark__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

@keyframes sm-breathe {
  50% {
    opacity: 0.45;
  }
}

@media (prefers-reduced-motion: reduce) {
  .status-mark[data-indeterminate] .status-mark__ring {
    animation: sm-breathe 1400ms var(--sm-ease-in-out) infinite;
  }

  .status-mark__check,
  .status-mark__cross {
    stroke-dashoffset: 0;
    transition: opacity 200ms ease;
  }

  .status-mark__strike {
    opacity: 0;
    transform: scaleX(1) !important;
    transition: opacity 200ms ease;
  }

  .status-mark[data-status='done'][data-strike] .status-mark__strike {
    opacity: 1;
  }
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.


## Integrate the <GlideSelect /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: GlideSelect
### Variant: JavaScript + CSS
### Dependencies: @hugeicons/react @hugeicons/core-free-icons

---

### Usage Example
```jsx
import GlideSelect from './GlideSelect';

const formats = [
  { value: 'png', label: 'PNG', tag: 'Lossless' },
  { value: 'jpg', label: 'JPG', tag: 'Smallest' },
  { value: 'webp', label: 'WebP', tag: 'Modern' },
  { value: 'svg', label: 'SVG', tag: 'Vector' },
  { value: 'pdf', label: 'PDF', tag: 'Print' }
];

<GlideSelect
  options={formats}
  defaultValue="png"
  onChange={(value, option) => console.log(value, option)}
  ariaLabel="Export format"
  showTags
  accentColor="#f5f5f5"
  surfaceColor="#27272a"
  highlightColor="#3f3f46"
  textColor="#f5f5f5"
  size="md"
  radius={10}
  menuWidth={176}
  placement="bottom"
  align="left"
  popDuration={180}
  glideDuration={220}
  rememberPosition
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| options | (string | { value: string; label: ReactNode; tag?: string })[] | ["One", "Two", "Three"] | The rows. A string is both value and label; a tag shows muted at the right. |
| value | string | undefined | Controlled value. Outside changes never animate. |
| defaultValue | string | undefined | Initial value when uncontrolled. |
| onChange | (value: string, option) => void | - | Called on a pick that changes the value. |
| placeholder | string | "Select…" | Chip text while nothing is selected. |
| showTags | boolean | true | Shows each row's tag. |
| accentColor | string | "#f5f5f5" | The check on the selected row. |
| surfaceColor | string | "#27272a" | Chip and menu background. |
| highlightColor | string | "#3f3f46" | The gliding pill. The selected row rests on it at 60%, and the chip tint derives from it. |
| textColor | string | "#f5f5f5" | Labels. Tags and the chevron derive from it. |
| size | "sm" | "md" | "lg" | "md" | Chip 28, 32 or 44 pixels with matching rows. Large is the touch-first size. |
| radius | number | 10 | Menu corner in pixels. Chip, rows and pill use 4 less so they stay concentric. |
| menuWidth | number | 176 | Menu width in pixels, never narrower than the chip. |
| placement | "top" | "bottom" | "bottom" | Which side the menu grows on. It flips when the chosen side would leave the viewport. |
| align | "left" | "right" | "left" | Which chip edge the menu shares. |
| popDuration | number | 180 | Milliseconds the menu takes to grow out of its corner. It leaves in two thirds of that. |
| glideDuration | number | 220 | Milliseconds the pill takes to travel between rows. 0 is a conventional hover. |
| rememberPosition | boolean | true | The highlight stays on the row the pointer left, so re-entry glides from there. Off, it clears on leave and the selected row shows again. |
| disabled | boolean | false | Dims the chip and ignores input. |
| ariaLabel | string | "Select" | Accessible name of the chip and list. |
| className | string | "" | Extra classes for the root. |

### Full Component Source
```jsx
'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon, Tick02Icon } from '@hugeicons/core-free-icons';

import './GlideSelect.css';

const SIZES = {
  sm: { chip: 28, row: 26, font: 12 },
  md: { chip: 32, row: 30, font: 13 },
  lg: { chip: 44, row: 40, font: 14 }
};
const PAD = 4;
const GAP = 1;
const MENU_GAP = 6;
const DEFAULT_OPTIONS = ['One', 'Two', 'Three'];

const norm = o => (typeof o === 'string' ? { value: o, label: o } : o);
const textOf = it => (typeof it.label === 'string' ? it.label : it.value);
const typeaheadIndex = (items, from, ch) => {
  const c = ch.toLowerCase();
  const n = items.length;
  for (let k = 1; k <= n; k++) {
    const i = (from + k) % n;
    if (textOf(items[i]).toLowerCase().startsWith(c)) return i;
  }
  return from;
};

export default function GlideSelect({
  options = DEFAULT_OPTIONS,
  value,
  defaultValue,
  onChange,
  placeholder = 'Select…',
  showTags = true,
  accentColor = '#f5f5f5',
  surfaceColor = '#27272a',
  highlightColor = '#3f3f46',
  textColor = '#f5f5f5',
  size = 'md',
  radius = 10,
  menuWidth = 176,
  placement = 'bottom',
  align = 'left',
  popDuration = 180,
  glideDuration = 220,
  rememberPosition = true,
  disabled = false,
  ariaLabel = 'Select',
  className = ''
}) {
  const items = options.map(norm);
  const [inner, setInner] = useState(defaultValue ?? '');
  const current = value ?? inner;
  const selected = items.findIndex(it => it.value === current);
  const [phase, setPhase] = useState('closed');
  const [active, setActive] = useState(null);
  const [side, setSide] = useState(placement);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const pillRef = useRef(null);
  const instant = useRef(false);
  const closeTimer = useRef(undefined);
  const scrub = useRef(null);
  const id = useId();
  const S = SIZES[size] ?? SIZES.md;
  const step = S.row + GAP;
  const popOut = Math.round((popDuration * 2) / 3);

  useLayoutEffect(() => {
    if (phase !== 'open') return;
    const el = menuRef.current;
    const root = rootRef.current;
    if (!el || !root) return;
    const r = root.getBoundingClientRect();
    const need = el.offsetHeight + MENU_GAP;
    setSide(
      placement === 'bottom' && r.bottom + need > window.innerHeight
        ? 'top'
        : placement === 'top' && r.top - need < 0
          ? 'bottom'
          : placement
    );
    el.style.transitionDuration = instant.current ? '0ms' : '';
    el.dataset.state = 'closed';
    void el.offsetHeight;
    el.dataset.state = 'open';
    const p = pillRef.current;
    if (p) {
      p.style.transition = 'none';
      p.style.transform = `translateY(${Math.max(0, selected) * step}px)`;
      p.style.opacity = '0';
      void p.offsetHeight;
      p.style.transition = '';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useLayoutEffect(() => {
    const p = pillRef.current;
    if (!p || phase !== 'open') return;
    if (active === null) {
      p.style.opacity = '0';
      return;
    }
    const jump = instant.current || p.style.opacity !== '1';
    p.style.transitionDuration = jump ? '0ms, 150ms' : '';
    p.style.transform = `translateY(${active * step}px)`;
    p.style.opacity = '1';
    instant.current = false;
  }, [active, phase, step]);

  const open = viaKey => {
    if (disabled) return;
    clearTimeout(closeTimer.current);
    instant.current = true;
    setActive(selected >= 0 ? selected : viaKey ? 0 : null);
    setPhase('open');
  };
  const close = mode => {
    setActive(null);
    clearTimeout(closeTimer.current);
    const el = menuRef.current;
    if (mode === 'instant' || !el) {
      setPhase('closed');
      return;
    }
    el.style.transitionDuration = '';
    el.dataset.state = 'closed';
    setPhase('closing');
    closeTimer.current = setTimeout(() => setPhase('closed'), popOut + 20);
  };
  const pick = (i, viaKey) => {
    const it = items[i];
    if (!it) {
      close('instant');
      return;
    }
    if (it.value !== current) {
      if (value === undefined) setInner(it.value);
      onChange?.(it.value, it);
      if (!viaKey && rootRef.current) rootRef.current.dataset.swap = '';
    }
    close('instant');
    triggerRef.current?.focus({ preventScroll: true });
  };

  const onTriggerKey = e => {
    const k = e.key;
    const n = items.length;
    const cur = active ?? Math.max(0, selected);
    if (phase !== 'open') {
      if (k === 'Enter' || k === ' ' || k === 'ArrowDown' || k === 'ArrowUp') {
        e.preventDefault();
        open(true);
      }
      return;
    }
    const go = i => {
      e.preventDefault();
      instant.current = true;
      setActive(Math.min(n - 1, Math.max(0, i)));
    };
    if (k === 'ArrowDown' || k === 'ArrowUp') go(active === null ? cur : cur + (k === 'ArrowDown' ? 1 : -1));
    else if (k === 'Home' || k === 'End') go(k === 'Home' ? 0 : n - 1);
    else if (k === 'Enter' || k === ' ') {
      e.preventDefault();
      pick(cur, true);
    } else if (k === 'Escape' || k === 'Tab') {
      if (k === 'Escape') e.preventDefault();
      close('instant');
    } else if (k.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) go(typeaheadIndex(items, cur, k));
  };

  useEffect(() => {
    if (phase === 'closed') return undefined;
    const onDown = e => {
      if (rootRef.current && !rootRef.current.contains(e.target)) close('pop');
    };
    document.addEventListener('pointerdown', onDown, true);
    return () => document.removeEventListener('pointerdown', onDown, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);
  useEffect(() => {
    if (disabled && phase !== 'closed') close('instant');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const rowAt = y => {
    const s = scrub.current;
    if (!s) return null;
    const i = Math.floor((y - s.top - PAD) / step);
    return i >= 0 && i < items.length ? i : null;
  };
  const onListDown = e => {
    if (scrub.current) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    scrub.current = { id: e.pointerId, top: e.currentTarget.getBoundingClientRect().top };
    instant.current = true;
    setActive(rowAt(e.clientY));
  };
  const onListMove = e => {
    if (!scrub.current || scrub.current.id !== e.pointerId) return;
    const i = rowAt(e.clientY);
    if (i !== active) setActive(i);
  };
  const onListUp = e => {
    if (!scrub.current || scrub.current.id !== e.pointerId) return;
    const i = e.type === 'pointerup' ? rowAt(e.clientY) : null;
    scrub.current = null;
    if (i !== null) pick(i, false);
    else if (!rememberPosition) setActive(null);
  };
  const onListOver = e => {
    if (e.pointerType === 'touch' || scrub.current) return;
    const row = e.target.closest('[data-index]');
    if (!row) return;
    const i = Number(row.dataset.index);
    if (i !== active) setActive(i);
  };

  const origin = `${side === 'bottom' ? 'top' : 'bottom'} ${align}`;
  return (
    <div
      ref={rootRef}
      className={`glide-select${className ? ` ${className}` : ''}`}
      data-size={size}
      data-disabled={disabled ? '' : undefined}
      style={{
        '--gs-accent': accentColor,
        '--gs-surface': surfaceColor,
        '--gs-highlight': highlightColor,
        '--gs-text': textColor,
        '--gs-radius': `${radius}px`,
        '--gs-inner-radius': `${Math.max(3, radius - 4)}px`,
        '--gs-chip': `${S.chip}px`,
        '--gs-row': `${S.row}px`,
        '--gs-font': `${S.font}px`,
        '--gs-menu-w': `${menuWidth}px`,
        '--gs-pop': `${popDuration}ms`,
        '--gs-pop-out': `${popOut}ms`,
        '--gs-glide': `${glideDuration}ms`,
        '--gs-origin': origin
      }}
      onAnimationEnd={e => {
        if (e.animationName === 'gs-swap' && rootRef.current) delete rootRef.current.dataset.swap;
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={phase === 'open'}
        aria-controls={`${id}-list`}
        aria-activedescendant={active !== null ? `${id}-${active}` : undefined}
        aria-label={ariaLabel}
        disabled={disabled}
        className="glide-select__trigger"
        onPointerDown={e => {
          if (e.button !== 0 || disabled) return;
          e.currentTarget.focus({ preventScroll: true });
          if (phase === 'open') close('pop');
          else open(false);
        }}
        onKeyDown={onTriggerKey}
      >
        <span className="glide-select__label" key={current} data-empty={selected < 0 ? '' : undefined}>
          {selected >= 0 ? items[selected].label : placeholder}
        </span>
        <span className="glide-select__chevron" aria-hidden="true">
          <HugeiconsIcon icon={ArrowDown01Icon} size={12} strokeWidth={2.5} />
        </span>
      </button>
      {phase !== 'closed' ? (
        <div ref={menuRef} className="glide-select__menu" data-state="open" data-side={side} data-align={align}>
          <div
            id={`${id}-list`}
            role="listbox"
            aria-label={ariaLabel}
            className="glide-select__list"
            data-live={active !== null ? '' : undefined}
            onPointerOver={onListOver}
            onPointerLeave={() => {
              if (!scrub.current && !rememberPosition) setActive(null);
            }}
            onPointerDown={onListDown}
            onPointerMove={onListMove}
            onPointerUp={onListUp}
            onPointerCancel={onListUp}
            onLostPointerCapture={onListUp}
          >
            <span ref={pillRef} className="glide-select__pill" aria-hidden="true" />
            {items.map((it, i) => (
              <div
                key={it.value}
                id={`${id}-${i}`}
                role="option"
                aria-selected={i === selected}
                data-index={i}
                className="glide-select__option"
              >
                <span className="glide-select__name">{it.label}</span>
                {showTags && it.tag ? <span className="glide-select__tag">{it.tag}</span> : null}
                <span className="glide-select__check" data-on={i === selected ? '' : undefined} aria-hidden="true">
                  <HugeiconsIcon icon={Tick02Icon} size={13} strokeWidth={2.5} />
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

```

### Component CSS
```css
.glide-select {
  --gs-accent: #f5f5f5;
  --gs-surface: #27272a;
  --gs-highlight: #3f3f46;
  --gs-text: #f5f5f5;
  --gs-radius: 10px;
  --gs-inner-radius: 6px;
  --gs-chip: 32px;
  --gs-row: 30px;
  --gs-font: 13px;
  --gs-menu-w: 176px;
  --gs-pop: 180ms;
  --gs-pop-out: 120ms;
  --gs-glide: 220ms;
  --gs-origin: top left;
  --gs-ease-out: cubic-bezier(0.23, 1, 0.32, 1);

  position: relative;
  display: inline-block;
}

.glide-select[data-disabled] {
  opacity: 0.5;
}

.glide-select__trigger {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: var(--gs-chip);
  margin: 0;
  padding: 0 8px 0 10px;
  border: 0;
  border-radius: var(--gs-inner-radius);
  background: var(--gs-surface);
  color: var(--gs-text);
  font-family: inherit;
  font-size: var(--gs-font);
  font-weight: 500;
  line-height: 1;
  cursor: pointer;
  outline: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  transition:
    background-color 100ms ease,
    transform 160ms var(--gs-ease-out);
}

.glide-select__trigger:disabled {
  cursor: default;
}

@media (hover: hover) and (pointer: fine) {
  .glide-select__trigger:not(:disabled):hover {
    background: color-mix(in srgb, var(--gs-highlight) 60%, var(--gs-surface));
  }
}

.glide-select__trigger[aria-expanded='true'] {
  background: color-mix(in srgb, var(--gs-highlight) 60%, var(--gs-surface));
}

.glide-select__trigger:not(:disabled):active {
  transform: scale(0.97);
}

.glide-select__label[data-empty] {
  opacity: 0.6;
}

.glide-select[data-swap] .glide-select__label {
  animation: gs-swap 160ms ease;
}

@keyframes gs-swap {
  from {
    opacity: 0.6;
    filter: blur(2px);
  }
}

.glide-select__chevron {
  display: inline-flex;
  color: color-mix(in srgb, var(--gs-text) 55%, transparent);
  transition: transform 200ms var(--gs-ease-out);
}

.glide-select__trigger[aria-expanded='true'] .glide-select__chevron {
  transform: rotate(180deg);
}

.glide-select__menu {
  position: absolute;
  z-index: 20;
  width: var(--gs-menu-w);
  min-width: 100%;
  padding: 4px;
  border-radius: var(--gs-radius);
  background: var(--gs-surface);
  box-shadow: 0 4px 16px color-mix(in srgb, #000 22%, transparent);
  transform-origin: var(--gs-origin);
  opacity: 0;
  transform: scale(0.95);
  transition:
    opacity var(--gs-pop) var(--gs-ease-out),
    transform var(--gs-pop) var(--gs-ease-out);
}

.glide-select__menu[data-state='open'] {
  opacity: 1;
  transform: none;
}

.glide-select__menu[data-state='closed'] {
  transition-duration: var(--gs-pop-out);
  pointer-events: none;
}

.glide-select__menu[data-side='bottom'] {
  top: calc(100% + 6px);
}

.glide-select__menu[data-side='top'] {
  bottom: calc(100% + 6px);
}

.glide-select__menu[data-align='left'] {
  left: 0;
}

.glide-select__menu[data-align='right'] {
  right: 0;
}

.glide-select__list {
  position: relative;
  display: grid;
  gap: 1px;
  touch-action: none;
}

.glide-select__pill {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: var(--gs-row);
  border-radius: var(--gs-inner-radius);
  background: var(--gs-highlight);
  opacity: 0;
  pointer-events: none;
  transition:
    transform var(--gs-glide) var(--gs-ease-out),
    opacity 150ms ease;
}

.glide-select__option {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  height: var(--gs-row);
  padding: 0 8px 0 10px;
  border-radius: var(--gs-inner-radius);
  color: var(--gs-text);
  font-size: var(--gs-font);
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 150ms ease;
}

.glide-select__option[aria-selected='true'] {
  background: color-mix(in srgb, var(--gs-highlight) 60%, transparent);
}

.glide-select__list[data-live] .glide-select__option[aria-selected='true'] {
  background: transparent;
}

.glide-select__name {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  font-weight: 500;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.glide-select__tag {
  flex-shrink: 0;
  color: color-mix(in srgb, var(--gs-text) 55%, transparent);
  font-size: calc(var(--gs-font) - 2px);
}

.glide-select__check {
  display: inline-flex;
  flex-shrink: 0;
  color: var(--gs-accent);
  visibility: hidden;
}

.glide-select__check[data-on] {
  visibility: visible;
}

@media (prefers-reduced-motion: reduce) {
  .glide-select__menu {
    transform: none !important;
    transition: opacity var(--gs-pop) ease;
  }

  .glide-select__menu[data-state='closed'] {
    transition-duration: var(--gs-pop-out);
  }

  .glide-select__pill {
    transition: opacity 150ms ease;
  }

  .glide-select__chevron {
    transition: none;
  }

  .glide-select__trigger {
    transition: background-color 100ms ease;
  }

  .glide-select__trigger:not(:disabled):active {
    transform: none;
  }

  .glide-select[data-swap] .glide-select__label {
    animation: none;
  }
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.


## Integrate the <SwipeRow /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: SwipeRow
### Variant: JavaScript + CSS
### Dependencies: motion @hugeicons/react @hugeicons/core-free-icons

---

### Usage Example
```jsx
import SwipeRow from './SwipeRow';
import { HugeiconsIcon } from '@hugeicons/react';
import { Archive02Icon, Delete02Icon } from '@hugeicons/core-free-icons';

<SwipeRow
  actions={[
    { id: 'delete', label: 'Delete', icon: <HugeiconsIcon icon={Delete02Icon} size={20} /> },
    { id: 'archive', label: 'Archive', icon: <HugeiconsIcon icon={Archive02Icon} size={20} />, dismiss: true }
  ]}
  onAction={action => console.log(action.id)}
  onCommit={action => removeRow(item.id, action.id)}
  actionColor="#e5484d"
  drawerColor="#3f3f46"
  rowColor="#27272a"
  textColor="#f5f5f5"
  height={64}
  radius={16}
  actionWidth={80}
  direction="left"
  snapBounce={0.2}
  resistance={0.55}
  collapseMs={200}
  commitAt={0.6}
  fullSwipe
  style={{ marginBottom: 8 }}
>
  <span>Design review notes</span>
</SwipeRow>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | The row content you drag. |
| actions | SwipeAction[] | [{ id: "delete", label: "Delete" }] | The drawer, outermost first. Each has id, label, an optional icon, an optional color for secondary actions, dismiss to fold the row when pressed, and onSelect. The first is the full-swipe action and always folds the row. |
| actionColor | string | "#e5484d" | The full-swipe block that leaps and fills the row. |
| drawerColor | string | "#3f3f46" | The drawer base and the secondary actions. |
| rowColor | string | "#27272a" | The surface. |
| textColor | string | "#f5f5f5" | Row text and the keyboard toggle. |
| height | number | 64 | Row height in pixels. The fold closes from it. |
| radius | number | 16 | Corner radius of the row and the clipped drawer. |
| actionWidth | number | 80 | Width of each action in pixels, so the drawer width too. |
| direction | "left" | "right" | "left" | Which way you swipe. Everything mirrors. |
| snapBounce | number | 0.2 | Overshoot of the open or close settle after a flick. Slow releases never bounce. |
| resistance | number | 0.55 | How much of the finger the row keeps past the drawer, and the rubber-band beyond the commit point. |
| collapseMs | number | 200 | How long a deleted row takes to fold shut. |
| commitAt | number | 0.6 | Fraction of the row width the surface must uncover for the block to leap and a release to delete. |
| fullSwipe | boolean | true | Off, the drawer is the end: no leap, no delete. |
| disabled | boolean | false | Dims the row and ignores input. |
| open | boolean | undefined | Controlled open state. Outside changes settle the row. |
| onOpenChange | (open: boolean) => void | - | Called when a gesture or key opens or closes the drawer. |
| onAction | (action: SwipeAction) => void | - | Called when any action button is pressed. |
| onCommit | (action: SwipeAction) => void | - | Called after a full swipe or a press on a folding action, once the row has shut. Remove the row here. |
| closeOnAction | boolean | true | Closes the drawer after an action is pressed. |
| haptic | boolean | true | A short vibration on touch when the block leaps. |
| label | string | "List item" | Accessible name of the row. |
| className | string | "" | Extra classes for the root. |
| style | CSSProperties | undefined | Inline styles merged onto the root. |

### Full Component Source
```jsx
'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02Icon } from '@hugeicons/core-free-icons';

import './SwipeRow.css';

const HYST = 10;
const FLICK = 110;
const DECEL = 0.998;
const VMAX = 1500;
const EASE_OUT = [0.23, 1, 0.32, 1];
const SPRING_UI = { type: 'spring', duration: 0.3, bounce: 0 };
const DEFAULT_ACTIONS = [{ id: 'delete', label: 'Delete' }];

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const rubber = (o, dim, c) => (o * dim * c) / (dim + c * Math.abs(o));
const unrubber = (y, dim, c) => (y * dim) / (c * Math.max(1, dim - Math.abs(y)));
const project = v => ((v / 1000) * DECEL) / (1 - DECEL);
const velocityOf = hist => {
  if (hist.length < 2) return 0;
  const a = hist[0];
  const b = hist[hist.length - 1];
  return ((b[1] - a[1]) / Math.max(1, b[0] - a[0])) * 1000;
};
const onColor = hex => {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return '#ffffff';
  const h = m[1].length === 3 ? [...m[1]].map(ch => ch + ch).join('') : m[1];
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 >= 150 ? '#111111' : '#ffffff';
};
const watchWindow = live => {
  const onMove = e => {
    if (e.isTrusted) live.current.move(e);
  };
  const onUp = e => {
    if (e.isTrusted) live.current.up(e);
  };
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', onUp);
  return () => {
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    window.removeEventListener('pointercancel', onUp);
  };
};

export default function SwipeRow({
  children,
  actions = DEFAULT_ACTIONS,
  actionColor = '#e5484d',
  drawerColor = '#3f3f46',
  rowColor = '#27272a',
  textColor = '#f5f5f5',
  height = 64,
  radius = 16,
  actionWidth = 80,
  direction = 'left',
  snapBounce = 0.2,
  resistance = 0.55,
  collapseMs = 200,
  commitAt = 0.6,
  fullSwipe = true,
  disabled = false,
  open: openProp,
  onOpenChange,
  onAction,
  onCommit,
  closeOnAction = true,
  haptic = true,
  label = 'List item',
  className = '',
  style
}) {
  const uid = useId();
  const reduce = useReducedMotion();
  const s = direction === 'left' ? -1 : 1;
  const A = actionWidth;
  const n = actions.length;
  const D = n * A;
  const c = clamp(resistance, 0.05, 1);
  const primary = actions[0];
  const [openState, setOpenState] = useState(false);
  const [phase, setPhase] = useState('idle');
  const [say, setSay] = useState('');
  const open = openProp ?? openState;

  const root = useRef(null);
  const surface = useRef(null);
  const w = useRef(360);
  const grip = useRef(null);
  const unwatch = useRef(null);
  const live = useRef({});
  const foldTimer = useRef(undefined);
  const heading = useRef(null);

  const x = useMotionValue(0);
  const spread = useMotionValue(0);
  const landed = useMotionValue(0);
  const commitPoint = () => Math.max(commitAt * w.current, D + A / 2);
  const canCommit = () => fullSwipe && n > 0 && commitPoint() <= w.current;
  const exposed = useTransform(x, v => s * v);
  const surfaceXf = useTransform(x, v => `translateX(${v}px)`);
  const railXf = useTransform(exposed, e => `translateX(${-s * Math.max(0, D - e)}px)`);
  const shift = useTransform([exposed, spread], ([e, p]) => p * Math.max(0, e - A));
  const blockXf = useTransform(shift, v => `translateX(${s * v}px)`);
  const glyphXf = useTransform([shift, landed], ([v, l]) => `translateX(${-s * l * (v - (w.current - A) / 2)}px)`);

  const map = raw => {
    const W = w.current;
    if (raw < 0) return rubber(raw, W, c);
    if (raw <= D) return raw;
    if (!canCommit()) return D + rubber(raw - D, W, c);
    const C = commitPoint();
    const knee = D + (C - D) / c;
    return raw <= knee ? D + c * (raw - D) : C + rubber(raw - knee, W, c);
  };
  const inv = ex => {
    const W = w.current;
    if (ex < 0) return unrubber(ex, W, c);
    if (ex <= D) return ex;
    if (!canCommit()) return D + unrubber(ex - D, W, c);
    const C = commitPoint();
    const knee = D + (C - D) / c;
    return ex <= C ? D + (ex - D) / c : knee + unrubber(ex - C, W, c);
  };

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return undefined;
    w.current = el.offsetWidth || w.current;
    const observer = new ResizeObserver(entries => {
      const width = entries[0]?.contentRect.width;
      if (width) w.current = width;
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  useEffect(
    () => () => {
      clearTimeout(foldTimer.current);
      unwatch.current?.();
    },
    []
  );

  const setOpen = next => {
    if (next === open) return;
    setOpenState(next);
    onOpenChange?.(next);
  };
  const settle = (target, v = 0) => {
    heading.current = target;
    if (reduce) {
      animate(x, s * target, { duration: 0.2, ease: EASE_OUT });
      return;
    }
    const flick = Math.abs(v) >= FLICK;
    animate(
      x,
      s * target,
      flick
        ? { type: 'spring', duration: 0.4, bounce: snapBounce, velocity: s * clamp(v, -VMAX, VMAX) }
        : { ...SPRING_UI, velocity: s * v }
    );
  };
  const setSpread = on => {
    if ((spread.get() === 1) === on) return;
    if (reduce) spread.set(on ? 1 : 0);
    else animate(spread, on ? 1 : 0, SPRING_UI);
    if (on && primary) {
      setSay(`Release to ${primary.label}`);
      if (haptic && grip.current?.touch) navigator.vibrate?.(8);
    }
  };
  const commit = (a, viaKey, v = 0) => {
    const leap = a === primary;
    setPhase('committing');
    setSay(a.label);
    setOpen(false);
    const fold = () => {
      setPhase('collapsing');
      foldTimer.current = setTimeout(() => {
        onCommit?.(a);
        a.onSelect?.();
      }, collapseMs);
    };
    if (viaKey || reduce) {
      if (leap) {
        spread.set(1);
        landed.set(1);
      }
      if (viaKey) {
        x.set(s * w.current);
        fold();
      } else animate(x, s * w.current, { duration: 0.2, ease: EASE_OUT }).then(fold);
      return;
    }
    if (leap) {
      if (spread.get() < 1) animate(spread, 1, SPRING_UI);
      animate(landed, 1, SPRING_UI);
    }
    animate(x, s * w.current, { ...SPRING_UI, velocity: s * v }).then(fold);
  };
  useEffect(() => {
    if (openProp === undefined || grip.current || phase !== 'idle') return;
    const target = open ? D : 0;
    if (heading.current === target) return;
    if (Math.abs(exposed.get() - target) > 0.5) settle(target);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, D]);

  const down = e => {
    if (disabled || n === 0 || phase !== 'idle' || grip.current || e.button !== 0) return;
    x.stop();
    heading.current = null;
    grip.current = {
      id: e.pointerId,
      x0: e.clientX,
      y0: e.clientY,
      grab: null,
      moved: false,
      hist: [],
      touch: e.pointerType === 'touch'
    };
    try {
      surface.current?.setPointerCapture(e.pointerId);
    } catch {}
    unwatch.current?.();
    unwatch.current = watchWindow(live);
  };
  const move = e => {
    const g = grip.current;
    if (!g || g.id !== e.pointerId) return;
    if (g.grab === null) {
      const dx = e.clientX - g.x0;
      const dy = e.clientY - g.y0;
      if (Math.abs(dx) < HYST || Math.abs(dx) < Math.abs(dy)) return;
      g.grab = s * (g.x0 + Math.sign(dx) * HYST) - inv(exposed.get());
      g.moved = true;
      root.current?.setAttribute('data-dragging', '');
    }
    const ex = map(s * e.clientX - g.grab);
    x.set(s * ex);
    g.hist.push([performance.now(), ex]);
    if (g.hist.length > 4) g.hist.shift();
    setSpread(canCommit() && ex >= commitPoint());
  };
  const up = e => {
    const g = grip.current;
    if (!g || g.id !== e.pointerId) return;
    grip.current = null;
    unwatch.current?.();
    unwatch.current = null;
    root.current?.removeAttribute('data-dragging');
    try {
      surface.current?.releasePointerCapture(e.pointerId);
    } catch {}
    const ex = exposed.get();
    const v = velocityOf(g.hist);
    if (!g.moved) {
      if (open) {
        setOpen(false);
        settle(0);
      }
      return;
    }
    if (primary && canCommit() && ex >= commitPoint()) {
      commit(primary, false, v);
      return;
    }
    const target = Math.abs(v) >= FLICK ? (v > 0 ? D : 0) : ex + project(v) > D / 2 ? D : 0;
    setSpread(false);
    setOpen(target === D);
    settle(target, v);
  };
  live.current = { move, up };

  const act = (a, e) => {
    if (phase !== 'idle') return;
    onAction?.(a);
    if (a === primary || a.dismiss) {
      commit(a, e.detail === 0);
      return;
    }
    a.onSelect?.();
    if (!closeOnAction) return;
    setOpen(false);
    if (e.detail === 0) {
      heading.current = 0;
      x.set(0);
    } else settle(0);
  };
  const openNow = () => {
    heading.current = D;
    x.set(s * D);
    setOpen(true);
    setSay(`${n} actions revealed`);
  };
  const closeNow = () => {
    heading.current = 0;
    x.set(0);
    setOpen(false);
  };
  const onToggleKey = e => {
    if (disabled || phase !== 'idle' || n === 0) return;
    const openKey = s < 0 ? 'ArrowLeft' : 'ArrowRight';
    const closeKey = s < 0 ? 'ArrowRight' : 'ArrowLeft';
    const toggle = e.key === 'Enter' || e.key === ' ';
    if (e.key === openKey || (toggle && !open)) {
      e.preventDefault();
      openNow();
    } else if (e.key === closeKey || e.key === 'Escape' || (toggle && open)) {
      e.preventDefault();
      closeNow();
    } else if ((e.key === 'Delete' || e.key === 'Backspace') && open && primary && canCommit()) {
      e.preventDefault();
      commit(primary, true);
    }
  };
  const onToggleClick = e => {
    if (e.detail !== 0 || disabled || phase !== 'idle' || n === 0) return;
    if (open) closeNow();
    else openNow();
  };

  const railId = `${uid}-rail`;
  return (
    <div
      ref={root}
      role="group"
      aria-label={label}
      className={`swipe-row${className ? ` ${className}` : ''}`}
      data-direction={direction}
      data-open={open ? '' : undefined}
      data-phase={phase}
      data-disabled={disabled ? '' : undefined}
      style={{
        '--sr-h': `${height}px`,
        '--sr-r': `${radius}px`,
        '--sr-a': `${A}px`,
        '--sr-row': rowColor,
        '--sr-text': textColor,
        '--sr-drawer': drawerColor,
        '--sr-on-drawer': onColor(drawerColor),
        '--sr-action': actionColor,
        '--sr-on-action': onColor(actionColor),
        '--sr-collapse': `${collapseMs}ms`,
        ...style
      }}
    >
      <div className="swipe-row__clip">
        <motion.div
          id={railId}
          className="swipe-row__rail"
          style={{ transform: railXf }}
          inert={!open || undefined}
          aria-hidden={!open}
        >
          {actions.slice(1).map((a, i) => (
            <button
              key={a.id}
              type="button"
              className="swipe-row__action"
              onClick={e => act(a, e)}
              style={
                s < 0
                  ? { right: (i + 1) * A, background: a.color ?? drawerColor, color: onColor(a.color ?? drawerColor) }
                  : { left: (i + 1) * A, background: a.color ?? drawerColor, color: onColor(a.color ?? drawerColor) }
              }
            >
              <span className="swipe-row__glyph">
                {a.icon ? <span className="swipe-row__icon">{a.icon}</span> : null}
                <span>{a.label}</span>
              </span>
            </button>
          ))}
          {primary ? (
            <motion.div className="swipe-row__block" style={{ transform: blockXf }}>
              <motion.button
                type="button"
                className="swipe-row__action swipe-row__action--commit"
                style={{ transform: glyphXf }}
                onClick={e => act(primary, e)}
              >
                <span className="swipe-row__glyph">
                  <span className="swipe-row__icon">
                    {primary.icon ?? <HugeiconsIcon icon={Delete02Icon} size={20} strokeWidth={2} />}
                  </span>
                  <span>{primary.label}</span>
                </span>
              </motion.button>
            </motion.div>
          ) : null}
        </motion.div>
        <motion.div ref={surface} className="swipe-row__surface" style={{ transform: surfaceXf }} onPointerDown={down}>
          {children}
          <button
            type="button"
            className="swipe-row__toggle"
            tabIndex={disabled ? -1 : 0}
            aria-expanded={open}
            aria-controls={railId}
            aria-keyshortcuts={s < 0 ? 'ArrowLeft' : 'ArrowRight'}
            onKeyDown={onToggleKey}
            onClick={onToggleClick}
          >
            {n} {n === 1 ? 'action' : 'actions'}
          </button>
        </motion.div>
      </div>
      <span className="swipe-row__sr" aria-live="polite">
        {say}
      </span>
    </div>
  );
}

```

### Component CSS
```css
.swipe-row {
  --sr-h: 64px;
  --sr-r: 16px;
  --sr-a: 80px;
  --sr-row: #27272a;
  --sr-text: #f5f5f5;
  --sr-drawer: #3f3f46;
  --sr-on-drawer: #ffffff;
  --sr-action: #e5484d;
  --sr-on-action: #ffffff;
  --sr-collapse: 200ms;
  --sr-ease-out: cubic-bezier(0.23, 1, 0.32, 1);

  position: relative;
  height: var(--sr-h);
  overflow: hidden;
  opacity: 1;
  transition:
    height var(--sr-collapse) var(--sr-ease-out),
    margin-bottom var(--sr-collapse) var(--sr-ease-out),
    opacity var(--sr-collapse) var(--sr-ease-out);
}

.swipe-row[data-phase='collapsing'] {
  height: 0 !important;
  margin-bottom: 0 !important;
  opacity: 0;
}

.swipe-row[data-disabled] {
  opacity: 0.55;
  pointer-events: none;
}

.swipe-row__clip {
  position: relative;
  height: var(--sr-h);
  border-radius: var(--sr-r);
  overflow: hidden;
  background: var(--sr-row);
}

.swipe-row__rail {
  position: absolute;
  inset: 0;
  background: var(--sr-drawer);
}

.swipe-row__action {
  position: absolute;
  top: 0;
  display: grid;
  place-items: center;
  width: var(--sr-a);
  height: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  background: var(--sr-drawer);
  color: var(--sr-on-drawer);
  font: inherit;
  cursor: pointer;
  outline: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.swipe-row__action::after {
  content: '';
  position: absolute;
  inset: 0;
  background: #fff;
  opacity: 0;
  pointer-events: none;
}

@media (hover: hover) and (pointer: fine) {
  .swipe-row__action::after {
    transition: opacity 150ms ease;
  }

  .swipe-row__action:hover::after {
    opacity: 0.08;
  }
}

.swipe-row__glyph {
  display: grid;
  justify-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.01em;
  line-height: 1;
  transition: transform 160ms var(--sr-ease-out);
}

.swipe-row__icon {
  display: inline-flex;
}

.swipe-row__action:active .swipe-row__glyph {
  transform: scale(0.97);
}

.swipe-row__block {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background: var(--sr-action);
}

.swipe-row[data-direction='left'] .swipe-row__block {
  left: calc(100% - var(--sr-a));
}

.swipe-row[data-direction='right'] .swipe-row__block {
  right: calc(100% - var(--sr-a));
}

.swipe-row__action--commit {
  background: transparent;
  color: var(--sr-on-action);
}

.swipe-row[data-direction='left'] .swipe-row__action--commit {
  left: 0;
}

.swipe-row[data-direction='right'] .swipe-row__action--commit {
  right: 0;
}

.swipe-row__surface {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 100%;
  padding: 0 16px;
  background: var(--sr-row);
  color: var(--sr-text);
  touch-action: pan-y;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
}

@media (hover: hover) and (pointer: fine) {
  .swipe-row__surface {
    cursor: grab;
  }

  .swipe-row[data-dragging] .swipe-row__surface {
    cursor: grabbing;
  }
}

@media (pointer: coarse) {
  .swipe-row__surface {
    user-select: none;
    -webkit-user-select: none;
  }
}

.swipe-row[data-dragging] .swipe-row__surface,
.swipe-row[data-dragging] .swipe-row__surface * {
  user-select: none;
  -webkit-user-select: none;
}

.swipe-row__toggle {
  position: absolute;
  top: 50%;
  width: 1px;
  height: 1px;
  margin: 0;
  padding: 0;
  border: 0;
  overflow: hidden;
  clip-path: inset(50%);
  background: transparent;
  color: var(--sr-text);
  font: inherit;
  outline: none;
}

.swipe-row[data-direction='left'] .swipe-row__toggle {
  right: 12px;
}

.swipe-row[data-direction='right'] .swipe-row__toggle {
  left: 12px;
}

.swipe-row__toggle:focus-visible {
  width: auto;
  height: 24px;
  padding: 0 10px;
  border-radius: 12px;
  overflow: visible;
  clip-path: none;
  background: color-mix(in srgb, var(--sr-text) 12%, transparent);
  font-size: 12px;
  white-space: nowrap;
  transform: translateY(-50%);
}

.swipe-row__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}

@media (prefers-reduced-motion: reduce) {
  .swipe-row__action:active .swipe-row__glyph {
    transform: none;
  }
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.


## Integrate the <CodeSlots /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: CodeSlots
### Variant: JavaScript + CSS
### Dependencies: motion @hugeicons/react @hugeicons/core-free-icons

---

### Usage Example
```jsx
import { useState } from 'react';
import CodeSlots from './CodeSlots';

const [status, setStatus] = useState('idle');

<CodeSlots
  length={6}
  status={status}
  onChange={() => setStatus('idle')}
  onComplete={async code => {
    const ok = await verify(code);
    setStatus(ok ? 'success' : 'error');
  }}
  accentColor="#f5f5f5"
  inkColor="#f5f5f5"
  slotColor="#27272a"
  digitColor="#18181b"
  dangerColor="#ff3b30"
  slotSize={44}
  gap={8}
  radius={12}
  bounce={0.2}
  settle={0.3}
  rise={8}
  cascade={20}
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| length | number | 6 | Number of slots. |
| value | string | undefined | Controlled code. Digits that arrive from outside land with the cascade; digits removed drain. |
| defaultValue | string | "" | Uncontrolled initial code, rendered already landed. |
| onChange | (code: string) => void | - | Called on every edit, including the clear at the end of a reject. |
| onComplete | (code: string) => void | - | Called once when the last hole is filled. |
| status | "idle" | "error" | "success" | "idle" | error drains the slots last to first under the danger tint and clears the code; success merges the fills into one wash and locks the input. |
| mask | boolean | false | Shows a dot instead of each digit. |
| caret | boolean | true | Shows the blinking caret in the active slot. |
| disabled | boolean | false | Fades the row and ignores input. |
| autoFocus | boolean | false | Focuses the input on mount. |
| accentColor | string | "#f5f5f5" | Fill of a landed digit, the active ring and the success wash. |
| inkColor | string | "#f5f5f5" | Caret, and the tint of the active slot. |
| slotColor | string | "#27272a" | Surface of an empty slot. |
| digitColor | string | "#18181b" | Digit colour on the fill. |
| dangerColor | string | "#ff3b30" | Ring and fill colour while status is error. |
| slotSize | number | 44 | Slot width in pixels. Height and digit size follow it. |
| gap | number | 8 | Space between slots in pixels. |
| radius | number | 12 | Corner radius in pixels, capped at half the slot size. |
| bounce | number | 0.2 | Spring overshoot of the landing fill. 0 is critically damped. |
| settle | number | 0.3 | Seconds a digit takes to land or drain. |
| rise | number | 8 | Pixels a digit rises into place. 0 fades only. |
| cascade | number | 20 | Milliseconds between slots when several land at once or drain on reject. |
| ariaLabel | string | "One-time code" | Accessible name of the input. |
| className | string | "" | Extra classes for the root. |

### Full Component Source
```jsx
'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { animate, motion, motionValue, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tick02Icon } from '@hugeicons/core-free-icons';

import './CodeSlots.css';

const EASE_OUT = [0.23, 1, 0.32, 1];
const WASH_IN = 0.3;
const WASH_OUT = 0.2;
const SINK_DELAY = 0.06;
const SINK_STEP = 0.03;
const CHECK_DELAY = 0.28;
const CHECK_RISE = 8;
const SINK_FADE = 0.6;

const clamp01 = v => Math.min(1, Math.max(0, v));
const digitsOf = raw => String(raw ?? '').replace(/\D/g, '');
const toSlots = (raw, n) => {
  const d = digitsOf(raw).slice(0, n);
  return Array.from({ length: n }, (_, i) => d[i] ?? '');
};
const firstEmptyOf = slots => {
  const i = slots.indexOf('');
  return i === -1 ? slots.length - 1 : i;
};
const isFull = slots => slots.every(Boolean);

export default function CodeSlots({
  length = 6,
  value,
  defaultValue = '',
  onChange,
  onComplete,
  status = 'idle',
  mask = false,
  caret = true,
  disabled = false,
  autoFocus = false,
  accentColor = '#f5f5f5',
  inkColor = '#f5f5f5',
  slotColor = '#27272a',
  digitColor = '#18181b',
  dangerColor = '#ff3b30',
  slotSize = 44,
  gap = 8,
  radius = 12,
  bounce = 0.2,
  settle = 0.3,
  rise = 8,
  cascade = 20,
  ariaLabel = 'One-time code',
  className = ''
}) {
  const uid = useId();
  const reduce = useReducedMotion();
  const inputRef = useRef(null);
  const rowRef = useRef(null);
  const [slots, setSlots] = useState(() => toSlots(value ?? defaultValue, length));
  const [active, setActive] = useState(() => firstEmptyOf(slots));
  const [focused, setFocused] = useState(false);
  const [veiled, setVeiled] = useState(status === 'success');
  const activeMv = useMotionValue(active);
  const openMv = useMotionValue(status === 'success' ? 1 : 0);
  const checkMv = useMotionValue(status === 'success' ? 1 : 0);
  const glide = useRef(new Set());
  const target = useRef([]);
  const draining = useRef(false);
  const drainTimer = useRef(undefined);
  const statusRef = useRef(status);
  const emitted = useRef(digitsOf(value ?? defaultValue).slice(0, length));
  const slotsRef = useRef(slots);
  slotsRef.current = slots;
  const live = useRef({});
  live.current = { settle, bounce, cascade, reduce };

  const springs = useMemo(
    () => ({
      mvs: Array.from({ length }, (_, i) => motionValue(slotsRef.current[i] ? 1 : 0)),
      drops: Array.from({ length }, () => motionValue(statusRef.current === 'success' ? 1 : 0))
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [length]
  );
  const { mvs, drops } = springs;
  const pitch = slotSize + gap;
  const height = Math.round(slotSize * 1.18);
  const washRadius = Math.min(radius, slotSize / 2);

  const drive = useCallback(
    (i, to, delayMs = 0) => {
      const mv = mvs[i];
      if (!mv) return;
      target.current[i] = to;
      const L = live.current;
      if (L.reduce) {
        mv.jump(to);
        return;
      }
      animate(mv, to, { type: 'spring', duration: L.settle, bounce: L.bounce, delay: delayMs / 1000 });
    },
    [mvs]
  );
  const land = useCallback(
    (i, delayMs = 0) => {
      if (mvs[i].get() > 0) mvs[i].jump(0);
      drive(i, 1, delayMs);
    },
    [mvs, drive]
  );
  const moveActive = useCallback(
    (next, crossed) => {
      crossed.forEach(j => glide.current.add(j));
      activeMv.jump(next);
      setActive(next);
    },
    [activeMv]
  );
  const jumpActive = useCallback(
    next => {
      glide.current.clear();
      activeMv.jump(next);
      setActive(next);
    },
    [activeMv]
  );

  const caretX = useTransform(() => {
    const a = activeMv.get();
    let x = a * pitch;
    for (let j = 0; j < mvs.length; j++) {
      const h = clamp01(mvs[j].get());
      if (!glide.current.has(j)) continue;
      const to = target.current[j];
      if (to === undefined || h === clamp01(to)) {
        glide.current.delete(j);
        continue;
      }
      x += j < a ? -(1 - h) * pitch : h * pitch;
    }
    return Math.min(Math.max(x, 0), (mvs.length - 1) * pitch);
  });
  const caretTransform = useTransform(caretX, x => `translateX(${x}px)`);
  const washClip = useTransform(openMv, o => `inset(0 ${(1 - clamp01(o)) * 50}% round ${washRadius}px)`);
  const checkTransform = useTransform(
    checkMv,
    c => `translateY(${(1 - c) * CHECK_RISE}px) scale(${0.85 + 0.15 * Math.max(c, 0)})`
  );
  const checkOpacity = useTransform(checkMv, clamp01);

  const commit = useCallback(
    next => {
      const prev = slotsRef.current;
      slotsRef.current = next;
      setSlots(next);
      const code = next.join('');
      emitted.current = code;
      onChange?.(code);
      if (!isFull(prev) && isFull(next)) onComplete?.(code);
    },
    [onChange, onComplete]
  );

  const insert = (raw, from = active) => {
    const digits = digitsOf(raw);
    if (!digits) return;
    const next = [...slotsRef.current];
    const crossed = [];
    const step = reduce ? 0 : cascade;
    let i = from;
    for (const ch of digits) {
      if (i >= length) break;
      next[i] = ch;
      land(i, (i - from) * step);
      crossed.push(i);
      i += 1;
    }
    if (!crossed.length) return;
    commit(next);
    moveActive(Math.min(i, length - 1), crossed);
  };
  const clearSlot = (i, stepBack = false) => {
    if (!slotsRef.current[i]) {
      if (stepBack) jumpActive(i);
      return;
    }
    const next = [...slotsRef.current];
    next[i] = '';
    drive(i, 0);
    commit(next);
    if (stepBack) moveActive(i, [i]);
  };

  const busy = disabled || draining.current || status === 'success';
  const onKeyDown = e => {
    if (busy || e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    if (/^[0-9]$/.test(k)) {
      e.preventDefault();
      insert(k);
    } else if (k === 'Backspace') {
      e.preventDefault();
      if (slots[active]) clearSlot(active);
      else if (active > 0) clearSlot(active - 1, true);
    } else if (k === 'Delete') {
      e.preventDefault();
      clearSlot(active);
    } else if (k === 'ArrowLeft') {
      e.preventDefault();
      jumpActive(Math.max(active - 1, 0));
    } else if (k === 'ArrowRight') {
      e.preventDefault();
      jumpActive(Math.min(active + 1, length - 1));
    } else if (k === 'Home') {
      e.preventDefault();
      jumpActive(0);
    } else if (k === 'End') {
      e.preventDefault();
      jumpActive(length - 1);
    }
  };
  const onPaste = e => {
    if (busy) return;
    e.preventDefault();
    insert(e.clipboardData.getData('text'));
  };
  const onInput = e => {
    if (busy) return;
    const d = digitsOf(e.target.value);
    if (!d) return;
    insert(d, d.length === 1 ? active : 0);
  };
  const onRowMouseDown = e => {
    if (disabled) return;
    e.preventDefault();
    const row = rowRef.current;
    if (row && !draining.current && status !== 'success') {
      const rect = row.getBoundingClientRect();
      const zoom = rect.width / (row.offsetWidth || rect.width) || 1;
      const i = Math.floor((e.clientX - rect.left) / zoom / pitch);
      jumpActive(Math.max(0, Math.min(i, firstEmptyOf(slotsRef.current))));
    }
    inputRef.current?.focus();
  };

  useEffect(() => {
    glide.current.clear();
    target.current = [];
    const next = Array.from({ length }, (_, i) => slotsRef.current[i] ?? '');
    slotsRef.current = next;
    setSlots(next);
    jumpActive(firstEmptyOf(next));
    const code = next.join('');
    if (code !== emitted.current) {
      emitted.current = code;
      onChange?.(code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length]);

  useEffect(() => {
    if (value === undefined) return;
    const clean = digitsOf(value).slice(0, length);
    if (clean === emitted.current) return;
    emitted.current = clean;
    const prev = slotsRef.current;
    const next = toSlots(clean, length);
    const hidden = statusRef.current === 'success';
    const landing = [];
    const leaving = [];
    next.forEach((ch, i) => {
      if (ch === prev[i]) return;
      (ch ? landing : leaving).push(i);
    });
    const step = live.current.reduce || hidden ? 0 : live.current.cascade;
    landing.forEach((i, k) => land(i, k * step));
    leaving.reverse().forEach((i, k) => {
      if (hidden) {
        target.current[i] = 0;
        mvs[i].jump(0);
        drops[i].jump(0);
      } else drive(i, 0, k * step);
    });
    slotsRef.current = next;
    setSlots(next);
    moveActive(firstEmptyOf(next), [...landing, ...leaving]);
    if (!isFull(prev) && isFull(next)) onComplete?.(clean);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, length]);

  useEffect(() => {
    const was = statusRef.current;
    const L = live.current;
    if (status === 'success') {
      setVeiled(true);
      if (L.reduce) {
        openMv.jump(1);
        drops.forEach(d => d.jump(1));
        checkMv.jump(1);
        return;
      }
      animate(openMv, 1, { duration: WASH_IN, ease: EASE_OUT });
      drops.forEach((d, k) =>
        animate(d, 1, { type: 'spring', duration: 0.3, bounce: 0, delay: SINK_DELAY + k * SINK_STEP })
      );
      animate(checkMv, 1, { type: 'spring', duration: 0.35, bounce: L.bounce, delay: CHECK_DELAY });
      return;
    }
    if (was !== 'success') return;
    if (L.reduce) {
      openMv.jump(0);
      checkMv.jump(0);
      drops.forEach(d => d.jump(0));
      setVeiled(false);
      return;
    }
    animate(checkMv, 0, { duration: 0.15, ease: EASE_OUT });
    animate(openMv, 0, { duration: WASH_OUT, ease: EASE_OUT, delay: 0.06 }).then(() => {
      if (openMv.get() === 0) setVeiled(false);
    });
    drops.forEach(d => animate(d, 0, { type: 'spring', duration: 0.3, bounce: 0, delay: 0.1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (status !== 'error') return;
    const filled = slotsRef.current.map((c, i) => (c ? i : -1)).filter(i => i >= 0);
    if (!filled.length) return;
    filled.reverse();
    draining.current = true;
    const L = live.current;
    const step = L.reduce ? 0 : L.cascade;
    filled.forEach((i, k) => drive(i, 0, k * step));
    moveActive(
      0,
      slotsRef.current.map((_, j) => j)
    );
    clearTimeout(drainTimer.current);
    drainTimer.current = setTimeout(
      () => {
        draining.current = false;
        commit(Array.from({ length }, () => ''));
      },
      L.reduce ? 300 : (filled.length - 1) * step + L.settle * 1000
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);
  useEffect(() => () => clearTimeout(drainTimer.current), []);
  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const view = slots.length === length ? slots : Array.from({ length }, (_, i) => slots[i] ?? '');
  const showCaret =
    caret && focused && !disabled && !veiled && status !== 'success' && (status === 'error' || !view[active]);

  return (
    <div
      className={`code-slots${className ? ` ${className}` : ''}`}
      style={{
        '--cs-accent': accentColor,
        '--cs-ink': inkColor,
        '--cs-slot': slotColor,
        '--cs-digit': digitColor,
        '--cs-danger': dangerColor,
        '--cs-size': `${slotSize}px`,
        '--cs-height': `${height}px`,
        '--cs-gap': `${gap}px`,
        '--cs-radius': `${Math.min(radius, slotSize / 2)}px`,
        '--cs-font': `${Math.round(slotSize * 0.5)}px`
      }}
    >
      <div
        ref={rowRef}
        className="code-slots__row"
        data-status={status}
        data-focused={focused ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        onMouseDown={onRowMouseDown}
      >
        <input
          ref={inputRef}
          className="code-slots__input"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]*"
          value=""
          maxLength={length}
          aria-label={ariaLabel}
          aria-invalid={status === 'error'}
          aria-describedby={`${uid}-count`}
          disabled={disabled}
          readOnly={status === 'success'}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          onChange={onInput}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {view.map((ch, i) => (
          <Slot
            key={i}
            mv={mvs[i]}
            drop={drops[i]}
            char={mask && ch ? '•' : ch}
            active={focused && i === active}
            rise={rise}
            sink={Math.round(height * 0.5)}
          />
        ))}
        <motion.span className="code-slots__wash" aria-hidden="true" style={{ clipPath: washClip }}>
          <motion.span className="code-slots__check" style={{ transform: checkTransform, opacity: checkOpacity }}>
            <HugeiconsIcon icon={Tick02Icon} size={Math.round(slotSize * 0.6)} strokeWidth={2.2} />
          </motion.span>
        </motion.span>
        <motion.span
          className="code-slots__caret"
          aria-hidden="true"
          data-show={showCaret ? '' : undefined}
          style={{ transform: caretTransform }}
        >
          <span key={active} className="code-slots__caret-line" />
        </motion.span>
      </div>
      <span id={`${uid}-count`} className="code-slots__sr" aria-live="polite">
        {status === 'success' ? 'Code accepted' : `${view.filter(Boolean).length} of ${length} digits entered`}
      </span>
    </div>
  );
}

function Slot({ mv, drop, char, active, rise, sink }) {
  const [shown, setShown] = useState(char);
  if (char && char !== shown) setShown(char);
  const fill = useTransform(mv, t => `scale(${Math.max(t, 0)})`);
  const lift = useTransform([mv, drop], ([t, d]) => `translateY(${(1 - t) * rise + Math.max(d, 0) * sink}px)`);
  const ink = useTransform([mv, drop], ([t, d]) => clamp01(t) * (1 - clamp01(d / SINK_FADE)));
  return (
    <span
      className="code-slots__slot"
      data-active={active ? '' : undefined}
      data-filled={char ? '' : undefined}
      aria-hidden="true"
    >
      <motion.span className="code-slots__fill" style={{ transform: fill }} />
      {shown ? (
        <motion.span className="code-slots__digit" style={{ transform: lift, opacity: ink }}>
          {shown}
        </motion.span>
      ) : null}
    </span>
  );
}

```

### Component CSS
```css
.code-slots {
  --cs-accent: #f5f5f5;
  --cs-ink: #f5f5f5;
  --cs-slot: #27272a;
  --cs-digit: #18181b;
  --cs-danger: #ff3b30;
  --cs-size: 44px;
  --cs-height: 52px;
  --cs-gap: 8px;
  --cs-radius: 12px;
  --cs-font: 22px;

  position: relative;
  display: inline-block;
}

.code-slots__row {
  position: relative;
  display: inline-flex;
  gap: var(--cs-gap);
  cursor: text;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: opacity 200ms ease;
}

.code-slots__row[data-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.code-slots__input {
  position: absolute;
  inset: 0;
  z-index: 4;
  margin: 0;
  padding: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: transparent;
  caret-color: transparent;
  font-size: 16px;
  opacity: 0;
  cursor: inherit;
  -webkit-appearance: none;
  appearance: none;
}

.code-slots__wash {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: grid;
  place-items: center;
  border-radius: var(--cs-radius);
  background: var(--cs-accent);
  color: var(--cs-digit);
  pointer-events: none;
}

.code-slots__check {
  display: grid;
  place-items: center;
}

.code-slots__slot {
  position: relative;
  width: var(--cs-size);
  height: var(--cs-height);
  border-radius: var(--cs-radius);
  overflow: hidden;
  background: var(--cs-slot);
  transition: background-color 200ms ease;
  user-select: none;
  -webkit-user-select: none;
}

.code-slots__fill {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--cs-accent);
  transform-origin: center;
  transition: background-color 200ms ease;
}

@media (hover: hover) and (pointer: fine) {
  .code-slots__row[data-status='idle']:not([data-disabled]):hover .code-slots__slot:not([data-active]) {
    background: color-mix(in srgb, var(--cs-ink) 4%, var(--cs-slot));
  }
}

.code-slots__slot[data-active] {
  background: color-mix(in srgb, var(--cs-ink) 8%, var(--cs-slot));
}

.code-slots__row[data-status='error'] .code-slots__slot {
  background: color-mix(in srgb, var(--cs-danger) 20%, var(--cs-slot));
}

.code-slots__row[data-status='error'] .code-slots__fill {
  background: var(--cs-danger);
}

.code-slots__digit {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: grid;
  place-items: center;
  color: var(--cs-digit);
  font-family: inherit;
  font-size: var(--cs-font);
  font-weight: 600;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.code-slots__caret {
  position: absolute;
  z-index: 3;
  top: 25%;
  left: calc(var(--cs-size) / 2 - 0.75px);
  width: 1.5px;
  height: 50%;
  opacity: 0;
  pointer-events: none;
}

.code-slots__caret[data-show] {
  opacity: 1;
}

.code-slots__caret-line {
  display: block;
  width: 100%;
  height: 100%;
  background: var(--cs-ink);
  animation: code-slots-blink 1s linear infinite;
}

@keyframes code-slots-blink {
  0%,
  49.9% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}

.code-slots__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .code-slots__digit,
  .code-slots__check {
    transform: none !important;
    transition: opacity 150ms ease;
  }

  .code-slots__caret-line {
    animation: none;
  }

  .code-slots__wash {
    opacity: 0;
    transition: opacity 200ms ease;
  }

  .code-slots__row[data-status='success'] .code-slots__wash {
    opacity: 1;
  }
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.


## Integrate the <FuseButton /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: FuseButton
### Variant: JavaScript + CSS
### Dependencies: @hugeicons/react @hugeicons/core-free-icons

---

### Usage Example
```jsx
import FuseButton from './FuseButton';

<FuseButton
  label="Archive"
  doneLabel="Archived"
  undoLabel="Undo"
  color="#f5f5f5"
  background="#27272a"
  fuseColor="#f5a524"
  size="md"
  radius={22}
  undoWindow={4000}
  fuse="outline"
  fuseThickness={1.5}
  crossfadeMs={200}
  commitOn="press"
  pauseOnHover
  settle="reset"
  onCommit={() => archive(item)}
  onUndo={() => restore(item)}
  onFuseEnd={() => purge(item)}
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | string | "Archive" | The idle action. |
| undoLabel | string | "Undo" | The label while the fuse burns; the whole pill is the Undo button. |
| doneLabel | string | "Archived" | Shown with a check once the fuse burns out and settle is stay; announced to screen readers on arm. |
| icon | ReactNode | undefined | The idle glyph; an archive icon when omitted. |
| color | string | "#f5f5f5" | Ink for labels and icons; the seam and tints derive from it. |
| background | string | "#27272a" | The pill surface. |
| fuseColor | string | "#f5a524" | The lit line or ring. |
| size | "sm" | "md" | "lg" | "md" | Height 36, 44 or 52 pixels with matching type and icons. |
| radius | number | 22 | Corner radius in pixels; 22 is a full pill at the medium size. |
| undoWindow | number | 4000 | How long the fuse burns and Undo stays on offer, in milliseconds. |
| fuse | "outline" | "bottom" | "top" | "outline" | The pill rim burning down clockwise, or a line along the bottom or top edge. |
| fuseThickness | number | 1.5 | Line height or rim stroke in pixels. |
| crossfadeMs | number | 200 | Blur crossfade between faces after a pointer press. Keyboard commits swap instantly. |
| commitOn | "press" | "fuseEnd" | "press" | When onCommit fires: at the press, with Undo as the revert, or only once the fuse burns out. |
| pauseOnHover | boolean | true | Leaving and coming back with a mouse freezes the fuse until the pointer leaves again. |
| settle | "reset" | "stay" | "reset" | After the fuse ends: return to the idle face, or stay on a terminal done face until remounted. |
| disabled | boolean | false | Dims the idle face and ignores presses. Undo stays available while armed. |
| onCommit | (reason: "press" | "fuseEnd") => void | - | The action. |
| onUndo | () => void | - | Called when Undo or Escape runs the action back. |
| onFuseEnd | () => void | - | Called when the window closes without an undo. |
| onPhaseChange | (phase: "idle" | "armed" | "settled") => void | - | Called on every phase change. |
| type | "button" | "submit" | "reset" | "button" | Type of the idle button. |
| className | string | "" | Extra classes for the pill. |

### Full Component Source
```jsx
'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Archive02Icon, Tick02Icon, Undo02Icon } from '@hugeicons/core-free-icons';

import './FuseButton.css';

const LINE = [{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }];
const OUTLINE = [{ strokeDashoffset: 0 }, { strokeDashoffset: -1 }];
const SIZES = {
  sm: { height: 36, font: 13, icon: 14, px: 16 },
  md: { height: 44, font: 14, icon: 15, px: 20 },
  lg: { height: 52, font: 15, icon: 17, px: 24 }
};

export default function FuseButton({
  label = 'Archive',
  undoLabel = 'Undo',
  doneLabel = 'Archived',
  icon,
  color = '#f5f5f5',
  background = '#27272a',
  fuseColor = '#f5a524',
  size = 'md',
  radius = 22,
  undoWindow = 4000,
  fuse = 'outline',
  fuseThickness = 1.5,
  crossfadeMs = 200,
  commitOn = 'press',
  pauseOnHover = true,
  settle = 'reset',
  disabled = false,
  onCommit,
  onUndo,
  onFuseEnd,
  onPhaseChange,
  className = '',
  type = 'button'
}) {
  const [phase, setPhase] = useState('idle');
  const [instant, setInstant] = useState(false);
  const rootRef = useRef(null);
  const idleRef = useRef(null);
  const undoRef = useRef(null);
  const lineRef = useRef(null);
  const rimRef = useRef(null);
  const anim = useRef(null);
  const pause = useRef({ hover: false, hidden: false, canHoverPause: false });
  const lastInput = useRef('pointer');
  const windowRef = useRef(undoWindow);
  const latest = useRef({ commitOn, settle });
  latest.current = { onCommit, onUndo, onFuseEnd, onPhaseChange, commitOn, settle };
  const statusId = useId();
  const preset = SIZES[size] || SIZES.md;

  const go = next => {
    setInstant(lastInput.current === 'keyboard');
    setPhase(next);
    latest.current.onPhaseChange?.(next);
  };

  const syncPlayState = () => {
    const a = anim.current;
    if (!a) return;
    const { hover, hidden } = pause.current;
    if (hover || hidden) {
      if (a.playState === 'running') a.pause();
    } else if (a.playState === 'paused') {
      a.play();
    }
  };

  const light = (from = 0) => {
    const el = fuse === 'outline' ? rimRef.current : lineRef.current;
    if (!el) return;
    anim.current?.cancel();
    const a = el.animate(fuse === 'outline' ? OUTLINE : LINE, {
      duration: windowRef.current,
      easing: 'linear',
      fill: 'forwards'
    });
    if (from) a.currentTime = from;
    a.onfinish = () => {
      const l = latest.current;
      l.onFuseEnd?.();
      if (l.commitOn === 'fuseEnd') l.onCommit?.('fuseEnd');
      lastInput.current = 'pointer';
      go(l.settle === 'stay' ? 'settled' : 'idle');
    };
    anim.current = a;
    syncPlayState();
  };

  const arm = () => {
    if (disabled || phase !== 'idle') return;
    windowRef.current = undoWindow;
    light();
    pause.current.canHoverPause = false;
    pause.current.hover = false;
    if (commitOn === 'press') onCommit?.('press');
    go('armed');
  };

  const undo = () => {
    if (phase !== 'armed') return;
    const a = anim.current;
    if (a) {
      a.onfinish = null;
      a.pause();
    }
    onUndo?.();
    go('idle');
  };

  useEffect(() => {
    const inside = rootRef.current?.contains(document.activeElement);
    if (phase === 'armed') undoRef.current?.focus({ preventScroll: true });
    else if (inside) (phase === 'idle' ? idleRef.current : rootRef.current)?.focus({ preventScroll: true });
  }, [phase]);

  useEffect(() => {
    const onVisibility = () => {
      pause.current.hidden = document.hidden;
      syncPlayState();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      anim.current?.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const a = anim.current;
    if (!a || phase !== 'armed') return;
    light(Number(a.currentTime) || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fuse]);

  useEffect(() => {
    if (pauseOnHover) return;
    pause.current.hover = false;
    syncPlayState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pauseOnHover]);

  const handlePointerDown = e => {
    lastInput.current = 'pointer';
    const pressable = phase === 'armed' || (phase === 'idle' && !disabled);
    if (e.button === 0 && pressable && rootRef.current) rootRef.current.dataset.pressed = '';
  };
  const release = () => {
    if (rootRef.current) delete rootRef.current.dataset.pressed;
  };
  const handlePointerEnter = e => {
    if (pauseOnHover && e.pointerType === 'mouse' && pause.current.canHoverPause) {
      pause.current.hover = true;
      syncPlayState();
    }
  };
  const handlePointerLeave = e => {
    release();
    if (e.pointerType !== 'mouse') return;
    pause.current.canHoverPause = true;
    pause.current.hover = false;
    syncPlayState();
  };
  const handleKeyDown = e => {
    if (e.key === 'Enter' || e.key === ' ') lastInput.current = 'keyboard';
    if (e.key === 'Escape' && phase === 'armed') {
      e.preventDefault();
      lastInput.current = 'keyboard';
      undo();
    }
  };

  const actionIcon = icon ?? <HugeiconsIcon icon={Archive02Icon} size={preset.icon} strokeWidth={1.8} />;
  const line = <i ref={lineRef} className="fuse-button__fuse" aria-hidden="true" />;

  return (
    <span
      ref={rootRef}
      tabIndex={-1}
      className={`fuse-button${className ? ` ${className}` : ''}`}
      data-phase={phase}
      data-fuse={fuse}
      data-instant={instant ? '' : undefined}
      aria-disabled={phase === 'settled' || undefined}
      style={{
        '--fb-ink': color,
        '--fb-bg': background,
        '--fb-fuse': fuseColor,
        '--fb-fuse-h': `${fuseThickness}px`,
        '--fb-radius': `${radius}px`,
        '--fb-fade': `${crossfadeMs}ms`,
        '--fb-h': `${preset.height}px`,
        '--fb-fs': `${preset.font}px`,
        '--fb-icon': `${preset.icon}px`,
        '--fb-px': `${preset.px}px`
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={release}
      onPointerCancel={release}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={idleRef}
        type={type}
        className="fuse-button__face fuse-button__idle"
        disabled={disabled}
        inert={phase !== 'idle'}
        onClick={arm}
      >
        <span className="fuse-button__icon" aria-hidden="true">
          {actionIcon}
        </span>
        {label}
      </button>
      <button
        ref={undoRef}
        type="button"
        className="fuse-button__face fuse-button__undo"
        aria-describedby={statusId}
        aria-keyshortcuts="Escape"
        inert={phase !== 'armed'}
        onClick={undo}
      >
        <span className="fuse-button__icon fuse-button__icon--undo" aria-hidden="true">
          <HugeiconsIcon icon={Undo02Icon} size={preset.icon} strokeWidth={2} />
        </span>
        {undoLabel}
        {fuse !== 'outline' ? line : null}
      </button>
      <span className="fuse-button__face fuse-button__settled" inert={phase !== 'settled'}>
        <span className="fuse-button__icon" aria-hidden="true">
          <HugeiconsIcon icon={Tick02Icon} size={preset.icon} strokeWidth={2.2} />
        </span>
        {doneLabel}
      </span>
      {fuse === 'outline' ? (
        <svg className="fuse-button__rim" aria-hidden="true">
          <rect ref={rimRef} pathLength="1" />
        </svg>
      ) : null}
      <span className="fuse-button__status" id={statusId} role="status" aria-live="polite">
        {phase === 'idle' ? '' : doneLabel}
      </span>
    </span>
  );
}

```

### Component CSS
```css
.fuse-button {
  --fb-ink: #f5f5f5;
  --fb-bg: #27272a;
  --fb-fuse: #f5a524;
  --fb-fuse-h: 1.5px;
  --fb-radius: 22px;
  --fb-fade: 200ms;
  --fb-press: 0.97;
  --fb-h: 44px;
  --fb-fs: 14px;
  --fb-icon: 15px;
  --fb-px: 20px;
  --fb-ease-out: cubic-bezier(0.23, 1, 0.32, 1);

  position: relative;
  display: inline-grid;
  grid-template-columns: minmax(0, 1fr);
  height: var(--fb-h);
  border-radius: var(--fb-radius);
  background: var(--fb-bg);
  color: var(--fb-ink);
  font-family: inherit;
  font-size: var(--fb-fs);
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0.01em;
  overflow: hidden;
  isolation: isolate;
  outline: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  transition: transform 160ms var(--fb-ease-out);
}

.fuse-button[data-pressed] {
  transform: scale(var(--fb-press));
}

.fuse-button:has(:focus-visible) {
  outline: 2px solid color-mix(in srgb, var(--fb-ink) 60%, transparent);
  outline-offset: 3px;
}

.fuse-button__idle:focus-visible,
.fuse-button__undo:focus-visible {
  outline: none;
}

@supports not selector(:has(a)) {
  .fuse-button__idle:focus-visible,
  .fuse-button__undo:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--fb-ink) 60%, transparent);
    outline-offset: -3px;
  }
}

.fuse-button__face {
  position: relative;
  grid-area: 1 / 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 100%;
  min-width: 0;
  margin: 0;
  padding: 0 var(--fb-px);
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  letter-spacing: inherit;
  white-space: nowrap;
  cursor: pointer;
  opacity: 0;
  filter: blur(2px);
  visibility: hidden;
  transition:
    opacity var(--fb-fade) ease,
    filter var(--fb-fade) ease,
    visibility 0s linear var(--fb-fade),
    background-color 160ms ease;
}

.fuse-button[data-phase='idle'] .fuse-button__idle,
.fuse-button[data-phase='armed'] .fuse-button__undo,
.fuse-button[data-phase='settled'] .fuse-button__settled {
  opacity: 1;
  filter: blur(0);
  visibility: visible;
  transition-delay: 0s;
}

.fuse-button[data-instant] .fuse-button__face {
  transition-duration: 0s;
}

.fuse-button__idle:disabled,
.fuse-button__settled {
  cursor: default;
}

.fuse-button[data-phase='idle']:has(.fuse-button__idle:disabled) {
  opacity: 0.55;
}

.fuse-button__icon {
  display: inline-flex;
  width: var(--fb-icon);
  height: var(--fb-icon);
}

.fuse-button__icon svg {
  width: 100%;
  height: 100%;
}

.fuse-button__icon--undo {
  transform: rotate(-70deg);
  transition: transform var(--fb-fade) var(--fb-ease-out);
}

.fuse-button[data-phase='armed'] .fuse-button__icon--undo {
  transform: rotate(0deg);
}

.fuse-button__fuse {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: var(--fb-fuse-h);
  background: var(--fb-fuse);
  box-shadow: 0 0 6px color-mix(in srgb, var(--fb-fuse) 55%, transparent);
  transform-origin: left center;
  pointer-events: none;
}

.fuse-button[data-fuse='top'] .fuse-button__fuse {
  bottom: auto;
  top: 0;
}

.fuse-button__rim {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
  opacity: 0;
  filter: drop-shadow(0 0 3px color-mix(in srgb, var(--fb-fuse) 60%, transparent));
  transition: opacity var(--fb-fade) ease;
}

.fuse-button[data-phase='armed'] .fuse-button__rim {
  opacity: 1;
}

.fuse-button[data-instant] .fuse-button__rim {
  transition-duration: 0s;
}

.fuse-button__rim rect {
  x: calc(var(--fb-fuse-h) / 2);
  y: calc(var(--fb-fuse-h) / 2);
  width: calc(100% - var(--fb-fuse-h));
  height: calc(100% - var(--fb-fuse-h));
  rx: max(0px, calc(var(--fb-radius) - var(--fb-fuse-h) / 2));
  fill: none;
  stroke: var(--fb-fuse);
  stroke-width: var(--fb-fuse-h);
  stroke-linecap: round;
  stroke-dasharray: 1;
}

.fuse-button__status {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

@media (hover: hover) and (pointer: fine) {
  .fuse-button__idle:not(:disabled):hover,
  .fuse-button__undo:hover {
    background: color-mix(in srgb, var(--fb-ink) 7%, transparent);
  }
}

@media (prefers-reduced-motion: reduce) {
  .fuse-button[data-pressed] {
    transform: none;
  }

  .fuse-button .fuse-button__face {
    filter: none;
    transition:
      opacity var(--fb-fade) ease,
      visibility 0s linear var(--fb-fade);
  }

  .fuse-button .fuse-button__icon--undo {
    transform: none;
    transition: none;
  }
}

@media (prefers-contrast: more) {
  .fuse-button {
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--fb-ink) 40%, transparent);
  }
}

@media (forced-colors: active) {
  .fuse-button__fuse {
    background: Highlight;
  }

  .fuse-button__rim rect {
    stroke: Highlight;
  }
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.

## Integrate the <WarmTooltip /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: WarmTooltip
### Variant: JavaScript + CSS
### Dependencies: motion

---

### Usage Example
```jsx
import WarmTooltip, { WarmTooltipGroup } from './WarmTooltip';

<WarmTooltipGroup delay={400} warmWindow={300} travel={320} lean={0}>
  <WarmTooltip
    content="Bold"
    shortcut="⌘B"
    side="top"
    surfaceColor="#f5f5f5"
    inkColor="#18181b"
    size="md"
    radius={8}
    gap={8}
    arrow
    popDuration={160}
    popScale={0.94}
    popBlur={4}
    showFuse={false}
  >
    <button type="button" aria-label="Bold">
      <BoldIcon />
    </button>
  </WarmTooltip>
  <WarmTooltip content="Italic" shortcut="⌘I">
    <button type="button" aria-label="Italic">
      <ItalicIcon />
    </button>
  </WarmTooltip>
  <WarmTooltip content="Add link" shortcut="⌘K">
    <button type="button" aria-label="Link">
      <LinkIcon />
    </button>
  </WarmTooltip>
</WarmTooltipGroup>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| content | ReactNode | - | The label. Keep it to a few words. |
| shortcut | ReactNode | undefined | Optional keyboard shortcut, drawn as a keycap beside the label. |
| children | ReactElement | - | The trigger. It only receives aria-describedby; its own handlers and focus ring stay untouched. |
| side | "top" | "bottom" | "left" | "right" | "top" | The edge the label hangs from; also where the fuse runs and the pop originates. |
| delay | number | 400 | How long a cold open waits, in milliseconds. Inherits the group value when omitted. |
| warmWindow | number | 300 | How long after this label closes the group stays warm. Inherits the group value when omitted. |
| surfaceColor | string | "#f5f5f5" | Label background, arrow and fuse. |
| inkColor | string | "#18181b" | Label text; the keycap is tinted from it. |
| size | "sm" | "md" | "lg" | "md" | Font size and padding of the label. |
| radius | number | 8 | Corner radius of the label in pixels. |
| gap | number | 8 | Distance between the trigger edge and the label. |
| arrow | boolean | true | Shows the pointer on the anchored edge. |
| popDuration | number | 160 | Cold pop-in time in milliseconds; the exit takes 0.8 of it. |
| popScale | number | 0.94 | Scale the label pops from. 1 makes it a fade. |
| popBlur | number | 4 | Blur in pixels the label arrives through. |
| showFuse | boolean | false | Draws a thin line along the trigger edge that fills over the delay, or over the long press on touch. |
| longPress | number | 500 | Hold time in milliseconds that opens the label on touch; the click that follows is swallowed. |
| disabled | boolean | false | No open path; an open label closes. |
| className | string | "" | Extra classes for the trigger wrapper. |
| WarmTooltipGroup | component | - | Wraps a toolbar so its tooltips share one label. Props: delay (400), warmWindow (300), travel (320, how long the label takes to glide to the next trigger; 0 hops), lean (0, degrees of tilt while gliding), onWarmChange. Its ref exposes reset(). |

### Full Component Source
```jsx
'use client';

import {
  cloneElement,
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { createPortal } from 'react-dom';
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity
} from 'motion/react';

import './WarmTooltip.css';

const EASE_OUT = [0.23, 1, 0.32, 1];
const LEAN_SPRING = { stiffness: 260, damping: 22, mass: 0.4 };
const FULL_LEAN_SPEED = 1200;
const SIGN = { top: 1, bottom: -1, left: -1, right: 1 };
const ORIGIN = { top: 'center bottom', bottom: 'center top', left: 'right center', right: 'left center' };
const SIZES = {
  sm: { font: 11.5, px: 8, py: 5 },
  md: { font: 12.5, px: 10, py: 6 },
  lg: { font: 13.5, px: 12, py: 7 }
};
const MARGIN = 8;
const HOLD_SLOP = 10;
const SWAP = 0.14;
const SWAP_SHIFT = 10;
const RISE = 4;
const GRACE = 80;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());
const horizontal = side => side === 'top' || side === 'bottom';

const anchorOf = (rect, side, gap) => {
  if (side === 'top') return [rect.left + rect.width / 2, rect.top - gap];
  if (side === 'bottom') return [rect.left + rect.width / 2, rect.bottom + gap];
  if (side === 'left') return [rect.left - gap, rect.top + rect.height / 2];
  return [rect.right + gap, rect.top + rect.height / 2];
};

const layoutOf = (x, y, width, height, side) => {
  if (horizontal(side)) {
    const X = clamp(x - width / 2, MARGIN, Math.max(MARGIN, window.innerWidth - MARGIN - width));
    return { X, Y: side === 'top' ? y - height : y };
  }
  const Y = clamp(y - height / 2, MARGIN, Math.max(MARGIN, window.innerHeight - MARGIN - height));
  return { X: side === 'left' ? x - width : x, Y };
};

const LAYER = {
  enter: ({ dir, across }) => ({
    opacity: dir === 0 ? 1 : 0,
    x: across ? 0 : SWAP_SHIFT * dir,
    y: across ? SWAP_SHIFT * dir : 0,
    filter: dir === 0 ? 'blur(0px)' : 'blur(3px)'
  }),
  show: { opacity: 1, x: 0, y: 0, filter: 'blur(0px)' },
  exit: ({ dir, across }) => ({
    opacity: 0,
    x: across ? 0 : -SWAP_SHIFT * dir,
    y: across ? -SWAP_SHIFT * dir : 0,
    filter: 'blur(3px)'
  })
};

const GroupContext = createContext(null);

export const WarmTooltipGroup = forwardRef(function WarmTooltipGroup(
  { delay = 400, warmWindow = 300, travel = 320, lean = 0, onWarmChange, children },
  ref
) {
  const reduce = useReducedMotion();
  const id = useId();
  const [current, setCurrent] = useState(null);
  const [state, setState] = useState('closed');
  const st = useRef({
    state: 'closed',
    current: null,
    mode: 'cold',
    instant: false,
    warmUntil: -Infinity,
    warm: false,
    swap: { dir: 0, across: false },
    closeTimer: undefined,
    leaveTimer: undefined,
    warmTimer: undefined
  });
  const textRef = useRef(null);
  const api = useRef({ show: () => {}, hide: () => {} });

  const ax = useMotionValue(0);
  const ay = useMotionValue(0);
  const w = useMotionValue(0);
  const h = useMotionValue(0);
  const presence = useMotionValue(0);
  const vx = useVelocity(ax);
  const vy = useVelocity(ay);
  const speed = useTransform([vx, vy], ([a, b]) =>
    st.current.current && !horizontal(st.current.current.side) ? b : a
  );
  const leanUnit = useSpring(
    useTransform(speed, [-FULL_LEAN_SPEED, 0, FULL_LEAN_SPEED], [1, 0, -1], { clamp: true }),
    LEAN_SPRING
  );
  const leanDeg = reduce ? 0 : lean;

  const place = useTransform([ax, ay, w, h], ([x, y, width, height]) => {
    const side = st.current.current ? st.current.current.side : 'top';
    const { X, Y } = layoutOf(x, y, width, height, side);
    return `translate(${X}px, ${Y}px)`;
  });
  const arrowAt = useTransform([ax, ay, w, h], ([x, y, width, height]) => {
    const side = st.current.current ? st.current.current.side : 'top';
    const { X, Y } = layoutOf(x, y, width, height, side);
    return horizontal(side) ? clamp(x - X, 10, width - 10) : clamp(y - Y, 10, height - 10);
  });
  const pop = useTransform([presence, leanUnit], ([p, l]) => {
    const c = st.current.current;
    const side = c ? c.side : 'top';
    if (reduce || !c) return 'none';
    const scale = c.popScale + (1 - c.popScale) * p;
    const rise = (1 - p) * RISE * SIGN[side] * (side === 'left' ? -1 : 1);
    const rotate = l * leanDeg * SIGN[side];
    const tx = horizontal(side) ? 0 : rise;
    const ty = horizontal(side) ? rise : 0;
    return `translate(${tx}px, ${ty}px) scale(${scale}) rotate(${rotate}deg)`;
  });
  const blur = useTransform(presence, p => {
    const c = st.current.current;
    return reduce || !c ? 'none' : `blur(${c.popBlur * (1 - p)}px)`;
  });

  const isWarm = () => st.current.state !== 'closed' || now() < st.current.warmUntil;
  const notify = () => {
    const next = isWarm();
    if (next === st.current.warm) return;
    st.current.warm = next;
    onWarmChange?.(next);
  };

  const finishClose = () => {
    st.current.state = 'closed';
    st.current.current = null;
    setState('closed');
    setCurrent(null);
    notify();
  };

  api.current.show = (payload, mode) => {
    clearTimeout(st.current.closeTimer);
    clearTimeout(st.current.leaveTimer);
    const prev = st.current.current;
    const fresh = st.current.state === 'closed';
    if (prev && prev.id !== payload.id) {
      const [px, py] = anchorOf(prev.trigger.getBoundingClientRect(), prev.side, prev.gap);
      const [nx, ny] = anchorOf(payload.trigger.getBoundingClientRect(), payload.side, payload.gap);
      const across = !horizontal(payload.side);
      st.current.swap = { dir: Math.sign(across ? ny - py : nx - px) || 1, across };
    } else {
      st.current.swap = { dir: 0, across: !horizontal(payload.side) };
    }
    st.current.mode = fresh ? mode : mode === 'instant' ? 'instant' : 'move';
    st.current.instant = mode === 'instant';
    st.current.current = payload;
    st.current.state = 'open';
    setCurrent(payload);
    setState('open');
    notify();
  };

  const beginClose = instant => {
    const c = st.current.current;
    if (!c || st.current.state !== 'open') return;
    st.current.state = 'closing';
    setState('closing');
    st.current.warmUntil = now() + c.warmWindow;
    clearTimeout(st.current.warmTimer);
    st.current.warmTimer = setTimeout(notify, c.warmWindow + 1);
    if (instant) {
      presence.jump(0);
      finishClose();
      return;
    }
    const closeMs = Math.round(c.popDuration * 0.8);
    animate(presence, 0, { duration: closeMs / 1000, ease: EASE_OUT });
    st.current.closeTimer = setTimeout(finishClose, closeMs);
  };

  api.current.hide = (tooltipId, instant) => {
    const c = st.current.current;
    if (!c || c.id !== tooltipId || st.current.state !== 'open') return;
    clearTimeout(st.current.leaveTimer);
    if (instant || st.current.instant) {
      beginClose(true);
      return;
    }
    st.current.leaveTimer = setTimeout(() => beginClose(false), GRACE);
  };

  const group = useMemo(
    () => ({
      id,
      delay,
      warmWindow,
      activeId: current ? current.id : null,
      isWarm,
      show: (payload, mode) => api.current.show(payload, mode),
      hide: (tooltipId, instant) => api.current.hide(tooltipId, instant),
      reset: () => {
        if (st.current.current) api.current.hide(st.current.current.id, true);
        st.current.warmUntil = -Infinity;
        clearTimeout(st.current.warmTimer);
        notify();
      }
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, delay, warmWindow, current]
  );
  useImperativeHandle(ref, () => ({ reset: group.reset }), [group]);

  useLayoutEffect(() => {
    const c = st.current.current;
    const text = textRef.current;
    if (!c || !text || state !== 'open') return;
    const [tx, ty] = anchorOf(c.trigger.getBoundingClientRect(), c.side, c.gap);
    const tw = text.offsetWidth + c.px * 2;
    const th = text.offsetHeight + c.py * 2;
    const mode = st.current.mode;
    if (mode === 'move' && !reduce && travel > 0) {
      const spring = { type: 'spring', duration: travel / 1000, bounce: 0.1 };
      animate(ax, tx, spring);
      animate(ay, ty, spring);
      animate(w, tw, spring);
      animate(h, th, spring);
      animate(presence, 1, { duration: 0.12, ease: EASE_OUT });
      return;
    }
    ax.jump(tx);
    ay.jump(ty);
    w.jump(tw);
    h.jump(th);
    if (mode === 'cold') {
      presence.jump(0);
      animate(presence, 1, { duration: c.popDuration / 1000, ease: EASE_OUT });
    } else {
      presence.jump(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, state]);

  useEffect(() => {
    if (state === 'closed') return undefined;
    let raf = 0;
    const follow = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const c = st.current.current;
        if (!c) return;
        const [tx, ty] = anchorOf(c.trigger.getBoundingClientRect(), c.side, c.gap);
        ax.jump(tx);
        ay.jump(ty);
      });
    };
    const onHidden = () => {
      if (document.visibilityState === 'hidden' && st.current.current) api.current.hide(st.current.current.id, true);
    };
    window.addEventListener('scroll', follow, { capture: true, passive: true });
    window.addEventListener('resize', follow);
    document.addEventListener('visibilitychange', onHidden);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', follow, { capture: true });
      window.removeEventListener('resize', follow);
      document.removeEventListener('visibilitychange', onHidden);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(
    () => () => {
      clearTimeout(st.current.closeTimer);
      clearTimeout(st.current.leaveTimer);
      clearTimeout(st.current.warmTimer);
    },
    []
  );

  const canPortal = typeof document !== 'undefined';
  const side = current ? current.side : 'top';
  const arrowStyle = horizontal(side) ? { left: arrowAt } : { top: arrowAt };

  return (
    <GroupContext.Provider value={group}>
      {children}
      {state !== 'closed' && current && canPortal
        ? createPortal(
            <motion.span
              id={id}
              role="tooltip"
              className="warm-tooltip"
              data-side={side}
              style={{
                transform: place,
                width: w,
                height: h,
                '--wt-surface': current.surfaceColor,
                '--wt-ink': current.inkColor,
                '--wt-radius': `${current.radius}px`,
                '--wt-font': `${current.font}px`,
                '--wt-origin': ORIGIN[side]
              }}
            >
              <motion.span className="warm-tooltip__box" style={{ transform: pop, opacity: presence, filter: blur }}>
                <AnimatePresence initial={false} custom={st.current.swap}>
                  <motion.span
                    key={current.id}
                    className="warm-tooltip__layer"
                    custom={st.current.swap}
                    variants={LAYER}
                    initial="enter"
                    animate="show"
                    exit="exit"
                    transition={{ duration: reduce ? 0 : SWAP, ease: EASE_OUT }}
                  >
                    <span
                      ref={el => {
                        if (el) textRef.current = el;
                      }}
                      className="warm-tooltip__text"
                    >
                      {current.content}
                      {current.shortcut ? <kbd className="warm-tooltip__kbd">{current.shortcut}</kbd> : null}
                    </span>
                  </motion.span>
                </AnimatePresence>
                {current.arrow ? (
                  <motion.span className="warm-tooltip__arrow" data-side={side} style={arrowStyle} aria-hidden="true" />
                ) : null}
              </motion.span>
            </motion.span>,
            document.body
          )
        : null}
    </GroupContext.Provider>
  );
});

function Trigger({
  content,
  shortcut,
  children,
  side,
  delay,
  warmWindow,
  surfaceColor,
  inkColor,
  size,
  radius,
  gap,
  arrow,
  popDuration,
  popScale,
  popBlur,
  showFuse,
  longPress,
  disabled,
  className
}) {
  const group = useContext(GroupContext);
  const id = useId();
  const triggerRef = useRef(null);
  const [fuse, setFuse] = useState('idle');
  const [pressing, setPressing] = useState(false);
  const t = useRef({ open: undefined, press: undefined, press0: null, suppressClick: false });
  const preset = SIZES[size] || SIZES.md;
  const coldDelay = delay ?? group.delay;
  const active = group.activeId === id;

  const payload = () => ({
    id,
    trigger: triggerRef.current,
    content,
    shortcut,
    side,
    gap,
    arrow,
    surfaceColor,
    inkColor,
    radius,
    font: preset.font,
    px: preset.px,
    py: preset.py,
    popDuration,
    popScale,
    popBlur,
    warmWindow: warmWindow ?? group.warmWindow
  });

  const hide = instant => {
    clearTimeout(t.current.open);
    setFuse('idle');
    group.hide(id, instant);
  };

  const arm = () => {
    if (group.isWarm()) {
      group.show(payload(), 'warm');
      return;
    }
    setFuse('arming');
    t.current.open = setTimeout(() => {
      setFuse('idle');
      group.show(payload(), 'cold');
    }, coldDelay);
  };

  const cancelPress = () => {
    clearTimeout(t.current.press);
    if (!t.current.press0) return;
    t.current.press0 = null;
    setPressing(false);
    setFuse('idle');
  };

  useEffect(() => {
    if (disabled) {
      cancelPress();
      hide(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);

  useEffect(() => {
    if (!active) return undefined;
    const onOutside = e => {
      if (triggerRef.current && !triggerRef.current.contains(e.target)) hide(false);
    };
    document.addEventListener('pointerdown', onOutside, true);
    return () => document.removeEventListener('pointerdown', onOutside, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(
    () => () => {
      clearTimeout(t.current.open);
      clearTimeout(t.current.press);
    },
    []
  );

  const handlers = disabled
    ? {}
    : {
        onPointerEnter: e => {
          if (e.pointerType !== 'touch' && e.buttons === 0) arm();
        },
        onPointerLeave: e => {
          if (e.pointerType !== 'touch') hide(false);
        },
        onPointerDown: e => {
          if (e.pointerType === 'mouse') {
            hide(false);
            return;
          }
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch {}
          t.current.press0 = { x: e.clientX, y: e.clientY, id: e.pointerId };
          setPressing(true);
          setFuse('arming');
          t.current.press = setTimeout(() => {
            t.current.suppressClick = true;
            t.current.press0 = null;
            setPressing(false);
            setFuse('idle');
            group.show(payload(), 'cold');
          }, longPress);
        },
        onPointerMove: e => {
          const p = t.current.press0;
          if (p && p.id === e.pointerId && Math.hypot(e.clientX - p.x, e.clientY - p.y) > HOLD_SLOP) cancelPress();
        },
        onPointerUp: cancelPress,
        onPointerCancel: cancelPress,
        onContextMenu: e => {
          if (t.current.press0) e.preventDefault();
        },
        onClickCapture: e => {
          if (!t.current.suppressClick) return;
          t.current.suppressClick = false;
          e.preventDefault();
          e.stopPropagation();
        },
        onFocus: e => {
          if (e.target.matches?.(':focus-visible')) group.show(payload(), 'instant');
        },
        onBlur: () => hide(true),
        onKeyDown: e => {
          if (e.key === 'Escape') hide(true);
        }
      };

  const described = children.props['aria-describedby'];

  return (
    <span
      ref={triggerRef}
      className={`warm-tooltip__trigger${className ? ` ${className}` : ''}`}
      data-pressing={pressing ? '' : undefined}
      style={{ '--wt-surface': surfaceColor, '--wt-fuse-ms': `${t.current.press0 ? longPress : coldDelay}ms` }}
      {...handlers}
    >
      {cloneElement(children, { 'aria-describedby': active ? group.id : described })}
      {showFuse ? <span className="warm-tooltip__fuse" data-side={side} data-fuse={fuse} aria-hidden="true" /> : null}
    </span>
  );
}

export default function WarmTooltip({
  content,
  shortcut,
  children,
  side = 'top',
  delay,
  warmWindow,
  surfaceColor = '#f5f5f5',
  inkColor = '#18181b',
  size = 'md',
  radius = 8,
  gap = 8,
  arrow = true,
  popDuration = 160,
  popScale = 0.94,
  popBlur = 4,
  showFuse = false,
  longPress = 500,
  disabled = false,
  className = ''
}) {
  const context = useContext(GroupContext);
  const props = {
    content,
    shortcut,
    children,
    side,
    delay,
    warmWindow,
    surfaceColor,
    inkColor,
    size,
    radius,
    gap,
    arrow,
    popDuration,
    popScale,
    popBlur,
    showFuse,
    longPress,
    disabled,
    className
  };
  if (context) return <Trigger {...props} />;
  return (
    <WarmTooltipGroup delay={delay} warmWindow={warmWindow}>
      <Trigger {...props} />
    </WarmTooltipGroup>
  );
}

```

### Component CSS
```css
.warm-tooltip__trigger {
  --wt-surface: #f5f5f5;
  --wt-fuse-ms: 400ms;
  --wt-ease-out: cubic-bezier(0.23, 1, 0.32, 1);

  position: relative;
  display: inline-flex;
  vertical-align: middle;
  touch-action: manipulation;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
}

.warm-tooltip__trigger[data-pressing] {
  user-select: none;
  -webkit-user-select: none;
}

.warm-tooltip__fuse {
  position: absolute;
  left: 4px;
  right: 4px;
  height: 2px;
  border-radius: 1px;
  background: var(--wt-surface);
  opacity: 0;
  transform: scaleX(0);
  transform-origin: left center;
  pointer-events: none;
  transition:
    transform 125ms var(--wt-ease-out),
    opacity 125ms var(--wt-ease-out);
}

.warm-tooltip__fuse[data-side='top'] {
  top: -4px;
}

.warm-tooltip__fuse[data-side='bottom'] {
  bottom: -4px;
}

.warm-tooltip__fuse[data-side='left'],
.warm-tooltip__fuse[data-side='right'] {
  top: 4px;
  bottom: 4px;
  left: auto;
  right: auto;
  width: 2px;
  height: auto;
  transform: scaleY(0);
  transform-origin: center top;
}

.warm-tooltip__fuse[data-side='left'] {
  left: -4px;
}

.warm-tooltip__fuse[data-side='right'] {
  right: -4px;
}

.warm-tooltip__fuse[data-fuse='arming'] {
  opacity: 1;
  transform: scaleX(1);
  transition:
    transform var(--wt-fuse-ms) linear,
    opacity 80ms var(--wt-ease-out);
}

.warm-tooltip__fuse[data-side='left'][data-fuse='arming'],
.warm-tooltip__fuse[data-side='right'][data-fuse='arming'] {
  transform: scaleY(1);
}

.warm-tooltip {
  --wt-surface: #f5f5f5;
  --wt-ink: #18181b;
  --wt-radius: 8px;
  --wt-font: 12.5px;
  --wt-origin: center bottom;

  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  display: block;
  pointer-events: none;
  font-family: inherit;
}

.warm-tooltip__box {
  position: absolute;
  inset: 0;
  border-radius: var(--wt-radius);
  background: var(--wt-surface);
  color: var(--wt-ink);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.12),
    0 8px 24px -8px rgba(0, 0, 0, 0.45);
  transform-origin: var(--wt-origin);
}

.warm-tooltip__layer {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.warm-tooltip__text {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: var(--wt-font);
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -0.01em;
  white-space: nowrap;
}

.warm-tooltip__kbd {
  display: inline-flex;
  align-items: center;
  height: 1.55em;
  padding: 0 0.45em;
  border-radius: 0.4em;
  background: color-mix(in srgb, var(--wt-ink) 9%, transparent);
  box-shadow: inset 0 -1px 0 color-mix(in srgb, var(--wt-ink) 12%, transparent);
  color: color-mix(in srgb, var(--wt-ink) 72%, transparent);
  font-family: inherit;
  font-size: 0.86em;
  font-weight: 500;
  letter-spacing: 0.02em;
  font-variant-numeric: tabular-nums;
}

.warm-tooltip__arrow {
  position: absolute;
  width: 8px;
  height: 8px;
  margin: -4px;
  border-radius: 2px;
  background: var(--wt-surface);
  transform: rotate(45deg);
}

.warm-tooltip__arrow[data-side='top'] {
  bottom: 1px;
}

.warm-tooltip__arrow[data-side='bottom'] {
  top: 1px;
}

.warm-tooltip__arrow[data-side='left'] {
  right: 1px;
}

.warm-tooltip__arrow[data-side='right'] {
  left: 1px;
}

@media (prefers-contrast: more) {
  .warm-tooltip__box {
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--wt-ink) 40%, transparent);
  }
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.


## Integrate the <SlideCommit /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: SlideCommit
### Variant: JavaScript + CSS
### Dependencies: motion @hugeicons/react @hugeicons/core-free-icons

---

### Usage Example
```jsx
import SlideCommit from './SlideCommit';

<SlideCommit
  label="Slide to pay"
  doneLabel="Paid"
  errorLabel="Payment failed"
  onConfirm={() => api.pay(order)}
  onDone={() => console.log('paid')}
  onError={reason => console.log(reason)}
  trackColor="#262626"
  handleColor="#f5f5f5"
  successColor="#22c55e"
  dangerColor="#e5484d"
  width={280}
  height={56}
  radius={28}
  speed={50}
  returnBounce={0.38}
  landingDip={0.026}
  holdMs={1500}
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | ReactNode | "Slide to pay" | The instruction centred in the pill; the capsule wipes it as you drag. |
| doneLabel | ReactNode | "Paid" | The words beside the check once confirmed. |
| errorLabel | ReactNode | "Payment failed" | Replaces the instruction, in the danger colour, after a rejected promise. |
| onConfirm | () => void | Promise<unknown> | - | Called when the handle reaches the end. Return a promise to show the spinner; it unfurls on resolve and springs home on reject. |
| onDone | () => void | - | Called when the done pill unfurls. |
| onError | (reason: unknown) => void | - | Called with the rejection reason; the component swallows it otherwise. |
| trackColor | string | "#262626" | The pill behind the handle. |
| handleColor | string | "#f5f5f5" | The handle and the ground it paints; the arrow colour is picked to read on it. |
| successColor | string | "#22c55e" | Fill of the done pill. |
| dangerColor | string | "#e5484d" | Tint of the handle and error label after a reject. |
| width | number | 280 | Track width in pixels; the travel scales with it. |
| height | number | 56 | Track height in pixels; the handle is 8px smaller. |
| radius | number | 28 | Track corner radius; the handle corner is 4px smaller so the two stay concentric. |
| speed | number | 50 | How fast the unfurl and the return take over once you let go. |
| returnBounce | number | 0.38 | Energy left when the handle returns to the wall: 0 stops dead, 0.38 fills the 8% squash. |
| landingDip | number | 0.026 | How much the track dips as the done pill lands. 0 removes it. |
| holdMs | number | 1500 | How long the done pill stands before it closes back. 0 keeps it until the component remounts. |
| disabled | boolean | false | Dims the control and ignores input. |
| icon | ReactNode | undefined | Replaces the arrow in the handle. |
| className | string | "" | Extra classes for the root element. |

### Full Component Source
```jsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight02Icon, Tick02Icon } from '@hugeicons/core-free-icons';

import './SlideCommit.css';

const PAD = 4;
const SQUASH_MAX = 0.08;
const SQUASH_DIV = 110;
const SWELL = 1.03;
const MIN_PENDING = 300;
const EASE_OUT = [0.23, 1, 0.32, 1];
const SHAKE = [0, -5, 5, -3, 3, -1, 0];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const onColor = hex => {
  const raw = hex.replace('#', '');
  const full = raw.length === 3 ? [...raw].map(ch => ch + ch).join('') : raw.slice(0, 6);
  const n = parseInt(full, 16);
  if (Number.isNaN(n)) return '#ffffff';
  const yiq = (((n >> 16) & 255) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000;
  return yiq >= 128 ? '#111111' : '#ffffff';
};
const velocityOf = hist => {
  if (hist.length < 2) return 0;
  const [t0, x0] = hist[0];
  const [t1, x1] = hist[hist.length - 1];
  return ((x1 - x0) / Math.max(1, t1 - t0)) * 1000;
};
const finePointer = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;

const Spinner = ({ size }) => (
  <svg className="slide-commit__spinner" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.4" strokeOpacity="0.25" />
    <path d="M12 3a9 9 0 0 1 9 9" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

export default function SlideCommit({
  label = 'Slide to pay',
  doneLabel = 'Paid',
  errorLabel = 'Payment failed',
  onConfirm,
  onDone,
  onError,
  trackColor = '#262626',
  handleColor = '#f5f5f5',
  successColor = '#22c55e',
  dangerColor = '#e5484d',
  width = 280,
  height = 56,
  radius = 28,
  speed = 50,
  returnBounce = 0.38,
  landingDip = 0.026,
  holdMs = 1500,
  disabled = false,
  icon,
  className = ''
}) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState('idle');
  const [held, setHeld] = useState(false);
  const [hot, setHot] = useState(false);

  const trackRef = useRef(null);
  const capsuleRef = useRef(null);
  const grip = useRef(null);
  const timer = useRef(0);
  const homeTimer = useRef(0);
  const run = useRef(0);
  const unwatch = useRef(null);
  const live = useRef({ move: () => {}, up: () => {} });
  const lastPercent = useRef(0);

  const GRIP = height - PAD * 2;
  const INNER = width - PAD * 2;
  const TRAVEL = Math.max(1, INNER - GRIP);
  const r = clamp(radius, 0, height / 2);
  const gripR = Math.max(0, r - PAD);
  const k = 260 + (clamp(speed, 0, 100) / 100) * 640;
  const mass = 0.9;
  const critical = 2 * Math.sqrt(k * mass);
  const commitSpring = { type: 'spring', stiffness: k, damping: critical, mass };
  const homeSpring = { ...commitSpring, damping: critical * (1 - clamp(returnBounce, 0, 0.5)) };

  const x = useMotionValue(0);
  const anchor = useMotionValue(0);
  const shown = useMotionValue(1);
  const spin = useMotionValue(0);
  const pulse = useMotionValue(1);
  const shake = useMotionValue(0);
  const seen = useTransform(x, v => clamp(v, 0, TRAVEL));
  const edge = useTransform([seen, anchor], ([v, a]) => v + GRIP + clamp(a - v, 0, TRAVEL));
  const clip = useTransform(edge, R => `inset(0 ${INNER - R}px 0 0 round ${gripR}px)`);
  const content = useTransform([seen, edge], ([v, R]) => `translateX(${(v + R) / 2 - INNER / 2}px)`);
  const swell = hot && !held && phase === 'idle' && !reduce ? SWELL : 1;
  const shape = useTransform(x, v => {
    const q = 1 - Math.min(SQUASH_MAX, Math.max(0, -v) / SQUASH_DIV);
    return `scale(${q * swell}, ${swell / q})`;
  });
  const origin = useTransform(seen, v => `${v}px 50%`);
  const say = useTransform(seen, [0, TRAVEL * 0.55], [1, 0]);
  const arrow = useTransform([seen, shown], ([v, on]) => on * clamp(1 - (v - TRAVEL * 0.55) / (TRAVEL * 0.4), 0, 1));
  const trackTransform = useTransform([shake, pulse], ([s, p]) => `translateX(${s}px) scale(${p})`);

  const labelText = typeof label === 'string' ? label : 'Slide to confirm';
  useMotionValueEvent(seen, 'change', v => {
    const percent = Math.round((v / TRAVEL) * 100);
    if (percent === lastPercent.current || !capsuleRef.current) return;
    lastPercent.current = percent;
    capsuleRef.current.setAttribute('aria-valuenow', String(percent));
    capsuleRef.current.setAttribute('aria-valuetext', `${labelText}, ${percent}%`);
  });

  useEffect(
    () => () => {
      clearTimeout(timer.current);
      clearTimeout(homeTimer.current);
      unwatch.current?.();
      run.current += 1;
    },
    []
  );

  const local = clientX => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    return (clientX - rect.left) / (rect.width / width || 1);
  };

  const goHome = velocity => {
    if (reduce) animate(x, 0, { duration: 0.2, ease: EASE_OUT });
    else animate(x, 0, { ...homeSpring, velocity: Math.min(0, velocity) });
  };

  const settle = () => {
    setPhase('idle');
    animate(shown, 1, { duration: 0.2, delay: 0.12 });
    if (reduce) anchor.set(0);
    else animate(anchor, 0, { type: 'spring', duration: 0.3, bounce: 0 });
  };

  const resolve = viaKey => {
    setPhase('done');
    anchor.set(x.get());
    animate(spin, 0, { duration: 0.12 });
    if (reduce) x.set(0);
    else {
      animate(x, 0, commitSpring);
      if (!viaKey && landingDip > 0) {
        animate(pulse, [1, 1 - landingDip, 1], { duration: 0.46, times: [0, 0.62, 1], ease: EASE_OUT, delay: 0.1 });
      }
    }
    onDone?.();
    if (holdMs > 0) timer.current = setTimeout(settle, holdMs);
  };

  const reject = reason => {
    setPhase('error');
    onError?.(reason);
    animate(spin, 0, { duration: 0.12 });
    animate(shown, 1, { duration: 0.2, delay: 0.12 });
    if (reduce) goHome(0);
    else {
      animate(shake, SHAKE, { duration: 0.45, ease: EASE_OUT });
      homeTimer.current = setTimeout(() => {
        if (!grip.current) goHome(0);
      }, 300);
    }
    timer.current = setTimeout(() => setPhase('idle'), Math.max(holdMs, 1500));
  };

  const commit = viaKey => {
    clearTimeout(timer.current);
    const id = ++run.current;
    x.set(TRAVEL);
    let out;
    try {
      out = onConfirm?.();
    } catch (reason) {
      reject(reason);
      return;
    }
    const pending = out && typeof out.then === 'function' ? out : null;
    if (!pending) {
      animate(shown, 0, { duration: 0.12 });
      resolve(viaKey);
      return;
    }
    setPhase('pending');
    animate(shown, 0, { duration: 0.2 });
    animate(spin, 1, { duration: 0.2 });
    const t0 = performance.now();
    const later = fn => {
      setTimeout(
        () => {
          if (id === run.current) fn();
        },
        Math.max(0, MIN_PENDING - (performance.now() - t0))
      );
    };
    pending.then(
      () => later(() => resolve(viaKey)),
      reason => later(() => reject(reason))
    );
  };

  const down = e => {
    if (disabled || grip.current || phase === 'pending' || phase === 'done' || e.button !== 0) return;
    x.stop();
    grip.current = { id: e.pointerId, grab: null, moved: false, hist: [] };
    setHeld(true);
    try {
      trackRef.current?.setPointerCapture(e.pointerId);
    } catch {}
    unwatch.current?.();
    const onMove = ev => ev.isTrusted && live.current.move(ev);
    const onUp = ev => ev.isTrusted && live.current.up(ev);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    unwatch.current = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      unwatch.current = null;
    };
  };

  const move = e => {
    const g = grip.current;
    if (!g || g.id !== e.pointerId) return;
    const at = local(e.clientX);
    if (g.grab === null) {
      g.grab = at - x.get();
      return;
    }
    const next = clamp(at - g.grab, 0, TRAVEL);
    if (Math.abs(next - x.get()) > 0.5) g.moved = true;
    g.hist.push([e.timeStamp, next]);
    if (g.hist.length > 4) g.hist.shift();
    x.set(next);
  };

  const up = e => {
    const g = grip.current;
    if (!g || g.id !== e.pointerId) return;
    grip.current = null;
    unwatch.current?.();
    try {
      trackRef.current?.releasePointerCapture(e.pointerId);
    } catch {}
    setHeld(false);
    if (x.get() >= TRAVEL) commit(false);
    else if (g.moved) goHome(velocityOf(g.hist));
  };
  live.current = { move, up };

  const onKeyDown = e => {
    if (disabled || phase === 'pending' || phase === 'done') return;
    const step = TRAVEL / 10;
    if (e.key === 'End') {
      e.preventDefault();
      commit(true);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(TRAVEL, x.get() + step);
      x.set(next);
      if (next >= TRAVEL) commit(true);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      x.set(Math.max(0, x.get() - step));
    } else if (e.key === 'Home' || e.key === 'Escape') {
      e.preventDefault();
      if (grip.current) up({ pointerId: grip.current.id });
      else x.set(0);
    }
  };

  const fontSize = clamp(Math.round(height * 0.25), 13, 17);
  const iconSize = Math.round(GRIP * 0.42);
  const done = phase === 'done';

  return (
    <div
      className={`slide-commit${className ? ` ${className}` : ''}`}
      data-phase={phase}
      data-held={held ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      style={{
        width,
        height,
        '--sc-track': trackColor,
        '--sc-ink': handleColor,
        '--sc-ok': successColor,
        '--sc-no': dangerColor,
        '--sc-on-ink': onColor(handleColor),
        '--sc-on-ok': onColor(successColor),
        '--sc-on-no': onColor(dangerColor),
        '--sc-radius': `${r}px`,
        '--sc-grip-r': `${gripR}px`,
        '--sc-pad': `${PAD}px`,
        '--sc-font': `${fontSize}px`
      }}
    >
      <motion.div
        ref={trackRef}
        className="slide-commit__track"
        style={{ transform: trackTransform }}
        onPointerDown={down}
      >
        <motion.span className="slide-commit__label" style={{ opacity: say }} aria-hidden="true">
          <span className="slide-commit__text slide-commit__text--plain">{label}</span>
          <span className="slide-commit__text slide-commit__text--error">{errorLabel}</span>
        </motion.span>
        <motion.div
          ref={capsuleRef}
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-label={labelText}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={0}
          aria-busy={phase === 'pending' || undefined}
          aria-disabled={disabled || undefined}
          className="slide-commit__capsule"
          style={{ clipPath: clip, transform: shape, transformOrigin: origin }}
          onPointerEnter={e => {
            if (e.pointerType === 'mouse' && finePointer()) setHot(true);
          }}
          onPointerLeave={() => setHot(false)}
          onKeyDown={onKeyDown}
        >
          <motion.div className="slide-commit__content" style={{ transform: content }}>
            <motion.span className="slide-commit__arrow" style={{ opacity: arrow }} aria-hidden="true">
              {icon ?? <HugeiconsIcon icon={ArrowRight02Icon} size={iconSize} strokeWidth={2} />}
            </motion.span>
            <motion.span className="slide-commit__spin" style={{ opacity: spin }} aria-hidden="true">
              <Spinner size={iconSize} />
            </motion.span>
            <motion.span
              className="slide-commit__done"
              aria-hidden="true"
              initial={false}
              animate={{ opacity: done ? 1 : 0, scale: done || reduce ? 1 : 0.95 }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
            >
              <HugeiconsIcon icon={Tick02Icon} size={Math.round(GRIP * 0.38)} strokeWidth={2.5} />
              {doneLabel}
            </motion.span>
          </motion.div>
        </motion.div>
        <span className="slide-commit__sr" aria-live="polite">
          {phase === 'pending' ? 'Working' : phase === 'done' ? doneLabel : phase === 'error' ? errorLabel : ''}
        </span>
      </motion.div>
    </div>
  );
}

```

### Component CSS
```css
.slide-commit {
  --sc-track: #262626;
  --sc-ink: #f5f5f5;
  --sc-ok: #22c55e;
  --sc-no: #e5484d;
  --sc-on-ink: #111111;
  --sc-on-ok: #111111;
  --sc-on-no: #ffffff;
  --sc-radius: 28px;
  --sc-grip-r: 24px;
  --sc-pad: 4px;
  --sc-font: 14px;

  position: relative;
  display: inline-block;
  vertical-align: middle;
  font-family: inherit;
}

.slide-commit[data-disabled] {
  opacity: 0.55;
  pointer-events: none;
}

.slide-commit__track {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: var(--sc-radius);
  background: var(--sc-track);
  cursor: grab;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
}

.slide-commit[data-held] .slide-commit__track {
  cursor: grabbing;
}

.slide-commit[data-phase='pending'] .slide-commit__track,
.slide-commit[data-phase='done'] .slide-commit__track {
  cursor: default;
}

.slide-commit__label {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  pointer-events: none;
  font-size: var(--sc-font);
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.006em;
  white-space: nowrap;
}

.slide-commit__text {
  grid-area: 1 / 1;
  color: color-mix(in srgb, var(--sc-ink) 45%, transparent);
  transition:
    opacity 200ms ease,
    filter 200ms ease;
}

.slide-commit__text--error {
  color: var(--sc-no);
  opacity: 0;
  filter: blur(2px);
}

.slide-commit[data-phase='error'] .slide-commit__text--plain {
  opacity: 0;
  filter: blur(2px);
}

.slide-commit[data-phase='error'] .slide-commit__text--error {
  opacity: 1;
  filter: none;
}

.slide-commit__capsule {
  position: absolute;
  top: var(--sc-pad);
  left: var(--sc-pad);
  width: calc(100% - var(--sc-pad) * 2);
  height: calc(100% - var(--sc-pad) * 2);
  background: var(--sc-ink);
  color: var(--sc-on-ink);
  outline: none;
  transition:
    background-color 200ms ease,
    color 200ms ease;
}

.slide-commit[data-phase='done'] .slide-commit__capsule {
  background: var(--sc-ok);
  color: var(--sc-on-ok);
}

.slide-commit[data-phase='error'] .slide-commit__capsule {
  background: var(--sc-no);
  color: var(--sc-on-no);
}

.slide-commit__capsule:focus-visible {
  box-shadow: inset 0 0 0 2px var(--sc-track);
}

.slide-commit__content {
  position: absolute;
  inset: 0;
}

.slide-commit__arrow,
.slide-commit__spin,
.slide-commit__done {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  pointer-events: none;
  font-size: var(--sc-font);
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.006em;
  white-space: nowrap;
}

.slide-commit__arrow svg,
.slide-commit__done svg,
.slide-commit__spinner {
  display: block;
}

.slide-commit__arrow,
.slide-commit__spin {
  transition: filter 200ms ease;
}

.slide-commit[data-phase='pending'] .slide-commit__arrow {
  filter: blur(2px);
}

.slide-commit:not([data-phase='pending']) .slide-commit__spin {
  filter: blur(2px);
}

.slide-commit__spinner {
  animation: slide-commit-spin 1s linear infinite;
  animation-play-state: paused;
}

.slide-commit[data-phase='pending'] .slide-commit__spinner {
  animation-play-state: running;
}

@keyframes slide-commit-spin {
  to {
    transform: rotate(360deg);
  }
}

.slide-commit__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .slide-commit__spinner {
    animation: slide-commit-breathe 1.4s ease-in-out infinite;
    animation-play-state: paused;
  }

  .slide-commit[data-phase='pending'] .slide-commit__spinner {
    animation-play-state: running;
  }

  @keyframes slide-commit-breathe {
    0%,
    100% {
      opacity: 1;
    }

    50% {
      opacity: 0.4;
    }
  }
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.


## Integrate the <SpringCheck /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: SpringCheck
### Variant: JavaScript + CSS
### Dependencies: motion @hugeicons/core-free-icons

---

### Usage Example
```jsx
import SpringCheck from './SpringCheck';

<SpringCheck
  label="Ship the build"
  defaultChecked={false}
  onChange={checked => console.log(checked)}
  color="#ffffff"
  fillColor="#ffffff"
  checkColor="#0b0b0f"
  boxSize={28}
  boxRadius={9}
  fontSize={18}
  bounce={0.2}
  strikeLag={0.12}
  doneOpacity={0.42}
  strike="left"
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | ReactNode | "Ship the build" | The words beside the box; the strike-through is exactly their width. |
| checked | boolean | undefined | Controlled state. A change from outside animates on the spring. |
| defaultChecked | boolean | false | Initial state when uncontrolled. |
| onChange | (checked: boolean) => void | - | Called on every toggle. |
| disabled | boolean | false | Dims the row and ignores input. |
| color | string | "#ffffff" | Ink: the label, the ring, the rule and the focus outline. |
| fillColor | string | "#ffffff" | The fill that swells out of the box centre. |
| checkColor | string | "#0b0b0f" | Stroke of the tick drawn over the fill. |
| boxSize | number | 28 | Box side in pixels; ring, gap and row height derive from it. |
| boxRadius | number | 9 | Box corner radius in pixels; half the size makes a circle. |
| fontSize | number | 18 | Label size in pixels; the rule thickness derives from it. |
| bounce | number | 0.2 | How far the fill swells past full. 0 arrives dead, 0.5 rebounds twice. |
| strikeLag | number | 0.12 | Where on the spring the rule starts: 0 wipes with the fill, 0.4 waits for the tick. |
| doneOpacity | number | 0.42 | How much ink the words keep once checked. |
| strike | "left" | "center" | "right" | "none" | "left" | Where the strike-through wipes from, or no rule at all. |
| ariaLabel | string | - | Accessible name when the label is not text. |
| className | string | "" | Extra classes for the row. |

### Full Component Source
```jsx
'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { animate, useMotionValue, useMotionValueEvent, useReducedMotion } from 'motion/react';
import { Tick02Icon } from '@hugeicons/core-free-icons';

import './SpringCheck.css';

const VISUAL_DURATION = 0.2;
const RULE_END = 0.84;
const SWELL = 0.35;
const TICK_PATH = String(Tick02Icon[0][1].d);
const ORIGIN = { left: 'left center', center: 'center', right: 'right center', none: 'left center' };

const clamp01 = value => Math.min(1, Math.max(0, value));
const zetaOf = bounce => (bounce <= 0 ? 1 : -Math.log(bounce) / Math.sqrt(Math.PI ** 2 + Math.log(bounce) ** 2));

const readings = (t, doneOpacity, strikeLag) => {
  const held = clamp01(t);
  return {
    fill: `scale(${Math.max(t, 0)})`,
    box: `scale(${1 + SWELL * Math.max(0, t - 1)})`,
    tick: 1 - held,
    word: 1 - (1 - doneOpacity) * held,
    rule: `scaleX(${clamp01((held - strikeLag) / (RULE_END - strikeLag))})`
  };
};

export default function SpringCheck({
  label = 'Ship the build',
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  color = '#ffffff',
  fillColor = '#ffffff',
  checkColor = '#0b0b0f',
  boxSize = 28,
  boxRadius = 9,
  fontSize = 18,
  bounce = 0.2,
  strikeLag = 0.12,
  doneOpacity = 0.42,
  strike = 'left',
  ariaLabel,
  className = ''
}) {
  const controlled = checked !== undefined;
  const [inner, setInner] = useState(defaultChecked);
  const on = controlled ? checked : inner;
  const reduce = useReducedMotion();

  const t = useMotionValue(on ? 1 : 0);
  const viaPointer = useRef(false);
  const instant = useRef(false);
  const rowRef = useRef(null);
  const boxRef = useRef(null);
  const fillRef = useRef(null);
  const tickRef = useRef(null);
  const wordRef = useRef(null);
  const ruleRef = useRef(null);
  const cfg = useRef({ doneOpacity, strikeLag });
  cfg.current = { doneOpacity, strikeLag };

  const write = value => {
    const r = readings(value, cfg.current.doneOpacity, cfg.current.strikeLag);
    if (fillRef.current) fillRef.current.style.transform = r.fill;
    if (boxRef.current) boxRef.current.style.transform = r.box;
    if (tickRef.current) tickRef.current.style.strokeDashoffset = r.tick;
    if (wordRef.current) wordRef.current.style.opacity = r.word;
    if (ruleRef.current) ruleRef.current.style.transform = r.rule;
  };
  useMotionValueEvent(t, 'change', write);
  useLayoutEffect(() => {
    write(t.get());
  });

  useEffect(() => {
    const target = on ? 1 : 0;
    if (reduce || instant.current) {
      instant.current = false;
      t.jump(target);
      return undefined;
    }
    if (t.get() === target && t.getVelocity() === 0) return undefined;
    const controls = animate(t, target, {
      type: 'spring',
      visualDuration: VISUAL_DURATION,
      bounce: 1 - zetaOf(bounce)
    });
    return () => controls.stop();
  }, [on, reduce, bounce, t]);

  const handlePointerDown = e => {
    if (e.button !== 0 || disabled) return;
    viaPointer.current = true;
    if (!reduce && rowRef.current) rowRef.current.dataset.pressed = '';
  };
  const handlePointerUp = () => {
    if (rowRef.current) delete rowRef.current.dataset.pressed;
  };
  const handlePointerCancel = () => {
    viaPointer.current = false;
    handlePointerUp();
  };
  const toggle = () => {
    if (disabled) return;
    instant.current = !viaPointer.current;
    viaPointer.current = false;
    const next = !on;
    if (!controlled) setInner(next);
    onChange?.(next);
  };

  const r = readings(t.get(), doneOpacity, strikeLag);
  const ring = boxSize >= 24 ? 2 : 1.5;
  const gap = Math.min(16, Math.max(8, Math.round(boxSize * 0.43)));
  const ruleHeight = Math.max(1.5, Math.round(fontSize / 6) / 2);

  return (
    <button
      ref={rowRef}
      type="button"
      role="checkbox"
      aria-checked={on}
      aria-label={ariaLabel}
      disabled={disabled}
      className={`spring-check${className ? ` ${className}` : ''}`}
      style={{
        '--sc-ink': color,
        '--sc-fill': fillColor,
        '--sc-check': checkColor,
        '--sc-box': `${boxSize}px`,
        '--sc-radius': `${boxRadius}px`,
        '--sc-font': `${fontSize}px`,
        '--sc-ring': `${ring}px`,
        '--sc-gap': `${gap}px`,
        '--sc-row': `${Math.max(44, boxSize + 16)}px`,
        '--sc-rule': `${ruleHeight}px`,
        '--sc-origin': ORIGIN[strike] || ORIGIN.left
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerLeave={handlePointerCancel}
      onClick={toggle}
    >
      <span className="spring-check__press">
        <span ref={boxRef} className="spring-check__box" style={{ transform: r.box }}>
          <span className="spring-check__ring" aria-hidden="true" />
          <span ref={fillRef} className="spring-check__fill" style={{ transform: r.fill }} />
          <svg className="spring-check__tick" viewBox="0 0 24 24" aria-hidden="true">
            <path ref={tickRef} d={TICK_PATH} pathLength={1} strokeDasharray={1} style={{ strokeDashoffset: r.tick }} />
          </svg>
        </span>
      </span>
      <span className="spring-check__label">
        <span ref={wordRef} className="spring-check__word" style={{ opacity: r.word }}>
          {label}
        </span>
        {strike !== 'none' ? (
          <span ref={ruleRef} className="spring-check__rule" aria-hidden="true" style={{ transform: r.rule }} />
        ) : null}
      </span>
    </button>
  );
}

```

### Component CSS
```css
.spring-check {
  --sc-ink: #ffffff;
  --sc-fill: #ffffff;
  --sc-check: #0b0b0f;
  --sc-box: 28px;
  --sc-radius: 9px;
  --sc-font: 18px;
  --sc-ring: 2px;
  --sc-gap: 12px;
  --sc-row: 44px;
  --sc-rule: 1.5px;
  --sc-origin: left center;
  --sc-ease-out: cubic-bezier(0.23, 1, 0.32, 1);

  display: inline-flex;
  align-items: center;
  gap: var(--sc-gap);
  min-height: var(--sc-row);
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  color: var(--sc-ink);
  font-family: inherit;
  font-size: var(--sc-font);
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -0.01em;
  text-align: left;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  outline: none;
}

.spring-check:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spring-check__press {
  flex: none;
  width: var(--sc-box);
  height: var(--sc-box);
  border-radius: var(--sc-radius);
  transition: transform 160ms var(--sc-ease-out);
}

.spring-check[data-pressed] .spring-check__press {
  transform: scale(0.95);
}

.spring-check:focus-visible .spring-check__press {
  outline: 2px solid color-mix(in srgb, var(--sc-ink) 45%, transparent);
  outline-offset: 3px;
}

.spring-check__box {
  position: relative;
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  overflow: hidden;
  transform-origin: center;
}

.spring-check__ring {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: inset 0 0 0 var(--sc-ring) var(--sc-ink);
  opacity: 0.28;
  transition: opacity 120ms ease;
}

@media (hover: hover) and (pointer: fine) {
  .spring-check:not(:disabled):hover .spring-check__ring {
    opacity: 0.5;
  }
}

.spring-check__fill {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--sc-fill);
  transform-origin: center;
}

.spring-check__tick {
  position: relative;
  width: 68%;
  height: 68%;
  overflow: visible;
  fill: none;
  stroke: var(--sc-check);
  stroke-width: 2.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.spring-check__label {
  position: relative;
  display: inline-block;
}

.spring-check__word {
  display: inline-block;
}

.spring-check__rule {
  position: absolute;
  left: 0;
  right: 0;
  top: 46%;
  height: var(--sc-rule);
  border-radius: 2px;
  background: currentColor;
  transform-origin: var(--sc-origin);
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .spring-check__press {
    transition: none;
  }
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.

