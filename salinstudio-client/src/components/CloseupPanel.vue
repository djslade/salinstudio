<script setup lang="ts">
import { ref } from "vue";
import { useLanguageStore } from "../store/language";
import type { Art } from "../types/art";

defineProps<{ data: Art }>();

const showDescription = ref<boolean>(false);

const language = useLanguageStore();
</script>

<template>
  <section class="panel">
    <div
      @mouseenter="showDescription = true"
      @mouseleave="showDescription = false"
      @click="showDescription = !showDescription"
      class="data-container"
    >
      <img class="image" :src="data.desktopUrl" :alt="data.titleEn" />
      <div
        v-if="language.isEn() && data.descriptionEn"
        :class="`description-container ${showDescription && 'visible'}`"
      >
        <div class="description-inner-container">
          <p class="description">{{ data.descriptionEn }}</p>
        </div>
      </div>
      <div
        v-if="language.isFi() && data.descriptionFi"
        :class="`description-container ${showDescription && 'visible'}`"
      >
        <div class="description-inner-container">
          <p class="description">{{ data.descriptionFi }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.panel {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 10rem);
  min-height: calc(100dvh - 10rem);
  width: 100%;
  align-items: center;
  justify-content: center;
}

.data-container {
  position: relative;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
  flex: 1;
  padding: 1rem;
}

.image {
  max-width: 100%;
  max-height: 100%;
  border-radius: 4px;
}

.description-container {
  inset: 0;
  position: absolute;
  background-color: rgba(38, 31, 25, 0.9);
  opacity: 0;
  transition: opacity 0.3s;
}

.description-container.visible {
  opacity: 1;
}

.description-inner-container {
  display: flex;
  align-content: flex-start;
  justify-content: center;
  height: 100%;
  padding: 1rem;
  overflow-y: auto;
}

.description {
  white-space: pre-line;
  color: #d0bfad;
  font-family: sans-serif;
  letter-spacing: 2px;
  line-height: 1.7;
  max-width: 600px;
  text-align: center;
  margin: auto;
  font-size: 0.8rem;
}

@media (min-width: 600px) {
  .description {
    font-size: 0.9rem;
  }
}

@media (min-width: 900px) {
  .panel {
    height: calc(100vh - 10rem);
    height: calc(100dvh - 10rem);
  }
  .image {
    height: 100%;
  }

  .description {
    font-size: 1rem;
  }
}
</style>
