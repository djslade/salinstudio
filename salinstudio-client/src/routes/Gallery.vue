<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import axios from "axios";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import { onMounted, onUnmounted, ref } from "vue";
import Loader from "../components/Loader.vue";
import Select from "../components/Select.vue";
import { useLanguageStore } from "../store/language";
import GalleryImages from "../components/GalleryImages.vue";
import type { Art } from "../types/art";

type Filter =
  | "all"
  | "drawings"
  | "paintings"
  | "pastels"
  | "digital"
  | "mixed media";

const selectOptions = [
  {
    value: "all",
    label: "All",
    labelFi: "Kaikki",
  },
  {
    value: "drawings",
    label: "Drawings",
    labelFi: "Piirustukset",
  },
  {
    value: "paintings",
    label: "Paintings",
    labelFi: "Maalaukset",
  },
  {
    value: "pastels",
    label: "Pastels",
    labelFi: "Pastellit",
  },
  {
    value: "digital",
    label: "Digital",
    labelFi: "Digi",
  },
  {
    value: "mixed media",
    label: "Mixed Media",
    labelFi: "Sekatekniikat",
  },
];

const artCategory = ref<Filter>("all");

const language = useLanguageStore();

const { data } = useQuery({
  queryKey: ["art"],
  queryFn: async () => {
    const res = await axios.get(`${import.meta.env.VITE_SERVER_ENDPOINT}/art`);
    return res.data.art as Art[];
  },
});

const handleChange = (evt: { target: { value: Filter } }) => {
  artCategory.value = evt.target.value;
};

const columnCount = ref(1);

const updateColumns = () => {
  const width = window.innerWidth;
  if (width < 600) columnCount.value = 1;
  if (width < 900) columnCount.value = 2;
  if (width < 1200) columnCount.value = 3;
  if (width < 1500) columnCount.value = 4;
  if (width >= 1500) columnCount.value = 5;
};

onMounted(() => {
  updateColumns();
  window.addEventListener("resize", updateColumns);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateColumns);
});
</script>

<template>
  <div class="page">
    <Header
      position="sticky"
      :heading="language.isEn() ? 'gallery' : 'galleria'"
      current-route="Gallery"
    >
      <template #fixture>
        <Select
          :value="artCategory"
          :onChange="handleChange"
          :options="selectOptions"
        />
      </template>
    </Header>
    <main>
      <GalleryImages
        v-if="data"
        :data="data"
        :category="artCategory"
        :columnCount="columnCount"
      />
      <Loader v-else />
    </main>
    <Footer position="static" />
  </div>
</template>

<style scoped>
.page {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
}
</style>
