<script setup lang="ts">
import { Button } from "primevue";
import { Form, type FormSubmitEvent } from "@primevue/forms";
import FormControl from "./FormControl.vue";
import { createStoreItemResolver, updateStoreItemResolver } from "../utils/resolvers";
import type { Art } from "../types/data";
import { useQuery } from "@tanstack/vue-query";
import { getRequest } from "../utils/requests";

defineProps<{
  formValues: Record<string, any>;
  handleSubmit: (evt: FormSubmitEvent) => Promise<void>;
  update?: boolean;
}>();

const { data, isFetching } = useQuery({
  queryKey: ["allArt"],
  queryFn: async () => {
    const res = await getRequest<{ art: Art[] }>("/art");
    return res.art;
  },
});
</script>

<template>
  <Form
    v-slot="$form"
    class="flex flex-col gap-5 h-full justify-between flex-1"
    :initialValues="formValues"
    :resolver="update ? updateStoreItemResolver : createStoreItemResolver"
    @submit="handleSubmit"
  >
    <div class="gap-5 flex flex-col">
      <FormControl
        name="artId"
        type="art select"
        :options="data"
        label="Art"
        :loading="isFetching"
        fluid
      />
      <div class="flex w-full gap-3">
        <FormControl name="height" type="measurements" label="Height" fluid />
        <FormControl name="width" type="measurements" label="Width" fluid />
      </div>
      <FormControl name="titleEn" type="text" label="Title (English)" fluid />
      <FormControl name="titleFi" type="text" label="Title (Finnish)" fluid />
      <FormControl
        name="infoEn"
        type="textarea"
        label="Product info (English)"
        fluid
      />
      <FormControl
        name="infoFi"
        type="textarea"
        label="Product info (Finnish)"
        fluid
      />
      <FormControl
        name="techniqueEn"
        type="text"
        label="Technique (English)"
        fluid
      />
      <FormControl
        name="techniqueFi"
        type="text"
        label="Technique (Finnish)"
        fluid
      />
      <div class="flex w-full justify-center gap-3">
        <FormControl
          name="isPublic"
          type="toggle"
          toggleOnLabel="Public"
          toggleOffLabel="Private"
        />
        <FormControl
          name="isFramed"
          type="toggle"
          toggleOnLabel="Framed"
          toggleOffLabel="Not framed"
        />
      </div>
      <div class="flex w-full justify-center gap-3">
        <FormControl
          name="isOriginal"
          type="toggle"
          toggleOnLabel="Original"
          toggleOffLabel="Not original"
        />
        <FormControl
          name="isFeatured"
          type="toggle"
          toggleOnLabel="Featured"
          toggleOffLabel="Not featured"
        />
      </div>
      <FormControl name="quantity" type="number" label="Quantity" fluid />
      <div class="flex w-full gap-3">
        <FormControl name="year" type="number" label="Year" fluid />
        <FormControl name="maxPrice" type="price" label="Price" fluid />
      </div>
      <div v-if="update" class="flex w-full gap-3">
        <FormControl
          name="isOnSale"
          type="toggle"
          toggleOnLabel="On sale"
          toggleOffLabel="Not on sale"
        />
        <FormControl
          name="currentPrice"
          type="price"
          label="Sale price"
          fluid
        />
      </div>
    </div>
    <div class="flex w-full gap-3">
      <Button fluid label="Submit" type="submit" :disabled="!$form.valid" />
    </div>
  </Form>
</template>
