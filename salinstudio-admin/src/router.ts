import { createRouter, createWebHistory } from "vue-router";
import LoginVivew from "./routes/Login.vue";
import HomeView from "./routes/Home.vue";
import SignupView from "./routes/Signup.vue";
import NewView from "./routes/New.vue";
import ListView from "./routes/List.vue";
import GalleryView from "./routes/Gallery.vue";
import LogoutView from "./routes/Logout.vue";
import Carouselview from "./routes/Carousel.vue";
import VisitorsView from "./routes/Visitors.vue";
import VisitorActionsView from "./routes/VisitorActions.vue";
import CollectionsList from "./routes/CollectionsList.vue";
import CollectionsNew from "./routes/CollectionsNew.vue";
import { isVisitorMember } from "./utils/visitor";
import { clearTokens, hasTokens } from "./utils/tokens";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
    meta: { requiresAuth: true },
  },
  {
    path: "/visitors",
    name: "Visitors",
    component: VisitorsView,
    meta: { requiresAuth: true },
  },
  {
    path: "/visitors/actions",
    name: "Visitor Actions",
    component: VisitorActionsView,
    meta: { requiresAuth: true },
  },
  {
    path: "/new",
    name: "New",
    component: NewView,
    meta: { requiresAuth: true },
  },
  {
    path: "/list",
    name: "List",
    component: ListView,
    meta: { requiresAuth: true },
  },
  {
    path: "/gallery",
    name: "Gallery",
    component: GalleryView,
    meta: { requiresAuth: true },
  },
  {
    path: "/carousel",
    name: "Carousel",
    component: Carouselview,
    meta: { requiresAuth: true },
  },
  {
    path: "/collections/new",
    name: "CollectionsNew",
    component: CollectionsNew,
    meta: { requiresAuth: true },
  },
  {
    path: "/collections/list",
    name: "CollectionsList",
    component: CollectionsList,
    meta: { requiresAuth: true },
  },
  {
    path: "/logout",
    name: "Logout",
    component: LogoutView,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginVivew,
    meta: { requiresUnauth: true },
  },
  {
    path: "/signup",
    name: "Signup",
    component: SignupView,
    meta: { requiresUnauth: true },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  if (to.name === "Logout") {
    if (!hasTokens()) {
      return next({ name: isVisitorMember() ? "Login" : "Signup" });
    } else {
      clearTokens();
    }
  }

  if (to.meta.requiresAuth && !hasTokens()) {
    return next({
      name: isVisitorMember() ? "Login" : "Signup",
      replace: true,
    });
  }

  if (to.meta.requiresUnauth && hasTokens()) {
    return next({ name: "Home", replace: true });
  }

  next();
});
