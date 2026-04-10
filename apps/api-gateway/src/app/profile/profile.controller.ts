import { ProfileResponseDto, UpdateProfileDto } from "@inventory-system/dto";
import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { AuthGuard } from "../guards/auth.guard";
import { ProfileService } from "./profile.service";
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiUnauthorizedResponse } from "@nestjs/swagger";

@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller("profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @ApiOperation({ summary: 'Update profile' })
  @ApiParam({ name: 'id', description: 'prof ile UUID', example: 'uuid' })
  @ApiOkResponse({ type: ProfileResponseDto })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @Patch()
  updateProfile(@Body() updateProfileDto: UpdateProfileDto, @CurrentUser() user: { sub: string }) {
    return this.profileService.updateProfile(user.sub, updateProfileDto);
  }

  @ApiOperation({ summary: 'List all products' })
  @ApiOkResponse({ description: 'Products retrieved', type: [ProfileResponseDto] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get()
  getProfile(@CurrentUser() user: { sub: string }) {
    return this.profileService.getProfile(user.sub);
  }
}
