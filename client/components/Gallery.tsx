"use client";
import React, { useEffect, useRef, useState } from "react";
import { PortfolioImage } from "./PortfolioImage";
import { Modal } from "./Modal";
import { GalleryImage } from "@/types";

interface GalleryProps {
  images: GalleryImage[];
}

interface ImageDimension {
  index: number;
  height: number;
  width: number;
  isLoaded: boolean;
}

export const Gallery = ({ images }: GalleryProps) => {
  const [containerWidth, setContainerWidth] = useState(1440);

  const [containerHeight, setContainerHeight] = useState(0);

  const galleryRef = useRef<HTMLElement>(null);

  const [imageDimensions, setImageDimensions] = useState<ImageDimension[]>([]);

  const [loaded, setLoaded] = useState<boolean>(false);

  const [showModal, setShowModal] = useState<boolean>(false);

  const [modalIndex, setModalIndex] = useState<number>(0);

  const handleShowModal = (index: number) => {
    setModalIndex(index);
    setShowModal(true);
  };

  const calculateColumnHeight = (index: number) => {
    const columnCount: number = 3;
    const gap: number = 8;
    const mod: number = index % columnCount;
    const column = imageDimensions
      .slice(0, index)
      .filter((_, idx) => idx % columnCount === mod);
    if (column.length === 0) return 0;
    const columnHeight: number = column.reduce(
      (acc, item) => acc + item.height + gap,
      0
    );
    return columnHeight;
  };

  const calculateRowWidth = (index: number) => {
    const columnCount: number = 3;
    const gap: number = 8;
    const mod: number = Math.floor(index / columnCount);
    const row = imageDimensions
      .slice(0, index)
      .filter((_, idx) => Math.floor(idx / columnCount) === mod);
    if (row.length === 0) return 0;
    const rowWidth = row.reduce((acc, item) => acc + item.width + gap, 0);
    return rowWidth;
  };

  const calculateHighestColumn = () => {
    const heights: number[] = [];
    const columnCount: number = 3;
    for (
      let i = images.length - 1;
      i > images.length - 1 - columnCount && i >= 0;
      i--
    ) {
      heights.push(calculateColumnHeight(i) + imageDimensions[i].height);
    }
    return Math.max(...heights);
  };

  const assignImageDimension = (
    index: number,
    height: number,
    width: number
  ) => {
    setImageDimensions((prev) =>
      prev.map((item, idx) => {
        if (idx === index) {
          return {
            index,
            height,
            width,
            isLoaded: true,
          };
        } else {
          return item;
        }
      })
    );
  };

  useEffect(() => {
    setImageDimensions(
      images.map((_, idx) => {
        return {
          index: idx,
          height: 0,
          width: 0,
          isLoaded: false,
        };
      })
    );
  }, [images]);

  useEffect(() => {
    const handleContainerWidth = () => {
      if (!galleryRef || !galleryRef.current) return;
      setContainerWidth(
        galleryRef.current.clientWidth > 1440
          ? 1440
          : galleryRef.current.clientWidth
      );
    };

    handleContainerWidth();

    window.addEventListener("resize", handleContainerWidth);

    return () => window.removeEventListener("resize", handleContainerWidth);
  }, []);

  useEffect(() => {
    if (!galleryRef || !galleryRef.current) return;
    setContainerWidth(
      galleryRef.current.clientWidth > 1440
        ? 1440
        : galleryRef.current.clientWidth
    );
  }, [containerWidth, images]);

  useEffect(() => {
    setLoaded(false);
  }, [images]);

  useEffect(() => {
    if (!loaded) return;
    setContainerHeight(calculateHighestColumn());
  }, [loaded]);

  useEffect(() => {
    if (loaded) return;
    const array = imageDimensions.filter(
      (dimension) => dimension.isLoaded === false
    );
    if (array.length === 0) {
      setLoaded(true);
    }
  });

  return (
    <section
      ref={galleryRef}
      className="w-full max-w-[1440px] mx-auto my-0 relative"
      style={{
        minHeight: containerHeight,
      }}
    >
      {images.map((image, idx) => (
        <PortfolioImage
          src={image.src}
          key={image.src}
          index={idx}
          top={calculateColumnHeight(idx)}
          left={calculateRowWidth(idx)}
          onLoad={assignImageDimension}
          containerWidth={containerWidth}
          onClick={() => handleShowModal(idx)}
        />
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
