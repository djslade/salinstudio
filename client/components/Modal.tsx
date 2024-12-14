"use client";
import { GalleryImage } from "@/types";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useAtomValue } from "jotai";
import { languageAtom } from "@/state";

interface ModalProps {
  onClose: () => void;
  images: GalleryImage[];
  index: number;
}

export const Modal = ({ onClose, images, index }: ModalProps) => {
  const language = useAtomValue(languageAtom);

  const [modalIndex, setModalIndex] = useState<number>(index);

  const handlePrevious = (evt: any) => {
    evt.stopPropagation();
    if (modalIndex === 0) {
      setModalIndex(images.length - 1);
    } else {
      setModalIndex(modalIndex - 1);
    }
  };

  const handleNext = (evt: any) => {
    evt.stopPropagation();
    if (modalIndex === images.length - 1) {
      setModalIndex(0);
    } else {
      setModalIndex(modalIndex + 1);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content">
        <button onClick={handlePrevious} className="w-10">
          <img src="/salinstudio-left.svg" alt="Left" />
        </button>
        <div className="flex flex-col items-center gap-6 h-[80%]">
          <img
            src={images[modalIndex].src}
            alt="Image"
            className="h-full w-auto"
            onClick={(e) => e.stopPropagation()}
          />
          {images[modalIndex].name.en !== "" && (
            <div
              className="w-full text-[22px] text-center py-3 px-12 bg-buttonGray max-w-fit"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="font-mono font-bold">
                {language === "fi"
                  ? images[modalIndex].name.fi
                  : images[modalIndex].name.en}
              </span>
            </div>
          )}
        </div>
        <button onClick={handleNext} className="w-10">
          <img src="/salinstudio-right.svg" alt="right" />
        </button>
      </div>
    </div>,
    document.getElementById("modal")!
  );
};
