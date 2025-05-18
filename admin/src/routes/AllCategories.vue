<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import type { AllCategoriesResponse } from "../types/requests";
import { get } from "../utils/auth";

const { data } = useQuery({
  queryKey: ["all.category"],
  queryFn: async () => {
    return await get<AllCategoriesResponse>("/genre");
  },
});
</script>

<template>
  <div v-if="data">
    <div v-if="data.genres.length === 0" class="">
      <h1>NO CATEGORIES</h1>
    </div>
    <li v-for="item in data.genres">
      <h1>{{ item.id }}</h1>
    </li>
  </div>
</template>
