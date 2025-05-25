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
import type { Art } from "../types/data";

const categories = [
  {
    name: "Drawings",
    value: "drawings",
  },
  {
    name: "Paintings",
    value: "paintings",
  },
  {
    name: "Pastels",
    value: "pastels",
  },
  {
    name: "Digital",
    value: "digital",
  },
  {
    name: "Mixed Media",
    value: "mixed media",
  },
];

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
  data?: Art[];
  isFetching: boolean;
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
}>();

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  category: { value: null, matchMode: FilterMatchMode.EQUALS },
  emptyDescription: { value: null, matchMode: FilterMatchMode.EQUALS },
});

const addCustomFields = () => {
  if (!data) return;
  return data.map((a) => {
    return {
      ...a,
      emptyDescription:
        a.descriptionFi.trim() === "" || a.descriptionEn.trim() === "",
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
            v-model="filters['category'].value"
            :options="categories"
            optionLabel="name"
            optionValue="value"
            placeholder="Filter category"
            class="max-w-xs w-full"
            showClear
          >
          </Select>
          <Select
            v-model="filters['emptyDescription'].value"
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
      header="Image"
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
              :src="data.thumbUrl"
              :alt="data.titleEn"
              class="w-30 aspect-video object-cover"
            />
          </template>
          <template #original="slotProps">
            <img
              :src="data.fullUrl"
              :alt="data.titleEn"
              :style="slotProps.style"
              class="max-w-screen-lg max-h-[90vh]"
              @click="slotProps.previewCallback()"
            />
          </template>
        </Image>
      </template>
    </Column>
    <Column
      field="category"
      header="Category"
      :showFilterMatchModes="false"
      :showFilterMenu="false"
    >
      <template #body="{ data }">
        <div class="capitalize">
          {{ data.category }}
        </div>
      </template>
    </Column>
    <Column
      field="titleEn"
      header="Title (English)"
      :showFilterMatchModes="false"
      :showFilterMenu="false"
    >
      <template #body="{ data }">
        {{ data.titleEn }}
      </template>
    </Column>
    <Column
      field="titleFi"
      header="Title (Finnish)"
      :showFilterMatchModes="false"
      :showFilterMenu="false"
    >
      <template #body="{ data }">
        {{ data.titleFi }}
      </template>
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
