export type Nullable<T> = T | null;

export interface ApiErrorPayload {
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
}

export interface NormalizedApiErrorShape {
  code: string;
  message: string;
  details?: unknown;
  status?: number;
}

export interface ApiSuccessResponse<TData> {
  data: TData;
  message?: string;
}

export interface PaginatedResponse<TItem> {
  items: TItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ServerPaginationParams {
  page: number;
  pageSize: number;
}
