import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { WorkspacesService } from "../workspaces/workspaces.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { TaskQueryDto } from "./dto/task-query.dto";
import { TaskStatus, TaskPriority, Prisma } from "@prisma/client";

const TASK_INCLUDE = {
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
} satisfies Prisma.TaskInclude;

type TaskWithRelations = Prisma.TaskGetPayload<{
  include: typeof TASK_INCLUDE;
}>;

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workspacesService: WorkspacesService
  ) {}

  /**
   * Strictly typed serializer with 0 `any` usage.
   */
  private serializeTask(task: TaskWithRelations) {
    return {
      id: task.id,
      title: task.title,
      description: task.description ?? null,
      status: task.status,
      priority: task.priority,
      startDate: task.startDate ? task.startDate.toISOString().split("T")[0] : null,
      dueDate: task.dueDate ? task.dueDate.toISOString().split("T")[0] : null,
      parentTaskId: task.parentTaskId ?? null,
      members: (task.members || []).map((m) => ({
        id: m.user.id,
        fullName: m.user.fullName || m.user.email || "Workspace Member",
        email: m.user.email ?? null,
        avatarUrl: m.user.avatarUrl ?? null,
      })),
      labels: (task.labels || []).map((l) => ({
        id: l.label.id,
        name: l.label.name,
        color: l.label.color ?? null,
      })),
      reporter: task.reporter
        ? {
            id: task.reporter.id,
            fullName: task.reporter.fullName || task.reporter.email || "Workspace Member",
            email: task.reporter.email ?? null,
            avatarUrl: task.reporter.avatarUrl ?? null,
          }
        : null,
      project: task.project
        ? {
            id: task.project.id,
            name: task.project.name,
          }
        : null,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    };
  }

  /**
   * Validates related entities to ensure P0 workspace boundary compliance.
   */
  private async validateRelatedEntities(
    workspaceId: string,
    dto: {
      projectId?: string | null;
      reporterId?: string | null;
      parentTaskId?: string | null;
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

  /**
   * Prevents parent task cycles (e.g. A -> B -> C -> A).
   */
  private async detectParentCycle(taskId: string, newParentTaskId: string): Promise<void> {
    let currentParentId: string | null = newParentTaskId;
    const visited = new Set<string>();

    while (currentParentId) {
      if (currentParentId === taskId) {
        throw new BadRequestException("Parent task relationship creates a cycle");
      }
      if (visited.has(currentParentId)) {
        break; // Guard against existing malformed cycles
      }
      visited.add(currentParentId);

      const parentRecord: { parentTaskId: string | null } | null =
        await this.prisma.task.findUnique({
          where: { id: currentParentId },
          select: { parentTaskId: true },
        });
      currentParentId = parentRecord?.parentTaskId ?? null;
    }
  }

  /**
   * Validates date range business rule (startDate <= dueDate).
   */
  private validateDates(startDate?: Date | null, dueDate?: Date | null): void {
    if (startDate && dueDate && startDate > dueDate) {
      throw new BadRequestException("startDate must be on or before dueDate");
    }
  }

  async createTask(userId: string, dto: CreateTaskDto) {
    const workspaceId = await this.workspacesService.getCurrentWorkspaceForUser(userId);
    await this.validateRelatedEntities(workspaceId, dto);

    const startDate = dto.startDate ? new Date(dto.startDate) : null;
    const dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
    this.validateDates(startDate, dueDate);

    const task = await this.prisma.task.create({
      data: {
        title: dto.title.trim(),
        description: dto.description ?? null,
        status: dto.status ?? TaskStatus.TODO,
        priority: dto.priority ?? TaskPriority.NONE,
        workspaceId,
        projectId: dto.projectId ?? null,
        reporterId: dto.reporterId ?? userId,
        parentTaskId: dto.parentTaskId ?? null,
        startDate,
        dueDate,
        members:
          dto.memberIds && dto.memberIds.length > 0
            ? {
                create: dto.memberIds.map((mId) => ({ userId: mId })),
              }
            : undefined,
        labels:
          dto.labelIds && dto.labelIds.length > 0
            ? {
                create: dto.labelIds.map((lId) => ({ labelId: lId })),
              }
            : undefined,
      },
      include: TASK_INCLUDE,
    });

    return {
      data: {
        task: this.serializeTask(task),
      },
    };
  }

  async findAll(userId: string, query: TaskQueryDto) {
    const workspaceId = await this.workspacesService.getCurrentWorkspaceForUser(userId);

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

    if (query.memberId && query.memberId.length > 0) {
      where.members = {
        some: { userId: { in: query.memberId } },
      };
    }

    if (query.labelId && query.labelId.length > 0) {
      where.labels = {
        some: { labelId: { in: query.labelId } },
      };
    }

    if (query.projectId) {
      where.projectId = query.projectId;
    }

    if (query.parentTaskId) {
      where.parentTaskId = query.parentTaskId;
    }

    const tasks = await this.prisma.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: TASK_INCLUDE,
    });

    return {
      data: {
        tasks: tasks.map((t) => this.serializeTask(t)),
      },
    };
  }

  async findOne(userId: string, taskId: string) {
    const workspaceId = await this.workspacesService.getCurrentWorkspaceForUser(userId);

    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        workspaceId,
      },
      include: TASK_INCLUDE,
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
    const workspaceId = await this.workspacesService.getCurrentWorkspaceForUser(userId);

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

    // 1. Prevent self parenting & cycles
    if (dto.parentTaskId !== undefined && dto.parentTaskId !== null) {
      if (dto.parentTaskId === taskId) {
        throw new BadRequestException("A task cannot be its own parent");
      }
      await this.detectParentCycle(taskId, dto.parentTaskId);
    }

    // 2. Validate date range business rule with merged effective dates
    const effectiveStartDate =
      dto.startDate !== undefined
        ? dto.startDate
          ? new Date(dto.startDate)
          : null
        : existingTask.startDate;

    const effectiveDueDate =
      dto.dueDate !== undefined
        ? dto.dueDate
          ? new Date(dto.dueDate)
          : null
        : existingTask.dueDate;

    this.validateDates(effectiveStartDate, effectiveDueDate);

    // 3. Build Prisma update payload with explicit clearable field semantics
    const updateData: Prisma.TaskUpdateInput = {};

    if (dto.title !== undefined) updateData.title = dto.title.trim();
    if (dto.description !== undefined) updateData.description = dto.description ?? null;
    if (dto.status !== undefined) updateData.status = dto.status;
    if (dto.priority !== undefined) updateData.priority = dto.priority;
    if (dto.startDate !== undefined) updateData.startDate = effectiveStartDate;
    if (dto.dueDate !== undefined) updateData.dueDate = effectiveDueDate;

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
        include: TASK_INCLUDE,
      });

      return {
        data: {
          task: this.serializeTask(updatedTask),
        },
      };
    });
  }

  async deleteTask(userId: string, taskId: string) {
    const workspaceId = await this.workspacesService.getCurrentWorkspaceForUser(userId);

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
