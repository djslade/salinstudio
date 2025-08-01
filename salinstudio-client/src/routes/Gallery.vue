<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import axios from "axios";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import { ref } from "vue";
import { Icon } from "@iconify/vue";

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

type Filter =
  | "all"
  | "drawings"
  | "paintings"
  | "pastels"
  | "digital"
  | "mixed media";

const artCategory = ref<Filter>("all");

const showGallery = ref<boolean>(true);

const focusedArt = ref<Art | null>(null);

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

const handleChange = (evt: { target: { value: Filter } }) => {
  artCategory.value = evt.target.value;
};

const handleImageSelect = (art: Art) => {
  focusedArt.value = art;
  showGallery.value = false;
};

const handleBack = () => {
  showGallery.value = true;
};
</script>

<template>
  <Transition name="page-opacity" mode="out-in">
    <div class="page" v-if="showGallery">
      <Header position="sticky" heading="gallery">
        <template #fixture>
          <div class="category-select-container">
            <label for="category" class="category-select-label"
              >Choose art category</label
            >
            <select
              name="category"
              id="category"
              class="category-select"
              :value="artCategory"
              @change="(evt) => handleChange(evt as unknown as { target: { value: Filter}})"
            >
              <option value="all">All</option>
              <option value="drawings">Drawings</option>
              <option value="paintings">Paintings</option>
              <option value="pastels">Pastels</option>
              <option value="digital">Digital</option>
              <option value="mixed media">Mixed media</option>
            </select>
          </div>
        </template>
      </Header>
      <main>
        <section class="gallery-panel">
          <div v-if="data" class="gallery-container">
            <div
              v-for="(array, idx) in getColumnArrays(
                data.filter((art) =>
                  artCategory === 'all'
                    ? art.category !== 'mixed media'
                    : art.category === artCategory
                ),
                5
              )"
              :key="`array-${idx}`"
              class="gallery-column"
            >
              <button
                class="gallery-img-btn"
                v-for="(art, idx) in array"
                :key="`art-${idx}`"
                @click="() => handleImageSelect(art)"
              >
                <img
                  class="gallery-img"
                  :src="art.thumbUrl"
                  :alt="art.titleEn"
                />
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer position="static" />
    </div>
    <div class="page" v-else>
      <Header position="sticky" :heading="focusedArt ? focusedArt.titleEn : ''">
        <template #fixture>
          <div class="content-cta">
            <button class="cta-btn" @click="handleBack">
              <div class="cta-btn-icon-container">
                <Icon
                  icon="mdi-light:arrow-left"
                  class="cta-btn-icon"
                  :inline="true"
                />
              </div>
              <span class="cta-btn-text">Back to gallery</span>
            </button>
          </div>
        </template>
      </Header>
      <main>
        <section class="closeup-panel">
          <div class="closeup-image-container">
            <img
              class="closeup-image"
              :src="focusedArt?.desktopUrl"
              :alt="focusedArt?.titleEn"
            />
          </div>
        </section>
      </main>
      <Footer position="static" />
    </div>
  </Transition>
</template>

<style scoped>
.category-select-container {
  display: flex;
  color: #b4936f;
  gap: 1.5rem;
  align-items: center;
}

.category-select-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 3px;
}

.category-select {
  background-color: #261f19;
  color: #d0bfad;
  border: 1px solid #b4936f;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-align: center;
  font-family: sans-serif;
  /* for Firefox */
  -moz-appearance: none;
  /* for Chrome */
  -webkit-appearance: none;
  appearance: none;
  padding: 0.5rem;
  border-radius: 8px;
}

option {
  text-transform: none;
  font-size: 1rem;
  text-align: left;
}

.page {
  position: relative;
  min-height: 100vh;
}

.gallery-heading {
  color: #b4936f;
  font-size: 1.2rem;
  letter-spacing: 8px;
  text-transform: uppercase;
  text-align: center;
}

.gallery-panel {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.gallery-container {
  columns: 5;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  gap: 0.5rem;
  width: 100%;
}

.gallery-column {
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
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

.closeup-panel {
  display: flex;
}

.closeup-image-container {
  display: flex;
  width: 100%;
  justify-content: center;
  padding: 1rem;
  height: calc(100vh - 10rem);
}

.closeup-image {
  max-width: 1200px;
  max-height: 100%;
  border-radius: 4px;
}

.page-opacity-enter-active,
.page-opacity-leave-active {
  transition-timing-function: ease;
  transition-duration: 600ms;
  transition-property: all;
}

.page-opacity-enter-from,
.page-opacity-leave-to {
  opacity: 0;
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
}
</style>
