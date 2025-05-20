<script setup lang="ts">
import { RouterView } from "vue-router";
import Sidebar from "./components/Sidebar.vue";
</script>

<template>
  <div class="w-full flex">
    <Sidebar v-if="$route.meta.requiresAuth" />
    <main class="w-full flex">
      <RouterView />
    </main>
  </div>
</template>

<style scoped></style>
