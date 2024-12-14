import { Logo } from "./Logo";
import { Navbar } from "./Navbar";

export const Header = () => {
  return (
    <section className="bg-darkest w-full p-12 flex flex-col">
      <Logo size="small" />
      <div className="w-[600px] text-white self-center flex flex-col">
        <Navbar />
      </div>
    </section>
  );
};
