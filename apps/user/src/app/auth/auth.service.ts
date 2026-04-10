import { Injectable } from "@nestjs/common";
import { LoginDto, SignUpDto } from "@inventory-system/dto";
import { UsersService } from "../users/users.service";
import { RpcException } from "@nestjs/microservices";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcrypt";
import { User } from "./entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) { }

  private generateToken(user: Partial<User>): string {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ access_token: string; result: Partial<User> }> {
    const user = await this.userService.findone(loginDto.email);

    // Compare password
    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new RpcException({
        statusCode: 401,
        message: "Invalid credentials",
      });
    }

    const { password, ...result } = user;

    const token = this.generateToken(user);

    return { result, access_token: token };
  }

  async signUp(signUpDto: SignUpDto) {
    const result = await this.userService.create(signUpDto);
    // const { password, ...result } = user;
    const token = this.generateToken(result);
    return { result, access_token: token };
  }
}
