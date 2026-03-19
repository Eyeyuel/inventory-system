import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { AuthService } from "./auth.service";
import { USER_CMD } from "@inventory-system/constants";
import { SignInUserDto, SignUpDto } from "@inventory-system/dto";

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(USER_CMD.LOGIN)
  signIn(@Payload() signInUserDto: SignInUserDto) {
    return this.authService.signIn(signInUserDto);
  }

  @MessagePattern(USER_CMD.SIGNUP)
  signUp(@Payload() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  // @MessagePattern({ cmd: "create_user" })
  // create(@Payload() createAuthDto: CreateAuthDto) {
  //   return this.authService.create(createAuthDto);
  // }

  // @MessagePattern({ cmd: "find_all_users" })
  // findAll() {
  //   return this.authService.findAll();
  // }

  // @MessagePattern({ cmd: "find_one_user" })
  // findOne(@Payload() id: number) {
  //   return this.authService.findOne(id);
  // }

  // @MessagePattern({ cmd: "update_user" })
  // update(@Payload() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(updateAuthDto.id, updateAuthDto);
  // }

  // @MessagePattern({ cmd: "remove_user" })
  // remove(@Payload() id: number) {
  //   return this.authService.remove(id);
  // }
}
