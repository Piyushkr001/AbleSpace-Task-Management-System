import { describe, it, expect, beforeEach, mock } from "bun:test";
import { TasksService } from "../src/tasks/tasks.service";
import { PrismaService } from "../src/prisma/prisma.service";
import { WorkspacesService } from "../src/workspaces/workspaces.service";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { TaskStatus, TaskPriority } from "@prisma/client";

describe("TasksService", () => {
  let tasksService: TasksService;
  let mockPrisma: any;
  let mockWorkspacesService: Partial<WorkspacesService>;

  const mockWorkspaceId = "workspace-uuid-1";
  const mockUserId = "user-uuid-1";

  beforeEach(() => {
    mockWorkspacesService = {
      getCurrentWorkspaceForUser: mock(async (userId: string) => {
        if (userId === mockUserId) return mockWorkspaceId;
        throw new Error("Unauthorized");
      }),
    };

    mockPrisma = {
      task: {
        create: mock(async (args: any) => ({
          id: "task-uuid-1",
          title: args.data.title,
          description: args.data.description ?? null,
          status: args.data.status,
          priority: args.data.priority,
          workspaceId: args.data.workspaceId,
          projectId: args.data.projectId ?? null,
          reporterId: args.data.reporterId ?? null,
          parentTaskId: args.data.parentTaskId ?? null,
          startDate: args.data.startDate ?? null,
          dueDate: args.data.dueDate ?? null,
          members: [],
          labels: [],
          reporter: null,
          project: null,
          createdAt: new Date("2026-08-16T12:00:00Z"),
          updatedAt: new Date("2026-08-16T12:00:00Z"),
        })),
        findMany: mock(async () => []),
        findFirst: mock(async (args: any) => {
          if (args.where?.id === "task-uuid-1" && args.where?.workspaceId === mockWorkspaceId) {
            return {
              id: "task-uuid-1",
              title: "Existing Task",
              description: null,
              status: TaskStatus.TODO,
              priority: TaskPriority.MEDIUM,
              workspaceId: mockWorkspaceId,
              projectId: null,
              reporterId: mockUserId,
              parentTaskId: null,
              startDate: null,
              dueDate: null,
              members: [],
              labels: [],
              reporter: null,
              project: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
          }
          return null;
        }),
        delete: mock(async () => ({ id: "task-uuid-1" })),
        update: mock(async (args: any) => ({
          id: "task-uuid-1",
          title: args.data.title ?? "Updated Task",
          description: args.data.description ?? null,
          status: args.data.status ?? TaskStatus.DOING,
          priority: args.data.priority ?? TaskPriority.HIGH,
          workspaceId: mockWorkspaceId,
          projectId: null,
          reporterId: mockUserId,
          parentTaskId: null,
          startDate: null,
          dueDate: null,
          members: [],
          labels: [],
          reporter: null,
          project: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
      },
      project: {
        findFirst: mock(async (args: any) => {
          if (args.where?.id === "valid-project-id" && args.where?.workspaceId === mockWorkspaceId) {
            return { id: "valid-project-id", workspaceId: mockWorkspaceId };
          }
          return null;
        }),
      },
      workspaceMember: {
        findFirst: mock(async () => null),
        findMany: mock(async () => []),
      },
      label: {
        findMany: mock(async () => []),
      },
      $transaction: mock(async (callback: any) => callback(mockPrisma)),
    };

    tasksService = new TasksService(
      mockPrisma as PrismaService,
      mockWorkspacesService as WorkspacesService
    );
  });

  it("should create a task in the authenticated user's workspace", async () => {
    const result = await tasksService.createTask(mockUserId, {
      title: "Write assessment tests",
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
    });

    expect(result.data.task.id).toBe("task-uuid-1");
    expect(result.data.task.title).toBe("Write assessment tests");
    expect(mockPrisma.task.create).toHaveBeenCalled();
  });

  it("should reject task creation if startDate is after dueDate", async () => {
    expect(
      tasksService.createTask(mockUserId, {
        title: "Invalid dates task",
        startDate: "2026-08-20",
        dueDate: "2026-08-10",
      })
    ).rejects.toThrow(BadRequestException);
  });

  it("should reject project assignment if project does not belong to user's workspace", async () => {
    expect(
      tasksService.createTask(mockUserId, {
        title: "Foreign project task",
        projectId: "foreign-project-id",
      })
    ).rejects.toThrow(BadRequestException);
  });

  it("should reject task retrieval for task in a different workspace", async () => {
    expect(
      tasksService.findOne(mockUserId, "foreign-task-id")
    ).rejects.toThrow(NotFoundException);
  });

  it("should reject task if a task is set as its own parent", async () => {
    expect(
      tasksService.updateTask(mockUserId, "task-uuid-1", {
        parentTaskId: "task-uuid-1",
      })
    ).rejects.toThrow(BadRequestException);
  });
});
