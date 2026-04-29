import { expect, test } from '@jest/globals';
import { ValidateApplicationTokenUseCase } from '../../../src/auth/use-cases/validate-application-token.use-case';
import type {
  AuthRepositoryPort,
  TokenServicePort,
} from '../../../src/auth/ports/auth.ports';

test('ValidateApplicationTokenUseCase validates payload and enriches role', async () => {
  const repository: AuthRepositoryPort = {
    findUserById: async () => ({
      id: 'user-1',
      email: 'user@example.com',
      role: 'ADMIN' as const,
    }),
    findActiveSession: async (userId: string, accessTokenId: string) => {
      expect(userId).toBe('user-1');
      expect(accessTokenId).toBe('token-1');
      return { id: 'session-1' };
    },
    createSession: async () => undefined,
    revokeSessions: async () => undefined,
    upsertUserByOAuthProfile: async () => ({
      id: 'user-1',
      email: 'user@example.com',
      role: 'ADMIN' as const,
    }),
    transaction: async <T>(
      work: (repository: AuthRepositoryPort) => Promise<T>,
    ) => work(repository),
  };
  const tokenService: TokenServicePort = {
    signAccessToken: async () => 'jwt-token',
    verifyAccessToken: async (token: string) => {
      expect(token).toBe('jwt');
      return {
        sub: 'user-1',
        email: 'user@example.com',
        iss: 'issuer',
        jti: 'token-1',
      };
    },
  };

  const useCase = new ValidateApplicationTokenUseCase(repository, tokenService);
  await expect(useCase.execute('jwt')).resolves.toEqual({
    sub: 'user-1',
    email: 'user@example.com',
    iss: 'issuer',
    jti: 'token-1',
    role: 'ADMIN',
  });
});

test('ValidateApplicationTokenUseCase maps token verification failures', async () => {
  const repository: AuthRepositoryPort = {
    findUserById: async () => null,
    findActiveSession: async () => null,
    createSession: async () => undefined,
    revokeSessions: async () => undefined,
    upsertUserByOAuthProfile: async () => ({
      id: 'user-1',
      email: null,
      role: 'USER' as const,
    }),
    transaction: async <T>(
      work: (repository: AuthRepositoryPort) => Promise<T>,
    ) => work(repository),
  };
  const tokenService: TokenServicePort = {
    signAccessToken: async () => 'jwt-token',
    verifyAccessToken: async () => {
      throw new Error('bad token');
    },
  };

  const useCase = new ValidateApplicationTokenUseCase(repository, tokenService);

  await expect(useCase.execute('jwt')).rejects.toMatchObject({
    code: 'INVALID_TOKEN',
  });
});

test('ValidateApplicationTokenUseCase rejects missing token claims', async () => {
  const repository: AuthRepositoryPort = {
    findUserById: async () => null,
    findActiveSession: async () => null,
    createSession: async () => undefined,
    revokeSessions: async () => undefined,
    upsertUserByOAuthProfile: async () => ({
      id: 'user-1',
      email: null,
      role: 'USER' as const,
    }),
    transaction: async <T>(
      work: (repository: AuthRepositoryPort) => Promise<T>,
    ) => work(repository),
  };
  const tokenService: TokenServicePort = {
    signAccessToken: async () => 'jwt-token',
    verifyAccessToken: async () => ({
      sub: 'user-1',
      email: 'user@example.com',
      iss: 'issuer',
    }),
  };

  const useCase = new ValidateApplicationTokenUseCase(repository, tokenService);

  await expect(useCase.execute('jwt')).rejects.toMatchObject({
    code: 'INVALID_TOKEN',
  });
});

test('ValidateApplicationTokenUseCase rejects inactive sessions', async () => {
  const repository: AuthRepositoryPort = {
    findUserById: async () => ({
      id: 'user-1',
      email: 'user@example.com',
      role: 'USER' as const,
    }),
    findActiveSession: async () => null,
    createSession: async () => undefined,
    revokeSessions: async () => undefined,
    upsertUserByOAuthProfile: async () => ({
      id: 'user-1',
      email: 'user@example.com',
      role: 'USER' as const,
    }),
    transaction: async <T>(
      work: (repository: AuthRepositoryPort) => Promise<T>,
    ) => work(repository),
  };
  const tokenService: TokenServicePort = {
    signAccessToken: async () => 'jwt-token',
    verifyAccessToken: async () => ({
      sub: 'user-1',
      email: 'user@example.com',
      iss: 'issuer',
      jti: 'token-1',
    }),
  };

  const useCase = new ValidateApplicationTokenUseCase(repository, tokenService);

  await expect(useCase.execute('jwt')).rejects.toMatchObject({
    code: 'SESSION_INACTIVE',
  });
});

test('ValidateApplicationTokenUseCase rejects unknown users', async () => {
  const repository: AuthRepositoryPort = {
    findUserById: async () => null,
    findActiveSession: async () => ({ id: 'session-1' }),
    createSession: async () => undefined,
    revokeSessions: async () => undefined,
    upsertUserByOAuthProfile: async () => ({
      id: 'user-1',
      email: null,
      role: 'USER' as const,
    }),
    transaction: async <T>(
      work: (repository: AuthRepositoryPort) => Promise<T>,
    ) => work(repository),
  };
  const tokenService: TokenServicePort = {
    signAccessToken: async () => 'jwt-token',
    verifyAccessToken: async () => ({
      sub: 'user-1',
      email: 'user@example.com',
      iss: 'issuer',
      jti: 'token-1',
    }),
  };

  const useCase = new ValidateApplicationTokenUseCase(repository, tokenService);

  await expect(useCase.execute('jwt')).rejects.toMatchObject({
    code: 'INVALID_TOKEN',
  });
});
