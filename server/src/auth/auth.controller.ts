import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { UnifiedAuthGuard } from "./guards/unified-auth.guard";
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
