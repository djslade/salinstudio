<script setup lang="ts">
import { useDragAndDrop } from "@formkit/drag-and-drop/vue";
import type { Art } from "../types/data";
import Button from "primevue/button";
import { ref } from "vue";
import ContextMenu from "primevue/contextmenu";

const { art } = defineProps<{
  art: Art[];
  save: (art: Art[]) => Promise<void>;
  cancel: () => void;
}>();

const selectedId = ref<string>("");

const [parentRef, sortableArt] = useDragAndDrop(art);

const toTop = (id: string) => {
  sortableArt.value = [
    ...sortableArt.value.filter((art) => art.id === id),
    ...sortableArt.value.filter((art) => art.id !== id),
  ];
};

const toBottom = (id: string) => {
  sortableArt.value = [
    ...sortableArt.value.filter((art) => art.id !== id),
    ...sortableArt.value.filter((art) => art.id === id),
  ];
};

const menu = ref();
const items = ref([
  {
    label: "Move to top",
    command: () => toTop(selectedId.value),
  },
  {
    label: "Move to bottom",
    command: () => toBottom(selectedId.value),
  },
]);

const onImageRightClick = (event: MouseEvent, art: Art) => {
  selectedId.value = art.id;
  menu.value.show(event);
};
</script>

<template>
  <div class="flex flex-col gap-4 w-full items-center">
    <div class="flex justify-center gap-4">
      <Button label="Save" @click="() => save(sortableArt)" />
      <Button label="Cancel" severity="secondary" @click="cancel" />
    </div>
    <div class="w-full flex justify-center">
      <span>
        Drag and drop images to reorder and save changes when finished.
      </span>
    </div>
    <div ref="parentRef" class="max-w-screen-lg grid grid-cols-4 gap-4 w-full">
      <div class="w-full" v-for="art in sortableArt" :key="art.id">
        <img
          :src="art.thumbUrl"
          :alt="art.titleEn"
          class="rounded-xl w-full aspect-square object-cover"
          @contextmenu="(evt) => onImageRightClick(evt, art)"
        />
      </div>
      <ContextMenu ref="menu" :model="items" @hide="selectedId = ''" />
    </div>
  </div>
</template>
