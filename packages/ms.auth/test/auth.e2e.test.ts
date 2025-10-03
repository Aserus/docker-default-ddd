import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildApp } from '../src/infrastructure/http/server';
import { prisma } from '../src/infrastructure/prisma/prismaClient';

const TEST_USER = { 
    username: `user_${Math.random().toString(36).slice(2, 8)}`, 
    password: 'password123'
};

describe('Auth E2E', () => {
  const app = buildApp();
  let accessToken:string | undefined;
  let refreshToken:string | undefined;

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    // Cleanup DB data
    await prisma.refreshToken.deleteMany({ where: { user: { username: TEST_USER.username } } });
    await prisma.credential.deleteMany({ where: { username: TEST_USER.username } });
    await app.close();
    await prisma.$disconnect();
  });

  it('should register', async () => {
    const reg = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: TEST_USER,
    });
    expect(reg.statusCode).toBe(201);
  });

  it('should login', async () => {
    const login = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: TEST_USER,
    });
    expect(login.statusCode).toBe(200);
    const loginResult = login.json() as { accessToken: string; refreshToken: string };
    accessToken = loginResult.accessToken
    refreshToken = loginResult.refreshToken
    expect(accessToken).toBeTruthy();
    expect(refreshToken).toBeTruthy();
  });

  it('should login | no exists user', async () => {
    const login = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        username: `no_exists_user_${Math.random().toString(36).slice(2, 8)}`, 
        password: 'wrong_password'
      },
    });
    expect(login.statusCode).toBe(401);
  });

  it('should login | error password', async () => {
    const login = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        username: TEST_USER.username,
        password: 'wrong_password'
      },
    });
    expect(login.statusCode).toBe(401);
  });

  it('should refresh', async () => {
    const refresh = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/refresh',
      payload: { refreshToken },
    });
    expect(refresh.statusCode).toBe(200);
    const refreshed = refresh.json() as { accessToken: string; };
    expect(refreshed.accessToken).toBeTruthy();
  });

  it('should refresh | empty refresh token', async () => {
    const refresh = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/refresh',
      payload: { },
    });
    expect(refresh.statusCode).toBe(400);
  });

  it('should refresh | wrong refresh token', async () => {
    const wrongToken = Math.random().toString(36).slice(2, 8)
    const refresh = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/refresh',
      payload: { refreshToken: wrongToken },
    });
    expect(refresh.statusCode).toBe(401);
  });

  it('should introspection token', async () => {
    const introspection = await app.inject({
      method: 'GET',
      url: '/api/v1/auth/token-introspection',
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    expect(introspection.statusCode).toBe(200);
    expect(introspection.json()).toEqual({ active: true });
  });

  it('should introspection token wrong access token', async () => {
    const wrongToken = Math.random().toString(36).slice(2, 8)
    const introspection = await app.inject({
      method: 'GET',
      url: '/api/v1/auth/token-introspection',
      headers: {
        authorization: `Bearer ${wrongToken}`,
      },
    });

    expect(introspection.statusCode).toBe(200);
    expect(introspection.json()).toEqual({ active: false });
  });
  it('should introspection token empty access token', async () => {
    const introspection = await app.inject({
      method: 'GET',
      url: '/api/v1/auth/token-introspection',
    });

    expect(introspection.statusCode).toBe(200);
    expect(introspection.json()).toEqual({ active: false });
  });

  it('should logout', async () => {
    const logout = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/logout',
      payload: { refreshToken },
    });
    expect(logout.statusCode).toBe(204);
  });
});


