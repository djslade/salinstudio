<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import type { AllArtResponse } from "../types/requests";
import { get } from "../utils/auth";
import { Button } from "primevue";

const { data } = useQuery({
  queryKey: ["all.art"],
  queryFn: async () => {
    return await get<AllArtResponse>("/art");
  },
});
</script>

<template>
  <div class="h-screen flex flex-col">
    <div class="w-full h-20 p-3 mt-[1px]">
      <nav
        class="w-full h-full text-lg font-bold flex gap-3 justify-center items-center"
      >
        <button>All</button>
        <button>Drawings</button>
        <button>Paintings</button>
        <button>Pastels</button>
        <button>Digital</button>
        <button>Mixed Media</button>
      </nav>
    </div>
    <div
      v-if="data?.art.length === 0"
      class="w-full flex justify-center h-full items-center"
    >
      <div class="text-center">
        <h2 class="font-bold text-2xl mb-3">
          You haven't uploaded any art yet
        </h2>
        <Button class="w-40">Add Art</Button>
      </div>
    </div>
  </div>
</template>
