const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface ApiError {
  error: string;
  message: string;
  statusCode?: number;
  details?: unknown;
}

export class ApiClientError extends Error {
  statusCode: number;
  error: string;
  details?: unknown;

  constructor(message: string, statusCode: number, error?: string, details?: unknown) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.error = error || 'Error';
    this.details = details;
  }
}

async function getAuthToken(): Promise<string | null> {
  return localStorage.getItem('auth_token');
}

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');

  if (!response.ok) {
    let errorData: ApiError;
    
    if (isJson) {
      errorData = await response.json();
    } else {
      const text = await response.text();
      errorData = {
        error: 'Error',
        message: text || `HTTP ${response.status}: ${response.statusText}`,
        statusCode: response.status,
      };
    }

    throw new ApiClientError(
      errorData.message || 'Ocorreu um erro',
      errorData.statusCode || response.status,
      errorData.error,
      errorData.details
    );
  }

  if (response.status === 204) {
    return null as T;
  }

  return isJson ? response.json() : (response.text() as T);
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    return handleResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(
      error instanceof Error ? error.message : 'Erro de conexão',
      0,
      'NetworkError'
    );
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};

