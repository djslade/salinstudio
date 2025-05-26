"use client";
import { useState } from "react";
import { PortfolioImage } from "./PortfolioImage";
import { Modal } from "./Modal";
import { Art } from "@/types/Art";

interface GalleryProps {
  images: Art[];
}

export const Gallery = ({ images }: GalleryProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const [modalIndex, setModalIndex] = useState<string>("");

  const handleShowModal = (index: string) => {
    setModalIndex(index);
    setShowModal(true);
  };

  const getColumnArrays = (array: Art[], columnCount: number) => {
    const columnsArray: Art[][] = [];
    for (let i = 0; i < columnCount; i++) {
      columnsArray.push(array.filter((_, idx) => idx % columnCount === i));
    }
    return columnsArray;
  };

  return (
    <section className="w-full max-w-[1280px] mx-auto my-0">
      <div
        className="w-full hidden tablet:flex"
        style={{ columnCount: "auto", columnGap: "8px" }}
      >
        {getColumnArrays(images, 4).map((column, idx) => (
          <div className="w-full flex-1" key={`column-${idx}`}>
            {column.map((image) => (
              <PortfolioImage
                key={image.id}
                image={image}
                onClick={() => handleShowModal(image.id)}
              />
            ))}
          </div>
        ))}
      </div>
      <div
        className="w-full hidden midMobile:flex tablet:hidden"
        style={{ columnCount: "auto", columnGap: "4px" }}
      >
        {getColumnArrays(images, 3).map((column, idx) => (
          <div className="w-full flex-1" key={`column-${idx}`}>
            {column.map((image) => (
              <PortfolioImage
                key={image.id}
                image={image}
                onClick={() => handleShowModal(image.id)}
              />
            ))}
          </div>
        ))}
      </div>
      <div
        className="w-full flex midMobile:hidden"
        style={{ columnCount: "auto", columnGap: "4px" }}
      >
        {getColumnArrays(images, 2).map((column, idx) => (
          <div className="w-full flex-1" key={`column-${idx}`}>
            {column.map((image) => (
              <PortfolioImage
                key={image.id}
                image={image}
                onClick={() => handleShowModal(image.id)}
              />
            ))}
          </div>
        ))}
      </div>
      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          images={images}
          id={modalIndex}
        />
      )}
    </section>
  );
};
