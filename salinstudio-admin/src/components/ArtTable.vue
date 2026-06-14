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
  ToggleSwitch,
  useToast,
} from "primevue";
import { FilterMatchMode } from "@primevue/core/api";
import { ref } from "vue";
import type { Art } from "../types/data";
import {
  putRequest,
  refreshIfUnauthorized,
  showRequestError,
} from "../utils/requests";
import type { QueryObserverResult, RefetchOptions } from "@tanstack/vue-query";

const categories = [
  { name: "Drawings", value: "drawings" },
  { name: "Paintings", value: "paintings" },
  { name: "Pastels", value: "pastels" },
  { name: "Digital", value: "digital" },
  { name: "Mixed Media", value: "mixed media" },
];

const descriptionStatus = [
  { name: "Filled", value: false },
  { name: "Empty", value: true },
];

const { data, refetch } = defineProps<{
  data?: Art[];
  isFetching: boolean;
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<Art[], Error>>;
}>();

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  category: { value: null, matchMode: FilterMatchMode.EQUALS },
  emptyDescription: { value: null, matchMode: FilterMatchMode.EQUALS },
});

const savingCarouselStatus = ref<boolean>(false);

const toast = useToast();

const addCustomFields = () => {
  if (!data) return;
  return data.map((a) => ({
    ...a,
    emptyDescription:
      a.descriptionFi.trim() === "" || a.descriptionEn.trim() === "",
  }));
};

const handleCarouselChange = async (_: Event, art: Art) => {
  if (savingCarouselStatus.value) return;
  try {
    savingCarouselStatus.value = true;
    await refreshIfUnauthorized(
      async () =>
        await putRequest(
          `/art/${art.id}`,
          {
            category: art.category,
            titleEn: art.titleEn,
            titleFi: art.titleFi,
            descriptionEn: art.descriptionEn,
            descriptionFi: art.descriptionFi,
            onHomeCarousel: art.onHomeCarousel,
            collections: art.collections?.map((col) => col.id) || [],
          },
          { accessToken: true }
        )
    );
    await refetch();
    toast.add({
      group: "main",
      severity: "success",
      closable: true,
      summary: "Home carousel has been updated",
      life: 5000,
    });
  } catch (err) {
    toast.add(showRequestError(err));
  } finally {
    savingCarouselStatus.value = false;
  }
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
          v-model="filters['category'].value"
          :options="categories"
          optionLabel="name"
          optionValue="value"
          placeholder="All categories"
          class="min-w-44"
          showClear
        />
        <Select
          v-model="filters['emptyDescription'].value"
          :options="descriptionStatus"
          optionLabel="name"
          optionValue="value"
          placeholder="Description"
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
        <Image alt="Image" preview>
          <template #previewicon>
            <i class="pi pi-search"></i>
          </template>
          <template #image>
            <img
              :src="data.image.thumbUrl"
              :alt="data.titleEn"
              class="h-14 w-20 object-cover rounded"
              loading="lazy"
            />
          </template>
          <template #original="slotProps">
            <img
              :src="data.image.fullUrl"
              :alt="data.titleEn"
              :style="slotProps.style"
              class="max-w-5xl max-h-[90vh]"
              @click="slotProps.previewCallback()"
            />
          </template>
        </Image>
      </template>
    </Column>

    <Column header="Category" style="width: 8rem">
      <template #body="{ data }">
        <span class="capitalize text-sm">{{ data.category }}</span>
      </template>
    </Column>

    <Column header="Titles">
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

    <Column header="Carousel" style="width: 6rem">
      <template #body="{ data }">
        <ToggleSwitch
          v-model="data.onHomeCarousel"
          @change="(evt) => handleCarouselChange(evt, data)"
        />
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
