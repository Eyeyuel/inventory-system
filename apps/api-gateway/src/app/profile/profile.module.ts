import { Module } from "@nestjs/common";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";
import { UserClientModule } from "../clients/user.client.module";

@Module({
  imports: [UserClientModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
