import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { WorkspacesService } from "../workspaces/workspaces.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { Prisma, Project } from "@prisma/client";

type ProjectWithRelations = Project & {
  _count?: {
    tasks: number;
  };
};

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workspacesService: WorkspacesService
  ) {}

  /**
   * Strictly typed serializer with 0 `any` usage.
   */
  private serializeProject(project: ProjectWithRelations) {
    return {
      id: project.id,
      name: project.name,
      description: project.description ?? null,
      workspaceId: project.workspaceId,
      taskCount: project._count?.tasks ?? 0,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    };
  }

  async createProject(userId: string, dto: CreateProjectDto) {
    const workspaceId = await this.workspacesService.getCurrentWorkspaceForUser(userId);

    const project = await this.prisma.project.create({
      data: {
        name: dto.name.trim(),
        description: dto.description ?? null,
        workspaceId,
      },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
    });

    return {
      data: {
        project: this.serializeProject(project),
      },
    };
  }

  async findAll(userId: string) {
    const workspaceId = await this.workspacesService.getCurrentWorkspaceForUser(userId);

    const projects = await this.prisma.project.findMany({
      where: {
        workspaceId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
    });

    return {
      data: {
        projects: projects.map((p) => this.serializeProject(p)),
      },
    };
  }

  async findOne(userId: string, id: string) {
    const workspaceId = await this.workspacesService.getCurrentWorkspaceForUser(userId);

    const project = await this.prisma.project.findFirst({
      where: {
        id,
        workspaceId,
      },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
    });

    if (!project) {
      throw new NotFoundException("Project not found");
    }

    return {
      data: {
        project: this.serializeProject(project),
      },
    };
  }

  async updateProject(userId: string, id: string, dto: UpdateProjectDto) {
    const workspaceId = await this.workspacesService.getCurrentWorkspaceForUser(userId);

    const existing = await this.prisma.project.findFirst({
      where: {
        id,
        workspaceId,
      },
    });

    if (!existing) {
      throw new NotFoundException("Project not found");
    }

    const updateData: Prisma.ProjectUpdateInput = {};
    if (dto.name !== undefined) {
      updateData.name = dto.name.trim();
    }
    if (dto.description !== undefined) {
      updateData.description = dto.description ?? null;
    }

    const updated = await this.prisma.project.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: { tasks: true },
        },
      },
    });

    return {
      data: {
        project: this.serializeProject(updated),
      },
    };
  }

  async deleteProject(userId: string, id: string) {
    const workspaceId = await this.workspacesService.getCurrentWorkspaceForUser(userId);

    const existing = await this.prisma.project.findFirst({
      where: {
        id,
        workspaceId,
      },
    });

    if (!existing) {
      throw new NotFoundException("Project not found");
    }

    await this.prisma.project.delete({
      where: { id },
    });

    return {
      message: "Project deleted successfully",
    };
  }
}
