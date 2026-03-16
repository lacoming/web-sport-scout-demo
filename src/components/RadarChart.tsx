import { useState, memo, useMemo } from 'react';
import type { PlayerStats, StatKey } from '../types';
import { STAT_KEYS, STAT_LABELS } from '../types';
import { radarPoint, gridRingPoints, polygonPoints } from '../utils/geometry';

interface RadarChartProps {
  player1: { name: string; stats: PlayerStats };
  player2: { name: string; stats: PlayerStats };
}

const CX = 250;
const CY = 250;
const RADIUS = 180;
const AXES = 8;
const GRID_LEVELS = [33, 66, 100];

export const RadarChart = memo(function RadarChart({ player1, player2 }: RadarChartProps) {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    label: string;
    value: number;
    color: string;
  } | null>(null);

  const p1Values = useMemo(() => STAT_KEYS.map((k) => player1.stats[k]), [player1.stats]);
  const p2Values = useMemo(() => STAT_KEYS.map((k) => player2.stats[k]), [player2.stats]);
  const p1Polygon = useMemo(() => polygonPoints(CX, CY, RADIUS, p1Values), [p1Values]);
  const p2Polygon = useMemo(() => polygonPoints(CX, CY, RADIUS, p2Values), [p2Values]);
  const gridRings = useMemo(() => GRID_LEVELS.map(l => gridRingPoints(CX, CY, RADIUS, AXES, l)), []);

  const handleDotHover = (
    statKey: StatKey,
    playerName: string,
    value: number,
    x: number,
    y: number,
    color: string,
  ) => {
    setTooltip({ x, y, label: `${playerName}: ${STAT_LABELS[statKey]}`, value, color });
  };

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 500 500" className="w-full max-w-[500px]">
        <defs>
          {/* Cyan glow filter */}
          <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          {/* Orange glow filter */}
          <filter id="glow-orange" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          {/* Radial gradient for center */}
          <radialGradient id="radar-center-glow">
            <stop offset="0%" stopColor="rgba(34,211,238,0.08)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Subtle center glow */}
        <circle cx={CX} cy={CY} r={RADIUS} fill="url(#radar-center-glow)" />

        {/* Grid rings (hexagonal) */}
        {GRID_LEVELS.map((level, idx) => (
          <polygon
            key={level}
            points={gridRings[idx]}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
            className={level === 100 ? '' : ''}
          />
        ))}

        {/* Axis lines */}
        {STAT_KEYS.map((_, i) => {
          const pt = radarPoint(CX, CY, RADIUS, 100, i, AXES);
          return (
            <line
              key={i}
              x1={CX}
              y1={CY}
              x2={pt.x}
              y2={pt.y}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth={1}
            />
          );
        })}

        {/* Player 2 polygon (behind) — with stroke animation */}
        <polygon
          points={p2Polygon}
          fill="rgba(249, 115, 22, 0.15)"
          stroke="#f97316"
          strokeWidth={2}
          className="animate-radar-polygon"
          style={{ animationDelay: '100ms' }}
          filter="url(#glow-orange)"
        />

        {/* Player 1 polygon (front) — with stroke animation */}
        <polygon
          points={p1Polygon}
          fill="rgba(34, 211, 238, 0.15)"
          stroke="#22d3ee"
          strokeWidth={2}
          className="animate-radar-polygon"
          filter="url(#glow-cyan)"
        />

        {/* Interactive dots — Player 1 */}
        {STAT_KEYS.map((key, i) => {
          const pt = radarPoint(CX, CY, RADIUS, player1.stats[key], i, AXES);
          return (
            <g key={`p1-${key}`}>
              {/* Glow ring on hover */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={12}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => handleDotHover(key, player1.name, player1.stats[key], pt.x, pt.y, '#22d3ee')}
                onMouseLeave={() => setTooltip(null)}
              />
              <circle
                cx={pt.x}
                cy={pt.y}
                r={5}
                fill="#22d3ee"
                stroke="#0a0f1c"
                strokeWidth={2}
                className="animate-radar-dots"
                style={{ animationDelay: `${600 + i * 50}ms` }}
                pointerEvents="none"
              />
            </g>
          );
        })}

        {/* Interactive dots — Player 2 */}
        {STAT_KEYS.map((key, i) => {
          const pt = radarPoint(CX, CY, RADIUS, player2.stats[key], i, AXES);
          return (
            <g key={`p2-${key}`}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={12}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => handleDotHover(key, player2.name, player2.stats[key], pt.x, pt.y, '#f97316')}
                onMouseLeave={() => setTooltip(null)}
              />
              <circle
                cx={pt.x}
                cy={pt.y}
                r={5}
                fill="#f97316"
                stroke="#0a0f1c"
                strokeWidth={2}
                className="animate-radar-dots"
                style={{ animationDelay: `${650 + i * 50}ms` }}
                pointerEvents="none"
              />
            </g>
          );
        })}

        {/* Axis labels */}
        {STAT_KEYS.map((key, i) => {
          const pt = radarPoint(CX, CY, RADIUS + 28, 100, i, AXES);
          return (
            <text
              key={key}
              x={pt.x}
              y={pt.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(255,255,255,0.5)"
              fontSize={11}
              fontFamily="'Plus Jakarta Sans', sans-serif"
              fontWeight={500}
            >
              {STAT_LABELS[key]}
            </text>
          );
        })}

        {/* Tooltip */}
        {tooltip && (
          <g className="animate-fade-in-up">
            <rect
              x={tooltip.x - 50}
              y={tooltip.y - 38}
              width={100}
              height={28}
              rx={8}
              fill="rgba(17,24,39,0.95)"
              stroke={tooltip.color}
              strokeWidth={1}
            />
            <text
              x={tooltip.x}
              y={tooltip.y - 20}
              textAnchor="middle"
              fill="white"
              fontSize={12}
              fontFamily="'JetBrains Mono', monospace"
              fontWeight={600}
            >
              {tooltip.value}
            </text>
          </g>
        )}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-8 mt-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-accent-cyan inline-block shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
          <span className="text-sm font-[family-name:var(--font-text)] text-gray-300">{player1.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-accent-orange inline-block shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
          <span className="text-sm font-[family-name:var(--font-text)] text-gray-300">{player2.name}</span>
        </div>
      </div>
    </div>
  );
});
