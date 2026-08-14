import {
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";
import { Transform } from "class-transformer";

export class UpdateProjectDto {
  @ValidateIf((_, v) => v !== undefined)
  @IsString()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @MinLength(1)
  @MaxLength(100)
  name?: string;

  @ValidateIf((_, v) => v !== null && v !== undefined)
  @IsString()
  @Transform(({ value }) =>
    typeof value === "string" ? (value.trim().length > 0 ? value.trim() : null) : value
  )
  @MaxLength(1000)
  description?: string | null;
}
