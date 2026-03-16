import { useState, memo } from 'react';
import { FootballPitch, PITCH_WIDTH, PITCH_HEIGHT } from './FootballPitch';
import { heatmapColor } from '../utils/geometry';
import { heatmapData } from '../data/players';
import type { HeatmapMode } from '../types';

const ROWS = 8;
const COLS = 6;
const PAD = 20;
const CELL_W = (PITCH_WIDTH - PAD * 2) / COLS;
const CELL_H = (PITCH_HEIGHT - PAD * 2) / ROWS;

const MODES: HeatmapMode[] = ['passes', 'shots', 'touches'];
const MODE_LABELS: Record<HeatmapMode, string> = {
  passes: 'Передачи',
  shots: 'Удары',
  touches: 'Касания',
};

export const Heatmap = memo(function Heatmap() {
  const [mode, setMode] = useState<HeatmapMode>('passes');
  const [hoveredZone, setHoveredZone] = useState<{ row: number; col: number; value: number; x: number; y: number } | null>(null);

  const zones = heatmapData[mode];

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Mode switcher */}
      <div className="flex gap-2 p-1 bg-white/[0.03] rounded-xl border border-white/[0.06]">
        {MODES.map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-lg text-sm font-[family-name:var(--font-text)] font-medium transition-all duration-300 cursor-pointer ${
              mode === m
                ? 'bg-accent-cyan text-gray-900 shadow-[0_0_16px_rgba(34,211,238,0.2)]'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${PITCH_WIDTH} ${PITCH_HEIGHT}`} className="w-full max-w-[400px]">
        <defs>
          <filter id="heatmap-blur" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        <FootballPitch>
          {/* Blurred heatmap layer underneath for soft glow */}
          <g filter="url(#heatmap-blur)" opacity={0.5}>
            {zones.map((zone) => {
              const x = PAD + zone.col * CELL_W;
              const y = PAD + zone.row * CELL_H;
              return (
                <rect
                  key={`blur-${zone.row}-${zone.col}`}
                  x={x}
                  y={y}
                  width={CELL_W}
                  height={CELL_H}
                  fill={heatmapColor(zone.value)}
                />
              );
            })}
          </g>

          {/* Sharp heatmap zones on top */}
          {zones.map((zone) => {
            const x = PAD + zone.col * CELL_W;
            const y = PAD + zone.row * CELL_H;
            const isHovered = hoveredZone?.row === zone.row && hoveredZone?.col === zone.col;
            return (
              <rect
                key={`${zone.row}-${zone.col}`}
                x={x}
                y={y}
                width={CELL_W}
                height={CELL_H}
                rx={2}
                fill={heatmapColor(zone.value)}
                opacity={isHovered ? 1 : 0.8}
                className={`transition-opacity duration-300 ${isHovered ? 'animate-pulse-zone' : ''}`}
                onMouseEnter={() => setHoveredZone({ ...zone, x: x + CELL_W / 2, y: y + CELL_H / 2 })}
                onMouseLeave={() => setHoveredZone(null)}
                style={{ cursor: 'crosshair' }}
              />
            );
          })}

          {/* Tooltip */}
          {hoveredZone && (
            <g className="animate-fade-in-up">
              <rect
                x={hoveredZone.x - 32}
                y={hoveredZone.y - 32}
                width={64}
                height={26}
                rx={8}
                fill="rgba(17,24,39,0.95)"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth={1}
              />
              <text
                x={hoveredZone.x}
                y={hoveredZone.y - 15.5}
                textAnchor="middle"
                fill="white"
                fontSize={12}
                fontFamily="'JetBrains Mono', monospace"
                fontWeight={600}
              >
                {hoveredZone.value}
              </text>
            </g>
          )}
        </FootballPitch>
      </svg>
    </div>
  );
});
