import type { AuthResponseDTO, AuthTokensDTO } from './contracts';

const ACCESS_TOKEN_KEY = 'ddl-access-token';
const REFRESH_TOKEN_KEY = 'ddl-refresh-token';

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000').replace(/\/$/, '');
let refreshRequest: Promise<AuthTokensDTO> | null = null;

type QueryValue = string | number | boolean | null | undefined;

interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: BodyInit | object | null;
  query?: Record<string, QueryValue>;
  auth?: boolean;
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const getAuthTokens = () => ({
  accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
  refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY)
});

export const setAuthTokens = (tokens: Pick<AuthTokensDTO, 'accessToken' | 'refreshToken'>) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
};

export const clearAuthTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

const parseResponseBody = async (response: Response) => {
  const raw = await response.text();
  if (!raw) {
    return undefined;
  }

  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return raw;
  }
};

const buildUrl = (path: string, query?: Record<string, QueryValue>) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const base = API_BASE_URL.startsWith('http') ? API_BASE_URL : `${window.location.origin}${API_BASE_URL}`;
  const url = new URL(`${base}${normalizedPath}`);

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  return url;
};

const resolveErrorMessage = (data: unknown, fallback: string) => {
  if (typeof data === 'string' && data.trim()) {
    return data;
  }

  if (data && typeof data === 'object') {
    const detail = 'detail' in data ? data.detail : undefined;
    const message = 'message' in data ? data.message : undefined;

    if (typeof detail === 'string') {
      return detail;
    }

    if (typeof message === 'string') {
      return message;
    }
  }

  return fallback;
};

const refreshAuthTokens = async (): Promise<AuthTokensDTO> => {
  if (!refreshRequest) {
    refreshRequest = (async () => {
      const refreshToken = getAuthTokens().refreshToken;
      if (!refreshToken) {
        throw new ApiError('Refresh token is missing', 401, undefined);
      }

      const response = await fetch(buildUrl('/auth/refresh'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });
      const data = await parseResponseBody(response);

      if (!response.ok) {
        clearAuthTokens();
        throw new ApiError(resolveErrorMessage(data, response.statusText), response.status, data);
      }

      const tokens = data as AuthResponseDTO;
      setAuthTokens(tokens);
      return tokens;
    })().finally(() => {
      refreshRequest = null;
    });
  }

  return refreshRequest;
};

export const apiRequest = async <T>(path: string, options: ApiRequestOptions = {}): Promise<T> => {
  const { body, headers, query, auth = true, ...requestOptions } = options;
  const isFormData = body instanceof FormData;
  const canRefresh = auth && path !== '/auth/refresh';

  const send = async (accessToken: string | null) => {
    const requestHeaders = new Headers(headers);
    if (auth && accessToken) {
      requestHeaders.set('Authorization', `Bearer ${accessToken}`);
    }

    if (body && !isFormData) {
      requestHeaders.set('Content-Type', 'application/json');
    }

    return fetch(buildUrl(path, query), {
      ...requestOptions,
      headers: requestHeaders,
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined
    });
  };

  let response = await send(getAuthTokens().accessToken);
  let data = await parseResponseBody(response);

  if (response.status === 401 && canRefresh && getAuthTokens().refreshToken) {
    try {
      const tokens = await refreshAuthTokens();
      response = await send(tokens.accessToken);
      data = await parseResponseBody(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      clearAuthTokens();
      throw new ApiError('Session expired', 401, undefined);
    }
  }

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthTokens();
    }

    throw new ApiError(resolveErrorMessage(data, response.statusText), response.status, data);
  }

  return data as T;
};
