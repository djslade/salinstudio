import Link from "next/link";

interface LogoProps {
  size: "small" | "large";
}
export const Logo = ({ size }: LogoProps) => {
  return size === "small" ? (
    <Link href="/">
      <img
        src="/salinstudio-logo.svg"
        alt="Salin Studio"
        className="w-[200px] self-start"
      />
    </Link>
  ) : (
    <Link href="/">
      <img
        src="/salinstudio-logo.svg"
        alt="Salin Studio"
        className="w-[300px] self-start"
      />
    </Link>
  );
};
