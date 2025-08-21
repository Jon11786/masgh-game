<template>
  <div>
    <h2>Game Board</h2>
    <div v-for="cat in categories" :key="cat.id">
      <h3 class="font-medium">{{ cat.label }}</h3>
      <ul>
        <li
          v-for="(opt, idx) in cat.options"
          :key="idx"
          :class="{ 'line-through': opt.eliminated }"
        >
          {{ opt.text }}
        </li>
      </ul>
    </div>

    <button
      v-if="!running"
      @click="start"
    >
      Start
    </button>

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useGameStore } from '@/store/game';

const store = useGameStore();
const categories = computed(() => store.categories);
const running = ref(false);
let timer: number | undefined;

function start() {
  if (running.value) return;
  running.value = true;
  timer = window.setInterval(() => {
    store.eliminate();
    if (Object.keys(store.results).length) {
      window.clearInterval(timer);
      running.value = false;
    }
  }, 500);
}

onMounted(start);
</script>

<style scoped>
.line-through {
  text-decoration: line-through;
}
</style>
