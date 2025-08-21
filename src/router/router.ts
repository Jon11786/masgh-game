import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '@/views/HomeView.vue';
import PlayView from '@/views/PlayView.vue';
import SetupView from '@/views/SetupView.vue';
import { useGameStore } from '@/store/game.ts'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView, name: 'Home' },
    { path: '/setup', component: SetupView, name: 'setup' },
    {
      path: '/play',
      name: 'play',
      component: PlayView,
      beforeEnter: () => {
        const store = useGameStore();
        return store.categoriesValid ? true : { name: 'setup' };
      }
    }
  ],
});

export default router;
