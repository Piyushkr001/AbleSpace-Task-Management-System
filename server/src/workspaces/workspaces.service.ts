import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { WorkspaceRole } from "@prisma/client";

@Injectable()
export class WorkspacesService {
  constructor(private readonly prisma: PrismaService) {}

  async createWorkspaceForUser(userId: string, name: string = "Taskora Workspace") {
    return this.prisma.workspace.create({
      data: {
        name,
        members: {
          create: {
            userId,
            role: WorkspaceRole.OWNER,
          },
        },
      },
      include: {
        members: true,
      },
    });
  }

  /**
   * Centralized workspace resolution helper.
   */
  async getCurrentWorkspaceForUser(userId: string): Promise<string> {
    const membership = await this.prisma.workspaceMember.findFirst({
      where: { userId },
      select: { workspaceId: true },
    });

    if (!membership) {
      throw new UnauthorizedException("User does not belong to any workspace");
    }

    return membership.workspaceId;
  }

  /**
   * Returns members of the current user's workspace.
   */
  async getWorkspaceMembersForUser(userId: string) {
    const workspaceId = await this.getCurrentWorkspaceForUser(userId);

    const members = await this.prisma.workspaceMember.findMany({
      where: { workspaceId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return {
      data: {
        members: members.map((m) => ({
          id: m.user.id,
          fullName: m.user.fullName || m.user.email || "Workspace Member",
          email: m.user.email ?? null,
          avatarUrl: m.user.avatarUrl ?? null,
        })),
      },
    };
  }
}
