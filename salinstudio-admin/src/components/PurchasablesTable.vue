<script setup lang="ts">
import {
  Button,
  DataTable,
  IconField,
  InputText,
  InputIcon,
  Column,
  Select,
  Image,
} from "primevue";
import { FilterMatchMode } from "@primevue/core/api";
import { ref } from "vue";
import type { Purchasable } from "../types/data";
import type { QueryObserverResult, RefetchOptions } from "@tanstack/vue-query";

const techniqueStatus = [
  { name: "Filled", value: false },
  { name: "Empty", value: true },
];

const { data } = defineProps<{
  data?: Purchasable[];
  isFetching: boolean;
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<Purchasable[], Error>>;
}>();

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  emptyTechnique: { value: null, matchMode: FilterMatchMode.EQUALS },
});

const addCustomFields = () => {
  if (!data) return;
  return data.map((a) => ({
    ...a,
    emptyTechnique:
      a.techniqueFi.trim() === "" || a.techniqueEn.trim() === "",
  }));
};

const formatPrice = (amount: number) =>
  Intl.NumberFormat("fi-FI", { style: "currency", currency: "EUR" }).format(
    amount,
  );
</script>

<template>
  <DataTable
    class="w-full"
    v-model:filters="filters"
    :value="addCustomFields()"
    paginator
    :alwaysShowPaginator="false"
    :rows="12"
    dataKey="id"
    :loading="isFetching"
    :globalFilterFields="['titleEn', 'titleFi']"
    stripedRows
    size="small"
  >
    <template #header>
      <div class="flex flex-wrap gap-3 py-3">
        <IconField class="flex-1 min-w-48">
          <InputIcon>
            <i class="pi pi-search" />
          </InputIcon>
          <InputText
            v-model="filters['global'].value"
            placeholder="Search by title"
            class="w-full"
          />
        </IconField>
        <Select
          v-model="filters['emptyTechnique'].value"
          :options="techniqueStatus"
          optionLabel="name"
          optionValue="value"
          placeholder="Technique"
          class="min-w-40"
          showClear
        />
      </div>
    </template>

    <template #empty>
      <div class="flex justify-center py-10 text-surface-400 text-sm">
        No results found.
      </div>
    </template>

    <Column header="Image" style="width: 6rem">
      <template #body="{ data }">
        <Image v-if="data.images?.length" alt="Image" preview>
          <template #previewicon>
            <i class="pi pi-search"></i>
          </template>
          <template #image>
            <img
              :src="data.images[0].thumbUrl"
              :alt="data.titleEn"
              class="h-14 w-20 object-cover rounded"
              loading="lazy"
            />
          </template>
          <template #original="slotProps">
            <img
              :src="data.images[0].fullUrl"
              :alt="data.titleEn"
              :style="slotProps.style"
              class="max-w-5xl max-h-[90vh]"
              @click="slotProps.previewCallback()"
            />
          </template>
        </Image>
        <div
          v-else
          class="h-14 w-20 rounded bg-surface-100 dark:bg-surface-800 flex items-center justify-center"
        >
          <i class="pi pi-image text-surface-400 text-sm"></i>
        </div>
      </template>
    </Column>

    <Column header="Title">
      <template #body="{ data }">
        <div class="flex flex-col gap-0.5">
          <div class="flex items-baseline gap-2">
            <span class="text-[10px] uppercase tracking-widest text-surface-400 shrink-0">en</span>
            <span class="text-sm">{{ data.titleEn }}</span>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-[10px] uppercase tracking-widest text-surface-400 shrink-0">fi</span>
            <span class="text-sm text-surface-500">{{ data.titleFi }}</span>
          </div>
        </div>
      </template>
    </Column>

    <Column header="Dimensions" style="width: 8rem">
      <template #body="{ data }">
        <span class="text-sm tabular-nums">
          {{ data.width }} × {{ data.height }} cm
        </span>
      </template>
    </Column>

    <Column header="Stock" style="width: 5rem">
      <template #body="{ data }">
        <span
          class="text-sm tabular-nums"
          :class="data.quantity <= 1 ? 'text-primary-600 dark:text-primary-400 font-medium' : ''"
        >
          {{ data.quantity }}
        </span>
      </template>
    </Column>

    <Column header="Price" style="width: 9rem">
      <template #body="{ data }">
        <div v-if="data.isOnSale && data.currentPrice !== data.maxPrice" class="flex flex-col">
          <span class="text-xs line-through text-surface-400 tabular-nums">
            {{ formatPrice(data.maxPrice) }}
          </span>
          <span class="text-sm font-medium text-primary tabular-nums">
            {{ formatPrice(data.currentPrice) }}
          </span>
        </div>
        <span v-else class="text-sm tabular-nums">
          {{ formatPrice(data.maxPrice) }}
        </span>
      </template>
    </Column>

    <Column header="Status" style="width: 10rem">
      <template #body="{ data }">
        <div class="flex flex-wrap gap-1">
          <span :class="data.isPublic
            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/25 dark:text-primary-300'
            : 'bg-surface-200 text-surface-500 dark:bg-surface-700 dark:text-surface-400'"
            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
          >
            {{ data.isPublic ? 'Public' : 'Draft' }}
          </span>
          <span v-if="data.isOnSale"
            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-200 text-primary-800 dark:bg-primary-800/30 dark:text-primary-200"
          >
            Sale
          </span>
          <span v-if="data.isOriginal"
            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-300"
          >
            Original
          </span>
          <span v-if="data.isFramed"
            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-300"
          >
            Framed
          </span>
        </div>
      </template>
    </Column>

    <Column header="Actions" style="width: 6rem">
      <template #body="{ data }">
        <div class="flex gap-1">
          <Button
            icon="pi pi-pencil"
            text
            rounded
            severity="secondary"
            @click="() => handleEdit(data.id)"
          />
          <Button
            icon="pi pi-trash"
            text
            rounded
            severity="danger"
            @click="() => handleDelete(data.id)"
          />
        </div>
      </template>
    </Column>
  </DataTable>
</template>
