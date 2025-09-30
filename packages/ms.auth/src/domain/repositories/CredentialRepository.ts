import { CredentialEntity } from '../entities/Credential';

export interface CredentialRepository {
  findByUsername(username: string): Promise<CredentialEntity | null>;
  findByUserId(userId: string): Promise<CredentialEntity | null>;
  create(username: string, hash: string): Promise<CredentialEntity>;
}



