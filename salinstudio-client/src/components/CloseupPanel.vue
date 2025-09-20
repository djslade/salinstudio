<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import { useLanguageStore } from "../store/language";
import OpacityTransition from "./OpacityTransition.vue";
import type { GalleryItem } from "../types/galleryItem";
import { useSwipe, type UseSwipeDirection } from "@vueuse/core";

const { data } = defineProps<{ data: GalleryItem[] }>();

const el = useTemplateRef("el");

const galleryIndex = ref<number>(0);

const showDescription = ref<boolean>(false);

const language = useLanguageStore();

const decrementGalleryIndex = () => {
  if (galleryIndex.value === 0) return;
  galleryIndex.value--;
};

const incrementGalleryIndex = () => {
  if (galleryIndex.value === data.length - 1) return;
  galleryIndex.value++;
};

useSwipe(el, {
  passive: false,
  onSwipeEnd: (_: TouchEvent, direction: UseSwipeDirection) => {
    if (direction === "right") {
      decrementGalleryIndex();
    }
    if (direction === "left") {
      incrementGalleryIndex();
    }
  },
});
</script>

<template>
  <section class="panel">
    <OpacityTransition mode="out-in">
      <div
        :key="galleryIndex"
        ref="el"
        @mouseenter="showDescription = true"
        @mouseleave="showDescription = false"
        @click="showDescription = !showDescription"
        class="data-container"
      >
        <img
          class="image"
          :src="data[galleryIndex].image.desktopUrl"
          :alt="data[galleryIndex].titleEn"
        />
        <div
          v-if="language.isEn() && data[galleryIndex].descriptionEn"
          :class="`description-container ${showDescription && 'visible'}`"
        >
          <div class="description-inner-container">
            <p class="description">
              {{ data[galleryIndex].descriptionEn }}
            </p>
          </div>
        </div>
        <div
          v-if="language.isFi() && data[galleryIndex].descriptionFi"
          :class="`description-container ${showDescription && 'visible'}`"
        >
          <div class="description-inner-container">
            <p class="description">
              {{ data[galleryIndex].descriptionFi }}
            </p>
          </div>
        </div>
      </div>
    </OpacityTransition>
    <div v-if="data.length > 1" class="panel-btn-container">
      <button
        class="panel-btn"
        @click="decrementGalleryIndex"
        :style="{ backgroundColor: galleryIndex === 0 ? '#d0bfad' : '#b4936f' }"
      ></button>
      <button
        v-if="data.length > 2"
        class="panel-btn"
        :style="{
          backgroundColor:
            galleryIndex > 0 && galleryIndex < data.length - 1
              ? '#d0bfad'
              : '#b4936f',
        }"
      ></button>
      <button
        class="panel-btn"
        @click="incrementGalleryIndex"
        :style="{
          backgroundColor:
            galleryIndex === data.length - 1 ? '#d0bfad' : '#b4936f',
        }"
      ></button>
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

.panel-btn-container {
  width: 100%;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.panel-btn {
  height: 0.5rem;
  aspect-ratio: 1;
  border-radius: 50%;
  cursor: pointer;
  border: 0;
  outline: 0;
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
