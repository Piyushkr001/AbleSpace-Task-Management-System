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
  Query,
  UseGuards,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { TaskQueryDto } from "./dto/task-query.dto";
import { UnifiedAuthGuard } from "../auth/guards/unified-auth.guard";
import {
  CurrentUser,
  CurrentUserData,
} from "../auth/decorators/current-user.decorator";

@Controller("tasks")
@UseGuards(UnifiedAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTask(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: CreateTaskDto
  ) {
    return this.tasksService.createTask(user.id, dto);
  }

  @Get()
  async findAll(
    @CurrentUser() user: CurrentUserData,
    @Query() query: TaskQueryDto
  ) {
    return this.tasksService.findAll(user.id, query);
  }

  @Get(":id")
  async findOne(
    @CurrentUser() user: CurrentUserData,
    @Param("id") id: string
  ) {
    return this.tasksService.findOne(user.id, id);
  }

  @Patch(":id")
  async updateTask(
    @CurrentUser() user: CurrentUserData,
    @Param("id") id: string,
    @Body() dto: UpdateTaskDto
  ) {
    return this.tasksService.updateTask(user.id, id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  async deleteTask(
    @CurrentUser() user: CurrentUserData,
    @Param("id") id: string
  ) {
    return this.tasksService.deleteTask(user.id, id);
  }
}
