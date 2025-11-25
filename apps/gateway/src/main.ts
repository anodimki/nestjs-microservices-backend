import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { GatewayModule } from './gateway.module';
import { LoggerService } from '../../../core/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);

  const logger = app.get(LoggerService);
  app.useLogger(logger);

  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('NestJS Microservices API')
    .setDescription('API Gateway for User Management System with JWT Authentication')
    .setVersion('1.0')
    .addTag('Authentication')
    .addTag('Health')
    .addBearerAuth() // Add JWT Bearer authentication
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.GATEWAY_PORT || 3000;
  await app.listen(port);

  logger.log(`Gateway is running on http://localhost:${port}`, 'Bootstrap');
  logger.log(
    `Swagger documentation available at http://localhost:${port}/api/docs`,
    'Bootstrap',
  );
}

bootstrap();