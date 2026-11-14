<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Button, InputNumber, InputText, useToast } from "primevue";
import type { CvCategory, CvContent } from "../types/data";
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
const showErrors = ref(false);

const categories = ref<CvCategory[]>([]);
const { isDirty, markSaved } = useUnsavedChanges(categories);

onMounted(async () => {
  try {
    const data = await getRequest<{ cv: CvContent }>("/content/cv");
    categories.value = data.cv.categories;
    markSaved();
  } catch (err) {
    toast.add(showRequestError(err));
  } finally {
    loading.value = false;
  }
});

const isBlank = (value: string) => value.trim().length === 0;

const hasErrors = computed(() =>
  categories.value.some(
    (c) =>
      isBlank(c.titleEn) ||
      isBlank(c.titleFi) ||
      c.entries.some(
        (e) => !e.year || isBlank(e.textEn) || isBlank(e.textFi),
      ),
  ),
);

const swap = <T,>(list: T[], index: number, offset: -1 | 1) => {
  const target = index + offset;
  if (target < 0 || target >= list.length) return;
  [list[index], list[target]] = [list[target], list[index]];
};

const addCategory = () => {
  categories.value.push({ titleEn: "", titleFi: "", entries: [] });
};

const removeCategory = (index: number) => {
  const c = categories.value[index];
  const label = c.titleEn || c.titleFi || "this category";
  if (!window.confirm(`Delete "${label}" and all of its entries?`)) return;
  categories.value.splice(index, 1);
};

const addEntry = (category: CvCategory) => {
  category.entries.unshift({
    year: new Date().getFullYear(),
    textEn: "",
    textFi: "",
  });
  sortEntries(category);
};

// Mirrors the server: newest year first, stable for entries of the same year.
// Run when a year is committed (on blur) so rows don't jump while typing.
const sortEntries = (category: CvCategory) => {
  category.entries.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
};

// Entries are always grouped by year, so they can only move within their
// year; that is the only ordering the sort leaves up to the user.
const canMoveEntry = (category: CvCategory, index: number, offset: -1 | 1) => {
  const neighbour = category.entries[index + offset];
  return !!neighbour && neighbour.year === category.entries[index].year;
};

const moveEntry = (category: CvCategory, index: number, offset: -1 | 1) => {
  if (!canMoveEntry(category, index, offset)) return;
  swap(category.entries, index, offset);
};

const removeEntry = (category: CvCategory, index: number) => {
  category.entries.splice(index, 1);
};

const save = async () => {
  if (hasErrors.value) {
    showErrors.value = true;
    toast.add({
      group: "main",
      severity: "error",
      summary: "Fill in every title, year and text in both languages",
      life: 5000,
    });
    return;
  }
  saving.value = true;
  try {
    const data = await refreshIfUnauthorized(
      async () =>
        await putRequest<{ cv: CvContent }>(
          "/content/cv",
          { categories: categories.value },
          { accessToken: true },
        ),
    );
    // The server sorts entries newest year first.
    categories.value = data.cv.categories;
    markSaved();
    showErrors.value = false;
    toast.add({
      group: "main",
      severity: "success",
      summary: "CV saved",
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
      <h1 class="font-bold text-2xl">CV</h1>
      <Button
        label="Save"
        icon="pi pi-check"
        :loading="saving"
        :disabled="!isDirty || loading"
        @click="save"
      />
    </div>
    <p class="text-xs text-surface-400">
      Categories appear in the order shown here. Entries are always sorted
      newest year first; use the arrows to order entries within the same year.
    </p>

    <div v-if="loading" class="text-gray-400">Loading...</div>

    <template v-else>
      <section
        v-for="(category, cIndex) in categories"
        :key="cIndex"
        class="flex flex-col gap-4 p-4 rounded-lg border border-surface-200 dark:border-surface-700"
      >
        <div class="flex items-start gap-3">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 flex-1">
            <label class="flex flex-col gap-1">
              <span class="text-xs uppercase tracking-wider text-surface-400"
                >Category (Finnish)</span
              >
              <InputText
                v-model="category.titleFi"
                fluid
                :invalid="showErrors && isBlank(category.titleFi)"
              />
            </label>
            <label class="flex flex-col gap-1">
              <span class="text-xs uppercase tracking-wider text-surface-400"
                >Category (English)</span
              >
              <InputText
                v-model="category.titleEn"
                fluid
                :invalid="showErrors && isBlank(category.titleEn)"
              />
            </label>
          </div>
          <div class="flex gap-1 pt-5">
            <Button
              icon="pi pi-arrow-up"
              severity="secondary"
              text
              size="small"
              aria-label="Move category up"
              :disabled="cIndex === 0"
              @click="swap(categories, cIndex, -1)"
            />
            <Button
              icon="pi pi-arrow-down"
              severity="secondary"
              text
              size="small"
              aria-label="Move category down"
              :disabled="cIndex === categories.length - 1"
              @click="swap(categories, cIndex, 1)"
            />
            <Button
              icon="pi pi-trash"
              severity="danger"
              text
              size="small"
              aria-label="Delete category"
              @click="removeCategory(cIndex)"
            />
          </div>
        </div>

        <div class="flex flex-col gap-2 pl-4 border-l-2 border-surface-200 dark:border-surface-700">
          <div
            v-for="(entry, eIndex) in category.entries"
            :key="eIndex"
            class="flex items-start gap-2"
          >
            <InputNumber
              v-model="entry.year"
              :use-grouping="false"
              :min="1900"
              :max="2200"
              input-class="w-20"
              aria-label="Year"
              :invalid="showErrors && !entry.year"
              @blur="sortEntries(category)"
            />
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 flex-1">
              <InputText
                v-model="entry.textFi"
                placeholder="Finnish"
                fluid
                :invalid="showErrors && isBlank(entry.textFi)"
              />
              <InputText
                v-model="entry.textEn"
                placeholder="English"
                fluid
                :invalid="showErrors && isBlank(entry.textEn)"
              />
            </div>
            <Button
              icon="pi pi-arrow-up"
              severity="secondary"
              text
              size="small"
              aria-label="Move entry up"
              v-tooltip.top="'Move up within the same year'"
              :disabled="!canMoveEntry(category, eIndex, -1)"
              @click="moveEntry(category, eIndex, -1)"
            />
            <Button
              icon="pi pi-arrow-down"
              severity="secondary"
              text
              size="small"
              aria-label="Move entry down"
              v-tooltip.top="'Move down within the same year'"
              :disabled="!canMoveEntry(category, eIndex, 1)"
              @click="moveEntry(category, eIndex, 1)"
            />
            <Button
              icon="pi pi-times"
              severity="secondary"
              text
              size="small"
              aria-label="Delete entry"
              @click="removeEntry(category, eIndex)"
            />
          </div>
          <span
            v-if="category.entries.length === 0"
            class="text-sm text-surface-500 italic"
            >No entries</span
          >
          <Button
            label="Add entry"
            icon="pi pi-plus"
            severity="secondary"
            text
            size="small"
            class="self-start"
            @click="addEntry(category)"
          />
        </div>
      </section>

      <Button
        label="Add category"
        icon="pi pi-plus"
        severity="secondary"
        class="self-start"
        @click="addCategory"
      />
    </template>
  </div>
</template>
