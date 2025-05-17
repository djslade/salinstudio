<script setup lang="ts">
import { sendLogoutRequest } from "../utils/auth";
import { clearTokens } from "../utils/tokens";
import { Button } from "primevue";

const handleLogout = async () => {
  await sendLogoutRequest();
  clearTokens();
};
</script>

<template>
  <h1>Hello from Home</h1>
  <Button label="Logout" @click="handleLogout" />
</template>
