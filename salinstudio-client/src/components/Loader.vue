<script setup lang="ts">
import { onMounted, ref } from "vue";

defineProps<{ full?: boolean }>();

const showLoader = ref<boolean>(false);

onMounted(async () => {
  window.setTimeout(() => {
    showLoader.value = true;
  }, 500);
});
</script>

<template>
  <div :class="`loader-container ${full && 'full'}`">
    <div v-if="showLoader" class="loader"></div>
  </div>
</template>

<style scoped>
.loader-container {
  height: calc(100vh - 10rem);
  height: calc(100dvh - 10rem);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.full {
  height: 100vh;
  height: 100dvh;
}

.loader {
  width: 5rem;
  padding: 8px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #b4936f;
  --_m: conic-gradient(#0000 10%, #000), linear-gradient(#000 0 0) content-box;
  -webkit-mask: var(--_m);
  mask: var(--_m);
  -webkit-mask-composite: source-out;
  mask-composite: subtract;
  animation: l3 1s infinite linear;
}
@keyframes l3 {
  to {
    transform: rotate(1turn);
  }
}
</style>
