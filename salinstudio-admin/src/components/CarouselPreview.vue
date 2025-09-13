<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import type { Art } from "../types/data";

const { art } = defineProps<{ art: Art[] }>();
const frontImageIdx = ref<number>(0);

let intervalId: number | undefined;

const getZIndex = (idx: number) => {
  if (idx === frontImageIdx.value) return 3;
  if (frontImageIdx.value === art.length - 1 && idx === 0) return 2;
  if (idx === frontImageIdx.value + 1) return 2;
  return 1;
};

onMounted(() => {
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
    class="max-w-screen-xl w-full aspect-video relative flex items-center justify-between"
  >
    <div
      v-for="(a, idx) in art"
      :key="a.id"
      :class="`p-4 rounded max-w-screen-xl w-full aspect-video shadow-sm absolute bg-neutral-900 flex justify-center items-center ${
        frontImageIdx === idx && 'transition-opacity duration-1000 opacity-0'
      }`"
      :style="{ zIndex: getZIndex(idx) }"
    >
      <img :src="a.image.desktopUrl" :alt="a.titleEn" class="h-full" />
    </div>
  </div>
</template>
