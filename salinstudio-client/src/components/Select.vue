<script setup lang="ts">
import { ref } from "vue";
import { useLanguageStore } from "../store/language";

type Option = {
  value: string;
  label: string;
  labelFi: string;
};

defineProps<{
  value: string;
  onChange: (evt: any) => void;
  options: Option[];
}>();

const isHovered = ref<boolean>(false);

const language = useLanguageStore();
</script>

<template>
  <div
    class="select-container"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <label for="category" class="select-label">Filter</label>
    <select
      name="category"
      id="category"
      class="select"
      :value="value"
      @change="onChange"
    >
      <option
        v-for="(option, idx) in options"
        :key="`${option.value}.${idx}`"
        :value="option.value"
        class="option"
      >
        {{ language.isEn() ? option.label : option.labelFi }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.select-container {
  display: flex;
  color: #b4936f;
  gap: 1.5rem;
  align-items: center;
}

.select-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 3px;
  display: none;
}

.select {
  background-color: #261f19;
  color: #d0bfad;
  border: 1px solid #b4936f;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-align: center;
  font-family: sans-serif;
  /* for Firefox */
  -moz-appearance: none;
  /* for Chrome */
  -webkit-appearance: none;
  appearance: none;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
}

.option {
  text-transform: none;
  font-size: 0.8rem;
  text-align: left;
  font-family: sans-serif;
}

@media (min-width: 600px) {
  .select {
    font-size: 0.75rem;
  }
}

@media (min-width: 900px) {
  .category-select-label {
    display: inline;
  }

  .select {
    font-size: 0.8rem;
  }
}
</style>
