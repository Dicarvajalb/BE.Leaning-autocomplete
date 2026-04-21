import { expect, test } from '@jest/globals';
import { ExchangeAuthCodeForAccessTokenUseCase } from '../../../src/auth/use-cases/exchange-auth-code-for-access-token.use-case';
import { IssueTokenForUserUseCase } from '../../../src/auth/use-cases/issue-token-for-user.use-case';
import type {
  AuthRepositoryPort,
  GoogleOAuthGatewayPort,
} from '../../../src/auth/ports/auth.ports';

test('ExchangeAuthCodeForAccessTokenUseCase resolves profile and issues token inside a transaction', async () => {
  const user = {
    id: 'user-2',
    email: 'user@example.com',
    role: 'USER' as const,
  };
  let transactionRepositoryUsed: AuthRepositoryPort | null = null;
  const repository: AuthRepositoryPort = {
    findUserById: async () => user,
    findActiveSession: async () => ({ id: 'session-1' }),
    createSession: async () => undefined,
    revokeSessions: async () => undefined,
    upsertUserByOAuthProfile: async () => user,
    transaction: async <T>(
      work: (repository: AuthRepositoryPort) => Promise<T>,
    ) => {
      const transactionRepository: AuthRepositoryPort = {
        findUserById: async () => user,
        findActiveSession: async () => ({ id: 'session-1' }),
        createSession: async () => undefined,
        revokeSessions: async () => undefined,
        upsertUserByOAuthProfile: async (profile) => {
          expect(profile).toEqual({
            sub: 'provider-sub',
            email: 'user@example.com',
            displayName: 'Ada Lovelace',
          });
          return user;
        },
        transaction: async () => {
          throw new Error('nested transaction not expected');
        },
      };

      transactionRepositoryUsed = transactionRepository;
      return work(transactionRepository);
    },
  };
  const gateway: GoogleOAuthGatewayPort = {
    createAuthRedirectUrl: async () => ({
      url: 'https://example.com/oauth',
      state: 'state-123',
    }),
    resolveProfileFromCode: async (code) => {
      expect(code).toBe('auth-code');
      return {
        sub: 'provider-sub',
        email: 'user@example.com',
        displayName: 'Ada Lovelace',
      };
    },
  };
  const issueTokenUseCase = {
    execute: async (userId: string, repositoryArg: AuthRepositoryPort) => {
      expect(userId).toBe('user-2');
      expect(repositoryArg).toBe(transactionRepositoryUsed);
      return { access_token: 'issued-token' };
    },
  } as unknown as IssueTokenForUserUseCase;

  const useCase = new ExchangeAuthCodeForAccessTokenUseCase(
    repository,
    gateway,
    issueTokenUseCase,
  );

  await expect(useCase.execute({ code: 'auth-code' })).resolves.toEqual({
    access_token: 'issued-token',
  });
});
