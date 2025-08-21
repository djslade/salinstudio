<script setup lang="ts">
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import { useLanguageStore } from "../store/language";
import PanelHeading from "../components/PanelHeading.vue";
import PanelParagraph from "../components/PanelParagraph.vue";

const language = useLanguageStore();
</script>

<template>
  <div class="">
    <Header
      position="sticky"
      :heading="language.isEn() ? 'Commissions' : 'Tilaustyöt'"
      current-route="Commissions"
    />
    <main>
      <section v-if="language.isEn()" class="comm-closed-panel">
        <div class="comm-closed-title-container">
          <PanelHeading text="Commissions are closed" textAlign="center" />
        </div>
        <div class="comm-closed-text-container">
          <PanelParagraph textAlign="center">
            Thank you for your interest, but I am not currently accepting
            commission requests.
          </PanelParagraph>
          <PanelParagraph textAlign="center">
            Please follow me on
            <a
              href="https://www.instagram.com/salinmiia/"
              target="_blank"
              class="comm-closed-link"
              >Instagram</a
            >
            to find out when I become available for work.
          </PanelParagraph>
        </div>
      </section>
      <section v-if="language.isFi()" class="comm-closed-panel">
        <div class="comm-closed-title-container">
          <PanelHeading text="Tilaukset suljettu" textAlign="center" />
        </div>
        <div class="comm-closed-text-container">
          <PanelParagraph textAlign="center">
            Kiitos kiinnostuksestasi, mutta en ota tällä hetkellä tilauspyyntöjä
            vastaan.
          </PanelParagraph>
          <PanelParagraph textAlign="center">
            Seuraa minua
            <a
              href="https://www.instagram.com/salinmiia/"
              target="_blank"
              class="comm-closed-link"
              >Instagramissa</a
            >, niin voit seurata päivityksiä asiaan liittyen.
          </PanelParagraph>
        </div>
      </section>
    </main>
    <Footer position="static" />
  </div>
</template>

<style scoped>
.comm-closed-panel {
  width: 100%;
  height: calc(100vh - 10rem);
  height: calc(100dvh - 10rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  padding: 1rem;
}

.comm-closed-title-container {
  width: 100%;
  text-align: center;
  max-width: 900px;
}

.comm-closed-title {
  font-size: 2rem;
  color: #b4936f;
  text-transform: uppercase;
  letter-spacing: 5px;
}

.comm-closed-text-container {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 900px;
}

.comm-closed-text {
  color: #d0bfad;
  line-height: 1.7;
  letter-spacing: 2px;
  font-family: sans-serif;
}

.comm-closed-link {
  font-weight: bold;
  color: #d0bfad;
  transition-duration: 0.3s;
  transition-property: all;
}

.comm-closed-link:hover {
  color: #b4936f;
}

@media (min-width: 600px) {
  .comm-closed-title {
    font-size: 2.5rem;
  }
}
</style>
