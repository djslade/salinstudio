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
        <div className="flex flex-col items-center justify-center gap-6 h-full w-full">
          <img
            src={images[modalIndex].src}
            alt="Image"
            className="max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          />
          {images[modalIndex].name.en !== "" && (
            <div className="w-full text-center">
              <span className="font-mono font-bold text-white">
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
      <div className="tablet:hidden w-full h-full flex flex-col justify-center gap-3">
        <img
          src={images[modalIndex].src}
          alt=""
          className="w-full"
          onClick={(e) => e.stopPropagation()}
        />
        <div className="w-full text-center">
          <span className="font-mono font-bold text-white">
            {language === "fi"
              ? images[modalIndex].name.fi
              : images[modalIndex].name.en}
          </span>
        </div>
      </div>
    </div>,
    document.getElementById("modal")!
  );
};
