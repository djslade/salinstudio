import { Navbar } from "@/components";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[#232323] flex justify-center items-center py-6 relative overflow-hidden gap-32">
      <img src="/salinstudio-logo.svg" alt="Salin Studio" />
      <section className="px-6 py-9 bg-[#2A2A2A] w-[600px] aspect-[7:6] text-white flex flex-col">
        <Navbar />
        <div className="flex flex-col items-center gap-12 w-full font-sans p-16 text-[18px]">
          <p>
            Welcome to my studio, where you can see my artworks. I make
            creations for the public, for individuals, for YOU. I take every
            order and job equally seriously and do my best following the
            customer's wishes. You can send a message to my email if you have
            any questions for me.
          </p>
          <Link href="/" className="bg-[#3A3A3A] px-6 py-1 rounded">
            Artworks
          </Link>
        </div>
        <div className="px-16 py-2">
          <hr className="" />
          <Link href="/" className="font-mono text-[#aaaaaa] text-[16px]">
            Contact me
          </Link>
        </div>
      </section>
      <div className="h-[29vh] w-[118vw] bg-[url('/salinstudio-home-reel-top.jpg')] -rotate-[21.8deg] absolute -top-[25vh] -left-[15vw]"></div>
      <div className="h-[25vh] w-[118vw] bg-[url('/salinstudio-home-reel-bot.jpg')] rotate-[12.4deg] absolute -left-[10vw] -bottom-[20vh]"></div>
    </div>
  );
}
