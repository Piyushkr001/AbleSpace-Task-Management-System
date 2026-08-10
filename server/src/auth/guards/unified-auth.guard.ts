import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClerkAuthGuard } from "./clerk-auth.guard";
import { GuestAuthGuard } from "./guest-auth.guard";

@Injectable()
export class UnifiedAuthGuard implements CanActivate {
  constructor(
    private readonly clerkAuthGuard: ClerkAuthGuard,
    private readonly guestAuthGuard: GuestAuthGuard,
    private readonly configService: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers?.authorization;
    const cookieName = this.configService.getOrThrow<string>("COOKIE_NAME");
    const hasCookie = Boolean(request.cookies?.[cookieName]);
    const hasBearerToken =
      typeof authHeader === "string" && authHeader.startsWith("Bearer ");

    if (hasBearerToken) {
      return this.clerkAuthGuard.canActivate(context);
    }

    if (hasCookie) {
      return this.guestAuthGuard.canActivate(context);
    }

    throw new UnauthorizedException("Unauthorized");
  }
}
