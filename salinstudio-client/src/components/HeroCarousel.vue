<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import type { Art } from "../types/art";
import type { LoadedImage } from "../types/LoadedImage";
import { preloadImage } from "../utils/preloadImage";

const { images, onLoaded } = defineProps<{
  images: Art[];
  onLoaded: () => void;
}>();

const frontImageIdx = ref<number>(0);
const loadedImages = ref<LoadedImage[]>([]);

let intervalId: number | undefined;

const getZIndex = (idx: number) => {
  if (idx === frontImageIdx.value) return 3;
  if (frontImageIdx.value === images.length - 1 && idx === 0) return 2;
  if (idx === frontImageIdx.value + 1) return 2;
  return 1;
};

onMounted(async () => {
  try {
    const results = (await Promise.all(
      images.map((art) => preloadImage(art.thumbUrl, { art }))
    )) as LoadedImage[];
    loadedImages.value = results;
    onLoaded();
    intervalId = setInterval(() => {
      frontImageIdx.value = (frontImageIdx.value + 1) % images.length;
    }, 10000);
  } catch (err) {
    console.error("Image preload failed", err);
  }
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<template>
  <div class="hero-img-container">
    <div
      v-for="(image, idx) in loadedImages"
      :class="`canvas ${getZIndex(idx) !== 2 && 'prev'}`"
      :key="idx"
      :style="{ zIndex: getZIndex(idx) }"
    >
      <img
        class="hero-img"
        :src="image.src"
        :alt="image.metadata?.art?.titleEn ?? ''"
      />
      <div class="vert-overlay"></div>
      <div class="horiz-overlay"></div>
    </div>
  </div>
</template>

<style scoped>
.hero-img-container {
  height: 100vh;
  height: 100dvh;
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
}

.canvas {
  position: absolute;
  height: 100%;
  padding: 1rem;
  display: flex;
  justify-content: center;
  background-color: transparent;
  transition-duration: 5s;
  transition-property: opacity;
}

.prev {
  opacity: 0;
}

.hero-img {
  height: 100%;
  background-color: #261f19;
}

.vert-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, #261f19, transparent, #261f19);
}

.horiz-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, #261f19, transparent, #261f19);
}
</style>
