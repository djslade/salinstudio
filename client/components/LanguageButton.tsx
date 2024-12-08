"use client";
import { languageAtom } from "@/state";
import { useAtom } from "jotai";

export const LanguageButton = () => {
  const [language, setLanguage] = useAtom(languageAtom);

  const handleChangeLanguage = () => {
    setLanguage((prev) => (prev === "fi" ? "en" : "fi"));
  };

  return (
    <button
      className="absolute right-10 top-5 bg-[#3A3A3A] z-[1000] font-mono text-white px-5 py-1 flex justify-center"
      onClick={handleChangeLanguage}
    >
      {language === "fi" ? "En" : "Fi"}
    </button>
  );
};
