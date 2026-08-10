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
    const cookieName = this.configService.get<string>(
      "COOKIE_NAME",
      "taskora_guest_session"
    );
    const token = request.cookies?.[cookieName];

    if (!token) {
      throw new UnauthorizedException("Session cookie missing");
    }

    try {
      const secret = this.configService.get<string>(
        "JWT_SECRET",
        "taskora_super_secret_jwt_key_2026"
      );
      const payload = await this.jwtService.verifyAsync(token, { secret });
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException("Invalid or expired session cookie");
    }
  }
}
