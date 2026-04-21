import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthApplicationError } from '../use-cases/errors';
import { CreateAuthRedirectUseCase } from '../use-cases/create-auth-redirect.use-case';
import {
  CREATE_AUTH_REDIRECT,
  EXCHANGE_AUTH_CODE_FOR_ACCESS_TOKEN,
  ISSUE_TOKEN_FOR_USER,
  LOGOUT_USER,
  VALIDATE_APPLICATION_TOKEN,
} from '../use-cases/tokens';
import { ExchangeAuthCodeForAccessTokenUseCase } from '../use-cases/exchange-auth-code-for-access-token.use-case';
import { IssueTokenForUserUseCase } from '../use-cases/issue-token-for-user.use-case';
import { LogoutUserUseCase } from '../use-cases/logout-user.use-case';
import { ValidateApplicationTokenUseCase } from '../use-cases/validate-application-token.use-case';

type AuthenticatedUser = {
  sub: string;
  email: string | null;
  iss: string;
  jti?: string;
  iat?: number;
  exp?: number;
  role: 'ADMIN' | 'USER';
};

type LoginResponse = {
  access_token: string;
};

type OAuthRedirect = {
  url: string;
  state: string;
};

type OAuthCallbackArgs = {
  code: string;
};

type OAuthCallbackResult = {
  access_token: string;
};

@Injectable()
export class AuthService {
  constructor(
    @Inject(ISSUE_TOKEN_FOR_USER)
    private readonly issueTokenForUserUseCase: IssueTokenForUserUseCase,
    @Inject(VALIDATE_APPLICATION_TOKEN)
    private readonly validateApplicationTokenUseCase: ValidateApplicationTokenUseCase,
    @Inject(LOGOUT_USER)
    private readonly logoutUserUseCase: LogoutUserUseCase,
    @Inject(CREATE_AUTH_REDIRECT)
    private readonly createAuthRedirectUseCase: CreateAuthRedirectUseCase,
    @Inject(EXCHANGE_AUTH_CODE_FOR_ACCESS_TOKEN)
    private readonly exchangeAuthCodeForAccessTokenUseCase: ExchangeAuthCodeForAccessTokenUseCase,
  ) {}

  async issueTokenForUser(userId: string): Promise<LoginResponse> {
    return this.mapAuthErrors(() => this.issueTokenForUserUseCase.execute(userId));
  }

  async validateApplicationToken(token: string): Promise<AuthenticatedUser> {
    return this.mapAuthErrors(() =>
      this.validateApplicationTokenUseCase.execute(token),
    );
  }

  async logout(userId: string): Promise<void> {
    return this.logoutUserUseCase.execute(userId);
  }

  async createAuthRedirectUrl(): Promise<OAuthRedirect> {
    return this.createAuthRedirectUseCase.execute();
  }

  async exchangeAuthCodeForAccessToken(
    args: OAuthCallbackArgs,
  ): Promise<OAuthCallbackResult> {
    return this.exchangeAuthCodeForAccessTokenUseCase.execute(args);
  }

  private async mapAuthErrors<T>(work: () => Promise<T>): Promise<T> {
    try {
      return await work();
    } catch (error) {
      if (error instanceof AuthApplicationError) {
        throw new UnauthorizedException(error.message);
      }

      throw error;
    }
  }
}
