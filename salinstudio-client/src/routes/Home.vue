<script setup lang="ts">
import Main from "../components/Main.vue";
import HeroCarousel from "../components/HeroCarousel.vue";
import Divider from "../components/Divider.vue";
</script>

<template>
  <Main>
    <template #content>
      <section class="hero-panel">
        <HeroCarousel />
        <div class="hero-cap-container">
          <h2 class="hero-cap">
            Mixed art with a focus on still-life, surrealism, and a splash of
            horror
          </h2>
        </div>
      </section>
      <Divider />
    </template>
  </Main>
</template>

<style scoped>
.hero-panel {
  max-width: 1200px;
  width: 100%;
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.hero-cap {
  font-size: 1.5rem;
  text-align: center;
}
</style>
