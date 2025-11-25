// SETUP_GUIDE.md

# 🚀 Complete Setup Guide

This guide will walk you through setting up the NestJS Microservices Backend from scratch.

## Step 1: Project Initialization

```bash
# Install NestJS CLI globally
npm install -g @nestjs/cli

# Create a new NestJS project
nest new nestjs-microservices-backend

# Navigate to project directory
cd nestjs-microservices-backend
```

## Step 2: Install Dependencies

```bash
# Core dependencies
npm install @nestjs/microservices @nestjs/mongoose mongoose
npm install @nestjs/config @nestjs/swagger swagger-ui-express
npm install @nestjs/throttler
npm install class-validator class-transformer
npm install bcrypt
npm install rxjs

# Development dependencies
npm install --save-dev @types/bcrypt @types/node
npm install --save-dev concurrently
npm install --save-dev @nestjs/testing jest ts-jest
npm install --save-dev supertest @types/supertest
```

## Step 3: Create Project Structure

```bash
# Create apps directories
mkdir -p apps/gateway/src
mkdir -p apps/authentication/src

# Create common, core, and config directories
mkdir -p common/{decorators,filters,guards,interceptors,pipes}
mkdir -p core/{database,logger}
mkdir -p config

# Create module directories
mkdir -p apps/gateway/src/{auth,health}
mkdir -p apps/gateway/src/auth/dto
mkdir -p apps/authentication/src/users
mkdir -p apps/authentication/src/users/{dto,schemas}
```

## Step 4: Create Configuration Files

### Root Configuration

1. **nest-cli.json** - Configure monorepo structure
2. **tsconfig.json** - Base TypeScript configuration
3. **package.json** - Update scripts section
4. **.env** - Environment variables
5. **.gitignore** - Git ignore patterns
6. **.eslintrc.js** - ESLint configuration
7. **.prettierrc** - Prettier configuration

### App-specific Configuration

1. **apps/gateway/tsconfig.app.json**
2. **apps/authentication/tsconfig.app.json**

## Step 5: Create Core Modules

### Database Module
- `core/database/database.module.ts`

### Logger Module
- `core/logger/logger.service.ts`
- `core/logger/logger.module.ts`

### Configuration Files
- `config/database.config.ts`
- `config/microservices.config.ts`

## Step 6: Create Common Utilities

### Filters
- `common/filters/http-exception.filter.ts`

### Interceptors
- `common/interceptors/logging.interceptor.ts`

### Pipes
- `common/pipes/validation.pipe.ts`

### Index Files
- `common/index.ts`
- `core/index.ts`
- `config/index.ts`

## Step 7: Create Authentication Service

### User Schema
- `apps/authentication/src/users/schemas/user.schema.ts`

### DTOs and RTOs
- `apps/authentication/src/users/dto/create-user.dto.ts`
- `apps/authentication/src/users/dto/user.rto.ts`

### Repository, Service, Controller
- `apps/authentication/src/users/users.repository.ts`
- `apps/authentication/src/users/users.service.ts`
- `apps/authentication/src/users/users.controller.ts`

### Modules
- `apps/authentication/src/users/users.module.ts`
- `apps/authentication/src/authentication.module.ts`

### Main File
- `apps/authentication/src/main.ts`

## Step 8: Create Gateway Service

### DTOs
- `apps/gateway/src/auth/dto/register-user.dto.ts`
- `apps/gateway/src/auth/dto/user-response.dto.ts`

### Controllers and Modules
- `apps/gateway/src/auth/auth.controller.ts`
- `apps/gateway/src/auth/auth.module.ts`
- `apps/gateway/src/health/health.controller.ts`
- `apps/gateway/src/health/health.module.ts`

### Main Module and Bootstrap
- `apps/gateway/src/gateway.module.ts`
- `apps/gateway/src/main.ts`

## Step 9: Create Docker Configuration

### Dockerfiles
- `Dockerfile.gateway`
- `Dockerfile.authentication`

### Docker Compose
- `docker-compose.yml`
- `.dockerignore`

## Step 10: Create Tests

### Unit Tests
- `apps/authentication/src/users/users.service.spec.ts`
- `apps/gateway/src/auth/auth.controller.spec.ts`

### Test Configuration
- Update `package.json` with Jest configuration

## Step 11: Documentation

### Main Documentation
- `README.md` - Main project documentation
- `SETUP_GUIDE.md` - This file
- `postman-collection.json` - API testing collection

## Step 12: Verify Setup

```bash
# Install all dependencies
npm install

# Build the project
npm run build

# Start MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# Start authentication service
npm run start:auth

# In another terminal, start gateway
npm run start:gateway

# Test the endpoints
curl http://localhost:3000/health
curl http://localhost:3000/api/docs
```

## Quick Start with Docker

For the fastest setup, use Docker:

```bash
# Clone repository
git clone <your-repo>
cd nestjs-microservices-backend

# Start everything with Docker
docker-compose up -d

# Check logs
docker-compose logs -f

# Test API
curl http://localhost:3000/health
```

## Verification Checklist

- [ ] All dependencies installed
- [ ] Project builds successfully
- [ ] MongoDB is running
- [ ] Authentication service starts on port 3001
- [ ] Gateway starts on port 3000
- [ ] Swagger docs accessible at http://localhost:3000/api/docs
- [ ] Can register a new user
- [ ] Can retrieve all users
- [ ] Health checks return OK
- [ ] Tests pass

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process
lsof -i :3000
kill -9 <PID>
```

### MongoDB Connection Issues
```bash
# Check MongoDB is running
docker ps | grep mongodb

# View MongoDB logs
docker logs mongodb
```

### Build Errors
```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

### Module Resolution Issues
```bash
# Clear TypeScript cache
rm -rf dist
rm -rf node_modules/.cache

# Rebuild
npm run build
```

## Next Steps

1. **Add JWT Authentication**
   - Install `@nestjs/jwt` and `@nestjs/passport`
   - Implement login endpoint
   - Add JWT guards

2. **Add More Tests**
   - Write e2e tests
   - Increase code coverage
   - Add integration tests

3. **Deploy to Production**
   - Set up CI/CD pipeline
   - Configure production environment
   - Deploy to cloud provider

4. **Add More Features**
   - User profile updates
   - Password reset
   - Email verification
   - Role-based access control