<script setup lang="ts">
import {
  FileUpload,
  Card,
  type FileUploadSelectEvent,
  FloatLabel,
  InputText,
  Textarea,
  Button,
  Message,
  useToast,
  Select,
  Divider,
} from "primevue";
import { ref } from "vue";
import { Form, FormField, type FormSubmitEvent } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import { getErrorResponseOrThrow, post, refreshTokens } from "../utils/auth";

const src = ref<string>("");
const artImage = ref<Blob | null>(null);

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

const onFileClear = () => (src.value = "");

const formErrorMessage = ref<string>("");
const submitting = ref<boolean>(false);

const defaultFormValues = {
  titleEn: "",
  titleFi: "",
  descriptionEn: "",
  descriptionFi: "",
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

const createArtResolver = zodResolver(
  z.object({
    category: z.string().nonempty("This field is required"),
    titleEn: z.string().nonempty("This field is required"),
    titleFi: z.string().nonempty("This field is required"),
    descriptionEn: z.string().nonempty("This field is required"),
    descriptionFi: z.string().nonempty("This field is required"),
  })
);

const handleCreateArt = async (evt: FormSubmitEvent, retry: boolean = true) => {
  if (!evt.valid) return;
  if (submitting.value) return;
  if (!artImage.value) return;
  formErrorMessage.value = "";
  try {
    submitting.value = true;
    const formData = new FormData();
    formData.append("file", artImage.value);
    formData.append("category", evt.values.category);
    formData.append("titleEn", evt.values.titleEn);
    formData.append("titleFi", evt.values.titleFi);
    formData.append("descriptionEn", evt.values.descriptionEn);
    formData.append("descriptionFi", evt.values.descriptionFi);
    const res = await post("/art", formData);
    evt.reset();
    src.value = "";
    artImage.value = null;
    toast.add({
      group: "main",
      severity: "success",
      closable: true,
      summary: "Added new art",
    });
    return res;
  } catch (err) {
    const res = getErrorResponseOrThrow(err);
    if (res.statusCode === 401 && retry) {
      await refreshTokens();
      handleCreateArt(evt, false);
    } else {
      formErrorMessage.value = res.message;
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
  <div class="w-full flex">
    <Card class="w-full flex max-w-screen-sm h-fit">
      <template #header>
        <div>
          <div class="w-full px-3 pt-3">
            <h1 class="font-bold text-2xl">Submit new art</h1>
          </div>
          <Divider />
        </div>
      </template>
      <template #content>
        <div class="flex flex-col gap-6">
          <div class="flex flex-col gap-6">
            <h2 class="font-medium text-xl">Image</h2>
            <FileUpload
              :multiple="false"
              accept="image/*"
              :file-limit="1"
              :disabled="artImage !== null"
              @select="onFileSelect"
              @remove="onFileClear"
              :show-upload-button="false"
              :show-cancel-button="false"
              invalid-file-type-message="File must have a valid image extension (.jpg, .png, etc)"
            >
            </FileUpload>
            <Form
              v-slot="$form"
              class="flex flex-col gap-5"
              :defaultValues="defaultFormValues"
              :resolver="createArtResolver"
              @submit="handleCreateArt"
            >
              <h2 class="font-medium text-xl">Details</h2>
              <div class="gap-5 flex flex-col">
                <FormField name="category">
                  <FloatLabel variant="on" class="w-full">
                    <Select
                      :options="categories"
                      optionLabel="name"
                      optionValue="value"
                      fluid
                    ></Select>
                    <label>Category</label>
                  </FloatLabel>
                </FormField>
                <div class="flex w-full gap-3">
                  <FormField class="w-full" name="titleEn">
                    <FloatLabel class="w-full" variant="on">
                      <InputText type="text" class="w-full" />
                      <label>Title (English)</label>
                    </FloatLabel>
                  </FormField>
                  <FormField class="w-full" name="titleFi">
                    <FloatLabel class="w-full" variant="on">
                      <InputText type="text" class="w-full" />
                      <label>Title (Finnish)</label>
                    </FloatLabel>
                  </FormField>
                </div>
                <FormField name="descriptionEn">
                  <FloatLabel variant="on">
                    <Textarea :auto-resize="true" :rows="5" fluid />
                    <label>Description (English)</label>
                  </FloatLabel>
                </FormField>
                <FormField v-slot="$field" name="descriptionFi">
                  <FloatLabel variant="on">
                    <Textarea :auto-resize="true" :rows="5" fluid />
                    <label>Description (Finnish)</label>
                  </FloatLabel>
                  <Message
                    v-if="$field?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                    >{{ $field.error?.message }}</Message
                  >
                </FormField>
              </div>

              <Button
                :label="submitting ? 'Saving' : 'Save'"
                type="submit"
                :disabled="!$form.valid || !src"
              />
            </Form>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
