import { Body, Controller, Get, Patch, Req, UseGuards } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { UpdateProfileDto } from "@inventory-system/dto";
import { AuthGuard } from "../guards/auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";

@UseGuards(AuthGuard)
@Controller("profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @Patch()
  updateProfile(@Body() updateProfileDto: UpdateProfileDto, @CurrentUser() user: { sub: string }) {
    return this.profileService.updateProfile(user.sub, updateProfileDto);
  }

  @Get()
  getProfile(@CurrentUser() user: { sub: string }) {
    return this.profileService.getProfile(user.sub);
  }
}
