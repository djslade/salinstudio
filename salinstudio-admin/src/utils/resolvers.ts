import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";

export const loginFormResolver = zodResolver(
  z.object({
    username: z.string().nonempty("This field is required"),
    password: z.string().nonempty("This field is required"),
  }),
);

export const signupFormResolver = zodResolver(
  z.object({
    username: z.string().nonempty("This field is required"),
    password: z.string().nonempty("This field is required"),
    secret: z.string().nonempty("This field is required"),
  }),
);

export const createUpdateArtResolver = zodResolver(
  z.object({
    category: z.string().nonempty("This field is required"),
    titleEn: z.string().nonempty("This field is required"),
    titleFi: z.string().nonempty("This field is required"),
    descriptionEn: z.string(),
    descriptionFi: z.string(),
  }),
);

export const updateArtResolver = zodResolver(
  z.object({
    category: z.string().nonempty("This field is required"),
    titleEn: z.string().nonempty("This field is required"),
    titleFi: z.string().nonempty("This field is required"),
    descriptionEn: z.string(),
    descriptionFi: z.string(),
    collections: z.string().array(),
  }),
);

export const createUpdateCollectionResolver = zodResolver(
  z.object({
    titleEn: z.string().nonempty("This field is required"),
    titleFi: z.string().nonempty("This field is required"),
    descriptionEn: z.string(),
    descriptionFi: z.string(),
  }),
);

export const createStoreItemResolver = zodResolver(
  z.object({
    artId: z.string({ coerce: true }).nonempty("This field is required"),
    titleEn: z.string({ coerce: true }).nonempty("This field is required"),
    titleFi: z.string({ coerce: true }).nonempty("This field is required"),
    infoEn: z.string({ coerce: true }).nonempty("This field is required"),
    infoFi: z.string({ coerce: true }).nonempty("This field is required"),
    techniqueEn: z.string({ coerce: true }).nonempty("This field is required"),
    techniqueFi: z.string({ coerce: true }).nonempty("This field is required"),
    height: z.number({ coerce: true }).positive("Value must be greater than 0"),
    width: z.number({ coerce: true }).positive("Value must be greater than 0"),
    quantity: z
      .number({ coerce: true })
      .nonnegative("Value must be 0 or greater"),
    year: z.number({ coerce: true }).positive("Value must be greater than 0"),
    maxPrice: z
      .number({ coerce: true })
      .positive("Value must be greater than 0"),
    isPublic: z.boolean({ coerce: true }),
    isOriginal: z.boolean({ coerce: true }),
    isFramed: z.boolean({ coerce: true }),
    isFeatured: z.boolean({ coerce: true }),
  }),
);

export const updateStoreItemResolver = zodResolver(
  z.object({
    artId: z.string({ coerce: true }).nonempty("This field is required"),
    titleEn: z.string({ coerce: true }).nonempty("This field is required"),
    titleFi: z.string({ coerce: true }).nonempty("This field is required"),
    infoEn: z.string({ coerce: true }).nonempty("This field is required"),
    infoFi: z.string({ coerce: true }).nonempty("This field is required"),
    techniqueEn: z.string({ coerce: true }).nonempty("This field is required"),
    techniqueFi: z.string({ coerce: true }).nonempty("This field is required"),
    height: z.number({ coerce: true }).positive("Value must be greater than 0"),
    width: z.number({ coerce: true }).positive("Value must be greater than 0"),
    quantity: z
      .number({ coerce: true })
      .nonnegative("Value must be 0 or greater"),
    year: z.number({ coerce: true }).positive("Value must be greater than 0"),
    maxPrice: z
      .number({ coerce: true })
      .positive("Value must be greater than 0"),
    currentPrice: z
      .number({ coerce: true })
      .positive("Value must be greater than 0"),
    isPublic: z.boolean({ coerce: true }),
    isOriginal: z.boolean({ coerce: true }),
    isFramed: z.boolean({ coerce: true }),
    isFeatured: z.boolean({ coerce: true }),
    isOnSale: z.boolean({ message: "This field is required" }),
  }),
);

export const updateRoleResolver = zodResolver(
  z.object({
    role: z.string(),
  }),
);
