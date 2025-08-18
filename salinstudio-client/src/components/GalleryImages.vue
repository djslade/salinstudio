<script setup lang="ts">
import { onMounted, ref } from "vue";
import Loader from "./Loader.vue";
import { preloadImage } from "../utils/preloadImage";
import type { Art } from "../types/art";
import type { LoadedImage } from "../types/LoadedImage";

type Filter =
  | "all"
  | "drawings"
  | "paintings"
  | "pastels"
  | "digital"
  | "mixed media";

const { data } = defineProps<{
  data: Art[];
  category: Filter;
  columnCount: number;
}>();

const loadedImages = ref<LoadedImage[]>([]);
const fullyLoaded = ref<boolean>(false);

const getColumnArrays = (array: LoadedImage[], columnCount: number) => {
  const columnsArray: LoadedImage[][] = [];
  for (let i = 0; i < columnCount; i++) {
    columnsArray.push(array.filter((_, idx) => idx % columnCount === i));
  }
  return columnsArray;
};

onMounted(async () => {
  try {
    const results = (await Promise.all(
      data.map((art) => preloadImage(art.thumbUrl, { art }))
    )) as LoadedImage[];
    loadedImages.value = results;
    fullyLoaded.value = true;
  } catch (err) {
    console.error("Image preload failed", err);
  }
});
</script>

<template>
  <div
    v-if="fullyLoaded"
    v-for="(array, idx) in getColumnArrays(
      loadedImages.filter((image) =>
        category === 'all'
          ? image.metadata?.art?.category !== 'mixed media'
          : image.metadata?.art?.category === category
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
      :style="{ aspectRatio: image.ratio }"
      @click="() => $router.push(`/gallery/${image.metadata?.art?.slug || ''}`)"
    >
      <img
        class="gallery-img"
        :src="image.src"
        :alt="image.metadata?.art?.titleEn || ''"
      />
    </button>
  </div>
  <Loader v-else />
</template>

<style scoped>
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
