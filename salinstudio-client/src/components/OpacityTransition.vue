<script setup lang="ts">
defineProps<{ mode: "default" | "in-out" | "out-in" }>();
</script>

<template>
  <Transition name="page-opacity" :mode="mode">
    <slot />
  </Transition>
</template>

<style scoped>
.page-opacity-enter-active,
.page-opacity-leave-active {
  transition-timing-function: ease;
  transition-duration: 400ms;
  transition-property: opacity;
}

.page-opacity-enter-from,
.page-opacity-leave-to {
  opacity: 0;
}
</style>
