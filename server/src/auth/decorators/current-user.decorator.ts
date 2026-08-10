import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export interface CurrentUserData {
  id: string;
  clerkId?: string;
  email?: string;
  fullName?: string;
  isGuest: boolean;
}

export const CurrentUser = createParamDecorator(
  (data: keyof CurrentUserData | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  }
);
