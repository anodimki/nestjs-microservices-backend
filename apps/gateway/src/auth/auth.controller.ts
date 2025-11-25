import {
  Controller,
  Post,
  Get,
  Body,
  HttpException,
  HttpStatus,
  Inject,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto'; // ✅ Local import
import { UserResponseDto } from './dto/user-response.dto';
import { LoginResponseDto } from './dto/login-response.dto'; // ✅ Local import
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoggerService } from '../../../../core/logger/logger.service';
import { AUTHENTICATION_SERVICE } from '../../../../config/microservices.config';
import { firstValueFrom, timeout, catchError } from 'rxjs';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTHENTICATION_SERVICE)
    private readonly authServiceClient: ClientProxy,
    private readonly logger: LoggerService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<UserResponseDto> {
    try {
      this.logger.log(
        `Registering user with email: ${registerUserDto.email}`,
        'AuthController',
      );

      const user = await firstValueFrom(
        this.authServiceClient
          .send({ cmd: 'register_user' }, registerUserDto)
          .pipe(
            timeout(5000),
            catchError((error) => {
              throw error;
            }),
          ),
      );

      this.logger.log(
        `User registered successfully: ${user.id}`,
        'AuthController',
      );

      return user;
    } catch (error) {
      this.logger.error(
        `Error registering user: ${error.message || 'Unknown error'}`,
        error.stack,
        'AuthController',
      );

      if (error.message && error.message.includes('already exists')) {
        throw new HttpException(
          'User with this email already exists',
          HttpStatus.CONFLICT,
        );
      }

      if (error.error && typeof error.error === 'string') {
        if (error.error.includes('already exists')) {
          throw new HttpException(
            'User with this email already exists',
            HttpStatus.CONFLICT,
          );
        }
      }

      throw new HttpException(
        'Failed to register user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    try {
      this.logger.log(
        `Login attempt for email: ${loginUserDto.email}`,
        'AuthController',
      );

      const result = await firstValueFrom(
        this.authServiceClient
          .send({ cmd: 'login_user' }, loginUserDto)
          .pipe(timeout(5000)),
      );

      this.logger.log(
        `User logged in successfully: ${loginUserDto.email}`,
        'AuthController',
      );

      return result;
    } catch (error) {
      this.logger.error(
        `Login failed for email: ${loginUserDto.email}`,
        error.stack,
        'AuthController',
      );

      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users (Protected)' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: [UserResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAllUsers(): Promise<UserResponseDto[]> {
    try {
      this.logger.log('Fetching all users', 'AuthController');

      const users = await firstValueFrom(
        this.authServiceClient
          .send({ cmd: 'get_all_users' }, {})
          .pipe(timeout(5000)),
      );

      this.logger.log(
        `Retrieved ${users.length} users`,
        'AuthController',
      );

      return users;
    } catch (error) {
      this.logger.error(
        `Error fetching users: ${error.message}`,
        error.stack,
        'AuthController',
      );

      throw new HttpException(
        'Failed to fetch users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile (Protected)' })
  @ApiResponse({
    status: 200,
    description: 'Current user profile',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req): Promise<UserResponseDto> {
    return req.user;
  }
}