import { parseCookies, setCookie, destroyCookie } from 'nookies';

export const TOKEN_KEY = '@courts:accessToken';
export const REFRESH_TOKEN_KEY = '@courts:refreshToken';

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