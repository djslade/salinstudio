<script setup lang="ts">
import {
  FileUpload,
  Card,
  type FileUploadSelectEvent,
  Button,
  useToast,
  ProgressSpinner,
} from "primevue";
import { ref } from "vue";
import { Form, type FormSubmitEvent } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import { getErrorResponseOrThrow, post, refreshTokens } from "../utils/auth";
import FormControl from "../components/FormControl.vue";
import { useRouter } from "vue-router";

enum SubmissionStage {
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

const src = ref<string>("");
const artImage = ref<Blob | null>(null);
const router = useRouter();

const initialFormValues = ref<FormValues>({
  category: "",
  titleEn: "",
  titleFi: "",
  descriptionEn: "",
  descriptionFi: "",
});

const submissionStage = ref<SubmissionStage>(SubmissionStage.Start);

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

const onFileClear = () => {
  src.value = "";
  artImage.value = null;
};

const createArtResolver = zodResolver(
  z.object({
    category: z.string().nonempty("This field is required"),
    titleEn: z.string().nonempty("This field is required"),
    titleFi: z.string().nonempty("This field is required"),
    descriptionEn: z.string(),
    descriptionFi: z.string(),
  })
);

const handleCreateArt = async (evt: FormSubmitEvent, retry: boolean = true) => {
  if (!evt.valid) return;
  if (!artImage.value) return;
  try {
    submissionStage.value = SubmissionStage.Submitting;
    initialFormValues.value = {
      category: evt.values.category,
      titleEn: evt.values.titleEn,
      titleFi: evt.values.titleFi,
      descriptionEn: evt.values.descriptionEn,
      descriptionFi: evt.values.descriptionFi,
    };
    const formData = new FormData();
    formData.append("file", artImage.value);
    formData.append("category", evt.values.category);
    formData.append("titleEn", evt.values.titleEn);
    formData.append("titleFi", evt.values.titleFi);
    formData.append("descriptionEn", evt.values.descriptionEn);
    formData.append("descriptionFi", evt.values.descriptionFi);
    await post("/art", formData, { accessToken: true });
    submissionStage.value = SubmissionStage.End;
  } catch (err) {
    const res = getErrorResponseOrThrow(err);
    if (res.statusCode === 401 && retry) {
      await refreshTokens();
      handleCreateArt(evt, false);
    } else {
      toast.add({
        group: "main",
        severity: "error",
        closable: true,
        summary: res.message,
        life: 3000,
      });
      submissionStage.value = SubmissionStage.Start;
    }
  }
};

const handlePublishMore = () => {
  artImage.value = null;
  src.value = "";
  initialFormValues.value = {
    category: "",
    titleEn: "",
    titleFi: "",
    descriptionEn: "",
    descriptionFi: "",
  };
  submissionStage.value = SubmissionStage.Start;
};

const handleGoToList = () => {
  router.push({ name: "List" });
};
</script>

<template>
  <div
    v-if="submissionStage === SubmissionStage.Submitting"
    class="w-full flex justify-center items-center"
  >
    <ProgressSpinner strokeWidth="5" />
  </div>
  <div
    v-if="submissionStage === SubmissionStage.End"
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
  <div
    class="flex flex-col w-full gap-6"
    v-if="submissionStage === SubmissionStage.Start"
  >
    <div class="px-3">
      <h1 class="text-2xl font-bold">Upload New Art</h1>
    </div>
    <div class="w-full flex gap-6">
      <Card class="w-full flex max-w-screen-sm h-fit">
        <template #title>
          <h2>Image</h2>
        </template>
        <template #content>
          <div class="flex flex-col gap-6">
            <div class="flex flex-col gap-6">
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
                class="flex justify-center"
              >
                <template #header="{ chooseCallback, clearCallback, files }">
                  <div
                    class="flex flex-wrap justify-between items-center flex-1 gap-4"
                  >
                    <div class="flex gap-2">
                      <Button
                        @click="chooseCallback()"
                        icon="pi pi-images"
                        rounded
                        outlined
                        severity="secondary"
                      ></Button>
                      <Button
                        @click="clearCallback()"
                        icon="pi pi-times"
                        rounded
                        outlined
                        severity="danger"
                        :disabled="!files || files.length === 0"
                      ></Button>
                    </div>
                  </div>
                </template>
                <template #content>
                  <div class="w-full flex justify-center">
                    <img
                      v-if="src"
                      :src="src"
                      alt=""
                      class="w-full max-w-sm aspect-square rounded shadow-lg object-cover"
                    />
                  </div>
                </template>
                <template #empty>
                  <div class="flex items-center justify-center flex-col">
                    <i
                      class="pi pi-cloud-upload rounded-full !text-4xl text-muted-color"
                    />
                    <p class="mt-6 mb-0">Drag and drop files here.</p>
                  </div>
                </template>
              </FileUpload>
            </div>
          </div>
        </template>
      </Card>
      <Card class="w-full max-w-screen-sm">
        <template #header>
          <div class="px-6 pt-6">
            <h2 class="font-medium text-xl">Details</h2>
          </div>
        </template>
        <template #content>
          <Form
            v-slot="$form"
            class="flex flex-col gap-5 h-full justify-between"
            :initialValues="initialFormValues"
            :resolver="createArtResolver"
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
              <Button label="Reset" fluid type="reset" severity="secondary" />
              <Button
                fluid
                label="Submit"
                type="submit"
                :disabled="!$form.valid || !src"
              />
            </div>
          </Form>
        </template>
      </Card>
    </div>
  </div>
</template>
