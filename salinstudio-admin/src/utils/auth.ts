import {
  clearTokens,
  hasTokens,
  setTokens,
  type Tokens,
} from "./tokens";
import { postRequest } from "./requests";

export const refreshTokens = async () => {
  if (!hasTokens()) return;
  try {
    const res = await postRequest<Tokens>("/auth/refresh", null, {
      refreshToken: true,
    });
    setTokens({ accessToken: res.accessToken, refreshToken: res.refreshToken });
  } catch (err) {
    clearTokens();
  }
};

export const logout = async () => {
  try {
    if (!hasTokens()) return;
    await postRequest("/auth/logout", null, { refreshToken: true });
  } catch (err) {
    console.error(err);
  } finally {
    clearTokens();
  }
};
