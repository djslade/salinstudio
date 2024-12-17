import Link from "next/link";

interface LogoProps {
  size: "small" | "large";
}
export const Logo = ({ size }: LogoProps) => {
  return size === "small" ? (
    <Link href="/" className="w-fit">
      <img
        src="/salinstudio-logo.svg"
        alt="Salin Studio"
        className=" w-[150px] midTablet:w-[200px] self-start"
      />
    </Link>
  ) : (
    <Link href="/" className="w-fit">
      <img
        src="/salinstudio-logo.svg"
        alt="Salin Studio"
        className="w-[200px] self-start desktop:w-[300px]"
      />
    </Link>
  );
};
