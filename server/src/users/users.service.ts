import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClerkClient } from "@clerk/backend";
import { PrismaService } from "../prisma/prisma.service";
import { WorkspaceRole } from "@prisma/client";

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        clerkId: true,
        email: true,
        fullName: true,
        username: true,
        title: true,
        avatarUrl: true,
        isGuest: true,
        createdAt: true,
      },
    });
  }

  async findByClerkId(clerkId: string) {
    return this.prisma.user.findUnique({
      where: { clerkId },
    });
  }

  /**
   * Transactionally creates a Guest User, Guest Workspace, and OWNER WorkspaceMember.
   */
  async createGuestUserTx() {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          fullName: "Guest",
          isGuest: true,
        },
      });

      const workspace = await tx.workspace.create({
        data: {
          name: "Guest Workspace",
        },
      });

      await tx.workspaceMember.create({
        data: {
          userId: user.id,
          workspaceId: workspace.id,
          role: WorkspaceRole.OWNER,
        },
      });

      return user;
    });
  }

  /**
   * Finds existing local user by clerkId or fetches profile from Clerk API
   * and transactionally creates User + Workspace + WorkspaceMember.
   */
  async findOrCreateClerkUser(clerkId: string) {
    // 1. Check if user already exists locally
    const existingUser = await this.prisma.user.findUnique({
      where: { clerkId },
    });

    if (existingUser) {
      return existingUser;
    }

    // 2. Fetch trusted Clerk profile data
    let email: string | null = null;
    let fullName: string | null = null;
    let avatarUrl: string | null = null;

    try {
      const clerkSecret = this.configService.getOrThrow<string>("CLERK_SECRET_KEY");
      const clerk = createClerkClient({ secretKey: clerkSecret });
      const clerkUser = await clerk.users.getUser(clerkId);

      const primaryEmail = clerkUser.emailAddresses?.find(
        (e) => e.id === clerkUser.primaryEmailAddressId
      )?.emailAddress;
      email = primaryEmail || clerkUser.emailAddresses?.[0]?.emailAddress || null;

      const nameParts = [clerkUser.firstName, clerkUser.lastName].filter(Boolean);
      fullName = nameParts.length > 0 ? nameParts.join(" ") : null;

      avatarUrl = clerkUser.imageUrl || null;
    } catch (error) {
      this.logger.warn(`Could not fetch Clerk user profile for ${clerkId}: ${error}`);
    }

    // 3. Transactionally create User, Workspace, and WorkspaceMember
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          clerkId,
          email,
          fullName: fullName || "Taskora User",
          avatarUrl,
          isGuest: false,
        },
      });

      const workspaceName = fullName ? `${fullName}'s Workspace` : "Taskora Workspace";

      const workspace = await tx.workspace.create({
        data: {
          name: workspaceName,
        },
      });

      await tx.workspaceMember.create({
        data: {
          userId: user.id,
          workspaceId: workspace.id,
          role: WorkspaceRole.OWNER,
        },
      });

      return user;
    });
  }
}
