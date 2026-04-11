import { Injectable } from "@nestjs/common";
import { LoginDto, SignUpDto } from "@inventory-system/dto";
import { UsersService } from "../users/users.service";
import { RpcException } from "@nestjs/microservices";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcrypt";
import { User } from "./entities/user.entity";
import { ConfigService } from "@nestjs/config";
import { handleRpcException } from "@inventory-system/constants";

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) { }

  private generateToken(user: Partial<User>): string {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }
  private generateRefreshToken(user: Partial<User>): string {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });
  }

  async login(loginDto: LoginDto) {
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
    const refreshToken = this.generateRefreshToken(user);

    return { result, access_token: token, refresh_token: refreshToken };
  }

  async signUp(signUpDto: SignUpDto) {
    const result = await this.userService.create(signUpDto);
    // const { password, ...result } = user;
    const token = this.generateToken(result);
    const refreshToken = this.generateRefreshToken(result);

    return { result, access_token: token, refresh_token: refreshToken };
  }

  async refresh(refresh_token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refresh_token, { secret: this.configService.get('JWT_REFRESH_SECRET') })
      if (!payload) {
        throw new RpcException({
          statusCode: 403,
          message: "Invalid or expired refresh token",
        })
      }
      const { sub, email } = payload;
      // return { sub, email };
      const newAccesstoken = this.generateToken({ id: sub, email })
      const newRefreshToken = this.generateRefreshToken({ id: sub, email })
      return { access_Token: newAccesstoken, refresh_token: newRefreshToken }

    } catch (error) {
      handleRpcException(error, "Invalid or expired refresh token")
    }
  }
}