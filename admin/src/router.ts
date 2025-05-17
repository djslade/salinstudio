import { createRouter, createWebHistory } from "vue-router";
import LoginVivew from "./routes/Login.vue";
import HomeView from "./routes/Home.vue";
import SignupView from "./routes/Signup.vue";
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
  const authenticated = isAuthenticated();

  if (to.meta.requiresAuth && !authenticated) {
    return next({
      name: isVisitorMember() ? "Login" : "Signup",
      replace: true,
    });
  }

  if (to.meta.requiresUnauth && authenticated) {
    return next({ name: "Home", replace: true });
  }

  next();
});
