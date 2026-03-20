import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name!: string;

  // userId: from apigateway(authGuard)
  // @IsNotEmpty()
  // @IsNumber()
  // userId!: number;

  // storeId: from apigateway(authGuard)
  // userId: number;

  @IsNotEmpty()
  @IsNumber()
  storeId!: number;
}
