export type AuthUser = {
  id: string;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
  isActive: boolean;
  isVerified: boolean;
};

export type AuthLoginRequest = {
  email: string;
  password: string;
};

export type AuthLoginResponse = {
  token: string;
  refreshToken: string;
  user: AuthUser;
};

export type AuthRefreshRequest = {
  refreshToken: string;
};

export type AuthRefreshResponse = {
  token: string;
  refreshToken: string;
  user: AuthUser;
};

export type AuthLogoutResponse = {
  success: true;
};

export type AuthMeResponse = {
  user: AuthUser;
};
