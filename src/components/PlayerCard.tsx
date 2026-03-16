import { useState } from 'react';
import type { Player, StatKey } from '../types';
import { STAT_LABELS, STAT_SHORT } from '../types';
import { radarPoint, polygonPoints } from '../utils/geometry';
import { useCompareStore } from '../store/useCompareStore';

interface PlayerCardProps {
  player: Player;
  manageMode: boolean;
  onRemove: (name: string) => void;
}

const MINI_AXES: StatKey[] = ['pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical'];
const MINI_CX = 60;
const MINI_CY = 60;
const MINI_R = 45;

export function PlayerCard({ player, manageMode, onRemove }: PlayerCardProps) {
  const [flipped, setFlipped] = useState(false);
  const { addToCompare, compareList } = useCompareStore();

  const isInCompare = compareList.some((p) => p.name === player.name);
  const miniValues = MINI_AXES.map((k) => player.stats[k]);

  // Position color
  const posColor =
    player.position === 'GK' ? '#eab308' :
    ['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(player.position) ? '#3b82f6' :
    ['CM', 'CDM', 'CAM'].includes(player.position) ? '#22c55e' :
    '#ef4444';

  return (
    <div
      className={`perspective-1000 w-[220px] h-[320px] ${manageMode ? 'animate-wiggle' : ''}`}
    >
      <div
        className={`relative w-full h-full preserve-3d transition-transform duration-500 cursor-pointer ${flipped ? 'rotate-y-180' : ''}`}
        onClick={() => !manageMode && setFlipped(!flipped)}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden rounded-2xl bg-bg-card border border-white/6 overflow-hidden flex flex-col">
          {/* Photo placeholder — gradient */}
          <div
            className="h-[140px] w-full"
            style={{
              background: `linear-gradient(135deg, ${posColor}33 0%, #111827 60%, ${posColor}11 100%)`,
            }}
          >
            <div className="flex items-end justify-between h-full px-4 pb-3">
              <span
                className="text-4xl font-bold font-[family-name:var(--font-data)] text-white/90"
              >
                {player.overall}
              </span>
              <span
                className="text-xs font-semibold px-2 py-1 rounded font-[family-name:var(--font-text)]"
                style={{ backgroundColor: posColor + '33', color: posColor }}
              >
                {player.position}
              </span>
            </div>
          </div>

          <div className="flex flex-col flex-1 px-4 py-3 gap-1">
            <h3 className="text-lg font-bold text-white font-[family-name:var(--font-text)] leading-tight">
              {player.name}
            </h3>
            <p className="text-xs text-gray-400 font-[family-name:var(--font-text)]">
              {player.club}
            </p>

            {/* Quick stats row */}
            <div className="mt-auto grid grid-cols-3 gap-2 pt-3 border-t border-white/6">
              {(['pace', 'shooting', 'dribbling'] as StatKey[]).map((key) => (
                <div key={key} className="text-center">
                  <div className="text-sm font-bold font-[family-name:var(--font-data)] text-white">
                    {player.stats[key]}
                  </div>
                  <div className="text-[10px] text-gray-500 font-[family-name:var(--font-text)] uppercase">
                    {STAT_SHORT[key]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Manage mode overlay */}
          {manageMode && (
            <div className="absolute inset-0 bg-black/20 flex items-start justify-between p-2">
              <button
                onClick={(e) => { e.stopPropagation(); onRemove(player.name); }}
                className="w-7 h-7 rounded-full bg-red-500/90 text-white text-sm font-bold flex items-center justify-center hover:bg-red-400 transition-colors cursor-pointer"
              >
                &times;
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); addToCompare(player); }}
                disabled={isInCompare || compareList.length >= 2}
                className={`px-3 py-1 rounded-lg text-xs font-semibold font-[family-name:var(--font-text)] transition-all cursor-pointer ${
                  isInCompare
                    ? 'bg-accent-cyan/20 text-accent-cyan'
                    : 'bg-accent-cyan text-gray-900 hover:bg-accent-cyan/80'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isInCompare ? 'Добавлен' : 'Сравнить'}
              </button>
            </div>
          )}
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl bg-bg-card border border-white/6 overflow-hidden flex flex-col p-4">
          <h3 className="text-sm font-bold text-white font-[family-name:var(--font-text)] mb-2">
            {player.name}
          </h3>

          {/* Mini radar */}
          <div className="flex justify-center">
            <svg viewBox="0 0 120 120" className="w-[120px] h-[120px]">
              {/* Grid */}
              {[33, 66, 100].map((level) => (
                <polygon
                  key={level}
                  points={(() => {
                    const vals = Array(6).fill(level);
                    return polygonPoints(MINI_CX, MINI_CY, MINI_R, vals);
                  })()}
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth={0.5}
                />
              ))}
              {/* Data polygon */}
              <polygon
                points={polygonPoints(MINI_CX, MINI_CY, MINI_R, miniValues)}
                fill="rgba(34, 211, 238, 0.25)"
                stroke="#22d3ee"
                strokeWidth={1.5}
              />
              {/* Dots */}
              {MINI_AXES.map((_, i) => {
                const pt = radarPoint(MINI_CX, MINI_CY, MINI_R, miniValues[i], i, 6);
                return <circle key={i} cx={pt.x} cy={pt.y} r={2.5} fill="#22d3ee" />;
              })}
              {/* Labels */}
              {MINI_AXES.map((key, i) => {
                const pt = radarPoint(MINI_CX, MINI_CY, MINI_R + 12, 100, i, 6);
                return (
                  <text
                    key={key}
                    x={pt.x}
                    y={pt.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="rgba(255,255,255,0.5)"
                    fontSize={6}
                    fontFamily="'Plus Jakarta Sans', sans-serif"
                  >
                    {STAT_SHORT[key]}
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Stat bars */}
          <div className="flex flex-col gap-1.5 mt-2 flex-1">
            {MINI_AXES.map((key) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-[10px] text-gray-500 w-8 font-[family-name:var(--font-data)]">
                  {STAT_LABELS[key].slice(0, 3).toUpperCase()}
                </span>
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent-cyan transition-all duration-500"
                    style={{ width: `${player.stats[key]}%` }}
                  />
                </div>
                <span className="text-[10px] text-white font-[family-name:var(--font-data)] w-6 text-right">
                  {player.stats[key]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
