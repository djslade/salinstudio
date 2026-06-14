<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { onMounted } from "vue";

const router = useRouter();
const route = useRoute();

onMounted(() => {
  router.replace({ name: "Store", params: { locale: route.params.locale } });
});
</script>

<template>
  <div />
</template>
