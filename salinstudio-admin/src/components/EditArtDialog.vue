<script setup lang="ts">
import Card from "primevue/card";
import Button from "primevue/button";
import LoadingPanel from "./LoadingPanel.vue";
import FormControl from "./FormControl.vue";
import SectionLabel from "./SectionLabel.vue";
import { Form, type FormSubmitEvent } from "@primevue/forms";
import { useFormUtils } from "../hooks/useFormUtils";
import type { Art, Collection } from "../types/data";
import { updateArtResolver } from "../utils/resolvers";
import {
  getRequest,
  putRequest,
  refreshIfUnauthorized,
  showRequestError,
} from "../utils/requests";
import { useToast } from "primevue";
import { useQuery } from "@tanstack/vue-query";

const toast = useToast();
const { art } = defineProps<{
  art: Art;
  visible: boolean;
  cancel: () => void;
  close: () => void;
}>();

const { data } = useQuery({
  queryKey: ["allCollections"],
  queryFn: async () => {
    const res = await getRequest<{ collections: Collection[] }>("/collection");
    return res.collections;
  },
});

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
  collections: art.collections?.map((col) => col.id) || [],
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
      collections: evt.values.collections,
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
            collections: evt.values.collections,
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
            <div class="flex items-center justify-center w-16 h-16 rounded-full border-2 border-primary text-primary">
              <i class="pi pi-check text-2xl" />
            </div>
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
    v-if="isStart() && data"
    class="flex flex-col gap-5"
    :initialValues="formValues"
    :resolver="updateArtResolver"
    @submit="submit"
  >
    <div class="flex flex-col gap-6 py-4">
      <section class="flex flex-col gap-4">
        <SectionLabel label="Metadata" />
        <FormControl name="category" type="select" label="Category" fluid />
        <FormControl
          name="collections"
          type="multiselect"
          label="Collections"
          :options="data"
          fluid
        />
      </section>
      <section class="flex flex-col gap-4">
        <SectionLabel label="Titles" />
        <div class="flex w-full gap-3">
          <FormControl name="titleEn" type="text" label="Title (English)" fluid />
          <FormControl name="titleFi" type="text" label="Title (Finnish)" fluid />
        </div>
      </section>
      <section class="flex flex-col gap-4">
        <SectionLabel label="Descriptions" />
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
      </section>
    </div>
    <Button label="Save" type="submit" />
  </Form>
</template>
