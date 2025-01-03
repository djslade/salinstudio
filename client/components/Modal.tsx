"use client";
import { GalleryImage } from "@/types";
import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useAtomValue } from "jotai";
import { languageAtom } from "@/state";
import Lightbox from "yet-another-react-lightbox";
import { Captions, Zoom } from "yet-another-react-lightbox/plugins";

interface ModalProps {
  onClose: () => void;
  images: GalleryImage[];
  index: number;
}

export const Modal = ({ onClose, images, index }: ModalProps) => {
  const language = useAtomValue(languageAtom);

  const [modalIndex, setModalIndex] = useState<number>(index);

  const captionsRef = useRef(null);

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

  const mapImages = () => {
    return images.map((image) => {
      return {
        ...image,
        description: language === "fi" ? image.name.fi : image.name.en,
      }
    })
  }

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return ReactDOM.createPortal(
    <Lightbox
    open
    slides={mapImages()}
    index={modalIndex}
    close={onClose}
    plugins={[Captions, Zoom]}
    captions={{ descriptionTextAlign: "center" }}
    styles={{
      captionsDescriptionContainer: {
        fontFamily: "var(--ibm-plex-mono)",
        fontWeight: 700,
        fontSize: "18px",
        backgroundColor: "rgba(0,0,0,0.65)"
      }
    }}
     />,
    document.getElementById("modal")!
  );
};
