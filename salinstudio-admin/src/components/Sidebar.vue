<script setup lang="ts">
import { useRoute, RouterLink } from "vue-router";

const route = useRoute();

const sections = [
  {
    label: "Main",
    items: [
      { label: "Dashboard", route: "/", icon: "pi-home" },
      { label: "Settings", route: "/settings", icon: "pi-cog" },
    ],
  },
  {
    label: "Analytics",
    items: [
      { label: "Visitors", route: "/visitors", icon: "pi-users" },
      { label: "Traffic", route: "/visitors/actions", icon: "pi-chart-line" },
    ],
  },
  {
    label: "Art",
    items: [
      { label: "New", route: "/new", icon: "pi-plus-circle" },
      { label: "Art list", route: "/list", icon: "pi-list" },
      { label: "Gallery", route: "/gallery", icon: "pi-images" },
      { label: "Carousel", route: "/carousel", icon: "pi-desktop" },
    ],
  },
  {
    label: "Store",
    items: [
      { label: "New", route: "/store/new", icon: "pi-plus-circle" },
      { label: "Listings", route: "/store/list", icon: "pi-shopping-cart" },
    ],
  },
  {
    label: "Collections",
    items: [
      { label: "New", route: "/collections/new", icon: "pi-plus-circle" },
      { label: "All collections", route: "/collections/list", icon: "pi-folder" },
    ],
  },
];

const isActive = (itemRoute: string) => route.path === itemRoute;
</script>

<template>
  <aside
    class="flex flex-col w-52 h-screen shrink-0 sticky top-0 overflow-y-auto border-r border-surface-200 dark:border-surface-700"
  >
    <div
      class="flex flex-col justify-center px-4 h-20 shrink-0 border-b border-surface-200 dark:border-surface-700"
    >
      <span
        class="text-lg leading-tight text-surface-800 dark:text-surface-100"
        style="font-family: 'Libre Baskerville', serif; font-style: italic"
        >Miia Salin</span
      >
      <span
        class="text-xs tracking-widest uppercase text-surface-400 dark:text-surface-500"
        >admin</span
      >
    </div>

    <nav class="flex flex-col flex-1 gap-0.5 p-3">
      <template v-for="section in sections" :key="section.label">
        <p
          class="px-2 pt-5 pb-1.5 text-xs font-semibold uppercase tracking-wider text-surface-400 dark:text-surface-500 first:pt-2"
        >
          {{ section.label }}
        </p>
        <RouterLink
          v-for="item in section.items"
          :key="item.route"
          :to="item.route"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-150"
          :class="
            isActive(item.route)
              ? 'bg-primary text-primary-contrast font-medium'
              : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800'
          "
        >
          <i :class="`pi ${item.icon}`" class="text-base shrink-0"></i>
          <span>{{ item.label }}</span>
        </RouterLink>
      </template>
    </nav>

    <div class="p-3 shrink-0 border-t border-surface-200 dark:border-surface-700">
      <RouterLink
        to="/logout"
        class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors duration-150"
      >
        <i class="pi pi-sign-out text-base shrink-0"></i>
        <span>Log out</span>
      </RouterLink>
    </div>
  </aside>
</template>
