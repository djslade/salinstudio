<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <div class="app">
    <RouterView v-slot="{ Component }">
      <Transition name="page-opacity" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>

<style>
.app {
  min-height: 100vh;
  background-color: #261f19;
}

.page-opacity-enter-active,
.page-opacity-leave-active {
  transition-timing-function: ease;
  transition-duration: 600ms;
  transition-property: all;
}

.page-opacity-enter-from,
.page-opacity-leave-to {
  opacity: 0;
}
</style>
