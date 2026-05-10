import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { USER_CMD } from '@inventory-system/constants';
import { firstValueFrom } from 'rxjs';
import { OAuthUserDto } from '@inventory-system/dto';
import { User } from '@inventory-system/entities';

@Injectable()
export class AuthService {
  constructor(@Inject('USERS_SERVICE') private readonly usersClient: ClientProxy) {}

  async validateGoogleUser(oAuthUserDto: OAuthUserDto) {
    // call user microservice
    const user = await firstValueFrom(
      this.usersClient.send(USER_CMD.FIND_OR_CREATE_OAUTH_USER, oAuthUserDto),
    );
    return user;
  }

  generateToken(user: Partial<User>) {
    return this.usersClient.send(USER_CMD.GENERATE_TOKENS_OAUTH_USER, user);
  }
}
