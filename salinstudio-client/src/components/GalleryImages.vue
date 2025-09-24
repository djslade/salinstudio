<script setup lang="ts">
import { useLanguageStore } from "../store/language";
import type { Art } from "../types/art";

type Filter =
  | "all"
  | "drawings"
  | "paintings"
  | "pastels"
  | "digital"
  | "mixed media";

defineProps<{
  data: Art[];
  category: Filter;
  columnCount: number;
}>();

const language = useLanguageStore();

const getColumnArrays = (array: Art[], columnCount: number) => {
  const columnsArray: Art[][] = [];
  for (let i = 0; i < columnCount; i++) {
    columnsArray.push(array.filter((_, idx) => idx % columnCount === i));
  }
  return columnsArray;
};
</script>

<template>
  <section class="gallery-container">
    <div class="gallery-panel">
      <div
        v-for="(array, idx) in getColumnArrays(
          data.filter((image) =>
            category === 'all'
              ? image.category !== 'mixed media'
              : image.category === category
          ),
          columnCount
        )"
        :key="`array-${idx}`"
        class="gallery-column"
      >
        <button
          class="gallery-img-btn"
          v-for="(art, idx) in array"
          :key="`art-${idx}`"
          :style="{
            aspectRatio: art.image.aspectRatio,
          }"
          @click="
            () =>
              $router.push({
                name: 'Closeup',
                params: {
                  ...$route.params,
                  id: art.slug,
                },
              })
          "
        >
          <img
            class="gallery-img"
            :src="art.image.thumbUrl"
            :alt="language.isEn() ? art.titleEn : art.titleFi"
            loading="lazy"
          />
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.gallery-container {
  margin: 0 auto;
  display: flex;
  gap: 0.5rem;
  width: 100%;
  transition-property: opacity;
  transition-duration: 600ms;
  transition-timing-function: ease;
}

.gallery-panel {
  padding: 1rem;
  display: flex;
  gap: 0.25rem;
  min-height: calc(100vh - 10rem);
  min-height: calc(100dvh - 10rem);
  width: 100%;
}

.gallery-column {
  display: flex;
  gap: 0.25rem;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
}

.gallery-img {
  object-fit: cover;
  height: 100%;
  width: 100%;
}

.gallery-img-btn {
  background-color: #261f19;
  border: none;
  margin: 0;
  padding: 0;
  width: 100%;
  cursor: pointer;
}
</style>
