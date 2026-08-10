import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "../users/users.module";
import { WorkspacesModule } from "../workspaces/workspaces.module";
import { GuestAuthGuard } from "./guards/guest-auth.guard";

@Module({
  imports: [
    UsersModule,
    WorkspacesModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>(
          "JWT_SECRET",
          "taskora_super_secret_jwt_key_2026"
        ),
        signOptions: {
          expiresIn: (configService.get<string>("JWT_EXPIRES_IN") || "7d") as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GuestAuthGuard],
  exports: [AuthService, GuestAuthGuard, JwtModule],
})
export class AuthModule {}
