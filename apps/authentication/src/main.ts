import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthenticationModule } from './authentication.module';
import { LoggerService } from '../../../core/logger/logger.service';
import { ValidationPipe } from '../../../common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthenticationModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.AUTH_SERVICE_HOST || 'localhost',
        port: parseInt(process.env.AUTH_SERVICE_PORT) || 3001,
      },
    },
  );

  const logger = app.get(LoggerService);
  
  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(logger);

  await app.listen();
  logger.log('Authentication Microservice is running on port 3001', 'Bootstrap');
}

bootstrap();