<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import Dialog from "primevue/dialog";
import { ref } from "vue";
import { type Collection } from "../types/data";
import { getRequest } from "../utils/requests";
import CollectionsTable from "../components/CollectionsTable.vue";
import EditCollectionDialog from "../components/EditCollectionDialog.vue";
import DeleteCollectionDialog from "../components/DeleteCollectionDialog.vue";

const editVisible = ref<boolean>(false);
const deleteVisible = ref<boolean>(false);

const focusedArt = ref<Collection | null>(null);

const { data, isFetching, refetch } = useQuery({
  queryKey: ["allCollections"],
  queryFn: async () => {
    const res = await getRequest<{ collections: Collection[] }>("/collection");
    return res.collections;
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
    <h1 class="font-bold text-2xl">Collections</h1>
    <CollectionsTable
      :data="data"
      :isFetching="isFetching"
      :handleEdit="handleEdit"
      :handleDelete="handleDelete"
      :refetch="refetch"
    />
  </div>
  <Dialog
    v-model:visible="editVisible"
    modal
    header="Edit collection"
    class="transition-all max-w-screen-sm w-full"
  >
    <EditCollectionDialog
      :collection="focusedArt!"
      :visible="editVisible"
      :cancel="() => (editVisible = false)"
      :close="closeEditDialog"
    />
  </Dialog>
  <Dialog
    v-model:visible="deleteVisible"
    modal
    header="Delete collection"
    class="transition-all max-w-screen-sm w-full"
  >
    <DeleteCollectionDialog
      :collection="focusedArt!"
      :cancel="() => (deleteVisible = false)"
      :close="closeDeleteDialog"
    />
  </Dialog>
</template>
