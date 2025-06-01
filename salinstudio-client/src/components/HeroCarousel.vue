<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

type Image = {
  src: string;
  alt: string;
};

const images: Image[] = [
  {
    src: "/1748026840851.webp",
    alt: "",
  },
  {
    src: "/1748113914558.webp",
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
    console.log(frontImageIdx.value);
  }, 10000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<template>
  <div class="hero-img-container">
    <img
      v-for="(image, idx) in images"
      :key="idx"
      :class="frontImageIdx === idx ? 'hero-img-prev' : 'hero-img'"
      :src="image.src"
      :alt="image.alt"
      :style="{ zIndex: getZIndex(idx) }"
    />
  </div>
</template>

<style scoped>
.hero-img-container {
  width: 100%;
  aspect-ratio: 16/9;
  position: relative;
}

.hero-img {
  position: absolute;
  width: 100%;
  object-fit: cover;
  box-shadow: rgba(0, 0, 0, 0.45) 0px 25px 20px -20px;
  aspect-ratio: 16/9;
}

.hero-img-prev {
  position: absolute;
  width: 100%;
  object-fit: cover;
  aspect-ratio: 16/9;
  z-index: 5;
  opacity: 0;
  transition-duration: 1s;
  transition-property: opacity;
}
</style>
