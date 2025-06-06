<script setup lang="ts">
import { useDragAndDrop } from "@formkit/drag-and-drop/vue";
import type { Art } from "../types/data";
import DraggableArt from "./DraggableArt.vue";
import Button from "primevue/button";

const { art } = defineProps<{
  art: Art[];
  save: (art: Art[]) => Promise<void>;
  cancel: () => void;
}>();

const [parentRef, sortableArt] = useDragAndDrop(art);
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
      <DraggableArt
        v-for="art in sortableArt"
        :key="`art-${art.id}`"
        :art="art"
      />
    </div>
  </div>
</template>
