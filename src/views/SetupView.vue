<template>
  <section>
    <Card>
      <h2>Enter your categories & options</h2>
      <p class="help">Inclued at least 3 categories</p>

      <div>
        <div v-for="(cat, idx) in store.categories" :key="cat.id" class="cat">
          <div>
            <Field label="Category label">
              <input v-model="cat.label" placeholder="e.g., Car" />
            </Field>
            <Button v-if="store.categories.length > 3"  @click="store.removeCategory(idx)">
              Remove
            </Button>
          </div>

          <div>
            <Field v-for="(opt, j) in cat.options" :key="j" :label="`Option ${j+1}`">
              <input v-model="cat.options[j].text" placeholder="Add option" />
            </Field>
          </div>
        </div>
      </div>

      <div>
        <Button @click.stop="store.addCategory()">Add category</Button>
        <Button :disabled="!store.categoriesValid" @click="goPlay">Play</Button>
      </div>
    </Card>
  </section>
</template>

<script setup lang="ts">
import { useGameStore } from '@/store/game';
import Button from '@/components/Button.vue';
import Card from '@/components/Card.vue';
import Field from '@/components/Field.vue';
import { useRouter } from 'vue-router';

const store = useGameStore();
const router = useRouter();

function goPlay() {
  if (store.categoriesValid) router.push({ name: 'play' });
}
</script>

<style scoped>

</style>
