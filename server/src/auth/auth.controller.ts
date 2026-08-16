import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { Request, Response } from "express";
import { Throttle } from "@nestjs/throttler";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { UnifiedAuthGuard } from "./guards/unified-auth.guard";
import { ClerkAuthGuard } from "./guards/clerk-auth.guard";
import {
  CurrentUser,
  CurrentUserData,
} from "./decorators/current-user.decorator";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @Post("guest")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  async guestLogin(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const cookieName = this.configService.getOrThrow<string>("COOKIE_NAME");
    const existingToken = req.cookies?.[cookieName];
    return this.authService.createGuestSession(res, existingToken);
  }

  @Post("sync")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ClerkAuthGuard)
  async syncUser(@CurrentUser() user: CurrentUserData) {
    if (!user.clerkId) {
      throw new UnauthorizedException("Clerk user ID missing");
    }
    return this.authService.syncUser(user.clerkId);
  }

  @Get("me")
  @UseGuards(UnifiedAuthGuard)
  async getCurrentUser(@CurrentUser() user: CurrentUserData) {
    return this.authService.getCurrentUser(user.id);
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.clearSession(res);
  }
}
