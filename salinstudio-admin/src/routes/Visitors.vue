<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { DataTable, Column } from "primevue";
import { getRequest, refreshIfUnauthorized } from "../utils/requests";
import type { GetAllVisitorsRes } from "../types/data";

const { data, isFetching } = useQuery({
  queryKey: ["visitors"],
  queryFn: async () => {
    const res = await refreshIfUnauthorized<GetAllVisitorsRes>(
      async () => await getRequest("/visitor", { accessToken: true }),
    );
    if (!res) throw new Error();
    return res.visitors;
  },
});

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));

const formatLocation = (country: string, city: string) =>
  [city, country].filter(Boolean).join(", ") || "—";
</script>

<template>
  <div class="flex flex-col gap-6 w-full">
    <div class="px-3">
      <h1 class="text-2xl font-bold">Visitors</h1>
    </div>
    <DataTable
      :value="data?.filter((v) => !v.isTester)"
      :loading="isFetching"
      :rows="15"
      paginator
      :alwaysShowPaginator="false"
      stripedRows
      size="small"
      sortField="createdAt"
      :sortOrder="-1"
    >
      <Column field="country" header="Location" sortable>
        <template #body="{ data }">
          <span>{{ formatLocation(data.country, data.city) }}</span>
        </template>
      </Column>
      <Column header="Device" style="width: 6rem">
        <template #body="{ data }">
          <span class="flex items-center gap-1.5 text-surface-500">
            <i :class="data.isMobileUser ? 'pi pi-mobile' : 'pi pi-desktop'" />
            <span class="text-xs">{{ data.isMobileUser ? "Mobile" : "Desktop" }}</span>
          </span>
        </template>
      </Column>
      <Column header="VPN" style="width: 4rem">
        <template #body="{ data }">
          <span
            v-if="data.isUsingProxy"
            class="text-xs px-2 py-0.5 rounded bg-surface-200 text-surface-500 dark:bg-surface-700 dark:text-surface-400"
            >VPN</span
          >
          <span v-else class="text-surface-400 text-xs">—</span>
        </template>
      </Column>
      <Column header="Pages viewed" style="width: 8rem" sortable :sortField="(row) => row.actions.length">
        <template #body="{ data }">
          <span>{{ data.actions.length }}</span>
        </template>
      </Column>
      <Column field="createdAt" header="First visit" sortable>
        <template #body="{ data }">
          <span>{{ formatDate(data.createdAt) }}</span>
        </template>
      </Column>
      <Column header="Last visit" :sortField="(row) => row.actions[0]?.createdAt ?? row.createdAt" sortable>
        <template #body="{ data }">
          <span>{{ data.actions.length > 0 ? formatDate(data.actions[0].createdAt) : "—" }}</span>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
