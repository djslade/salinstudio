import Link from "next/link";
import { InactiveLink } from "./InactiveLink";

export const Navbar = () => {
  return (
    <div className="w-full text-white self-center flex flex-col">
      <div className="flex w-full font-cursive justify-between text-[28px] px-24">
        <Link href="/" className="hover:scale-110 transition-all">
          Home
        </Link>
        <Link href="/info" className="hover:scale-110 transition-all">
          Info
        </Link>
        <Link href="/portfolio" className="hover:scale-110 transition-all">
          Portfolio
        </Link>
        <InactiveLink text="Blog" />
        <InactiveLink text="Buy" />
      </div>
      <div className="px-16 w-full">
        <hr className="self-center" />
      </div>
    </div>
  );
};
