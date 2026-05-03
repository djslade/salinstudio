<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import type { User } from "../types/data";
import { getRequest } from "../utils/requests";
import { useFormUtils } from "../hooks/useFormUtils";
import type { FormSubmitEvent } from "@primevue/forms";
import { updateRoleResolver } from "../utils/resolvers";

const { formValues, setStepSubmitting, saveFormValues } = useFormUtils({
  secret: "",
});

const { data } = useQuery({
  queryKey: ["user"],
  queryFn: async () => {
    const res = await getRequest<{ user: User }>("/auth", {
      accessToken: true,
    });
    return res.user;
  },
});

const handleUpdateRole = async (evt: FormSubmitEvent) => {
  if (!evt.valid) return;
  try {
    setStepSubmitting();
    saveFormValues({
      secret: evt.values.secret,
    });
  } catch (err) {}
};
</script>

<template>
  <div class="flex flex-col gap-3">
    <h1 v-if="data">Your role is {{ data.role }}</h1>
    <Card>
      <Form
        class="flex flex-col gap-5 h-full justify-between flex-1"
        :initialValues="formValues"
        :resolver="updateRoleResolver"
        @submit="handleUpdateRole"
      ></Form>
    </Card>
  </div>
</template>

<style></style>
