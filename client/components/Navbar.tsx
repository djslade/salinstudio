"use client";
import Link from "next/link";
import { InactiveLink } from "./InactiveLink";
import { useAtomValue } from "jotai";
import { languageAtom } from "@/state";

const home = {
  en: "Home",
  fi: "Koti",
};

const info = {
  en: "About",
  fi: "Tietoa",
};

const portfolio = {
  en: "Gallery",
  fi: "Galleria",
};

const blog = {
  en: "Blog",
  fi: "Blogi",
};

const buy = {
  en: "Buy",
  fi: "Osta",
};

export const Navbar = () => {
  const language = useAtomValue(languageAtom);

  return (
    <div className="w-full text-white self-center flex flex-col">
      <div className="flex w-full font-cursive justify-between text-[32px] px-20">
        <Link href="/" className="hover:scale-110 transition-all">
          {language === "fi" ? home.fi : home.en}
        </Link>
        <Link href="/info" className="hover:scale-110 transition-all">
          {language === "fi" ? info.fi : info.en}
        </Link>
        <Link href="/portfolio" className="hover:scale-110 transition-all">
          {language === "fi" ? portfolio.fi : portfolio.en}
        </Link>
        <InactiveLink text={language === "fi" ? blog.fi : blog.en} />
        <InactiveLink text={language === "fi" ? buy.fi : buy.en} />
      </div>
      <div className="px-16 w-full">
        <hr className="self-center" />
      </div>
    </div>
  );
};
