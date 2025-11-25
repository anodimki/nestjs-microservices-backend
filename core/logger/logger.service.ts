import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';

@Injectable()
export class LoggerService implements NestLoggerService {
  log(message: string, context?: string) {
    console.log(`[${context || 'Application'}] ${new Date().toISOString()} - ${message}`);
  }

  error(message: string, trace?: string, context?: string) {
    console.error(`[${context || 'Application'}] ${new Date().toISOString()} - ERROR: ${message}`);
    if (trace) {
      console.error(trace);
    }
  }

  warn(message: string, context?: string) {
    console.warn(`[${context || 'Application'}] ${new Date().toISOString()} - WARN: ${message}`);
  }

  debug(message: string, context?: string) {
    console.debug(`[${context || 'Application'}] ${new Date().toISOString()} - DEBUG: ${message}`);
  }

  verbose(message: string, context?: string) {
    console.log(`[${context || 'Application'}] ${new Date().toISOString()} - VERBOSE: ${message}`);
  }
}