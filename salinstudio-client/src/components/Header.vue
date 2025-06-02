<script setup lang="ts">
import LogoLink from "./LogoLink.vue";
import NavLink from "./NavLink.vue";

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
  </header>
</template>

<style scoped>
.header {
  background-color: #211d18;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
}

.inner-header {
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
