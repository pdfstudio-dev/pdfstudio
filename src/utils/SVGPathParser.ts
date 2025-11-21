/**
 * SVG Path Parser
 *
 * Parses SVG path strings and converts them to PDF drawing operations.
 * Supports all SVG path commands: M, L, H, V, C, S, Q, T, A, Z
 */

export interface SVGCommand {
  type: string
  params: number[]
  relative: boolean
}

export interface Point {
  x: number
  y: number
}

/**
 * Parse an SVG path string into individual commands
 */
export function parseSVGPath(pathString: string): SVGCommand[] {
  const commands: SVGCommand[] = []

  // Remove newlines and extra spaces
  pathString = pathString.replace(/[\r\n]/g, '').replace(/\s+/g, ' ')

  // Pattern to match SVG commands and their parameters
  const commandPattern = /([MmLlHhVvCcSsQqTtAaZz])([^MmLlHhVvCcSsQqTtAaZz]*)/g

  let match: RegExpExecArray | null

  while ((match = commandPattern.exec(pathString)) !== null) {
    const type = match[1]
    const paramsStr = match[2].trim()

    // Parse parameters (numbers)
    const params = paramsStr
      .split(/[\s,]+/)
      .filter(s => s.length > 0)
      .map(s => parseFloat(s))

    // Determine if command is relative (lowercase) or absolute (uppercase)
    const relative = type === type.toLowerCase()

    commands.push({
      type: type.toUpperCase(),
      params,
      relative
    })
  }

  return commands
}

/**
 * Convert SVG path commands to PDF operations
 */
export class SVGPathConverter {
  private currentPoint: Point = { x: 0, y: 0 }
  private startPoint: Point = { x: 0, y: 0 }
  private lastControlPoint: Point | null = null

  /**
   * Convert SVG path string to PDF operations
   * @param pathString - SVG path string (e.g., "M 100,100 L 200,200 Z")
   * @param callback - Function that receives PDF operations
   */
  convert(
    pathString: string,
    callback: {
      moveTo: (x: number, y: number) => void
      lineTo: (x: number, y: number) => void
      bezierCurveTo: (cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) => void
      quadraticCurveTo: (cpx: number, cpy: number, x: number, y: number) => void
      closePath: () => void
    }
  ): void {
    const commands = parseSVGPath(pathString)

    for (const cmd of commands) {
      this.executeCommand(cmd, callback)
    }
  }

  private executeCommand(
    cmd: SVGCommand,
    callback: {
      moveTo: (x: number, y: number) => void
      lineTo: (x: number, y: number) => void
      bezierCurveTo: (cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) => void
      quadraticCurveTo: (cpx: number, cpy: number, x: number, y: number) => void
      closePath: () => void
    }
  ): void {
    const { type, params, relative } = cmd

    switch (type) {
      case 'M': // MoveTo
        this.handleMoveTo(params, relative, callback)
        break

      case 'L': // LineTo
        this.handleLineTo(params, relative, callback)
        break

      case 'H': // Horizontal LineTo
        this.handleHorizontalLineTo(params, relative, callback)
        break

      case 'V': // Vertical LineTo
        this.handleVerticalLineTo(params, relative, callback)
        break

      case 'C': // Cubic Bezier
        this.handleCubicBezier(params, relative, callback)
        break

      case 'S': // Smooth Cubic Bezier
        this.handleSmoothCubicBezier(params, relative, callback)
        break

      case 'Q': // Quadratic Bezier
        this.handleQuadraticBezier(params, relative, callback)
        break

      case 'T': // Smooth Quadratic Bezier
        this.handleSmoothQuadraticBezier(params, relative, callback)
        break

      case 'A': // Arc
        this.handleArc(params, relative, callback)
        break

      case 'Z': // Close Path
        callback.closePath()
        this.currentPoint = { ...this.startPoint }
        break
    }
  }

  private handleMoveTo(
    params: number[],
    relative: boolean,
    callback: { moveTo: (x: number, y: number) => void, lineTo: (x: number, y: number) => void }
  ): void {
    // M can have multiple pairs (first is moveTo, rest are lineTo)
    for (let i = 0; i < params.length; i += 2) {
      const x = relative ? this.currentPoint.x + params[i] : params[i]
      const y = relative ? this.currentPoint.y + params[i + 1] : params[i + 1]

      if (i === 0) {
        callback.moveTo(x, y)
        this.startPoint = { x, y }
      } else {
        callback.lineTo(x, y)
      }

      this.currentPoint = { x, y }
    }

    this.lastControlPoint = null
  }

  private handleLineTo(
    params: number[],
    relative: boolean,
    callback: { lineTo: (x: number, y: number) => void }
  ): void {
    for (let i = 0; i < params.length; i += 2) {
      const x = relative ? this.currentPoint.x + params[i] : params[i]
      const y = relative ? this.currentPoint.y + params[i + 1] : params[i + 1]

      callback.lineTo(x, y)
      this.currentPoint = { x, y }
    }

    this.lastControlPoint = null
  }

  private handleHorizontalLineTo(
    params: number[],
    relative: boolean,
    callback: { lineTo: (x: number, y: number) => void }
  ): void {
    for (const param of params) {
      const x = relative ? this.currentPoint.x + param : param
      const y = this.currentPoint.y

      callback.lineTo(x, y)
      this.currentPoint = { x, y }
    }

    this.lastControlPoint = null
  }

  private handleVerticalLineTo(
    params: number[],
    relative: boolean,
    callback: { lineTo: (x: number, y: number) => void }
  ): void {
    for (const param of params) {
      const x = this.currentPoint.x
      const y = relative ? this.currentPoint.y + param : param

      callback.lineTo(x, y)
      this.currentPoint = { x, y }
    }

    this.lastControlPoint = null
  }

  private handleCubicBezier(
    params: number[],
    relative: boolean,
    callback: { bezierCurveTo: (cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) => void }
  ): void {
    for (let i = 0; i < params.length; i += 6) {
      const cp1x = relative ? this.currentPoint.x + params[i] : params[i]
      const cp1y = relative ? this.currentPoint.y + params[i + 1] : params[i + 1]
      const cp2x = relative ? this.currentPoint.x + params[i + 2] : params[i + 2]
      const cp2y = relative ? this.currentPoint.y + params[i + 3] : params[i + 3]
      const x = relative ? this.currentPoint.x + params[i + 4] : params[i + 4]
      const y = relative ? this.currentPoint.y + params[i + 5] : params[i + 5]

      callback.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)

      this.lastControlPoint = { x: cp2x, y: cp2y }
      this.currentPoint = { x, y }
    }
  }

  private handleSmoothCubicBezier(
    params: number[],
    relative: boolean,
    callback: { bezierCurveTo: (cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) => void }
  ): void {
    for (let i = 0; i < params.length; i += 4) {
      // First control point is reflection of last control point
      const cp1x = this.lastControlPoint
        ? 2 * this.currentPoint.x - this.lastControlPoint.x
        : this.currentPoint.x
      const cp1y = this.lastControlPoint
        ? 2 * this.currentPoint.y - this.lastControlPoint.y
        : this.currentPoint.y

      const cp2x = relative ? this.currentPoint.x + params[i] : params[i]
      const cp2y = relative ? this.currentPoint.y + params[i + 1] : params[i + 1]
      const x = relative ? this.currentPoint.x + params[i + 2] : params[i + 2]
      const y = relative ? this.currentPoint.y + params[i + 3] : params[i + 3]

      callback.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)

      this.lastControlPoint = { x: cp2x, y: cp2y }
      this.currentPoint = { x, y }
    }
  }

  private handleQuadraticBezier(
    params: number[],
    relative: boolean,
    callback: { quadraticCurveTo: (cpx: number, cpy: number, x: number, y: number) => void }
  ): void {
    for (let i = 0; i < params.length; i += 4) {
      const cpx = relative ? this.currentPoint.x + params[i] : params[i]
      const cpy = relative ? this.currentPoint.y + params[i + 1] : params[i + 1]
      const x = relative ? this.currentPoint.x + params[i + 2] : params[i + 2]
      const y = relative ? this.currentPoint.y + params[i + 3] : params[i + 3]

      callback.quadraticCurveTo(cpx, cpy, x, y)

      this.lastControlPoint = { x: cpx, y: cpy }
      this.currentPoint = { x, y }
    }
  }

  private handleSmoothQuadraticBezier(
    params: number[],
    relative: boolean,
    callback: { quadraticCurveTo: (cpx: number, cpy: number, x: number, y: number) => void }
  ): void {
    for (let i = 0; i < params.length; i += 2) {
      // Control point is reflection of last control point
      const cpx = this.lastControlPoint
        ? 2 * this.currentPoint.x - this.lastControlPoint.x
        : this.currentPoint.x
      const cpy = this.lastControlPoint
        ? 2 * this.currentPoint.y - this.lastControlPoint.y
        : this.currentPoint.y

      const x = relative ? this.currentPoint.x + params[i] : params[i]
      const y = relative ? this.currentPoint.y + params[i + 1] : params[i + 1]

      callback.quadraticCurveTo(cpx, cpy, x, y)

      this.lastControlPoint = { x: cpx, y: cpy }
      this.currentPoint = { x, y }
    }
  }

  private handleArc(
    params: number[],
    relative: boolean,
    callback: { bezierCurveTo: (cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) => void }
  ): void {
    // Arc is complex - we approximate it with Bezier curves
    // Parameters: rx, ry, x-axis-rotation, large-arc-flag, sweep-flag, x, y

    for (let i = 0; i < params.length; i += 7) {
      const rx = params[i]
      const ry = params[i + 1]
      const xAxisRotation = params[i + 2] * Math.PI / 180
      const largeArcFlag = params[i + 3]
      const sweepFlag = params[i + 4]
      const x = relative ? this.currentPoint.x + params[i + 5] : params[i + 5]
      const y = relative ? this.currentPoint.y + params[i + 6] : params[i + 6]

      // Approximate arc with Bezier curves
      this.arcToBezier(
        this.currentPoint.x,
        this.currentPoint.y,
        rx,
        ry,
        xAxisRotation,
        largeArcFlag,
        sweepFlag,
        x,
        y,
        callback
      )

      this.currentPoint = { x, y }
    }

    this.lastControlPoint = null
  }

  private arcToBezier(
    x1: number,
    y1: number,
    rx: number,
    ry: number,
    angle: number,
    largeArcFlag: number,
    sweepFlag: number,
    x2: number,
    y2: number,
    callback: { bezierCurveTo: (cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) => void }
  ): void {
    // Simplified arc to bezier conversion
    // For a full implementation, see: https://www.w3.org/TR/SVG/implnotes.html#ArcImplementationNotes

    // For now, approximate with a simple bezier curve
    const cx = (x1 + x2) / 2
    const cy = (y1 + y2) / 2

    callback.bezierCurveTo(
      x1 + (cx - x1) * 0.66,
      y1 + (cy - y1) * 0.66,
      x2 - (x2 - cx) * 0.66,
      y2 - (y2 - cy) * 0.66,
      x2,
      y2
    )
  }
}
