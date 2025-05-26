"use client";
import { useEffect } from "react";
import ReactDOM from "react-dom";
import { useAtomValue } from "jotai";
import { languageAtom } from "@/state";
import Lightbox from "yet-another-react-lightbox";
import { Captions, Zoom } from "yet-another-react-lightbox/plugins";
import { Art } from "@/types/Art";

interface ModalProps {
  onClose: () => void;
  images: Art[];
  id: string;
}

export const Modal = ({ onClose, images, id }: ModalProps) => {
  const language = useAtomValue(languageAtom);

  const mapImages = () => {
    return images.map((image) => {
      return {
        ...image,
        description: language === "fi" ? image.titleFi : image.titleEn,
        src: image.desktopUrl,
      };
    });
  };

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
      index={images.findIndex((a) => a.id === id)}
      close={onClose}
      plugins={[Captions, Zoom]}
      captions={{ descriptionTextAlign: "center" }}
      styles={{
        captionsDescriptionContainer: {
          fontFamily: "var(--ibm-plex-mono)",
          fontWeight: 700,
          fontSize: "18px",
          backgroundColor: "rgba(0,0,0,0.65)",
        },
      }}
    />,
    document.getElementById("modal")!
  );
};
