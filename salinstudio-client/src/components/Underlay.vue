<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

defineProps<{ onClick: () => void }>();

onMounted(() => {
  document.body.classList.add("no-scroll");
});

onUnmounted(() => {
  document.body.classList.remove("no-scroll");
});
</script>

<template>
  <div class="underlay" @click="onClick"></div>
</template>

<style>
.no-scroll {
  overflow: hidden;
}

@media (min-width: 900px) {
  .no-scroll {
    overflow: auto;
  }
}
</style>

<style scoped>
.underlay {
  z-index: 5;
  position: fixed;
  inset: 0;
}

@media (min-width: 900px) {
  .underlay {
    display: none;
  }
}
</style>
