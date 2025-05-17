<script setup lang="ts">
import { Form, type FormSubmitEvent } from "@primevue/forms";
import { Button } from "primevue";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import FormControl from "../components/FormControl.vue";
import { ref } from "vue";
import { setTokens } from "../utils/tokens";
import { setVisitorAsMember } from "../utils/visitor";
import {
  getErrorResponseOrThrow,
  sendLoginRequest,
  sendSignupRequest,
} from "../utils/auth";

const formErrorMessage = ref<string>("");
const submitting = ref<boolean>(false);

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
    await sendSignupRequest({
      username: values.username,
      password: values.password,
      secret: values.secret,
    });
    const res = await sendLoginRequest({
      username: values.username,
      password: values.password,
    });
    setTokens({ accessToken: res.accessToken, refreshToken: res.refreshToken });
    setVisitorAsMember();
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
