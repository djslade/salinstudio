<script setup lang="ts">
import {
  InputText,
  Password,
  FloatLabel,
  Message,
  Select,
  Textarea,
} from "primevue";
import { FormField } from "@primevue/forms";

type FormControlType = "text" | "password" | "secret" | "textarea" | "select";

defineProps<{
  type: FormControlType;
  name: string;
  label: string;
  fluid?: boolean;
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
    <FloatLabel variant="on" class="w-full">
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
        v-if="type === 'select'"
        :options="categories"
        optionLabel="name"
        optionValue="value"
        :fluid="fluid"
      />
      <label>{{ label }}</label>
    </FloatLabel>
    <Message
      v-if="$field?.invalid"
      severity="error"
      size="small"
      variant="simple"
      >{{ $field.error?.message }}</Message
    >
  </FormField>
</template>
