import { create } from 'zustand';
import type { Player } from '../types';

interface CompareStore {
  compareList: Player[];
  addToCompare: (player: Player) => void;
  removeFromCompare: (name: string) => void;
  clearCompare: () => void;
}

export const useCompareStore = create<CompareStore>((set) => ({
  compareList: [],
  addToCompare: (player) =>
    set((state) => {
      if (state.compareList.length >= 2) return state;
      if (state.compareList.some((p) => p.name === player.name)) return state;
      return { compareList: [...state.compareList, player] };
    }),
  removeFromCompare: (name) =>
    set((state) => ({
      compareList: state.compareList.filter((p) => p.name !== name),
    })),
  clearCompare: () => set({ compareList: [] }),
}));
