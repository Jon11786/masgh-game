<template>
  <div>
    <h2>Game Board</h2>

    <div>Eliminate every {{count}}</div>

    <div v-for="(cat, ci) in categories" :key="cat.id" style="margin-bottom: 8px;">
      <h3>{{ cat.label }}</h3>
      <ul style="list-style:none; padding:0; margin:0; display:flex; gap:8px; flex-wrap:wrap;">
        <li
          v-for="(opt, oi) in cat.options"
          :key="opt.id"
          :class="[
            'option',
            opt.eliminated ? 'eliminated' : '',
            isCursor(ci, oi) ? 'cursor' : ''
          ]"
        >
          {{ opt.text }}
        </li>
      </ul>
    </div>

    <div style="margin-top: 12px;">
      <button :disabled="running" @click="start">Start</button>
      <button :disabled="running" @click="resetBoard">Reset</button>
    </div>

    <div v-if="hasResults">
      <h3>Results</h3>
      <ul>
        <li v-for="(winner, label) in results" :key="label">
          <strong>{{ label }}:</strong> {{ winner || '—' }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onBeforeUnmount } from 'vue';
import { useGameStore } from '@/store/game';

const store = useGameStore();
let count = 0;
const categories = computed(() => store.categories);
const running = ref(false);
let timer: number | undefined;

const results = computed(() => store.results);
const hasResults = computed(() => Object.keys(results.value).length > 0);

function start() {
  if (running.value) return;
  count = Math.floor(Math.random() * 10) + 1;
  store.startElimination(count);
  run(500);
}

function run(interval = 500) {
  running.value = true;
  timer = window.setInterval(() => {
    const done = store.tickElimination();
    if (done) {
      stop();
    }
  }, interval);
}

function resetBoard() {
  stop();
  store.resetEliminations();
}

function stop() {
  if (timer) {
    clearInterval(timer);
    timer = undefined;
  }
  running.value = false;
}

function isCursor(ci: number, oi: number) {
  const cursor = store.cursor;
  return !!cursor && cursor.categoryIndex === ci && cursor.optionIndex === oi;
}

onBeforeUnmount(stop);
</script>

<style scoped>
.option{
  padding:6px 10px; border-radius:50%;
}
.eliminated{ text-decoration: line-through; opacity: .50 }
.cursor{
  box-shadow: 0 0 0 1px black;
  transform: translateY(-1px);
}
</style>
