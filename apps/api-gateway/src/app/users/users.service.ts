import {
  Inject,
  Injectable,

} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDto } from '@inventory-system/dto';
import { handleRpcException, USER_CMD } from '@inventory-system/constants';

@Injectable()
export class UsersService {
  constructor(@Inject('USERS_SERVICE') private readonly usersClient: ClientProxy) { }

  login(loginDto: LoginDto) {
    try {
      const user = this.usersClient.send(USER_CMD.LOGIN, loginDto);
      return user;
    } catch (error) {
      handleRpcException(error, 'Login failed');

    }
  }

  signup(loginDto: LoginDto) {
    try {
      const user = this.usersClient.send(USER_CMD.SIGNUP, loginDto);
      return user;
    } catch (error) {
      handleRpcException(error, 'Signup failed');

    }
  }
}
