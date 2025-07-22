import { createWebHistory, createRouter } from "vue-router";
import About from "./routes/About.vue";
import Gallery from "./routes/Gallery.vue";
import Commissions from "./routes/Commissions.vue";
import Whiskey from "./routes/Whiskey.vue";

const routes = [
  {
    path: "/",
    component: Whiskey,
  },
  {
    path: "/about",
    component: About,
  },
  {
    path: "/gallery",
    component: Gallery,
  },
  {
    path: "/commissions",
    component: Commissions,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
