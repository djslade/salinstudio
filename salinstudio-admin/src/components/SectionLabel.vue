<script setup lang="ts">
defineProps<{ label: string }>();
</script>

<template>
  <div class="flex items-center gap-3">
    <span class="text-xs font-semibold uppercase tracking-widest text-surface-400 dark:text-surface-500 shrink-0">
      {{ label }}
    </span>
    <div class="flex-1 h-px bg-surface-200 dark:bg-surface-700" />
  </div>
</template>
