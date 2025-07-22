<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

type Image = {
  src: string;
  alt: string;
};

const images: Image[] = [
  {
    src: "/test.webp",
    alt: "",
  },
  {
    src: "/1748116132576.webp",
    alt: "",
  },
  {
    src: "/1748116388326.webp",
    alt: "",
  },
];

const frontImageIdx = ref<number>(0);
let intervalId: number | undefined;

const getZIndex = (idx: number) => {
  if (idx === frontImageIdx.value) return 3;
  if (frontImageIdx.value === images.length - 1 && idx === 0) return 2;
  if (idx === frontImageIdx.value + 1) return 2;
  return 1;
};

onMounted(() => {
  intervalId = setInterval(() => {
    frontImageIdx.value = (frontImageIdx.value + 1) % images.length;
  }, 36000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<template>
  <div class="hero-img-container">
    <div
      v-for="(image, idx) in images"
      :class="`canvas ${getZIndex(idx) !== 2 && 'prev'}`"
      :key="idx"
      :style="{ zIndex: getZIndex(idx) }"
    >
      <img class="hero-img" :src="image.src" :alt="image.alt" />
      <div class="vert-overlay"></div>
      <div class="horiz-overlay"></div>
    </div>
  </div>
</template>

<style scoped>
.hero-img-container {
  height: 100vh;
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
