import { useState } from 'react';
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

export function RadarChart({ player1, player2 }: RadarChartProps) {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    label: string;
    value: number;
    color: string;
  } | null>(null);

  const p1Values = STAT_KEYS.map((k) => player1.stats[k]);
  const p2Values = STAT_KEYS.map((k) => player2.stats[k]);

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
        {/* Grid rings (hexagonal) */}
        {GRID_LEVELS.map((level) => (
          <polygon
            key={level}
            points={gridRingPoints(CX, CY, RADIUS, AXES, level)}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
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
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
          );
        })}

        {/* Player 2 polygon (behind) */}
        <polygon
          points={polygonPoints(CX, CY, RADIUS, p2Values)}
          fill="rgba(249, 115, 22, 0.2)"
          stroke="#f97316"
          strokeWidth={2}
          className="animate-radar-polygon"
          style={{ animationDelay: '100ms' }}
        />

        {/* Player 1 polygon (front) */}
        <polygon
          points={polygonPoints(CX, CY, RADIUS, p1Values)}
          fill="rgba(34, 211, 238, 0.25)"
          stroke="#22d3ee"
          strokeWidth={2}
          className="animate-radar-polygon"
        />

        {/* Interactive dots — Player 1 */}
        {STAT_KEYS.map((key, i) => {
          const pt = radarPoint(CX, CY, RADIUS, player1.stats[key], i, AXES);
          return (
            <circle
              key={`p1-${key}`}
              cx={pt.x}
              cy={pt.y}
              r={5}
              fill="#22d3ee"
              stroke="#0a0f1c"
              strokeWidth={2}
              className="animate-radar-dots cursor-pointer"
              style={{ animationDelay: `${600 + i * 50}ms` }}
              onMouseEnter={() => handleDotHover(key, player1.name, player1.stats[key], pt.x, pt.y, '#22d3ee')}
              onMouseLeave={() => setTooltip(null)}
            />
          );
        })}

        {/* Interactive dots — Player 2 */}
        {STAT_KEYS.map((key, i) => {
          const pt = radarPoint(CX, CY, RADIUS, player2.stats[key], i, AXES);
          return (
            <circle
              key={`p2-${key}`}
              cx={pt.x}
              cy={pt.y}
              r={5}
              fill="#f97316"
              stroke="#0a0f1c"
              strokeWidth={2}
              className="animate-radar-dots cursor-pointer"
              style={{ animationDelay: `${650 + i * 50}ms` }}
              onMouseEnter={() => handleDotHover(key, player2.name, player2.stats[key], pt.x, pt.y, '#f97316')}
              onMouseLeave={() => setTooltip(null)}
            />
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
              fill="rgba(255,255,255,0.7)"
              fontSize={12}
              fontFamily="'Plus Jakarta Sans', sans-serif"
            >
              {STAT_LABELS[key]}
            </text>
          );
        })}

        {/* Tooltip */}
        {tooltip && (
          <g>
            <rect
              x={tooltip.x - 45}
              y={tooltip.y - 34}
              width={90}
              height={24}
              rx={6}
              fill="#111827"
              stroke={tooltip.color}
              strokeWidth={1}
            />
            <text
              x={tooltip.x}
              y={tooltip.y - 19}
              textAnchor="middle"
              fill="white"
              fontSize={11}
              fontFamily="'JetBrains Mono', monospace"
              fontWeight={600}
            >
              {tooltip.value}
            </text>
          </g>
        )}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-accent-cyan inline-block" />
          <span className="text-sm font-[family-name:var(--font-text)] text-gray-300">{player1.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-accent-orange inline-block" />
          <span className="text-sm font-[family-name:var(--font-text)] text-gray-300">{player2.name}</span>
        </div>
      </div>
    </div>
  );
}
