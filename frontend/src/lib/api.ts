export const API_BASE = '/api';

export interface ApiOptions extends RequestInit {
  token?: string | null;
}

export async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { token, headers, ...requestOptions } = options;
  const response = await fetch(`${API_BASE}${path}`, {
    ...requestOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    let detail = 'Request failed';
    try {
      const data = await response.json();
      detail = typeof data.detail === 'string' ? data.detail : JSON.stringify(data);
    } catch {
      detail = response.statusText;
    }
    throw new Error(detail);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
