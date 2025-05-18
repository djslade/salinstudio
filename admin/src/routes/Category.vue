<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import type { GetCategoryResponse } from "../types/requests";
import { get } from "../utils/auth";
import { useRoute } from "vue-router";

const route = useRoute();
const { data } = useQuery({
  queryKey: ["category." + route.params.id],
  queryFn: async () => {
    return await get<GetCategoryResponse>(`/genre/${route.params.id}`);
  },
});
</script>

<template>
  <div v-if="data">
    <h1>{{ data.genre.nameFi }}</h1>
  </div>
</template>
