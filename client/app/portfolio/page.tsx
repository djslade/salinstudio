"use client";
import { Gallery, Navbar } from "@/components";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const images: string[] = [
  "/salinstudio-gallery-1.jpg",
  "/salinstudio-gallery-2.jpg",
  "/salinstudio-gallery-3.jpg",
  "/salinstudio-gallery-4.jpg",
  "/salinstudio-gallery-5.jpg",
  "/salinstudio-gallery-6.jpg",
  "/salinstudio-gallery-7.jpg",
  "/salinstudio-gallery-8.jpg",
  "/salinstudio-gallery-9.jpg",
  "/salinstudio-gallery-10.jpg",
  "/salinstudio-gallery-11.jpg",
  "/salinstudio-gallery-12.jpg",
  "/salinstudio-gallery-13.jpg",
  "/salinstudio-gallery-14.jpg",
  "/salinstudio-gallery-15.jpg",
  "/salinstudio-gallery-16.jpg",
  "/salinstudio-gallery-17.jpg",
  "/salinstudio-gallery-18.jpg",
  "/salinstudio-gallery-19.jpg",
  "/salinstudio-gallery-20.jpg",
  "/salinstudio-gallery-21.jpg",
  "/salinstudio-gallery-22.jpg",
  "/salinstudio-gallery-23.jpg",
];

const paintings: string[] = [
  "/salinstudio-painting-1.jpg",
  "/salinstudio-painting-2.jpg",
  "/salinstudio-painting-3.jpg",
  "/salinstudio-painting-4.jpg",
];

const pastels: string[] = ["/salinstudio-pastel-1.jpg"];

const digitals: string[] = ["/salinstudio-digital-1.jpg"];

const mixed: string[] = [
  "/salinstudio-mixed-1.jpg",
  "/salinstudio-mixed-2.jpg",
  "/salinstudio-mixed-3.jpg",
  "/salinstudio-mixed-4.jpg",
  "/salinstudio-mixed-5.jpg",
  "/salinstudio-mixed-6.jpg",
  "/salinstudio-mixed-7.jpg",
  "/salinstudio-mixed-8.jpg",
  "/salinstudio-mixed-9.jpg",
  "/salinstudio-mixed-10.jpg",
  "/salinstudio-mixed-11.jpg",
  "/salinstudio-mixed-12.jpg",
  "/salinstudio-mixed-13.jpg",
];

const Portfolio = () => {
  const searchParams = useSearchParams();

  const query = searchParams.get("q");

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
              Drawings
            </Link>
            <Link
              href="/portfolio?q=paintings"
              className={`${
                getActiveImage() === paintings ? "bg-[#464646]" : ""
              } px-4 py-2 rounded-full`}
            >
              Paintings
            </Link>
            <Link
              href="/portfolio?q=pastels"
              className={`${
                getActiveImage() === pastels ? "bg-[#464646]" : ""
              } px-4 py-2 rounded-full`}
            >
              Pastels
            </Link>
            <Link
              href="/portfolio?q=digital"
              className={`${
                getActiveImage() === digitals ? "bg-[#464646]" : ""
              } px-4 py-2 rounded-full`}
            >
              Digital
            </Link>
            <Link
              href="/portfolio?q=mixed-media"
              className={`${
                getActiveImage() === mixed ? "bg-[#464646]" : ""
              } px-4 py-2 rounded-full`}
            >
              Mixed Media
            </Link>
          </div>
        )}

        {getActiveImage().length === 0 ? (
          <div className="flex justify-center items-center w-full flex-1">
            <div className="grid-container">
              <Link className="grid-item" href="/portfolio?q=drawings">
                Drawings
              </Link>
              <Link className="grid-item" href="/portfolio?q=paintings">
                Paintings
              </Link>
              <Link className="grid-item" href="/portfolio?q=pastels">
                Pastels
              </Link>
              <Link className="grid-item" href="/portfolio?q=digital">
                Digital
              </Link>
              <Link className="grid-item" href="/portfolio?q=mixed-media">
                Mixed Media
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
