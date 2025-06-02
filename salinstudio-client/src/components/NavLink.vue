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
  color: #bcb1a4;
  text-decoration: none;
  transition-property: color;
  transition-duration: 0.3s;
  letter-spacing: 3px;
}

.nav-link:hover {
  color: #d4af37;
}
</style>
