import { describe, it, expect, beforeEach, mock } from "bun:test";
import { ProjectsService } from "../src/projects/projects.service";
import { PrismaService } from "../src/prisma/prisma.service";
import { WorkspacesService } from "../src/workspaces/workspaces.service";
import { NotFoundException } from "@nestjs/common";

describe("ProjectsService", () => {
  let projectsService: ProjectsService;
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
      project: {
        create: mock(async (args: any) => ({
          id: "project-uuid-1",
          name: args.data.name,
          description: args.data.description ?? null,
          workspaceId: mockWorkspaceId,
          _count: { tasks: 0 },
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
        findMany: mock(async () => [
          {
            id: "project-uuid-1",
            name: "Alpha Project",
            description: "First project",
            workspaceId: mockWorkspaceId,
            _count: { tasks: 5 },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]),
        findFirst: mock(async (args: any) => {
          if (args.where?.id === "project-uuid-1" && args.where?.workspaceId === mockWorkspaceId) {
            return {
              id: "project-uuid-1",
              name: "Alpha Project",
              description: "First project",
              workspaceId: mockWorkspaceId,
              _count: { tasks: 5 },
              createdAt: new Date(),
              updatedAt: new Date(),
            };
          }
          return null;
        }),
        update: mock(async (args: any) => ({
          id: "project-uuid-1",
          name: args.data.name ?? "Updated Project",
          description: args.data.description ?? null,
          workspaceId: mockWorkspaceId,
          _count: { tasks: 5 },
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
        delete: mock(async () => ({ id: "project-uuid-1" })),
      },
    };

    projectsService = new ProjectsService(
      mockPrisma as PrismaService,
      mockWorkspacesService as WorkspacesService
    );
  });

  it("should create a project scoped to user workspace", async () => {
    const res = await projectsService.createProject(mockUserId, {
      name: "New Assessment Project",
    });

    expect(res.data.project.id).toBe("project-uuid-1");
    expect(res.data.project.name).toBe("New Assessment Project");
    expect(res.data.project.taskCount).toBe(0);
  });

  it("should list projects with accurate task counts", async () => {
    const res = await projectsService.findAll(mockUserId);
    expect(res.data.projects.length).toBe(1);
    expect(res.data.projects[0].taskCount).toBe(5);
  });

  it("should reject project lookup for foreign workspace", async () => {
    expect(
      projectsService.findOne(mockUserId, "foreign-project-id")
    ).rejects.toThrow(NotFoundException);
  });
});
