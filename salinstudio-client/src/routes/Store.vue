<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import axios from "axios";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import { onMounted, onUnmounted, ref, watch } from "vue";
import Loader from "../components/Loader.vue";
import { useLanguageStore } from "../store/language";
import OpacityTransition from "../components/OpacityTransition.vue";
import { useMetadata } from "../hooks/useMetadata";
import type { StoreItem } from "../types/storeItem";
import StoreItemGrid from "../components/StoreItemGrid.vue";

const pageReady = ref<boolean>(false);

const language = useLanguageStore();

const { setMetadata } = useMetadata();

const { data } = useQuery({
  queryKey: ["storeItems"],
  queryFn: async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_SERVER_ENDPOINT}/purchasable/public`,
    );
    return res.data.purchasables as StoreItem[];
  },
});

const columnCount = ref(1);

const updateColumns = () => {
  const width = window.innerWidth;
  columnCount.value = Math.ceil(width / 360);
};

const onPageLoad = async (storeItems?: StoreItem[]) => {
  if (!storeItems) return;

  let metadataImageUrl: string = "";

  if (storeItems.length === 0) {
    metadataImageUrl = "";
  } else if (storeItems[0].images[0]) {
    metadataImageUrl = storeItems[0].images[0].desktopUrl;
  } else {
    metadataImageUrl = storeItems[0].art.image.desktopUrl;
  }

  setMetadata({
    imageUrl: metadataImageUrl,
  });

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
      :heading="language.isEn() ? 'store' : 'store'"
      current-route="Store"
    >
    </Header>
    <main>
      <OpacityTransition mode="default">
        <StoreItemGrid v-if="data" :data="data" :columnCount="3"/>
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

.comm-closed-panel {
  width: 100%;
  height: calc(100vh - 10rem);
  height: calc(100dvh - 10rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  padding: 1rem;
}
</style>
