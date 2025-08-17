<script setup lang="ts">
import { Menu } from "primevue";
import { ref } from "vue";

const items = ref([
  {
    label: "Main",
    items: [{ label: "Dashboard", route: "/" }],
  },
  {
    label: "Art",
    items: [
      {
        label: "New",
        route: "/new",
      },
      {
        label: "Art list",
        route: "/list",
      },
      {
        label: "Gallery",
        route: "/gallery",
      },
      {
        label: "Carousel",
        route: "/carousel",
      },
    ],
  },
  {
    label: "Other",
    items: [
      {
        label: "Log out",
        route: "/logout",
      },
    ],
  },
]);
</script>

<template>
  <Menu
    :model="items"
    class="flex flex-col h-screen max-w-40 gap-6 shrink-0 py-6"
  >
    <template #start>
      <div class="w-full flex p-3 h-20">
        <img src="/logo.svg" class="h-full" alt="" />
      </div>
    </template>
    <template #item="{ item, props }">
      <router-link
        v-if="item.route"
        v-slot="{ href, navigate }"
        :to="item.route"
        custom
      >
        <a :href="href" v-bind="props.action" @click="navigate">
          <span :class="item.icon" />
          <span>{{ item.label }}</span>
        </a>
      </router-link>
    </template>
    <div class="justify-self-end">
      <h1>Hi</h1>
    </div>
  </Menu>
</template>
