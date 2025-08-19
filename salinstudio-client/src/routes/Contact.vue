<script setup lang="ts">
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
</script>

<template>
  <div class="">
    <Header heading="Contact" position="sticky" />
    <main>
      <section class="contact-panel">
        <form action="">
          <h1>Let's connect</h1>
          <p>
            I’d love to hear from you! Please use the form below to get in
            touch, and I’ll reply as soon as I can.
          </p>
          <p>If you’re interested in commissioning artwork, click here.</p>
        </form>
        <div class="">
          <label for="">Name</label>
          <input />
        </div>
        <div class="">
          <label for="">Email</label>
          <input />
        </div>
        <div class="">
          <label for="">Message</label>
          <textarea />
        </div>
      </section>
    </main>
    <Footer position="static" />
  </div>
</template>

<style scoped>
.contact-panel {
  width: 100%;
  min-height: calc(100vh - 10rem);
  min-height: calc(100dvh - 10rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
