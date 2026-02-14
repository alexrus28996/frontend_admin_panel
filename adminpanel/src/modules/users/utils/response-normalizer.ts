import type { UnknownRecord } from "@/src/modules/users/types";

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

export const normalizeList = (response: unknown): unknown[] => {
  if (Array.isArray(response)) {
    return response;
  }

  if (!isRecord(response)) {
    return [];
  }

  if (Array.isArray(response.data)) {
    return response.data;
  }

  return [];
};

export const normalizeObject = (response: unknown): Record<string, unknown> | null => {
  if (!isRecord(response)) {
    return null;
  }

  if (isRecord(response.data)) {
    return response.data;
  }

  return response;
};

export const normalizePermissions = (response: unknown): string[] => {
  if (isStringArray(response)) {
    return response;
  }

  if (!isRecord(response)) {
    return [];
  }

  if (isStringArray(response.data)) {
    return response.data;
  }

  const permissionsCandidate = response.permissions;
  if (isStringArray(permissionsCandidate)) {
    return permissionsCandidate;
  }

  const itemsCandidate = response.items;
  if (isStringArray(itemsCandidate)) {
    return itemsCandidate;
  }

  return [];
};
