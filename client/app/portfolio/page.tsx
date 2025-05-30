import { Art } from "@/types/Art";
import { Portfolio } from "./Portfolio";

export default async function PortfolioPage() {
  const res = await fetch("http://server:3000/art", {
    cache: "no-store",
  });
  const data = await res.json();
  const art: Art[] = data.art;

  return <Portfolio art={art} />;
}
