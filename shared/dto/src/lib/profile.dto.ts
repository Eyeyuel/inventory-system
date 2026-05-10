import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateProfileDto {
  @ApiPropertyOptional({ description: 'Unique username', example: 'abel123' })
  @IsOptional()
  @IsString()
  userName?: string;

  @ApiPropertyOptional({ description: 'First name', example: 'Abel' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ description: 'Last name', example: 'Smith' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ description: 'Profile image URL', example: 'https://...' })
  @IsOptional()
  @IsString()
  image?: string;
}

export class UpdateProfileDto extends PartialType(CreateProfileDto) { }

export class ProfileResponseDto {
  @ApiProperty({ description: 'Profile ID', example: '4e894ab7-eb93-439b-9c83-92c3017cad28', format: 'uuid' })
  id!: string;

  @ApiPropertyOptional({ description: 'Profile username', example: 'klicker123', nullable: true })
  userName!: string | null;

  @ApiProperty({ description: 'Profile first name', example: 'klicker' })
  firstName!: string;

  @ApiPropertyOptional({ description: 'Profile last name', example: null, nullable: true })
  lastName!: string | null;

  @ApiPropertyOptional({ description: 'Profile image URL', example: null, nullable: true })
  image!: string | null;

}

