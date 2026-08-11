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
import { LabelsService } from "./labels.service";
import { CreateLabelDto } from "./dto/create-label.dto";
import { UpdateLabelDto } from "./dto/update-label.dto";
import { UnifiedAuthGuard } from "../auth/guards/unified-auth.guard";
import {
  CurrentUser,
  CurrentUserData,
} from "../auth/decorators/current-user.decorator";

@Controller("labels")
@UseGuards(UnifiedAuthGuard)
export class LabelsController {
  constructor(private readonly labelsService: LabelsService) {}

  @Get()
  async findAll(@CurrentUser() user: CurrentUserData) {
    return this.labelsService.findAll(user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: CreateLabelDto
  ) {
    return this.labelsService.create(user.id, dto);
  }

  @Patch(":id")
  async update(
    @CurrentUser() user: CurrentUserData,
    @Param("id") id: string,
    @Body() dto: UpdateLabelDto
  ) {
    return this.labelsService.update(user.id, id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  async delete(
    @CurrentUser() user: CurrentUserData,
    @Param("id") id: string
  ) {
    return this.labelsService.delete(user.id, id);
  }
}
