import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { RegisterUserUseCase } from '../../application/use-cases/RegisterUser';
import { LoginUserUseCase } from '../../application/use-cases/LoginUser';
import { RefreshTokensUseCase } from '../../application/use-cases/RefreshTokens';
import { LogoutUserUseCase } from '../../application/use-cases/LogoutUser';
import { TokenIntrospectionUseCase } from '../../application/use-cases/TokenIntrospection';
import { PrismaCredentialRepository } from '../prisma/repositories/PrismaCredentialRepository';
import { PrismaRefreshTokenRepository } from '../prisma/repositories/PrismaRefreshTokenRepository';
import { AppError } from '../../shared/errors';

export async function authRoutes(app: FastifyInstance) {
  const credentialRepo = new PrismaCredentialRepository();
  const refreshRepo = new PrismaRefreshTokenRepository();

  app.get('/token-introspection', async (request, reply) => {
    const authHeader = request.headers.authorization
    const useCase = new TokenIntrospectionUseCase()
    try {
      const result = await useCase.execute({ authHeader });
      return reply.send(result);
    } catch (err) {
      if (err instanceof AppError) return reply.code(err.statusCode).send({ message: err.message });
      throw err;
    }
  })

  app.post('/register', async (request, reply) => {
    const schema = z.object({ username: z.string().min(3), password: z.string().min(6) });
    const { username, password } = schema.parse(request.body);
    const useCase = new RegisterUserUseCase(credentialRepo);
    try {
      const result = await useCase.execute({ username, password });
      return reply.code(201).send(result);
    } catch (err) {
      if (err instanceof AppError) return reply.code(err.statusCode).send({ message: err.message });
      throw err;
    }
  });

  app.post('/login', async (request, reply) => {
    const schema = z.object({ username: z.string(), password: z.string() });
    const { username, password } = schema.parse(request.body);
    const useCase = new LoginUserUseCase(credentialRepo, refreshRepo);
    try {
      const tokens = await useCase.execute({ username, password });
      return reply.send(tokens);
    } catch (err) {
      if (err instanceof AppError) return reply.code(err.statusCode).send({ message: err.message });
      throw err;
    }
  });

  app.post('/refresh', async (request, reply) => {
    const schema = z.object({ refreshToken: z.string() });
    const { refreshToken } = schema.parse(request.body);
    const useCase = new RefreshTokensUseCase(refreshRepo);
    try {
      const tokens = await useCase.execute({ refreshToken });
      return reply.send(tokens);
    } catch (err) {
      if (err instanceof AppError) return reply.code(err.statusCode).send({ message: err.message });
      throw err;
    }
  });

  app.post('/logout', async (request, reply) => {
    const schema = z.object({ refreshToken: z.string() });
    const { refreshToken } = schema.parse(request.body ?? {});
    try {
      const useCase = new LogoutUserUseCase(refreshRepo);
      await useCase.execute({ refreshToken });
      return reply.code(204).send();
    } catch (err) {
      if (err instanceof AppError) return reply.code(err.statusCode).send({ message: err.message });
      throw err;
    }
  });
}