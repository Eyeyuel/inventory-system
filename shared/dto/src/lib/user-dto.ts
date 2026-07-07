import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { CreateProfileDto, ProfileResponseDto } from './profile.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

export class ResetPasswordDto {
  @IsString()
  token!: string;

  @IsString()
  @MinLength(6)
  newPassword!: string;
}

// Responses

export class LoginResponseDto {
  @ApiProperty({
    description: 'User object',
  })
  result!: {
    id: string;
    email: string;
    first_name: string;
    last_name: string | null;
    isVerified: boolean;
    googleId: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };

  @ApiProperty({
    description: 'JWT access token',
  })
  access_token!: string;

  @ApiProperty({
    description: 'JWT refresh token',
  })
  refresh_token!: string;
}

export class SignupResponseDto {
  @ApiProperty({
    description: 'verification token',
    example: 'sakdjfhksdlasdlfowieruoqkjhsoifdjoiwerijew',
  })
  verification_token!: string;
}

export class VerifyEmailResponseDto {
  @ApiProperty({ example: 'Email verified successfully' })
  message!: string;

  @ApiProperty({ example: 'eyJhbGciOi...' })
  access_token!: string;

  @ApiProperty({ example: 'eyJhbGciOi...' })
  refresh_token!: string;
}

export class OAuthUserDto {
  email?: string;
  googleId!: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}
