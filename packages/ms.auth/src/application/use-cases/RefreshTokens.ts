import type { RefreshTokenRepository } from '../../domain/repositories/RefreshTokenRepository';
import { verifyRefreshToken, signAccessToken, signRefreshToken } from '../../shared/jwt';
import { UnauthorizedError } from '../../shared/errors';

export class RefreshTokensUseCase {
  private readonly refreshTokens: RefreshTokenRepository;

  constructor(refreshTokens: RefreshTokenRepository) {
    this.refreshTokens = refreshTokens;
  }

  async execute(input: { refreshToken: string }) {
    const stored = await this.refreshTokens.findByToken(input.refreshToken);
    if (!stored) throw new UnauthorizedError('Invalid refresh token');

    try {
      const {userId} = verifyRefreshToken(input.refreshToken);
      await this.refreshTokens.incrementRefreshCount(input.refreshToken);
      const newAccess = signAccessToken({userId});

      return { accessToken: newAccess };
    } catch (e) {
      console.log(e)
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  }
}


