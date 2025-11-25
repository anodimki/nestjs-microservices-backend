import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserRto } from './dto/user.rto';
import { LoginResponseRto } from './dto/login-response.rto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserRto> {
    const existingUser = await this.usersRepository.findByEmail(
      createUserDto.email,
    );
    
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    const user = await this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return new UserRto({
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async validateUser(loginUserDto: LoginUserDto): Promise<UserRto | null> {
    const user = await this.usersRepository.findByEmailWithPassword(
      loginUserDto.email,
    );

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      return null;
    }

    return new UserRto({
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async login(loginUserDto: LoginUserDto): Promise<LoginResponseRto> {
    const user = await this.validateUser(loginUserDto);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { 
      sub: user.id, 
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    return new LoginResponseRto({
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  }

  async validateToken(token: string): Promise<UserRto | null> {
    try {
      const payload = this.jwtService.verify(token);
      return new UserRto({
        id: payload.sub,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (error) {
      return null;
    }
  }

  async getAllUsers(): Promise<UserRto[]> {
    const users = await this.usersRepository.findAll();
    
    return users.map(
      (user) =>
        new UserRto({
          id: user._id.toString(),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }),
    );
  }
}