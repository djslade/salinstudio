<script setup lang="ts">
import Header from "./Header.vue";
</script>

<template>
  <template>
    <div class="page">
      <Header />
      <slot name="main" />
    </div>
  </template>
</template>
