import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { UnifiedAuthGuard } from "./guards/unified-auth.guard";
import { ClerkAuthGuard } from "./guards/clerk-auth.guard";
import {
  CurrentUser,
  CurrentUserData,
} from "./decorators/current-user.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("guest")
  @HttpCode(HttpStatus.OK)
  async guestLogin(@Res({ passthrough: true }) res: Response) {
    return this.authService.createGuestSession(res);
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
