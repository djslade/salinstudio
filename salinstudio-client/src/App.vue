<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { useLanguageStore } from "./store/language";
import OpacityTransition from "./components/OpacityTransition.vue";

const language = useLanguageStore();

onMounted(() => {
  const storedLanguage = localStorage.getItem("salinstudio-language");
  if (storedLanguage && (storedLanguage === "fi" || storedLanguage === "en")) {
    language.set(storedLanguage);
  } else {
    let inferredLanguage = "en";
    const userLanguage = navigator.language || navigator.languages[0];
    if (userLanguage.startsWith("fi")) {
      inferredLanguage = "fi";
    }
    localStorage.setItem("salinstudio-language", inferredLanguage);
    if (inferredLanguage === "en" || inferredLanguage === "fi") {
      language.set(inferredLanguage);
    }
  }
});
</script>

<template>
  <div class="app">
    <RouterView v-slot="{ Component }">
      <OpacityTransition mode="out-in">
        <component :is="Component" />
      </OpacityTransition>
    </RouterView>
  </div>
</template>

<style>
.app {
  min-height: 100vh;
  min-height: 100dvh;
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
