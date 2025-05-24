<script setup lang="ts">
import { Form, type FormSubmitEvent } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { Button, Card, useToast, Divider } from "primevue";
import { z } from "zod";
import FormControl from "../components/FormControl.vue";
import { getErrorResponseOrThrow, post } from "../utils/auth";
import { setTokens } from "../utils/tokens";
import { setVisitorAsMember } from "../utils/visitor";
import { ref } from "vue";
import { useRouter } from "vue-router";
import type { LoginResponse } from "../types/requests";
import type { LoginRequestBody } from "../types/responses";
import { RouterLink } from "vue-router";

const submitting = ref<boolean>(false);
const router = useRouter();
const toast = useToast();

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
  try {
    submitting.value = true;
    const res = await post<LoginResponse, LoginRequestBody>("/auth/login", {
      username: values.username,
      password: values.password,
    });
    setTokens({ accessToken: res.accessToken, refreshToken: res.refreshToken });
    setVisitorAsMember();
    router.push({ name: "Home" });
  } catch (err) {
    console.log("hi");
    console.error(err);
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
          <h1 class="text-2xl font-bold">Welcome back!</h1>
        </div>
      </template>
      <template #content>
        <Form
          v-slot="$form"
          :initialValues="defaultFormValues"
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
</template>
