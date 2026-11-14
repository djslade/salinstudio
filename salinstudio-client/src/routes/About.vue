<script setup lang="ts">
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import { useLanguageStore } from "../store/language";
import { computed, onMounted, onServerPrefetch, ref } from "vue";
import Loader from "../components/Loader.vue";
import OpacityTransition from "../components/OpacityTransition.vue";
import PanelParagraph from "../components/PanelParagraph.vue";
import { useImageStore } from "../store/images";
import { useRoute } from "vue-router";
import { useSeo } from "../hooks/useSeo";
import PanelHeading from "../components/PanelHeading.vue";
import { useQuery } from "@tanstack/vue-query";
import axios from "axios";
import type { AboutContent, CvContent } from "../types/content";
import { parseLinks } from "../utils/parseLinks";

const ABOUT_IMAGE = "/desktop/1755546690870.jpg";

const route = useRoute();
const language = useLanguageStore();
const images = useImageStore();

const imageReady = ref<boolean>(false);

// During the SSG build the language store is never initialised, so the
// prerendered /en and /fi pages take their language from the URL.
const isEn = computed(() =>
  import.meta.env.SSR ? route.params.locale === "en" : language.isEn(),
);

const aboutQuery = useQuery({
  queryKey: ["content", "about"],
  queryFn: async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_SERVER_ENDPOINT}/content/about`,
    );
    return res.data.about as AboutContent;
  },
});

const cvQuery = useQuery({
  queryKey: ["content", "cv"],
  queryFn: async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_SERVER_ENDPOINT}/content/cv`,
    );
    return res.data.cv as CvContent;
  },
});

// Fetch the content at build time so it lands in the static HTML. If the API
// is unreachable the build still succeeds and the page loads it client-side.
onServerPrefetch(async () => {
  await Promise.all([aboutQuery.suspense(), cvQuery.suspense()]);
});

const about = computed(() => aboutQuery.data.value);
const cv = computed(() => cvQuery.data.value);
const contentReady = computed(() => !!about.value && !!cv.value);
const pageReady = computed(() => imageReady.value && contentReady.value);

const paragraphs = computed(() =>
  (about.value?.paragraphs ?? [])
    .map((p) => (isEn.value ? p.en : p.fi))
    .filter((text) => text.length > 0)
    .map(parseLinks),
);

const categories = computed(() =>
  (cv.value?.categories ?? []).map((c) => ({
    title: isEn.value ? c.titleEn : c.titleFi,
    entries: c.entries.map((e) => ({
      year: e.year,
      text: isEn.value ? e.textEn : e.textFi,
    })),
  })),
);

const firstParagraphText = computed(() =>
  paragraphs.value[0]?.map((segment) => segment.text).join(""),
);

useSeo({
  description: () =>
    firstParagraphText.value ??
    (route.params.locale === "fi"
      ? "Olen suomalainen taiteilija, jonka mielikuvitus ja luomisvimma tuntuvat ehtymättömiltä. Matkani tähän asti ei ole ollut helppo, mutta jokainen vastoinkäyminen on vain vahvistanut päättäväisyyttäni ja intohimoani taiteeseen."
      : "I’m a hardworking artist from Finland with limitless imagination and drive. I’ve come a long way for this path, but my hardships have just made my determination stronger."),
  imageUrl: () => ABOUT_IMAGE,
});

onMounted(async () => {
  await images.preloadAndSet(ABOUT_IMAGE);
  imageReady.value = true;
});
</script>

<template>
  <div class="">
    <Header
      position="sticky"
      :heading="isEn ? 'About' : 'Tietoa'"
      current-route="About"
    />
    <main>
      <OpacityTransition mode="default">
        <!-- Rendered as soon as the content exists (including in the
             prerendered HTML); it fades in once the image has loaded. -->
        <div v-if="contentReady" class="about-outer-container">
          <section :class="{ 'about-panel': true, 'is-visible': pageReady }">
            <PanelHeading
              :text="isEn ? 'Who I am' : 'Kuka olen'"
              textAlign="center"
            />
            <div class="panel-inner-container">
              <div class="about-img-container">
                <img :src="ABOUT_IMAGE" alt="Miia Salin" class="about-img" />
              </div>
              <div class="about-text-container">
                <div class="about-text">
                  <PanelParagraph
                    v-for="(segments, pIndex) in paragraphs"
                    :key="pIndex"
                  >
                    <template
                      v-for="(segment, sIndex) in segments"
                      :key="sIndex"
                    >
                      <a
                        v-if="segment.type === 'link'"
                        :href="segment.href"
                        target="_blank"
                        rel="noopener"
                        class="about-link"
                        >{{ segment.text }}</a
                      >
                      <template v-else>{{ segment.text }}</template>
                    </template>
                  </PanelParagraph>
                </div>
              </div>
            </div>
          </section>
          <section
            v-if="categories.length > 0"
            :class="{
              'about-panel': true,
              'cv-panel': true,
              'is-visible': pageReady,
            }"
          >
            <PanelHeading text="CV" textAlign="center" />
            <div class="panel-inner-container cv-container">
              <div class="about-text-container">
                <div class="cv-text">
                  <div
                    v-for="(category, cIndex) in categories"
                    :key="cIndex"
                    class="cv-category-container"
                  >
                    <h3 class="cv-category-heading">{{ category.title }}</h3>
                    <div class="cv-category-entry-container">
                      <p
                        v-for="(entry, eIndex) in category.entries"
                        :key="eIndex"
                        class="cv-category-entry"
                      >
                        <span class="entry-year-span">{{ entry.year }}</span>
                        {{ entry.text }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </OpacityTransition>
      <Loader v-if="!contentReady" />
    </main>
    <Footer position="static" />
  </div>
</template>

<style scoped>
.about-outer-container {
  display: flex;
  flex-direction: column;
}
.content-inner {
  width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}

.content-heading {
  color: #d0bfad;
  text-transform: uppercase;
  font-size: 4rem;
  text-align: center;
  font-weight: 400;
}

.content-keyword {
  color: #b4936f;
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
  padding: 0.8rem;
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

.about-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4rem;
  padding: 2rem 1rem;
  min-height: calc(100vh - 10rem);
  min-height: calc(100dvh - 10rem);
  opacity: 0;
  transition-property: opacity;
  transition-duration: 600ms;
  transition-timing-function: ease;
}

.cv-panel {
  gap: 6.4rem;
  padding: 8rem 1rem;
}

.about-panel.is-visible {
  opacity: 1;
}

.panel-inner-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 4rem;
}

.panel-inner-container.cv-container {
  max-width: 1112px;
  width: 100%;
  align-items: start;
}

.about-img-container {
  display: flex;
  justify-content: center;
}

.about-img {
  max-width: 24rem;
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
  border-radius: 8px;
  filter: sepia(20%);
}

.cv-img {
  max-width: 24rem;
  width: 100%;
  object-fit: cover;
  border-radius: 8px;
  filter: sepia(20%);
}

.about-text {
  display: flex;
  flex-direction: column;
  max-width: 600px;
  gap: 1rem;
}

.cv-text {
  display: flex;
  flex-direction: column;
  max-width: 800px;
  gap: 3.2rem;
}

.about-p {
  color: #d0bfad;
  line-height: 1.7;
  letter-spacing: 2px;
  font-family: sans-serif;
}

.about-link {
  font-weight: bold;
  color: #d0bfad;
  transition-duration: 0.3s;
  transition-property: all;
}

.about-link:hover {
  color: #b4936f;
}

.cv-category-heading {
  color: #b4936f;
  font-weight: 700;
}

.cv-category-container {
  display: flex;
  flex-direction: column;
  gap: 0.64rem;
}

.cv-category-entry-container {
  display: flex;
  flex-direction: column;
  gap: 0.32rem;
}

.cv-category-entry {
  color: #d0bfad;
  line-height: 1.7;
  letter-spacing: 2px;
  font-family: sans-serif;
  font-size: 0.8rem;
}

.entry-year-span {
  all: inherit;
  display: inline;
  font-weight: 700;
}

@media (min-width: 600px) {
  .cv-panel {
    gap: 7.2rem;
  }

  .cv-text {
    gap: 3.6rem;
  }

  .cv-category-entry {
    font-size: 0.9rem;
  }

  .cv-category-container {
    display: flex;
    flex-direction: column;
    gap: 0.72rem;
  }

  .cv-category-entry-container {
    display: flex;
    flex-direction: column;
    gap: 0.36rem;
  }
}

@media (min-width: 900px) {
  .cv-panel {
    gap: 8rem;
  }

  .panel-inner-container,
  .panel-inner-container.cv-container {
    flex-direction: row;
  }

  .panel-inner-container.cv-container {
    flex-direction: column;
  }

  .cv-category-entry {
    font-size: 1rem;
  }

  .cv-text {
    gap: 4rem;
  }

  .cv-category-container {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  .cv-category-entry-container {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
}

@media (min-width: 1200px) {
  .panel-inner-container {
    gap: 8rem;
  }
}
</style>
