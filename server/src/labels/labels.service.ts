import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { WorkspacesService } from "../workspaces/workspaces.service";
import { CreateLabelDto } from "./dto/create-label.dto";
import { UpdateLabelDto } from "./dto/update-label.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class LabelsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workspacesService: WorkspacesService
  ) {}

  private serializeLabel(label: { id: string; name: string; color: string | null }) {
    return {
      id: label.id,
      name: label.name,
      color: label.color ?? null,
    };
  }

  async findAll(userId: string) {
    const workspaceId = await this.workspacesService.getCurrentWorkspaceForUser(userId);

    const labels = await this.prisma.label.findMany({
      where: { workspaceId },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        color: true,
      },
    });

    return {
      data: {
        labels: labels.map((l) => this.serializeLabel(l)),
      },
    };
  }

  async create(userId: string, dto: CreateLabelDto) {
    const workspaceId = await this.workspacesService.getCurrentWorkspaceForUser(userId);
    const cleanName = dto.name.trim();

    const existing = await this.prisma.label.findUnique({
      where: {
        workspaceId_name: {
          workspaceId,
          name: cleanName,
        },
      },
    });

    if (existing) {
      throw new ConflictException(`Label "${cleanName}" already exists in this workspace`);
    }

    try {
      const label = await this.prisma.label.create({
        data: {
          name: cleanName,
          color: dto.color?.trim() ?? null,
          workspaceId,
        },
      });

      return {
        data: {
          label: this.serializeLabel(label),
        },
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException(`Label "${cleanName}" already exists in this workspace`);
      }
      throw error;
    }
  }

  async update(userId: string, labelId: string, dto: UpdateLabelDto) {
    const workspaceId = await this.workspacesService.getCurrentWorkspaceForUser(userId);

    const label = await this.prisma.label.findFirst({
      where: { id: labelId, workspaceId },
    });

    if (!label) {
      throw new NotFoundException("Label not found");
    }

    const data: Prisma.LabelUpdateInput = {};
    if (dto.name !== undefined) data.name = dto.name.trim();
    if (dto.color !== undefined) data.color = dto.color?.trim() ?? null;

    try {
      const updated = await this.prisma.label.update({
        where: { id: labelId },
        data,
      });

      return {
        data: {
          label: this.serializeLabel(updated),
        },
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException("Label with this name already exists");
      }
      throw error;
    }
  }

  async delete(userId: string, labelId: string) {
    const workspaceId = await this.workspacesService.getCurrentWorkspaceForUser(userId);

    const label = await this.prisma.label.findFirst({
      where: { id: labelId, workspaceId },
    });

    if (!label) {
      throw new NotFoundException("Label not found");
    }

    await this.prisma.label.delete({
      where: { id: labelId },
    });

    return {
      message: "Label deleted successfully",
    };
  }
}
