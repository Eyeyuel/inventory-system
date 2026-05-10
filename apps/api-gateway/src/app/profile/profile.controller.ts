import { ProfileResponseDto, UpdateProfileDto } from '@inventory-system/dto';
import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { ProfileService } from './profile.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { THROTTLE_PRESETS } from '../common/throttle-presets';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Throttle({ [THROTTLE_PRESETS.profile.name]: THROTTLE_PRESETS.profile })
  @Patch()
  @ApiOperation({ summary: 'Update profile' })
  // @ApiParam({ name: 'id', description: 'prof ile UUID', example: 'uuid' })
  @ApiOkResponse({ type: ProfileResponseDto })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  updateProfile(@Body() updateProfileDto: UpdateProfileDto, @CurrentUser() user: { sub: string }) {
    return this.profileService.updateProfile(user.sub, updateProfileDto);
  }

  @Throttle({ [THROTTLE_PRESETS.profile.name]: THROTTLE_PRESETS.profile })
  @Get()
  @ApiOperation({ summary: 'List all products' })
  @ApiOkResponse({ description: 'Products retrieved', type: [ProfileResponseDto] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  getProfile(@CurrentUser() user: { sub: string }) {
    return this.profileService.getProfile(user.sub);
  }
}
