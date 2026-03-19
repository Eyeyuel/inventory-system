import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryFailedError, Repository } from "typeorm";
import { User } from "../auth/entities/user.entity";
import { RpcException } from "@nestjs/microservices";
import { SignUpDto } from "@inventory-system/dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findone(email: string) {
    try {
      const user = await this.userRepository.findOneBy({ email });
      return user;
    } catch (error) {
      console.error(`Error finding user by email: ${email}`, error.stack);

      // Throw RpcException – it will be sent to the API Gateway
      throw new RpcException({
        statusCode: 500,
        message: "Database error while retrieving user",
      });
    }
  }

  async create(user: SignUpDto) {
    try {
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);

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
      // Check if it's a duplicate key violation
      if (
        error instanceof QueryFailedError &&
        (error as any).code === "23505"
      ) {
        throw new RpcException({
          statusCode: 409,
          message: "Email already exists",
        });
      }

      console.error("Error creating user", error.stack);
      throw new RpcException({
        statusCode: 500,
        message: "Database error while creating user",
      });
    }
  }
}
