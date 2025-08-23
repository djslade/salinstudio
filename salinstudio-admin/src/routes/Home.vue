<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { DataTable, Column } from "primevue";
import { getRequest } from "../utils/requests";

type Action = {
  id: string;
  type: string;
  path: string;
  tag: string;
  createdAt: Date;
  updatedAt: Date;
};

type Visitor = {
  id: string;
  continent: string;
  country: string;
  countryCode: string;
  city: string;
  timezone: string;
  isMobileUser: boolean;
  isUsingProxy: boolean;
  isTester: boolean;
  createdAt: Date;
  updatedAt: Date;
  actions: Action[];
};

type GetAllVisitorsRes = {
  visitors: Visitor[];
};

const { data, isFetching } = useQuery({
  queryKey: ["visitors"],
  queryFn: async () => {
    const res = await getRequest<GetAllVisitorsRes>("/visitor", {
      accessToken: true,
    });
    return res.visitors;
  },
});
</script>

<template>
  <div class="flex flex-col gap-3 w-full">
    <h1 class="font-bold text-2xl">Site visitors</h1>
    <DataTable
      class="w-full"
      :value="data"
      :loading="isFetching"
      :rows="12"
      paginator
      :alwaysShowPaginator="false"
    >
      <Column field="country" header="Country"> </Column>
      <Column field="city" header="City"></Column>
      <Column field="isMobileUser" header="Mobile user"></Column>
      <Column field="isUsingProxy" header="Proxy user"></Column>
      <Column field="createdAt" header="First visited"></Column>
    </DataTable>
  </div>
</template>

<style></style>
