<script setup lang="ts">
import { RouterView } from "vue-router";
import Header from "./components/Header.vue";
import Navbar from "./components/Navbar.vue";
</script>

<template>
  <Header />
  <Navbar />
  <main class="main">
    <RouterView />
  </main>
</template>

<style scoped>
.main {
  min-height: calc(100vh - 10rem - 2.5rem);
  background-color: #373029;
  padding: 1rem;
}
</style>
