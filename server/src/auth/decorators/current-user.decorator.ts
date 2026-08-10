import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export interface CurrentUserData {
  id: string; // Local PostgreSQL User.id
  clerkId?: string | null;
  email?: string | null;
  fullName?: string | null;
  avatarUrl?: string | null;
  isGuest: boolean;
}

export const CurrentUser = createParamDecorator(
  (data: keyof CurrentUserData | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as CurrentUserData | undefined;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  }
);
