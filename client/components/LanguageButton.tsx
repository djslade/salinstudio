"use client";
import { languageAtom } from "@/state";
import { useAtom } from "jotai";
import { useEffect } from "react";

interface LanguageButtonProps {
  mobile?: boolean;
}
export const LanguageButton = ({ mobile }: LanguageButtonProps) => {
  const [language, setLanguage] = useAtom(languageAtom);

  const handleChangeLanguage = () => {
    localStorage.setItem(
      "salinstudio-language",
      language === "fi" ? "en" : "fi"
    );
    setLanguage((prev) => (prev === "fi" ? "en" : "fi"));
  };

  useEffect(() => {
    const storedLanguage = localStorage.getItem("salinstudio-language");
    if (
      storedLanguage &&
      (storedLanguage === "fi" || storedLanguage === "en")
    ) {
      setLanguage(storedLanguage);
    } else {
      let inferredLanguage = "en";
      const userLanguage = navigator.language || navigator.languages[0];
      if (userLanguage.startsWith("fi")) {
        inferredLanguage = "fi";
      }
      localStorage.setItem("salinstudio-language", inferredLanguage);
      if (inferredLanguage === "en" || inferredLanguage === "fi") {
        setLanguage(inferredLanguage);
      }
    }
  }, []);

  return (
    <button
      className={`bg-formGray font-mono text-white px-5 py-1 justify-center ${
        mobile ? "flex tablet:hidden" : "hidden tablet:flex"
      }`}
      onClick={handleChangeLanguage}
    >
      {language === "fi" ? "English" : "Suomi"}
    </button>
  );
};
