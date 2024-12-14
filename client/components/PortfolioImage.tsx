import { GalleryImage } from "@/types";

interface PortfolioImageProps {
  image: GalleryImage;
  onClick: () => void;
}

export const PortfolioImage = ({ image, onClick }: PortfolioImageProps) => {
  return (
    <button onClick={onClick} className="w-full">
      <img src={image.src} alt="" className="w-full" />
    </button>
  );
};
