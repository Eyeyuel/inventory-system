import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty } from "class-validator";
import { SignUpDto } from "./user-dto";

export class UpdateUserDto extends PartialType(SignUpDto) {
  @IsNotEmpty()
  id!: number;
}
