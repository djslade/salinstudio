<script setup lang="ts">
import { Menu } from "primevue";
import { ref } from "vue";

const items = ref([
  {
    items: [
      {
        label: "New",
        route: "/art/new",
      },
    ],
  },
]);
</script>

<template>
  <Menu
    :model="items"
    class="flex flex-col h-screen max-w-40 gap-6 shrink-0 justify-center"
  >
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
