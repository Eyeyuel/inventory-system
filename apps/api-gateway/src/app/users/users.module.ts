import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { UserClientModule } from "../clients/user.client.module";

@Module({
  imports: [UserClientModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
