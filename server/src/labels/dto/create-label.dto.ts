import { IsString, Matches, MaxLength, MinLength, ValidateIf } from "class-validator";
import { Transform } from "class-transformer";

export class CreateLabelDto {
  @IsString()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @MinLength(1)
  @MaxLength(50)
  name!: string;

  @ValidateIf((_, v) => v !== null && v !== undefined)
  @IsString()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: "color must be a valid 6-character hex color code (e.g. #3b82f6)",
  })
  color?: string | null;
}
