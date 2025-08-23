import About from "./routes/About.vue";
import Gallery from "./routes/Gallery.vue";
import Commissions from "./routes/Commissions.vue";
import Home from "./routes/Home.vue";
import Closeup from "./routes/Closeup.vue";
import NotFound from "./routes/NotFound.vue";
import Contact from "./routes/Contact.vue";

export const routes = [
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
  {
    path: "/contact",
    component: Contact,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];
