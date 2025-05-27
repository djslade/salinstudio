import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { getTokens } from "./tokens";
import { refreshTokens } from "./auth";

type RequestOptions = {
  accessToken?: boolean;
  refreshToken?: boolean;
};

type RequestBody =
  | FormData
  | {
      username?: string;
      password?: string;
      secret?: string;
      category?: string;
      titleEn?: string;
      titleFi?: string;
      descriptionEn?: string;
      descriptionFi?: string;
    }
  | null;

export type ErrorResponse = {
  message: string;
  error: string;
  statusCode: number;
};

const getEndpoint = () => import.meta.env.VITE_ENDPOINT ?? "";

const getResponseData = <T>(res: AxiosResponse) => {
  const data: T = res.data;
  return data;
};

const getRequestConfig = (options?: RequestOptions) => {
  const config: AxiosRequestConfig = {};
  const tokens = getTokens();
  if (options?.accessToken && tokens) {
    config.headers = { Authorization: "Bearer " + tokens.accessToken };
  } else if (options?.refreshToken && tokens) {
    config.headers = { Authorization: "Bearer " + tokens.refreshToken };
  }
  return config;
};

export const getRequest = async <T>(path: string, options?: RequestOptions) => {
  const config: AxiosRequestConfig = getRequestConfig(options);
  const res = await axios.get(getEndpoint() + path, config);
  return getResponseData<T>(res);
};

export const postRequest = async <T>(
  path: string,
  body: RequestBody,
  options?: RequestOptions
) => {
  const config: AxiosRequestConfig = getRequestConfig(options);
  const res = await axios.post(getEndpoint() + path, body, config);
  return getResponseData<T>(res);
};

export const putRequest = async <T>(
  path: string,
  body: RequestBody,
  options?: RequestOptions
) => {
  const config: AxiosRequestConfig = getRequestConfig(options);
  const res = await axios.put(getEndpoint() + path, body, config);
  return getResponseData<T>(res);
};

export const deleteRequest = async <T>(
  path: string,
  options?: RequestOptions
) => {
  const config: AxiosRequestConfig = getRequestConfig(options);
  const res = await axios.delete(getEndpoint() + path, config);
  return getResponseData<T>(res);
};

export const getErrorResponseOrThrow = (err: unknown) => {
  if (err instanceof AxiosError === false) throw err;
  if (!err.response) throw err;
  const data: ErrorResponse = err.response.data;
  return data;
};

export const refreshIfUnauthorized = async <T>(
  requestFn: () => T,
  refresh: boolean = true
) => {
  try {
    return requestFn();
  } catch (err) {
    const res = getErrorResponseOrThrow(err);
    if (res.statusCode === 401 && refresh) {
      await refreshTokens();
      refreshIfUnauthorized(requestFn, false);
    } else {
      throw err;
    }
  }
};

export const showRequestError = (err: unknown) => {
  const res = getErrorResponseOrThrow(err);
  return {
    group: "main",
    severity: "error",
    closable: true,
    summary: res.message,
    life: 5000,
  };
};
