import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { verifyToken } from "@clerk/backend";
import { Response } from "express";
import { UsersService } from "../../users/users.service";

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const response = httpContext.getResponse<Response>();

    const authHeader = request.headers?.authorization;

    if (!authHeader || typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Unauthorized");
    }

    const token = authHeader.substring(7).trim();
    if (!token) {
      throw new UnauthorizedException("Unauthorized");
    }

    let clerkUserId: string;

    try {
      const secretKey = this.configService.getOrThrow<string>("CLERK_SECRET_KEY");
      const clientUrl = this.configService.getOrThrow<string>("CLIENT_URL");

      const verifiedToken = await verifyToken(token, {
        secretKey,
        authorizedParties: [clientUrl],
      });

      if (!verifiedToken.sub) {
        throw new UnauthorizedException("Unauthorized");
      }

      clerkUserId = verifiedToken.sub;
    } catch (err: unknown) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new UnauthorizedException("Unauthorized");
    }

    // DB/Profile failures bubble up normally as server errors instead of fake 401s
    const localUser = await this.usersService.findOrCreateClerkUser(clerkUserId);

    // Clear any existing Guest session cookie when authenticating via Clerk
    const cookieName = this.configService.get<string>("COOKIE_NAME", "taskora_guest_session");
    if (request.cookies?.[cookieName]) {
      const isProd = this.configService.get<string>("NODE_ENV") === "production";
      response.clearCookie(cookieName, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        path: "/",
      });
    }

    request.user = {
      id: localUser.id,
      clerkId: localUser.clerkId ?? undefined,
      email: localUser.email ?? null,
      fullName: localUser.fullName ?? null,
      avatarUrl: localUser.avatarUrl ?? null,
      isGuest: false,
    };

    return true;
  }
}
