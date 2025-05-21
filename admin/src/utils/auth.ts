import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { clearTokens, getTokens, setTokens } from "./tokens";
import type { ErrorResponse, RefreshResponse } from "../types/requests";

export const getEndpoint = () => import.meta.env.VITE_ENDPOINT ?? "";

export const isAuthenticated = () => {
  return getTokens() !== null;
};

type SendRequestOptions = {
  accessToken?: boolean;
  refreshToken?: boolean;
};

function genRequestConfig(options?: SendRequestOptions): AxiosRequestConfig {
  const config: AxiosRequestConfig = {};
  if (options?.accessToken) {
    config.headers = { Authorization: "Bearer " + getTokens()?.accessToken };
  } else if (options?.refreshToken) {
    config.headers = { Authorization: "Bearer " + getTokens()?.refreshToken };
  }
  return config;
}

export async function get<T>(
  path: string,
  options?: SendRequestOptions
): Promise<T> {
  const config: AxiosRequestConfig = genRequestConfig(options);
  const res = await axios.get(getEndpoint() + path, config);
  const data: T = res.data;
  return data;
}

export async function post<S, E>(
  path: string,
  body: E,
  options?: SendRequestOptions
): Promise<S> {
  const config: AxiosRequestConfig = genRequestConfig(options);
  const res = await axios.post(getEndpoint() + path, body, config);
  const data: S = res.data;
  return data;
}

export const refreshTokens = async () => {
  try {
    const res = await post<RefreshResponse, null>("/auth/refresh", null, {
      refreshToken: true,
    });
    setTokens({ accessToken: res.accessToken, refreshToken: res.refreshToken });
  } catch (err) {
    clearTokens();
  }
};

export const getErrorResponseOrThrow = (err: unknown) => {
  if (err instanceof AxiosError === false) throw err;
  if (!err.response) throw err;
  const data: ErrorResponse = err.response.data;
  return data;
};

export const logout = async () => {
  try {
    await post("/auth/logout", null, { refreshToken: true });
  } catch (err) {
    // do nothing
    return;
  } finally {
    clearTokens();
  }
};
