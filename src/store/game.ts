import { defineStore } from 'pinia';
import type { Category } from '@/types/types';
import { v4 as uuidv4 } from 'uuid';

function emptyOptions(n = 4) { return Array.from({ length: n }, () => ''); }

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
  }),

  getters: {
    categoriesValid: (s) =>
      s.categories.length >= 4 &&
      s.categories.every(c =>
        c.label.trim().length > 0 &&
        c.options.filter(o => o.trim().length > 0).length >= 3
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
  }
});
