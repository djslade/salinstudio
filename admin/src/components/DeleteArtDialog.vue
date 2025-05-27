<script setup lang="ts">
import Card from "primevue/card";
import Button from "primevue/button";
import LoadingPanel from "./LoadingPanel.vue";
import Image from "primevue/image";
import { useFormUtils } from "../hooks/useFormUtils";
import type { Art } from "../types/data";
import {
  deleteRequest,
  refreshIfUnauthorized,
  showRequestError,
} from "../utils/requests";
import { useToast } from "primevue";

const toast = useToast();

const { art } = defineProps<{
  art: Art;
  cancel: () => void;
  close: () => void;
}>();

const {
  isStart,
  isSubmitting,
  isEnd,
  setStepStart,
  setStepSubmitting,
  setStepEnd,
} = useFormUtils({});

const submit = async () => {
  try {
    setStepSubmitting();
    await refreshIfUnauthorized(
      await deleteRequest(`/art/${art.id}`, {
        accessToken: true,
      })
    );
    setStepEnd();
  } catch (err) {
    toast.add(showRequestError(err));
    setStepStart();
  }
};
</script>

<template>
  <LoadingPanel v-if="isSubmitting()" />
  <div v-if="isEnd()" class="w-full flex justify-center items-center">
    <Card class="max-w-screen-sm w-full">
      <template #content>
        <div class="flex justify-center items-center flex-col gap-6">
          <div class="flex flex-col gap-3 items-center">
            <i
              class="pi pi-check text-emerald-500 w-fit"
              style="
                font-size: 2rem;
                font-weight: 700;
                border: 2px solid;
                border-radius: 50%;
                padding: 1rem;
              "
            />
            <span class="text-lg">Successfully deleted art.</span>
          </div>
          <div class="flex w-full justify-center gap-3">
            <Button
              label="Close"
              class="w-full max-w-xs"
              severity="secondary"
              @click="close"
            />
          </div>
        </div>
      </template>
    </Card>
  </div>
  <div v-if="isStart()" class="flex flex-col w-full gap-6">
    <div class="flex w-full justify-center">
      <Image alt="Image" preview class="w-full">
        <template #previewicon>
          <i class="pi pi-search"></i>
        </template>
        <template #image>
          <img
            :src="art.thumbUrl"
            :alt="art.titleEn"
            class="aspect-video object-cover w-full rounded-lg"
          />
        </template>
        <template #original="slotProps">
          <img
            :src="art.desktopUrl"
            :alt="art.titleEn"
            :style="slotProps.style"
            class="max-w-screen-lg max-h-[90vh]"
            @click="slotProps.previewCallback()"
          />
        </template>
      </Image>
    </div>
    <span class="text-center">Are you sure you want to delete this art?</span>
    <div class="flex gap-3">
      <Button severity="secondary" fluid @click="cancel" label="Cancel" />
      <Button severity="danger" fluid @click="submit" label="Delete" />
    </div>
  </div>
</template>
