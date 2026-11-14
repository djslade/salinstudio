<script setup lang="ts">
import Button from "primevue/button";
import { ref } from "vue";

export type OrderItem = { id: string; url: string };

// Ordered list of images; the first one is the lead image of the artwork.
const items = defineModel<OrderItem[]>({ required: true });
const {
  disabled = false,
  leadLabel = "Lead",
  removeLabel = "Remove image",
} = defineProps<{
  disabled?: boolean;
  // Badge on the first item; pass an empty string to hide it.
  leadLabel?: string;
  removeLabel?: string;
}>();
const emit = defineEmits<{ remove: [id: string] }>();

const dragIndex = ref<number | null>(null);
const overIndex = ref<number | null>(null);

const move = (from: number, to: number) => {
  if (disabled) return;
  if (from === to || to < 0 || to >= items.value.length) return;
  const next = [...items.value];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  items.value = next;
};

const onDragStart = (evt: DragEvent, index: number) => {
  dragIndex.value = index;
  if (evt.dataTransfer) evt.dataTransfer.effectAllowed = "move";
};

const onDrop = (index: number) => {
  if (dragIndex.value !== null) move(dragIndex.value, index);
  resetDrag();
};

const resetDrag = () => {
  dragIndex.value = null;
  overIndex.value = null;
};
</script>

<template>
  <ol class="grid grid-cols-[repeat(auto-fill,minmax(6.5rem,1fr))] gap-2">
    <li
      v-for="(item, index) in items"
      :key="item.id"
      :draggable="!disabled"
      class="flex flex-col gap-1 rounded-md border p-1 transition-colors"
      :class="[
        overIndex === index && dragIndex !== index
          ? 'border-primary'
          : 'border-surface-200 dark:border-surface-700',
        dragIndex === index ? 'opacity-50' : '',
        disabled ? '' : 'cursor-grab',
      ]"
      @dragstart="(evt) => onDragStart(evt, index)"
      @dragover.prevent="overIndex = index"
      @drop.prevent="onDrop(index)"
      @dragend="resetDrag"
    >
      <div class="relative">
        <img
          :src="item.url"
          :alt="`Image ${index + 1}`"
          class="w-full aspect-square object-cover rounded"
          draggable="false"
        />
        <span
          v-if="index === 0 && leadLabel"
          class="absolute top-1 left-1 rounded bg-primary px-1.5 py-0.5 text-xs font-semibold text-primary-contrast"
        >
          {{ leadLabel }}
        </span>
      </div>
      <div class="flex justify-between">
        <Button
          icon="pi pi-angle-left"
          text
          rounded
          size="small"
          severity="secondary"
          aria-label="Move earlier"
          :disabled="disabled || index === 0"
          @click="move(index, index - 1)"
        />
        <Button
          icon="pi pi-trash"
          text
          rounded
          size="small"
          severity="danger"
          :aria-label="removeLabel"
          :disabled="disabled"
          @click="emit('remove', item.id)"
        />
        <Button
          icon="pi pi-angle-right"
          text
          rounded
          size="small"
          severity="secondary"
          aria-label="Move later"
          :disabled="disabled || index === items.length - 1"
          @click="move(index, index + 1)"
        />
      </div>
    </li>
  </ol>
</template>
