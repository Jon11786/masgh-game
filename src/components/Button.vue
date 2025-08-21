<template>
  <button v-bind="$attrs" @click="$emit('click', $event)">
    <slot />
  </button>
</template>

<script setup lang="ts">
</script>

<style scoped>
</style>
