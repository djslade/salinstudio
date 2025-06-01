<script setup lang="ts">
import { RouterView } from "vue-router";
import Header from "./components/Header.vue";
</script>

<template>
  <div class="background">
    <Header />
    <RouterView />
  </div>
</template>

<style>
.background {
  max-width: 100vw;
  width: 100%;
  min-height: 100vh;
  background-image: url("/background.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
