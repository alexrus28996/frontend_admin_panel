export interface ServerPaginationState {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export const DEFAULT_SERVER_PAGINATION: ServerPaginationState = {
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 1,
};
