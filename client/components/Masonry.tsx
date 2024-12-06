"use client";
import React, { useEffect, useRef, useState } from "react";

interface MasonryProps {
  images: string[];
  columnCount: number; // Number of columns to approximate
  gap: number; // Gap between items
}

interface Position {
  top: number;
  left: number;
  width: number;
  height: number;
}

export const Masonry: React.FC<MasonryProps> = ({
  images,
  columnCount,
  gap,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Position[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    const approximateColumnWidth =
      (containerWidth - gap * (columnCount - 1)) / columnCount;
    const columnHeights = Array(columnCount).fill(0);

    const items = Array.from(containerRef.current.children) as HTMLElement[];
    const newPositions: Position[] = items.map((item, index) => {
      const img = item.querySelector("img") as HTMLImageElement;

      if (!img || !img.naturalWidth || !img.naturalHeight) {
        return { top: 0, left: 0, width: 0, height: 0 };
      }

      // Determine scaling factor based on approximate column width
      const scaleFactor = approximateColumnWidth / img.naturalWidth;
      const width = img.naturalWidth * scaleFactor;
      const height = img.naturalHeight * scaleFactor;

      // Find the shortest column
      const columnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      const top = columnHeights[columnIndex];
      const left = columnIndex * (approximateColumnWidth + gap);

      // Update the column height
      columnHeights[columnIndex] += height + gap;

      return { top, left, width, height };
    });

    setPositions(newPositions);
  }, [images, columnCount, gap]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
      }}
    >
      {images.map((src, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            top: positions[index]?.top || 0,
            left: positions[index]?.left || 0,
            width: positions[index]?.width || "auto",
            height: positions[index]?.height || "auto",
          }}
        >
          <img
            src={src}
            alt={`Image ${index}`}
            style={{
              display: "block",
              width: "100%",
              height: "auto", // Maintain aspect ratio
            }}
          />
        </div>
      ))}
    </div>
  );
};
