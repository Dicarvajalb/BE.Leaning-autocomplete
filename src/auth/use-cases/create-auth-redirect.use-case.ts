import type { GoogleOAuthGatewayPort } from '../ports/auth.ports';

type OAuthRedirect = {
  url: string;
  state: string;
};

export class CreateAuthRedirectUseCase {
  constructor(private readonly googleOAuthGateway: GoogleOAuthGatewayPort) {}

  async execute(): Promise<OAuthRedirect> {
    return this.googleOAuthGateway.createAuthRedirectUrl();
  }
}
