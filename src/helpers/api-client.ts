const defaultHeaders = {
  "Content-Type": "application/json",
};

interface RequestOptions extends RequestInit {
  body?: BodyInit | null;
}

export async function apiClient<T>(url: string, options: RequestOptions = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = "Request failed. Please try again.";
    try {
      const errorBody = await response.json();
      message = errorBody?.message ?? message;
    } catch {
      // swallow json parse errors
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}
