import { AppError } from "@/lib/types/errors";

const API_URL = process.env.VUE_APP_API_URL;

export async function request(path, options = {}) {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new AppError({
        message: data?.message || 'Request failed',
        statusCode: res.status,
        errorCode: data?.errorCode || 'API_ERROR',
      });
    }

    return data;
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    }
    if (err instanceof TypeError) {
      throw new AppError({
        message: 'Network error. Please check your connection.',
        statusCode: 0,
        errorCode: 'NETWORK_ERROR',
      });
    }
    throw new AppError({
      message: 'Something went wrong',
      statusCode: 500,
      errorCode: 'UNKNOWN_ERROR',
    });
  }
}