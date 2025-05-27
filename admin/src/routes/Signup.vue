<script setup lang="ts">
import { Form, type FormSubmitEvent } from "@primevue/forms";
import { Button, Divider, Card, useToast } from "primevue";
import FormControl from "../components/FormControl.vue";
import { ref } from "vue";
import { setTokens, type Tokens } from "../utils/tokens";
import { setVisitorAsMember } from "../utils/visitor";
import { useRouter, RouterLink } from "vue-router";
import { postRequest, showRequestError } from "../utils/requests";
import { useFormUtils } from "../hooks/useFormUtils";
import { signupFormResolver } from "../utils/resolvers";
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
  secret: "",
});

const submitting = ref<boolean>(false);
const router = useRouter();
const toast = useToast();

const handleSignup = async ({ values, valid }: FormSubmitEvent) => {
  if (!valid) return;
  try {
    setStepSubmitting();
    saveFormValues({
      username: values.username,
      password: values.password,
      secret: values.secret,
    });
    await postRequest("/auth/signup", {
      username: values.username,
      password: values.password,
      secret: values.secret,
    });
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
          <h1 class="text-2xl font-bold">Get started</h1>
        </div>
      </template>
      <template #content>
        <Form
          v-slot="$form"
          :resolver="signupFormResolver"
          @submit="handleSignup"
          :initialValues="formValues"
          class="flex flex-col gap-6"
        >
          <div class="flex flex-col gap-3">
            <FormControl type="text" name="username" label="Username" fluid />
            <FormControl
              type="password"
              name="password"
              label="Password"
              fluid
            />
            <FormControl type="secret" name="secret" label="Secret" fluid />
          </div>
          <Button
            type="submit"
            :label="submitting ? 'Signing up...' : 'Sign up'"
            :disabled="!$form.valid || submitting"
          />
        </Form>
        <Divider />
        <div class="flex flex-col gap-3 w-full items-center">
          <span>Already have an account?</span>
          <Button asChild>
            <RouterLink
              class="hover:underline transition-all font-semibold"
              to="/login"
              >Login</RouterLink
            >
          </Button>
        </div>
      </template>
    </Card>
  </div>
  <LoadingPanel v-if="isSubmitting()" />
</template>
