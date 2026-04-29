import { expect, test } from '@jest/globals';
import { IssueTokenForUserUseCase } from '../../../src/auth/use-cases/issue-token-for-user.use-case';
import type {
  AuthRepositoryPort,
  TokenServicePort,
} from '../../../src/auth/ports/auth.ports';

test('IssueTokenForUserUseCase issues token and creates session', async () => {
  const now = 1_700_000_000_000;
  const user = {
    id: 'user-1',
    email: 'user@example.com',
    role: 'USER' as const,
  };
  const repository: AuthRepositoryPort = {
    findUserById: async () => user,
    findActiveSession: async () => ({ id: 'session-1' }),
    createSession: async () => undefined,
    revokeSessions: async () => undefined,
    upsertUserByOAuthProfile: async () => user,
    transaction: async <T>(
      work: (repository: AuthRepositoryPort) => Promise<T>,
    ) => work(repository),
  };
  const tokenService: TokenServicePort = {
    signAccessToken: async (payload) => {
      expect(payload).toEqual({
        sub: 'user-1',
        email: 'user@example.com',
        iss: 'issuer',
        jti: 'token-1',
      });
      return 'jwt-token';
    },
    verifyAccessToken: async () => ({
      sub: 'user-1',
      email: 'user@example.com',
      iss: 'issuer',
      jti: 'token-1',
    }),
  };

  const useCase = new IssueTokenForUserUseCase(
    repository,
    tokenService,
    'issuer',
    5_000,
    { generate: () => 'token-1' },
    { now: () => now },
  );

  await expect(useCase.execute('user-1')).resolves.toEqual({
    access_token: 'jwt-token',
  });
});

test('IssueTokenForUserUseCase rejects invalid users', async () => {
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

  const useCase = new IssueTokenForUserUseCase(
    repository,
    tokenService,
    'issuer',
    5_000,
    { generate: () => 'token-1' },
    { now: () => 1_700_000_000_000 },
  );

  await expect(useCase.execute('missing-user')).rejects.toMatchObject({
    code: 'INVALID_USER',
    message: 'Invalid user',
  });
});
