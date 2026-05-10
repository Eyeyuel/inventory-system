import { handleRpcException } from '@inventory-system/constants';
import { OAuthUserDto, SignUpDto } from '@inventory-system/dto';
import { User } from '@inventory-system/entities';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async findOne(filters: { id?: string; email?: string; username?: string }) {
    try {
      // Build where clause dynamically, only include provided filters
      const where: any = {};
      if (filters.id) where.id = filters.id;
      if (filters.email) where.email = filters.email;
      if (filters.username) where.username = filters.username;

      // Ensure at least one filter is provided
      if (Object.keys(where).length === 0) {
        throw new RpcException({
          statusCode: 400,
          message: 'At least one search criterion (id, email, or username) is required',
        });
      }

      const user = await this.userRepository.findOne({ where });

      if (!user) {
        throw new RpcException({
          statusCode: 404,
          message: 'User not found',
        });
      }
      return user;
    } catch (error) {
      handleRpcException(error, 'Database error while getting user');
    }
  }

  async findOneOrNull(filters: { id?: string; email?: string; username?: string }) {
    try {
      // Build where clause dynamically, only include provided filters
      const where: any = {};
      if (filters.id) where.id = filters.id;
      if (filters.email) where.email = filters.email;
      if (filters.username) where.username = filters.username;

      // Ensure at least one filter is provided
      if (Object.keys(where).length === 0) {
        throw new RpcException({
          statusCode: 400,
          message: 'At least one search criterion (id, email, or username) is required',
        });
      }

      const user = await this.userRepository.findOne({ where });
      return user;
    } catch (error) {
      handleRpcException(error, 'Database error while getting user');
    }
  }

  async create(user: SignUpDto) {
    try {
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);

      // Set default values for profile obj
      user.profile = user.profile ?? {};
      user.profile.firstName = user.first_name ?? '';

      // Create a new user object with hashed password
      const userToCreate = {
        ...user,
        password: hashedPassword,
        isVerified: false,
      };
      const newUser = this.userRepository.create(userToCreate);
      const savedUser = await this.userRepository.save(newUser);
      const { password, ...result } = savedUser;
      return result;
    } catch (error) {
      handleRpcException(error, 'Database error while creating user');
    }
  }

  async verifyEmail(user: User) {
    try {
      const response = await this.userRepository.save(user);
      const { password, ...result } = response;
      return result;
    } catch (error) {
      handleRpcException(error, 'Database error while verifying email');
    }
  }

  async updateUser(user: User) {
    if (user.password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);
      user.password = hashedPassword;
    }
    try {
      const result = await this.userRepository.save(user);
      return result;
    } catch (error) {
      handleRpcException(error, 'Database error while updating user');
    }
  }

  async createOauthUser(oAuthUserDto: OAuthUserDto) {
    try {
      // let user = await this.userRepository.findOne({ where: { email } });

      // if (user) {
      //   return user;
      // }

      const newUser = this.userRepository.create({
        email: oAuthUserDto.email,
        googleId: oAuthUserDto.googleId,
        isVerified: true, // OAuth users are considered verified
        first_name: oAuthUserDto.firstName || '',
        last_name: oAuthUserDto.lastName || '',
        profile: {
          firstName: oAuthUserDto.firstName || '',
          lastName: oAuthUserDto.lastName || '',
          image: oAuthUserDto.avatarUrl || '',
        },
      });
      const user = await this.userRepository.save(newUser);
      return user;
    } catch (error) {
      handleRpcException(error, 'Database error while creating OAuth user');
    }
  }
}
