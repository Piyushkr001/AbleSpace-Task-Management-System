import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "../users/users.module";
import { GuestAuthGuard } from "./guards/guest-auth.guard";
import { ClerkAuthGuard } from "./guards/clerk-auth.guard";
import { UnifiedAuthGuard } from "./guards/unified-auth.guard";
import { parseDurationToMs } from "../utils/duration.util";

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.getOrThrow<string>("JWT_SECRET");
        const jwtExpiresIn = configService.get<string>("JWT_EXPIRES_IN") || "7d";
        const expiresInSeconds = Math.floor(parseDurationToMs(jwtExpiresIn) / 1000);
        return {
          secret,
          signOptions: {
            expiresIn: expiresInSeconds,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GuestAuthGuard, ClerkAuthGuard, UnifiedAuthGuard],
  exports: [
    AuthService,
    GuestAuthGuard,
    ClerkAuthGuard,
    UnifiedAuthGuard,
    JwtModule,
  ],
})
export class AuthModule {}
