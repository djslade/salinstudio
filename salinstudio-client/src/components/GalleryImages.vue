<script setup lang="ts">
import type { Art } from "../types/art";
import { useImageStore } from "../store/images";

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

const images = useImageStore();

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
          v-for="(image, idx) in array"
          :key="`art-${idx}`"
          :style="{
            aspectRatio: images.getRatio(image.thumbUrl),
          }"
          @click="
            () =>
              $router.push({
                name: 'Closeup',
                params: {
                  ...$route.params,
                  id: image.slug,
                },
              })
          "
        >
          <img
            class="gallery-img"
            :src="image.thumbUrl"
            :alt="image.descriptionEn"
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
  gap: 0.5rem;
  min-height: calc(100vh - 10rem);
  min-height: calc(100dvh - 10rem);
  width: 100%;
}

.gallery-column {
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
}

.gallery-img-btn {
  border: none;
  background-color: transparent;
  width: 100%;
  cursor: pointer;
}

.gallery-img {
  border-radius: 0.5rem;
  width: 100%;
}
</style>
