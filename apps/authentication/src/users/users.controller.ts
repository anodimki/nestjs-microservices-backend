import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserRto } from './dto/user.rto';
import { LoginResponseRto } from './dto/login-response.rto';

@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @MessagePattern({ cmd: 'register_user' })
  async registerUser(@Payload() createUserDto: CreateUserDto): Promise<UserRto> {
    try {
      return await this.usersService.createUser(createUserDto);
    } catch (error) {
      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || 'Internal server error',
      });
    }
  }

  @MessagePattern({ cmd: 'login_user' })
  async loginUser(@Payload() loginUserDto: LoginUserDto): Promise<LoginResponseRto> {
    try {
      return await this.usersService.login(loginUserDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: error.message || 'Invalid credentials',
      });
    }
  }

  @MessagePattern({ cmd: 'validate_token' })
  async validateToken(@Payload() data: { token: string }): Promise<UserRto | null> {
    return await this.usersService.validateToken(data.token);
  }

  @MessagePattern({ cmd: 'get_all_users' })
  async getAllUsers(): Promise<UserRto[]> {
    try {
      return await this.usersService.getAllUsers();
    } catch (error) {
      throw new RpcException({
        statusCode: 500,
        message: error.message || 'Internal server error',
      });
    }
  }
}