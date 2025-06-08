<script setup lang="ts">
import { ref } from "vue";
import type { Art } from "../types/data";
import {
  getRequest,
  patchRequest,
  putRequest,
  refreshIfUnauthorized,
  showRequestError,
} from "../utils/requests";
import { useQuery } from "@tanstack/vue-query";
import Button from "primevue/button";
import LoadingPanel from "../components/LoadingPanel.vue";
import Reorder from "../components/Reorder.vue";
import { useToast } from "primevue";
import Preview from "../components/Preview.vue";

enum Stage {
  Preview,
  Reorder,
  Submitting,
}

const stage = ref<Stage>(Stage.Preview);

const { data, refetch } = useQuery({
  queryKey: ["allArt"],
  queryFn: async () => {
    const res = await getRequest<{ art: Art[] }>("/art");
    return res.art as Art[];
  },
});

const toast = useToast();

const setToReorder = () => {
  stage.value = Stage.Reorder;
};

const setToPreview = () => {
  stage.value = Stage.Preview;
};

const updateArtOrder = async (art: Art[]) => {
  try {
    stage.value = Stage.Submitting;
    const ids = art.map((a) => a.id).reverse();
    await refreshIfUnauthorized(async () =>
      patchRequest("/art/order/all", { ids }, { accessToken: true })
    );
    await refetch();
    toast.add({
      group: "main",
      severity: "success",
      closable: true,
      summary: "Art order has been updated",
      life: 5000,
    });
    setToPreview();
  } catch (err) {
    toast.add(showRequestError(err));
    setToPreview();
  }
};

const updateOnHomeCarousel = async (art: Art, onHomeCarousel: boolean) => {
  try {
    await refreshIfUnauthorized(
      async () =>
        await putRequest(
          `/art/${art.id}`,
          {
            category: art.category,
            titleEn: art.titleEn,
            titleFi: art.titleFi,
            descriptionEn: art.descriptionEn,
            descriptionFi: art.descriptionFi,
            onHomeCarousel,
          },
          { accessToken: true }
        )
    );
    await refetch();
    toast.add({
      group: "main",
      severity: "success",
      closable: true,
      summary: "Home carousel has been updated",
      life: 5000,
    });
  } catch (err) {
    toast.add(showRequestError(err));
  }
};
</script>

<template>
  <div
    v-if="!data || stage === Stage.Submitting"
    class="flex w-full justify-center items-center"
  >
    <LoadingPanel />
  </div>
  <div
    v-if="data && stage !== Stage.Submitting"
    class="flex flex-col gap-4 w-full items-center"
  >
    <div class="flex justify-center gap-4">
      <Button
        v-if="stage === Stage.Preview"
        label="Change order"
        @click="setToReorder"
      />
    </div>
    <Reorder
      v-if="stage === Stage.Reorder && data"
      :art="data"
      :save="updateArtOrder"
      :cancel="setToPreview"
    />
    <Preview
      v-if="stage === Stage.Preview && data"
      :art="data"
      :update="updateOnHomeCarousel"
    />
  </div>
</template>
