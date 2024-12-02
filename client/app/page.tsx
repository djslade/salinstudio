import Link from "next/link";

export default function Home() {
  return (
    <div>
      <section className="flex px-[80px] py-[80px] max-w-[1440px] my-0 mx-auto font-sans justify-between w-screen gap-10">
        <div className="flex-1">
          <img
            src="/salinstudio-hero-img.jpg"
            alt="Salin studio"
            className="w-full"
          />
        </div>
        <div className="w-[800px] justify-center px-6">
          <div className="flex flex-col items-center py-20 gap-20">
            <h2 className="text-[32px] font-normal ">
              Welcome to my studio, where you can see my artworks. I make
              creations for the public, for individuals, for YOU. I take every
              order and job equally seriously and do my best following the
              customer's wishes. You can send a message to my email if you have
              any questions for me.
            </h2>
            <Link
              href="/portfolio"
              className="text-[40px] text-white bg-[#87857F] px-[22px] self-center"
            >
              Artworks
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
