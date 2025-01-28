import { parseCookies, setCookie, destroyCookie } from 'nookies';
import { jwtDecode } from 'jwt-decode';

export const TOKEN_KEY = '@courts:accessToken';
export const REFRESH_TOKEN_KEY = '@courts:refreshToken';

interface TokenPayload {
  exp: number;
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};

export const getAccessToken = () => {
  const { [TOKEN_KEY]: token } = parseCookies();
  return token;
};

export const getRefreshToken = () => {
  const { [REFRESH_TOKEN_KEY]: refreshToken } = parseCookies();
  return refreshToken;
};

export const setTokens = (accessToken: string, refreshToken: string) => {
  setCookie(undefined, TOKEN_KEY, accessToken, {
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });

  setCookie(undefined, REFRESH_TOKEN_KEY, refreshToken, {
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });
};

export const removeTokens = () => {
  destroyCookie(undefined, TOKEN_KEY);
  destroyCookie(undefined, REFRESH_TOKEN_KEY);
}; 