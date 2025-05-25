<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import {
  get,
  getErrorResponseOrThrow,
  refreshTokens,
  sendDelete,
  sendPut,
} from "../utils/auth";
import { type AllArtResponse } from "../types/requests";
import {
  Button,
  Dialog,
  DataTable,
  IconField,
  InputText,
  InputIcon,
  Column,
  Select,
  Card,
  Image,
} from "primevue";
import { ref } from "vue";
import { type Art } from "../types/data";
import { Form, type FormSubmitEvent } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import FormControl from "../components/FormControl.vue";
import { FilterMatchMode } from "@primevue/core/api";
import LoadingPanel from "../components/LoadingPanel.vue";

enum FormStep {
  Start,
  Submitting,
  End,
}

type FormValues = {
  category: string;
  titleEn: string;
  titleFi: string;
  descriptionEn: string;
  descriptionFi: string;
};

const initialFormValues = ref<FormValues>({
  category: "",
  titleEn: "",
  titleFi: "",
  descriptionEn: "",
  descriptionFi: "",
});

const formStep = ref<FormStep>(FormStep.Start);

const editVisible = ref<boolean>(false);
const deleteVisible = ref<boolean>(false);

const focusedArt = ref<Art | null>(null);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  category: { value: null, matchMode: FilterMatchMode.EQUALS },
  emptyDescription: { value: null, matchMode: FilterMatchMode.EQUALS },
});

const updateArtResolver = zodResolver(
  z.object({
    category: z.string().nonempty("This field is required"),
    titleEn: z.string().nonempty("This field is required"),
    titleFi: z.string().nonempty("This field is required"),
    descriptionEn: z.string(),
    descriptionFi: z.string(),
  })
);

const handleUpdateArt = async (evt: FormSubmitEvent, retry: boolean = true) => {
  if (!evt.valid) return;
  if (!focusedArt.value) return;
  try {
    initialFormValues.value = {
      category: evt.values.category,
      titleEn: evt.values.titleEn,
      titleFi: evt.values.titleFi,
      descriptionEn: evt.values.descriptionEn,
      descriptionFi: evt.values.descriptionFi,
    };
    formStep.value = FormStep.Submitting;
    await sendPut(
      `/art/${focusedArt.value.id}`,
      {
        category: evt.values.category,
        titleEn: evt.values.titleEn,
        titleFi: evt.values.titleFi,
        descriptionEn: evt.values.descriptionEn,
        descriptionFi: evt.values.descriptionFi,
      },
      { accessToken: true }
    );
    formStep.value = FormStep.End;
  } catch (err) {
    const res = getErrorResponseOrThrow(err);
    if (res.statusCode === 401 && retry) {
      await refreshTokens();
      handleUpdateArt(evt, false);
    } else {
      formStep.value = FormStep.Start;
    }
  }
};

const { data, isFetching, refetch } = useQuery({
  queryKey: ["allArt"],
  queryFn: async () => {
    const res = await get<AllArtResponse>("/art");
    return res.art;
  },
});

const addCustomFields = (art?: Art[]) => {
  if (!art) return;
  return art.map((a) => {
    return {
      ...a,
      emptyDescription:
        a.descriptionFi.trim() === "" || a.descriptionEn.trim() === "",
    };
  });
};

const setFocusedArt = (id: string) => {
  const art = data.value?.filter((a) => a.id === id)[0];
  if (!art) return;
  focusedArt.value = art;
};

const setInitialFormValues = (id: string) => {
  const art = data.value?.filter((a) => a.id === id)[0];
  if (!art) return;
  initialFormValues.value = {
    category: art.category,
    titleEn: art.titleEn,
    titleFi: art.titleFi,
    descriptionEn: art.descriptionEn,
    descriptionFi: art.descriptionFi,
  };
};

const handleEdit = (id: string) => {
  setFocusedArt(id);
  setInitialFormValues(id);
  formStep.value = FormStep.Start;
  editVisible.value = true;
};

const handleDelete = (id: string) => {
  setFocusedArt(id);
  formStep.value = FormStep.Start;
  deleteVisible.value = true;
};

const closeEditDialog = async () => {
  editVisible.value = false;
  await refetch();
};

const closeDeleteDialog = async () => {
  deleteVisible.value = false;
  await refetch();
};

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

const deleteArt = async (retry: boolean = true) => {
  if (!focusedArt.value) return;
  try {
    formStep.value = FormStep.Submitting;
    await sendDelete(`/art/${focusedArt.value.id}`, {
      accessToken: true,
    });
    formStep.value = FormStep.End;
  } catch (err) {
    const res = getErrorResponseOrThrow(err);
    if (res.statusCode === 401 && retry) {
      await refreshTokens();
      deleteArt(false);
    } else {
      formStep.value = FormStep.Start;
    }
  }
};
</script>

<template>
  <div class="flex flex-col gap-6 w-full">
    <h1 class="font-bold text-2xl">Published art</h1>
    <DataTable
      class="w-full"
      v-model:filters="filters"
      :value="addCustomFields(data)"
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
  </div>
  <Dialog
    v-model:visible="editVisible"
    modal
    header="Edit art"
    class="transition-all max-w-screen-sm w-full"
  >
    <LoadingPanel v-if="formStep === FormStep.Submitting" />
    <div
      v-if="formStep === FormStep.End"
      class="w-full flex justify-center items-center"
    >
      <Card class="max-w-screen-sm w-full">
        <template #content>
          <div class="flex justify-center items-center flex-col gap-6">
            <div class="flex flex-col gap-3 items-center">
              <i
                class="pi pi-check text-emerald-500 w-fit"
                style="
                  font-size: 2rem;
                  font-weight: 700;
                  border: 2px solid;
                  border-radius: 50%;
                  padding: 1rem;
                "
              />
              <span class="text-lg">Update successful</span>
            </div>
            <div class="flex w-full justify-center gap-3">
              <Button
                label="Close"
                class="w-full max-w-xs"
                severity="secondary"
                @click="closeEditDialog"
              />
            </div>
          </div>
        </template>
      </Card>
    </div>
    <Form
      v-if="formStep === FormStep.Start"
      class="flex flex-col gap-5"
      :initialValues="initialFormValues"
      :resolver="updateArtResolver"
      @submit="handleUpdateArt"
    >
      <div class="gap-5 flex flex-col py-5">
        <FormControl name="category" type="select" label="Category" fluid />
        <div class="flex w-full gap-3">
          <FormControl
            name="titleEn"
            type="text"
            label="Title (English)"
            fluid
          />
          <FormControl
            name="titleFi"
            type="text"
            label="Title (Finnish)"
            fluid
          />
        </div>
        <FormControl
          name="descriptionEn"
          type="textarea"
          label="Description (English)"
          fluid
        />
        <FormControl
          name="descriptionFi"
          type="textarea"
          label="Description (Finnish)"
          fluid
        />
      </div>
      <Button label="Save" type="submit" />
    </Form>
  </Dialog>
  <Dialog v-model:visible="deleteVisible" modal header="Delete art">
    <LoadingPanel v-if="formStep === FormStep.Submitting" />
    <div
      v-if="formStep === FormStep.End"
      class="w-full flex justify-center items-center"
    >
      <Card class="max-w-screen-sm w-full">
        <template #content>
          <div class="flex justify-center items-center flex-col gap-6">
            <div class="flex flex-col gap-3 items-center">
              <i
                class="pi pi-check text-emerald-500 w-fit"
                style="
                  font-size: 2rem;
                  font-weight: 700;
                  border: 2px solid;
                  border-radius: 50%;
                  padding: 1rem;
                "
              />
              <span class="text-lg">Successfully deleted art.</span>
            </div>
            <div class="flex w-full justify-center gap-3">
              <Button
                label="Close"
                class="w-full max-w-xs"
                severity="secondary"
                @click="closeDeleteDialog"
              />
            </div>
          </div>
        </template>
      </Card>
    </div>
    <div v-if="formStep === FormStep.Start" class="flex flex-col w-full gap-6">
      <div class="w-full">
        <img
          :src="focusedArt?.thumbUrl"
          :alt="focusedArt?.titleEn"
          class="w-full rounded-lg"
        />
      </div>
      <span>Are you sure you want to delete this piece?</span>
      <div class="flex gap-3">
        <Button
          severity="secondary"
          fluid
          @click="() => (deleteVisible = false)"
          >Cancel</Button
        >
        <Button severity="danger" fluid @click="() => deleteArt()"
          >Delete</Button
        >
      </div>
    </div>
  </Dialog>
</template>
