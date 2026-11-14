<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { Button, Message, useToast } from "primevue";
import {
  getRequest,
  putRequest,
  refreshIfUnauthorized,
  showRequestError,
} from "../utils/requests";
import type { Art } from "../types/data";
import CarouselPreview from "../components/CarouselPreview.vue";
import ImageOrderList, {
  type OrderItem,
} from "../components/ImageOrderList.vue";
import AddToCarouselDialog from "../components/AddToCarouselDialog.vue";
import LoadingPanel from "../components/LoadingPanel.vue";
import { useUnsavedChanges } from "../hooks/useUnsavedChanges";

const toast = useToast();
const queryClient = useQueryClient();

const { data: carouselArt } = useQuery({
  queryKey: ["carouselArt"],
  queryFn: async () => {
    const res = await getRequest<{ art: Art[] }>("/art/carousel");
    return res.art;
  },
});

// Same query as the Gallery page, so both stay in sync.
const { data: allArt } = useQuery({
  queryKey: ["allArt"],
  queryFn: async () => {
    const res = await getRequest<{ art: Art[] }>("/art");
    return res.art;
  },
});

const editing = ref(false);
const saving = ref(false);
const addDialogVisible = ref(false);

// The ordered ids of the carousel being edited.
const draftIds = ref<string[]>([]);
const { isDirty, markSaved } = useUnsavedChanges(draftIds);

const resetDraft = () => {
  draftIds.value = carouselArt.value?.map((a) => a.id) ?? [];
  markSaved();
};

// Follow the server while not editing; never overwrite edits in progress.
watch(
  carouselArt,
  () => {
    if (!editing.value) resetDraft();
  },
  { immediate: true },
);

const artById = computed(() => {
  const map = new Map<string, Art>();
  for (const a of carouselArt.value ?? []) map.set(a.id, a);
  for (const a of allArt.value ?? []) map.set(a.id, a);
  return map;
});

const draftArt = computed(() =>
  draftIds.value
    .map((id) => artById.value.get(id))
    .filter((a): a is Art => a !== undefined),
);

const orderItems = computed<OrderItem[]>({
  get: () =>
    draftArt.value.map((a) => ({ id: a.id, url: a.image.thumbUrl })),
  set: (items) => {
    draftIds.value = items.map((i) => i.id);
  },
});

const addableArt = computed(() =>
  (allArt.value ?? []).filter((a) => !draftIds.value.includes(a.id)),
);

const startEditing = () => {
  resetDraft();
  editing.value = true;
};

const cancel = () => {
  editing.value = false;
  resetDraft();
};

const remove = (id: string) => {
  draftIds.value = draftIds.value.filter((d) => d !== id);
};

const add = (ids: string[]) => {
  draftIds.value = [
    ...draftIds.value,
    ...ids.filter((id) => !draftIds.value.includes(id)),
  ];
};

const save = async () => {
  saving.value = true;
  try {
    await refreshIfUnauthorized(
      async () =>
        await putRequest(
          "/art/carousel",
          { ids: draftIds.value },
          { accessToken: true },
        ),
    );
    markSaved();
    editing.value = false;
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["carouselArt"] }),
      queryClient.invalidateQueries({ queryKey: ["allArt"] }),
    ]);
    toast.add({
      group: "main",
      severity: "success",
      closable: true,
      summary: "Home carousel has been updated",
      life: 5000,
    });
  } catch (err) {
    toast.add(showRequestError(err));
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col gap-6 w-full max-w-7xl">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <h1 class="font-bold text-2xl">Carousel</h1>
      <div class="flex gap-2">
        <Button
          v-if="!editing"
          label="Edit carousel"
          icon="pi pi-pencil"
          :disabled="!carouselArt || !allArt"
          @click="startEditing"
        />
        <template v-else>
          <Button
            label="Cancel"
            severity="secondary"
            :disabled="saving"
            @click="cancel"
          />
          <Button
            label="Save"
            icon="pi pi-check"
            :loading="saving"
            :disabled="!isDirty"
            @click="save"
          />
        </template>
      </div>
    </div>

    <LoadingPanel v-if="!carouselArt" />

    <template v-else>
      <section v-if="editing" class="flex flex-col gap-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <p class="text-sm text-surface-500">
            Drag to reorder. Slides play in this order, starting from the first.
          </p>
          <Button
            label="Add artwork"
            icon="pi pi-plus"
            size="small"
            severity="secondary"
            :disabled="saving"
            @click="addDialogVisible = true"
          />
        </div>
        <ImageOrderList
          v-if="orderItems.length > 0"
          v-model="orderItems"
          lead-label="First"
          remove-label="Remove from carousel"
          :disabled="saving"
          @remove="remove"
        />
      </section>

      <Message v-if="draftArt.length === 0" severity="info" :closable="false">
        The carousel is empty, so the homepage shows all art instead.
      </Message>
      <CarouselPreview
        v-else
        :key="draftIds.join()"
        :art="draftArt"
      />
    </template>

    <AddToCarouselDialog
      v-model:visible="addDialogVisible"
      :art="addableArt"
      @add="add"
    />
  </div>
</template>
