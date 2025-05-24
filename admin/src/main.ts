import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { router } from "./router";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { createPinia } from "pinia";
import ToastService from "primevue/toastservice";
import DialogService from "primevue/dialogservice";

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: "p",
      darkModeSelector: "system",
      cssLayer: false,
    },
  },
});
app.use(ToastService);
app.use(DialogService);
app.use(pinia);
app.use(VueQueryPlugin);
app.mount("#app");
