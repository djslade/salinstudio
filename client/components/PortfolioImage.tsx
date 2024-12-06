"use client";
import React, { useEffect, useRef, useState } from "react";

interface PortfolioImageProps {
  src: string;
  index: number;
  top: number;
  left: number;
  onLoad: (index: number, height: number, width: number) => void;
  containerWidth: number;
}

export const PortfolioImage = ({
  src,
  index,
  top,
  left,
  onLoad,
  containerWidth,
}: PortfolioImageProps) => {
  const imageRef = useRef<HTMLImageElement>(null);

  const [width, setWidth] = useState(0);

  const [height, setHeight] = useState(0);

  const [loaded, setLoaded] = useState(false);

  const getImageWidth = () => {
    if (!imageRef || !imageRef.current) return 0;
    const maxWidth = 1440 - 8 * 2;
    return (imageRef.current.naturalWidth / maxWidth) * 100;
  };

  const getImageHeight = () => {
    if (!imageRef || !imageRef.current) return 0;
    const ratio =
      imageRef.current.naturalWidth / imageRef.current.naturalHeight;
    const currentWidth = (getImageWidth() * (containerWidth - 8 * 2)) / 100;
    const height = currentWidth / ratio;
    return height;
  };

  const handleOnLoad = () => {
    if (!imageRef || !imageRef.current) return;
    onLoad(index, imageRef.current.height, imageRef.current.width);
  };

  useEffect(() => {
    setWidth(getImageWidth());
    setHeight(getImageHeight());
  }, []);

  useEffect(() => {
    if (width !== 0 && height !== 0) {
      setLoaded(true);
    }
  }, [width, height]);

  useEffect(() => {
    if (loaded) {
      handleOnLoad();
    }
  }, [loaded]);

  return (
    <img
      ref={imageRef}
      src={src}
      alt=""
      style={{
        width: `${width}%`,
        height: `${height}px`,
        position: "absolute",
        top: `${top}px`,
        left,
      }}
    />
  );
};
