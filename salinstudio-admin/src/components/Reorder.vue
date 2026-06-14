<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useDragAndDrop } from "@formkit/drag-and-drop/vue";
import type { Art } from "../types/data";
import Button from "primevue/button";
import ContextMenu from "primevue/contextmenu";

const { art } = defineProps<{
  art: Art[];
  save: (art: Art[]) => Promise<void>;
  cancel: () => void;
}>();

const [parent, sortableArt] = useDragAndDrop(art);

const containerEl = ref<HTMLElement | null>(null);

const selectedId = ref<string>("");

const toTop = (id: string) => {
  sortableArt.value = [
    ...sortableArt.value.filter((a) => a.id === id),
    ...sortableArt.value.filter((a) => a.id !== id),
  ];
};

const toBottom = (id: string) => {
  sortableArt.value = [
    ...sortableArt.value.filter((a) => a.id !== id),
    ...sortableArt.value.filter((a) => a.id === id),
  ];
};

const menu = ref();
const items = ref([
  { label: "Move to top", command: () => toTop(selectedId.value) },
  { label: "Move to bottom", command: () => toBottom(selectedId.value) },
]);

const onImageRightClick = (event: MouseEvent, item: Art) => {
  selectedId.value = item.id;
  menu.value.show(event);
};

const columnCount = ref(1);

const updateColumns = () => {
  if (!containerEl.value) return;
  columnCount.value = Math.min(
    6,
    Math.max(1, Math.ceil(containerEl.value.offsetWidth / 360)),
  );
};

let observer: ResizeObserver | null = null;

onMounted(() => {
  if (!containerEl.value) return;
  updateColumns();
  observer = new ResizeObserver(updateColumns);
  observer.observe(containerEl.value);
});

onUnmounted(() => observer?.disconnect());
</script>

<template>
  <div ref="containerEl" class="flex flex-col gap-4 w-full">
    <div class="flex gap-2">
      <Button size="small" label="Save" @click="() => save(sortableArt)" />
      <Button size="small" label="Cancel" severity="secondary" @click="cancel" />
    </div>
    <p class="text-sm text-surface-500">
      Drag and drop images to reorder, then save.
    </p>
    <div
      ref="parent"
      class="grid gap-1 w-full"
      :style="{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }"
    >
      <div
        v-for="item in sortableArt"
        :key="item.id"
        class="w-full"
      >
        <img
          :src="item.image.thumbUrl"
          :alt="item.titleEn"
          class="w-full aspect-square object-cover rounded cursor-grab"
          draggable="false"
          loading="lazy"
          @contextmenu="(evt) => onImageRightClick(evt, item)"
        />
      </div>
      <ContextMenu ref="menu" :model="items" @hide="selectedId = ''" />
    </div>
  </div>
</template>
