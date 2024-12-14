"use client";
import { Navbar } from "@/components";
import { languageAtom } from "@/state";
import { useAtomValue } from "jotai";
import Link from "next/link";

const paragraphOne = {
  en: "Welcome to my art studio! Here you can find artworks focusing on portraits, still life, surrealism, symbolism mixed with some cartoon and horror art. You can find rest of my works on instagram.",
  fi: "Tervetuloa taide studiooni! Täältä löydät teoksia, jotka keskittyvät muotokuviin, asetelmiin, surrealismiin, symboliikkaan ja vähän sarjakuva- ja kauhuaiheista taidetta. Loput töistäni löydät instagramista.",
};

const paragraphTwo = {
  en: "If you want to know more or ask me questions, please feel free to contact me.",
  fi: "Jos haluat tietää lisää tai kysyä minulta jotain, ota rohkeasti yhteyttä.",
};

const button = {
  en: "Artworks",
  fi: "Taidetyöt",
};

const contact = {
  en: "Contact me",
  fi: "Ota yhteyttä",
};

export default function Home() {
  const language = useAtomValue(languageAtom);

  return (
    <div className="min-h-screen w-full bg-darkest flex justify-center items-center py-6 relative overflow-hidden gap-32">
      <Link href="/">
        <img
          src="/salinstudio-logo.svg"
          alt="Salin Studio"
          className="max-w-[300px]"
        />
      </Link>
      <section className="px-6 pt-9 pb-9 bg-homeGray w-[600px] h-[516px] text-white flex flex-col grow-0">
        <Navbar />
        <div className="flex flex-col items-center gap-10 w-full font-sans px-16 pt-16 pb-12 text-[18px]">
          <div className="flex flex-col gap-5 text-center">
            <p>{language === "fi" ? paragraphOne.fi : paragraphOne.en}</p>
            <p>{language === "fi" ? paragraphTwo.fi : paragraphTwo.en}</p>
          </div>
          <Link
            href="/portfolio"
            className="bg-formGray px-6 py-1 rounded self-center"
          >
            {language === "fi" ? button.fi : button.en}
          </Link>
        </div>
        <div className="px-16">
          <hr className="mb-2" />
          <div className="w-full flex justify-between">
            <Link
              href="/contact"
              className="font-mono text-linkGray text-[16px]"
            >
              {language === "fi" ? contact.fi : contact.en}
            </Link>
            <a
              href="https://www.instagram.com/salinmiia/"
              className="font-mono text-linkGray text-[16px]"
              target="_blank"
            >
              Instagram
            </a>
          </div>
        </div>
      </section>
      <div className="h-[29vh] w-[118vw] bg-[url('/salinstudio-home-reel-top.jpg')] -rotate-[21.8deg] absolute -top-[25vh] -left-[15vw] top-reel"></div>
      <div className="h-[25vh] w-[118vw] bg-[url('/salinstudio-home-reel-bot.jpg')] rotate-[12.4deg] absolute -left-[10vw] -bottom-[20vh] bot-reel"></div>
    </div>
  );
}
