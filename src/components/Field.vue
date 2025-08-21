<template>
  <label>
    <span v-if="label" class="help">{{ label }}</span>
    <slot />
  </label>
</template>

<script setup lang="ts">
defineProps<{ label?: string; }>();
</script>
