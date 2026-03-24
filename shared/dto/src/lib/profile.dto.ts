import { PartialType } from "@nestjs/mapped-types";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class CreateProfileDto {
  @IsOptional()
  @IsString()
  userNane?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  image?: string;
}

export class UpdateProfileDto extends PartialType(CreateProfileDto) {}
