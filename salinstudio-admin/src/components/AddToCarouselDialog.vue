<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Button, Dialog, InputText } from "primevue";
import type { Art } from "../types/data";

const visible = defineModel<boolean>("visible", { required: true });
// Artworks that can be added, i.e. the ones not already in the carousel draft.
const { art } = defineProps<{ art: Art[] }>();
const emit = defineEmits<{ add: [ids: string[]] }>();

const search = ref("");
const selected = ref<string[]>([]);

// Start fresh every time the dialog opens.
watch(visible, (open) => {
  if (!open) return;
  search.value = "";
  selected.value = [];
});

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return art;
  return art.filter(
    (a) =>
      a.titleEn.toLowerCase().includes(q) ||
      a.titleFi.toLowerCase().includes(q),
  );
});

const toggle = (id: string) => {
  selected.value = selected.value.includes(id)
    ? selected.value.filter((s) => s !== id)
    : [...selected.value, id];
};

const confirm = () => {
  // Keep the order the artworks were picked in.
  emit("add", selected.value);
  visible.value = false;
};
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Add artwork to carousel"
    class="w-full max-w-4xl mx-4"
  >
    <div class="flex flex-col gap-4">
      <InputText
        v-model="search"
        placeholder="Search by title"
        class="w-full"
        autofocus
      />
      <p v-if="art.length === 0" class="text-sm text-surface-500">
        All artworks are already in the carousel.
      </p>
      <p v-else-if="filtered.length === 0" class="text-sm text-surface-500">
        No artworks match "{{ search }}".
      </p>
      <ul
        v-else
        class="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-2 max-h-[60vh] overflow-y-auto p-1"
      >
        <li v-for="a in filtered" :key="a.id">
          <button
            type="button"
            class="relative w-full flex flex-col gap-1 rounded-md border-2 p-1 text-left transition-colors cursor-pointer"
            :class="
              selected.includes(a.id)
                ? 'border-primary'
                : 'border-transparent hover:border-surface-300 dark:hover:border-surface-600'
            "
            :aria-pressed="selected.includes(a.id)"
            @click="toggle(a.id)"
          >
            <img
              :src="a.image.thumbUrl"
              :alt="a.titleEn"
              class="w-full aspect-square object-cover rounded"
              loading="lazy"
              draggable="false"
            />
            <span class="text-xs truncate">{{ a.titleEn }}</span>
            <span
              v-if="selected.includes(a.id)"
              class="absolute top-2 right-2 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-contrast"
            >
              <i class="pi pi-check text-xs" />
            </span>
          </button>
        </li>
      </ul>
    </div>
    <template #footer>
      <Button label="Cancel" severity="secondary" @click="visible = false" />
      <Button
        :label="selected.length ? `Add ${selected.length}` : 'Add'"
        icon="pi pi-plus"
        :disabled="selected.length === 0"
        @click="confirm"
      />
    </template>
  </Dialog>
</template>
