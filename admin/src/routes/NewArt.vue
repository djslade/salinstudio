<script setup lang="ts">
import {
  FloatLabel,
  InputText,
  FileUpload,
  type FileUploadSelectEvent,
} from "primevue";
import { ref } from "vue";
import { Form, FormField } from "@primevue/forms";

const src = ref<string | ArrayBuffer | null | undefined>(null);

const onFileSelect = (event: FileUploadSelectEvent) => {
  const file = event.files[0];
  const reader = new FileReader();

  reader.onload = async (e: ProgressEvent<FileReader>) => {
    src.value = e.target?.result;
  };

  reader.readAsDataURL(file);
};
</script>

<template>
  <h1>Hello from New Art</h1>
  <label for="file">Image</label>
  <FileUpload
    name="file"
    :multiple="false"
    accept="image/*"
    :maxFileSize="1000000"
    @select="onFileSelect"
    :show-upload-button="false"
    :show-cancel-button="false"
  >
    <template #empty>
      <span>Drag and drop your image here</span>
    </template>
  </FileUpload>
  <Form>
    <FormField>
      <FloatLabel variant="on">
        <InputText type="text" />
        <label>Name (English)</label>
      </FloatLabel>
    </FormField>
    <FormField>
      <FloatLabel variant="on">
        <InputText type="text" />
        <label>Name (Finnish)</label>
      </FloatLabel>
    </FormField>
  </Form>
</template>
