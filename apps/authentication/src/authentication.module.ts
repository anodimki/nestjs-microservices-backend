import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from '../../gateway/src/auth/auth.module';
import { DatabaseModule } from '../../../core/database/database.module';
import { LoggerModule } from '../../../core/logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    LoggerModule,
    UsersModule,    // UsersModule first
    AuthModule,     // AuthModule second
  ],
})
export class AuthenticationModule {}