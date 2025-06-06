<script setup lang="ts">
import { ref } from "vue";
import type { Art } from "../types/data";
import {
  getRequest,
  patchRequest,
  refreshIfUnauthorized,
  showRequestError,
} from "../utils/requests";
import { useQuery } from "@tanstack/vue-query";
import Button from "primevue/button";
import LoadingPanel from "../components/LoadingPanel.vue";
import Reorder from "../components/Reorder.vue";
import { useToast } from "primevue";

enum Stage {
  Preview,
  Reorder,
  Submitting,
}

const activeCategory = ref<string>("");
const stage = ref<Stage>(Stage.Preview);

const navButtons = [
  {
    label: "Drawings",
    value: "drawings",
  },
  {
    label: "Paintings",
    value: "paintings",
  },
  {
    label: "Pastels",
    value: "pastels",
  },
  {
    label: "Digital",
    value: "digital",
  },
  {
    label: "Mixed Media",
    value: "mixed-media",
  },
];

const { data, refetch } = useQuery({
  queryKey: ["allArt"],
  queryFn: async () => {
    const res = await getRequest<{ art: Art[] }>("/art");
    return res.art as Art[];
  },
});

const toast = useToast();

const getColumnArrays = (array: Art[], columnCount: number) => {
  const columnsArray: Art[][] = [];
  for (let i = 0; i < columnCount; i++) {
    columnsArray.push(array.filter((_, idx) => idx % columnCount === i));
  }
  return columnsArray;
};

const getActiveImage = () => {
  if (!data.value) return [];
  if (!activeCategory.value) {
    return data.value.filter((art) => art.category !== "mixed media");
  }
  return data.value.filter(
    (art) =>
      art.category ===
      (activeCategory.value === "mixed-media"
        ? "mixed media"
        : activeCategory.value)
  );
};

const setActiveCategory = (category: string) => {
  if (activeCategory.value === category) {
    activeCategory.value = "";
  } else {
    activeCategory.value = category;
  }
};

const setToReorder = () => {
  stage.value = Stage.Reorder;
};

const setToPreview = () => {
  stage.value = Stage.Preview;
};

const updateArtOrder = async (art: Art[]) => {
  try {
    stage.value = Stage.Submitting;
    const ids = art.map((a) => a.id).reverse();
    await refreshIfUnauthorized(async () =>
      patchRequest("/art/order/all", { ids }, { accessToken: true })
    );
    await refetch();
    toast.add({
      group: "main",
      severity: "success",
      closable: true,
      summary: "Art order has been updated",
      life: 5000,
    });
    setToPreview();
  } catch (err) {
    toast.add(showRequestError(err));
    setToPreview();
  }
};
</script>

<template>
  <LoadingPanel v-if="!data || stage === Stage.Submitting" />
  <div class="flex flex-col gap-4 w-full items-center">
    <div class="flex justify-center gap-4">
      <Button
        v-if="stage === Stage.Preview"
        label="Change order"
        @click="setToReorder"
      />
    </div>
    <Reorder
      v-if="stage === Stage.Reorder && data"
      :art="data"
      :save="updateArtOrder"
      :cancel="setToPreview"
    />
    <div
      v-if="stage === Stage.Preview"
      class="flex flex-col gap-4 w-full items-center"
    >
      <div class="flex gap-4 justify-center w-full">
        <Button
          v-for="nb in navButtons"
          :key="nb.value"
          :label="nb.label"
          :severity="activeCategory === nb.value ? 'primary' : 'secondary'"
          variant="outlined"
          @click="() => setActiveCategory(nb.value)"
        />
      </div>
      <div class="max-w-screen-lg columns-4 flex gap-4 w-full">
        <div
          :key="`column-${idx}`"
          v-for="(array, idx) in getColumnArrays(getActiveImage(), 4)"
          class="flex flex-col w-full gap-4"
        >
          <img
            v-for="art in array"
            :key="`art-${art.id}`"
            :src="art.thumbUrl"
            :alt="art.titleEn"
            class="rounded-xl"
          />
        </div>
      </div>
    </div>
  </div>
</template>
