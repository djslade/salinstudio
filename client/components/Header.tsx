"use client";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { Navbar } from "./Navbar";
import { IoIosMenu } from "react-icons/io";
import Link from "next/link";
import { useAtom } from "jotai";
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

export const Header = () => {
  const [language, setLanguage] = useAtom(languageAtom);

  const toggleLanguage = () => {
    localStorage.setItem(
      "salinstudio-language",
      language === "fi" ? "en" : "fi"
    );
    setLanguage((prev) => (prev === "fi" ? "en" : "fi"));
  };

  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

  const openMobileMenu = () => {
    setShowMobileMenu(true);
  };

  const closeMobileMenu = () => {
    setShowMobileMenu(false);
  };

  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showMobileMenu]);

  return (
    <header className="bg-darkest p-4 w-full h-[80px] tablet:h-auto items-center tablet:items-start tablet:p-9 desktop:p-12 flex justify-between tablet:flex-col tablet:justify-start tablet:gap-6 desktop:gap-0">
      <Logo size="small" />
      <div className="w-[600px] text-white self-center flex-col hidden tablet:flex">
        <Navbar />
      </div>
      <button
        className="tablet:hidden text-white text-[36px]"
        onClick={openMobileMenu}
      >
        <IoIosMenu />
      </button>

      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black z-[49] bg-opacity-80"
          onClick={closeMobileMenu}
        />
      )}
      <div
        onClick={closeMobileMenu}
        className={`fixed top-0 bottom-0 right-0 ${
          showMobileMenu ? "w-[80vw]" : "w-0"
        } max-w-[600px] bg-darkest z-50 transition-all duration-250 py-6 flex flex-col gap-6 bg-opacity-85`}
      >
        <div className="flex flex-col w-full text-white font-mono text-[22px] py-24">
          <Link href="/" className="px-3 py-1 w-fit">
            {language === "fi" ? home.fi : home.en}
          </Link>
          <Link href="/info" className="px-3 py-1 w-fit">
            {language === "fi" ? info.fi : info.en}
          </Link>
          <Link href="/portfolio" className="px-3 py-1 w-fit">
            {language === "fi" ? portfolio.fi : portfolio.en}
          </Link>
          <div className="w-full px-3 py-1">
            <span className="line-through text-[#757575]">
              {language === "fi" ? blog.fi : blog.en}
            </span>
          </div>
          <div className="w-full px-3 py-1">
            <span className="line-through text-[#757575]">
              {language === "fi" ? buy.fi : buy.en}
            </span>
          </div>
          <button
            className="px-3 py-1 text-start w-fit"
            onClick={toggleLanguage}
          >
            {language === "fi" ? "Change to English" : "Vaihda suomeksi"}
          </button>
        </div>
      </div>
    </header>
  );
};
