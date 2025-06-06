<script setup lang="ts">
import { ref } from "vue";
import type { Art } from "../types/data";
import { getRequest } from "../utils/requests";
import { useQuery } from "@tanstack/vue-query";
import Button from "primevue/button";
import LoadingPanel from "../components/LoadingPanel.vue";
import { Draggable, Container } from "vue-dndrop";

enum Stage {
  Preview,
  Reorder,
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

const applyDrag = (arr: Art[], dragResult: any) => {
  const { removedIndex, addedIndex, payload } = dragResult;
  if (removedIndex === null && addedIndex === null) return arr;

  const result = [...arr];
  let itemToAdd = payload;

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0];
  }

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd);
  }

  return result;
};

const onDrop = (dropResult: any) => {
  if (!data.value) return;
  data.value = applyDrag(data.value, dropResult);
};
</script>

<template>
  <LoadingPanel v-if="!data" />
  <div class="flex flex-col gap-4 w-full items-center">
    <div class="">
      <Button
        v-if="stage === Stage.Preview"
        label="Change order"
        @click="setToReorder"
      />
      <Button
        v-if="stage === Stage.Reorder"
        label="Save"
        @click="setToPreview"
      />
    </div>
    <div
      v-if="stage === Stage.Reorder"
      class="flex flex-col gap-4 w-full items-center"
    >
      <div class="w-full flex justify-center">
        <span>
          Drag and drop images to reorder and save changes when finished.
        </span>
      </div>
      <Container
        class="max-w-screen-lg grid grid-cols-4 gap-4 w-full"
        @drop="onDrop"
      >
        <Draggable v-for="art in data" :key="`art-${art.id}`">
          <img
            :key="`art-${art.id}`"
            :src="art.thumbUrl"
            :alt="art.titleEn"
            class="rounded-xl aspect-square w-full object-cover"
          />
        </Draggable>

        />
      </Container>
    </div>
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
