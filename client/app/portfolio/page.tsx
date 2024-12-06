"use client";
import { Gallery, Navbar } from "@/components";
import { useEffect, useRef, useState } from "react";

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
      <section className="p-2">
        <Gallery images={images} />
      </section>
    </div>
  );
};

export default Portfolio;
