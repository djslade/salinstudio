import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../pages/HomeView.vue";
import AboutView from "../pages/AboutView.vue";
import GalleryView from "@/pages/GalleryView.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/about", component: AboutView },
  { path: "/gallery", component: GalleryView },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
