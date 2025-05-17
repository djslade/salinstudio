<script setup lang="ts">
import { InputText, Password, FloatLabel, Message } from "primevue";
import { FormField } from "@primevue/forms";

type FormControlType = "text" | "password" | "secret";

defineProps<{
  type: FormControlType;
  name: string;
  label: string;
}>();
</script>

<template>
  <FormField v-slot="$field" :name="name">
    <FloatLabel variant="on">
      <InputText v-if="type === 'text'" type="text" />
      <Password v-if="type === 'password'" />
      <InputText v-if="type === 'secret'" type="password" />
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
