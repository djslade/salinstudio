const STORAGE_KEY_ACCESS = "salinstudio.admin.access";
const STORAGE_KEY_REFRESH = "salinstudio.admin.refresh";

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export const setTokens = (tokens: Tokens) => {
  localStorage.setItem(STORAGE_KEY_ACCESS, tokens.accessToken);
  localStorage.setItem(STORAGE_KEY_REFRESH, tokens.refreshToken);
};

export const getTokens = () => {
  const accessToken = localStorage.getItem(STORAGE_KEY_ACCESS);
  const refreshToken = localStorage.getItem(STORAGE_KEY_REFRESH);
  if (!accessToken || !refreshToken) return null;
  return {
    accessToken,
    refreshToken,
  };
};

export const hasTokens = () => getTokens() !== null;

export const clearTokens = () => {
  localStorage.removeItem(STORAGE_KEY_ACCESS);
  localStorage.removeItem(STORAGE_KEY_REFRESH);
};
