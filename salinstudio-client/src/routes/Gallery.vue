<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import axios from "axios";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import { onMounted, onUnmounted, ref, watch } from "vue";
import Loader from "../components/Loader.vue";
import Select from "../components/Select.vue";
import { useLanguageStore } from "../store/language";
import GalleryImages from "../components/GalleryImages.vue";
import type { Art } from "../types/art";
import { useImageStore } from "../store/images";
import OpacityTransition from "../components/OpacityTransition.vue";
import { useMetadata } from "../hooks/useMetadata";

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
const pageReady = ref<boolean>(false);

const language = useLanguageStore();
const images = useImageStore();

const { setMetadata } = useMetadata();

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
  if (width < 360) columnCount.value = 1;
  else if (width < 900) columnCount.value = 2;
  else if (width < 1200) columnCount.value = 3;
  else if (width < 1500) columnCount.value = 4;
  else columnCount.value = 5;
};

const onPageLoad = async (art?: Art[]) => {
  if (!art) return;

  setMetadata({
    imageUrl: art[0].desktopUrl,
  });

  for (let a of art) {
    await images.preloadAndSet(a.thumbUrl);
  }

  pageReady.value = true;
  window.prerenderReady = true;
};

onMounted(async () => {
  updateColumns();
  window.addEventListener("resize", updateColumns);

  await onPageLoad(data.value);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateColumns);
});

watch(data, async (art) => onPageLoad(art));
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
      <OpacityTransition mode="default">
        <GalleryImages
          v-if="pageReady && data"
          :data="data"
          :category="artCategory"
          :columnCount="columnCount"
        />
      </OpacityTransition>
      <Loader v-if="!pageReady" />
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
