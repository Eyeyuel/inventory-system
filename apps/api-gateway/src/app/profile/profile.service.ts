import { PROFILE_CMD } from "@inventory-system/constants";
import { UpdateProfileDto } from "@inventory-system/dto";
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class ProfileService {
  constructor(
    @Inject("USERS_SERVICE") private readonly profileClient: ClientProxy,
  ) { }
  updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    try {
      return this.profileClient.send(PROFILE_CMD.UPDATE, { userId, updateProfileDto });
    } catch (error) {
      throw new HttpException(
        "Bad Gateway (profile service)",
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  getProfile(userId: number) {
    try {
      return this.profileClient.send(PROFILE_CMD.GET, userId);
    } catch (error) {
      throw new HttpException(
        "Bad Gateway (profile service)",
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
