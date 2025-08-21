<script setup lang="ts">
defineProps<{ text: string; textAlign?: "left" | "center" | "right" }>();
</script>

<template>
  <h1 class="panel-heading" :style="{ textAlign: textAlign ?? 'left' }">
    {{ text }}
  </h1>
</template>

<style scoped>
.panel-heading {
  font-size: 1.6rem;
  color: #b4936f;
  text-transform: uppercase;
  letter-spacing: 5px;
}

@media (min-width: 600px) {
  .panel-heading {
    font-size: 1.8rem;
  }
}

@media (min-width: 900px) {
  .panel-heading {
    font-size: 2rem;
  }
}
</style>
