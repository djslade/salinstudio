<script setup lang="ts">
import type { LinkCard } from "../types/linkCard";
import { RouterLink } from "vue-router";

defineProps<LinkCard>();
</script>

<template>
  <RouterLink :to="to" class="card-container">
    <div class="card">
      <img :src="imageSrc" :alt="heading" class="card-img" />
      <h3 class="card-heading">{{ heading }}</h3>
    </div>
  </RouterLink>
</template>

<style scoped>
.card-container {
  width: 100%;
  text-decoration: none;
}
.card {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
