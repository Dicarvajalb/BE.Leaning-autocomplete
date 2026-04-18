import type {
  AuthUserProfile,
  LoginResponseDTO,
  OAuthCallbackArgs,
  OAuthRedirect,
  TokenPayload,
} from '../domain/entities';

export const AUTH_REPOSITORY = Symbol('AUTH_REPOSITORY');
export const TOKEN_SERVICE = Symbol('TOKEN_SERVICE');
export const GOOGLE_OAUTH_GATEWAY = Symbol('GOOGLE_OAUTH_GATEWAY');
export const CLOCK = Symbol('CLOCK');
export const ID_GENERATOR = Symbol('ID_GENERATOR');

export interface AuthRepositoryPort {
  findUserById(userId: string): Promise<AuthUserProfile | null>;
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
  }): Promise<AuthUserProfile>;
  transaction<T>(work: (repository: AuthRepositoryPort) => Promise<T>): Promise<T>;
}

export interface TokenServicePort {
  signAccessToken(payload: TokenPayload): Promise<string>;
  verifyAccessToken(token: string): Promise<TokenPayload>;
}

export interface GoogleOAuthGatewayPort {
  createAuthRedirectUrl(): Promise<OAuthRedirect>;
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

export type AuthTokenResult = LoginResponseDTO;
export type GoogleCallbackArgs = OAuthCallbackArgs;
