import type { RefreshTokenRepository } from '../../../domain/repositories/RefreshTokenRepository';

import { prisma } from '../../prisma/prismaClient';
import { RefreshTokenEntity } from '../../../domain/entities/RefreshToken';

export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
  async create(userId: string, token: string, expiredAt: Date | null): Promise<RefreshTokenEntity> {
    const row = await prisma.refreshToken.create({
      data: { token, userId, expiredAt: expiredAt ?? null },
    });
    return new RefreshTokenEntity({
      token: row.token,
      userId: row.userId,
      refreshCount: row.refreshCount,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      expiredAt: row.expiredAt,
    });
  }

  async findByToken(token: string): Promise<RefreshTokenEntity | null> {
    const row = await prisma.refreshToken.findUnique({ where: { token } });
    if (!row) return null;
    return new RefreshTokenEntity({
      token: row.token,
      userId: row.userId,
      refreshCount: row.refreshCount,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      expiredAt: row.expiredAt,
    });
  }

  async incrementRefreshCount(token: string): Promise<RefreshTokenEntity | null> {
    const row = await prisma.refreshToken.update({
      where: { token },
      data: { refreshCount: { increment: 1 } },
    });
    return new RefreshTokenEntity({
      token: row.token,
      userId: row.userId,
      refreshCount: row.refreshCount,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      expiredAt: row.expiredAt,
    });
  }

  async deleteByToken(token: string): Promise<void> {
    await prisma.refreshToken.delete({ where: { token } });
  }

  async deleteAllForUser(userId: string): Promise<void> {
    await prisma.refreshToken.deleteMany({ where: { userId } });
  }
}



