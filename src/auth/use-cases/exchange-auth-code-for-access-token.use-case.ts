import type { AuthRepositoryPort, GoogleOAuthGatewayPort } from '../ports/auth.ports';
import { IssueTokenForUserUseCase } from './issue-token-for-user.use-case';

type OAuthCallbackArgs = {
  code: string;
};

type OAuthCallbackResult = {
  access_token: string;
};

export class ExchangeAuthCodeForAccessTokenUseCase {
  constructor(
    private readonly authRepository: AuthRepositoryPort,
    private readonly googleOAuthGateway: GoogleOAuthGatewayPort,
    private readonly issueTokenForUserUseCase: IssueTokenForUserUseCase,
  ) {}

  async execute(args: OAuthCallbackArgs): Promise<OAuthCallbackResult> {
    const profile = await this.googleOAuthGateway.resolveProfileFromCode(
      args.code,
    );

    return this.authRepository.transaction(async (repository) => {
      const user = await repository.upsertUserByOAuthProfile(profile);
      return this.issueTokenForUserUseCase.execute(user.id, repository);
    });
  }
}
