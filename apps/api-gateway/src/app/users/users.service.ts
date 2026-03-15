import { Inject, Injectable } from "@nestjs/common";
// import { CreateUserDto } from "./dto/create-user.dto";
// import { UpdateUserDto } from "./dto/update-user.dto";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class UsersService {
  constructor(
    @Inject("USERS_SERVICE") private readonly usersClient: ClientProxy,
  ) {}

  // create(createUserDto: CreateUserDto) {
  //   return this.usersClient.send({ cmd: "create_user" }, createUserDto);
  // }

  findAll() {
    return this.usersClient.send({ cmd: "get_users" }, {});
  }

  // findOne(id: number) {
  //   return this.usersClient.send({ cmd: "find_one_user" }, { id });
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return this.usersClient.send(
  //     { cmd: "update_user" },
  //     { id, ...updateUserDto },
  //   );
  // }

  // remove(id: number) {
  //   return this.usersClient.send({ cmd: "remove_user" }, { id });
  // }
}
