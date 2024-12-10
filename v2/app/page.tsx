"use client";
import { RefObject, useRef } from "react";

const drawings = [
  {
    src: "/salinstudio-gallery-1.jpg",
    name: {
      en: '"Insurmountable"',
      fi: '"Ylitsepääsemätön"',
    },
  },
  {
    src: "/salinstudio-gallery-2.jpg",
    name: {
      en: "Reference picture",
      fi: "Referenssikuva",
    },
  },
  {
    src: "/salinstudio-gallery-3.jpg",
    name: {
      en: "Schoolwork",
      fi: "Koulu tehtävä",
    },
  },
  {
    src: "/salinstudio-gallery-4.jpg",
    name: {
      en: 'Inktober 2023 "Golden"',
      fi: 'Inktober 2023 "Kultainen"',
    },
  },
  {
    src: "/salinstudio-gallery-5.jpg",
    name: {
      en: "Protect thy brother",
      fi: "Suojele veljeäsi",
    },
  },
  {
    src: "/salinstudio-gallery-6.jpg",
    name: {
      en: "Reference picture",
      fi: "Referenssikuva",
    },
  },
  {
    src: "/salinstudio-gallery-7.jpg",
    name: {
      en: "Schoolwork",
      fi: "Koulu tehtävä",
    },
  },
  {
    src: "/salinstudio-gallery-8.jpg",
    name: {
      en: '"Christina"',
      fi: '"Christina"',
    },
  },
  {
    src: "/salinstudio-gallery-9.jpg",
    name: {
      en: "Schoolwork",
      fi: "Koulu tehtävä",
    },
  },
  {
    src: "/salinstudio-gallery-10.jpg",
    name: {
      en: "Reference picture",
      fi: "Referenssikuva",
    },
  },
  {
    src: "/salinstudio-gallery-11.jpg",
    name: {
      en: '"What could have been"',
      fi: '"Mikä olisi voinut olla"',
    },
  },
  {
    src: "/salinstudio-gallery-12.jpg",
    name: {
      en: "Reference picture",
      fi: "Referenssikuva",
    },
  },
  {
    src: "/salinstudio-gallery-13.jpg",
    name: {
      en: "Reference picture",
      fi: "Referenssikuva",
    },
  },
  {
    src: "/salinstudio-gallery-14.jpg",
    name: {
      en: '"Mother and son"',
      fi: '"Äiti ja poika"',
    },
  },
  {
    src: "/salinstudio-gallery-15.jpg",
    name: {
      en: "Reference picture",
      fi: "Referenssikuva",
    },
  },
  {
    src: "/salinstudio-gallery-16.jpg",
    name: {
      en: '"Bella"',
      fi: '"Bella"',
    },
  },
  {
    src: "/salinstudio-gallery-17.jpg",
    name: {
      en: '"HAN"',
      fi: '"HAN"',
    },
  },
  {
    src: "/salinstudio-gallery-18.jpg",
    name: {
      en: "Reference picture",
      fi: "Referenssikuva",
    },
  },
  {
    src: "/salinstudio-gallery-19.jpg",
    name: {
      en: "Reference picture",
      fi: "Referenssikuva",
    },
  },
  {
    src: "/salinstudio-gallery-20.jpg",
    name: {
      en: '"You are my future"',
      fi: '"Sinä olet tulevaisuuteni"',
    },
  },
  {
    src: "/salinstudio-gallery-21.jpg",
    name: {
      en: "Reference picture",
      fi: "Referenssikuva",
    },
  },
  {
    src: "/salinstudio-gallery-22.jpg",
    name: {
      en: "Reference picture",
      fi: "Referenssikuva",
    },
  },
  {
    src: "/salinstudio-gallery-23.jpg",
    name: {
      en: 'Inktober 2023 "Bounce"',
      fi: 'Inktober 2023 "Pomppu"',
    },
  },
];

interface GalleryImageProps {
  src: string;
  alt: string;
}

const GalleryImage = ({ src, alt }: GalleryImageProps) => {
  const imageRef = useRef<HTMLImageElement>(null);

  const calculateColumnSpan = (ref: RefObject<HTMLImageElement | null>) => {
    if (!imageRef || !imageRef.current) return 0;
    const maxWidth = 1440 - 8 * 2;
    const percentage = (imageRef.current.naturalWidth / maxWidth) * 100;
  };

  return (
    <img
      src={src}
      alt={alt}
      style={{ height: "auto", width: "auto", gridColumnStart: 1 }}
    />
  );
};

export default function Home() {
  return (
    <div>
      <main className="main">
        {drawings.map((image) => (
          <img
            key={image.src}
            src={image.src}
            alt={image.name.en}
            style={{ height: "auto", width: "auto", gridColumnStart: 1 }}
          />
        ))}
      </main>
    </div>
  );
}
