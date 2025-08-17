import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { router } from "./router";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import { VueQueryPlugin } from "@tanstack/vue-query";
import ToastService from "primevue/toastservice";
import DialogService from "primevue/dialogservice";

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
app.use(VueQueryPlugin);
app.mount("#app");
