import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { Transform } from "class-transformer";
import { TaskStatus, TaskPriority } from "@prisma/client";

export class TaskQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : value ? [value] : undefined))
  @IsEnum(TaskStatus, { each: true })
  status?: TaskStatus[];

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : value ? [value] : undefined))
  @IsEnum(TaskPriority, { each: true })
  priority?: TaskPriority[];

  @IsOptional()
  @IsUUID()
  memberId?: string;

  @IsOptional()
  @IsUUID()
  labelId?: string;

  @IsOptional()
  @IsUUID()
  projectId?: string;
}
