import { createWebHistory, createRouter } from "vue-router";
import About from "./routes/About.vue";
import Gallery from "./routes/Gallery.vue";
import Commissions from "./routes/Commissions.vue";
import Home from "./routes/Home.vue";
import Closeup from "./routes/Closeup.vue";
import NotFound from "./routes/NotFound.vue";

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
    path: "/gallery/:id",
    component: Closeup,
  },
  {
    path: "/gallery",
    component: Gallery,
  },
  {
    path: "/commissions",
    component: Commissions,
  },
  /*
    {
    path: "/contact",
    component: Contact,
  },
  */
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
