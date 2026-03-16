/**
 * Reusable SVG football pitch (68×105 proportions, top-down view).
 * Used by both Heatmap and InteractivePitch.
 */
export function FootballPitch({ children }: { children?: React.ReactNode }) {
  // Pitch proportions: width=680, height=1050 (scaled 10x from 68×105)
  const w = 680;
  const h = 1050;
  const stroke = 'rgba(255,255,255,0.6)';
  const sw = 2;

  return (
    <g>
      {/* Background */}
      <rect x={0} y={0} width={w} height={h} rx={8} fill="#1a472a" />

      {/* Outer boundary */}
      <rect x={20} y={20} width={w - 40} height={h - 40} fill="none" stroke={stroke} strokeWidth={sw} />

      {/* Halfway line */}
      <line x1={20} y1={h / 2} x2={w - 20} y2={h / 2} stroke={stroke} strokeWidth={sw} />

      {/* Center circle */}
      <circle cx={w / 2} cy={h / 2} r={91.5} fill="none" stroke={stroke} strokeWidth={sw} />
      <circle cx={w / 2} cy={h / 2} r={3} fill={stroke} />

      {/* Top penalty area */}
      <rect x={(w - 404) / 2} y={20} width={404} height={165} fill="none" stroke={stroke} strokeWidth={sw} />
      {/* Top goal area */}
      <rect x={(w - 184) / 2} y={20} width={184} height={55} fill="none" stroke={stroke} strokeWidth={sw} />
      {/* Top penalty arc */}
      <path
        d={`M ${w / 2 - 73} ${185} A 91.5 91.5 0 0 0 ${w / 2 + 73} ${185}`}
        fill="none"
        stroke={stroke}
        strokeWidth={sw}
      />
      {/* Top penalty spot */}
      <circle cx={w / 2} cy={130} r={3} fill={stroke} />
      {/* Top goal */}
      <rect x={(w - 73) / 2} y={8} width={73} height={12} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={1} />

      {/* Bottom penalty area */}
      <rect x={(w - 404) / 2} y={h - 20 - 165} width={404} height={165} fill="none" stroke={stroke} strokeWidth={sw} />
      {/* Bottom goal area */}
      <rect x={(w - 184) / 2} y={h - 20 - 55} width={184} height={55} fill="none" stroke={stroke} strokeWidth={sw} />
      {/* Bottom penalty arc */}
      <path
        d={`M ${w / 2 - 73} ${h - 185} A 91.5 91.5 0 0 1 ${w / 2 + 73} ${h - 185}`}
        fill="none"
        stroke={stroke}
        strokeWidth={sw}
      />
      {/* Bottom penalty spot */}
      <circle cx={w / 2} cy={h - 130} r={3} fill={stroke} />
      {/* Bottom goal */}
      <rect x={(w - 73) / 2} y={h - 20} width={73} height={12} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={1} />

      {/* Corner arcs */}
      <path d={`M 20 30 A 10 10 0 0 1 30 20`} fill="none" stroke={stroke} strokeWidth={sw} />
      <path d={`M ${w - 30} 20 A 10 10 0 0 1 ${w - 20} 30`} fill="none" stroke={stroke} strokeWidth={sw} />
      <path d={`M 20 ${h - 30} A 10 10 0 0 0 30 ${h - 20}`} fill="none" stroke={stroke} strokeWidth={sw} />
      <path d={`M ${w - 30} ${h - 20} A 10 10 0 0 0 ${w - 20} ${h - 30}`} fill="none" stroke={stroke} strokeWidth={sw} />

      {children}
    </g>
  );
}

/** Pitch dimensions for coordinate calculations */
export const PITCH_WIDTH = 680;
export const PITCH_HEIGHT = 1050;
