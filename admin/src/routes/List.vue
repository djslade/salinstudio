<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import Dialog from "primevue/dialog";
import { ref } from "vue";
import { type Art } from "../types/data";
import EditArtDialog from "../components/EditArtDialog.vue";
import DeleteArtDialog from "../components/DeleteArtDialog.vue";
import { getRequest } from "../utils/requests";
import ArtTable from "../components/ArtTable.vue";

const editVisible = ref<boolean>(false);
const deleteVisible = ref<boolean>(false);

const focusedArt = ref<Art | null>(null);

const { data, isFetching, refetch } = useQuery({
  queryKey: ["allArt"],
  queryFn: async () => {
    const res = await getRequest<{ art: Art[] }>("/art");
    return res.art;
  },
});

const setFocusedArt = (id: string) => {
  const art = data.value?.filter((a) => a.id === id)[0];
  if (!art) return;
  focusedArt.value = art;
};

const handleEdit = (id: string) => {
  setFocusedArt(id);
  editVisible.value = true;
};

const handleDelete = (id: string) => {
  setFocusedArt(id);
  deleteVisible.value = true;
};

const closeEditDialog = async () => {
  editVisible.value = false;
  await refetch();
};

const closeDeleteDialog = async () => {
  deleteVisible.value = false;
  await refetch();
};
</script>

<template>
  <div class="flex flex-col gap-6 w-full">
    <h1 class="font-bold text-2xl">Published art</h1>
    <ArtTable
      :data="data"
      :isFetching="isFetching"
      :handleEdit="handleEdit"
      :handleDelete="handleDelete"
    />
  </div>
  <Dialog
    v-model:visible="editVisible"
    modal
    header="Edit art"
    class="transition-all max-w-screen-sm w-full"
  >
    <EditArtDialog
      :art="focusedArt!"
      :visible="editVisible"
      :cancel="() => (editVisible = false)"
      :close="closeEditDialog"
    />
  </Dialog>
  <Dialog
    v-model:visible="deleteVisible"
    modal
    header="Delete art"
    class="transition-all max-w-screen-sm w-full"
  >
    <DeleteArtDialog
      :art="focusedArt!"
      :cancel="() => (deleteVisible = false)"
      :close="closeDeleteDialog"
    />
  </Dialog>
</template>
