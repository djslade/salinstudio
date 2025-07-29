<script setup lang="ts">
type Position = "absolute" | "static";

defineProps<{ position: Position }>();
</script>

<template>
  <header class="footer" :style="{ position }">
    <div class="inner-footer">
      <span class="attribution">©2025 Miia Salin</span>
    </div>
  </header>
</template>

<style scoped>
.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 12;
}

.inner-footer {
  margin: 0 auto;
  width: 100%;
  max-width: 1200px;
  height: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.nav {
  display: flex;
  gap: 2.5rem;
}

.attribution {
  color: #d0bfad;
  font-size: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 4px;
}
</style>
