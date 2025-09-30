export interface CredentialProps {
  userId: string;
  username: string;
  hash: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class CredentialEntity {
  public readonly userId: string;
  public username: string;
  public hash: string;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(props: CredentialProps) {
    this.userId = props.userId;
    this.username = props.username;
    this.hash = props.hash;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}



