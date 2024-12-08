"use client";
import { Gallery, Navbar } from "@/components";
import { languageAtom } from "@/state";
import { useAtomValue } from "jotai";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const images = [
  {
    src: "/salinstudio-gallery-1.jpg",
    name: {
      en: '"Insurmountable"',
      fi: '"Ylitsepääsemätön"',
    },
  },
  {
    src: "/salinstudio-gallery-2.jpg",
    name: {
      en: "Reference picture",
      fi: "Referenssikuva",
    },
  },
  {
    src: "/salinstudio-gallery-3.jpg",
    name: {
      en: "Schoolwork",
      fi: "Koulu tehtävä",
    },
  },
  {
    src: "/salinstudio-gallery-4.jpg",
    name: {
      en: 'Inktober 2023 "Golden"',
      fi: 'Inktober 2023 "Kultainen"',
    },
  },
  {
    src: "/salinstudio-gallery-5.jpg",
    name: {
      en: "Protect thy brother",
      fi: "Suojele veljeäsi",
    },
  },
  {
    src: "/salinstudio-gallery-6.jpg",
    name: {
      en: "Reference picture",
      fi: "Referenssikuva",
    },
  },
  {
    src: "/salinstudio-gallery-7.jpg",
    name: {
      en: "Schoolwork",
      fi: "Koulu tehtävä",
    },
  },
  {
    src: "/salinstudio-gallery-8.jpg",
    name: {
      en: '"Christina"',
      fi: '"Christina"',
    },
  },
  {
    src: "/salinstudio-gallery-9.jpg",
    name: {
      en: "Schoolwork",
      fi: "Koulu tehtävä",
    },
  },
  {
    src: "/salinstudio-gallery-10.jpg",
    name: {
      en: "Reference picture",
      fi: "Referenssikuva",
    },
  },
  {
    src: "/salinstudio-gallery-11.jpg",
    name: {
      en: '"What could have been"',
      fi: '"Mikä olisi voinut olla"',
    },
  },
  {
    src: "/salinstudio-gallery-12.jpg",
    name: {
      en: "Reference picture",
      fi: "Referenssikuva",
    },
  },
  {
    src: "/salinstudio-gallery-13.jpg",
    name: {
      en: "Reference picture",
      fi: "Referenssikuva",
    },
  },
  {
    src: "/salinstudio-gallery-14.jpg",
    name: {
      en: '"Mother and son"',
      fi: '"Äiti ja poika"',
    },
  },
  {
    src: "/salinstudio-gallery-15.jpg",
    name: {
      en: "Reference picture",
      fi: "Referenssikuva",
    },
  },
  {
    src: "/salinstudio-gallery-16.jpg",
    name: {
      en: '"Bella"',
      fi: '"Bella"',
    },
  },
  {
    src: "/salinstudio-gallery-17.jpg",
    name: {
      en: '"HAN"',
      fi: '"HAN"',
    },
  },
  {
    src: "/salinstudio-gallery-18.jpg",
    name: {
      en: "Reference picture",
      fi: "Referenssikuva",
    },
  },
  {
    src: "/salinstudio-gallery-19.jpg",
    name: {
      en: "Reference picture",
      fi: "Referenssikuva",
    },
  },
  {
    src: "/salinstudio-gallery-20.jpg",
    name: {
      en: '"You are my future"',
      fi: '"Sinä olet tulevaisuuteni"',
    },
  },
  {
    src: "/salinstudio-gallery-21.jpg",
    name: {
      en: "Reference picture",
      fi: "Referenssikuva",
    },
  },
  {
    src: "/salinstudio-gallery-22.jpg",
    name: {
      en: "Reference picture",
      fi: "Referenssikuva",
    },
  },
  {
    src: "/salinstudio-gallery-23.jpg",
    name: {
      en: 'Inktober 2023 "Bounce"',
      fi: 'Inktober 2023 "Pomppu"',
    },
  },
];

const paintings = [
  {
    src: "/salinstudio-painting-1.jpg",
    name: {
      en: "Schoolwork",
      fi: "Koulu tehtävä",
    },
  },
  {
    src: "/salinstudio-painting-2.jpg",
    name: {
      en: "Schoolwork",
      fi: "Koulu tehtävä",
    },
  },
  {
    src: "/salinstudio-painting-3.jpg",
    name: {
      en: "Schoolwork",
      fi: "Koulu tehtävä",
    },
  },
  {
    src: "/salinstudio-painting-4.jpg",
    name: {
      en: 'Painted "Insurmountable"',
      fi: 'Maalattu "Ylitsepääsemätön"',
    },
  },
];

const pastels = [
  {
    src: "/salinstudio-pastel-1.jpg",
    name: {
      en: '"Red Apples"',
      fi: '"Red Apples"',
    },
  },
];

const digitals = [
  {
    src: "/salinstudio-digital-1.jpg",
    name: {
      en: '"Sense of stability"',
      fi: '"Vakauden tunne"',
    },
  },
];

const mixed = [
  {
    src: "/salinstudio-mixed-1.jpg",
    name: {
      en: "Schoolwork",
      fi: "Koulu tehtävä",
    },
  },
  {
    src: "/salinstudio-mixed-2.jpg",
    name: {
      en: "Poster for school",
      fi: "Koulu juliste",
    },
  },
  {
    src: "/salinstudio-mixed-3.jpg",
    name: {
      en: "Poster for school",
      fi: "Koulu juliste",
    },
  },
  {
    src: "/salinstudio-mixed-4.jpg",
    name: {
      en: "",
      fi: "",
    },
  },
  {
    src: "/salinstudio-mixed-5.jpg",
    name: {
      en: "",
      fi: "",
    },
  },
  {
    src: "/salinstudio-mixed-6.jpg",
    name: {
      en: "",
      fi: "",
    },
  },
  {
    src: "/salinstudio-mixed-7.jpg",
    name: {
      en: "",
      fi: "",
    },
  },
  {
    src: "/salinstudio-mixed-8.jpg",
    name: {
      en: "",
      fi: "",
    },
  },
  {
    src: "/salinstudio-mixed-9.jpg",
    name: {
      en: "",
      fi: "",
    },
  },
  {
    src: "/salinstudio-mixed-10.jpg",
    name: {
      en: "",
      fi: "",
    },
  },
  {
    src: "/salinstudio-mixed-11.jpg",
    name: {
      en: "",
      fi: "",
    },
  },
  {
    src: "/salinstudio-mixed-12.jpg",
    name: {
      en: "",
      fi: "",
    },
  },
  {
    src: "/salinstudio-mixed-13.jpg",
    name: {
      en: "",
      fi: "",
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

const Portfolio = () => {
  const searchParams = useSearchParams();

  const query = searchParams.get("q");

  const language = useAtomValue(languageAtom);

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
      <section className="bg-[#232323] w-full p-12 flex flex-col">
        <img
          src="/salinstudio-logo.svg"
          alt="Salin Studio"
          className="w-[200px] self-start"
        />
        <div className="w-[600px] text-white self-center flex flex-col">
          <Navbar />
        </div>
      </section>
      <section
        className="px-2 py-12 bg-[#232323] flex flex-col gap-12"
        style={{ minHeight: "calc(100vh - 230px)" }}
      >
        {getActiveImage().length > 0 && (
          <div className="flex justify-center items-center gap-6 font-mono text-[18px] text-white">
            <Link
              href="/portfolio?q=drawings"
              className={`${
                getActiveImage() === images ? "bg-[#464646]" : ""
              } px-4 py-2 rounded-full`}
            >
              {language === "fi" ? menuDrawings.fi : menuDrawings.en}
            </Link>
            <Link
              href="/portfolio?q=paintings"
              className={`${
                getActiveImage() === paintings ? "bg-[#464646]" : ""
              } px-4 py-2 rounded-full`}
            >
              {language === "fi" ? menuPaintings.fi : menuPaintings.en}
            </Link>
            <Link
              href="/portfolio?q=pastels"
              className={`${
                getActiveImage() === pastels ? "bg-[#464646]" : ""
              } px-4 py-2 rounded-full`}
            >
              {language === "fi" ? menuPastels.fi : menuPastels.en}
            </Link>
            <Link
              href="/portfolio?q=digital"
              className={`${
                getActiveImage() === digitals ? "bg-[#464646]" : ""
              } px-4 py-2 rounded-full`}
            >
              {language === "fi" ? menuDigital.fi : menuDigital.en}
            </Link>
            <Link
              href="/portfolio?q=mixed-media"
              className={`${
                getActiveImage() === mixed ? "bg-[#464646]" : ""
              } px-4 py-2 rounded-full`}
            >
              {language === "fi" ? menuMixedMedia.fi : menuMixedMedia.en}
            </Link>
          </div>
        )}

        {getActiveImage().length === 0 ? (
          <div className="flex justify-center items-center w-full flex-1">
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

export default Portfolio;
