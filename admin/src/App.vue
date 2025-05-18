<script setup lang="ts">
import { RouterView } from "vue-router";
import Sidebar from "./components/Sidebar.vue";
import Header from "./components/Header.vue";
</script>

<template>
  <div class="flex">
    <Sidebar v-if="$route.meta.requiresAuth" />
    <div class="w-full">
      <Header v-if="$route.meta.requiresAuth" />
      <main class="p-5">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped></style>
