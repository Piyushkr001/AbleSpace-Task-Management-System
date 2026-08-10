import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { verifyToken } from "@clerk/backend";
import { UsersService } from "../../users/users.service";

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers?.authorization;

    if (!authHeader || typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Unauthorized");
    }

    const token = authHeader.substring(7).trim();
    if (!token) {
      throw new UnauthorizedException("Unauthorized");
    }

    try {
      const secretKey = this.configService.getOrThrow<string>("CLERK_SECRET_KEY");
      const verifiedToken = await verifyToken(token, { secretKey });
      const clerkUserId = verifiedToken.sub;

      if (!clerkUserId) {
        throw new UnauthorizedException("Unauthorized");
      }

      const localUser = await this.usersService.findOrCreateClerkUser(clerkUserId);

      request.user = {
        id: localUser.id,
        clerkId: localUser.clerkId ?? undefined,
        email: localUser.email ?? null,
        fullName: localUser.fullName ?? null,
        avatarUrl: localUser.avatarUrl ?? null,
        isGuest: false,
      };

      return true;
    } catch {
      throw new UnauthorizedException("Unauthorized");
    }
  }
}
