<script setup lang="ts">
import NavLink from "./NavLink.vue";
import { Icon } from "@iconify/vue";
import { onMounted, onUnmounted, ref } from "vue";

type Link = {
  to: string;
  label: string;
  currentRoute?: "Home" | "About" | "Gallery" | "Commissions";
};

type Position = "fixed" | "sticky";

defineProps<{ position: Position; heading?: string }>();

const prevYOffset = ref<number>(window.pageYOffset);

const isHidden = ref<boolean>(false);

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

const handleScroll = () => {
  const newYOffset = window.pageYOffset;
  if (newYOffset > prevYOffset.value) {
    if (!isHidden.value) isHidden.value = true;
  }
  if (newYOffset < prevYOffset.value) {
    if (isHidden.value) isHidden.value = false;
  }
  prevYOffset.value = newYOffset;
};

onMounted(() => {
  document.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  document.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <header class="header" :style="{ position, opacity: isHidden ? 0 : 1 }">
    <div class="menu-btn-container">
      <button class="menu-btn" @click="() => (menuIsOpen = !menuIsOpen)">
        <div class="menu-btn-icon-container">
          <Icon
            :icon="menuIsOpen ? 'mdi-light:arrow-left' : 'mdi-light:menu'"
            class="menu-btn-icon"
            :inline="true"
          />
        </div>
      </button>
    </div>

    <div class="heading-container">
      <h1 v-if="heading" class="page-heading">{{ heading }}</h1>
    </div>
    <div class="fixture-container">
      <slot name="fixture" />
    </div>
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
          visibility: menuIsOpen ? 'visible' : 'hidden',
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
  position: fixed;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 16;
  padding: 2rem 6rem;
  height: 5rem;
  transition-property: all;
  transition-duration: 0.3s;
  background-color: #261f19;
}

.menu-btn-container {
  flex: 1;
  position: relative;
  z-index: 20;
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
  padding: 0.5rem;
  background-color: #1e1914;
  transition-property: all;
  transition-duration: 0.2s;
  cursor: pointer;
}

.menu-btn-icon-container:hover {
  background-color: #b4936f;
}

.menu-btn-icon {
  color: #d0bfad;
  font-size: 1.5rem;
}

.heading-container {
  text-align: center;
  flex: 1;
}

.page-heading {
  color: #b4936f;
  font-size: 1.2rem;
  letter-spacing: 8px;
  text-transform: uppercase;
  text-align: center;
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
  padding: 2rem 6rem;
  transition-property: all;
  transition-duration: 0.6s;
  display: flex;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  height: 100%;
}

.fixture-container {
  flex: 1;
  display: flex;
  justify-content: end;
}
</style>
