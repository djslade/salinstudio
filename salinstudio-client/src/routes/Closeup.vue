<script setup lang="ts">
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import IconButton from "../components/IconButton.vue";
import { useLanguageStore } from "../store/language";
import type { Art } from "../types/art";
import Loader from "../components/Loader.vue";
import { useQuery } from "@tanstack/vue-query";
import axios, { AxiosError } from "axios";
import { useRoute, useRouter } from "vue-router";
import CloseupPanel from "../components/CloseupPanel.vue";
import { useImageStore } from "../store/images";
import { onMounted, ref, watch } from "vue";
import OpacityTransition from "../components/OpacityTransition.vue";
import { useMetadata } from "../hooks/useMetadata";

const route = useRoute();
const router = useRouter();
const pageReady = ref<boolean>(false);

const { setMetadata } = useMetadata();

const { data } = useQuery({
  queryKey: [`art.${route.params.id}`],
  queryFn: async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_SERVER_ENDPOINT}/art/slug/${route.params.id}`
    );
    console.log(res.data.art);
    return res.data.art as Art;
  },
  retry: (failureCount, err: AxiosError) => {
    if (err.status === 404) {
      router.replace({
        name: "not found",
        params: { pathMatch: route.path.substring(1).split("/") },
        query: route.query,
        hash: route.hash,
      });
      return false;
    }
    return failureCount <= 3;
  },
});

const language = useLanguageStore();
const images = useImageStore();

const onPageLoad = async (art?: Art) => {
  if (!art) return;

  const title = `${
    route.params.locale === "fi" ? art.titleFi : art.titleEn
  } - Miia Salin`;

  setMetadata({
    title,
    description:
      route.params.locale === "fi" ? art.descriptionFi : art.descriptionEn,
    imageUrl: art.image.desktopUrl,
  });

  await images.preloadAndSet(art.image.desktopUrl);

  pageReady.value = true;
  window.prerenderReady = true;
};

onMounted(async () => await onPageLoad(data.value));

watch(data, async (art) => await onPageLoad(art));
</script>

<template>
  <div class="page">
    <Header
      position="sticky"
      :heading="
        language.isEn() ? (data ? data.titleEn : '') : data ? data.titleFi : ''
      "
      :currentRoute="'Closeup'"
    >
      <template #fixture>
        <div class="content-cta">
          <IconButton
            responsiveLabel
            icon="mdi-light:arrow-left"
            :onClick="() => $router.back()"
          />
        </div>
      </template>
    </Header>
    <main>
      <OpacityTransition mode="default">
        <CloseupPanel v-if="pageReady && data" :data="data" />
      </OpacityTransition>
      <Loader v-if="!pageReady" />
    </main>
    <Footer position="static" />
  </div>
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

@media (min-width: 1200px) {
  .cta-btn-text {
    display: inline;
  }
}
</style>
