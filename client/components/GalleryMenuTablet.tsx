"use client";

import { languageAtom } from "@/state";
import { useAtomValue } from "jotai";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

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

export const GalleryMenuTablet = () => {
  const language = useAtomValue(languageAtom);
  const searchParams = useSearchParams();

  const query = searchParams.get("q");

  return (
    <div className="midTablet:flex justify-center items-center gap-6 font-mono text-[18px] text-white hidden">
      <Link
        href="/portfolio?q=drawings"
        className={`${
          query === "images" ? "bg-activeGray" : ""
        } px-4 py-2 rounded-full`}
      >
        {language === "fi" ? menuDrawings.fi : menuDrawings.en}
      </Link>
      <Link
        href="/portfolio?q=paintings"
        className={`${
          query === "paintings" ? "bg-activeGray" : ""
        } px-4 py-2 rounded-full`}
      >
        {language === "fi" ? menuPaintings.fi : menuPaintings.en}
      </Link>
      <Link
        href="/portfolio?q=pastels"
        className={`${
          query === "pastels" ? "bg-activeGray" : ""
        } px-4 py-2 rounded-full`}
      >
        {language === "fi" ? menuPastels.fi : menuPastels.en}
      </Link>
      <Link
        href="/portfolio?q=digital"
        className={`${
          query === "digital" ? "bg-activeGray" : ""
        } px-4 py-2 rounded-full`}
      >
        {language === "fi" ? menuDigital.fi : menuDigital.en}
      </Link>
      <Link
        href="/portfolio?q=mixed-media"
        className={`${
          query === "mixed-media" ? "bg-activeGray" : ""
        } px-4 py-2 rounded-full`}
      >
        {language === "fi" ? menuMixedMedia.fi : menuMixedMedia.en}
      </Link>
    </div>
  );
};
