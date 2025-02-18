"use client";
import { Header, Navbar } from "@/components";
import { Logo } from "@/components/Logo";
import { languageAtom } from "@/state";
import { useAtomValue } from "jotai";
import Link from "next/link";

const heading = {
  en: "Welcome to my studio",
  fi: "Tervetuloa taide studiooni",
};

const paragraphOne = {
  en: "I create art with a focus on portraits, still-life, surrealism and symbolism, with a splash of cartoons and horror mixed in.",
  fi: "Täältä löydät teoksia, jotka keskittyvät muotokuviin, asetelmiin, surrealismiin, symboliikkaan ja vähän sarjakuva- ja kauhuaiheista taidetta. Loput töistäni löydät instagramista.",
};

const paragraphTwo = {
  en: "Follow me on Instagram or feel free to contact me on here.",
  fi: "Jos haluat tietää lisää tai kysyä minulta jotain, ota rohkeasti yhteyttä.",
};

const button = {
  en: "My Art",
  fi: "Taidetyöt",
};

const contact = {
  en: "Contact me",
  fi: "Ota yhteyttä",
};

export default function Home() {
  const language = useAtomValue(languageAtom);

  return (
    <div className="w-full">
      <div className="tablet:hidden">
        <Header />
      </div>
      <div className="relative min-h-[calc(100vh-80px)] justify-center tablet:min-h-screen w-full bg-darkest flex tablet:justify-center tablet:items-center tablet:py-6 overflow-hidden gap-16 flex-col desktop:gap-32 desktop:flex-row">
        <div className="hidden desktop:flex">
          <Logo size="large" />
        </div>
        <div className="">
          <section className="px-3 tablet:pt-9 pb-9 bg-homeGray max-w-[600px] w-full text-white flex flex-col grow-0 relative z-[1] bg-opacity-75">
            <div className="hidden tablet:flex">
              <Navbar />
            </div>
            <div className="flex flex-col items-center gap-10 w-full font-sans tablet:px-16 py-12 text-[18px]">
              <div className="flex flex-col gap-5 text-center">
                <h1 className="text-[38px] leading-[1] font-bold">
                  {language === "fi" ? heading.fi : heading.en}
                </h1>
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
            <div className="tablet:px-16">
              <hr className="mb-2" />
              <div className="w-full flex justify-between items-center midMobile:items-start gap-2 midMobile:flex-row px-6 tablet:px-0">
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
        </div>
        <div className="h-[263px] bg-[url('/salinstudio-home-reel-top.jpg')] -rotate-[21.8deg] absolute -top-[15%] tablet:-top-[25%] -left-[300px] -right-[100px] top-reel"></div>
        <div className="h-[263px] bg-[url('/salinstudio-home-reel-bot.jpg')] rotate-[12.4deg] absolute -left-[400px] -right-[100px] -bottom-[15%] tablet:-bottom-[25%] bot-reel"></div>
      </div>
    </div>
  );
}
