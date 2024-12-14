"use client";
import { useState } from "react";

interface InactiveLinkProps {
  text: string;
}

export const InactiveLink = ({ text }: InactiveLinkProps) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  return (
    <div className="relative">
      <span
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {text}
      </span>
      {isHovered && (
        <div className="absolute -bottom-[30px] whitespace-nowrap bg-homeGray px-3 font-sans text-[18px] left-1/2 -translate-x-1/2">
          <span>Coming soon!</span>
        </div>
      )}
    </div>
  );
};
