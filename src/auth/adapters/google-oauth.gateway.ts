import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { randomUUID } from 'node:crypto';
import oauthConfig from 'src/config/oauth.config';
import type { GoogleOAuthGatewayPort } from '../ports/auth.ports';

type GoogleTokenResponse = {
  access_token: string;
  expires_in: number;
  id_token: string;
  scope?: string;
  token_type?: string;
};

type GoogleUserInfo = {
  sub: string;
  email?: string;
  name?: string;
};

type GoogleIdTokenClaims = {
  sub?: string;
  email?: string;
  name?: string;
};

@Injectable()
export class GoogleOAuthGateway implements GoogleOAuthGatewayPort {
  private static readonly GOOGLE_AUTH_URL =
    'https://accounts.google.com/o/oauth2/v2/auth';
  private static readonly GOOGLE_TOKEN_URL =
    'https://oauth2.googleapis.com/token';
  private static readonly GOOGLE_USERINFO_URL =
    'https://www.googleapis.com/oauth2/v3/userinfo';

  constructor(
    @Inject(oauthConfig.KEY)
    private readonly oauthConfiguration: ConfigType<typeof oauthConfig>,
  ) {}

  async createAuthRedirectUrl() {
    const state = randomUUID();
    const params = new URLSearchParams({
      client_id: this.oauthConfiguration.googleClientId,
      redirect_uri: this.oauthConfiguration.googleCallbackUrl,
      response_type: 'code',
      scope: 'openid email profile',
      state,
      access_type: 'online',
      prompt: 'consent',
    });

    return {
      url: `${GoogleOAuthGateway.GOOGLE_AUTH_URL}?${params.toString()}`,
      state,
    };
  }

  async resolveProfileFromCode(code: string) {
    const tokenResponse = await this.exchangeCodeForTokens(code);
    const idClaims = await this.verifyGoogleIdToken(tokenResponse.id_token);
    const userInfo = await this.fetchUserInfo(tokenResponse.access_token);

    const sub = idClaims.sub ?? userInfo.sub;
    if (!sub) {
      throw new UnauthorizedException('Invalid Google identity');
    }

    const email = userInfo.email ?? idClaims.email ?? null;
    const displayName =
      userInfo.name ?? idClaims.name ?? email?.split('@')[0] ?? 'User';

    return {
      sub,
      email,
      displayName,
    };
  }

  private async exchangeCodeForTokens(code: string): Promise<GoogleTokenResponse> {
    const body = new URLSearchParams({
      code,
      client_id: this.oauthConfiguration.googleClientId,
      client_secret: this.oauthConfiguration.googleClientSecret,
      redirect_uri: this.oauthConfiguration.googleCallbackUrl,
      grant_type: 'authorization_code',
    });

    const response = await fetch(GoogleOAuthGateway.GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!response.ok) {
      throw new UnauthorizedException('Google token exchange failed');
    }

    const data = (await response.json()) as GoogleTokenResponse;
    if (!data?.access_token || !data?.id_token) {
      throw new UnauthorizedException('Google token exchange failed');
    }

    return data;
  }

  private async fetchUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    const response = await fetch(GoogleOAuthGateway.GOOGLE_USERINFO_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new UnauthorizedException('Google userinfo invalid');
    }

    const data = (await response.json()) as GoogleUserInfo;
    if (!data?.sub) {
      throw new UnauthorizedException('Google userinfo invalid');
    }

    return data;
  }

  private async verifyGoogleIdToken(
    idToken: string,
  ): Promise<GoogleIdTokenClaims> {
    const client = new OAuth2Client(this.oauthConfiguration.googleClientId);

    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: this.oauthConfiguration.googleClientId,
      });

      return (ticket.getPayload() ?? {}) as GoogleIdTokenClaims;
    } catch {
      throw new UnauthorizedException('Invalid Google ID token');
    }
  }
}
