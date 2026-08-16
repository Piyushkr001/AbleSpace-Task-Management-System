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
              projectId: "valid-project-id",
              reporterId: mockUserId,
              parentTaskId: null,
              startDate: new Date("2026-08-01"),
              dueDate: new Date("2026-08-15"),
              members: [],
              labels: [],
              reporter: null,
              project: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
          }
          if (args.where?.id === "task-uuid-2" && args.where?.workspaceId === mockWorkspaceId) {
            return {
              id: "task-uuid-2",
              parentTaskId: "task-uuid-3",
              workspaceId: mockWorkspaceId,
            };
          }
          return null;
        }),
        findUnique: mock(async (args: any) => {
          if (args.where?.id === "task-uuid-2") {
            return { parentTaskId: "task-uuid-3" };
          }
          if (args.where?.id === "task-uuid-3") {
            return { parentTaskId: "task-uuid-1" };
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
          projectId: args.data.project?.disconnect ? null : "valid-project-id",
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
        findMany: mock(async (args: any) => {
          if (args.where?.userId?.in?.includes("valid-member-id")) {
            return [{ userId: "valid-member-id" }];
          }
          return [];
        }),
      },
      label: {
        findMany: mock(async (args: any) => {
          if (args.where?.id?.in?.includes("valid-label-id")) {
            return [{ id: "valid-label-id" }];
          }
          return [];
        }),
      },
      taskMember: {
        deleteMany: mock(async () => ({ count: 1 })),
        createMany: mock(async () => ({ count: 1 })),
      },
      taskLabel: {
        deleteMany: mock(async () => ({ count: 1 })),
        createMany: mock(async () => ({ count: 1 })),
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

  it("should reject multi-hop cyclical parent relationships (A -> B -> C -> A)", async () => {
    expect(
      tasksService.updateTask(mockUserId, "task-uuid-1", {
        parentTaskId: "task-uuid-2",
      })
    ).rejects.toThrow(BadRequestException);
  });

  it("should disconnect project when projectId is set to null", async () => {
    const res = await tasksService.updateTask(mockUserId, "task-uuid-1", {
      projectId: null,
    });

    expect(res.data.task.project).toBeNull();
  });

  it("should reject foreign member IDs outside the active workspace", async () => {
    expect(
      tasksService.createTask(mockUserId, {
        title: "Task with foreign member",
        memberIds: ["foreign-user-id"],
      })
    ).rejects.toThrow(BadRequestException);
  });

  it("should reject foreign label IDs outside the active workspace", async () => {
    expect(
      tasksService.createTask(mockUserId, {
        title: "Task with foreign label",
        labelIds: ["foreign-label-id"],
      })
    ).rejects.toThrow(BadRequestException);
  });

  it("should successfully delete a task within the workspace", async () => {
    const res = await tasksService.deleteTask(mockUserId, "task-uuid-1");
    expect(res.message).toBe("Task deleted successfully");
  });
});
