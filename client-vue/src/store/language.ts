import { defineStore } from "pinia";
import { Language } from "@/types/language";

export const useLanguageStore = defineStore("language", {
  state: () => ({ language: Language.FI }),
  actions: {
    isFi() {
      return this.language === Language.FI;
    },
    toggle() {
      this.language = this.isFi() ? Language.EN : Language.FI;
    },
  },
});
