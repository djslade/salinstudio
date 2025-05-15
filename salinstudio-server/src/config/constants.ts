export const DATABASE_CONFIG = {
  PROVIDER_NAME: 'DATA_SOURCE',
  TYPE: 'postgres',
  HOST: 'localhost',
  PORT: 5432,
  USERNAME: process.env.DB_USERNAME ?? 'postgres',
  PASSWORD: process.env.DB_PASSWORD ?? 'postgres',
  DATABASE: process.env.DB_NAME ?? 'salinstudio',
  SYNCHRONIZE: process.env.MODE !== 'production',
};

export const REPOSITORY_NAMES = {
  USER: 'USER_REPOSITORY',
  REFRESH_TOKEN: 'REFRESH_TOKEN_REPOSITORY',
  ART: 'ART_REPOSITORY',
};

export const SIGNUP_SECRET = process.env.SIGNUP_SECRET ?? 'signup-secret';
export const JWT_SECRET = process.env.JWT_SECRET ?? 'jwt-secret';
export const REFRESH_EXPIRES_AT_MS = 60 * 24 * 60 * 60 * 1000;
