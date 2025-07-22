<script setup lang="ts">
import { RouterLink } from "vue-router";

defineProps<{
  to: string;
  label: string;
}>();
</script>

<template>
  <RouterLink class="nav-link" :to="to">{{ label }}</RouterLink>
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
</style>
