<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import axios from "axios";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import { ref } from "vue";
import Closeup from "../components/Closeup.vue";
import Loader from "../components/Loader.vue";
import Select from "../components/Select.vue";
import { useLanguageStore } from "../store/language";

type Art = {
  id: string;
  category: string;
  fullUrl: string;
  desktopUrl: string;
  mobileUrl: string;
  thumbUrl: string;
  titleEn: string;
  titleFi: string;
  descriptionEn: string;
  descriptionFi: string;
};

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

const showGallery = ref<boolean>(true);

const focusedArt = ref<Art | null>(null);

const language = useLanguageStore();

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
      <Header
        position="sticky"
        :heading="language.language === 'en' ? 'gallery' : 'galleria'"
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
        <section class="gallery-panel">
          <Loader v-if="!data" />
          <div v-if="data" class="gallery-container gallery-columns-1">
            <div
              v-for="(array, idx) in getColumnArrays(
                data.filter((art) =>
                  artCategory === 'all'
                    ? art.category !== 'mixed media'
                    : art.category === artCategory
                ),
                1
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
          <div v-if="data" class="gallery-container gallery-columns-2">
            <div
              v-for="(array, idx) in getColumnArrays(
                data.filter((art) =>
                  artCategory === 'all'
                    ? art.category !== 'mixed media'
                    : art.category === artCategory
                ),
                2
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
          <div v-if="data" class="gallery-container gallery-columns-3">
            <div
              v-for="(array, idx) in getColumnArrays(
                data.filter((art) =>
                  artCategory === 'all'
                    ? art.category !== 'mixed media'
                    : art.category === artCategory
                ),
                3
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
          <div v-if="data" class="gallery-container gallery-columns-4">
            <div
              v-for="(array, idx) in getColumnArrays(
                data.filter((art) =>
                  artCategory === 'all'
                    ? art.category !== 'mixed media'
                    : art.category === artCategory
                ),
                4
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
          <div v-if="data" class="gallery-container gallery-columns-5">
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
    <Closeup v-else :focused-art="focusedArt" :handle-back="handleBack" />
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
  display: none;
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
  font-family: sans-serif;
}

.page {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
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
  min-height: calc(100vh - 10rem);
  min-height: calc(100dvh - 10rem);
}

.gallery-container {
  columns: 1;
  margin: 0 auto;
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

.closeup-panel {
  display: flex;
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  gap: 2rem;
}

.closeup-image-container {
  display: flex;
  flex: 1;
  justify-content: center;
  padding: 1rem;
}

.closeup-image {
  max-width: 100%;
  max-height: 100%;
  border-radius: 4px;
}

.closeup-info-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  justify-content: center;
}

.closeup-info {
  color: #d0bfad;
  font-family: sans-serif;
  letter-spacing: 2px;
  line-height: 1.5;
  max-width: 600px;
  width: 100%;
}

.lone-closeup-panel {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 10rem);
  height: calc(100dvh - 10rem);
  width: 100%;
  align-items: center;
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

.show-info-btn-container {
  height: 5rem;
  background-color: red;
  width: 100%;
}

.gallery-columns-1 {
  display: flex;
}

.gallery-columns-2 {
  display: none;
}

.gallery-columns-3 {
  display: none;
}

.gallery-columns-4 {
  display: none;
}

.gallery-columns-5 {
  display: none;
}

@media (min-width: 450px) {
  .gallery-columns-1 {
    display: none;
  }

  .gallery-columns-2 {
    display: flex;
  }

  .gallery-container {
    columns: 2;
  }
}

@media (min-width: 600px) {
  .gallery-columns-2 {
    display: none;
  }

  .gallery-columns-3 {
    display: flex;
  }

  .gallery-container {
    columns: 3;
  }
}

@media (min-width: 900px) {
  .category-select-label {
    display: inline;
  }

  .gallery-columns-3 {
    display: none;
  }

  .gallery-columns-4 {
    display: flex;
  }

  .gallery-container {
    columns: 4;
  }
}

@media (min-width: 1500px) {
  .gallery-columns-4 {
    display: none;
  }

  .gallery-columns-5 {
    display: flex;
  }

  .gallery-container {
    columns: 5;
  }
}
</style>
