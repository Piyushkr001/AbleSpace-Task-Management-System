import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GuestAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const cookieName = this.configService.getOrThrow<string>("COOKIE_NAME");
    const token = request.cookies?.[cookieName];

    if (!token) {
      throw new UnauthorizedException("Unauthorized");
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);

      if (!payload || payload.type !== "guest" || !payload.sub) {
        throw new UnauthorizedException("Unauthorized");
      }

      request.user = {
        id: payload.sub,
        isGuest: true,
      };

      return true;
    } catch {
      throw new UnauthorizedException("Unauthorized");
    }
  }
}
