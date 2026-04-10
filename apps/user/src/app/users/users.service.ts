import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryFailedError, Repository } from "typeorm";
import { User } from "../auth/entities/user.entity";
import { RpcException } from "@nestjs/microservices";
import { SignUpDto } from "@inventory-system/dto";
import * as bcrypt from "bcrypt";
import { handleRpcException } from "@inventory-system/constants";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) { }

  async findone(email: string) {
    try {
      const user = await this.userRepository.findOneBy({ email });
      if (!user) {
        // Throw 401 – same message as wrong password to avoid email enumeration
        throw new RpcException({
          statusCode: 401,
          message: "Invalid credentials",
        });
      }
      return user;
    } catch (error) {
      handleRpcException(error, "Database error while getting user");
    }
  }

  async create(user: SignUpDto) {
    try {
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);

      // Set default values for proile obj
      user.profile = user.profile ?? {};
      user.profile.firstName = user.first_name ?? "";

      // Create a new user object with hashed password
      const userToCreate = {
        ...user,
        password: hashedPassword,
      };
      const newUser = this.userRepository.create(userToCreate);
      const savedUser = await this.userRepository.save(newUser);
      const { password, ...result } = savedUser;
      return result;
    } catch (error) {
      handleRpcException(error, "Database error while creating user");
    }
  }
}
