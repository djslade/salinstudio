<script setup lang="ts">
import NavLink from "./NavLink.vue";
import { Icon } from "@iconify/vue";
import { ref } from "vue";

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

const menuIsOpen = ref<boolean>(false);
</script>

<template>
  <header class="header">
    <button class="menu-btn" @click="() => (menuIsOpen = !menuIsOpen)">
      <div class="menu-btn-icon-container">
        <Icon
          :icon="menuIsOpen ? 'mdi-light:arrow-left' : 'mdi-light:menu'"
          class="menu-btn-icon"
          :inline="true"
        />
      </div>
    </button>
    -
    <div class=""></div>
    <div
      class="menu"
      :style="{
        width: menuIsOpen ? '100%' : '0',
        transitionDelay: menuIsOpen ? '0s' : '0.8s',
      }"
    >
      <div
        class="inner-menu"
        :style="{
          opacity: menuIsOpen ? '1' : '0',
          transitionDelay: menuIsOpen ? '0.8s' : '0s',
        }"
      >
        <NavLink
          v-for="link in links"
          :id="'link-id.' + link.label"
          :to="link.to"
          :label="link.label"
        />
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  background-color: transparent;
  position: absolute;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 16;
  padding: 3rem 6rem;
  justify-content: space-between;
}

.menu-btn {
  background-color: transparent;
  border: transparent;
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 20;
}

.menu-btn-icon-container {
  border: 1px solid #b4936f;
  border-radius: 50%;
  padding: 0.6rem;
}

.menu-btn-icon {
  color: #d0bfad;
  font-size: 1.5rem;
}

.menu {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 18;
  background-color: #1e1914;
  transition-property: all;
  transition-duration: 0.6s;
}

.inner-menu {
  padding: 3rem 6rem;
  transition-property: all;
  transition-duration: 0.6s;
  display: flex;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  height: 100%;
}
</style>
