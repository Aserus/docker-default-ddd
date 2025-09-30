import type { CredentialRepository } from '../../domain/repositories/CredentialRepository';
import { ConflictError } from '../../shared/errors';
import { hashPassword } from '../../shared/password';

export class RegisterUserUseCase {
  private readonly credentials: CredentialRepository;

  constructor(credentials: CredentialRepository) {
    this.credentials = credentials;
  }

  async execute(input: { username: string; password: string }) {
    const existing = await this.credentials.findByUsername(input.username);
    if (existing) {
      throw new ConflictError('Username already exists');
    }
    const hash = await hashPassword(input.password);
    const cred = await this.credentials.create(input.username, hash);
    return { userId: cred.userId, username: cred.username };
  }
}


