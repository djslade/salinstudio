"use client";
import { RiErrorWarningLine } from "react-icons/ri";
import { Field } from "formik";
import { useState } from "react";

interface FormControlProps {
  id: string;
  name: string;
  type: string;
  as: string;
  placeholder: string;
  touched: boolean | undefined;
  error: string | undefined;
}

export const FormControl = ({
  id,
  name,
  type,
  as,
  placeholder,
  touched,
  error,
}: FormControlProps) => {
  const [hovered, setHovered] = useState<boolean>(false);
  return (
    <div className="relative w-full">
      {as === "textarea" ? (
        <Field
          as={as}
          id={id}
          name={name}
          type={type}
          className="bg-transparent border-b border-white resize-none py-2 outline-none w-full pr-8"
          placeholder={placeholder}
        />
      ) : (
        <Field
          id={id}
          name={name}
          type={type}
          className="bg-transparent border-b border-white py-2 outline-none w-full pr-8"
          placeholder={placeholder}
        />
      )}
      {touched && error && (
        <RiErrorWarningLine
          className="absolute right-0 top-1/2 -translate-y-1/2 text-red-500"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        />
      )}
      {hovered && (
        <div className="absolute top-1/2 -translate-y-1/2 p-3 bg-transparent right-8 rounded font-sans">
          <span className="">{error}</span>
        </div>
      )}
    </div>
  );
};
