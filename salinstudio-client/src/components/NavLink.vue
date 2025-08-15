<script setup lang="ts">
import { RouterLink } from "vue-router";

defineProps<{
  to: string;
  label: string;
  isCurrentRoute: boolean;
}>();
</script>

<template>
  <span v-if="isCurrentRoute" class="current-route-span">{{ label }}</span>
  <RouterLink v-else class="nav-link" :to="to">{{ label }}</RouterLink>
</template>

<style scoped>
.nav-link {
  color: #d0bfad;
  text-decoration: none;
  transition-property: color;
  transition-duration: 0.3s;
  letter-spacing: 5px;
  text-transform: uppercase;
  font-size: 0.8rem;
}

.nav-link:hover {
  color: #b4936f;
}

.current-route-span {
  color: #b4936f;
  text-decoration: none;
  transition-property: color;
  transition-duration: 0.3s;
  letter-spacing: 5px;
  text-transform: uppercase;
  font-size: 0.8rem;
}
</style>
