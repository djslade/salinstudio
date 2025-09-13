<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import type { Art } from "../types/art";
import { useLanguageStore } from "../store/language";
import IconButton from "../components/IconButton.vue";
import { useRoute, useRouter } from "vue-router";

const { data } = defineProps<{
  data: Art[];
}>();

const language = useLanguageStore();

const route = useRoute();
const router = useRouter();

const frontImageIdx = ref<number>(0);

let intervalId: number | undefined;

const getZIndex = (idx: number) => {
  if (idx === frontImageIdx.value) return 3;
  if (frontImageIdx.value === data.length - 1 && idx === 0) return 2;
  if (idx === frontImageIdx.value + 1) return 2;
  return 1;
};

const goToGallery = () => {
  router.push({
    name: "Gallery",
    params: { locale: route.params.locale },
  });
};

onMounted(async () => {
  intervalId = setInterval(() => {
    frontImageIdx.value = (frontImageIdx.value + 1) % data.length;
  }, 10000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<template>
  <section class="hero">
    <div class="hero-img-container">
      <div
        v-for="(art, idx) in data"
        :class="`canvas ${getZIndex(idx) !== 2 && 'prev'}`"
        :key="idx"
        :style="{ zIndex: getZIndex(idx) }"
      >
        <img class="hero-img" :src="art.image.desktopUrl" :alt="art.titleEn" />
        <div class="vert-overlay"></div>
        <div class="horiz-overlay"></div>
      </div>
    </div>
    <div class="overlay" />
    <div class="content-container">
      <div class="content-inner">
        <div v-if="language.isFi()" class="content-heading-container">
          <h1 class="content-heading">Miia Salin on</h1>
          <h1 class="content-heading">
            <span class="content-keyword">taiteilija</span> ja
            <span class="content-keyword">visuaalinen tarinankertoja</span>
          </h1>
        </div>
        <div v-else class="content-heading-container">
          <h1 class="content-heading">Miia Salin is an</h1>
          <h1 class="content-heading">
            <span class="content-keyword">artist</span> and
            <span class="content-keyword">visual storyteller</span>
          </h1>
        </div>
        <div class="content-cta">
          <IconButton
            :label="
              $route.params.locale !== 'fi'
                ? 'Explore her work'
                : 'Katso hänen töitään'
            "
            icon="mdi-light:arrow-up"
            :onClick="goToGallery"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.content-container {
  inset: 0;
  position: absolute;
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero {
  position: relative;
  width: 100%;
  background-color: #261f19;
  overflow: hidden;
}

.overlay {
  inset: 0;
  position: absolute;
  z-index: 4;
  background: rgba(38, 31, 25, 0.55);
}

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

.content-inner {
  width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}

.content-heading {
  color: #d0bfad;
  text-transform: uppercase;
  font-size: 2rem;
  text-align: center;
  font-weight: 400;
}

.content-keyword {
  color: #b4936f;
}

@media (min-width: 600px) {
  .content-heading {
    font-size: 3rem;
  }
}

@media (min-width: 900px) {
  .content-heading {
    font-size: 4rem;
  }

  .cta-btn-icon-container {
    padding: 0.8rem;
  }
}

@media (max-height: 500px) and (orientation: landscape) {
  .content-heading {
    font-size: 2.5rem;
  }
}
</style>
