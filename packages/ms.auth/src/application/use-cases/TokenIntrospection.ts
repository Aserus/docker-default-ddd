import { verifyAccessToken } from '../../shared/jwt';

export class TokenIntrospectionUseCase {
  async execute(input: { authHeader: string | undefined | null }) {
    try {
      if (!input.authHeader) throw new Error('empty auth header')
      if (!input.authHeader.startsWith('Bearer ')) throw new Error('auth token is not Bearer')
      const accessToken = input.authHeader.split(' ')[1];
      if (!input.authHeader.startsWith('Bearer ')) throw new Error('Bearer token not found')
      verifyAccessToken(accessToken);
      return { active: true };
    } catch (e) {
      return { active: false }
    }
  }
}


