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
import PanelHeading from "../components/PanelHeading.vue";

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
        <div class="about-outer-container">
          <section
            v-if="pageReady"
            :class="{ 'about-panel': true, 'is-visible': pageReady }"
          >
            <PanelHeading
              :text="language.isEn() ? 'Who I am' : 'Kuka olen'"
              textAlign="center"
            />
            <div class="panel-inner-container">
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
                    Olen suomalainen taiteilija, jonka mielikuvitus ja
                    luomisvimma tuntuvat ehtymättömiltä. Matkani tähän asti ei
                    ole ollut helppo, mutta jokainen vastoinkäyminen on vain
                    vahvistanut päättäväisyyttäni ja intohimoani taiteeseen.
                  </PanelParagraph>
                  <PanelParagraph>
                    Työskentelen mielelläni lyijykynällä, hiilellä ja
                    öljyväreillä. Teen toisinaan myös digitaalista taidetta, ja
                    minua kiehtovat erityisesti animaatio sekä 3D-taide. Opin
                    nopeasti, kuuntelen tarkasti ja ammennan inspiraatiota
                    surrealismista, symbolismista, tosielämän kokemuksista ja
                    tarinoista. Pyrin aina tavoittamaan tunteen ja aidon
                    elämyksen riippumatta siitä, mitä tai ketä kuvitan.
                  </PanelParagraph>
                  <PanelParagraph>
                    Kansainvälisyys on minulle tärkeää, ja haluan löytää uusia
                    kokemuksia ja mahdollisuuksia myös Suomen rajojen
                    ulkopuolelta. Olen herkkä huomaamaan erilaisia
                    elämäntilanteita, ja haluan, että minuun on helppo ottaa
                    yhteyttä ja tilata taidetta. Seuraa minua
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
                    I’m a hardworking artist from Finland with limitless
                    imagination and drive. I’ve come a long way for this path,
                    but my hardships have just made my determination stronger.
                  </PanelParagraph>
                  <PanelParagraph>
                    I enjoy drawing with pencil, coal and using oil paints. I
                    also make some digital art at times, and have great interest
                    in animation and 3D art. I’m a great listener and learn
                    fast. I enjoy surrealism, symbolism, real life experiences
                    and stories. I want to capture the feeling and raw emotion
                    in whatever or whoever I make art of.
                  </PanelParagraph>
                  <PanelParagraph>
                    Being international is very important to me, and I’m hoping
                    to gain new experiences and opportunities outside of Finland
                    too. I’m very sensitive to different situations that people
                    might be in, and I will make it as easy as possible to
                    contact me and request artworks. Follow me on
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
            </div>
          </section>
          <section
            v-if="pageReady"
            :class="{
              'about-panel': true,
              'cv-panel': true,
              'is-visible': pageReady,
            }"
          >
            <PanelHeading
              :text="language.isEn() ? 'CV' : 'CV'"
              textAlign="center"
            />
            <div class="panel-inner-container cv-container">
              <div class="about-text-container">
                <div v-if="language.isFi()" class="cv-text">
                  <div class="cv-category-container">
                    <h3 class="cv-category-heading">Ryhmänäyttelyt</h3>
                    <div class="cv-category-entry-container">
                      <p class="cv-category-entry">
                        <span class="entry-year-span">2023</span>
                        Kouvolan Kohoa Synergiakeskus
                      </p>
                      <p class="cv-category-entry">
                        <span class="entry-year-span">2025</span> Kahvila
                        Papulaari
                      </p>
                    </div>
                  </div>
                  <div class="cv-category-container">
                    <h3 class="cv-category-heading">Yksityisnäyttelyt</h3>
                    <div class="cv-category-entry-container">
                      <p class="cv-category-entry">
                        <span class="entry-year-span">2025</span> Bar Café
                        Columbia
                      </p>
                    </div>
                  </div>
                  <div class="cv-category-container">
                    <h3 class="cv-category-heading">Tilaustyöt</h3>
                    <div class="cv-category-entry-container">
                      <p class="cv-category-entry">
                        <span class="entry-year-span">2024</span>
                        Muotokuvapiirros pariskunnasta
                      </p>
                      <p class="cv-category-entry">
                        <span class="entry-year-span">2024</span>
                        Muotokuvapiirros lemmikistä
                      </p>
                      <p class="cv-category-entry">
                        <span class="entry-year-span">2025</span> Muotokuva
                        öljyvärimaalaus äidistä
                      </p>
                    </div>
                  </div>
                  <div class="cv-category-container">
                    <h3 class="cv-category-heading">Muut osallistumiset</h3>
                    <div class="cv-category-entry-container">
                      <p class="cv-category-entry">
                        <span class="entry-year-span">2024</span> Akryylimaalaus
                        KooKoon logosta yrittäjän tilaan.
                      </p>
                      <p class="cv-category-entry">
                        <span class="entry-year-span">2025</span> Olen ottanut
                        osaa MHAW mielipolun 2025 yhteishyvän projektiin
                        kahdella digitaalisella teoksella. Teoksia käytettiin
                        Kouvolan Ratamon lääkärikeskuksen metsäpolulla
                        potilaiden, sekä muiden hyväksi.
                      </p>
                    </div>
                  </div>
                </div>
                <div v-else class="cv-text">
                  <div class="cv-category-container">
                    <h3 class="cv-category-heading">Group Exhibitions</h3>
                    <div class="cv-category-entry-container">
                      <p class="cv-category-entry">
                        <span class="entry-year-span">2023</span>
                        Kouvola Kohoa Synergy Center
                      </p>
                      <p class="cv-category-entry">
                        <span class="entry-year-span">2025</span> Café Papulaari
                      </p>
                    </div>
                  </div>
                  <div class="cv-category-container">
                    <h3 class="cv-category-heading">Solo Exhibitions</h3>
                    <div class="cv-category-entry-container">
                      <p class="cv-category-entry">
                        <span class="entry-year-span">2025</span> Bar Café
                        Columbia
                      </p>
                    </div>
                  </div>
                  <div class="cv-category-container">
                    <h3 class="cv-category-heading">Commissioned Works</h3>
                    <div class="cv-category-entry-container">
                      <p class="cv-category-entry">
                        <span class="entry-year-span">2024</span>
                        Portrait drawing of a couple
                      </p>
                      <p class="cv-category-entry">
                        <span class="entry-year-span">2024</span>
                        Pet portrait drawing
                      </p>
                      <p class="cv-category-entry">
                        <span class="entry-year-span">2025</span> Oil portrait
                        painting of a mother
                      </p>
                    </div>
                  </div>
                  <div class="cv-category-container">
                    <h3 class="cv-category-heading">Other Participations</h3>
                    <div class="cv-category-entry-container">
                      <p class="cv-category-entry">
                        <span class="entry-year-span">2024</span> Acrylic
                        painting of the KooKoo logo for a business space.
                      </p>
                      <p class="cv-category-entry">
                        <span class="entry-year-span">2025</span> Participated
                        in the MHAW Mielipolku 2025 community project with two
                        digital artworks. The works were displayed along the
                        forest path at Kouvola Ratamo Medical Center, created
                        for the benefit of patients and visitors alike
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </OpacityTransition>
      <Loader v-if="!pageReady" />
    </main>
    <Footer position="static" />
  </div>
</template>

<style scoped>
.about-outer-container {
  display: flex;
  flex-direction: column;
}
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4rem;
  padding: 2rem 1rem;
  min-height: calc(100vh - 10rem);
  min-height: calc(100dvh - 10rem);
  opacity: 0;
  transition-property: opacity;
  transition-duration: 600ms;
  transition-timing-function: ease;
}

.cv-panel {
  gap: 6.4rem;
  padding: 8rem 1rem;
}

.about-panel.is-visible {
  opacity: 1;
}

.panel-inner-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 4rem;
}

.panel-inner-container.cv-container {
  max-width: 1112px;
  width: 100%;
  align-items: start;
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

.cv-img {
  max-width: 24rem;
  width: 100%;
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

.cv-text {
  display: flex;
  flex-direction: column;
  max-width: 800px;
  gap: 3.2rem;
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

.cv-category-heading {
  color: #b4936f;
  font-weight: 700;
}

.cv-category-container {
  display: flex;
  flex-direction: column;
  gap: 0.64rem;
}

.cv-category-entry-container {
  display: flex;
  flex-direction: column;
  gap: 0.32rem;
}

.cv-category-entry {
  color: #d0bfad;
  line-height: 1.7;
  letter-spacing: 2px;
  font-family: sans-serif;
  font-size: 0.8rem;
}

.entry-year-span {
  all: inherit;
  display: inline;
  font-weight: 700;
}

@media (min-width: 600px) {
  .cv-panel {
    gap: 7.2rem;
  }

  .cv-text {
    gap: 3.6rem;
  }

  .cv-category-entry {
    font-size: 0.9rem;
  }

  .cv-category-container {
    display: flex;
    flex-direction: column;
    gap: 0.72rem;
  }

  .cv-category-entry-container {
    display: flex;
    flex-direction: column;
    gap: 0.36rem;
  }
}

@media (min-width: 900px) {
  .cv-panel {
    gap: 8rem;
  }

  .panel-inner-container,
  .panel-inner-container.cv-container {
    flex-direction: row;
  }

  .panel-inner-container.cv-container {
    flex-direction: column;
  }

  .cv-category-entry {
    font-size: 1rem;
  }

  .cv-text {
    gap: 4rem;
  }

  .cv-category-container {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  .cv-category-entry-container {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
}

@media (min-width: 1200px) {
  .panel-inner-container {
    gap: 8rem;
  }
}
</style>
