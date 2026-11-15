import { useEffect, useRef } from 'react'
import { Renderer, Program, Mesh, Triangle } from 'ogl'

// Home hero backdrop (WebGL, lazy-loaded): ballpoint ink soaking into the paper.
// A domain-warped noise field is drawn as contour lines in pen blue with one red-pen contour,
// and the highlighter follows the pointer. The canvas is transparent, so the paper shows through.
// Decorative only. It stops drawing when it is off screen or the tab is hidden.

const VERT = `#version 300 es
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }`

const FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uHover;
uniform vec3 uInk;
uniform vec3 uRed;
uniform vec3 uHi;
uniform float uStrength;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + vec2(7.3, 1.7); a *= 0.5; }
  return v;
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  vec2 m = (uMouse - 0.5 * uRes) / uRes.y;
  float t = uTime * 0.035;

  // The pointer pushes the ink around a little.
  float md = length(p - m);
  float near = smoothstep(0.6, 0.0, md) * uHover;
  p += normalize(p - m + 1e-4) * near * 0.05;

  vec2 q = vec2(fbm(p * 1.5 + t), fbm(p * 1.5 + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p * 1.7 + 2.6 * q + vec2(1.7, 9.2) + t * 1.4), fbm(p * 1.7 + 2.6 * q + vec2(8.3, 2.8) - t * 1.1));
  float f = fbm(p * 1.3 + 2.8 * r);

  // Keep the copy on the left readable: the ink gathers to the right and along the bottom.
  float side = smoothstep(0.1, 0.95, vUv.x);
  float mask = clamp(0.07 + 0.93 * side + 0.25 * smoothstep(0.5, 0.0, vUv.y), 0.0, 1.0);
  mask *= smoothstep(0.0, 0.08, vUv.y) * smoothstep(1.0, 0.9, vUv.y);

  // Pooled ink wash
  float wash = smoothstep(0.5, 0.82, f) * 0.2;

  // Contour lines, like a pen following the edge of a stain
  float bands = f * 9.0;
  float w = fwidth(bands);
  float line = 1.0 - smoothstep(w * 0.7, w * 1.9, abs(fract(bands) - 0.5));
  float lineA = line * 0.34;

  // One contour in the examiner's red
  float wr = fwidth(f);
  float red = 1.0 - smoothstep(wr * 0.9, wr * 2.4, abs(f - 0.56));

  // Highlighter under the pointer
  float hi = near * smoothstep(0.3, 0.7, fbm(p * 4.0 + t * 6.0) + near * 0.4);

  vec3 col = uInk;
  float a = max(wash, lineA) * mask;
  col = mix(col, uRed, red);
  a = max(a, red * 0.6 * mask);
  col = mix(col, uHi, hi * (1.0 - red) * (1.0 - line));
  a = max(a, hi * 0.55);

  a *= uStrength;
  outColor = vec4(col * a, a);
}`

const hexToRgb = (hex) => {
  const h = hex.trim().replace('#', '')
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

export default function HeroInk() {
  const ref = useRef(null)

  useEffect(() => {
    const host = ref.current
    if (!host) return
    let renderer
    try {
      renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: false, depth: false, dpr: Math.min(window.devicePixelRatio || 1, 1.5) })
    } catch {
      return
    }
    const gl = renderer.gl
    if (!gl || !renderer.isWebgl2) return
    gl.clearColor(0, 0, 0, 0)
    host.appendChild(gl.canvas)

    const uniforms = {
      uTime: { value: 0 },
      uRes: { value: [1, 1] },
      uMouse: { value: [0, 0] },
      uHover: { value: 0 },
      uInk: { value: [0.14, 0.25, 0.65] },
      uRed: { value: [0.72, 0.2, 0.16] },
      uHi: { value: [1, 0.88, 0.4] },
      uStrength: { value: 1 },
    }
    const program = new Program(gl, { vertex: VERT, fragment: FRAG, uniforms, transparent: true, depthTest: false })
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })

    // Colours follow the theme tokens.
    const readTheme = () => {
      const css = getComputedStyle(document.documentElement)
      const get = (name, fallback) => { try { return hexToRgb(css.getPropertyValue(name) || fallback) } catch { return hexToRgb(fallback) } }
      uniforms.uInk.value = get('--accent', '#2340a6')
      uniforms.uRed.value = get('--hot', '#b8322a')
      const dark = document.documentElement.dataset.theme === 'dark'
      uniforms.uHi.value = dark ? [0.82, 0.68, 0.22] : [1, 0.86, 0.3]
      uniforms.uStrength.value = dark ? 0.8 : 1
    }
    readTheme()
    const themeWatch = new MutationObserver(readTheme)
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host
      renderer.setSize(w, h)
      uniforms.uRes.value = [gl.drawingBufferWidth, gl.drawingBufferHeight]
    }
    const ro = new ResizeObserver(resize)
    ro.observe(host)
    resize()

    // Smoothed pointer, in drawing-buffer pixels with the origin at the bottom left.
    const target = [gl.drawingBufferWidth * 0.75, gl.drawingBufferHeight * 0.5]
    let hover = 0
    const onMove = (e) => {
      const r = host.getBoundingClientRect()
      const sx = gl.drawingBufferWidth / r.width
      const sy = gl.drawingBufferHeight / r.height
      target[0] = (e.clientX - r.left) * sx
      target[1] = (r.bottom - e.clientY) * sy
      hover = e.clientY < r.bottom ? 1 : 0
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    let frame = 0
    let visible = true
    let last = performance.now()
    const tick = (now) => {
      frame = 0
      if (!visible || document.hidden) return
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      uniforms.uTime.value += dt
      const mouse = uniforms.uMouse.value
      mouse[0] += (target[0] - mouse[0]) * 0.06
      mouse[1] += (target[1] - mouse[1]) * 0.06
      uniforms.uHover.value += (hover - uniforms.uHover.value) * 0.05
      renderer.render({ scene: mesh })
      frame = requestAnimationFrame(tick)
    }
    const start = () => { if (!frame) { last = performance.now(); frame = requestAnimationFrame(tick) } }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start() })
    io.observe(host)
    const onVis = () => { if (!document.hidden) start() }
    document.addEventListener('visibilitychange', onVis)
    start()
    host.classList.add('is-live')

    return () => {
      cancelAnimationFrame(frame)
      io.disconnect()
      ro.disconnect()
      themeWatch.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('visibilitychange', onVis)
      gl.canvas.remove()
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [])

  return <div ref={ref} className="hero-ink" aria-hidden="true" />
}
