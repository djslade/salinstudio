"use client";
import {
  Gallery,
  GalleryMenu,
  GalleryMenuMobile,
  GalleryMenuTablet,
  Header,
} from "@/components";
import { Art } from "@/types/Art";
import { useSearchParams } from "next/navigation";

interface PortfolioProps {
  art: Art[];
}

export const Portfolio = ({ art }: PortfolioProps) => {
  const searchParams = useSearchParams();

  const query = searchParams.get("q");

  const getActiveImage = () => {
    if (!art) return [];
    if (!query) return art;
    return art.filter(
      (a) => a.category === (query === "mixed-media" ? "mixed media" : query)
    );
  };

  return (
    <div className="">
      <Header />
      <section
        className="px-2 py-12 bg-darkest flex flex-col gap-12"
        style={{ minHeight: "calc(100vh - 230px)" }}
      >
        {getActiveImage().length > 0 && <GalleryMenuMobile />}
        {getActiveImage().length > 0 && <GalleryMenuTablet />}

        {getActiveImage().length === 0 ? (
          <GalleryMenu />
        ) : (
          <Gallery images={getActiveImage()} />
        )}
      </section>
    </div>
  );
};
