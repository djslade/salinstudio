<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { get } from "../utils/auth";
import { type AllArtResponse } from "../types/requests";
import { DataView, Button } from "primevue";

const { data, isFetching } = useQuery({
  queryKey: ["allArt"],
  queryFn: async () => {
    const res = await get<AllArtResponse>("/art");
    return res.art;
  },
});
</script>

<template>
  <DataView :value="data" class="w-full max-w-screen-sm">
    <template #header>
      <h1 class="font-bold text-2xl">Published art</h1>
    </template>
    <template #list="slotProps">
      <div v-if="isFetching" class="">
        <span>Loading</span>
      </div>
      <div v-else class="flex flex-col gap-3">
        <div
          v-for="(item, index) in slotProps.items"
          :key="index"
          class="w-full"
        >
          <div class="flex px-6 py-3 gap-6 rounded-lg shadow-lg">
            <div class="w-full max-w-40">
              <img
                class="rounded w-full h-full object-cover max-h-30"
                :src="item.thumbUrl"
                :alt="item.titleEn"
              />
            </div>
            <div class="w-full flex flex-col gap-3">
              <span class="font-medium text-surface-500 text-sm capitalize">
                {{ item.category }}
              </span>
              <span class="font-bold text-surface-100 text-xl"
                >{{ item.titleEn }} / {{ item.titleFi }}</span
              >
            </div>
            <div class="flex flex-col gap-3 justify-center">
              <Button icon="pi pi-pencil" outlined></Button>
              <Button icon="pi pi-trash" outlined></Button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </DataView>
</template>
