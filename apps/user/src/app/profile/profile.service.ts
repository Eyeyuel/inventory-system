import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Profile } from "./entities/profile.entity";
import { Repository } from "typeorm";
import { UpdateProfileDto } from "@inventory-system/dto";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) { }
  async getProfile(userId: number) {
    try {
      const profile = await this.profileRepository.findOne({
        where: { user: { id: userId } },
      });
      if (!profile)
        throw new RpcException({
          statusCode: 404,
          message: "Profile not found",
        });
      return profile;
    } catch (error) {
      throw new RpcException({
        statusCode: 500,
        message: "Database error while retrieving profile",
      });
    }
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {

    try {
      // Find profile by the user ID
      const profile = await this.profileRepository.findOne({
        where: { user: { id: userId } },
      });
      if (!profile)
        throw new RpcException({
          statusCode: 404,
          message: "Profile not found",
        });
      // Merge updates
      Object.assign(profile, updateProfileDto);
      return this.profileRepository.save(profile);
    } catch (error) {
      throw new RpcException({
        statusCode: 500,
        message: "Database error while updating profile",
      });
    }
  }
}
