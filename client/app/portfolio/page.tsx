"use client";
import { Gallery, Header } from "@/components";
import { languageAtom } from "@/state";
import { useAtomValue } from "jotai";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// TODO
const images = [
  {
    index: 0,
    src: "/drawings-25.jpg",
    srcThumb: "/drawings-25-thumb.jpg",
    srcMobile: "/drawings-25-mobile.jpg",
    name: {
      en: "Commissioned artwork",
      fi: "Tilattu taideteos",
    },
  },
  {
    index: 1,
    src: "/drawings-24.jpg",
    srcThumb: "/drawings-24-thumb.jpg",
    srcMobile: "/drawings-24-mobile.jpg",
    name: {
      en: "Schoolwork",
      fi: "Koulu tehtävä",
    },
  },
  {
    index: 2,
    src: "/drawings-head.jpg",
    srcThumb: "/drawings-head-thumb.jpg",
    srcMobile: "/drawings-head-mobile.jpg",
    name: {
      en: "Schoolwork",
      fi: "Koulu tehtävä",
    },
  },
  {
    index: 3,
    src: "/drawings-1.jpg",
    srcThumb: "/drawings-1_thumb.jpg",
    srcMobile: "/drawings-1_mobile.jpg",
    name: {
      en: '"Insurmountable"',
      fi: '"Ylitsepääsemätön"',
    },
  },
  {
    index: 4,
    src: "/drawings-2.jpg",
    srcThumb: "/drawings-2_thumb.jpg",
    srcMobile: "/drawings-2_mobile.jpg",
    name: {
      en: "Copy",
      fi: "Referenssikuva",
    },
  },
  {
    index: 5,
    src: "/drawings-3.jpg",
    srcThumb: "/drawings-3_thumb.jpg",
    srcMobile: "/drawings-3_mobile.jpg",
    name: {
      en: "Schoolwork",
      fi: "Koulu tehtävä",
    },
  },
  {
    index: 6,
    src: "/drawings-4.jpg",
    srcThumb: "/drawings-4_thumb.jpg",
    srcMobile: "/drawings-4_mobile.jpg",
    name: {
      en: 'Inktober 2023 "Golden"',
      fi: 'Inktober 2023 "Kultainen"',
    },
  },
  {
    index: 7,
    src: "/drawings-5.jpg",
    srcThumb: "/drawings-5_thumb.jpg",
    srcMobile: "/drawings-5_mobile.jpg",
    name: {
      en: "Protect thy brother",
      fi: "Suojele veljeäsi",
    },
  },
  {
    index: 8,
    src: "/drawings-6.jpg",
    srcThumb: "/drawings-6_thumb.jpg",
    srcMobile: "/drawings-6_mobile.jpg",
    name: {
      en: "Copy",
      fi: "Referenssikuva",
    },
  },
  {
    index: 9,
    src: "/drawings-7.jpg",
    srcThumb: "/drawings-7_thumb.jpg",
    srcMobile: "/drawings-7_mobile.jpg",
    name: {
      en: "Schoolwork",
      fi: "Koulu tehtävä",
    },
  },
  {
    index: 10,
    src: "/drawings-8.jpg",
    srcThumb: "/drawings-8_thumb.jpg",
    srcMobile: "/drawings-8_mobile.jpg",
    name: {
      en: '"Christina"',
      fi: '"Christina"',
    },
  },
  {
    index: 11,
    src: "/drawings-9.jpg",
    srcThumb: "/drawings-9_thumb.jpg",
    srcMobile: "/drawings-9_mobile.jpg",
    name: {
      en: "Schoolwork",
      fi: "Koulu tehtävä",
    },
  },
  {
    index: 12,
    src: "/drawings-10.jpg",
    srcThumb: "/drawings-10_thumb.jpg",
    srcMobile: "/drawings-10_mobile.jpg",
    name: {
      en: "Copy",
      fi: "Referenssikuva",
    },
  },
  {
    index: 13,
    src: "/drawings-11.jpg",
    srcThumb: "/drawings-11_thumb.jpg",
    srcMobile: "/drawings-11_mobile.jpg",
    name: {
      en: '"What could have been"',
      fi: '"Mikä olisi voinut olla"',
    },
  },
  {
    index: 14,
    src: "/drawings-12.jpg",
    srcThumb: "/drawings-12_thumb.jpg",
    srcMobile: "/drawings-12_mobile.jpg",
    name: {
      en: "Copy",
      fi: "Referenssikuva",
    },
  },
  {
    index: 15,
    src: "/drawings-13.jpg",
    srcThumb: "/drawings-13_thumb.jpg",
    srcMobile: "/drawings-13_mobile.jpg",
    name: {
      en: "Copy",
      fi: "Referenssikuva",
    },
  },
  {
    index: 16,
    src: "/drawings-14.jpg",
    srcThumb: "/drawings-14_thumb.jpg",
    srcMobile: "/drawings-14_mobile.jpg",
    name: {
      en: '"Mother and son"',
      fi: '"Äiti ja poika"',
    },
  },
  {
    index: 17,
    src: "/drawings-15.jpg",
    srcThumb: "/drawings-15_thumb.jpg",
    srcMobile: "/drawings-15_mobile.jpg",
    name: {
      en: "Copy",
      fi: "Referenssikuva",
    },
  },
  {
    index: 18,
    src: "/drawings-16.jpg",
    srcThumb: "/drawings-16_thumb.jpg",
    srcMobile: "/drawings-16_mobile.jpg",
    name: {
      en: '"Bella"',
      fi: '"Bella"',
    },
  },
  {
    index: 19,
    src: "/drawings-17.jpg",
    srcThumb: "/drawings-17_thumb.jpg",
    srcMobile: "/drawings-17_mobile.jpg",
    name: {
      en: '"HAN"',
      fi: '"HAN"',
    },
  },
  {
    index: 20,
    src: "/drawings-18.jpg",
    srcThumb: "/drawings-18_thumb.jpg",
    srcMobile: "/drawings-18_mobile.jpg",
    name: {
      en: "Copy",
      fi: "Referenssikuva",
    },
  },
  {
    index: 21,
    src: "/drawings-19.jpg",
    srcThumb: "/drawings-19_thumb.jpg",
    srcMobile: "/drawings-19_mobile.jpg",
    name: {
      en: "Copy",
      fi: "Referenssikuva",
    },
  },
  {
    index: 22,
    src: "/drawings-20.jpg",
    srcThumb: "/drawings-20_thumb.jpg",
    srcMobile: "/drawings-20_mobile.jpg",
    name: {
      en: '"You are my future"',
      fi: '"Sinä olet tulevaisuuteni"',
    },
  },
  {
    index: 23,
    src: "/drawings-21.jpg",
    srcThumb: "/drawings-21_thumb.jpg",
    srcMobile: "/drawings-21_mobile.jpg",
    name: {
      en: "Copy",
      fi: "Referenssikuva",
    },
  },
  {
    index: 24,
    src: "/drawings-22.jpg",
    srcThumb: "/drawings-22_thumb.jpg",
    srcMobile: "/drawings-22_mobile.jpg",
    name: {
      en: "Copy",
      fi: "Referenssikuva",
    },
  },
  {
    index: 25,
    src: "/drawings-23.jpg",
    srcThumb: "/drawings-23_thumb.jpg",
    srcMobile: "/drawings-23_mobile.jpg",
    name: {
      en: 'Inktober 2023 "Bounce"',
      fi: 'Inktober 2023 "Pomppu"',
    },
  },
];

const paintings = [
  {
    index: 0,
    src: "/paintings-1.jpg",
    srcThumb: "/paintings-1_thumb.jpg",
    srcMobile: "/paintings-1_mobile.jpg",
    name: {
      en: "Schoolwork",
      fi: "Koulu tehtävä",
    },
  },
  {
    index: 1,
    src: "/paintings-2.jpg",
    srcThumb: "/paintings-2_thumb.jpg",
    srcMobile: "/paintings-2_mobile.jpg",
    name: {
      en: "Schoolwork",
      fi: "Koulu tehtävä",
    },
  },
  {
    index: 2,
    src: "/paintings-3.jpg",
    srcThumb: "/paintings-3_thumb.jpg",
    srcMobile: "/paintings-3_mobile.jpg",
    name: {
      en: "Schoolwork",
      fi: "Koulu tehtävä",
    },
  },
  {
    index: 3,
    src: "/paintings-4.jpg",
    srcThumb: "/paintings-4_thumb.jpg",
    srcMobile: "/paintings-4_mobile.jpg",
    name: {
      en: 'Painted "Insurmountable"',
      fi: 'Maalattu "Ylitsepääsemätön"',
    },
  },
];

const pastels = [
  {
    index: 0,
    src: "/pastels-1.jpg",
    srcThumb: "/pastels-1_thumb.jpg",
    srcMobile: "/pastels-1_mobile.jpg",
    name: {
      en: '"Red Apples"',
      fi: '"Red Apples"',
    },
  },
];

const digitals = [
  {
    index: 0,
    src: "/digital-3.jpg",
    srcThumb: "/digital-3_thumb.jpg",
    srcMobile: "/digital-3_mobile.jpg",
    name: {
      en: '"An English New Year"',
      fi: '"Englantilainen Uusi Vuosi"',
    },
  },
  {
    index: 1,
    src: "/digital-2b.jpg",
    srcThumb: "/digital-2b_thumb.jpg",
    srcMobile: "/digital-2b_mobile.jpg",
    name: {
      en: '"Onwards"',
      fi: '"Eteenpäin"',
    },
  },
  {
    index: 2,
    src: "/digital-1.jpg",
    srcThumb: "/digital-1_thumb.jpg",
    srcMobile: "/digital-1_mobile.jpg",
    name: {
      en: '"Sense of stability"',
      fi: '"Vakauden tunne"',
    },
  },
];

const mixed = [
  {
    index: 0,
    src: "/mixed-1.jpg",
    srcThumb: "/mixed-1_thumb.jpg",
    srcMobile: "/mixed-1_mobile.jpg",
    name: {
      en: "Schoolwork",
      fi: "Koulu tehtävä",
    },
  },
  {
    index: 1,
    src: "/mixed-2.jpg",
    srcThumb: "/mixed-2_thumb.jpg",
    srcMobile: "/mixed-2_mobile.jpg",
    name: {
      en: "Poster",
      fi: "Koulu juliste",
    },
  },
  {
    index: 2,
    src: "/mixed-3.jpg",
    srcThumb: "/mixed-3_thumb.jpg",
    srcMobile: "/mixed-3_mobile.jpg",
    name: {
      en: "Poster",
      fi: "Koulu juliste",
    },
  },
  {
    index: 3,
    src: "/mixed-4.jpg",
    srcThumb: "/mixed-4_thumb.jpg",
    srcMobile: "/mixed-4_mobile.jpg",
    name: {
      en: "Photograph",
      fi: "Kuva",
    },
  },
  {
    index: 4,
    src: "/mixed-5.jpg",
    srcThumb: "/mixed-5_thumb.jpg",
    srcMobile: "/mixed-5_mobile.jpg",
    name: {
      en: "Photograph",
      fi: "Kuva",
    },
  },
  {
    index: 5,
    src: "/mixed-6.jpg",
    srcThumb: "/mixed-6_thumb.jpg",
    srcMobile: "/mixed-6_mobile.jpg",
    name: {
      en: "Photograph",
      fi: "Kuva",
    },
  },
  {
    index: 6,
    src: "/mixed-7.jpg",
    srcThumb: "/mixed-7_thumb.jpg",
    srcMobile: "/mixed-7_mobile.jpg",
    name: {
      en: "Photograph",
      fi: "Kuva",
    },
  },
  {
    index: 7,
    src: "/mixed-8.jpg",
    srcThumb: "/mixed-8_thumb.jpg",
    srcMobile: "/mixed-8_mobile.jpg",
    name: {
      en: "Photograph",
      fi: "Kuva",
    },
  },
  {
    index: 8,
    src: "/mixed-9.jpg",
    srcThumb: "/mixed-9_thumb.jpg",
    srcMobile: "/mixed-9_mobile.jpg",
    name: {
      en: "Photograph",
      fi: "Kuva",
    },
  },
  {
    index: 9,
    src: "/mixed-10.jpg",
    srcThumb: "/mixed-10_thumb.jpg",
    srcMobile: "/mixed-10_mobile.jpg",
    name: {
      en: "Photograph",
      fi: "Kuva",
    },
  },
  {
    index: 10,
    src: "/mixed-11.jpg",
    srcThumb: "/mixed-11_thumb.jpg",
    srcMobile: "/mixed-11_mobile.jpg",
    name: {
      en: "Photograph",
      fi: "Kuva",
    },
  },
  {
    index: 11,
    src: "/mixed-12.jpg",
    srcThumb: "/mixed-12_thumb.jpg",
    srcMobile: "/mixed-12_mobile.jpg",
    name: {
      en: "Photograph",
      fi: "Kuva",
    },
  },
  {
    index: 12,
    src: "/mixed-13.jpg",
    srcThumb: "/mixed-13_thumb.jpg",
    srcMobile: "/mixed-13_mobile.jpg",
    name: {
      en: "Photograph",
      fi: "Kuva",
    },
  },
];

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
  const searchParams = useSearchParams();

  const query = searchParams.get("q");

  const language = useAtomValue(languageAtom);

  const router = useRouter();

  const getActiveImage = () => {
    switch (query) {
      case "drawings":
        return images;
      case "paintings":
        return paintings;
      case "pastels":
        return pastels;
      case "digital":
        return digitals;
      case "mixed-media":
        return mixed;
      default:
        return [];
    }
  };

  return (
    <div className="">
      <Header />
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
                getActiveImage() === images ? "bg-activeGray" : ""
              } px-4 py-2 rounded-full`}
            >
              {language === "fi" ? menuDrawings.fi : menuDrawings.en}
            </Link>
            <Link
              href="/portfolio?q=paintings"
              className={`${
                getActiveImage() === paintings ? "bg-activeGray" : ""
              } px-4 py-2 rounded-full`}
            >
              {language === "fi" ? menuPaintings.fi : menuPaintings.en}
            </Link>
            <Link
              href="/portfolio?q=pastels"
              className={`${
                getActiveImage() === pastels ? "bg-activeGray" : ""
              } px-4 py-2 rounded-full`}
            >
              {language === "fi" ? menuPastels.fi : menuPastels.en}
            </Link>
            <Link
              href="/portfolio?q=digital"
              className={`${
                getActiveImage() === digitals ? "bg-activeGray" : ""
              } px-4 py-2 rounded-full`}
            >
              {language === "fi" ? menuDigital.fi : menuDigital.en}
            </Link>
            <Link
              href="/portfolio?q=mixed-media"
              className={`${
                getActiveImage() === mixed ? "bg-activeGray" : ""
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
    </div>
  );
};

export default PortfolioOuter;
