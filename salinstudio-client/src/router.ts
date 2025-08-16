import { createWebHistory, createRouter } from "vue-router";
import About from "./routes/About.vue";
import Gallery from "./routes/Gallery.vue";
import Commissions from "./routes/Commissions.vue";
import Home from "./routes/Home.vue";

const routes = [
  {
    path: "/",
    component: Home,
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
