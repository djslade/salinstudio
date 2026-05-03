<script setup lang="ts">
import Card from "primevue/card";
import Button from "primevue/button";
import LoadingPanel from "./LoadingPanel.vue";
import FormControl from "./FormControl.vue";
import { Form, type FormSubmitEvent } from "@primevue/forms";
import { useFormUtils } from "../hooks/useFormUtils";
import type { Purchasable } from "../types/data";
import { createUpdateCollectionResolver } from "../utils/resolvers";
import {
  putRequest,
  refreshIfUnauthorized,
  showRequestError,
} from "../utils/requests";
import { useToast } from "primevue";
import { ref } from "vue";

type PreviewImage = {
  file: File;
  url: string;
};

const toast = useToast();
const { storeItem } = defineProps<{
  storeItem: Purchasable;
  visible: boolean;
  cancel: () => void;
  close: () => void;
}>();

const {
  formValues,
  isStart,
  isSubmitting,
  isEnd,
  setStepStart,
  setStepSubmitting,
  setStepEnd,
  saveFormValues,
} = useFormUtils({
  artId: storeItem.art.id,
  imageIds: storeItem.images.map((image) => image.id),
  techniqueEn: storeItem.techniqueEn,
  techniqueFi: storeItem.techniqueFi,
  height: storeItem.height,
  width: storeItem.width,
  quantity: storeItem.quantity,
  year: storeItem.year,
  maxPrice: storeItem.maxPrice,
  currentPrice: storeItem.currentPrice,
  isOriginal: storeItem.isOriginal,
  isPublic: storeItem.isPublic,
  isFramed: storeItem.isFramed,
});

const images = ref<PreviewImage[]>([]);

const submit = async (evt: FormSubmitEvent) => {
  if (!evt.valid) return;
  if (!images.value) return;
  if (images.value.length + evt.values.imageIds.length > 5) {
    toast.add({
      group: "main",
      severity: "error",
      closable: true,
      summary: "Store items can have at most five images",
      life: 5000,
    });
    return;
  }
  try {
    setStepSubmitting();
    saveFormValues({
      artId: evt.values.artId,
      imageIds: evt.values.imageIds,
      techniqueEn: evt.values.techniqueEn,
      techniqueFi: evt.values.techniqueFi,
      height: evt.values.height,
      width: evt.values.width,
      quantity: evt.values.quantity,
      year: evt.values.year,
      maxPrice: evt.values.maxPrice,
      currentPrice: evt.values.currentPrice,
      isPublic: evt.values.isPublic,
      isOriginal: evt.values.isOriginal,
      isFramed: evt.values.isFramed,
    });
    const formData = new FormData();
    images.value.forEach((image) => {
      formData.append("files", image.file);
    });
    for (const [key, value] of Object.entries(evt.values)) {
      formData.append(key, value);
    }
    await refreshIfUnauthorized(
      async () =>
        await putRequest(`/purchasable/${storeItem.id}`, formData, {
          accessToken: true,
        }),
    );
    setStepEnd();
  } catch (err) {
    toast.add(showRequestError(err));
    setStepStart();
  }
};
</script>

<template>
  <LoadingPanel v-if="isSubmitting()" />
  <div v-if="isEnd()" class="w-full flex justify-center items-center">
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
              @click="close"
            />
          </div>
        </div>
      </template>
    </Card>
  </div>
  <Form
    v-if="isStart()"
    class="flex flex-col gap-5"
    :initialValues="formValues"
    :resolver="createUpdateCollectionResolver"
    @submit="submit"
  >
    <div class="gap-5 flex flex-col py-5">
      <div class="flex w-full gap-3">
        <FormControl name="titleEn" type="text" label="Title (English)" fluid />
        <FormControl name="titleFi" type="text" label="Title (Finnish)" fluid />
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
</template>
