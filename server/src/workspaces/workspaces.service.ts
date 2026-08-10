import { Injectable } from "@nestjs/common";
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
}
