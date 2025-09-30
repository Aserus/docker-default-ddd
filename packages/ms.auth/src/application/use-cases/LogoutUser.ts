import type { RefreshTokenRepository } from '../../domain/repositories/RefreshTokenRepository';

export class LogoutUserUseCase {
  private readonly refreshTokens: RefreshTokenRepository;
  
  constructor(refreshTokens: RefreshTokenRepository) {
    this.refreshTokens = refreshTokens;
  }

  async execute(input: { refreshToken?: string; userId?: string }) {
    if (input.refreshToken) {
      await this.refreshTokens.deleteByToken(input.refreshToken);
      return;
    }
    if (input.userId) {
      await this.refreshTokens.deleteAllForUser(input.userId);
    }
  }
}


