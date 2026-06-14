<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import type { Art } from "../types/data";
import Button from "primevue/button";
import ContextMenu from "primevue/contextmenu";

const { art, update } = defineProps<{
  art: Art[];
  update: (art: Art, onHomeCarousel: boolean) => Promise<void>;
}>();

const navButtons = [
  { label: "Drawings", value: "drawings" },
  { label: "Paintings", value: "paintings" },
  { label: "Pastels", value: "pastels" },
  { label: "Digital", value: "digital" },
  { label: "Mixed Media", value: "mixed-media" },
];

const activeCategory = ref<string>("");
const selectedArt = ref<Art | undefined>(undefined);
const menu = ref();

const items = ref([
  {
    label: "Add to carousel",
    command: () => update(selectedArt.value!, true),
  },
]);

const getColumnArrays = (array: Art[], count: number) => {
  const columns: Art[][] = Array.from({ length: count }, () => []);
  array.forEach((item, idx) => columns[idx % count].push(item));
  return columns;
};

const getActiveArt = () => {
  if (!activeCategory.value) {
    return art.filter((a) => a.category !== "mixed media");
  }
  const cat =
    activeCategory.value === "mixed-media" ? "mixed media" : activeCategory.value;
  return art.filter((a) => a.category === cat);
};

const setActiveCategory = (category: string) => {
  activeCategory.value = activeCategory.value === category ? "" : category;
};

const onImageRightClick = (event: MouseEvent, item: Art) => {
  selectedArt.value = item;
  menu.value.show(event);
};

watch(selectedArt, (item) => {
  if (!item) return;
  items.value = [
    {
      label: item.onHomeCarousel ? "Remove from carousel" : "Add to carousel",
      command: item.onHomeCarousel
        ? async () => update(item, false)
        : async () => update(item, true),
    },
  ];
});

// Responsive columns — measured from the container itself so sidebar/padding
// are automatically accounted for.
const galleryEl = ref<HTMLElement | null>(null);
const columnCount = ref(1);

const updateColumns = () => {
  if (!galleryEl.value) return;
  columnCount.value = Math.min(
    6,
    Math.max(1, Math.ceil(galleryEl.value.offsetWidth / 360)),
  );
};

let observer: ResizeObserver | null = null;

onMounted(() => {
  if (!galleryEl.value) return;
  updateColumns();
  observer = new ResizeObserver(updateColumns);
  observer.observe(galleryEl.value);
});

onUnmounted(() => observer?.disconnect());
</script>

<template>
  <div class="flex flex-col gap-4 w-full">
    <div class="flex flex-wrap gap-2">
      <Button
        v-for="nb in navButtons"
        :key="nb.value"
        :label="nb.label"
        :severity="activeCategory === nb.value ? 'primary' : 'secondary'"
        variant="outlined"
        size="small"
        @click="() => setActiveCategory(nb.value)"
      />
    </div>

    <div ref="galleryEl" class="flex gap-1 w-full">
      <div
        v-for="(column, idx) in getColumnArrays(getActiveArt(), columnCount)"
        :key="`col-${idx}`"
        class="flex flex-col gap-1 w-full"
      >
        <img
          v-for="item in column"
          :key="item.id"
          :src="item.image.thumbUrl"
          :alt="item.titleEn"
          class="w-full rounded"
          loading="lazy"
          @contextmenu="(evt) => onImageRightClick(evt, item)"
        />
      </div>
    </div>

    <ContextMenu ref="menu" :model="items" @hide="selectedArt = undefined" />
  </div>
</template>
