<script setup lang="ts">
import Main from "../components/Main.vue";
import HeroCarousel from "../components/HeroCarousel.vue";
</script>

<template>
  <Main>
    <template #content>
      <section class="hero-panel">
        <HeroCarousel />
      </section>
      <section class="about-panel">
        <div class="about-text">
          <div class="about-headings-container">
            <h1 class="about-heading">Miia Salin</h1>
            <h2 class="about-subheading">Artist and Visual Storyteller</h2>
          </div>
          <div class="about-p-container">
            <p class="about-p">
              I create varied art with a particular focus on portraits,
              still-life and surrealism, alongside an occasional splash of
              horror.
            </p>
          </div>
        </div>
        <div class="boxes">
          <div class="card">
            <img src="/1748113914558.webp" alt="" class="card-img" />
          </div>
          <div class="card">
            <img src="/1748113914558.webp" alt="" class="card-img" />
          </div>
          <div class="card">
            <img src="/1748113914558.webp" alt="" class="card-img" />
          </div>
        </div>
      </section>
    </template>
  </Main>
</template>

<style scoped>
.about-heading {
  font-size: 2rem;
  color: #bcb1a4;
  text-align: center;
  font-weight: 700;
  text-shadow: 1px 1px 2px #000;
  letter-spacing: 1.5px;
}

.hero-panel {
  max-width: 1200px;
  width: 100%;
  padding: 2rem 0;
  border-radius: 1rem;
  margin: 2rem 0;
  min-height: calc(100vh - 5rem);
}

.hero-cap {
  font-size: 1.5rem;
  text-align: center;
}

.about-panel {
  max-width: 1200px;
  width: 100%;
  padding: 2rem 0;
  border-radius: 1rem;
  min-height: calc(100vh - 5rem);
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.about-text {
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.about-headings-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.about-subheading {
  color: #bcb1a4;
  text-align: center;
  font-weight: 500;
  font-size: 1.75rem;
  text-shadow: 1px 1px 2px #000;
  line-height: 1.3;
  letter-spacing: 2px;
}

.about-p {
  color: #bcb1a4;
  font-size: 1.25rem;
  text-align: center;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 3px;
}

.boxes {
  display: flex;
  gap: 3rem;
}

.card {
  width: 100%;
}

.card-img {
  width: 100%;
  aspect-ratio: 16/9;
}
</style>
