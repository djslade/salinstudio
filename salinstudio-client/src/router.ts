import About from "./routes/About.vue";
import Gallery from "./routes/Gallery.vue";
import Commissions from "./routes/Commissions.vue";
import Home from "./routes/Home.vue";
import Closeup from "./routes/Closeup.vue";
import NotFound from "./routes/NotFound.vue";
import Contact from "./routes/Contact.vue";

export const routes = [
  {
    path: "/:locale(en|fi)?",
    component: Home,
    name: "Home",
    meta: {
      title: "Artist and Visual Storyteller - Miia Salin",
      titleFi: "Taiteilija ja Visuaalinen Tarinankertoja - Miia Salin",
    },
  },
  {
    path: "/:locale(en|fi)?/about",
    component: About,
    name: "About",
    meta: {
      title: "About - Miia Salin",
      titleFi: "Tietoa - Miia Salin",
    },
  },
  {
    path: "/:locale(en|fi)?/gallery/:id",
    component: Closeup,
    name: "Closeup",
  },
  {
    path: "/:locale(en|fi)?/gallery",
    component: Gallery,
    name: "Gallery",
    meta: {
      title: "Gallery - Miia Salin",
      titleFi: "Galleria - Miia Salin",
    },
  },
  {
    path: "/:locale(en|fi)?/commissions",
    component: Commissions,
    name: "Commissions",
    meta: {
      title: "Commissions - Miia Salin",
      titleFi: "Tilaustyöt - Miia Salin",
    },
  },
  {
    path: "/:locale(en|fi)?/contact",
    component: Contact,
    name: "Contact",
    meta: {
      title: "Contact - Miia Salin",
      titleFi: "Yhteys - Miia Salin",
    },
  },
  {
    path: "/:locale(en|fi)?/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
    meta: {
      title: "Page not found - Miia Salin ",
      titleFi: "Sivua ei löydy - Miia Salin",
    },
  },
];
