<script setup lang="ts"></script>

<template>
  <section class="hero">
    <slot name="background" />
    <div class="overlay" />
    <div class="content-container">
      <slot name="content" />
    </div>
  </section>
</template>

<style scoped>
.content-container {
  inset: 0;
  position: absolute;
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero {
  position: relative;
  width: 100%;
  background-color: #261f19;
}

.overlay {
  inset: 0;
  position: absolute;
  z-index: 4;
  background: rgba(38, 31, 25, 0.55);
}
</style>
