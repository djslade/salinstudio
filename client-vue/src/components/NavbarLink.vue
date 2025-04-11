<script setup lang="ts">
import { useLanguageStore } from "@/store/language";
import { RouterLink } from "vue-router";
import type { DynamicText } from "@/types/dynamicText";

const { to, text } = defineProps<{ to: string; text: DynamicText }>();
const language = useLanguageStore();
</script>

<template>
  <RouterLink :to="to" className="hover:scale-110 transition-all">
    {{ language.isFi() ? text.fi : text.en }}
  </RouterLink>
</template>
