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
        :class="{ 'is-sold-out': art.quantity < 1 }"
        @click="
          () =>
            $router.push({
              name: 'StoreItem',
              params: {
                ...$route.params,
                id: art.nanoId,
              },
            })
        "
      >
        <div class="store-item-img-container">
          <Image
            class="gallery-img"
            :src="art.images[0]?.thumbUrl || art.art.image.thumbUrl || ''"
            :alt="language.isEn() ? art.titleEn : art.titleFi"
          />
          <span v-if="art.quantity < 1" class="store-item-badge badge-sold-out">
            {{ language.isEn() ? 'Sold Out' : 'Loppunut' }}
          </span>
          <span v-else-if="art.isOnSale" class="store-item-badge badge-on-sale">
            {{ language.isEn() ? 'Sale' : 'Ale' }}
          </span>
        </div>
        <div class="store-item-info">
          <p class="store-item-title">{{ language.isEn() ? art.titleEn : art.titleFi }}</p>
          <div class="store-item-price-row">
            <span class="store-item-price">{{ Intl.NumberFormat("fi-FI", { style: "currency", currency: "eur" }).format(art.currentPrice) }}</span>
            <span v-if="art.isOnSale && art.maxPrice > art.currentPrice" class="store-item-price-original">{{ Intl.NumberFormat("fi-FI", { style: "currency", currency: "eur" }).format(art.maxPrice) }}</span>
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
  align-items: start;
  gap: 1rem;
  min-height: calc(100vh - 10rem);
  min-height: calc(100dvh - 10rem);
  width: 100%;
  max-width: 1200px;
}

.gallery-img-btn {
  border: 1px solid transparent;
  margin: 0;
  padding: 0;
  width: 100%;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  background-color: #1e1914;
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.2s;
  text-align: left;
}

.gallery-img-btn:hover {
  border-color: #b4936f;
}

.gallery-img-btn.is-sold-out {
  opacity: 0.6;
}

.store-item-img-container {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
}

.gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: sepia(20%);
  transition: filter 0.3s;
  display: block;
}

.gallery-img-btn:hover .gallery-img {
  filter: sepia(10%);
}

.store-item-badge {
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  font-family: sans-serif;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.badge-on-sale {
  background-color: #b4936f;
  color: #261f19;
}

.badge-sold-out {
  background-color: rgba(38, 31, 25, 0.85);
  color: #6b5a4a;
  border: 1px solid #6b5a4a;
}

.store-item-info {
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.store-item-title {
  font-size: 0.75rem;
  color: #d0bfad;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 3px;
  line-height: 1.5;
}

.store-item-price-row {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
}

.store-item-price {
  font-size: 0.95rem;
  font-weight: 700;
  color: #d0bfad;
  letter-spacing: 1px;
}

.store-item-price-original {
  font-size: 0.8rem;
  color: #6b5a4a;
  text-decoration: line-through;
  font-family: sans-serif;
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
