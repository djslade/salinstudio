import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { routes } from "./router";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import { useAnalyticsStore } from "./store/analytics";

const app = createApp(App);

app.use(VueQueryPlugin);

const pinia = createPinia();
app.use(pinia);

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const analytics = useAnalyticsStore();

router.beforeEach(async (route) => {
  if (route.query.hideme === "true") {
    analytics.disable();
  }

  await analytics.init();
});

router.afterEach(async (route) => {
  await analytics.trackAction("traffic", "", route.path);
});

app.use(router);

app.mount("#app");
