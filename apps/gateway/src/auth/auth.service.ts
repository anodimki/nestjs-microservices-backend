import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../../authentication/src/users/users.service';
import { LoginUserDto } from '../../../authentication/src/users/dto/login-user.dto';
import { LoginResponseRto } from '../../../authentication/src/users/dto/login-response.rto';
import { UserRto } from '../../../authentication/src/users/dto/user.rto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto): Promise<LoginResponseRto> {
    const user = await this.usersService.validateUser(loginUserDto);

    if (!user) {
      throw new Error('Invalid credentials');
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
}