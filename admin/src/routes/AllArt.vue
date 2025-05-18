<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import type { AllArtResponse } from "../types/requests";
import { get } from "../utils/auth";

const { data } = useQuery({
  queryKey: ["all.art"],
  queryFn: async () => {
    return await get<AllArtResponse>("/art");
  },
});
</script>

<template>
  <div v-if="data">
    <div v-if="data.art.length === 0" class="">
      <h1>NO ART</h1>
    </div>
    <li v-for="item in data.art">
      <h1>{{ item.id }}</h1>
    </li>
  </div>
</template>
