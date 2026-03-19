import { Controller, Post, Body, HttpStatus, HttpCode } from "@nestjs/common";
import { UsersService } from "./users.service";
import { SignInUserDto, SignUpDto } from "@inventory-system/dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  create(@Body() signInUserDto: SignInUserDto) {
    return this.usersService.login(signInUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post("signup")
  register(@Body() signUpDto: SignUpDto) {
    return this.usersService.signup(signUpDto);
  }
}
