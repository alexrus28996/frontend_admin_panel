import { authService as authModuleService } from "@/src/modules/auth/services/auth.service";

import type { AuthSession } from "@/src/auth/types/auth";
import type { AuthRefreshResponse } from "@/src/modules/auth/types";

export const authService = {
  async login(email: string, password: string): Promise<AuthSession> {
    const data = await authModuleService.login({ email, password });

    return {
      accessToken: data.token,
      refreshToken: data.refreshToken,
      user: data.user,
    };
  },
  refresh(refreshToken: string): Promise<AuthRefreshResponse> {
    return authModuleService.refresh({ refreshToken });
  },
  async me() {
    const data = await authModuleService.me();
    return data.user;
  },
  logout(refreshToken: string) {
    return authModuleService.logout({ refreshToken });
  },
};
