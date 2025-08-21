import { defineStore } from 'pinia';
import type { Category, Option } from '@/types/types';
import { v4 as uuidv4 } from 'uuid';

function emptyOptions(n = 4): Option[] {
  return Array.from({ length: n }, () => ({ text: '', eliminated: false }))
}

export const useGameStore = defineStore('game', {
  state: () => ({
    categories: [
      { id: 'Partner', label: 'Partner', options: emptyOptions() } as Category,
      { id: 'Kids', label: 'Kids', options: emptyOptions() } as Category,
      { id: 'Job', label: 'Job', options: emptyOptions() } as Category,
      { id: 'Salary', label: 'Salary', options: emptyOptions() } as Category,
      { id: 'Car', label: 'Car', options: emptyOptions() } as Category,
      { id: 'Location', label: 'Location', options: emptyOptions() } as Category,
    ],
    eliminationSequence: [] as { categoryId: string; option: string }[],
    results: {} as Record<string, string>
  }),

  getters: {
    categoriesValid: (s) =>
      s.categories.length >= 4 &&
      s.categories.every(c =>
        c.label.trim().length > 0 &&
        c.options.filter(o => o.text.trim().length > 0).length >= 3
      ),
  },

  actions: {
    addCategory() {
      this.categories.push({
        id: uuidv4(),
        label: `New Category`,
        options: emptyOptions(),
      });
    },
    removeCategory(idx: number) {
      this.categories.splice(idx, 1);
    },
    eliminate() {
      const available = this.categories.filter(
        c => c.options.filter(o => !o.eliminated).length > 1
      )
      if (!available.length) {
        this.results = this.categories.reduce((acc, c) => {
          const winner = c.options.find(o => !o.eliminated)
          if (winner) acc[c.label] = winner.text
          return acc
        }, {} as Record<string, string>)
        return
      }

      const cat = available[Math.floor(Math.random() * available.length)]
      const candidates = cat.options.filter(o => !o.eliminated)
      const choice = candidates[Math.floor(Math.random() * candidates.length)]
      choice.eliminated = true
      this.eliminationSequence.push({ categoryId: cat.id, option: choice.text })
    },
  }
});
