import { describe, it, expect, beforeEach, mock } from "bun:test";
import { LabelsService } from "../src/labels/labels.service";
import { PrismaService } from "../src/prisma/prisma.service";
import { WorkspacesService } from "../src/workspaces/workspaces.service";
import { ConflictException, NotFoundException } from "@nestjs/common";

describe("LabelsService", () => {
  let labelsService: LabelsService;
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
      label: {
        findUnique: mock(async (args: any) => {
          if (args.where?.workspaceId_name?.name === "Duplicate Label") {
            return {
              id: "existing-label-id",
              name: "Duplicate Label",
              color: "#ef4444",
              workspaceId: mockWorkspaceId,
            };
          }
          return null;
        }),
        create: mock(async (args: any) => ({
          id: "label-uuid-1",
          name: args.data.name,
          color: args.data.color ?? null,
          workspaceId: mockWorkspaceId,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
        findMany: mock(async () => [
          { id: "label-uuid-1", name: "Bug", color: "#ef4444" },
          { id: "label-uuid-2", name: "Feature", color: "#3b82f6" },
        ]),
        findFirst: mock(async (args: any) => {
          if (args.where?.id === "label-uuid-1" && args.where?.workspaceId === mockWorkspaceId) {
            return { id: "label-uuid-1", name: "Bug", color: "#ef4444", workspaceId: mockWorkspaceId };
          }
          return null;
        }),
        delete: mock(async () => ({ id: "label-uuid-1" })),
      },
    };

    labelsService = new LabelsService(
      mockPrisma as PrismaService,
      mockWorkspacesService as WorkspacesService
    );
  });

  it("should create a label with name and color", async () => {
    const res = await labelsService.create(mockUserId, {
      name: "Urgent",
      color: "#f59e0b",
    });

    expect(res.data.label.name).toBe("Urgent");
    expect(res.data.label.color).toBe("#f59e0b");
  });

  it("should reject duplicate label name in the same workspace", async () => {
    expect(
      labelsService.create(mockUserId, {
        name: "Duplicate Label",
        color: "#ef4444",
      })
    ).rejects.toThrow(ConflictException);
  });

  it("should list workspace labels sorted alphabetically", async () => {
    const res = await labelsService.findAll(mockUserId);
    expect(res.data.labels.length).toBe(2);
    expect(res.data.labels[0].name).toBe("Bug");
  });

  it("should reject deleting label from another workspace", async () => {
    expect(
      labelsService.delete(mockUserId, "foreign-label-id")
    ).rejects.toThrow(NotFoundException);
  });

  it("should delete label within workspace", async () => {
    const res = await labelsService.delete(mockUserId, "label-uuid-1");
    expect(res.message).toBe("Label deleted successfully");
  });
});
