import { createRouter, createWebHistory } from "vue-router";
import LoginVivew from "./routes/Login.vue";
import HomeView from "./routes/Home.vue";
import SignupView from "./routes/Signup.vue";
import NewArtView from "./routes/NewArt.vue";
import NewCategoryView from "./routes/NewCategory.vue";
import AllArtView from "./routes/AllArt.vue";
import AllCategoriesView from "./routes/AllCategories.vue";
import ArtView from "./routes/Art.vue";
import CategoryView from "./routes/Category.vue";
import { isAuthenticated } from "./utils/auth";
import { isVisitorMember } from "./utils/visitor";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
    meta: { requiresAuth: true },
  },
  {
    path: "/art",
    name: "All Art",
    component: AllArtView,
    meta: { requiresAuth: true },
  },
  {
    path: "/art/new",
    name: "New Art",
    component: NewArtView,
    meta: { requiresAuth: true },
  },
  {
    path: "/art/:id",
    name: "Art",
    component: ArtView,
    meta: { requiresAuth: true },
  },
  {
    path: "/categories",
    name: "All Categories",
    component: AllCategoriesView,
    meta: { requiresAuth: true },
  },
  {
    path: "/categories/new",
    name: "New Category",
    component: NewCategoryView,
    meta: { requiresAuth: true },
  },
  {
    path: "/categories/:id",
    name: "Category",
    component: CategoryView,
    meta: { requiresAuth: true },
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
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return next({
      name: isVisitorMember() ? "Login" : "Signup",
      replace: true,
    });
  }

  if (to.meta.requiresUnauth && isAuthenticated()) {
    return next({ name: "Home", replace: true });
  }

  next();
});
