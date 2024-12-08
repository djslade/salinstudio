import { atom } from "jotai";

type Language = "en" | "fi";

export const languageAtom = atom<Language     >("en");
