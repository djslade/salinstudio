"use client";
import { languageAtom } from "@/state";
import { useAtomValue } from "jotai";
import Link from "next/link";

const menuDrawings = {
  en: "Drawings",
  fi: "Piirustukset",
};

const menuPaintings = {
  en: "Paintings",
  fi: "Maalaukset",
};

const menuPastels = {
  en: "Pastels",
  fi: "Pastellit",
};

const menuDigital = {
  en: "Digital",
  fi: "Digitaaliset",
};

const menuMixedMedia = {
  en: "Mixed Media",
  fi: "Muut Mediat",
};

export const GalleryMenu = () => {
  const language = useAtomValue(languageAtom);

  return (
    <div className="flex justify-center w-full flex-1">
      <div className="grid-container">
        <Link className="grid-item" href="/portfolio?q=drawings">
          {language === "fi" ? menuDrawings.fi : menuDrawings.en}
        </Link>
        <Link className="grid-item" href="/portfolio?q=paintings">
          {language === "fi" ? menuPaintings.fi : menuPaintings.en}
        </Link>
        <Link className="grid-item" href="/portfolio?q=pastels">
          {language === "fi" ? menuPastels.fi : menuPastels.en}
        </Link>
        <Link className="grid-item" href="/portfolio?q=digital">
          {language === "fi" ? menuDigital.fi : menuDigital.en}
        </Link>
        <Link className="grid-item" href="/portfolio?q=mixed-media">
          {language === "fi" ? menuMixedMedia.fi : menuMixedMedia.en}
        </Link>
      </div>
    </div>
  );
};
