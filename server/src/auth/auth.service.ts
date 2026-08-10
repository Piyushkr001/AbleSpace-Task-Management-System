import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";
import { UsersService } from "../users/users.service";
import { WorkspacesService } from "../workspaces/workspaces.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly workspacesService: WorkspacesService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async createGuestSession(res: Response) {
    // 1. Create Guest User
    const user = await this.usersService.createGuestUser();

    // 2. Create Workspace with User as OWNER
    await this.workspacesService.createWorkspaceForUser(
      user.id,
      "Guest Workspace"
    );

    // 3. Generate JWT payload
    const payload = {
      id: user.id,
      fullName: user.fullName,
      isGuest: user.isGuest,
    };

    const token = await this.jwtService.signAsync(payload);

    // 4. Set HttpOnly Cookie
    const cookieName = this.configService.get<string>(
      "COOKIE_NAME",
      "taskora_guest_session"
    );
    const isProd =
      this.configService.get<string>("NODE_ENV") === "production";

    res.cookie(cookieName, token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    return {
      data: {
        user: {
          id: user.id,
          fullName: user.fullName,
          isGuest: user.isGuest,
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
          fullName: user.fullName,
          email: user.email,
          avatarUrl: user.avatarUrl,
          isGuest: user.isGuest,
        },
      },
    };
  }

  clearSession(res: Response) {
    const cookieName = this.configService.get<string>(
      "COOKIE_NAME",
      "taskora_guest_session"
    );
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
