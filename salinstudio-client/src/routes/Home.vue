<script setup lang="ts">
import Main from "../components/Main.vue";
import HeroCarousel from "../components/HeroCarousel.vue";
import CtaCard from "../components/CtaCard.vue";
import { type LinkCard } from "../types/linkCard";

const cards: LinkCard[] = [
  {
    imageSrc: "/1748113914558.webp",
    heading: "About me",
    to: "/about",
  },
  {
    imageSrc: "/1748113914558.webp",
    heading: "My work",
    to: "/gallery",
  },
  {
    imageSrc: "/comm.webp",
    heading: "Commission art",
    to: "/commissions",
  },
];
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
          <p class="about-p">
            I create varied art with a particular focus on portraits, still-life
            and surrealism, alongside an occasional splash of horror.
          </p>
        </div>
        <div class="boxes">
          <CtaCard
            v-for="(card, idx) in cards"
            :key="idx"
            :to="card.to"
            :imageSrc="card.imageSrc"
            :heading="card.heading"
          />
        </div>
      </section>
    </template>
  </Main>
</template>

<style scoped>
.about-heading {
  font-size: 3rem;
  color: #bcb1a4;
  font-weight: 500;
  text-shadow: 1px 1px 2px #000;
  letter-spacing: 1.5px;
}

.hero-panel {
  max-width: 1200px;
  width: 100%;
  padding: 2rem 0;
  border-radius: 1rem;
  min-height: calc(100vh - 5rem);
}

.hero-title {
  font-size: 8rem;
  color: white;
  background-color: #383129;
  text-shadow: (
    -1px -1px 0 #000,
    1px -1px 0 #000,
    -1px 1px 0 #000,
    1px 1px 0 #000
  );
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
  min-height: calc(100vh - 10rem);
  display: flex;
  flex-direction: column;
  gap: 6rem;
}

.about-text {
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
  font-weight: 700;
  font-size: 2.25rem;
  text-shadow: 1px 1px 2px #000;
  line-height: 1.3;
  letter-spacing: 2px;
}

.about-p {
  color: #bcb1a4;
  font-size: 1.5rem;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 3px;
}

.boxes {
  display: flex;
  gap: 3rem;
  border-radius: 1rem;
}

.card {
  width: 100%;
}

.card-img {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
  border-radius: 1rem;
}

.card-heading {
  color: #bcb1a4;
  font-size: 1.5rem;
  font-weight: 500;
  text-align: center;
}
</style>
