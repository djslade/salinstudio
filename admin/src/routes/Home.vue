<script setup lang="ts">
import { useRouter } from "vue-router";
import {
  getErrorResponseOrThrow,
  refreshTokens,
  sendUserRequest,
} from "../utils/auth";
import "../style.css";
import { useQuery } from "@tanstack/vue-query";

const router = useRouter();

const { data, isFetching } = useQuery({
  queryKey: ["user"],
  queryFn: async () => {
    try {
      return await sendUserRequest();
    } catch (err) {
      const res = getErrorResponseOrThrow(err);
      if (res.statusCode !== 401) throw err;
      await refreshTokens(() => router.push({ name: "Login" }));
    }
  },
  retry: 1,
});
</script>

<template>
  <div v-if="isFetching">
    <h1>Loading...</h1>
  </div>
  <div v-if="!isFetching && data" class="flex">
    <h1 class="text-2xl font-bold">Hi {{ data.user.username }}!</h1>
  </div>
</template>

<style></style>
