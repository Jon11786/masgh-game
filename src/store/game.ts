import { defineStore } from 'pinia';
import { v4 as uuid } from 'uuid';

export interface Option { id: string; text: string; eliminated: boolean }
export interface Category { id: string; label: string; options: Option[] }

function emptyOptions(n = 4): Option[] {
  return Array.from({ length: n }, () => ({ id: uuid(), text: '', eliminated: false }));
}

export const useGameStore = defineStore('game', {
  state: () => ({
    categories: [
      { id: 'House', label: 'House', options: emptyOptions() },
      { id: 'Partner', label: 'Partner', options: emptyOptions() },
      { id: 'Kids', label: 'Kids', options: emptyOptions() },
      { id: 'Job', label: 'Job', options: emptyOptions() },
      { id: 'Salary', label: 'Salary', options: emptyOptions() },
      { id: 'Car', label: 'Car', options: emptyOptions() },
    ] as Category[],

    ring: [] as Array<{ categoryIndex: number; optionIndex: number }>,
    cursorIndex: -1,
    stepCount: 0,
    stepSize: 0,

    eliminationSequence: [] as { categoryId: string; optionId: string }[],
    results: {} as Record<string, string>,
  }),

  getters: {
    categoriesValid: (s) =>
      s.categories.length >= 4 &&
      s.categories.every(c =>
        c.label.trim().length > 0 &&
        c.options.filter(o => o.text.trim().length > 0).length >= 3
      ),
    finished(state) {
      return state.categories.every(c => c.options.filter(o => !o.eliminated).length === 1);
    },
    cursor(state) {
      return state.ring[state.cursorIndex] ?? null;
    },
  },

  actions: {
    addCategory() {
      this.categories.push({
        id: uuid(),
        label: `New Category`,
        options: emptyOptions(),
      });
    },
    removeCategory(idx: number) {
      this.categories.splice(idx, 1);
    },
    buildRing() {
      this.ring = [];
      this.categories.forEach((c, ci) => {
        c.options.forEach((_o, oi) => this.ring.push({ categoryIndex: ci, optionIndex: oi }));
      });
      this.cursorIndex = -1;
    },

    resetEliminations() {
      this.categories.forEach(c => c.options.forEach(o => (o.eliminated = false)));
      this.eliminationSequence = [];
      this.results = {};
      this.stepCount = 0;
      this.cursorIndex = -1;
      this.stepSize = 0;
    },

    startElimination(n: number) {
      this.resetEliminations();
      this.stepSize = Math.max(1, Math.floor(n || 1));
      this.buildRing();
    },

    nextCountable(from: number) {
      if (!this.ring.length) return -1;
      let i = from;
      for (let k = 0; k < this.ring.length; k++) {
        i = (i + 1) % this.ring.length;
        const { categoryIndex, optionIndex } = this.ring[i];
        const cat = this.categories[categoryIndex];
        const opt = cat.options[optionIndex];
        const aliveInCat = cat.options.filter(x => !x.eliminated).length;
        if (!opt.eliminated && aliveInCat > 1) return i;
      }
      return from;
    },

    tickElimination(): boolean {
      if (this.finished) {
        this.settleResults();
        return true;
      }

      this.cursorIndex = this.nextCountable(this.cursorIndex);
      if (this.cursorIndex < 0) return true;

      const { categoryIndex, optionIndex } = this.ring[this.cursorIndex];
      const cat = this.categories[categoryIndex];
      const opt = cat.options[optionIndex];

      const aliveInCat = cat.options.filter(x => !x.eliminated).length;
      if (!opt.eliminated && aliveInCat > 1) {
        this.stepCount++;

        if (this.stepCount >= this.stepSize) {
          opt.eliminated = true;
          this.eliminationSequence.push({ categoryId: cat.id, optionId: opt.id });
          this.stepCount = 0;
        }
      }

      if (this.finished) {
        this.finish();
        return true;
      }
      return false;
    },

    finish() {
      this.results = this.categories.reduce((acc, c) => {
        const winner = c.options.find(o => !o.eliminated);
        if (winner) acc[c.label] = winner.text;
        return acc;
      }, {} as Record<string, string>);
    },
  },
});
