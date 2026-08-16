import { describe, it, expect, beforeEach, mock } from "bun:test";
import { AuthService } from "../src/auth/auth.service";
import { UsersService } from "../src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UnauthorizedException } from "@nestjs/common";

describe("AuthService", () => {
  let authService: AuthService;
  let mockUsersService: any;
  let mockJwtService: any;
  let mockConfigService: any;

  beforeEach(() => {
    mockUsersService = {
      createGuestUserTx: mock(async () => ({
        id: "guest-user-123",
        fullName: "Guest",
        isGuest: true,
        clerkId: null,
        email: null,
        username: null,
        title: null,
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      findById: mock(async (id: string) => {
        if (id === "existing-guest-123") {
          return {
            id: "existing-guest-123",
            fullName: "Guest",
            isGuest: true,
            clerkId: null,
            email: null,
            username: null,
            title: null,
            avatarUrl: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        }
        return null;
      }),
      findOrCreateClerkUser: mock(async (clerkId: string) => ({
        id: "clerk-user-123",
        fullName: "Test User",
        isGuest: false,
        clerkId,
        email: "test@example.com",
        username: null,
        title: null,
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    };

    mockJwtService = {
      signAsync: mock(async () => "jwt-token-123"),
      verifyAsync: mock(async (token: string) => {
        if (token === "valid-guest-token") {
          return { sub: "existing-guest-123", type: "guest" };
        }
        throw new Error("Invalid token");
      }),
    };

    mockConfigService = {
      getOrThrow: mock((key: string) => {
        if (key === "COOKIE_NAME") return "taskora_guest_session";
        return "";
      }),
      get: mock((key: string) => {
        if (key === "NODE_ENV") return "development";
        if (key === "JWT_EXPIRES_IN") return "7d";
        return null;
      }),
    };

    authService = new AuthService(
      mockUsersService as UsersService,
      mockJwtService as JwtService,
      mockConfigService as ConfigService
    );
  });

  it("should create a new guest session when no token is provided", async () => {
    const cookiesSet: Record<string, unknown> = {};
    const mockRes = {
      cookie: (name: string, val: string, options: unknown) => {
        cookiesSet[name] = { val, options };
      },
    } as any;

    const result = await authService.createGuestSession(mockRes);

    expect(result.data.user.id).toBe("guest-user-123");
    expect(result.data.user.isGuest).toBe(true);
    expect(mockUsersService.createGuestUserTx).toHaveBeenCalled();
    expect(cookiesSet["taskora_guest_session"]).toBeDefined();
  });

  it("should reuse an existing valid guest session token without creating a duplicate user", async () => {
    const mockRes = {
      cookie: mock(() => {}),
    } as any;

    const result = await authService.createGuestSession(mockRes, "valid-guest-token");

    expect(result.data.user.id).toBe("existing-guest-123");
    expect(result.data.user.isGuest).toBe(true);
    expect(mockUsersService.createGuestUserTx).not.toHaveBeenCalled();
  });

  it("should return the current user profile if user exists", async () => {
    const result = await authService.getCurrentUser("existing-guest-123");
    expect(result.data.user.id).toBe("existing-guest-123");
  });

  it("should throw UnauthorizedException when current user is not found", async () => {
    expect(authService.getCurrentUser("non-existent-id")).rejects.toThrow(
      UnauthorizedException
    );
  });

  it("should sync Clerk authenticated user and provision profile", async () => {
    const result = await authService.syncUser("clerk-123");

    expect(result.data.user.id).toBe("clerk-user-123");
    expect(result.data.user.isGuest).toBe(false);
  });

  it("should clear guest session cookie on logout", () => {
    const clearedCookies: string[] = [];
    const mockRes = {
      clearCookie: (name: string) => {
        clearedCookies.push(name);
      },
    } as any;

    const result = authService.clearSession(mockRes);
    expect(result.message).toBe("Logged out successfully");
    expect(clearedCookies).toContain("taskora_guest_session");
  });
});
