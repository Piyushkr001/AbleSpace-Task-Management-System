import { IsString, MaxLength, MinLength, ValidateIf } from "class-validator";
import { Transform } from "class-transformer";

export class UpdateLabelDto {
  @ValidateIf((_, v) => v !== undefined)
  @IsString()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @MinLength(1)
  @MaxLength(50)
  name?: string;

  @ValidateIf((_, v) => v !== null && v !== undefined)
  @IsString()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @MaxLength(30)
  color?: string | null;
}
