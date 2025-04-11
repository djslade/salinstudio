<script setup lang="ts">
import { useLanguageStore } from "@/store/language";
import type { DynamicText } from "@/types/dynamicText";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const { text } = defineProps<{ text: DynamicText }>();
const language = useLanguageStore();

const comingSoon: DynamicText = {
  en: "Coming soon!",
  fi: "Tulossa pian!",
};
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <span>{{ language.isFi() ? text.fi : text.en }}</span>
      </TooltipTrigger>
      <TooltipContent>
        <div className="font-sans text-[18px]">
          <span>{{ language.isFi() ? comingSoon.fi : comingSoon.en }}</span>
        </div>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
