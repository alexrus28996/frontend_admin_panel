import { ApiHttpError } from "@/src/api/client/axios-client";

import type { ApiErrorPayload, NormalizedApiErrorShape } from "@/src/api/types/common";

const ERROR_CODES = {
  unknown: "UNKNOWN_ERROR",
  network: "NETWORK_ERROR",
  cancelled: "REQUEST_CANCELLED",
} as const;

export const normalizeApiError = (error: unknown): NormalizedApiErrorShape => {
  if (error instanceof ApiHttpError) {
    const payload = error.data as ApiErrorPayload | undefined;

    return {
      code: payload?.error?.code ?? ERROR_CODES.unknown,
      message: payload?.error?.message ?? error.message,
      details: payload?.error?.details,
      status: error.status,
    };
  }

  if (error instanceof DOMException && error.name === "AbortError") {
    return {
      code: ERROR_CODES.cancelled,
      message: ERROR_CODES.cancelled,
    };
  }

  if (error instanceof Error) {
    return {
      code: ERROR_CODES.network,
      message: error.message,
    };
  }

  return {
    code: ERROR_CODES.unknown,
    message: ERROR_CODES.unknown,
  };
};
