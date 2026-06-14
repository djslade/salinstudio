<script setup lang="ts">
import { Button } from "primevue";
import { Form, type FormSubmitEvent } from "@primevue/forms";
import FormControl from "./FormControl.vue";
import SectionLabel from "./SectionLabel.vue";
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
    class="flex flex-col gap-8"
    :initialValues="formValues"
    :resolver="update ? updateStoreItemResolver : createStoreItemResolver"
    @submit="handleSubmit"
  >
    <section class="flex flex-col gap-4">
      <SectionLabel label="Artwork" />
      <FormControl
        name="artId"
        type="art select"
        :options="data"
        label="Art"
        :loading="isFetching"
        fluid
      />
    </section>

    <section class="flex flex-col gap-4">
      <SectionLabel label="Titles" />
      <FormControl name="titleEn" type="text" label="Title (English)" fluid />
      <FormControl name="titleFi" type="text" label="Title (Finnish)" fluid />
    </section>

    <section class="flex flex-col gap-4">
      <SectionLabel label="Descriptions" />
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
    </section>

    <section class="flex flex-col gap-4">
      <SectionLabel label="Technique" />
      <FormControl name="techniqueEn" type="text" label="Technique (English)" fluid />
      <FormControl name="techniqueFi" type="text" label="Technique (Finnish)" fluid />
    </section>

    <section class="flex flex-col gap-4">
      <SectionLabel label="Dimensions" />
      <div class="flex gap-3">
        <FormControl name="height" type="measurements" label="Height" fluid />
        <FormControl name="width" type="measurements" label="Width" fluid />
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <SectionLabel label="Inventory" />
      <div class="flex gap-3">
        <FormControl name="quantity" type="number" label="Quantity" fluid />
        <FormControl name="year" type="number" label="Year" fluid />
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <SectionLabel label="Pricing" />
      <FormControl name="maxPrice" type="price" label="Price" fluid />
      <div v-if="update" class="flex flex-col gap-4">
        <FormControl
          name="isOnSale"
          type="toggle"
          toggleOnLabel="On sale"
          toggleOffLabel="Not on sale"
        />
        <FormControl
          v-if="$form.isOnSale?.value"
          name="currentPrice"
          type="price"
          label="Sale price"
          fluid
        />
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <SectionLabel label="Flags" />
      <div class="grid grid-cols-2 gap-3">
        <FormControl
          name="isPublic"
          type="toggle"
          toggleOnLabel="Public"
          toggleOffLabel="Private"
        />
        <FormControl
          name="isOriginal"
          type="toggle"
          toggleOnLabel="Original"
          toggleOffLabel="Not original"
        />
        <FormControl
          name="isFramed"
          type="toggle"
          toggleOnLabel="Framed"
          toggleOffLabel="Not framed"
        />
        <FormControl
          name="isFeatured"
          type="toggle"
          toggleOnLabel="Featured"
          toggleOffLabel="Not featured"
        />
      </div>
    </section>

    <Button fluid label="Submit" type="submit" :disabled="!$form.valid" />
  </Form>
</template>
