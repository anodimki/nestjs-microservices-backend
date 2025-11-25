import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersRepository;

  const mockUsersRepository = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UsersRepository>(UsersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    };

    it('should create a new user successfully', async () => {
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        email: createUserDto.email,
        password: 'hashedPassword',
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersRepository.findByEmail.mockResolvedValue(null);
      mockUsersRepository.create.mockResolvedValue(mockUser);

      const result = await service.createUser(createUserDto);

      expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(
        createUserDto.email,
      );
      expect(mockUsersRepository.create).toHaveBeenCalled();
      expect(result).toEqual({
        id: mockUser._id.toString(),
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        isActive: mockUser.isActive,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      const existingUser = {
        _id: '507f1f77bcf86cd799439011',
        email: createUserDto.email,
      };

      mockUsersRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockUsersRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        {
          _id: '507f1f77bcf86cd799439011',
          email: 'user1@example.com',
          firstName: 'User',
          lastName: 'One',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: '507f1f77bcf86cd799439012',
          email: 'user2@example.com',
          firstName: 'User',
          lastName: 'Two',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockUsersRepository.findAll.mockResolvedValue(mockUsers);

      const result = await service.getAllUsers();

      expect(mockUsersRepository.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0].email).toBe('user1@example.com');
    });

    it('should return an empty array when no users exist', async () => {
      mockUsersRepository.findAll.mockResolvedValue([]);

      const result = await service.getAllUsers();

      expect(result).toEqual([]);
    });
  });
});