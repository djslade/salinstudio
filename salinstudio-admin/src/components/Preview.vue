<script setup lang="ts">
import { ref, watch } from "vue";
import type { Art } from "../types/data";
import Button from "primevue/button";
import ContextMenu from "primevue/contextmenu";

const { art, update } = defineProps<{
  art: Art[];
  update: (art: Art, onHomeCarousel: boolean) => Promise<void>;
}>();

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

const activeCategory = ref<string>("");
const selectedArt = ref<Art>();

const menu = ref();
const items = ref([
  {
    label:
      selectedArt.value && selectedArt.value.onHomeCarousel
        ? "Remove from carousel"
        : "Add to carousel",
    command: () => update(selectedArt.value!, false),
  },
]);

const onImageRightClick = (event: MouseEvent, art: Art) => {
  selectedArt.value = art;
  menu.value.show(event);
};

const getColumnArrays = (array: Art[], columnCount: number) => {
  const columnsArray: Art[][] = [];
  for (let i = 0; i < columnCount; i++) {
    columnsArray.push(array.filter((_, idx) => idx % columnCount === i));
  }
  return columnsArray;
};

const getActiveImage = () => {
  if (!activeCategory.value) {
    return art.filter((a) => a.category !== "mixed media");
  }
  return art.filter(
    (a) =>
      a.category ===
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

watch(selectedArt, () => {
  if (!selectedArt.value) return;
  items.value = [
    {
      label: selectedArt.value.onHomeCarousel
        ? "Remove from carousel"
        : "Add to carousel",
      command: selectedArt.value.onHomeCarousel
        ? async () => update(selectedArt.value!, false)
        : async () => update(selectedArt.value!, true),
    },
  ];
});
</script>

<template>
  <div class="flex flex-col gap-4 w-full items-center">
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
          @contextmenu="(evt) => onImageRightClick(evt, art)"
        />
      </div>
      <ContextMenu ref="menu" :model="items" @hide="selectedArt = undefined" />
    </div>
  </div>
</template>
