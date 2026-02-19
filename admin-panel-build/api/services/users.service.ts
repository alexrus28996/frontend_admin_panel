import { apiClient } from '../client/axios-client';
import { API_ENDPOINTS } from '@/constants/api-endpoints';

export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  isActive: boolean;
}

export interface UsersListResponse {
  items: User[];
  total: number;
  page: number;
  pages: number;
}

export interface UserDetailResponse {
  user: User;
}

export interface Permissions {
  [key: string]: boolean;
}

export interface UserPermissionsResponse {
  permissions: Permissions;
}

class UsersService {
  async getUsers(
    page: number = 1,
    limit: number = 10,
    search: string = ''
  ): Promise<UsersListResponse> {
    const response = await apiClient.get<UsersListResponse>(
      API_ENDPOINTS.USERS,
      {
        params: { page, limit, q: search || undefined },
      }
    );
    return response.data;
  }

  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get<UserDetailResponse>(
      API_ENDPOINTS.USER_BY_ID(id)
    );
    return response.data.user;
  }

  async updateUser(
    id: string,
    data: { name?: string; roles?: string[]; isActive?: boolean }
  ): Promise<User> {
    const response = await apiClient.patch<UserDetailResponse>(
      API_ENDPOINTS.USER_BY_ID(id),
      data
    );
    return response.data.user;
  }

  async promoteUser(id: string): Promise<User> {
    const response = await apiClient.post<UserDetailResponse>(
      API_ENDPOINTS.PROMOTE_USER(id)
    );
    return response.data.user;
  }

  async demoteUser(id: string): Promise<User> {
    const response = await apiClient.post<UserDetailResponse>(
      API_ENDPOINTS.DEMOTE_USER(id)
    );
    return response.data.user;
  }

  async getUserPermissions(id: string): Promise<Permissions> {
    const response = await apiClient.get<UserPermissionsResponse>(
      API_ENDPOINTS.USER_PERMISSIONS(id)
    );
    return response.data.permissions;
  }

  async replaceUserPermissions(
    id: string,
    permissions: string[]
  ): Promise<Permissions> {
    const response = await apiClient.post<UserPermissionsResponse>(
      API_ENDPOINTS.USER_PERMISSIONS(id),
      { permissions }
    );
    return response.data.permissions;
  }

  async addUserPermissions(
    id: string,
    permissions: string[]
  ): Promise<Permissions> {
    const response = await apiClient.patch<UserPermissionsResponse>(
      API_ENDPOINTS.ADD_USER_PERMISSIONS(id),
      { permissions }
    );
    return response.data.permissions;
  }

  async removeUserPermissions(
    id: string,
    permissions: string[]
  ): Promise<Permissions> {
    const response = await apiClient.patch<UserPermissionsResponse>(
      API_ENDPOINTS.REMOVE_USER_PERMISSIONS(id),
      { permissions }
    );
    return response.data.permissions;
  }
}

export const usersService = new UsersService();
