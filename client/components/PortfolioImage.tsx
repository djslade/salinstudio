import { Art } from "@/types/Art";

interface PortfolioImageProps {
  image: Art;
  onClick: () => void;
}

export const PortfolioImage = ({ image, onClick }: PortfolioImageProps) => {
  return (
    <button onClick={onClick} className="w-full">
      <img src={image.thumbUrl} alt="" className="w-full" />
    </button>
  );
};
