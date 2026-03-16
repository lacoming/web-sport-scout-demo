import type { Player, FormationPlayer, HeatmapZone } from '../types';

export const players: Player[] = [
  {
    name: 'Marcus Rashford',
    club: 'Manchester United',
    position: 'LW',
    overall: 81,
    stats: { pace: 92, shooting: 78, passing: 65, dribbling: 85, defending: 38, physical: 72, vision: 60, positioning: 80 },
  },
  {
    name: 'Bukayo Saka',
    club: 'Arsenal',
    position: 'RW',
    overall: 86,
    stats: { pace: 82, shooting: 76, passing: 79, dribbling: 86, defending: 45, physical: 65, vision: 78, positioning: 83 },
  },
  {
    name: 'Phil Foden',
    club: 'Manchester City',
    position: 'CAM',
    overall: 88,
    stats: { pace: 80, shooting: 82, passing: 84, dribbling: 90, defending: 35, physical: 58, vision: 85, positioning: 87 },
  },
  {
    name: 'Mohamed Salah',
    club: 'Liverpool',
    position: 'RW',
    overall: 89,
    stats: { pace: 90, shooting: 89, passing: 72, dribbling: 88, defending: 30, physical: 70, vision: 74, positioning: 91 },
  },
];

export const formation: FormationPlayer[] = [
  { id: 1, name: 'Alisson', number: 1, position: 'GK', x: 50, y: 90, stats: { pace: 50, shooting: 20, passing: 55, defending: 30, physical: 75 } },
  { id: 2, name: 'Alexander-Arnold', number: 66, position: 'RB', x: 85, y: 70, stats: { pace: 76, shooting: 62, passing: 88, defending: 70, physical: 68 } },
  { id: 3, name: 'Van Dijk', number: 4, position: 'CB', x: 60, y: 75, stats: { pace: 72, shooting: 50, passing: 70, defending: 92, physical: 86 } },
  { id: 4, name: 'Konaté', number: 5, position: 'CB', x: 40, y: 75, stats: { pace: 82, shooting: 35, passing: 55, defending: 85, physical: 88 } },
  { id: 5, name: 'Robertson', number: 26, position: 'LB', x: 15, y: 70, stats: { pace: 82, shooting: 45, passing: 78, defending: 76, physical: 74 } },
  { id: 6, name: 'Mac Allister', number: 10, position: 'CM', x: 55, y: 50, stats: { pace: 68, shooting: 72, passing: 82, defending: 72, physical: 70 } },
  { id: 7, name: 'Szoboszlai', number: 8, position: 'CM', x: 35, y: 45, stats: { pace: 74, shooting: 74, passing: 78, defending: 55, physical: 72 } },
  { id: 8, name: 'Gravenberch', number: 38, position: 'CM', x: 65, y: 55, stats: { pace: 76, shooting: 65, passing: 75, defending: 68, physical: 78 } },
  { id: 9, name: 'Salah', number: 11, position: 'RW', x: 80, y: 25, stats: { pace: 90, shooting: 89, passing: 72, defending: 30, physical: 70 } },
  { id: 10, name: 'Núñez', number: 9, position: 'ST', x: 50, y: 15, stats: { pace: 88, shooting: 82, passing: 52, defending: 25, physical: 80 } },
  { id: 11, name: 'Díaz', number: 7, position: 'LW', x: 20, y: 25, stats: { pace: 85, shooting: 70, passing: 68, defending: 40, physical: 65 } },
];

/**
 * Generate realistic heatmap data for an attacking player.
 * Higher activity in opponent half and center areas.
 */
function generateHeatmapData(seed: number): HeatmapZone[] {
  const zones: HeatmapZone[] = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 6; col++) {
      // More activity toward top (opponent goal) and center columns
      const verticalBias = Math.max(0, (7 - row) * 8);
      const centerBias = Math.max(0, 15 - Math.abs(col - 2.5) * 8);
      const base = verticalBias + centerBias;
      const noise = Math.sin(seed * (row * 6 + col + 1) * 1.7) * 20 + 10;
      const value = Math.min(100, Math.max(0, Math.round(base + noise)));
      zones.push({ row, col, value });
    }
  }
  return zones;
}

export const heatmapData: Record<string, HeatmapZone[]> = {
  passes: generateHeatmapData(1),
  shots: generateHeatmapData(2),
  touches: generateHeatmapData(3),
};
