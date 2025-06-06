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
  }, 10000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<template>
  <div class="hero-img-container">
    <div
      v-for="(image, idx) in images"
      :class="`canvas ${frontImageIdx === idx && 'prev'}`"
      :key="idx"
      :style="{ zIndex: getZIndex(idx) }"
    >
      <img class="hero-img" :src="image.src" :alt="image.alt" />
    </div>
  </div>
</template>

<style scoped>
.hero-img-container {
  width: 100%;
  aspect-ratio: 16/9;
  position: relative;
}

.canvas {
  position: absolute;
  width: 100%;
  aspect-ratio: 16/9;
  display: flex;
  justify-content: center;
  padding: 1rem;
  background-color: #383129;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  border-radius: 1rem;
}

.prev {
  opacity: 0;
  transition-duration: 1s;
  transition-property: opacity;
}

.hero-img {
  height: 100%;
}
</style>
