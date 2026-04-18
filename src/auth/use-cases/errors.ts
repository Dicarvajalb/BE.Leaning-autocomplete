export type AuthApplicationErrorCode =
  | 'INVALID_USER'
  | 'INVALID_TOKEN'
  | 'SESSION_INACTIVE';

export class AuthApplicationError extends Error {
  constructor(
    public readonly code: AuthApplicationErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'AuthApplicationError';
  }
}
