import axios, { AxiosError } from "axios";
import { clearTokens, getTokens, setTokens } from "./tokens";

type LoginRequestBody = {
  username: string;
  password: string;
};

type LoginResponse = {
  message: string;
  accessToken: string;
  refreshToken: string;
};

type LogoutResponse = {
  message: string;
};

type SignupResponse = {
  message: string;
};

type UserResponse = {
  message: string;
  user: {
    id: string;
    username: string;
  };
};

type RefreshResponse = {
  message: string;
  accessToken: string;
  refreshToken: string;
};

type ErrorResponse = {
  message: string;
  error: string;
  statusCode: number;
};

type SignupRequestBody = LoginRequestBody & {
  secret: string;
};

export const getEndpoint = () => import.meta.env.VITE_ENDPOINT ?? "";

export const isAuthenticated = () => {
  return getTokens() !== null;
};

export const sendSignupRequest = async (body: SignupRequestBody) => {
  const res = await axios.post(getEndpoint() + "/auth/signup", body);
  const data: SignupResponse = res.data;
  return data;
};

export const sendLoginRequest = async (body: LoginRequestBody) => {
  const res = await axios.post(getEndpoint() + "/auth/login", body);
  const data: LoginResponse = res.data;
  return data;
};

export const sendLogoutRequest = async () => {
  const res = await axios.post(getEndpoint() + "/auth/logout", null, {
    headers: { Authorization: "Bearer " + getTokens()?.refreshToken },
  });
  const data: LogoutResponse = res.data;
  return data;
};

export const sendUserRequest = async () => {
  const res = await axios.get(getEndpoint() + "/auth", {
    headers: { Authorization: "Bearer " + getTokens()?.accessToken },
  });
  const data: UserResponse = res.data;
  return data;
};

export const sendRefreshRequest = async () => {
  const res = await axios.post(getEndpoint() + "/auth/refresh", null, {
    headers: { Authorization: "Bearer " + getTokens()?.refreshToken },
  });
  const data: RefreshResponse = res.data;
  return data;
};

export const refreshTokens = async (redirectFn: () => void) => {
  try {
    const res = await sendRefreshRequest();
    setTokens({ accessToken: res.accessToken, refreshToken: res.refreshToken });
  } catch (err) {
    clearTokens();
    redirectFn();
  }
};

export const getErrorResponseOrThrow = (err: unknown) => {
  if (err instanceof AxiosError === false) throw err;
  if (!err.response) throw err;
  const data: ErrorResponse = err.response.data;
  return data;
};
