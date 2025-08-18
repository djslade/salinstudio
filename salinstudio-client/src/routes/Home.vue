<script setup lang="ts">
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import Hero from "../components/Hero.vue";
import { useQuery } from "@tanstack/vue-query";
import axios from "axios";
import type { Art } from "../types/art";
import Loader from "../components/Loader.vue";

const { data } = useQuery({
  queryKey: ["carousel"],
  queryFn: async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_SERVER_ENDPOINT}/art/carousel`
    );
    if (res.data.art.length > 0) return res.data.art as Art[];
    const fallback = await axios.get(
      `${import.meta.env.VITE_SERVER_ENDPOINT}/art`
    );
    return fallback.data.art.slice(0, 5) as Art[];
  },
});
</script>

<template>
  <div class="">
    <Header position="fixed" transparent current-route="Home" />
    <main>
      <Hero v-if="data" :data="data" />
      <Loader v-else full />
    </main>
    <Footer position="absolute" />
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
  font-size: 2rem;
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
  padding: 0.5rem;
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

@media (min-width: 600px) {
  .content-heading {
    font-size: 3rem;
  }
}

@media (min-width: 900px) {
  .content-heading {
    font-size: 4rem;
  }

  .cta-btn-icon-container {
    padding: 0.8rem;
  }
}
</style>
