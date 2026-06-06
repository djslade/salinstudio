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
      <button
        class="gallery-img-btn"
        v-for="(art, idx) in data"
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
        <div class="store-item-info-container">
          <div class="store-item-title-container">
            <h1 class="store-item-title">{{ art.titleEn }}</h1>
          </div>
          <div class="store-item-price-container">
            <h2 class="store-item-current-price">{{Intl.NumberFormat("fi-FI", {style: "currency", currency: "eur"}).format(art.currentPrice)  }}</h2>
          </div>
        </div>
      </button>
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

.gallery-container {
  margin: 0 auto;
  display: flex;
  gap: 0.5rem;
  width: 100%;
  transition-property: opacity;
  transition-duration: 600ms;
  transition-timing-function: ease;
  justify-content: center;
}

.gallery-panel {
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
  min-height: calc(100vh - 10rem);
  min-height: calc(100dvh - 10rem);
  width: 100%;
  max-width: 1200px;
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
  width: 100%;
  aspect-ratio: 1;
}

.gallery-img-btn {
  border: none;
  margin: 0;
  padding: 0;
  width: 100%;
  aspect-ratio: 2/1;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: start;
  background-color: #1e1914;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  border-radius: 1rem;
}

.store-item-info-container {
  padding: 1rem 0.5rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.store-item-title-container {
  height: 3.5rem;
  width: 100%;
}

.store-item-title {
  font-size: 0.8rem;
  color:#d0bfad;
  text-align: center;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 5px;
  line-height: 1.5;
}

.store-item-price-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: end;
}

.store-item-current-price {
  font-size: 1rem;
  font-weight: 700;
  color:#d0bfad;
}

@media (min-width: 600px) {
  .comm-closed-title {
    font-size: 2.5rem;
  }

  .gallery-panel {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 900px) {
  .gallery-panel {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1200px) {
  .gallery-panel {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
