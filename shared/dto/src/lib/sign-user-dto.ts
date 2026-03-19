import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SignInUserDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  password!: string;
}

export class SignUpDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  first_name!: string;

  @IsString()
  @IsOptional()
  last_name?: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}
