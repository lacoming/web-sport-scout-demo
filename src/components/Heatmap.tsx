import { useState } from 'react';
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

export function Heatmap() {
  const [mode, setMode] = useState<HeatmapMode>('passes');
  const [hoveredZone, setHoveredZone] = useState<{ row: number; col: number; value: number; x: number; y: number } | null>(null);

  const zones = heatmapData[mode];

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Mode switcher */}
      <div className="flex gap-2">
        {MODES.map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-lg text-sm font-[family-name:var(--font-text)] font-medium transition-all duration-200 cursor-pointer ${
              mode === m
                ? 'bg-accent-cyan text-gray-900'
                : 'bg-bg-card text-gray-400 hover:text-white border border-white/6'
            }`}
          >
            {{ passes: 'Передачи', shots: 'Удары', touches: 'Касания' }[m]}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${PITCH_WIDTH} ${PITCH_HEIGHT}`} className="w-full max-w-[400px]">
        <FootballPitch>
          {/* Heatmap zones */}
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
            <g>
              <rect
                x={hoveredZone.x - 30}
                y={hoveredZone.y - 30}
                width={60}
                height={24}
                rx={6}
                fill="#111827"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={1}
              />
              <text
                x={hoveredZone.x}
                y={hoveredZone.y - 15}
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
}
