<script setup lang="ts">
import NavbarLink from "./NavbarLink.vue";
import InactiveLink from "./InactiveLink.vue";

const home = {
  en: "Home",
  fi: "Koti",
};

const info = {
  en: "About",
  fi: "Tietoa",
};

const portfolio = {
  en: "Gallery",
  fi: "Galleria",
};

const blog = {
  en: "Blog",
  fi: "Blogi",
};

const buy = {
  en: "Buy",
  fi: "Osta",
};
</script>

<template>
  <div className="w-full text-white self-center flex flex-col">
    <div className="flex w-full font-cursive justify-between text-[32px] px-20">
      <NavbarLink to="/" :text="home" />
      <NavbarLink to="/about" :text="info" />
      <NavbarLink to="/gallery" :text="portfolio" />
      <InactiveLink :text="blog" />
      <InactiveLink :text="buy" />
    </div>
    <div className="px-16 w-full">
      <hr className="self-center" />
    </div>
  </div>
</template>
