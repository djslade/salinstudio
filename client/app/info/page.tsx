import { Navbar } from "@/components";
import Link from "next/link";

const Info = () => {
  return (
    <div className="min-h-screen flex flex-col">
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
      <section className="w-full bg-[#3a3a3a] font-sans font-[18px] flex flex-col items-center text-white p-24 flex-1">
        <div className="w-[600px] flex flex-col gap-6 relative">
          <div className="flex flex-col gap-8">
            <p className="max-w-[500px] ml-12">
              I’m a hardworking 2nd year art student from Finland with limitless
              imagination and drive. I’ve come a long way for this path, but my
              hardships have just made my motivation stronger.{" "}
            </p>
            <p className="max-w-[500px] ml-12">
              I enjoy drawing with pencil, coal and using oil paints, but I’m
              all in for trying out any and all different forms of art. I’m a
              great listener and I learn fast. I enjoy surrealism, symbolism,
              real life experiences and stories. I want to capture the feeling
              and raw emotion in whatever or whoever I make art of.
            </p>
            <p className="max-w-[500px] ml-12">
              Being international is very important to me, and I’m hoping to
              gain new experiences and opportunities outside of Finland too. I’m
              very sensitive to different situations that people might be in,
              and I will make it as easy as possible to contact me and request
              artworks.
            </p>
          </div>
          <div className="max-w-[580px] text-end">
            <Link href="/contact" className="font-mono">
              Contact me
            </Link>
          </div>
          <img
            src="/salinstudio-info-2.jpg"
            alt=""
            className="top-[240px] w-[240px] -left-[270px] absolute"
          />
          <img
            src="/salinstudio-info-1.jpg"
            alt=""
            className="-top-[25px] w-[200px] -left-[250px] absolute"
          />
          <img
            src="/salinstudio-info-4.jpg"
            alt=""
            className="-bottom-[350px] w-[300px] left-[150px] absolute"
          />
          <img
            src="/salinstudio-info-3.jpg"
            alt=""
            className="-bottom-[300px] w-[208px] -left-[48px] absolute"
          />
          <img
            src="/salinstudio-info-5.jpg"
            alt=""
            className="-bottom-[330px] w-[220px] -right-[50px] absolute"
          />
        </div>
      </section>
      <section className="min-h-[280px] bg-[#232323]" />
    </div>
  );
};

export default Info;
