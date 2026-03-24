import { Controller } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { UpdateProfileDto } from "@inventory-system/dto";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { PROFILE_CMD } from "@inventory-system/constants";

@Controller("profile")
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @MessagePattern(PROFILE_CMD.UPDATE)
  updateProfile(
    @Payload() payload: { userId: number; updateProfileDto: UpdateProfileDto },
  ) {
    const { userId, updateProfileDto } = payload;
    return this.profileService.updateProfile(userId, updateProfileDto);
  }

  @MessagePattern(PROFILE_CMD.GET)
  getProfile(@Payload() payload: { userId: number }) {
    const { userId } = payload;
    return this.profileService.getProfile(userId);
  }
}
