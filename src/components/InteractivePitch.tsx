import { useState, useRef, useCallback } from 'react';
import { FootballPitch, PITCH_WIDTH, PITCH_HEIGHT } from './FootballPitch';
import { formation as initialFormation } from '../data/players';
import { useMouseDrag } from '../hooks/useMouseDrag';
import type { FormationPlayer, PitchToolMode, DrawnArrow } from '../types';

const TOOL_MODES: { mode: PitchToolMode; label: string; icon: string }[] = [
  { mode: 'view', label: 'Обзор', icon: '👁' },
  { mode: 'move', label: 'Двигать', icon: '✋' },
  { mode: 'draw', label: 'Рисовать', icon: '✏' },
];

export function InteractivePitch() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [toolMode, setToolMode] = useState<PitchToolMode>('view');
  const [players, setPlayers] = useState<FormationPlayer[]>(initialFormation);
  const [hoveredPlayer, setHoveredPlayer] = useState<FormationPlayer | null>(null);
  const [arrows, setArrows] = useState<DrawnArrow[]>([]);
  const [drawingArrow, setDrawingArrow] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);

  const handleDrag = useCallback((id: number, x: number, y: number) => {
    // Convert SVG coords to percentage
    const px = Math.max(2, Math.min(98, (x / PITCH_WIDTH) * 100));
    const py = Math.max(2, Math.min(98, (y / PITCH_HEIGHT) * 100));
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, x: px, y: py } : p)));
  }, []);

  const { dragId, handleMouseDown, handleMouseMove, handleMouseUp } = useMouseDrag(svgRef, handleDrag);

  const toSvgCoords = (e: React.MouseEvent): { x: number; y: number } | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    return { x: (e.clientX - ctm.e) / ctm.a, y: (e.clientY - ctm.f) / ctm.d };
  };

  const handleSvgMouseDown = (e: React.MouseEvent) => {
    if (toolMode === 'draw') {
      const coords = toSvgCoords(e);
      if (coords) {
        setDrawingArrow({ x1: coords.x, y1: coords.y, x2: coords.x, y2: coords.y });
      }
    }
  };

  const handleSvgMouseMove = (e: React.MouseEvent) => {
    if (toolMode === 'move') {
      handleMouseMove(e);
    } else if (toolMode === 'draw' && drawingArrow) {
      const coords = toSvgCoords(e);
      if (coords) {
        setDrawingArrow((prev) => prev ? { ...prev, x2: coords.x, y2: coords.y } : null);
      }
    }
  };

  const handleSvgMouseUp = () => {
    if (toolMode === 'move') {
      handleMouseUp();
    } else if (toolMode === 'draw' && drawingArrow) {
      const dx = drawingArrow.x2 - drawingArrow.x1;
      const dy = drawingArrow.y2 - drawingArrow.y1;
      if (Math.sqrt(dx * dx + dy * dy) > 10) {
        setArrows((prev) => [...prev, { ...drawingArrow, id: `a-${Date.now()}` }]);
      }
      setDrawingArrow(null);
    }
  };

  return (
    <div className="flex gap-4 items-start justify-center">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${PITCH_WIDTH} ${PITCH_HEIGHT}`}
        className="w-full max-w-[400px]"
        onMouseDown={handleSvgMouseDown}
        onMouseMove={handleSvgMouseMove}
        onMouseUp={handleSvgMouseUp}
        onMouseLeave={() => { handleMouseUp(); setDrawingArrow(null); }}
        style={{ cursor: toolMode === 'draw' ? 'crosshair' : toolMode === 'move' ? 'grab' : 'default' }}
      >
        <defs>
          <marker id="arrowhead" markerWidth={10} markerHeight={7} refX={10} refY={3.5} orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#22d3ee" />
          </marker>
        </defs>

        <FootballPitch>
          {/* Drawn arrows */}
          {arrows.map((arrow) => (
            <line
              key={arrow.id}
              x1={arrow.x1}
              y1={arrow.y1}
              x2={arrow.x2}
              y2={arrow.y2}
              stroke="#22d3ee"
              strokeWidth={2}
              strokeDasharray="6,3"
              markerEnd="url(#arrowhead)"
            />
          ))}

          {/* Currently drawing arrow */}
          {drawingArrow && (
            <line
              x1={drawingArrow.x1}
              y1={drawingArrow.y1}
              x2={drawingArrow.x2}
              y2={drawingArrow.y2}
              stroke="#22d3ee"
              strokeWidth={2}
              strokeDasharray="6,3"
              opacity={0.6}
              markerEnd="url(#arrowhead)"
            />
          )}

          {/* Players */}
          {players.map((player, idx) => {
            const px = (player.x / 100) * PITCH_WIDTH;
            const py = (player.y / 100) * PITCH_HEIGHT;
            const isHovered = hoveredPlayer?.id === player.id;
            const isDragged = dragId === player.id;
            const r = isHovered || isDragged ? 28 : 22;

            return (
              <g
                key={player.id}
                className="animate-player-pop"
                style={{ animationDelay: `${idx * 60}ms` }}
                onMouseEnter={() => setHoveredPlayer(player)}
                onMouseLeave={() => setHoveredPlayer(null)}
                onMouseDown={(e) => toolMode === 'move' && handleMouseDown(player.id, e)}
              >
                {/* Glow on hover */}
                {isHovered && (
                  <circle cx={px} cy={py} r={r + 6} fill="rgba(34,211,238,0.15)" />
                )}
                {/* Player circle */}
                <circle
                  cx={px}
                  cy={py}
                  r={r}
                  fill={player.position === 'GK' ? '#374151' : '#111827'}
                  stroke={isHovered || isDragged ? '#22d3ee' : 'rgba(255,255,255,0.3)'}
                  strokeWidth={isHovered || isDragged ? 2.5 : 1.5}
                  className="transition-all duration-200"
                  style={{ cursor: toolMode === 'move' ? 'grab' : 'pointer' }}
                />
                {/* Number */}
                <text
                  x={px}
                  y={py + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize={14}
                  fontWeight={700}
                  fontFamily="'JetBrains Mono', monospace"
                  style={{ pointerEvents: 'none' }}
                >
                  {player.number}
                </text>
                {/* Name label */}
                <text
                  x={px}
                  y={py + r + 14}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.8)"
                  fontSize={10}
                  fontFamily="'Plus Jakarta Sans', sans-serif"
                  fontWeight={500}
                  style={{ pointerEvents: 'none' }}
                >
                  {player.name}
                </text>
              </g>
            );
          })}

          {/* Hover stats card */}
          {hoveredPlayer && toolMode === 'view' && hoveredPlayer.stats && (() => {
            const px = (hoveredPlayer.x / 100) * PITCH_WIDTH;
            const py = (hoveredPlayer.y / 100) * PITCH_HEIGHT;
            const cardX = px + 35;
            const cardY = Math.max(30, py - 70);
            const stats = hoveredPlayer.stats;
            const entries = [
              ['СКР', stats.pace],
              ['УДР', stats.shooting],
              ['ПАС', stats.passing],
              ['ЗАЩ', stats.defending],
              ['ФИЗ', stats.physical],
            ] as const;
            return (
              <g>
                <rect x={cardX} y={cardY} width={100} height={96} rx={8} fill="#111827" stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
                <text x={cardX + 50} y={cardY + 16} textAnchor="middle" fill="#22d3ee" fontSize={11} fontWeight={700} fontFamily="'Plus Jakarta Sans', sans-serif">
                  {hoveredPlayer.name}
                </text>
                {entries.map(([label, val], i) => (
                  <g key={label}>
                    <text x={cardX + 10} y={cardY + 34 + i * 13} fill="rgba(255,255,255,0.5)" fontSize={9} fontFamily="'JetBrains Mono', monospace">
                      {label}
                    </text>
                    <text x={cardX + 90} y={cardY + 34 + i * 13} textAnchor="end" fill="white" fontSize={9} fontWeight={600} fontFamily="'JetBrains Mono', monospace">
                      {val}
                    </text>
                  </g>
                ))}
              </g>
            );
          })()}
        </FootballPitch>
      </svg>

      {/* Toolbar */}
      <div className="flex flex-col gap-2 bg-bg-card rounded-xl p-2 border border-white/6">
        {TOOL_MODES.map(({ mode, label, icon }) => (
          <button
            key={mode}
            onClick={() => setToolMode(mode)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-[family-name:var(--font-text)] font-medium transition-all cursor-pointer ${
              toolMode === mode
                ? 'bg-accent-cyan/20 text-accent-cyan'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="text-base">{icon}</span>
            {label}
          </button>
        ))}
        {arrows.length > 0 && (
          <button
            onClick={() => setArrows([])}
            className="px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-400/10 transition-all cursor-pointer font-[family-name:var(--font-text)]"
          >
            Очистить
          </button>
        )}
      </div>
    </div>
  );
}
