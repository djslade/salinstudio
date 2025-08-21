<script setup lang="ts">
defineProps<{ textAlign?: "left" | "center" | "right" }>();
</script>

<template>
  <p class="panel-p" :style="{ textAlign: textAlign ?? 'left' }">
    <slot />
  </p>
</template>

<style scoped>
.panel-p {
  color: #d0bfad;
  line-height: 1.7;
  letter-spacing: 2px;
  font-family: sans-serif;
  font-size: 0.8rem;
}

@media (min-width: 600px) {
  .panel-p {
    font-size: 0.9rem;
  }
}

@media (min-width: 900px) {
  .panel-p {
    font-size: 1rem;
  }
}
</style>
