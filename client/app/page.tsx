import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[#232323] flex justify-center items-center py-6 relative overflow-hidden gap-32">
      <img src="/salinstudio-logo.svg" alt="Salin Studio" />
      <section className="px-6 py-9 bg-[#2A2A2A] max-w-[600px] text-white flex flex-col">
        <div className="flex w-full font-cursive justify-between text-[36px]">
          <Link href="/" className="hover:scale-110 transition-all">
            Home
          </Link>
          <Link href="/" className="hover:scale-110 transition-all">
            Info
          </Link>
          <Link href="/" className="hover:scale-110 transition-all">
            Portfolio
          </Link>
          <Link href="/" className="hover:scale-110 transition-all">
            Blog
          </Link>
          <Link href="/" className="hover:scale-110 transition-all">
            Buy
          </Link>
        </div>
        <hr className="w-[90%] self-center" />
        <div className="flex flex-col items-center gap-6 w-full font-sans p-16 text-[22px]">
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
          <Link href="/" className="font-mono text-[#aaaaaa] text-[18px]">
            Contact me
          </Link>
        </div>
      </section>
      <div className="h-[29vh] w-[118vw] bg-[url('/salinstudio-home-reel-top.jpg')] -rotate-[21.8deg] absolute -top-[25vh] -left-[15vw]"></div>
      <div className="h-[25vh] w-[118vw] bg-[url('/salinstudio-home-reel-bot.jpg')] rotate-[12.4deg] absolute -left-[10vw] -bottom-[20vh]"></div>
    </div>
  );
}
