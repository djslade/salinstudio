import type { Art, Category } from "./data";

export type LoginResponse = {
  message: string;
  accessToken: string;
  refreshToken: string;
};

export type LogoutResponse = {
  message: string;
};

export type SignupResponse = {
  message: string;
};

export type UserResponse = {
  message: string;
  user: {
    id: string;
    username: string;
  };
};

export type RefreshResponse = {
  message: string;
  accessToken: string;
  refreshToken: string;
};

export type ErrorResponse = {
  message: string;
  error: string;
  statusCode: number;
};

export type AllArtResponse = {
  message: string;
  art: Art[];
};

export type AllCategoriesResponse = {
  message: string;
  genres: Category[];
};

export type CreateCategoryResponse = {
  message: string;
  genre: Category;
};

export type GetCategoryResponse = {
  message: string;
  genre: Category;
};
