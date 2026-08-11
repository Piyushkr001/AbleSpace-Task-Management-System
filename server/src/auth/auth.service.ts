import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";
import { UsersService } from "../users/users.service";
import { parseDurationToMs } from "../utils/duration.util";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async createGuestSession(res: Response) {
    // 1. Transactionally create Guest User, Workspace, and WorkspaceMember OWNER
    const user = await this.usersService.createGuestUserTx();

    // 2. Generate minimal JWT payload identifying the principal
    const payload = {
      sub: user.id,
      type: "guest",
    };

    const token = await this.jwtService.signAsync(payload);

    // 3. Set HttpOnly Cookie synchronized with JWT TTL
    const cookieName = this.configService.getOrThrow<string>("COOKIE_NAME");
    const isProd =
      this.configService.get<string>("NODE_ENV") === "production";
    const jwtExpiresIn =
      this.configService.get<string>("JWT_EXPIRES_IN") || "7d";
    const cookieMaxAge = parseDurationToMs(jwtExpiresIn);

    res.cookie(cookieName, token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: cookieMaxAge,
      path: "/",
    });

    return {
      data: {
        user: {
          id: user.id,
          fullName: user.fullName || "Guest",
          email: null,
          avatarUrl: null,
          isGuest: true,
        },
      },
    };
  }

  async syncUser(clerkUserId: string) {
    const user = await this.usersService.findOrCreateClerkUser(clerkUserId);
    return {
      data: {
        user: {
          id: user.id,
          fullName: user.fullName ?? null,
          email: user.email ?? null,
          avatarUrl: user.avatarUrl ?? null,
          isGuest: false,
        },
      },
    };
  }

  async getCurrentUser(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    return {
      data: {
        user: {
          id: user.id,
          fullName: user.fullName ?? null,
          email: user.email ?? null,
          avatarUrl: user.avatarUrl ?? null,
          isGuest: user.isGuest,
        },
      },
    };
  }

  clearSession(res: Response) {
    const cookieName = this.configService.getOrThrow<string>("COOKIE_NAME");
    const isProd =
      this.configService.get<string>("NODE_ENV") === "production";

    res.clearCookie(cookieName, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
    });

    return {
      message: "Logged out successfully",
    };
  }
}
