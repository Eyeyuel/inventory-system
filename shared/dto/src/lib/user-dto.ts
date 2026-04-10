import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CreateProfileDto, ProfileResponseDto } from "./profile.dto";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsNotEmpty()
  password!: string;
}

export class SignUpDto {
  @ApiProperty({ example: 'RtD1t@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'User first name' })
  @IsNotEmpty()
  @IsString()
  first_name!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  last_name?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password!: string;

  @ApiPropertyOptional()
  @IsOptional()
  profile?: CreateProfileDto;
}

// Responses

export class LoginResponseDto {
  @ApiProperty({
    description: 'User unique identifier',
    example: '27b5030c-71d6-45e5-b9d8-d0cd79bfaca0',
    format: 'uuid',
  })
  id!: string;

  @ApiProperty({
    description: 'User email address',
    example: 'abel@gmail.com',
    format: 'email',
  })
  email!: string;

  @ApiProperty({
    description: 'User first name',
    example: 'Abel',
  })
  first_name!: string;

  @ApiPropertyOptional({
    description: 'User last name',
    example: 'Smith',
    nullable: true,
  })
  last_name!: string | null;

  @ApiProperty({
    description: 'Account creation timestamp',
    example: '2026-03-31T13:08:38.158Z',
    format: 'date-time',
  })
  created_at!: string;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2026-03-31T13:08:38.158Z',
    format: 'date-time',
  })
  updated_at!: string;

  @ApiPropertyOptional({
    description: 'Soft deletion timestamp',
    example: null,
    nullable: true,
    format: 'date-time',
  })
  deleted_at!: string | null;
}


export class SignupResponseDto {
  @ApiProperty({ description: 'User email', example: 'clicks@gmail.com', format: 'email' })
  email!: string;

  @ApiProperty({ description: 'User first name', example: 'klicker' })
  first_name!: string;

  @ApiProperty({ description: 'User profile details', type: ProfileResponseDto })
  profile!: ProfileResponseDto;

  @ApiPropertyOptional({ description: 'User last name', example: null, nullable: true })
  last_name!: string | null;

  @ApiProperty({ description: 'User ID', example: '974405ea-fb04-4494-ad3e-fa530b44f61e', format: 'uuid' })
  id!: string;

  @ApiProperty({ description: 'Creation timestamp', example: '2026-04-08T11:00:12.339Z', format: 'date-time' })
  created_at!: string;

  @ApiProperty({ description: 'Last update timestamp', example: '2026-04-08T11:00:12.339Z', format: 'date-time' })
  updated_at!: string;

  @ApiPropertyOptional({ description: 'Soft deletion timestamp', example: null, nullable: true, format: 'date-time' })
  deleted_at!: string | null;
}