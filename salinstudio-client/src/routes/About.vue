<script setup lang="ts">
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import { useLanguageStore } from "../store/language";
import { onMounted, ref } from "vue";
import Loader from "../components/Loader.vue";
import OpacityTransition from "../components/OpacityTransition.vue";
import PanelParagraph from "../components/PanelParagraph.vue";
import { useImageStore } from "../store/images";
import { useRoute } from "vue-router";
import { useMetadata } from "../hooks/useMetadata";

const route = useRoute();
const language = useLanguageStore();
const images = useImageStore();

const { setMetadata } = useMetadata();

const pageReady = ref<boolean>(false);

onMounted(async () => {
  setMetadata({
    description:
      route.params.locale === "fi"
        ? "Olen suomalainen taiteilija, jonka mielikuvitus ja luomisvimma tuntuvat ehtymättömiltä. Matkani tähän asti ei ole ollut helppo, mutta jokainen vastoinkäyminen on vain vahvistanut päättäväisyyttäni ja intohimoani taiteeseen."
        : "I’m a hardworking artist from Finland with limitless imagination and drive. I’ve come a long way for this path, but my hardships have just made my determination stronger.",
    imageUrl: "/desktop/1755546690870.jpg",
  });

  await images.preloadAndSet("/desktop/1755546690870.jpg");

  pageReady.value = true;
  window.prerenderReady = true;
});
</script>

<template>
  <div class="">
    <Header
      position="sticky"
      :heading="language.isEn() ? 'About' : 'Tietoa'"
      current-route="About"
    />
    <main>
      <OpacityTransition mode="default">
        <section
          v-if="pageReady"
          :class="{ 'about-panel': true, 'is-visible': pageReady }"
        >
          <div class="about-img-container">
            <img
              src="/desktop/1755546690870.jpg"
              alt="Miia Salin"
              class="about-img"
            />
          </div>
          <div class="about-text-container">
            <div v-if="language.isFi()" class="about-text">
              <PanelParagraph>
                Olen suomalainen taiteilija, jonka mielikuvitus ja luomisvimma
                tuntuvat ehtymättömiltä. Matkani tähän asti ei ole ollut helppo,
                mutta jokainen vastoinkäyminen on vain vahvistanut
                päättäväisyyttäni ja intohimoani taiteeseen.
              </PanelParagraph>
              <PanelParagraph>
                Työskentelen mielelläni lyijykynällä, hiilellä ja öljyväreillä.
                Teen toisinaan myös digitaalista taidetta, ja minua kiehtovat
                erityisesti animaatio sekä 3D-taide. Opin nopeasti, kuuntelen
                tarkasti ja ammennan inspiraatiota surrealismista,
                symbolismista, tosielämän kokemuksista ja tarinoista. Pyrin aina
                tavoittamaan tunteen ja aidon elämyksen riippumatta siitä, mitä
                tai ketä kuvitan.
              </PanelParagraph>
              <PanelParagraph>
                Kansainvälisyys on minulle tärkeää, ja haluan löytää uusia
                kokemuksia ja mahdollisuuksia myös Suomen rajojen ulkopuolelta.
                Olen herkkä huomaamaan erilaisia elämäntilanteita, ja haluan,
                että minuun on helppo ottaa yhteyttä ja tilata taidetta. Seuraa
                minua
                <a
                  href="https://www.instagram.com/salinmiia/"
                  target="_blank"
                  class="about-link"
                  >Instagramissa</a
                >, jos haluat pysyä ajan tasalla uusista töistäni.
              </PanelParagraph>
            </div>
            <div v-else class="about-text">
              <PanelParagraph>
                I’m a hardworking artist from Finland with limitless imagination
                and drive. I’ve come a long way for this path, but my hardships
                have just made my determination stronger.
              </PanelParagraph>
              <PanelParagraph>
                I enjoy drawing with pencil, coal and using oil paints. I also
                make some digital art at times, and have great interest in
                animation and 3D art. I’m a great listener and learn fast. I
                enjoy surrealism, symbolism, real life experiences and stories.
                I want to capture the feeling and raw emotion in whatever or
                whoever I make art of.
              </PanelParagraph>
              <PanelParagraph>
                Being international is very important to me, and I’m hoping to
                gain new experiences and opportunities outside of Finland too.
                I’m very sensitive to different situations that people might be
                in, and I will make it as easy as possible to contact me and
                request artworks. Follow me on
                <a
                  href="https://www.instagram.com/salinmiia/"
                  target="_blank"
                  class="about-link"
                  >Instagram</a
                >
                to stay up to date with my work.
              </PanelParagraph>
            </div>
          </div>
        </section>
      </OpacityTransition>
      <Loader v-if="!pageReady" />
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
  flex-direction: column;
  gap: 4rem;
  min-height: calc(100vh - 10rem);
  min-height: calc(100dvh - 10rem);
  opacity: 0;
  transition-property: opacity;
  transition-duration: 600ms;
  transition-timing-function: ease;
}

.about-panel.is-visible {
  opacity: 1;
}

.about-img-container {
  display: flex;
  justify-content: center;
}

.about-img {
  max-width: 24rem;
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
  border-radius: 8px;
  filter: sepia(20%);
}

.about-text {
  display: flex;
  flex-direction: column;
  max-width: 600px;
  gap: 1rem;
}

.about-p {
  color: #d0bfad;
  line-height: 1.7;
  letter-spacing: 2px;
  font-family: sans-serif;
}

.about-link {
  font-weight: bold;
  color: #d0bfad;
  transition-duration: 0.3s;
  transition-property: all;
}

.about-link:hover {
  color: #b4936f;
}

@media (min-width: 900px) {
  .about-panel {
    flex-direction: row;
  }
}

@media (min-width: 1200px) {
  .about-panel {
    gap: 8rem;
  }
}
</style>
