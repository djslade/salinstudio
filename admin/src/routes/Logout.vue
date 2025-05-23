<script setup lang="ts">
import { Card, Button } from "primevue";
import { RouterLink } from "vue-router";

type SlotProps = {
  class?: string;
  a11yAttrs?: Record<string, unknown> | undefined;
};
</script>

<template>
  <div class="flex w-full justify-center items-center">
    <Card class="rounded-full w-full max-w-screen-sm">
      <template #content>
        <div class="w-full flex flex-col gap-6 items-center">
          <h1 class="text-2xl font-bold text-center">Bye for now!</h1>
          <Button asChild v-slot="slotProps: SlotProps">
            <RouterLink
              to="/login"
              :class="slotProps.class"
              class="max-w-2xs w-full"
              >Login</RouterLink
            >
          </Button>
        </div>
      </template>
    </Card>
  </div>
</template>
