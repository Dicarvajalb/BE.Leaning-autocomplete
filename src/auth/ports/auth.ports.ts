import type { UserRole } from '../domain/entities';

export const AUTH_REPOSITORY = Symbol('AUTH_REPOSITORY');
export const TOKEN_SERVICE = Symbol('TOKEN_SERVICE');
export const GOOGLE_OAUTH_GATEWAY = Symbol('GOOGLE_OAUTH_GATEWAY');
export const CLOCK = Symbol('CLOCK');
export const ID_GENERATOR = Symbol('ID_GENERATOR');

export interface AuthRepositoryPort {
  findUserById(userId: string): Promise<{
    id: string;
    email: string | null;
    role: UserRole;
  } | null>;
  findActiveSession(
    userId: string,
    accessTokenId: string,
  ): Promise<{ id: string } | null>;
  createSession(input: {
    userId: string;
    accessTokenId: string;
    expiresAt: Date;
  }): Promise<void>;
  revokeSessions(userId: string): Promise<void>;
  upsertUserByOAuthProfile(profile: {
    sub: string;
    email: string | null;
    displayName: string;
  }): Promise<{
    id: string;
    email: string | null;
    role: UserRole;
  }>;
  transaction<T>(work: (repository: AuthRepositoryPort) => Promise<T>): Promise<T>;
}

export interface TokenServicePort {
  signAccessToken(payload: {
    sub: string;
    email: string | null;
    iss: string;
    jti?: string;
    iat?: number;
    exp?: number;
  }): Promise<string>;
  verifyAccessToken(token: string): Promise<{
    sub: string;
    email: string | null;
    iss: string;
    jti?: string;
    iat?: number;
    exp?: number;
  }>;
}

export interface GoogleOAuthGatewayPort {
  createAuthRedirectUrl(): Promise<{ url: string; state: string }>;
  resolveProfileFromCode(code: string): Promise<{
    sub: string;
    email: string | null;
    displayName: string;
  }>;
}

export interface ClockPort {
  now(): number;
}

export interface IdGeneratorPort {
  generate(): string;
}
