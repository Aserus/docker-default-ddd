import type { CredentialRepository } from '../../../domain/repositories/CredentialRepository';

import { prisma } from '../../prisma/prismaClient';
import { CredentialEntity } from '../../../domain/entities/Credential';

export class PrismaCredentialRepository implements CredentialRepository {
  async findByUsername(username: string): Promise<CredentialEntity | null> {
    const row = await prisma.credential.findUnique({ where: { username } });
    if (!row) return null;
    return new CredentialEntity({
      userId: row.userId,
      username: row.username,
      hash: row.hash,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  async findByUserId(userId: string): Promise<CredentialEntity | null> {
    const row = await prisma.credential.findUnique({ where: { userId } });
    if (!row) return null;
    return new CredentialEntity({
      userId: row.userId,
      username: row.username,
      hash: row.hash,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  async create(username: string, hash: string): Promise<CredentialEntity> {
    const row = await prisma.credential.create({ data: { username, hash } });
    return new CredentialEntity({
      userId: row.userId,
      username: row.username,
      hash: row.hash,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}



