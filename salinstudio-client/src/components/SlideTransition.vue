<script setup lang="ts">
import type { UseSwipeDirection } from "@vueuse/core";

defineProps<{
  mode: "default" | "in-out" | "out-in";
  direction: UseSwipeDirection;
}>();

const disableScroll = () => {
  document.body.style.overflow = "hidden";
};
const enableScroll = () => {
  document.body.style.overflow = "";
};
</script>

<template>
  <Transition
    :name="direction"
    :mode="mode"
    @afterEnter="enableScroll"
    @beforeLeave="disableScroll"
  >
    <slot />
  </Transition>
</template>

<style scoped>
.left-enter-active,
.left-leave-active,
.right-enter-active,
.right-leave-active {
  transition: transform 0.3s, opacity 0.3s;
  position: absolute;
  width: 100%;
}

.left-enter-from,
.right-leave-to {
  transform: translateX(300px);
  opacity: 0;
}

.left-leave-to,
.right-enter-from {
  transform: translateX(-300px);
  opacity: 0;
}
</style>
