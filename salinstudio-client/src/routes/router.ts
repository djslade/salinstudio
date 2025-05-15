import { createWebHistory, createRouter } from "vue-router";
import AboutView from "./AboutView.vue";
import BuyView from "./BuyView.vue";
import ContactView from "./ContactView.vue";
import GalleryView from "./GalleryView.vue";
import HomeView from "./HomeView.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/about", component: AboutView },
  { path: "/gallery", component: GalleryView },
  { path: "/contact", component: ContactView },
  { path: "/buy", component: BuyView },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
