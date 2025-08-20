<script setup lang="ts">
import NavLink from "./NavLink.vue";
import { onMounted, onUnmounted, ref } from "vue";
import IconButton from "./IconButton.vue";
import { useLanguageStore } from "../store/language";
import Underlay from "./Underlay.vue";
import type { Position } from "../types/position";

type Link = {
  to: string;
  label: string;
  labelFi: string;
};

defineProps<{
  position: Position;
  heading?: string;
  transparent?: boolean;
  currentRoute?: "Home" | "About" | "Gallery" | "Commissions" | "Contact";
}>();

const prevYOffset = ref<number>(window.pageYOffset);

const isHidden = ref<boolean>(false);

const language = useLanguageStore();

const links: Link[] = [
  {
    to: "/",
    label: "Home",
    labelFi: "Etusivu",
  },
  {
    to: "/about",
    label: "About",
    labelFi: "Tietoa",
  },
  {
    to: "/gallery",
    label: "Gallery",
    labelFi: "Galleria",
  },
  {
    to: "/commissions",
    label: "Commissions",
    labelFi: "Tilaustyöt",
  },
  {
    to: "/contact",
    label: "Contact",
    labelFi: "Yhteys",
  },
];

const menuIsOpen = ref<boolean>(false);

const handleOpenMenu = () => {
  if (menuIsOpen.value) return;
  menuIsOpen.value = true;
};

const handleCloseMenu = () => {
  if (!menuIsOpen.value) return;
  menuIsOpen.value = false;
};

const handleScroll = () => {
  if (menuIsOpen.value) return;

  const newYOffset = window.pageYOffset;
  const delta = newYOffset - prevYOffset.value;

  if (Math.abs(delta) < 5 || newYOffset < 160) return;
  if (newYOffset > prevYOffset.value) {
    if (!isHidden.value) isHidden.value = true;
  }
  if (newYOffset < prevYOffset.value) {
    if (isHidden.value) isHidden.value = false;
  }
  prevYOffset.value = newYOffset;
};

onMounted(() => {
  document.addEventListener("scroll", handleScroll, { passive: true });
});

onUnmounted(() => {
  document.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <header
    class="header"
    :style="{
      position,
      opacity: isHidden ? 0 : 1,
      backgroundColor: transparent ? 'transparent' : '#261f19',
    }"
  >
    <Underlay v-if="menuIsOpen" :onClick="handleCloseMenu" />
    <div class="menu-btn-container">
      <IconButton :onClick="handleOpenMenu" icon="mdi-light:menu" />
    </div>
    <div class="heading-container">
      <h1 v-if="heading" class="page-heading">{{ heading }}</h1>
    </div>
    <div class="fixture-container">
      <slot name="fixture" />
    </div>
    <div
      class="mobile-menu"
      :style="{
        width: menuIsOpen ? '100%' : '0',
        transitionDelay: menuIsOpen ? '0s' : '0.8s',
      }"
    >
      <div
        class="mobile-inner-menu"
        :style="{
          opacity: menuIsOpen ? '1' : '0',
          visibility: menuIsOpen ? 'visible' : 'hidden',
          transitionDelay: menuIsOpen ? '0.8s' : '0s',
        }"
      >
        <IconButton :onClick="handleCloseMenu" icon="mdi-light:arrow-left" />
        <div class="mobile-menu-links-container">
          <NavLink
            :is-current-route="currentRoute === link.label"
            v-for="link in links"
            :id="'link-id.' + link.label"
            :to="link.to"
            :label="language.isEn() ? link.label : link.labelFi"
          />
        </div>
        <IconButton
          v-if="language.isEn()"
          iconAsText
          :onClick="language.toFi"
          icon="EN"
        />
        <IconButton
          v-if="language.isFi()"
          iconAsText
          :onClick="language.toEn"
          icon="FI"
        />
      </div>
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
        <IconButton :onClick="handleCloseMenu" icon="mdi-light:arrow-left" />
        <div class="menu-links-container">
          <NavLink
            :is-current-route="currentRoute === link.label"
            v-for="link in links"
            :id="'link-id.' + link.label"
            :to="link.to"
            :label="language.isEn() ? link.label : link.labelFi"
          />
        </div>
        <IconButton
          v-if="language.isEn()"
          iconAsText
          :onClick="language.toFi"
          icon="EN"
        />
        <IconButton
          v-if="language.isFi()"
          iconAsText
          :onClick="language.toEn"
          icon="FI"
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
  padding: 2rem;
  height: 5rem;
  transition-property: all;
  transition-duration: 0.3s;
  gap: 2rem;
}

.menu-btn-container {
  flex: unset;
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
  overflow: hidden;
}

.page-heading {
  color: #b4936f;
  font-size: 0.8rem;
  letter-spacing: 8px;
  text-transform: uppercase;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.menu {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 18;
  background-color: #1e1914;
  transition-property: all;
  transition-duration: 0.6s;
}

.mobile-menu-underlay {
  z-index: 5;
  position: fixed;
  inset: 0;
  background-color: transparent;
}

.mobile-menu {
  display: flex;
  max-width: 300px;
  background-color: #1e1914;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  transition-property: all;
  transition-duration: 0.6s;
  z-index: 10;
  height: 100dvh;
}

.inner-menu {
  padding: 2rem 6rem;
  transition-property: all;
  transition-duration: 0.6s;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  height: 100%;
  width: 100%;
}

.menu-links-container {
  display: flex;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  height: 100%;
}

.mobile-menu-links-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;
  height: 100%;
}

.mobile-inner-menu {
  transition-property: all;
  transition-duration: 0.6s;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;
  height: 100%;
  width: 100%;
  padding: 2rem;
}

.fixture-container {
  display: flex;
  justify-content: end;
}

.menu-btn-language-span-container {
  height: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.menu-btn-language-container {
  border: 1px solid #b4936f;
  border-radius: 50%;
  padding: 0.5rem;
  background-color: #1e1914;
  transition-property: all;
  transition-duration: 0.2s;
  cursor: pointer;
  height: 2.625rem;
  width: 2.625rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.menu-btn-language-container:hover {
  background-color: #b4936f;
}

.menu-btn-language-span {
  color: #d0bfad;
  font-size: 0.75rem;
}

@media (min-width: 600px) {
  .header {
    padding: 2rem 4rem;
  }

  .page-heading {
    font-size: 1rem;
    display: inline;
  }
}

@media (min-width: 900px) {
  .header {
    padding: 2rem 6rem;
  }

  .menu {
    display: flex;
    justify-content: center;
  }

  .mobile-menu {
    display: none;
  }

  .mobile-menu-underlay {
    display: none;
  }

  .page-heading {
    font-size: 1.2rem;
    display: inline;
  }
}

@media (min-width: 1200px) {
  .menu-btn-container {
    flex: 1;
  }

  .fixture-container {
    flex: 1;
  }
}
</style>
