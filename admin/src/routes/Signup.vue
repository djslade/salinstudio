<script setup lang="ts">
import { Form, type FormSubmitEvent } from "@primevue/forms";
import { Button, Divider, Card, useToast } from "primevue";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import FormControl from "../components/FormControl.vue";
import { ref } from "vue";
import { setTokens } from "../utils/tokens";
import { setVisitorAsMember } from "../utils/visitor";
import { getErrorResponseOrThrow, post } from "../utils/auth";
import { useRouter, RouterLink } from "vue-router";
import { type SignupResponse, type LoginResponse } from "../types/requests";
import {
  type SignupRequestBody,
  type LoginRequestBody,
} from "../types/responses";

const formErrorMessage = ref<string>("");
const submitting = ref<boolean>(false);
const router = useRouter();
const toast = useToast();

const defaultFormValues = {
  username: "",
  password: "",
  secret: "",
};

const signupFormResolver = zodResolver(
  z.object({
    username: z.string().nonempty("This field is required"),
    password: z.string().nonempty("This field is required"),
    secret: z.string().nonempty("This field is required"),
  })
);

const handleSignup = async ({ values, valid }: FormSubmitEvent) => {
  if (!valid) return;
  if (submitting.value) return;
  formErrorMessage.value = "";
  try {
    submitting.value = true;
    await post<SignupResponse, SignupRequestBody>("/auth/signup", {
      username: values.username,
      password: values.password,
      secret: values.secret,
    });
    const res = await post<LoginResponse, LoginRequestBody>("/auth/login", {
      username: values.username,
      password: values.password,
    });
    setTokens({ accessToken: res.accessToken, refreshToken: res.refreshToken });
    setVisitorAsMember();
    router.push({ name: "Home" });
  } catch (err) {
    const res = getErrorResponseOrThrow(err);
    toast.add({
      group: "main",
      severity: "error",
      closable: true,
      summary: res.message,
      life: 3000,
    });
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <div class="flex justify-center w-full items-center">
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
          :initialValues="defaultFormValues"
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
</template>
