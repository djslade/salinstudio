import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { routes } from "./router";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import { useAnalyticsStore } from "./store/analytics";
import { setHtmlLang, setStaticMetadata } from "./utils/meta";
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
  const res = await fetch(window.location.href, { method: "HEAD" });
  if (res.headers.get("x-is-bot") === "1") {
    analytics.disable();
  }
  if (to.query.hideme === "true") {
    analytics.disable();
  }

  language.init();

  await analytics.init();

  if (language.isFi() && to.params.locale !== "fi") {
    next({
      name: to.name,
      params: { ...to.params, locale: "fi" },
    });
  }
  if (to.params.locale === "en" || to.params.locale === "fi") {
    language.set(to.params.locale);
  }
  next();
});

router.afterEach(async (to) => {
  setStaticMetadata();
  setHtmlLang(language.language);
  await analytics.trackAction("traffic", "", to.path);
});

app.use(router);

app.mount("#app");
