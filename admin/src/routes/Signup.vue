<script setup lang="ts">
import { Form, type FormSubmitEvent } from "@primevue/forms";
import { Button } from "primevue";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import FormControl from "../components/FormControl.vue";
import { ref } from "vue";
import { setTokens } from "../utils/tokens";
import { setVisitorAsMember } from "../utils/visitor";
import { getErrorResponseOrThrow, post } from "../utils/auth";
import { useRouter } from "vue-router";
import { type SignupResponse, type LoginResponse } from "../types/requests";
import {
  type SignupRequestBody,
  type LoginRequestBody,
} from "../types/responses";

const formErrorMessage = ref<string>("");
const submitting = ref<boolean>(false);
const router = useRouter();

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
    formErrorMessage.value = res.message;
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <h1>Get started</h1>
  <Form v-slot="$form" :resolver="signupFormResolver" @submit="handleSignup">
    <FormControl type="text" name="username" label="Username" />
    <FormControl type="password" name="password" label="Password" />
    <FormControl type="secret" name="secret" label="Secret" />
    <div v-if="formErrorMessage" class="">
      <span>{{ formErrorMessage }}</span>
    </div>
    <Button
      type="submit"
      :label="submitting ? 'Signing up...' : 'Sign up'"
      :disabled="!$form.valid || submitting"
    />
  </Form>
</template>
