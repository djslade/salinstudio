import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { routes } from "./router";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import { useAnalyticsStore } from "./store/analytics";
import {
  clearImages,
  clearNoIndex,
  defaultDescription,
  defaultDescriptionFi,
  setDescription,
  setHtmlLang,
  setImages,
  setNoIndex,
  setStaticMetadata,
  setTitle,
  setUrl,
} from "./utils/meta";
import axios from "axios";
import type { Art } from "./types/art";
import { useLanguageStore } from "./store/language";

const app = createApp(App);

app.use(VueQueryPlugin);

const pinia = createPinia();
app.use(pinia);

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const analytics = useAnalyticsStore();
const language = useLanguageStore();

router.beforeEach(async (to, _, next) => {
  if (to.query.hideme === "true") {
    analytics.disable();
  }

  await analytics.init();

  if (to.params.locale === "en" || to.params.locale === "fi") {
    language.set(to.params.locale);
    next();
  } else {
    if (to.name === "Closeup") {
      next({
        name: to.name,
        params: { locale: language.language, id: to.params.id },
        query: to.query,
      });
    } else if (to.name === "NotFound") {
      next({
        name: to.name,
        params: { locale: language.language, pathMatch: to.params.pathMatch },
        query: to.query,
      });
    } else {
      next({
        name: to.name,
        params: { locale: language.language },
        query: to.query,
      });
    }
  }
});

router.afterEach(async (to) => {
  setStaticMetadata();
  setHtmlLang(language.language);

  if (to.name !== "Closeup") {
    setTitle(
      to.params.locale === "fi"
        ? (to.meta.titleFi as string)
        : (to.meta.title as string)
    );
    setDescription(
      to.params.locale === "fi" ? defaultDescriptionFi : defaultDescription
    );
  }

  if (to.name !== "NotFound") {
    setUrl(window.location.href);
  }

  switch (to.name) {
    case "Closeup":
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/art/slug/${to.params.id}`
      );
      const art = res.data.art as Art;

      const title = `${
        to.params.locale === "fi" ? art.titleFi : art.titleEn
      } - Miia Salin`;
      setTitle(title);
      setDescription(
        to.params.locale === "fi" ? art.descriptionFi : art.descriptionEn
      );
      setImages(art.desktopUrl);
      break;
    case "About":
      setImages("/desktop/1755546690870.jpg");
      break;
    case "NotFound":
      setNoIndex();
      clearImages();
      break;
    default:
      clearNoIndex();
      clearImages();
  }

  await analytics.trackAction("traffic", "", to.path);
});

app.use(router);

app.mount("#app");
