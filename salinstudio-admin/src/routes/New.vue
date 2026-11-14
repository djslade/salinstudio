<script setup lang="ts">
import { Card, Button, useToast } from "primevue";
import { computed, onUnmounted, ref, useTemplateRef } from "vue";
import ImageOrderList, { type OrderItem } from "../components/ImageOrderList.vue";
import { ART_MAX_IMAGES } from "../utils/artImages";
import { Form, type FormSubmitEvent } from "@primevue/forms";
import FormControl from "../components/FormControl.vue";
import SectionLabel from "../components/SectionLabel.vue";
import { useRouter } from "vue-router";
import LoadingPanel from "../components/LoadingPanel.vue";
import { useFormUtils } from "../hooks/useFormUtils";
import { createUpdateArtResolver } from "../utils/resolvers";
import {
  postRequest,
  refreshIfUnauthorized,
  showRequestError,
} from "../utils/requests";

const {
  formValues,
  isStart,
  isSubmitting,
  isEnd,
  setStepStart,
  setStepSubmitting,
  setStepEnd,
  saveFormValues,
  resetFormValues,
} = useFormUtils({
  category: "",
  titleEn: "",
  titleFi: "",
  descriptionEn: "",
  descriptionFi: "",
});

type LocalImage = OrderItem & { file: File };

// Ordered selection; the first image becomes the lead image.
const artImages = ref<LocalImage[]>([]);
const fileInput = useTemplateRef<HTMLInputElement>("fileInput");
const isDraggingFiles = ref<boolean>(false);
const router = useRouter();
const toast = useToast();

const remaining = computed(() => ART_MAX_IMAGES - artImages.value.length);

const addFiles = (files: File[]) => {
  const images = files.filter((file) => file.type.startsWith("image/"));
  if (images.length < files.length) {
    toast.add({
      group: "main",
      severity: "warn",
      summary: "File must have a valid image extension (.jpg, .png, etc)",
      life: 5000,
    });
  }
  const accepted = images.slice(0, remaining.value);
  if (accepted.length < images.length) {
    toast.add({
      group: "main",
      severity: "warn",
      summary: `An artwork can have at most ${ART_MAX_IMAGES} images`,
      life: 5000,
    });
  }
  artImages.value = [
    ...artImages.value,
    ...accepted.map((file) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      file,
    })),
  ];
};

const onFilesChosen = (evt: Event) => {
  const input = evt.target as HTMLInputElement;
  addFiles(Array.from(input.files ?? []));
  input.value = "";
};

const onFilesDropped = (evt: DragEvent) => {
  isDraggingFiles.value = false;
  addFiles(Array.from(evt.dataTransfer?.files ?? []));
};

const removeImage = (id: string) => {
  const image = artImages.value.find((i) => i.id === id);
  if (image) URL.revokeObjectURL(image.url);
  artImages.value = artImages.value.filter((i) => i.id !== id);
};

const clearImages = () => {
  artImages.value.forEach((image) => URL.revokeObjectURL(image.url));
  artImages.value = [];
};

onUnmounted(clearImages);

// ImageOrderList works on {id, url}; keep the File attached when reordering.
const orderItems = computed<OrderItem[]>({
  get: () => artImages.value,
  set: (items) => {
    artImages.value = items
      .map((item) => artImages.value.find((image) => image.id === item.id))
      .filter((image): image is LocalImage => image !== undefined);
  },
});

const handleCreateArt = async (evt: FormSubmitEvent) => {
  if (!evt.valid) return;
  if (artImages.value.length === 0) return;
  try {
    setStepSubmitting();
    saveFormValues({
      category: evt.values.category,
      titleEn: evt.values.titleEn,
      titleFi: evt.values.titleFi,
      descriptionEn: evt.values.descriptionEn,
      descriptionFi: evt.values.descriptionFi,
    });
    const formData = new FormData();
    artImages.value.forEach((image) => formData.append("files", image.file));
    for (const [key, value] of Object.entries(evt.values)) {
      formData.append(key, value);
    }
    await refreshIfUnauthorized(
      async () => await postRequest("/art", formData, { accessToken: true }),
    );
    setStepEnd();
  } catch (err) {
    toast.add(showRequestError(err));
    setStepStart();
  }
};

const handlePublishMore = () => {
  clearImages();
  resetFormValues();
  setStepStart();
};

const handleGoToList = () => {
  router.push({ name: "List" });
};
</script>

<template>
  <div class="flex flex-col w-full gap-6" v-if="isStart()">
    <div class="px-3">
      <h1 class="text-2xl font-bold">Publish New Art</h1>
    </div>
    <div class="w-full flex flex-col gap-6">
      <Card class="w-full flex h-fit">
        <template #content>
          <div class="flex gap-8 w-full">
            <div class="w-96 shrink-0 flex flex-col gap-3">
              <SectionLabel :label="`Images (${artImages.length}/${ART_MAX_IMAGES})`" />
              <div
                v-if="artImages.length === 0"
                class="flex flex-col items-center justify-center gap-4 rounded-md border-2 border-dashed p-8 text-center transition-colors"
                :class="
                  isDraggingFiles
                    ? 'border-primary'
                    : 'border-surface-200 dark:border-surface-700'
                "
                @dragover.prevent="isDraggingFiles = true"
                @dragleave="isDraggingFiles = false"
                @drop.prevent="onFilesDropped"
              >
                <i class="pi pi-cloud-upload text-4xl! text-muted-color" />
                <p class="m-0">
                  Drag and drop up to {{ ART_MAX_IMAGES }} images here.
                </p>
              </div>
              <template v-else>
                <p class="m-0 text-sm text-surface-500">
                  Drag or use the arrows to reorder. The first image leads.
                </p>
                <ImageOrderList v-model="orderItems" @remove="removeImage" />
              </template>
              <div class="flex gap-2">
                <Button
                  label="Add images"
                  icon="pi pi-images"
                  size="small"
                  severity="secondary"
                  :disabled="remaining <= 0"
                  @click="fileInput?.click()"
                />
                <Button
                  label="Clear"
                  icon="pi pi-times"
                  size="small"
                  severity="danger"
                  outlined
                  :disabled="artImages.length === 0"
                  @click="clearImages"
                />
              </div>
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                multiple
                class="hidden"
                @change="onFilesChosen"
              />
            </div>
            <Form
              v-slot="$form"
              class="flex flex-col gap-8 flex-1"
              :initialValues="formValues"
              :resolver="createUpdateArtResolver"
              @submit="handleCreateArt"
            >
              <section class="flex flex-col gap-4">
                <SectionLabel label="Metadata" />
                <FormControl
                  name="category"
                  type="select"
                  label="Category"
                  fluid
                />
              </section>
              <section class="flex flex-col gap-4">
                <SectionLabel label="Titles" />
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
              <Button
                fluid
                label="Submit"
                type="submit"
                :disabled="!$form.valid || artImages.length === 0"
              />
            </Form>
          </div>
        </template>
      </Card>
    </div>
  </div>
  <LoadingPanel v-if="isSubmitting()" />
  <div v-if="isEnd()" class="w-full flex justify-center items-center">
    <Card class="max-w-screen-sm w-full">
      <template #content>
        <div class="flex justify-center items-center flex-col gap-6">
          <div class="flex flex-col gap-3 items-center">
            <div class="flex items-center justify-center w-16 h-16 rounded-full border-2 border-primary text-primary">
              <i class="pi pi-check text-2xl" />
            </div>
            <span class="text-lg">You've published a new piece!</span>
          </div>
          <div class="flex w-full justify-center gap-3">
            <Button
              label="Publish more"
              fluid
              severity="secondary"
              @click="handlePublishMore"
            />
            <Button
              label="Go to list"
              fluid
              severity="secondary"
              @click="handleGoToList"
            />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
