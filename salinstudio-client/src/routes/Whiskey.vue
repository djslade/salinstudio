<script setup lang="ts">
import HeroCarousel from "../components/HeroCarousel.vue";
import { Icon } from "@iconify/vue";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import Hero from "../components/Hero.vue";
</script>

<template>
  <div class="">
    <Header position="fixed" />
    <main>
      <Hero>
        <template #background>
          <HeroCarousel />
        </template>
        <template #content>
          <div class="content-inner">
            <div class="content-heading-container">
              <h1 class="content-heading">Miia Salin is an</h1>
              <h1 class="content-heading">
                <span class="content-keyword">artist</span> and
                <span class="content-keyword">visual storyteller</span>
              </h1>
            </div>
            <div class="content-cta">
              <button class="cta-btn">
                <div class="cta-btn-icon-container">
                  <Icon
                    icon="mdi-light:arrow-up"
                    class="cta-btn-icon"
                    :inline="true"
                  />
                </div>
                <span class="cta-btn-text">Explore her work</span>
              </button>
            </div>
          </div>
        </template>
      </Hero>
    </main>
    <Footer />
  </div>
</template>

<style scoped>
.content-inner {
  width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}

.content-heading {
  color: #d0bfad;
  text-transform: uppercase;
  font-size: 4rem;
  text-align: center;
  font-weight: 400;
}

.content-keyword {
  color: #b4936f;
}

.cta-btn {
  background-color: transparent;
  border: transparent;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cta-btn-icon-container {
  border: 1px solid #b4936f;
  border-radius: 50%;
  padding: 0.8rem;
}

.cta-btn-icon {
  color: #d0bfad;
  font-size: 1.5rem;
}

.cta-btn-text {
  text-transform: uppercase;
  letter-spacing: 3px;
  color: #d0bfad;
}
</style>
