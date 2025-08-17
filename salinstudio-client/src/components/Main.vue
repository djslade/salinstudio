<template>
  <main class="main">
    <slot name="content" />
  </main>
</template>

<style scoped>
.main {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 10rem);
  min-height: calc(100dvh - 10rem);
  padding: 2rem 1rem;
}
</style>
