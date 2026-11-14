<script setup lang="ts">
import Button from "primevue/button";
import { useToast } from "primevue";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { computed, ref, useTemplateRef, watch } from "vue";
import ImageOrderList, { type OrderItem } from "./ImageOrderList.vue";
import SectionLabel from "./SectionLabel.vue";
import type { Art } from "../types/data";
import { ART_MAX_IMAGES, getArtImages } from "../utils/artImages";
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
  refreshIfUnauthorized,
  showRequestError,
} from "../utils/requests";

const { artId } = defineProps<{ artId: string }>();

const toast = useToast();
const queryClient = useQueryClient();
const fileInput = useTemplateRef<HTMLInputElement>("fileInput");

const { data: art } = useQuery({
  queryKey: ["art", artId],
  queryFn: async () => {
    const res = await getRequest<{ art: Art }>(`/art/${artId}`);
    return res.art;
  },
  staleTime: 0,
});

const items = ref<OrderItem[]>([]);
const savedIds = ref<string[]>([]);
const busy = ref<boolean>(false);
const pendingDeleteId = ref<string | null>(null);

const setFromArt = (value?: Art) => {
  if (!value) return;
  items.value = getArtImages(value).map((image) => ({
    id: image.id,
    url: image.thumbUrl,
  }));
  savedIds.value = items.value.map((item) => item.id);
};

watch(art, setFromArt, { immediate: true });

const orderChanged = computed(
  () => items.value.map((item) => item.id).join() !== savedIds.value.join(),
);
const remaining = computed(() => ART_MAX_IMAGES - items.value.length);

const applyResponse = async (value: Art) => {
  queryClient.setQueryData(["art", artId], value);
  setFromArt(value);
  // The art list shows the lead image, so refresh it too.
  await queryClient.invalidateQueries({ queryKey: ["allArt"] });
};

const run = async (fn: () => Promise<{ art: Art }>) => {
  busy.value = true;
  try {
    const res = await refreshIfUnauthorized(fn);
    await applyResponse(res.art);
  } catch (err) {
    toast.add(showRequestError(err));
  } finally {
    busy.value = false;
  }
};

const saveOrder = () =>
  run(() =>
    patchRequest<{ art: Art }>(
      `/art/${artId}/images/order`,
      { ids: items.value.map((item) => item.id) },
      { accessToken: true },
    ),
  );

const resetOrder = () => setFromArt(art.value);

const confirmDelete = async () => {
  const id = pendingDeleteId.value;
  pendingDeleteId.value = null;
  if (!id) return;
  await run(() =>
    deleteRequest<{ art: Art }>(`/art/${artId}/images/${id}`, {
      accessToken: true,
    }),
  );
};

const onFilesChosen = async (evt: Event) => {
  const input = evt.target as HTMLInputElement;
  const files = Array.from(input.files ?? []);
  input.value = "";
  if (files.length === 0) return;
  if (files.length > remaining.value) {
    toast.add({
      group: "main",
      severity: "warn",
      summary: `You can add ${remaining.value} more image${remaining.value === 1 ? "" : "s"}`,
      life: 5000,
    });
    return;
  }
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  await run(() =>
    postRequest<{ art: Art }>(`/art/${artId}/images`, formData, {
      accessToken: true,
    }),
  );
};
</script>

<template>
  <section class="flex flex-col gap-3">
    <SectionLabel :label="`Images (${items.length}/${ART_MAX_IMAGES})`" />
    <p class="text-sm text-surface-500">
      Drag images or use the arrows to reorder. The first image leads: it is
      shown in the gallery and on the home page.
    </p>
    <ImageOrderList
      v-model="items"
      :disabled="busy"
      @remove="(id) => (pendingDeleteId = id)"
    />
    <div
      v-if="pendingDeleteId"
      class="flex flex-wrap items-center justify-between gap-2 rounded-md border border-red-300 p-2 text-sm"
    >
      <span v-if="items.length > 1">Delete this image permanently?</span>
      <span v-else>An artwork must keep at least one image.</span>
      <div class="flex gap-2">
        <Button
          v-if="items.length > 1"
          label="Delete"
          size="small"
          severity="danger"
          :disabled="busy || orderChanged"
          @click="confirmDelete"
        />
        <Button
          label="Cancel"
          size="small"
          severity="secondary"
          @click="pendingDeleteId = null"
        />
      </div>
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <Button
        label="Save order"
        size="small"
        :disabled="busy || !orderChanged"
        :loading="busy && orderChanged"
        @click="saveOrder"
      />
      <Button
        label="Reset"
        size="small"
        severity="secondary"
        :disabled="busy || !orderChanged"
        @click="resetOrder"
      />
      <Button
        label="Add images"
        icon="pi pi-images"
        size="small"
        severity="secondary"
        :disabled="busy || orderChanged || remaining <= 0"
        @click="fileInput?.click()"
      />
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        multiple
        class="hidden"
        @change="onFilesChosen"
      />
      <span v-if="orderChanged" class="text-sm text-surface-500">
        Save or reset the new order before adding or deleting images.
      </span>
    </div>
  </section>
</template>
