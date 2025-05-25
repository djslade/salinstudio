<script setup lang="ts"></script>

<template>
  <div class="gallery-wrapper">
    <h1 class="title">Gallery</h1>
    <div class="gallery">
      <div class="card left-most"><img src="/img1.jpg" alt="1" /></div>
      <div class="card left"><img src="/img2.jpg" alt="2" /></div>
      <div class="card right"><img src="/img3.jpg" alt="3" /></div>
      <div class="card right-most"><img src="/img4.jpg" alt="4" /></div>
    </div>
    <div class="nav">
      <span class="prev">← Prev</span>
      <span class="next">Next →</span>
    </div>
  </div>
</template>

<style scoped>
.gallery-wrapper {
  text-align: center;
  padding: 2rem;
}

.title {
  font-size: 3rem;
  font-family: "Orbitron", sans-serif;
  margin-bottom: 2rem;
  color: white;
}

.gallery {
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1500px;
  gap: 1.5rem;
}

.card {
  width: 220px;
  height: 320px;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  transition: transform 0.3s ease;
  background: #222;
}

.card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 3D Effect Classes */
.left-most {
  transform: rotateY(20deg) translateX(-30px) scale(0.95);
  z-index: 1;
}

.left {
  transform: rotateY(10deg) translateX(-10px);
  z-index: 2;
}

.right {
  transform: rotateY(-10deg) translateX(10px);
  z-index: 2;
}

.right-most {
  transform: rotateY(-20deg) translateX(30px) scale(0.95);
  z-index: 1;
}

.card:hover {
  transform: scale(1.05) rotateY(0deg) !important;
  z-index: 3;
}

/* Nav buttons */
.nav {
  margin-top: 1.5rem;
  font-size: 1.1rem;
  display: flex;
  justify-content: space-between;
  max-width: 300px;
  margin-inline: auto;
  color: #aaa;
}

.nav span {
  cursor: pointer;
  transition: color 0.2s;
}

.nav span:hover {
  color: white;
}
</style>
