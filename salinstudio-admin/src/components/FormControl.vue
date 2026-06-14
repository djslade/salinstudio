<script setup lang="ts">
import {
  InputText,
  InputNumber,
  Password,
  FloatLabel,
  Message,
  Select,
  Textarea,
  MultiSelect,
  ToggleSwitch,
} from "primevue";
import { FormField } from "@primevue/forms";
import type { Collection } from "../types/data";

type FormControlType =
  | "text"
  | "password"
  | "secret"
  | "textarea"
  | "select"
  | "art select"
  | "multiselect"
  | "measurements"
  | "toggle"
  | "price"
  | "number";

defineProps<{
  type: FormControlType;
  name: string;
  label?: string;
  fluid?: boolean;
  options?: Collection[];
  toggleOnLabel?: string;
  toggleOffLabel?: string;
  loading?: boolean;
}>();

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
</script>

<template>
  <FormField v-slot="$field" :name="name" class="w-full">
    <FloatLabel v-if="type !== 'toggle'" variant="on" class="w-full">
      <InputText v-if="type === 'text'" type="text" :fluid="fluid" />
      <Password v-if="type === 'password'" :fluid="fluid" />
      <InputText v-if="type === 'secret'" type="password" :fluid="fluid" />
      <Textarea
        v-if="type === 'textarea'"
        :auto-resize="true"
        :rows="5"
        :fluid="fluid"
      />
      <Select
        v-if="type === 'art select'"
        :options="options"
        optionLabel="titleEn"
        optionValue="id"
        :fluid="fluid"
        :loading="loading"
      >
        <template #option="slotProps">
          <div class="flex items-center gap-3">
            <img
              :alt="slotProps.option.titleEn"
              :src="slotProps.option.image.thumbUrl"
              class="w-20 aspect-square object-cover"
            />
            <div>{{ slotProps.option.titleEn }}</div>
          </div>
        </template>
      </Select>
      <Select
        v-if="type === 'select'"
        :options="categories"
        optionLabel="name"
        optionValue="value"
        :fluid="fluid"
      />
      <MultiSelect
        v-if="type === 'multiselect'"
        :options="options"
        optionLabel="titleEn"
        optionValue="id"
        filter
        :fluid="fluid"
      />
      <InputNumber v-if="type === 'measurements'" suffix="cm" :fluid="fluid" />
      <InputNumber v-if="type === 'price'" suffix=" €" :fluid="fluid" />
      <InputNumber
        v-if="type === 'number'"
        :useGrouping="false"
        :fluid="fluid"
      />
      <label>{{ label }}</label>
    </FloatLabel>
    <div v-if="type === 'toggle'" class="flex items-center gap-2">
      <ToggleSwitch />
      <span class="text-sm">{{ toggleOnLabel }}</span>
    </div>
    <Message
      v-if="$field?.invalid"
      severity="error"
      size="small"
      variant="simple"
      >{{ $field.error?.message }}</Message
    >
  </FormField>
</template>
