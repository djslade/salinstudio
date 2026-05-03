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

const descriptionStatus = [
  {
    name: "Filled",
    value: false,
  },
  {
    name: "Empty",
    value: true,
  },
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
  category: { value: null, matchMode: FilterMatchMode.EQUALS },
  emptyTechnique: { value: null, matchMode: FilterMatchMode.EQUALS },
});

const addCustomFields = () => {
  if (!data) return;
  return data.map((a) => {
    return {
      ...a,
      emptyTechnique:
        a.techniqueFi.trim() === "" || a.techniqueEn.trim() === "",
    };
  });
};
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
  >
    <template #header>
      <div class="flex flex-col w-full">
        <div class="flex pt-6 gap-6 justify-between">
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText
              v-model="filters['global'].value"
              placeholder="Search by title"
            />
          </IconField>
          <Select
            v-model="filters['emptyTechnique'].value"
            :options="descriptionStatus"
            optionLabel="name"
            optionValue="value"
            placeholder="Description status"
            class="max-w-xs w-full"
            showClear
          >
          </Select>
        </div>
      </div>
    </template>
    <template #empty>
      <div class="w-full flex justify-center p-6">No results found.</div>
    </template>
    <Column
      field="thumbUrl"
      header="Art image"
      :showFilterMatchModes="false"
      :showFilterMenu="false"
    >
      <template #body="{ data }">
        <Image alt="Image" preview>
          <template #previewicon>
            <i class="pi pi-search"></i>
          </template>
          <template #image>
            <img
              :src="data.images[0].thumbUrl"
              :alt="data.titleEn"
              class="w-30 aspect-video object-cover"
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
      </template>
    </Column>
    <Column
      field="titleEn"
      header="Title"
      :showFilterMatchModes="false"
      :showFilterMenu="false"
    >
      <template #body="{ data }">
        <div class="flex gap-4 items-center">
          <span class="uppercase tracking-wide text-xs">en</span>
          {{ data.titleEn }}
        </div>
        <div class="flex gap-4 items-center">
          <span class="uppercase tracking-wide text-xs">fi</span>
          {{ data.titleFi }}
        </div>
      </template>
    </Column>
    <Column
      field="height"
      header="Height"
      :showFilterMatchModes="false"
      :showFilterMenu="false"
    >
      <template #body="{ data }"> {{ data.height }}cm </template>
    </Column>
    <Column
      field="width"
      header="Width"
      :showFilterMatchModes="false"
      :showFilterMenu="false"
    >
      <template #body="{ data }"> {{ data.width }}cm </template>
    </Column>
    <Column
      field="quantity"
      header="Stock"
      :showFilterMatchModes="false"
      :showFilterMenu="false"
    >
      <template #body="{ data }"> {{ data.quantity }}</template>
    </Column>
    <Column
      field="maxPrice"
      header="Price"
      :showFilterMatchModes="false"
      :showFilterMenu="false"
    >
      <template #body="{ data }">
        {{
          Intl.NumberFormat("fi-FI", {
            style: "currency",
            currency: "EUR",
          }).format(data.maxPrice)
        }}</template
      >
    </Column>
    <Column
      field="currentPrice"
      header="Discounted price"
      :showFilterMatchModes="false"
      :showFilterMenu="false"
    >
      <template #body="{ data }">
        {{
          data.maxPrice === data.currentPrice
            ? "Not discounted"
            : Intl.NumberFormat("fi-FI", {
                style: "currency",
                currency: "EUR",
              }).format(data.maxPrice / 100)
        }}</template
      >
    </Column>
    <Column
      field="year"
      header="Year"
      :showFilterMatchModes="false"
      :showFilterMenu="false"
    >
      <template #body="{ data }"> {{ data.year }}</template>
    </Column>
    <Column
      field="isPublic"
      header="Public"
      :showFilterMatchModes="false"
      :showFilterMenu="false"
    >
      <template #body="{ data }"> {{ data.isPublic }}</template>
    </Column>
    <Column
      field="isFramed"
      header="Framed"
      :showFilterMatchModes="false"
      :showFilterMenu="false"
    >
      <template #body="{ data }"> {{ data.isFramed }}</template>
    </Column>
    <Column
      field="isOriginal"
      header="Original"
      :showFilterMatchModes="false"
      :showFilterMenu="false"
    >
      <template #body="{ data }"> {{ data.isOriginal }}</template>
    </Column>
    <Column field="actions" header="Actions">
      <template #body="{ data }">
        <div class="flex gap-6">
          <Button
            icon="pi pi-pencil"
            rounded
            severity="secondary"
            raised
            @click="() => handleEdit(data.id)"
          />
          <Button
            icon="pi pi-trash"
            rounded
            severity="danger"
            raised
            @click="() => handleDelete(data.id)"
          />
        </div>
      </template>
    </Column>
  </DataTable>
</template>
