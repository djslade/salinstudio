<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useLanguageStore } from "../store/language";
import { preloadImage } from "../utils/preloadImage";
import Loader from "./Loader.vue";
import type { Art } from "../types/art";

const { data } = defineProps<{ data: Art }>();

const showDescription = ref<boolean>(false);
const fullyLoaded = ref<boolean>(false);

const language = useLanguageStore();

onMounted(async () => {
  await preloadImage(data.desktopUrl);
  fullyLoaded.value = true;
});
</script>

<template>
  <section v-if="fullyLoaded" class="lone-closeup-panel">
    <div
      @mouseenter="showDescription = true"
      @mouseleave="showDescription = false"
      @click="showDescription = !showDescription"
      class="closeup-data-container"
    >
      <img class="closeup-image" :src="data.desktopUrl" :alt="data.titleEn" />
      <div
        v-if="language.isEn() && data.descriptionEn"
        :class="`closeup-description-container ${
          showDescription && 'description-visible'
        }`"
      >
        <div class="closeup-description-inner-container">
          <p class="closeup-description">{{ data.descriptionEn }}</p>
        </div>
      </div>
      <div
        v-if="language.isFi() && data.descriptionFi"
        :class="`closeup-description-container ${
          showDescription && 'description-visible'
        }`"
      >
        <div class="closeup-description-inner-container">
          <p class="closeup-description">{{ data.descriptionFi }}</p>
        </div>
      </div>
    </div>
  </section>
  <Loader v-else />
</template>

<style scoped>
.closeup-description-container {
  inset: 0;
  position: absolute;
  background-color: rgba(38, 31, 25, 0.9);
  opacity: 0;
  transition: opacity 0.3s;
}

.closeup-description-inner-container {
  display: flex;
  align-content: flex-start;
  justify-content: center;
  height: 100%;
  padding: 1rem;
  overflow-y: auto;
}

.description-visible {
  opacity: 1;
}

.closeup-description {
  white-space: pre-line;
  color: #d0bfad;
  font-family: sans-serif;
  letter-spacing: 2px;
  line-height: 1.7;
  max-width: 600px;
  text-align: center;
  margin: auto;
}

.closeup-data-container {
  position: relative;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.page {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
}

.lone-closeup-panel {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 10rem);
  height: calc(100dvh - 10rem);
  width: 100%;
  align-items: center;
}

.closeup-image {
  max-width: 100%;
  max-height: 100%;
  border-radius: 4px;
}

.cta-btn {
  background-color: transparent;
  border: transparent;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cta-btn-icon-container {
  border: 1px solid #b4936f;
  border-radius: 50%;
  padding: 0.5rem;
}

.cta-btn-icon {
  color: #d0bfad;
  font-size: 1.5rem;
}

.cta-btn-text {
  text-transform: uppercase;
  letter-spacing: 3px;
  color: #d0bfad;
  display: none;
}

@media (min-width: 900px) {
  .closeup-image {
    height: 100%;
  }
}
</style>
