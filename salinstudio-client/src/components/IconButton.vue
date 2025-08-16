<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ref } from "vue";

defineProps<{
  label?: string;
  icon: string;
  onClick: () => void;
  iconAsText?: boolean;
  responsiveLabel?: boolean;
}>();

const isHovered = ref<boolean>(false);
</script>

<template>
  <button
    class="cta-btn"
    @click="onClick"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div
      v-if="iconAsText"
      :class="`cta-btn-language-container ${isHovered && 'hovered'}`"
    >
      <span class="cta-btn-language-span">{{ icon }}</span>
    </div>
    <div
      v-if="!iconAsText"
      :class="`cta-btn-icon-container ${isHovered && 'hovered'}`"
    >
      <Icon :icon="icon" class="cta-btn-icon" :inline="true" />
    </div>
    <span v-if="label && responsiveLabel" class="responsive-label">{{
      label
    }}</span>
    <span v-if="label && !responsiveLabel" class="cta-btn-text">{{
      label
    }}</span>
  </button>
</template>

<style scoped>
.cta-btn {
  background-color: transparent;
  border: transparent;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
}

.cta-btn-icon-container {
  border: 1px solid #b4936f;
  border-radius: 50%;
  padding: 0.5rem;
  transition-property: all;
  transition-duration: 0.4s;
}

.hovered {
  background-color: #b4936f;
}

.cta-btn-icon {
  color: #d0bfad;
  font-size: 1.5rem;
}

.cta-btn-text {
  text-transform: uppercase;
  letter-spacing: 3px;
  color: #d0bfad;
}

.cta-btn-responsive-text {
  display: none;
}

.cta-btn-language-container {
  border: 1px solid #b4936f;
  border-radius: 50%;
  padding: 0.5rem;
  transition-property: all;
  transition-duration: 0.4s;
  cursor: pointer;
  height: 2.625rem;
  width: 2.625rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cta-btn-language-span {
  color: #d0bfad;
  font-size: 0.75rem;
}

.responsive-label {
  text-transform: uppercase;
  letter-spacing: 3px;
  color: #d0bfad;
  display: none;
}

@media (min-width: 1200px) {
  .responsive-label {
    display: inline;
  }
}
</style>
