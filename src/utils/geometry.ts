/**
 * Geometry utilities for SVG radar chart and pitch calculations.
 *
 * Coordinate system:
 * - Angles start from -π/2 (top/north) and go clockwise.
 * - For N axes, each axis i has angle = (2π × i / N) - π/2
 */

/** Calculate the angle for axis i out of N total axes, starting from top (-π/2). */
export function axisAngle(i: number, total: number): number {
  return (2 * Math.PI * i) / total - Math.PI / 2;
}

/**
 * Get (x, y) coordinates for a point on a radar axis.
 * @param cx - center x
 * @param cy - center y
 * @param radius - max radius of the radar
 * @param value - value 0–100
 * @param axisIndex - which axis (0-based)
 * @param totalAxes - total number of axes
 */
export function radarPoint(
  cx: number,
  cy: number,
  radius: number,
  value: number,
  axisIndex: number,
  totalAxes: number,
): { x: number; y: number } {
  const angle = axisAngle(axisIndex, totalAxes);
  return {
    x: cx + radius * (value / 100) * Math.cos(angle),
    y: cy + radius * (value / 100) * Math.sin(angle),
  };
}

/**
 * Build an SVG polygon points string for a set of values.
 * Values array should have one entry per axis (0–100).
 */
export function polygonPoints(
  cx: number,
  cy: number,
  radius: number,
  values: number[],
): string {
  return values
    .map((v, i) => {
      const pt = radarPoint(cx, cy, radius, v, i, values.length);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');
}

/**
 * Build grid ring points (for background hexagonal grid).
 * @param level - percentage level (e.g. 33, 66, 100)
 */
export function gridRingPoints(
  cx: number,
  cy: number,
  radius: number,
  totalAxes: number,
  level: number,
): string {
  const values = Array(totalAxes).fill(level);
  return polygonPoints(cx, cy, radius, values);
}

/**
 * Interpolate a color for the heatmap.
 * value 0–100 maps: 0 = transparent, ~33 = yellow, ~66 = orange, 100 = red
 */
export function heatmapColor(value: number): string {
  if (value <= 0) return 'rgba(0,0,0,0)';

  const r1 = { r: 251, g: 191, b: 36 };  // yellow #fbbf24
  const r2 = { r: 249, g: 115, b: 22 };   // orange #f97316
  const r3 = { r: 239, g: 68, b: 68 };    // red    #ef4444

  const alpha = Math.min(value / 100, 1) * 0.75;

  let r: number, g: number, b: number;
  if (value <= 50) {
    const t = value / 50;
    r = r1.r + (r2.r - r1.r) * t;
    g = r1.g + (r2.g - r1.g) * t;
    b = r1.b + (r2.b - r1.b) * t;
  } else {
    const t = (value - 50) / 50;
    r = r2.r + (r3.r - r2.r) * t;
    g = r2.g + (r3.g - r2.g) * t;
    b = r2.b + (r3.b - r2.b) * t;
  }

  return `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${alpha.toFixed(2)})`;
}
