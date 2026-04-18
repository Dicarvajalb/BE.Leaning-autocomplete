import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type {
  AuthenticatedUser,
  LoginResponseDTO,
  OAuthCallbackArgs,
  OAuthCallbackResult,
  OAuthRedirect,
} from '../domain/entities';
import { AuthApplicationError } from '../use-cases/errors';
import { CreateGoogleAuthRedirectUseCase } from '../use-cases/create-google-auth-redirect.use-case';
import {
  CREATE_GOOGLE_AUTH_REDIRECT,
  HANDLE_GOOGLE_CALLBACK,
  ISSUE_TOKEN_FOR_USER,
  LOGOUT_USER,
  VALIDATE_APPLICATION_TOKEN,
} from '../use-cases/tokens';
import { HandleGoogleCallbackUseCase } from '../use-cases/handle-google-callback.use-case';
import { IssueTokenForUserUseCase } from '../use-cases/issue-token-for-user.use-case';
import { LogoutUserUseCase } from '../use-cases/logout-user.use-case';
import { ValidateApplicationTokenUseCase } from '../use-cases/validate-application-token.use-case';

@Injectable()
export class AuthService {
  constructor(
    @Inject(ISSUE_TOKEN_FOR_USER)
    private readonly issueTokenForUserUseCase: IssueTokenForUserUseCase,
    @Inject(VALIDATE_APPLICATION_TOKEN)
    private readonly validateApplicationTokenUseCase: ValidateApplicationTokenUseCase,
    @Inject(LOGOUT_USER)
    private readonly logoutUserUseCase: LogoutUserUseCase,
    @Inject(CREATE_GOOGLE_AUTH_REDIRECT)
    private readonly createGoogleAuthRedirectUseCase: CreateGoogleAuthRedirectUseCase,
    @Inject(HANDLE_GOOGLE_CALLBACK)
    private readonly handleGoogleCallbackUseCase: HandleGoogleCallbackUseCase,
  ) {}

  async issueTokenForUser(userId: string): Promise<LoginResponseDTO> {
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
    return this.createGoogleAuthRedirectUseCase.execute();
  }

  async handleCallback(args: OAuthCallbackArgs): Promise<OAuthCallbackResult> {
    return this.handleGoogleCallbackUseCase.execute(args);
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
