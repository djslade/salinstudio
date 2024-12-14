"use client";
import { useState } from "react";
import { PortfolioImage } from "./PortfolioImage";
import { Modal } from "./Modal";
import { GalleryImage } from "@/types";

interface GalleryProps {
  images: GalleryImage[];
}

export const Gallery = ({ images }: GalleryProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const [modalIndex, setModalIndex] = useState<number>(0);

  const handleShowModal = (index: number) => {
    setModalIndex(index);
    setShowModal(true);
  };

  const getColumnArrays = (array: GalleryImage[], columnCount: number) => {
    const columnsArray: GalleryImage[][] = [];
    for (let i = 0; i < columnCount; i++) {
      if (array.length > i) {
        columnsArray.push(array.filter((_, idx) => idx % columnCount === i));
      }
    }
    return columnsArray;
  };

  return (
    <section
      className="w-full max-w-[1280px] mx-auto my-0 flex"
      style={{
        columnCount: "3",
        columnGap: "8px",
      }}
    >
      {getColumnArrays(images, 3).map((column, idx) => (
        <div className="w-full max-w-[33%]" key={`column-${idx}`}>
          {column.map((image, i) => (
            <PortfolioImage
              key={image.src}
              image={image}
              onClick={() => handleShowModal(image.index)}
            />
          ))}
        </div>
      ))}
      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          images={images}
          index={modalIndex}
        />
      )}
    </section>
  );
};
