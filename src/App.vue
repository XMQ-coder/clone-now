<script setup>
import { ref, computed } from 'vue'
import { RouterView } from 'vue-router'
let h = ref(document.documentElement.clientHeight)
let cssVars = computed(() => {
  return {
    '--winH': h.value + "px"
  }
})
window.addEventListener('resize', () => {
  h.value = document.documentElement.clientHeight
})
</script>

<template>
  <div class="container" :style="cssVars">
    <RouterView />
  </div>
</template>

<style scoped>
  .container {
    width: 100%;
    height: var(--winH);
  }
</style>
