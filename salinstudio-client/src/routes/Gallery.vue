<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import axios from "axios";
import Header from "../components/Header.vue";

type Art = {
  id: string;
  category: string;
  fullUrl: string;
  desktopUrl: string;
  mobileUrl: string;
  thumbUrl: string;
  titleEn: string;
  titleFi: string;
  descriptioNEn: string;
  descriptionFi: string;
};

const { data } = useQuery({
  queryKey: ["art"],
  queryFn: async () => {
    const res = await axios.get(`${import.meta.env.VITE_SERVER_ENDPOINT}/art`);
    return res.data.art as Art[];
  },
});

const getColumnArrays = (array: Art[], columnCount: number) => {
  const columnsArray: Art[][] = [];
  for (let i = 0; i < columnCount; i++) {
    columnsArray.push(array.filter((_, idx) => idx % columnCount === i));
  }
  return columnsArray;
};
</script>

<template>
  <div class="">
    <Header />
    <section v-if="data" class="gallery-panel">
      <div
        v-for="(array, idx) in getColumnArrays(data, 4)"
        :key="`array-${idx}`"
        class="gallery-column"
      >
        <img
          class="gallery-img"
          v-for="(art, idx) in array"
          :key="`art-${idx}`"
          :src="art.thumbUrl"
          :alt="art.titleEn"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.gallery-panel {
  columns: 4;
}

.gallery-column {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.gallery-img {
  border-radius: 0.5rem;
  width: 100%;
  margin-bottom: 1rem; /* gap on above does not work correctly */
}
</style>
