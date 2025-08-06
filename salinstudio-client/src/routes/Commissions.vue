<script setup lang="ts">
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
</script>

<template>
  <div class="">
    <Header position="sticky" heading="Commissions" />
    <main>
      <section class="comm-closed-panel">
        <h1>Commissions are closed</h1>
        <p></p>
      </section>
    </main>
    <Footer position="static" />
  </div>
</template>

<style scoped>
.comm-closed-panel {
  width: 100%;
  height: calc(100vh - 10rem);
}
</style>
