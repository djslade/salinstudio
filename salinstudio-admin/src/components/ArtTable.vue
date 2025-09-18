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
  return data.map((a) => {
    return {
      ...a,
      emptyDescription:
        a.descriptionFi.trim() === "" || a.descriptionEn.trim() === "",
    };
  });
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
              :src="data.image.thumbUrl"
              :alt="data.titleEn"
              class="w-30 aspect-video object-cover"
            />
          </template>
          <template #original="slotProps">
            <img
              :src="data.image.fullUrl"
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
      header="Titles"
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
    <Column field="onHomeCarousel" header="Carousel">
      <template #body="{ data }">
        <ToggleSwitch
          v-model="data.onHomeCarousel"
          @change="(evt) => handleCarouselChange(evt, data)"
        />
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
