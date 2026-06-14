<script setup lang="ts">
import { computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { DataTable, Column } from "primevue";
import { getRequest, refreshIfUnauthorized } from "../utils/requests";
import { resolvePageName, buildArtSlugMap } from "../utils/routes";
import type { Action, Art } from "../types/data";

type GetAllActionsRes = {
  actions: Action[];
};

const { data: actions, isFetching: loadingActions } = useQuery({
  queryKey: ["actions"],
  queryFn: async () => {
    const res = await refreshIfUnauthorized<GetAllActionsRes>(
      async () => await getRequest("/action", { accessToken: true }),
    );
    if (!res) throw new Error();
    return res.actions;
  },
});

const { data: art } = useQuery({
  queryKey: ["allArt"],
  queryFn: async () => {
    const res = await getRequest<{ art: Art[] }>("/art");
    return res.art;
  },
});

const artBySlug = computed(() => buildArtSlugMap(art.value ?? []));

const realActions = computed(() =>
  actions.value?.filter((a) => !a.visitor?.isTester) ?? [],
);

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
</script>

<template>
  <div class="flex flex-col gap-6 w-full">
    <div class="px-3">
      <h1 class="text-2xl font-bold">Visitor actions</h1>
    </div>
    <DataTable
      :value="realActions"
      :loading="loadingActions"
      :rows="20"
      paginator
      :alwaysShowPaginator="false"
      stripedRows
      size="small"
      sortField="createdAt"
      :sortOrder="-1"
    >
      <Column header="Visitor" style="width: 8rem">
        <template #body="{ data }">
          <span class="font-mono text-xs text-surface-500">{{
            data.visitor?.id.split("-")[0] ?? "—"
          }}</span>
        </template>
      </Column>
      <Column header="Location" sortable :sortField="(row) => row.visitor?.country ?? ''">
        <template #body="{ data }">
          <span>{{
            [data.visitor?.city, data.visitor?.country].filter(Boolean).join(", ") || "—"
          }}</span>
        </template>
      </Column>
      <Column field="path" header="Page" sortable>
        <template #body="{ data }">
          <span>{{ resolvePageName(data.path, artBySlug) }}</span>
        </template>
      </Column>
      <Column field="type" header="Type" style="width: 7rem" sortable />
      <Column field="createdAt" header="Date" sortable>
        <template #body="{ data }">
          <span>{{ formatDate(data.createdAt) }}</span>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
