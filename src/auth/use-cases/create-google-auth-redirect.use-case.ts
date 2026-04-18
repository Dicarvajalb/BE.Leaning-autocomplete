import type { OAuthRedirect } from '../domain/entities';
import type { GoogleOAuthGatewayPort } from '../ports/auth.ports';

export class CreateGoogleAuthRedirectUseCase {
  constructor(private readonly googleOAuthGateway: GoogleOAuthGatewayPort) {}

  async execute(): Promise<OAuthRedirect> {
    return this.googleOAuthGateway.createAuthRedirectUrl();
  }
}
