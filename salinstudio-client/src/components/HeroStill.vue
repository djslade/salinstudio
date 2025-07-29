<template>
  <div class="hero-img-container">
    <div class="canvas">
      <img class="hero-img" src="/artist.jpg" alt="background" />
      <div class="vert-overlay"></div>
      <div class="horiz-overlay"></div>
    </div>
  </div>
</template>

<style scoped>
.hero-img-container {
  height: 100vh;
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
}

.canvas {
  position: absolute;
  height: 100%;
  padding: 1rem;
  display: flex;
  justify-content: center;
  background-color: transparent;
  transition-duration: 5s;
  transition-property: opacity;
}

.hero-img {
  height: 100%;
  background-color: #261f19;
}

.vert-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, #261f19, transparent, #261f19);
}

.horiz-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, #261f19, transparent, #261f19);
}
</style>
