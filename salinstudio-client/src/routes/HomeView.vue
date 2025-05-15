<script setup lang="ts"></script>

<template>
  <div class="carousel-container">
    <div class="carousel-image-container">
      <img src="/feather.jpeg" alt="" class="carousel-image" />
      <img src="/feather.jpeg" alt="" class="carousel-image" />
    </div>
    <div class="carousel-text-container">
      <h2 class="carousel-text">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit.
      </h2>
    </div>
  </div>
</template>

<style scoped>
.carousel-container {
  max-width: 720px;
  width: 100%;
  background: radial-gradient(#3d3b2f, #353229);
  aspect-ratio: 4/3;
  justify-self: center;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 8px;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.carousel-image-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.carousel-image {
  max-width: 50%;
  max-height: 50%;
}

.carousel-text-container {
  width: 100%;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: flex-end;
  padding: 1rem;
  flex-shrink: 0;
}

.carousel-text {
  color: silver;
}
</style>
