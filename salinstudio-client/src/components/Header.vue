<script setup lang="ts">
import LogoLink from "./LogoLink.vue";
import NavLink from "./NavLink.vue";
import Divider from "./Divider.vue";

type Link = {
  to: string;
  label: string;
};

const links: Link[] = [
  {
    to: "/",
    label: "Home",
  },
  {
    to: "/about",
    label: "About",
  },
  {
    to: "/gallery",
    label: "Gallery",
  },
  {
    to: "/commissions",
    label: "Commissions",
  },
];
</script>

<template>
  <header class="header">
    <div class="inner-header">
      <LogoLink />
      <nav class="nav">
        <NavLink
          v-for="link in links"
          :key="link.label"
          :to="link.to"
          :label="link.label"
        />
      </nav>
    </div>
    <Divider />
  </header>
</template>

<style scoped>
.header {
  margin: 0 auto;
  width: 100%;
  max-width: 1200px;
}

.inner-header {
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
