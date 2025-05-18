<script setup lang="ts">
import { Menu } from "primevue";
import { ref } from "vue";

const items = ref([
  {
    label: "Art",
    items: [
      {
        label: "New",
        icon: "pi pi-plus",
        route: "/art/new",
      },
      {
        label: "All",
        icon: "pi-th-large",
        route: "/art",
      },
    ],
  },
  {
    label: "Genres",
    items: [
      {
        label: "New",
        icon: "pi pi-plus",
        route: "/categories/new",
      },
      {
        label: "All",
        icon: "pi-th-large",
        route: "/categories",
      },
    ],
  },
]);
</script>

<template>
  <Menu :model="items" class="flex flex-col h-screen max-w-40 gap-6">
    <template #start>
      <div class="w-full flex p-3 h-20">
        <img src="/logo.svg" class="" alt="" />
      </div>
    </template>
    <template #item="{ item, props }">
      <router-link
        v-if="item.route"
        v-slot="{ href, navigate }"
        :to="item.route"
        custom
      >
        <a v-ripple :href="href" v-bind="props.action" @click="navigate">
          <span :class="item.icon" />
          <span>{{ item.label }}</span>
        </a>
      </router-link>
    </template>
  </Menu>
</template>
