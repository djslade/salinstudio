<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { getRequest } from "../utils/requests";
import type { Art } from "../types/data";
import CarouselPreview from "../components/CarouselPreview.vue";

const { data } = useQuery({
  queryKey: ["carouselArt"],
  queryFn: async () => {
    const res = await getRequest<{ art: Art[] }>("/art/carousel");
    return res.art;
  },
});
</script>

<template>
  <div class="w-full flex flex-col gap-4">
    <div class=""></div>
    <div class="w-full h-full flex justify-center items-center">
      <CarouselPreview v-if="data" :art="data" />
    </div>
  </div>
</template>
