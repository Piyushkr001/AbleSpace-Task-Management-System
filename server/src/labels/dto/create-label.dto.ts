import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Transform } from "class-transformer";

export class CreateLabelDto {
  @IsString()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @MinLength(1)
  @MaxLength(50)
  name!: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @MaxLength(30)
  color?: string;
}
