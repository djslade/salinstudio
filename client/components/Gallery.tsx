"use client";
import React, { useEffect, useRef, useState } from "react";
import { PortfolioImage } from "./PortfolioImage";

interface GalleryProps {
  images: string[];
}

export const Gallery = ({ images }: GalleryProps) => {
  const [containerWidth, setContainerWidth] = useState(1440);

  const galleryRef = useRef<HTMLElement>(null);

  const [imageDimensions, setImageDimensions] = useState<any[]>(
    images.map((_, idx) => {
      return {
        index: idx,
        height: 0,
        width: 0,
      };
    })
  );

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
          };
        } else {
          return item;
        }
      })
    );
  };

  useEffect(() => {
    if (!galleryRef || !galleryRef.current) return;
    console.log(galleryRef.current.clientWidth);
    setContainerWidth(galleryRef.current.clientWidth);
  }, [containerWidth]);

  return (
    <section ref={galleryRef} className="max-w-[1440px] mx-auto my-0 relative">
      {images.map((image, idx) => (
        <PortfolioImage
          src={image}
          key={image}
          index={idx}
          top={calculateColumnHeight(idx)}
          left={calculateRowWidth(idx)}
          onLoad={assignImageDimension}
          containerWidth={containerWidth}
        />
      ))}
    </section>
  );
};
