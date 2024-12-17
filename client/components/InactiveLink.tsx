"use client";
import { languageAtom } from "@/state";
import { useAtomValue } from "jotai";
import { useState } from "react";

interface InactiveLinkProps {
  text: string;
}

const comingSoon = {
  en: "Coming soon!",
  fi: "Tulossa pian!",
};

export const InactiveLink = ({ text }: InactiveLinkProps) => {
  const language = useAtomValue(languageAtom);

  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <div className="relative">
      <span
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {text}
      </span>
      {isHovered && (
        <div className="absolute -bottom-[30px] whitespace-nowrap bg-homeGray px-3 font-sans text-[18px] left-1/2 -translate-x-1/2">
          <span>{language === "fi" ? comingSoon.fi : comingSoon.en}</span>
        </div>
      )}
    </div>
  );
};
