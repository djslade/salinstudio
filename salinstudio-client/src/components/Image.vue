<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from "vue";

defineProps<{ src: string; alt: string }>();

const img = useTemplateRef("img");

onMounted(() => {
  if (!img || !img.value) return;
  img.value.addEventListener("contextmenu", (e) => e.preventDefault());
});

onUnmounted(() => {
  if (!img || !img.value) return;
  img.value.removeEventListener("contextmenu", (e) => e.preventDefault());
});
</script>

<template>
  <img ref="img" :src="src" :alt="src" draggable="false" loading="lazy" />
</template>
