<script setup lang="ts">
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { z } from "zod";
import { Button } from "primevue";
import { Form, type FormSubmitEvent } from "@primevue/forms";
import FormControl from "../components/FormControl.vue";
import { getErrorResponseOrThrow, post, refreshTokens } from "../utils/auth";
import type { CreateCategoryResponse } from "../types/requests";
import type { CreateCategoryRequestBody } from "../types/responses";

const formErrorMessage = ref<string>("");
const submitting = ref<boolean>(false);
const router = useRouter();

const defaultFormValues = {
  nameEn: "",
  nameFi: "",
};

const createCategoryResolver = zodResolver(
  z.object({
    nameEn: z.string().nonempty(),
    nameFi: z.string().nonempty(),
  })
);

const handleCreateCategory = async (evt: FormSubmitEvent) => {
  const { values, valid } = evt;
  if (!valid) return;
  if (submitting.value) return;
  formErrorMessage.value = "";
  try {
    const res = await post<CreateCategoryResponse, CreateCategoryRequestBody>(
      "/genre",
      {
        nameEn: values.nameEn,
        nameFi: values.nameFi,
      },
      {
        accessToken: true,
      }
    );
    router.push("/categories/" + res.genre.id);
  } catch (err) {
    const res = getErrorResponseOrThrow(err);
    if (res.statusCode === 401) {
      await refreshTokens();
      await handleCreateCategory(evt);
    } else {
      formErrorMessage.value = res.message;
    }
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <Form
    class="flex flex-col gap-3"
    v-slot="$form"
    :defaultValues="defaultFormValues"
    :resolver="createCategoryResolver"
    @submit="handleCreateCategory"
  >
    <h1>Create new category</h1>
    <FormControl name="nameEn" type="text" label="Name (English)" />
    <FormControl name="nameFi" type="text" label="Name (Finnish)" />
    <div v-if="formErrorMessage" class="">
      <span>{{ formErrorMessage }}</span>
    </div>
    <Button
      type="submit"
      :label="submitting ? '' : 'Create'"
      :disabled="!$form.valid || submitting"
    />
  </Form>
</template>
