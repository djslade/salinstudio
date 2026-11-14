import { ViteSSG } from "vite-ssg";
import "./style.css";
import App from "./App.vue";
import { routes } from "./router";
import {
  QueryClient,
  VueQueryPlugin,
  dehydrate,
  hydrate,
} from "@tanstack/vue-query";
import { createPinia } from "pinia";
import { useAnalyticsStore } from "./store/analytics";
import { useLanguageStore } from "./store/language";

export const createApp = ViteSSG(
  App,
  { routes },
  ({ app, router, initialState, onSSRAppRendered }) => {
    app.use(createPinia());

    // Queries prefetched during the SSG build (via onServerPrefetch) are
    // serialized into the page and hydrated on load, so their content is in
    // the static HTML and the client doesn't start from an empty cache.
    const queryClient = new QueryClient();
    app.use(VueQueryPlugin, { queryClient });
    if (import.meta.env.SSR) {
      onSSRAppRendered(() => {
        initialState.vueQuery = dehydrate(queryClient);
      });
    } else if (initialState.vueQuery) {
      hydrate(queryClient, initialState.vueQuery);
    }

    if (!import.meta.env.SSR) {
      const analytics = useAnalyticsStore();
      const language = useLanguageStore();

      router.beforeEach(async (to, _, next) => {
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
          return;
        }
        if (to.params.locale === "en" || to.params.locale === "fi") {
          language.set(to.params.locale as "en" | "fi");
        }
        next();
      });

      router.afterEach(async (to) => {
        await analytics.trackAction("traffic", "", to.path);
      });
    }
  },
);
