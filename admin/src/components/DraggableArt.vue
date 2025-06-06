<script setup lang="ts">
import { ref } from "vue";
import type { Art } from "../types/data";

const { art } = defineProps<{ art: Art }>();
const isDragging = ref<boolean>(false);
</script>

<template>
  <div class="">
    <img
      :src="art.thumbUrl"
      :alt="art.titleEn"
      :class="`rounded-xl w-full aspect-square object-cover ${
        isDragging && 'opacity-50'
      }`"
      @dragstart="isDragging = true"
      @dragend="isDragging = false"
    />
  </div>
</template>
