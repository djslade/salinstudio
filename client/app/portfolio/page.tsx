"use client";
import { Gallery, Header } from "@/components";
import { languageAtom } from "@/state";
import { useAtomValue } from "jotai";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Art } from "@/types/Art";

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

const PortfolioOuter = () => {
  return (
    <Suspense>
      <Portfolio />
    </Suspense>
  );
};

const Portfolio = () => {
  const { data } = useQuery({
    queryKey: ["gallery"],
    queryFn: async () => {
      const res = await fetch("/api/art");
      const data = await res.json();
      return data.art as Art[];
    },
  });

  const searchParams = useSearchParams();

  const query = searchParams.get("q");

  const language = useAtomValue(languageAtom);

  const router = useRouter();

  const getActiveImage = () => {
    if (!data) return [];
    if (!query) return data;
    return data.filter(
      (art) =>
        art.category === (query === "mixed-media" ? "mixed media" : query)
    );
  };

  return (
    <div className="">
      <Header />
      {data && (
        <section
          className="px-2 py-12 bg-darkest flex flex-col gap-12"
          style={{ minHeight: "calc(100vh - 230px)" }}
        >
          {getActiveImage().length > 0 && (
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
          )}
          {getActiveImage().length > 0 && (
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
          )}

          {getActiveImage().length === 0 ? (
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
          ) : (
            <Gallery images={getActiveImage()} />
          )}
        </section>
      )}
    </div>
  );
};

export default PortfolioOuter;
