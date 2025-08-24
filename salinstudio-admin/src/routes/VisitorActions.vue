<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { DataTable, Column } from "primevue";
import { getRequest, refreshIfUnauthorized } from "../utils/requests";
import type { Action } from "../types/data";

type GetAllActionsRes = {
  actions: Action[];
};

const { data, isFetching } = useQuery({
  queryKey: ["actions"],
  queryFn: async () => {
    const res = await refreshIfUnauthorized<GetAllActionsRes>(
      async () =>
        await getRequest("/action", {
          accessToken: true,
        })
    );
    if (!res) throw new Error();
    return res.actions;
  },
});

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
};
</script>

<template>
  <div class="flex flex-col gap-12 w-full">
    <div class="flex flex-col gap-6 w-full">
      <h2 class="font-bold text-2xl">Visitor actions</h2>
      <DataTable
        class="w-full"
        rowGroupMode="rowspan"
        groupRowsBy="visitor.id"
        :value="data"
        :loading="isFetching"
      >
        <Column field="visitor" header="Visitor" class="w-min">
          <template #body="{ data }">
            <div class="grid grid-cols-2">
              <div class="flex flex-col gap-2">
                <span>ID</span><span>Country</span><span>City</span>
              </div>
              <div class="flex flex-col gap-2">
                <span>{{ data.visitor.id.split("-")[0] }}</span>
                <span>{{ data.visitor.country }}</span>
                <span>{{ data.visitor.city }}</span>
              </div>
            </div>
          </template>
        </Column>
        <Column field="path" header="Path"> </Column>
        <Column field="createdAt" header="Date logged">
          <template #body="{ data }">
            <span>{{ formatDate(data.createdAt) }}</span>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<style></style>
