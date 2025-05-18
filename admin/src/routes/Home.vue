<script setup lang="ts">
import { getErrorResponseOrThrow, post, refreshTokens } from "../utils/auth";
import "../style.css";
import { useQuery } from "@tanstack/vue-query";
import type { UserResponse } from "../types/requests";

const { data, isFetching } = useQuery({
  queryKey: ["user"],
  queryFn: async () => {
    try {
      return await post<UserResponse, null>("/auth", null, {
        accessToken: true,
      });
    } catch (err) {
      const res = getErrorResponseOrThrow(err);
      if (res.statusCode !== 401) throw err;
      await refreshTokens();
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
