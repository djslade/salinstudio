<script setup lang="ts">
import { RouterView } from "vue-router";
import Sidebar from "./components/Sidebar.vue";
import { Toast } from "primevue";
import { onMounted, ref } from "vue";
import { refreshTokens } from "./utils/auth";
import LoadingPanel from "./components/LoadingPanel.vue";

const loaded = ref<boolean>(false);

onMounted(async () => {
  await refreshTokens();
  loaded.value = true;
});
</script>

<template>
  <div v-if="!loaded" class="w-full h-screen flex bg-surface-50 dark:bg-surface-950">
    <LoadingPanel />
  </div>
  <div v-else class="w-full flex h-screen bg-surface-50 dark:bg-surface-950">
    <Sidebar v-if="$route.meta.requiresAuth" />
    <main class="w-full flex overflow-x-scroll p-10">
      <RouterView />
      <Toast position="top-left" group="main" />
    </main>
  </div>
</template>
