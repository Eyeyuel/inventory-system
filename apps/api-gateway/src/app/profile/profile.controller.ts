import { Body, Controller, Get, Patch, Req, UseGuards } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { UpdateProfileDto } from "@inventory-system/dto";
import { AuthGuard } from "../guards/auth.guard";

@UseGuards(AuthGuard)
@Controller("profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @Patch()
  updateProfile(@Body() updateProfileDto: UpdateProfileDto, @Req() req: any) {
    const userId = Number(req.user.sub);
    return this.profileService.updateProfile(userId, updateProfileDto);
  }

  @Get()
  getProfile(@Req() req: any) {
    const userId = Number(req.user.sub);
    return this.profileService.getProfile(userId);
  }
}
