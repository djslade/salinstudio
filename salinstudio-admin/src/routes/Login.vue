<script setup lang="ts">
import { Form, type FormSubmitEvent } from "@primevue/forms";
import { Button, Card, Divider, useToast } from "primevue";
import FormControl from "../components/FormControl.vue";
import { setTokens, type Tokens } from "../utils/tokens";
import { setVisitorAsMember } from "../utils/visitor";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { RouterLink } from "vue-router";
import { postRequest, showRequestError } from "../utils/requests";
import { useFormUtils } from "../hooks/useFormUtils";
import { loginFormResolver } from "../utils/resolvers";
import LoadingPanel from "../components/LoadingPanel.vue";

const {
  formValues,
  isStart,
  isSubmitting,
  setStepStart,
  setStepSubmitting,
  saveFormValues,
} = useFormUtils({
  username: "",
  password: "",
});

const toast = useToast();
const submitting = ref<boolean>(false);
const router = useRouter();

const handleLogin = async ({ values, valid }: FormSubmitEvent) => {
  if (!valid) return;
  try {
    setStepSubmitting();
    saveFormValues({ username: values.username, password: values.password });
    const res = await postRequest<Tokens>("/auth/login", {
      username: values.username,
      password: values.password,
    });
    setTokens({ accessToken: res.accessToken, refreshToken: res.refreshToken });
    setVisitorAsMember();
    router.push({ name: "Home" });
  } catch (err) {
    toast.add(showRequestError(err));
    setStepStart();
  }
};
</script>

<template>
  <div v-if="isStart()" class="flex justify-center w-full items-center">
    <Card class="max-w-100 w-full h-fit">
      <template #header>
        <div class="flex w-full justify-center p-6">
          <h1 class="text-2xl font-bold">Welcome back!</h1>
        </div>
      </template>
      <template #content>
        <Form
          v-slot="$form"
          :initialValues="formValues"
          :resolver="loginFormResolver"
          @submit="handleLogin"
          class="flex flex-col gap-6"
        >
          <div class="flex flex-col gap-3">
            <FormControl name="username" type="text" label="Username" fluid />
            <FormControl
              name="password"
              type="password"
              label="Password"
              fluid
            />
          </div>

          <Button
            type="submit"
            :loading="submitting"
            label="Log in"
            :disabled="!$form.valid || submitting"
          />
        </Form>
        <Divider />
        <div class="flex flex-col gap-3 w-full items-center">
          <span>Don't have an account?</span>
          <Button asChild>
            <RouterLink
              class="hover:underline transition-all font-semibold"
              to="/signup"
              >Sign up</RouterLink
            >
          </Button>
        </div>
      </template>
    </Card>
  </div>
  <LoadingPanel v-if="isSubmitting()" />
</template>
