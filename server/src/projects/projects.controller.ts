import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { UnifiedAuthGuard } from "../auth/guards/unified-auth.guard";
import {
  CurrentUser,
  CurrentUserData,
} from "../auth/decorators/current-user.decorator";

@Controller("projects")
@UseGuards(UnifiedAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProject(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: CreateProjectDto
  ) {
    return this.projectsService.createProject(user.id, dto);
  }

  @Get()
  async findAll(@CurrentUser() user: CurrentUserData) {
    return this.projectsService.findAll(user.id);
  }

  @Get(":id")
  async findOne(
    @CurrentUser() user: CurrentUserData,
    @Param("id") id: string
  ) {
    return this.projectsService.findOne(user.id, id);
  }

  @Patch(":id")
  async updateProject(
    @CurrentUser() user: CurrentUserData,
    @Param("id") id: string,
    @Body() dto: UpdateProjectDto
  ) {
    return this.projectsService.updateProject(user.id, id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  async deleteProject(
    @CurrentUser() user: CurrentUserData,
    @Param("id") id: string
  ) {
    return this.projectsService.deleteProject(user.id, id);
  }
}
