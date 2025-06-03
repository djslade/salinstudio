<script setup lang="ts"></script>

<template>
  <header class="footer">
    <div class="inner-footer"></div>
  </header>
</template>

<style scoped>
.footer {
  background-color: #211d18;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
}

.inner-footer {
  margin: 0 auto;
  width: 100%;
  max-width: 1200px;
  height: 5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav {
  display: flex;
  gap: 2.5rem;
}
</style>
