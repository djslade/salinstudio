<script setup lang="ts">
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
</script>

<template>
  <div class="">
    <Header
      position="sticky"
      heading="Commissions"
      current-route="Commissions"
    />
    <main>
      <section class="comm-closed-panel">
        <h1 class="comm-closed-title">Commissions are closed</h1>
        <p class="comm-closed-text">
          Thank you for your interest, but I am not currently accepting
          commission requests.
        </p>
        <p class="comm-closed-text">
          Please follow me on Instagram to keep up to date.
        </p>
      </section>
    </main>
    <Footer position="static" />
  </div>
</template>

<style scoped>
.comm-closed-panel {
  width: 100%;
  height: calc(100vh - 10rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.2rem;
}

.comm-closed-title {
  font-size: 2.4rem;
  color: #b4936f;
  text-transform: uppercase;
  letter-spacing: 5px;
}

.comm-closed-text {
  color: #d0bfad;
  line-height: 1.7;
  letter-spacing: 3px;
}
</style>
