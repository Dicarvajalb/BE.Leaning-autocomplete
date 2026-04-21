import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import authConfig from 'src/config/auth.config';
import type { TokenServicePort } from '../ports/auth.ports';

type TokenPayload = {
  sub: string;
  email: string | null;
  iss: string;
  jti?: string;
  iat?: number;
  exp?: number;
};

@Injectable()
export class JwtTokenService implements TokenServicePort {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
  ) {}

  async signAccessToken(payload: TokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async verifyAccessToken(token: string): Promise<TokenPayload> {
    try {
      return await this.jwtService.verifyAsync<TokenPayload>(token, {
        algorithms: ['RS256'],
        issuer: this.authConfiguration.jwtIssuer,
        publicKey: this.authConfiguration.jwtPublicKey || undefined,
      });
    } catch {
      throw new UnauthorizedException('Invalid authentication token');
    }
  }
}
