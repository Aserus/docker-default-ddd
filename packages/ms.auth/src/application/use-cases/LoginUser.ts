import type { CredentialRepository } from '../../domain/repositories/CredentialRepository';
import type { RefreshTokenRepository } from '../../domain/repositories/RefreshTokenRepository';
import { UnauthorizedError } from '../../shared/errors';
import { verifyPassword } from '../../shared/password';
import { signAccessToken, signRefreshToken } from '../../shared/jwt';

export class LoginUserUseCase {
  private readonly credentials: CredentialRepository;
  private readonly refreshTokens: RefreshTokenRepository;
  
  constructor(
    credentials: CredentialRepository,
    refreshTokens: RefreshTokenRepository,
  ) {
    this.credentials = credentials;
    this.refreshTokens = refreshTokens;
  }

  async execute(input: { username: string; password: string }) {
    const cred = await this.credentials.findByUsername(input.username);
    if (!cred) throw new UnauthorizedError('Invalid credentials');

    const ok = await verifyPassword(input.password, cred.hash);
    if (!ok) throw new UnauthorizedError('Invalid credentials');

    const payload = { userId: cred.userId };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await this.refreshTokens.create(cred.userId, refreshToken, null);

    return { accessToken, refreshToken };
  }
}


