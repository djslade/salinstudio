import Link from "next/link";

interface LogoProps {
  size: "small" | "large";
}
export const Logo = ({ size }: LogoProps) => {
  return size === "small" ? (
    <Link href="/" className="h-full">
      <img
        src="/salinstudio-logo.svg"
        alt="Salin Studio"
        className="h-full self-start tablet:h-auto w-[120px]"
      />
    </Link>
  ) : (
    <Link href="/" className="w-fit">
      <img
        src="/salinstudio-logo.svg"
        alt="Salin Studio"
        className="w-[200px] self-start desktop:w-[250px]"
      />
    </Link>
  );
};
