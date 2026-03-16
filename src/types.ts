export interface PlayerStats {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  vision: number;
  positioning: number;
}

export interface Player {
  name: string;
  club: string;
  position: string;
  overall: number;
  stats: PlayerStats;
}

export interface FormationPlayer {
  id: number;
  name: string;
  number: number;
  position: string;
  x: number;
  y: number;
  stats?: {
    pace: number;
    shooting: number;
    passing: number;
    defending: number;
    physical: number;
  };
}

export interface HeatmapZone {
  row: number;
  col: number;
  value: number;
}

export type HeatmapMode = 'passes' | 'shots' | 'touches';

export type PitchToolMode = 'view' | 'move' | 'draw';

export interface DrawnArrow {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export type StatKey = keyof PlayerStats;

export const STAT_KEYS: StatKey[] = [
  'pace', 'shooting', 'passing', 'dribbling',
  'defending', 'physical', 'vision', 'positioning',
];

export const STAT_LABELS: Record<StatKey, string> = {
  pace: 'Скорость',
  shooting: 'Удар',
  passing: 'Пас',
  dribbling: 'Дриблинг',
  defending: 'Защита',
  physical: 'Физика',
  vision: 'Видение',
  positioning: 'Позиция',
};

export const STAT_SHORT: Record<StatKey, string> = {
  pace: 'СКР',
  shooting: 'УДР',
  passing: 'ПАС',
  dribbling: 'ДРБ',
  defending: 'ЗАЩ',
  physical: 'ФИЗ',
  vision: 'ВИД',
  positioning: 'ПОЗ',
};
