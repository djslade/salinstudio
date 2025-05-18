<script setup lang="ts">
import { useRouter } from "vue-router";
import { sendLogoutRequest } from "../utils/auth";
import { clearTokens } from "../utils/tokens";
import { Button, Menu } from "primevue";

const router = useRouter();

const handleLogout = async () => {
  try {
    await sendLogoutRequest();
  } finally {
    clearTokens();
    router.push({ name: "Login" });
  }
};
</script>
]
<template>
  <header>
    <Menu
      class="w-full flex justify-end px-5 py-3 bg-[#18181b] h-20 items-center"
    >
      <template #end>
        <Button label="Logout" @click="handleLogout" />
      </template>
    </Menu>
  </header>
</template>
