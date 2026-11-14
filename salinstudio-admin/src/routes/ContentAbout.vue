<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Button, Textarea, useToast } from "primevue";
import type { AboutContent, AboutParagraph } from "../types/data";
import {
  getRequest,
  putRequest,
  refreshIfUnauthorized,
  showRequestError,
} from "../utils/requests";
import { useUnsavedChanges } from "../hooks/useUnsavedChanges";

const toast = useToast();
const loading = ref(true);
const saving = ref(false);

const paragraphs = ref<AboutParagraph[]>([]);
const { isDirty, markSaved } = useUnsavedChanges(paragraphs);

onMounted(async () => {
  try {
    const data = await getRequest<{ about: AboutContent }>("/content/about");
    paragraphs.value = data.about.paragraphs;
    markSaved();
  } catch (err) {
    toast.add(showRequestError(err));
  } finally {
    loading.value = false;
  }
});

const addParagraph = () => {
  paragraphs.value.push({ en: "", fi: "" });
};

const removeParagraph = (index: number) => {
  const p = paragraphs.value[index];
  if ((p.en || p.fi) && !window.confirm("Delete this paragraph?")) return;
  paragraphs.value.splice(index, 1);
};

const move = (index: number, offset: -1 | 1) => {
  const target = index + offset;
  if (target < 0 || target >= paragraphs.value.length) return;
  const list = paragraphs.value;
  [list[index], list[target]] = [list[target], list[index]];
};

const save = async () => {
  saving.value = true;
  try {
    const data = await refreshIfUnauthorized(
      async () =>
        await putRequest<{ about: AboutContent }>(
          "/content/about",
          { paragraphs: paragraphs.value },
          { accessToken: true },
        ),
    );
    // The server trims text and drops empty paragraphs.
    paragraphs.value = data.about.paragraphs;
    markSaved();
    toast.add({
      group: "main",
      severity: "success",
      summary: "About section saved",
      life: 3000,
    });
  } catch (err) {
    toast.add(showRequestError(err));
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col gap-6 w-full max-w-5xl">
    <div class="flex items-center justify-between gap-4">
      <h1 class="font-bold text-2xl">About</h1>
      <Button
        label="Save"
        icon="pi pi-check"
        :loading="saving"
        :disabled="!isDirty || loading"
        @click="save"
      />
    </div>
    <p class="text-xs text-surface-400">
      Each paragraph has a Finnish and an English version. To add a link, write
      <code>[link text](https://example.com)</code>.
    </p>

    <div v-if="loading" class="text-gray-400">Loading...</div>

    <template v-else>
      <div
        v-for="(paragraph, index) in paragraphs"
        :key="index"
        class="flex flex-col gap-3 p-4 rounded-lg border border-surface-200 dark:border-surface-700"
      >
        <div class="flex items-center justify-between">
          <span class="text-sm font-semibold text-surface-500">
            Paragraph {{ index + 1 }}
          </span>
          <div class="flex gap-1">
            <Button
              icon="pi pi-arrow-up"
              severity="secondary"
              text
              size="small"
              aria-label="Move up"
              :disabled="index === 0"
              @click="move(index, -1)"
            />
            <Button
              icon="pi pi-arrow-down"
              severity="secondary"
              text
              size="small"
              aria-label="Move down"
              :disabled="index === paragraphs.length - 1"
              @click="move(index, 1)"
            />
            <Button
              icon="pi pi-trash"
              severity="danger"
              text
              size="small"
              aria-label="Delete paragraph"
              @click="removeParagraph(index)"
            />
          </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <label class="flex flex-col gap-1">
            <span class="text-xs uppercase tracking-wider text-surface-400"
              >Finnish</span
            >
            <Textarea v-model="paragraph.fi" auto-resize :rows="4" fluid />
          </label>
          <label class="flex flex-col gap-1">
            <span class="text-xs uppercase tracking-wider text-surface-400"
              >English</span
            >
            <Textarea v-model="paragraph.en" auto-resize :rows="4" fluid />
          </label>
        </div>
      </div>

      <Button
        label="Add paragraph"
        icon="pi pi-plus"
        severity="secondary"
        class="self-start"
        @click="addParagraph"
      />
    </template>
  </div>
</template>
