"use client";
import { Header } from "@/components";
import { languageAtom } from "@/state";
import { useAtomValue } from "jotai";
import Link from "next/link";

const heading = {
  en: "About me",
  fi: "Tietoa minusta",
};
const paragraphOne = {
  en: "I’m a hardworking 2nd year art student from Finland with limitless imagination and drive. I’ve come a long way for this path, but my hardships have just made my motivation stronger. ",
  fi: "Olen ahkera 2. vuoden taideopiskelija Suomesta, jolla on rajaton mielikuvitus ja sisu. Tieni on ollut pitkä ja haastava, mutta vaikeudet ovat vain vahvistaneet motivaatiotani.",
};

const paragraphTwo = {
  en: "I enjoy drawing with pencil, coal and using oil paints, but I’m all in for trying out any and all different forms of art. I’m a great listener and I learn fast. I enjoy surrealism, symbolism, real life experiences and stories. I want to capture the feeling and raw emotion in whatever or whoever I make art of. ",
  fi: "Nautin piirtämisestä lyijykynällä, hiilellä ja öljymaaleilla maalaamisella, mutta olen innostunut kokeilemaan kaikkia erilaisia ​​taiteen muotoja. Olen hyvä kuuntelija ja opin nopeasti. Nautin surrealismista, symboliikasta, tosielämän kokemuksista ja tarinoista. Haluan vangita kokemuksen ja raa'an tunteen mistä, tai kenestä tahansa teenkään taidetta.",
};

const paragraphThree = {
  en: "Being international is very important to me, and I’m hoping to gain new experiences and opportunities outside of Finland too. I’m very sensitive to different situations that people might be in, and I will make it as easy as possible to contact me and request artworks. ",
  fi: "Kansainvälisyys on minulle erittäin tärkeää, ja toivon saavani uusia kokemuksia ja mahdollisuuksia myös Suomen ulkopuolelta. Olen hyvin herkkä erilaisille tilanteille joissa ihmiset voivat olla, joten yritän tehdä minuun yhteydenoton ja taideteosten tilaamiset helpoksi prosessiksi.",
};

const contact = {
  en: "Contact me",
  fi: "Ota yhteyttä",
};

const Info = () => {
  const language = useAtomValue(languageAtom);

  return (
    <div className="desktop:min-h-screen flex flex-col">
      <Header />
      <section className="w-full bg-formGray font-sans text-[18px] leading-[27px] flex flex-col items-center text-white pt-12 pb-12 tablet:pt-24 tablet:pb-20 desktop:px-24 px-6 tablet:px-3 text-center tablet:text-left">
        <div className="max-w-[600px] w-full flex flex-col gap-6 relative">
          <div className="flex flex-col gap-8">
            <h1 className="font-bold text-[32px] tablet:ml-12">
              {language === "fi" ? heading.fi : heading.en}
            </h1>
            <p className="max-w-[500px] tablet:ml-12">
              {language === "fi" ? paragraphOne.fi : paragraphOne.en}
            </p>
            <p className="max-w-[500px] tablet:ml-12">
              {language === "fi" ? paragraphTwo.fi : paragraphTwo.en}
            </p>
            <p className="max-w-[500px] tablet:ml-12">
              {language === "fi" ? paragraphThree.fi : paragraphThree.en}
            </p>
          </div>
          <div className="max-w-[580px] text-end pt-2.5">
            <Link href="/contact" className="font-mono">
              {language === "fi" ? contact.fi : contact.en}
            </Link>
          </div>
          <img
            src="/salinstudio-info-2.jpg"
            alt=""
            className="top-[240px] w-[240px] -left-[270px] absolute hidden midTablet:block"
          />
          <img
            src="/salinstudio-info-1.jpg"
            alt=""
            className="-top-[25px] w-[200px] -left-[250px] absolute hidden midTablet:block"
          />
          <img
            src="/salinstudio-info-4.jpg"
            alt=""
            className="-bottom-[350px] w-[300px] left-[150px] hidden absolute midTablet:block"
          />
          <img
            src="/salinstudio-info-3.jpg"
            alt=""
            className="-bottom-[300px] w-[208px] -left-[48px] hidden absolute midTablet:block"
          />
          <img
            src="/salinstudio-info-5.jpg"
            alt=""
            className="-bottom-[330px] w-[220px] -right-[50px] hidden absolute midTablet:block"
          />
        </div>
      </section>
    </div>
  );
};

export default Info;
