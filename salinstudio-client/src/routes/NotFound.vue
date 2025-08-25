<script setup lang="ts">
import { useLanguageStore } from "../store/language";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import IconButton from "../components/IconButton.vue";

const language = useLanguageStore();
</script>

<template>
  <div class="">
    <Header
      position="sticky"
      :heading="language.isEn() ? 'Not found' : 'ei löydy'"
    />
    <main>
      <section v-if="language.isEn()" class="comm-closed-panel">
        <div class="comm-closed-text-container">
          <div class="comm-closed-title-container">
            <h1 class="comm-closed-title">Page not found</h1>
          </div>
          <p class="comm-closed-text">
            The page you are looking for could not be found. It may have been
            moved or deleted.
          </p>
        </div>
        <IconButton
          label="Back to home"
          icon="mdi-light:arrow-up"
          :onClick="
            () =>
              $router.push({
                name: 'Home',
                params: { locale: $route.params.locale },
              })
          "
        />
      </section>
      <section v-if="language.isFi()" class="comm-closed-panel">
        <div class="comm-closed-text-container">
          <div class="comm-closed-title-container">
            <h1 class="comm-closed-title">Sivua ei löydy</h1>
          </div>
          <p class="comm-closed-text">
            Hakemaasi sivua ei löytynyt. Se on voitu siirtää tai poistaa.
          </p>
        </div>
        <IconButton
          label="Takaisin etusivulle"
          icon="mdi-light:arrow-up"
          :onClick="() => $router.push('/')"
        />
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
