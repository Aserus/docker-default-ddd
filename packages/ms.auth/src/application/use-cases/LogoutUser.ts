import type { RefreshTokenRepository } from '../../domain/repositories/RefreshTokenRepository';
import { UnauthorizedError } from '../../shared/errors';

export class LogoutUserUseCase {
  private readonly refreshTokens: RefreshTokenRepository;
  
  constructor(refreshTokens: RefreshTokenRepository) {
    this.refreshTokens = refreshTokens;
  }

  async execute(input: { refreshToken: string; }) {
    const stored = await this.refreshTokens.findByToken(input.refreshToken);
    if (!stored) throw new UnauthorizedError('Invalid refresh token');

    await this.refreshTokens.deleteByToken(input.refreshToken);
    return;

  }
}


