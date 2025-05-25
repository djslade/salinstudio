import { createRouter, createWebHistory } from "vue-router";
import LoginVivew from "./routes/Login.vue";
import HomeView from "./routes/Home.vue";
import SignupView from "./routes/Signup.vue";
import NewView from "./routes/New.vue";
import ListView from "./routes/List.vue";
import PreviewView from "./routes/Preview.vue";
import LogoutView from "./routes/Logout.vue";
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
    path: "/preview",
    name: "Preview",
    component: PreviewView,
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
