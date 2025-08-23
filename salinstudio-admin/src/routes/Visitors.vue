<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { DataTable, Column } from "primevue";
import { getRequest } from "../utils/requests";
import type { GetAllVisitorsRes } from "../types/data";

const { data, isFetching } = useQuery({
  queryKey: ["visitors"],
  queryFn: async () => {
    const res = await getRequest<GetAllVisitorsRes>("/visitor", {
      accessToken: true,
    });
    return res.visitors;
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
      <h2 class="font-bold text-2xl">Site visitors</h2>
      <DataTable
        class="w-full"
        rowGroupMode=""
        :value="data?.filter((visitor) => visitor.actions.length > 0)"
        :loading="isFetching"
        :rows="12"
        paginator
        :alwaysShowPaginator="false"
      >
        <Column field="id" header="ID">
          <template #body="{ data }">
            <span>{{ data.id.split("-")[0] }}</span>
          </template>
        </Column>
        <Column field="country" header="Country"> </Column>
        <Column field="city" header="City"> </Column>
        <Column field="isMobileUser" header="Mobile user">
          <template #body="{ data }">
            <i
              :class="`pi ${data.isMobileUser ? 'pi-check' : 'pi-times'}`"
              :style="{ color: data.isMobileUser ? 'green' : 'red' }"
            ></i>
          </template>
        </Column>
        <Column field="isUsingProxy" header="VPN user">
          <template #body="{ data }">
            <i
              :class="`pi ${data.isUsingProxy ? 'pi-check' : 'pi-times'}`"
              :style="{ color: data.isUsingProxy ? 'green' : 'red' }"
            ></i>
          </template>
        </Column>
        <Column field="createdAt" header="First visited">
          <template #body="{ data }">
            <span>{{ formatDate(data.createdAt) }}</span>
          </template>
        </Column>
        <Column header="Last visited">
          <template #body="{ data }">
            <span v-if="data.actions.length > 0">{{
              formatDate(data.actions[0].createdAt)
            }}</span>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<style></style>
