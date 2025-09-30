export interface RefreshTokenProps {
  token: string;
  userId: string;
  refreshCount: number;
  createdAt?: Date;
  updatedAt?: Date;
  expiredAt?: Date | null;
}

export class RefreshTokenEntity {
  public readonly token: string;
  public readonly userId: string;
  public refreshCount: number;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
  public expiredAt?: Date | null;

  constructor(props: RefreshTokenProps) {
    this.token = props.token;
    this.userId = props.userId;
    this.refreshCount = props.refreshCount;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.expiredAt = props.expiredAt;
  }
}



