<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import Dialog from "primevue/dialog";
import { ref } from "vue";
import { type Purchasable } from "../types/data";
import { getRequest } from "../utils/requests";
import PurchasablesTable from "../components/PurchasablesTable.vue";
import EditPurchasableDialog from "../components/EditPurchasableDialog.vue";
import DeletePurchasableDialog from "../components/DeletePurchasableDialog.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const editVisible = ref<boolean>(false);
const deleteVisible = ref<boolean>(false);

const focusedArt = ref<Purchasable | null>(null);

const { data, isFetching, refetch } = useQuery({
  queryKey: ["allPurchasables"],
  queryFn: async () => {
    const res = await getRequest<{ purchasables: Purchasable[] }>(
      "/purchasable",
      { accessToken: true },
    );
    return res.purchasables;
  },
});

const setFocusedArt = (id: string) => {
  const art = data.value?.filter((a) => a.id === id)[0];
  if (!art) return;
  focusedArt.value = art;
};

const handleEdit = (id: string) => {
  router.push({ name: "StoreEdit", params: { id } });
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
    <h1 class="font-bold text-2xl">Store items</h1>
    <PurchasablesTable
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
    <EditPurchasableDialog
      :storeItem="focusedArt!"
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
    <DeletePurchasableDialog
      :storeItem="focusedArt!"
      :cancel="() => (deleteVisible = false)"
      :close="closeDeleteDialog"
    />
  </Dialog>
</template>
