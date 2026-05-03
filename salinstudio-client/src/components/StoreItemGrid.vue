<script setup lang="ts">
import { useLanguageStore } from "../store/language";
import type { StoreItem } from "../types/storeItem";
import Image from "./Image.vue";
import PanelHeading from "../components/PanelHeading.vue";
import PanelParagraph from "../components/PanelParagraph.vue";

defineProps<{
  data: StoreItem[];
  columnCount: number;
}>();

const language = useLanguageStore();

const getColumnArrays = (array: StoreItem[], columnCount: number) => {
  const columnsArray: StoreItem[][] = [];
  for (let i = 0; i < columnCount; i++) {
    columnsArray.push(array.filter((_, idx) => idx % columnCount === i));
  }
  return columnsArray;
};
</script>

<template>
  <div v-if="data.length === 0" class="empty-container">
    <section v-if="language.isEn()" class="comm-closed-panel">
      <div class="comm-closed-title-container">
        <PanelHeading
          text="The store is temporarily closed"
          textAlign="center"
        />
      </div>
      <div class="comm-closed-text-container">
        <PanelParagraph textAlign="center">
          Thank you for your interest, but I am not currently accepting orders.
        </PanelParagraph>
        <PanelParagraph textAlign="center">
          Please follow me on
          <a
            href="https://www.instagram.com/salinmiia/"
            target="_blank"
            class="comm-closed-link"
            >Instagram</a
          >
          for updates.
        </PanelParagraph>
      </div>
    </section>
    <section v-if="language.isFi()" class="comm-closed-panel">
      <div class="comm-closed-title-container">
        <PanelHeading
          text="Kauppa on väliaikaisesti suljettu"
          textAlign="center"
        />
      </div>
      <div class="comm-closed-text-container">
        <PanelParagraph textAlign="center">
          Kiitos mielenkiinnostasi, mutta en tällä hetkellä ota vastaan
          tilauksia.
        </PanelParagraph>
        <PanelParagraph textAlign="center">
          Seuraa minua
          <a
            href="https://www.instagram.com/salinmiia/"
            target="_blank"
            class="comm-closed-link"
            >Instagramissa</a
          >, saadaksesi päivityksiä.
        </PanelParagraph>
      </div>
    </section>
  </div>
  <section v-else class="gallery-container">
    <div class="gallery-panel">
      <div
        v-for="(array, idx) in getColumnArrays(data, columnCount)"
        :key="`array-${idx}`"
        class="gallery-column"
      >
        <button
          class="gallery-img-btn"
          v-for="(art, idx) in array"
          :key="`art-${idx}`"
          :style="{
            aspectRatio: art.images[0].aspectRatio || 1,
          }"
          @click="
            () =>
              $router.push({
                name: 'Closeup',
                params: {
                  ...$route.params,
                  id: art.nanoId,
                },
              })
          "
        >
          <Image
            class="gallery-img"
            :src="art.images[0].thumbUrl || ''"
            :alt="language.isEn() ? art.art.titleEn : art.art.titleFi"
          />
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
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

.comm-closed-title-container {
  width: 100%;
  text-align: center;
  max-width: 900px;
}

.comm-closed-title {
  font-size: 2rem;
  color: #b4936f;
  text-transform: uppercase;
  letter-spacing: 5px;
}

.comm-closed-text-container {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 900px;
}

.comm-closed-text {
  color: #d0bfad;
  line-height: 1.7;
  letter-spacing: 2px;
  font-family: sans-serif;
}

.comm-closed-link {
  font-weight: bold;
  color: #d0bfad;
  transition-duration: 0.3s;
  transition-property: all;
}

.comm-closed-link:hover {
  color: #b4936f;
}

@media (min-width: 600px) {
  .comm-closed-title {
    font-size: 2.5rem;
  }
}

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
