/* ------------------------------------------------------------------ *
 * WebGL helpers — shader compilation, program linking, canvas→texture
 * pixel upload (iOS-safe), and a small word-wrap helper.
 * ------------------------------------------------------------------ */

/**
 * Upload a 2D canvas as raw RGBA pixels (ArrayBufferView), bypassing the
 * canvas-source path entirely.
 *
 * WHY: Safari/iOS 16.4+ (WebKit regression) throws
 *   "TypeError: Type error" from texImage2D when the source is an
 *   HTMLCanvasElement (esp. non-power-of-two sizes and canvases drawn
 *   with ctx.filter). Uploading via getImageData + Uint8Array avoids
 *   every canvas-source code path and works on all platforms.
 *
 * `premultiply` manually premultiplies the alpha into RGB to preserve
 * the exact semantics of UNPACK_PREMULTIPLY_ALPHA_WEBGL=true (that
 * pixel-store flag is ignored for ArrayBufferView sources).
 */
export function uploadCanvasAsPixels(
  gl: WebGLRenderingContext,
  canvas: HTMLCanvasElement,
  premultiply = false
): void {
  const w = Math.max(1, canvas.width)
  const h = Math.max(1, canvas.height)
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) {
    // Fallback: direct canvas source (works on desktop browsers).
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas)
    return
  }
  const img = ctx.getImageData(0, 0, w, h)
  const data = img.data as Uint8Array
  if (premultiply) {
    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3] / 255
      data[i] = (data[i] * a) | 0
      data[i + 1] = (data[i + 1] * a) | 0
      data[i + 2] = (data[i + 2] * a) | 0
    }
  }
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, data)
}

export function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  src: string
): WebGLShader {
  const sh = gl.createShader(type)!
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh)
    gl.deleteShader(sh)
    throw new Error('Shader compile error: ' + log)
  }
  return sh
}

export function createProgram(
  gl: WebGLRenderingContext,
  vsSrc: string,
  fsSrc: string
): WebGLProgram {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vsSrc)
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSrc)
  const p = gl.createProgram()!
  gl.attachShader(p, vs)
  gl.attachShader(p, fs)
  gl.linkProgram(p)
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(p)
    gl.deleteProgram(p)
    throw new Error('Program link error: ' + log)
  }
  return p
}

/* ------------------------------------------------------------------ *
 * Word-wrap helper — splits `text` into lines that fit within `maxW`
 * using the current 2D-context font. Used by the text rasterizer.
 * ------------------------------------------------------------------ */
export function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxW: number
): string[] {
  // Simple greedy wrap on word boundaries. Soft-hyphenate long words.
  const words = text.split(/\s+/)
  const lines: string[] = []
  let cur = ''
  for (const word of words) {
    const test = cur ? cur + ' ' + word : word
    if (ctx.measureText(test).width <= maxW || !cur) {
      cur = test
    } else {
      lines.push(cur)
      cur = word
    }
  }
  if (cur) lines.push(cur)
  return lines
}

/* ------------------------------------------------------------------ *
 * EaseIn — faithful port of androidx.compose.animation.core.EaseIn
 *   = CubicBezierEasing(0.42f, 0f, 1f, 1f)
 *
 * Solves the cubic bezier for x(s) = t, returns y(s).
 * Used by the control-center enter alpha (faithful to
 * ControlCenterContent.kt: alpha = EaseIn.transform(safeProgress)).
 * ------------------------------------------------------------------ */
export function easeIn(t: number): number {
  if (t <= 0) return 0
  if (t >= 1) return 1
  // Control points: P0=(0,0) P1=(0.42,0) P2=(1,1) P3=(1,1)
  const x1 = 0.42, y1 = 0, x2 = 1, y2 = 1
  // Newton-Raphson to find parameter s where x(s) = t
  let s = t
  for (let i = 0; i < 8; i++) {
    const xs = 3 * (1 - s) * (1 - s) * s * x1 + 3 * (1 - s) * s * s * x2 + s * s * s
    const dxs = 3 * (1 - s) * (1 - s) * x1 + 6 * (1 - s) * s * (x2 - x1) + 3 * s * s * (1 - x2)
    if (Math.abs(xs - t) < 0.001) break
    if (Math.abs(dxs) < 1e-6) break
    s -= (xs - t) / dxs
    s = Math.max(0, Math.min(1, s))
  }
  return 3 * (1 - s) * (1 - s) * s * y1 + 3 * (1 - s) * s * s * y2 + s * s * s
}
