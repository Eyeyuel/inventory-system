import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { SignInUserDto, SignUpDto } from "@inventory-system/dto";
import { USER_CMD } from "@inventory-system/constants";

@Injectable()
export class UsersService {
  constructor(
    @Inject("USERS_SERVICE") private readonly usersClient: ClientProxy,
  ) {}

  async login(signInUserDto: SignInUserDto) {
    try {
      const user = await this.usersClient.send(USER_CMD.LOGIN, signInUserDto);

      return user;
    } catch (error) {
      // error is the RpcException object sent from the microservice
      if (error?.error?.statusCode === 401) {
        throw new UnauthorizedException(
          error.error.message || "Invalid credentials",
        );
      }
      // Default to 500 for any other error
      throw new InternalServerErrorException(
        error.error?.message || "Login failed",
      );
    }
  }

  async signup(signInUserDto: SignUpDto) {
    try {
      const user = await this.usersClient.send(USER_CMD.SIGNUP, signInUserDto);
      return user;
    } catch (error) {
      // error is the RpcException object sent from the microservice
      if (error?.error?.statusCode === 401) {
        throw new UnauthorizedException(
          error.error.message || "Invalid credentials",
        );
      }
      // Default to 500 for any other error
      throw new InternalServerErrorException(
        error.error?.message || "Signup failed",
      );
    }
  }

  // create(createUserDto: CreateUserDto) {
  //   return this.usersClient.send(USER_CMD.CREATE, createUserDto);
  // }
}
