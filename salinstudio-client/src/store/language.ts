import { defineStore } from "pinia";

export const useLanguageStore = defineStore("language", {
  state: () => {
    return { language: "fi" };
  },
  actions: {
    set(newLanguage: "en" | "fi") {
      this.language = newLanguage;
      localStorage.setItem("salinstudio-language", newLanguage);
    },
    isEn() {
      return this.language === "en";
    },
    isFi() {
      return this.language === "fi";
    },
    toEn() {
      this.language = "en";
      localStorage.setItem("salinstudio-language", "en");
    },
    toFi() {
      this.language = "fi";
      localStorage.setItem("salinstudio-language", "fi");
    },
    init() {
      const storedLanguage = localStorage.getItem("salinstudio-language");
      if (!storedLanguage) {
        const userLang = navigator.language;
        if (userLang.startsWith("fi")) {
          this.toFi();
        } else {
          this.toEn();
        }
      } else {
        if (storedLanguage === "fi") {
          this.toFi();
        } else {
          this.toEn();
        }
      }
    },
  },
});
