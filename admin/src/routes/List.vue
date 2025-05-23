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
import { DataView, Button, Dialog, useToast, ProgressSpinner } from "primevue";
import { ref } from "vue";
import { type Art } from "../types/data";
import { Form, type FormSubmitEvent } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import FormControl from "../components/FormControl.vue";

const editVisible = ref<boolean>(false);
const deleteVisible = ref<boolean>(false);
const submitting = ref<boolean>(false);

const toast = useToast();

const focusedArt = ref<Art | null>(null);

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
  if (submitting.value) return;
  if (!focusedArt.value) return;
  try {
    submitting.value = true;
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
    editVisible.value = false;
    refetch();
    toast.add({
      group: "main",
      severity: "success",
      closable: true,
      summary: `Updated ${evt.values.nameEn}`,
    });
  } catch (err) {
    const res = getErrorResponseOrThrow(err);
    if (res.statusCode === 401 && retry) {
      await refreshTokens();
      submitting.value = false;
      handleUpdateArt(evt, false);
    } else {
      toast.add({
        group: "main",
        severity: "error",
        closable: true,
        summary: res.message,
      });
    }
  } finally {
    submitting.value = false;
  }
};

const { data, isFetching, refetch } = useQuery({
  queryKey: ["allArt"],
  queryFn: async () => {
    const res = await get<AllArtResponse>("/art");
    return res.art;
  },
});

const setFocusedArt = (id: string) => {
  const art = data.value?.filter((a) => a.id === id)[0];
  if (!art) return;
  focusedArt.value = art;
};

const handleEdit = (id: string) => {
  setFocusedArt(id);
  editVisible.value = true;
};

const handleDelete = (id: string) => {
  setFocusedArt(id);
  deleteVisible.value = true;
};

const deleteArt = async (retry: boolean = true) => {
  if (!focusedArt.value) return;
  if (submitting.value) return;
  try {
    submitting.value = true;
    await sendDelete(`/art/${focusedArt.value.id}`, {
      accessToken: true,
    });
    deleteVisible.value = false;
    refetch();
  } catch (err) {
    const res = getErrorResponseOrThrow(err);
    if (res.statusCode === 401 && retry) {
      await refreshTokens();
      submitting.value = false;
      deleteArt(false);
    } else {
      toast.add({
        group: "main",
        severity: "error",
        closable: true,
        summary: res.message,
      });
    }
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <div
    v-if="isFetching || !data"
    class="w-full flex justify-center items-center"
  >
    <ProgressSpinner v-if="isFetching || !data" />
  </div>
  <DataView v-else :value="data" class="w-full max-w-screen-lg">
    <template #header>
      <h1 class="font-bold text-2xl">Published art</h1>
    </template>
    <template #list="slotProps">
      <div class="flex flex-col">
        <div
          v-for="(item, index) in slotProps.items"
          :key="index"
          class="w-full"
        >
          <div class="flex px-6 py-3 gap-6 rounded-lg shadow-lg">
            <div class="w-full max-w-40">
              <img
                class="rounded w-full h-full object-cover max-h-30"
                :src="item.thumbUrl"
                :alt="item.titleEn"
              />
            </div>
            <div class="w-full flex flex-col gap-3">
              <span class="font-medium text-surface-500 text-sm capitalize">
                {{ item.category }}
              </span>
              <span class="font-bold text-surface-100 text-xl"
                >{{ item.titleEn }} / {{ item.titleFi }}</span
              >
            </div>
            <div class="flex flex-col gap-3 justify-center">
              <Button
                icon="pi pi-pencil"
                outlined
                severity="secondary"
                @click="() => handleEdit(item.id)"
              ></Button>
              <Button
                icon="pi pi-trash"
                outlined
                severity="danger"
                @click="() => handleDelete(item.id)"
              ></Button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </DataView>
  <Dialog v-model:visible="editVisible" modal header="Edit art">
    <Form
      v-slot="$form"
      class="flex flex-col gap-5"
      :initialValues="focusedArt as Record<string, unknown>"
      :resolver="updateArtResolver"
      @submit="handleUpdateArt"
    >
      <div class="gap-5 flex flex-col py-5">
        <FormControl name="category" type="select" label="Category" fluid />
        <div class="flex w-full gap-3">
          <FormControl name="titleEn" type="text" label="Title (English)" />
          <FormControl name="titleFi" type="text" label="Title (Finnish)" />
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
      <Button
        :label="submitting ? 'Saving' : 'Save'"
        type="submit"
        :disabled="!$form.valid || submitting"
      />
    </Form>
  </Dialog>
  <Dialog v-model:visible="deleteVisible" modal header="Delete art">
    <div class="flex flex-col w-full gap-6">
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
        <Button
          severity="danger"
          fluid
          @click="() => deleteArt()"
          :loading="submitting"
          >Delete</Button
        >
      </div>
    </div>
  </Dialog>
</template>
