<script setup lang="ts">
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
</script>

<template>
  <div class="">
    <Header position="sticky" heading="About" current-route="About" />
    <main>
      <section class="about-panel">
        <div class="about-img-container">
          <img src="/artist.jpg" alt="" class="about-img" />
        </div>
        <div class="about-text-container">
          <div class="about-text">
            <p class="about-p">
              I’m a hardworking 2nd year art student from Finland with limitless
              imagination and drive. I’ve come a long way for this path, but my
              hardships have just made my motivation stronger.
            </p>
            <p class="about-p">
              I enjoy drawing with pencil, coal and using oil paints, but I’m
              all in for trying out any and all different forms of art. I’m a
              great listener and I learn fast. I enjoy surrealism, symbolism,
              real life experiences and stories. I want to capture the feeling
              and raw emotion in whatever or whoever I make art of.
            </p>
            <p class="about-p">
              Being international is very important to me, and I’m hoping to
              gain new experiences and opportunities outside of Finland too. I’m
              very sensitive to different situations that people might be in,
              and I will make it as easy as possible to contact me and request
              artworks.
            </p>
          </div>
        </div>
      </section>
    </main>
    <Footer position="static" />
  </div>
</template>

<style scoped>
.content-inner {
  width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}

.content-heading {
  color: #d0bfad;
  text-transform: uppercase;
  font-size: 4rem;
  text-align: center;
  font-weight: 400;
}

.content-keyword {
  color: #b4936f;
}

.cta-btn {
  background-color: transparent;
  border: transparent;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cta-btn-icon-container {
  border: 1px solid #b4936f;
  border-radius: 50%;
  padding: 0.8rem;
}

.cta-btn-icon {
  color: #d0bfad;
  font-size: 1.5rem;
}

.cta-btn-text {
  text-transform: uppercase;
  letter-spacing: 3px;
  color: #d0bfad;
}

.about-panel {
  padding: 2rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rem;
  min-height: calc(100vh - 5rem);
}

.about-img-container {
  display: flex;
  justify-content: center;
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
  color: #d0bfad;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.9;
  letter-spacing: 4px;
}
</style>
