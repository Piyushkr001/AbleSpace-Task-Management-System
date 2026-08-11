import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { TaskQueryDto } from "./dto/task-query.dto";
import { TaskStatus, TaskPriority, Prisma } from "@prisma/client";

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Helper to resolve the user's current workspace ID with P0 authorization.
   */
  private async getUserWorkspaceId(userId: string): Promise<string> {
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
   * Normalizes Task model relations for clean API DTO response shape.
   */
  private serializeTask(task: any) {
    return {
      id: task.id,
      title: task.title,
      description: task.description ?? null,
      status: task.status,
      priority: task.priority,
      startDate: task.startDate ? task.startDate.toISOString().split("T")[0] : null,
      dueDate: task.dueDate ? task.dueDate.toISOString().split("T")[0] : null,
      parentTaskId: task.parentTaskId ?? null,
      members: (task.members || []).map((m: any) => ({
        id: m.user.id,
        name: m.user.fullName || m.user.email || "User",
        avatarUrl: m.user.avatarUrl ?? null,
      })),
      labels: (task.labels || []).map((l: any) => ({
        id: l.label.id,
        name: l.label.name,
        color: l.label.color ?? null,
      })),
      reporter: task.reporter
        ? {
            id: task.reporter.id,
            name: task.reporter.fullName || task.reporter.email || "User",
            avatarUrl: task.reporter.avatarUrl ?? null,
          }
        : null,
      project: task.project
        ? {
            id: task.project.id,
            name: task.project.name,
          }
        : null,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }

  private defaultTaskInclude() {
    return {
      members: {
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
      },
      labels: {
        include: {
          label: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
      },
      reporter: {
        select: {
          id: true,
          fullName: true,
          email: true,
          avatarUrl: true,
        },
      },
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    };
  }

  /**
   * Validates related entities to ensure P0 workspace boundary compliance.
   */
  private async validateRelatedEntities(
    workspaceId: string,
    dto: {
      projectId?: string;
      reporterId?: string;
      parentTaskId?: string;
      memberIds?: string[];
      labelIds?: string[];
    }
  ) {
    if (dto.projectId) {
      const proj = await this.prisma.project.findFirst({
        where: { id: dto.projectId, workspaceId },
      });
      if (!proj) {
        throw new BadRequestException("Invalid projectId for current workspace");
      }
    }

    if (dto.reporterId) {
      const reporter = await this.prisma.workspaceMember.findFirst({
        where: { userId: dto.reporterId, workspaceId },
      });
      if (!reporter) {
        throw new BadRequestException("Invalid reporterId for current workspace");
      }
    }

    if (dto.parentTaskId) {
      const parent = await this.prisma.task.findFirst({
        where: { id: dto.parentTaskId, workspaceId },
      });
      if (!parent) {
        throw new BadRequestException("Invalid parentTaskId for current workspace");
      }
    }

    if (dto.memberIds && dto.memberIds.length > 0) {
      const validMembers = await this.prisma.workspaceMember.findMany({
        where: {
          workspaceId,
          userId: { in: dto.memberIds },
        },
        select: { userId: true },
      });
      if (validMembers.length !== new Set(dto.memberIds).size) {
        throw new BadRequestException("One or more memberIds do not belong to current workspace");
      }
    }

    if (dto.labelIds && dto.labelIds.length > 0) {
      const validLabels = await this.prisma.label.findMany({
        where: {
          workspaceId,
          id: { in: dto.labelIds },
        },
        select: { id: true },
      });
      if (validLabels.length !== new Set(dto.labelIds).size) {
        throw new BadRequestException("One or more labelIds do not belong to current workspace");
      }
    }
  }

  async createTask(userId: string, dto: CreateTaskDto) {
    const workspaceId = await this.getUserWorkspaceId(userId);
    await this.validateRelatedEntities(workspaceId, dto);

    const task = await this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description ?? null,
        status: dto.status ?? TaskStatus.TODO,
        priority: dto.priority ?? TaskPriority.NONE,
        workspaceId,
        projectId: dto.projectId ?? null,
        reporterId: dto.reporterId ?? userId,
        parentTaskId: dto.parentTaskId ?? null,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        members: dto.memberIds && dto.memberIds.length > 0
          ? {
              create: dto.memberIds.map((mId) => ({ userId: mId })),
            }
          : undefined,
        labels: dto.labelIds && dto.labelIds.length > 0
          ? {
              create: dto.labelIds.map((lId) => ({ labelId: lId })),
            }
          : undefined,
      },
      include: this.defaultTaskInclude(),
    });

    return {
      data: {
        task: this.serializeTask(task),
      },
    };
  }

  async findAll(userId: string, query: TaskQueryDto) {
    const workspaceId = await this.getUserWorkspaceId(userId);

    const where: Prisma.TaskWhereInput = {
      workspaceId,
    };

    if (query.search?.trim()) {
      const searchStr = query.search.trim();
      where.OR = [
        { title: { contains: searchStr, mode: "insensitive" } },
        { description: { contains: searchStr, mode: "insensitive" } },
      ];
    }

    if (query.status && query.status.length > 0) {
      where.status = { in: query.status };
    }

    if (query.priority && query.priority.length > 0) {
      where.priority = { in: query.priority };
    }

    if (query.memberId) {
      where.members = {
        some: { userId: query.memberId },
      };
    }

    if (query.labelId) {
      where.labels = {
        some: { labelId: query.labelId },
      };
    }

    if (query.projectId) {
      where.projectId = query.projectId;
    }

    const tasks = await this.prisma.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: this.defaultTaskInclude(),
    });

    return {
      data: {
        tasks: tasks.map((t) => this.serializeTask(t)),
      },
    };
  }

  async findOne(userId: string, taskId: string) {
    const workspaceId = await this.getUserWorkspaceId(userId);

    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        workspaceId,
      },
      include: this.defaultTaskInclude(),
    });

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    return {
      data: {
        task: this.serializeTask(task),
      },
    };
  }

  async updateTask(userId: string, taskId: string, dto: UpdateTaskDto) {
    const workspaceId = await this.getUserWorkspaceId(userId);

    const existingTask = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        workspaceId,
      },
    });

    if (!existingTask) {
      throw new NotFoundException("Task not found");
    }

    await this.validateRelatedEntities(workspaceId, dto);

    const updateData: Prisma.TaskUpdateInput = {};

    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.description !== undefined) updateData.description = dto.description ?? null;
    if (dto.status !== undefined) updateData.status = dto.status;
    if (dto.priority !== undefined) updateData.priority = dto.priority;
    if (dto.startDate !== undefined)
      updateData.startDate = dto.startDate ? new Date(dto.startDate) : null;
    if (dto.dueDate !== undefined)
      updateData.dueDate = dto.dueDate ? new Date(dto.dueDate) : null;

    if (dto.projectId !== undefined) {
      updateData.project = dto.projectId
        ? { connect: { id: dto.projectId } }
        : { disconnect: true };
    }

    if (dto.reporterId !== undefined) {
      updateData.reporter = dto.reporterId
        ? { connect: { id: dto.reporterId } }
        : { disconnect: true };
    }

    if (dto.parentTaskId !== undefined) {
      updateData.parentTask = dto.parentTaskId
        ? { connect: { id: dto.parentTaskId } }
        : { disconnect: true };
    }

    return this.prisma.$transaction(async (tx) => {
      if (dto.memberIds !== undefined) {
        await tx.taskMember.deleteMany({ where: { taskId } });
        if (dto.memberIds.length > 0) {
          await tx.taskMember.createMany({
            data: dto.memberIds.map((mId) => ({ taskId, userId: mId })),
          });
        }
      }

      if (dto.labelIds !== undefined) {
        await tx.taskLabel.deleteMany({ where: { taskId } });
        if (dto.labelIds.length > 0) {
          await tx.taskLabel.createMany({
            data: dto.labelIds.map((lId) => ({ taskId, labelId: lId })),
          });
        }
      }

      const updatedTask = await tx.task.update({
        where: { id: taskId },
        data: updateData,
        include: this.defaultTaskInclude(),
      });

      return {
        data: {
          task: this.serializeTask(updatedTask),
        },
      };
    });
  }

  async deleteTask(userId: string, taskId: string) {
    const workspaceId = await this.getUserWorkspaceId(userId);

    const existingTask = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        workspaceId,
      },
    });

    if (!existingTask) {
      throw new NotFoundException("Task not found");
    }

    await this.prisma.task.delete({
      where: { id: taskId },
    });

    return {
      message: "Task deleted successfully",
    };
  }
}
