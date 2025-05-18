export type LoginRequestBody = {
  username: string;
  password: string;
};

export type SignupRequestBody = LoginRequestBody & {
  secret: string;
};

export type CreateCategoryRequestBody = {
  nameEn: string;
  nameFi: string;
};
