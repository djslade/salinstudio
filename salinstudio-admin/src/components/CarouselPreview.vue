<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import type { Art } from "../types/data";

const { art } = defineProps<{ art: Art[] }>();
// The front slide is the one fading out; the slide after it is the one shown.
// Starting at the last slide makes the first slide in the list show first.
const frontImageIdx = ref<number>(Math.max(art.length - 1, 0));

let intervalId: number | undefined;

const getZIndex = (idx: number) => {
  // The visible slide is the one at z-index 2 (the front one is fading out),
  // so a single slide must be 2 or it is never shown.
  if (art.length === 1) return 2;
  if (idx === frontImageIdx.value) return 3;
  if (frontImageIdx.value === art.length - 1 && idx === 0) return 2;
  if (idx === frontImageIdx.value + 1) return 2;
  return 1;
};

onMounted(() => {
  if (art.length < 2) return;
  intervalId = setInterval(() => {
    frontImageIdx.value = (frontImageIdx.value + 1) % art.length;
  }, 10000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<template>
  <div
    class="max-w-7xl w-full aspect-video relative flex items-center justify-between"
  >
    <div
      v-for="(a, idx) in art"
      :key="a.id"
      :class="`p-4 rounded max-w-7xl w-full aspect-video shadow-sm absolute bg-neutral-900 flex justify-center items-center ${
        art.length > 1 && frontImageIdx === idx && 'transition-opacity duration-1000 opacity-0'
      }`"
      :style="{ zIndex: getZIndex(idx) }"
    >
      <img :src="a.image.desktopUrl" :alt="a.titleEn" class="h-full" />
    </div>
  </div>
</template>
