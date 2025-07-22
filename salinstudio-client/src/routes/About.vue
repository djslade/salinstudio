<script setup lang="ts">
import Header from "../components/Header.vue";
</script>

<template>
  <div class="page">
    <Header />
    <section class="about-panel">
      <img class="about-img" src="/artist.jpg" alt="" />
      <div class="about-text">
        <p class="about-p">
          I’m a hardworking 2nd year art student from Finland with limitless
          imagination and drive. I’ve come a long way for this path, but my
          hardships have just made my motivation stronger.
        </p>
        <p class="about-p">
          I enjoy drawing with pencil, coal and using oil paints, but I’m all in
          for trying out any and all different forms of art. I’m a great
          listener and I learn fast. I enjoy surrealism, symbolism, real life
          experiences and stories. I want to capture the feeling and raw emotion
          in whatever or whoever I make art of.
        </p>
        <p class="about-p">
          Being international is very important to me, and I’m hoping to gain
          new experiences and opportunities outside of Finland too. I’m very
          sensitive to different situations that people might be in, and I will
          make it as easy as possible to contact me and request artworks.
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
}

.about-panel {
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.about-img {
  width: 18rem;
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 1rem;
  filter: grayscale(75%);
}

.about-text {
  display: flex;
  flex-direction: column;
  max-width: 600px;
  gap: 1rem;
}

.about-p {
  color: #bcb1a4;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.7;
  letter-spacing: 2px;
}
</style>
