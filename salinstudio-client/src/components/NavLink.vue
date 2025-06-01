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
  color: black;
  text-decoration: none;
}
</style>
