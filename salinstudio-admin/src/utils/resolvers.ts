import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";

export const loginFormResolver = zodResolver(
  z.object({
    username: z.string().nonempty("This field is required"),
    password: z.string().nonempty("This field is required"),
  })
);

export const signupFormResolver = zodResolver(
  z.object({
    username: z.string().nonempty("This field is required"),
    password: z.string().nonempty("This field is required"),
    secret: z.string().nonempty("This field is required"),
  })
);

export const createUpdateArtResolver = zodResolver(
  z.object({
    category: z.string().nonempty("This field is required"),
    titleEn: z.string().nonempty("This field is required"),
    titleFi: z.string().nonempty("This field is required"),
    descriptionEn: z.string(),
    descriptionFi: z.string(),
  })
);

export const updateArtResolver = zodResolver(
  z.object({
    category: z.string().nonempty("This field is required"),
    titleEn: z.string().nonempty("This field is required"),
    titleFi: z.string().nonempty("This field is required"),
    descriptionEn: z.string(),
    descriptionFi: z.string(),
    collections: z.string().array(),
  })
);

export const createUpdateCollectionResolver = zodResolver(
  z.object({
    titleEn: z.string().nonempty("This field is required"),
    titleFi: z.string().nonempty("This field is required"),
    descriptionEn: z.string(),
    descriptionFi: z.string(),
  })
);
