import { ApiHttpError } from "@/src/api/client/axios-client";

import type { ApiErrorPayload } from "@/src/api/types/common";

const UNKNOWN_ERROR_CODE = "UNKNOWN_ERROR";
const NETWORK_ERROR_CODE = "NETWORK_ERROR";

export interface NormalizedApiError {
  code: string;
  message: string;
  status: number;
  details?: unknown;
}

export const normalizeApiError = (error: unknown): NormalizedApiError => {
  if (error instanceof ApiHttpError) {
    const payload = error.data as ApiErrorPayload | undefined;

    return {
      code: payload?.code ?? UNKNOWN_ERROR_CODE,
      message: payload?.message ?? error.message,
      status: payload?.status ?? error.status,
      details: payload?.details,
    };
  }

  if (error instanceof Error) {
    return {
      code: NETWORK_ERROR_CODE,
      message: error.message,
      status: 0,
    };
  }

  return {
    code: UNKNOWN_ERROR_CODE,
    message: UNKNOWN_ERROR_CODE,
    status: 0,
  };
};
