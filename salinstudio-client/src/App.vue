<script setup lang="ts">
import { RouterView } from "vue-router";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <div class="background">
    <Header />
    <RouterView v-slot="{ Component }">
      <Transition name="page-opacity" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
    <Footer />
  </div>
</template>

<style>
.background {
  max-width: 100vw;
  width: 100%;
  min-height: 100vh;
  background-color: #383129;
  position: relative;
  background-image: url("/background.jpg");
  background-color: #383129;
  background-blend-mode: multiply;
  background-repeat: repeat;
}

.page-opacity-enter-active,
.page-opacity-leave-active {
  transition-timing-function: ease;
  transition-duration: 400ms;
  transition-property: all;
}

.page-opacity-enter-from,
.page-opacity-leave-to {
  opacity: 0;
  transform: translateY(80px);
}
</style>
