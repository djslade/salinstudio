"use client";

import { languageAtom } from "@/state";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
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

export const GalleryMenuMobile = () => {
  const language = useAtomValue(languageAtom);
  const searchParams = useSearchParams();

  const router = useRouter();

  const query = searchParams.get("q");

  return (
    <div className="w-full midTablet:hidden text-[18px] font-sans">
      <select
        onChange={(evt) => router.push(`?q=${evt.target.value}`)}
        name=""
        id=""
        className="w-full px-3 py-2 bg-formGray text-white text-center"
        value={query || ""}
      >
        <option value="drawings">
          {language === "fi" ? menuDrawings.fi : menuDrawings.en}
        </option>
        <option value="paintings">
          {language === "fi" ? menuPaintings.fi : menuPaintings.en}
        </option>
        <option value="pastels">
          {language === "fi" ? menuPastels.fi : menuPastels.en}
        </option>
        <option value="digital">
          {language === "fi" ? menuDigital.fi : menuDigital.en}
        </option>
        <option value="mixed-media">
          {language === "fi" ? menuMixedMedia.fi : menuMixedMedia.en}
        </option>
      </select>
    </div>
  );
};
