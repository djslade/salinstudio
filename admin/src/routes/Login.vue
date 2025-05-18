<script setup lang="ts">
import { Form, type FormSubmitEvent } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { Button } from "primevue";
import { z } from "zod";
import FormControl from "../components/FormControl.vue";
import { getErrorResponseOrThrow, sendLoginRequest } from "../utils/auth";
import { setTokens } from "../utils/tokens";
import { setVisitorAsMember } from "../utils/visitor";
import { ref } from "vue";
import { useRouter } from "vue-router";

const formErrorMessage = ref<string>("");
const submitting = ref<boolean>(false);
const router = useRouter();

const defaultFormValues = {
  username: "",
  password: "",
};

const loginFormResolver = zodResolver(
  z.object({
    username: z.string().nonempty("This field is required"),
    password: z.string().nonempty("This field is required"),
  })
);

const handleLogin = async ({ values, valid }: FormSubmitEvent) => {
  if (!valid) return;
  if (submitting.value) return;
  formErrorMessage.value = "";
  try {
    submitting.value = true;
    const res = await sendLoginRequest({
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
  <h1>Welcome back!</h1>
  <Form
    v-slot="$form"
    :defaultValues="defaultFormValues"
    :resolver="loginFormResolver"
    @submit="handleLogin"
  >
    <FormControl name="username" type="text" label="Username" />
    <FormControl name="password" type="password" label="Password" />
    <div v-if="formErrorMessage" class="">
      <span>{{ formErrorMessage }}</span>
    </div>
    <Button
      type="submit"
      :label="submitting ? 'Logging in...' : 'Log in'"
      :disabled="!$form.valid || submitting"
    />
  </Form>
</template>
