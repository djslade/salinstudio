<script setup lang="ts">
import {
  FileUpload,
  Card,
  type FileUploadSelectEvent,
  Button,
  Image,
  useToast,
} from "primevue";
import { ref } from "vue";
import { Form, type FormSubmitEvent } from "@primevue/forms";
import FormControl from "../components/FormControl.vue";
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

const src = ref<string>("");
const artImage = ref<Blob | null>(null);
const router = useRouter();
const toast = useToast();

const onFileSelect = (event: FileUploadSelectEvent) => {
  const file = event.files[0];
  const reader = new FileReader();

  reader.onload = async (e: ProgressEvent<FileReader>) => {
    src.value = e.target?.result as string;
    artImage.value = file as Blob;
  };

  reader.readAsDataURL(file);
};

const onFileClear = (cb?: () => void) => {
  if (cb) cb();
  src.value = "";
  artImage.value = null;
};

const handleCreateArt = async (evt: FormSubmitEvent) => {
  if (!evt.valid) return;
  if (!artImage.value) return;
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
    formData.append("file", artImage.value);
    for (const [key, value] of Object.entries(evt.values)) {
      formData.append(key, value);
    }
    await refreshIfUnauthorized(
      async () => await postRequest("/art", formData, { accessToken: true })
    );
    setStepEnd();
  } catch (err) {
    toast.add(showRequestError(err));
    setStepStart();
  }
};

const handlePublishMore = () => {
  artImage.value = null;
  src.value = "";
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
          <div class="flex gap-12 w-full justify-center">
            <div class="w-full flex-1">
              <FileUpload
                :multiple="false"
                accept="image/*"
                :file-limit="1"
                :disabled="artImage !== null"
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
                        :disabled="artImage !== null"
                      ></Button>
                      <Button
                        @click="() => onFileClear(clearCallback)"
                        icon="pi pi-times"
                        rounded
                        outlined
                        severity="danger"
                        :disabled="artImage === null"
                      ></Button>
                    </div>
                  </div>
                </template>
                <template #content>
                  <div class="w-full flex justify-center h-full">
                    <Image alt="Image" preview>
                      <template #previewicon>
                        <i class="pi pi-search"></i>
                      </template>
                      <template #image>
                        <img
                          :src="src"
                          :alt="src"
                          class="aspect-video object-cover max-w-sm w-full"
                        />
                      </template>
                      <template #original="slotProps">
                        <img
                          :src="src"
                          :alt="src"
                          :style="slotProps.style"
                          class="max-w-screen-lg max-h-[90vh]"
                          @click="slotProps.previewCallback()"
                        />
                      </template>
                    </Image>
                  </div>
                </template>
                <template #empty>
                  <div
                    v-if="!artImage"
                    class="flex items-center justify-center flex-col w-full h-full"
                  >
                    <i
                      class="pi pi-cloud-upload rounded-full !text-4xl text-muted-color"
                    />
                    <p class="mt-6 mb-0">Drag and drop files here.</p>
                  </div>
                </template>
              </FileUpload>
            </div>
            <Form
              v-slot="$form"
              class="flex flex-col gap-5 h-full justify-between flex-1"
              :initialValues="formValues"
              :resolver="createUpdateArtResolver"
              @submit="handleCreateArt"
            >
              <div class="gap-5 flex flex-col">
                <FormControl
                  name="category"
                  type="select"
                  label="Category"
                  fluid
                />
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
              <div class="flex w-full gap-3">
                <Button
                  fluid
                  label="Submit"
                  type="submit"
                  :disabled="!$form.valid || !src"
                />
              </div>
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
