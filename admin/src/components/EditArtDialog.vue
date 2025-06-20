<script setup lang="ts">
import Card from "primevue/card";
import Button from "primevue/button";
import LoadingPanel from "./LoadingPanel.vue";
import FormControl from "./FormControl.vue";
import { Form, type FormSubmitEvent } from "@primevue/forms";
import { useFormUtils } from "../hooks/useFormUtils";
import type { Art } from "../types/data";
import { createUpdateArtResolver } from "../utils/resolvers";
import {
  putRequest,
  refreshIfUnauthorized,
  showRequestError,
} from "../utils/requests";
import { useToast } from "primevue";

const toast = useToast();
const { art } = defineProps<{
  art: Art;
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
  category: art.category,
  titleEn: art.titleEn,
  titleFi: art.titleFi,
  descriptionEn: art.descriptionEn,
  descriptionFi: art.descriptionFi,
});

const submit = async (evt: FormSubmitEvent) => {
  if (!evt.valid) return;
  if (!art) return;
  try {
    setStepSubmitting();
    saveFormValues({
      category: evt.values.category,
      titleEn: evt.values.titleEn,
      titleFi: evt.values.titleFi,
      descriptionEn: evt.values.descriptionEn,
      descriptionFi: evt.values.descriptionFi,
    });
    await refreshIfUnauthorized(
      async () =>
        await putRequest(
          `/art/${art.id}`,
          {
            category: evt.values.category,
            titleEn: evt.values.titleEn,
            titleFi: evt.values.titleFi,
            descriptionEn: evt.values.descriptionEn,
            descriptionFi: evt.values.descriptionFi,
            onHomeCarousel: art.onHomeCarousel,
          },
          { accessToken: true }
        )
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
    :resolver="createUpdateArtResolver"
    @submit="submit"
  >
    <div class="gap-5 flex flex-col py-5">
      <FormControl name="category" type="select" label="Category" fluid />
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
