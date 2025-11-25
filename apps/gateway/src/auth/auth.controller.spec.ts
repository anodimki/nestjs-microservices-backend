import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { of, throwError } from 'rxjs';
import { AuthController } from './auth.controller';
import { LoggerService } from '../../../../core/logger/logger.service';
import { AUTHENTICATION_SERVICE } from '../../../../config/microservices.config';
import { RegisterUserDto } from './dto/register-user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let clientProxy: ClientProxy;

  const mockClientProxy = {
    send: jest.fn(),
  };

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AUTHENTICATION_SERVICE,
          useValue: mockClientProxy,
        },
        {
          provide: LoggerService,
          useValue: mockLogger,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    clientProxy = module.get<ClientProxy>(AUTHENTICATION_SERVICE);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto: RegisterUserDto = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    };

    it('should register a user successfully', async () => {
      const mockResponse = {
        id: '507f1f77bcf86cd799439011',
        email: registerDto.email,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockClientProxy.send.mockReturnValue(of(mockResponse));

      const result = await controller.register(registerDto);

      expect(mockClientProxy.send).toHaveBeenCalledWith(
        { cmd: 'register_user' },
        registerDto,
      );
      expect(result).toEqual(mockResponse);
      expect(mockLogger.log).toHaveBeenCalled();
    });

    it('should throw ConflictException when user already exists', async () => {
      const error = new Error('User with this email already exists');
      mockClientProxy.send.mockReturnValue(throwError(() => error));

      await expect(controller.register(registerDto)).rejects.toThrow(
        HttpException,
      );
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('getAllUsers', () => {
    it('should return array of users', async () => {
      const mockUsers = [
        {
          id: '507f1f77bcf86cd799439011',
          email: 'user1@example.com',
          firstName: 'User',
          lastName: 'One',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockClientProxy.send.mockReturnValue(of(mockUsers));

      const result = await controller.getAllUsers();

      expect(mockClientProxy.send).toHaveBeenCalledWith(
        { cmd: 'get_all_users' },
        {},
      );
      expect(result).toEqual(mockUsers);
    });

    it('should throw exception when service fails', async () => {
      mockClientProxy.send.mockReturnValue(
        throwError(() => new Error('Service unavailable')),
      );

      await expect(controller.getAllUsers()).rejects.toThrow(HttpException);
    });
  });
});