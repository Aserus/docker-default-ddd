import { RefreshTokenEntity } from '../entities/RefreshToken';

export interface RefreshTokenRepository {
  create(userId: string, token: string, expiredAt: Date | null): Promise<RefreshTokenEntity>;
  findByToken(token: string): Promise<RefreshTokenEntity | null>;
  incrementRefreshCount(token: string): Promise<RefreshTokenEntity | null>;
  deleteByToken(token: string): Promise<void>;
  deleteAllForUser(userId: string): Promise<void>;
}



