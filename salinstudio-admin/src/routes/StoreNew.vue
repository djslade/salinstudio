<script setup lang="ts">
import { FileUpload, Card, Button, Image, useToast } from "primevue";
import { ref } from "vue";
import { type FormSubmitEvent } from "@primevue/forms";
import { useRouter } from "vue-router";
import LoadingPanel from "../components/LoadingPanel.vue";
import { useFormUtils } from "../hooks/useFormUtils";
import {
  postRequest,
  refreshIfUnauthorized,
  showRequestError,
} from "../utils/requests";
import StoreItemForm from "../components/StoreItemForm.vue";

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
  artId: "",
  titleEn: "",
  titleFi: "",
  infoEn: "",
  infoFi: "",
  techniqueEn: "",
  techniqueFi: "",
  height: 0,
  width: 0,
  quantity: 1,
  year: 2026,
  maxPrice: 0,
  isPublic: true,
  isOriginal: false,
  isFramed: false,
  isFeatured: false,
});

type PreviewImage = {
  file: File;
  url: string;
};

type FileUploadSelectEvent = {
  files: File[];
  originalEvent: Event;
};

const images = ref<PreviewImage[]>([]);
const router = useRouter();
const toast = useToast();

const onFileSelect = (event: FileUploadSelectEvent) => {
  const newImages: PreviewImage[] = event.files.map((file) => ({
    file,
    url: URL.createObjectURL(file),
  }));
  images.value = newImages;
};

const onFileClear = (cb?: () => void) => {
  if (cb) cb();
  images.value.forEach((i) => URL.revokeObjectURL(i.url));
  images.value = [];
};

const handleCreateStoreItem = async (evt: FormSubmitEvent) => {
  if (!evt.valid) return;
  if (!images.value) return;
  try {
    setStepSubmitting();
    saveFormValues({
      artId: evt.values.artId,
      titleEn: "",
      titleFi: "",
      infoEn: "",
      infoFi: "",
      techniqueEn: evt.values.techniqueEn,
      techniqueFi: evt.values.techniqueFi,
      height: evt.values.height,
      width: evt.values.width,
      quantity: evt.values.quantity,
      year: evt.values.year,
      maxPrice: evt.values.maxPrice,
      isPublic: evt.values.isPublic,
      isOriginal: evt.values.isOriginal,
      isFramed: evt.values.isFramed,
      isFeatured: evt.values.isFeatured,
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
        await postRequest("/purchasable", formData, { accessToken: true }),
    );
    setStepEnd();
  } catch (err) {
    toast.add(showRequestError(err));
    setStepStart();
  }
};

const handlePublishMore = () => {
  images.value = [];
  resetFormValues();
  setStepStart();
};

const handleGoToList = () => {
  router.push({ name: "StoreList" });
};
</script>

<template>
  <div class="flex flex-col w-full gap-6" v-if="isStart()">
    <div class="px-3">
      <h1 class="text-2xl font-bold">Create New Store Item</h1>
    </div>
    <div class="w-full flex flex-col gap-6">
      <Card class="w-full flex h-fit">
        <template #content>
          <div class="flex gap-12 w-full justify-center">
            <div class="w-full flex-1">
              <FileUpload
                :multiple="true"
                accept="image/*"
                :file-limit="5"
                :disabled="images.length >= 5"
                @select="onFileSelect"
                @clear="onFileClear"
                :show-upload-button="false"
                :show-cancel-button="false"
                invalid-file-type-message="File must have a valid image extension (.jpg, .png, etc)"
              >
                <template #header="{ chooseCallback, clearCallback }">
                  <div
                    class="flex flex-wrap justify-between items-center flex-1 gap-4 w-full"
                  >
                    <div class="flex gap-2 w-full">
                      <Button
                        @click="chooseCallback()"
                        icon="pi pi-images"
                        rounded
                        outlined
                        severity="secondary"
                        :disabled="images.length >= 5"
                      ></Button>
                      <Button
                        @click="() => onFileClear(clearCallback)"
                        icon="pi pi-times"
                        rounded
                        outlined
                        severity="danger"
                        :disabled="images.length === 0"
                      ></Button>
                    </div>
                  </div>
                </template>
                <template #content>
                  <div class="w-full flex justify-center h-full">
                    <Image
                      v-for="(img, index) in images"
                      :key="index"
                      alt="Preview"
                      preview
                    >
                      <template #previewicon>
                        <i class="pi pi-search"></i>
                      </template>
                      <template #image>
                        <img
                          :src="img.url"
                          alt="Preview"
                          class="aspect-video object-cover max-w-sm w-full"
                        />
                      </template>
                      <template #original="slotProps">
                        <img
                          :src="img.url"
                          alt="Preview"
                          :style="slotProps.style"
                          class="max-w-5xl max-h-[90vh]"
                          @click="slotProps.previewCallback()"
                        />
                      </template>
                    </Image>
                  </div>
                </template>
                <template #empty>
                  <div
                    v-if="images.length < 5"
                    class="flex items-center justify-center flex-col w-full h-full"
                  >
                    <i
                      class="pi pi-cloud-upload rounded-full text-4xl! text-muted-color"
                    />
                    <p class="mt-6 mb-0">Drag and drop files here.</p>
                  </div>
                </template>
              </FileUpload>
            </div>
            <StoreItemForm
              :formValues="formValues"
              :handleSubmit="handleCreateStoreItem"
            />
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
