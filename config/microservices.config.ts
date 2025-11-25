import { Transport } from '@nestjs/microservices';

export const AUTHENTICATION_SERVICE = 'AUTHENTICATION_SERVICE';

export const authenticationMicroserviceConfig = {
  transport: Transport.TCP,
  options: {
    host: process.env.AUTH_SERVICE_HOST || 'localhost',
    port: parseInt(process.env.AUTH_SERVICE_PORT) || 3001,
  },
};