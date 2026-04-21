import type { AuthRepositoryPort, TokenServicePort } from '../ports/auth.ports';
import { AuthApplicationError } from './errors';

type AuthenticatedUser = {
  sub: string;
  email: string | null;
  iss: string;
  jti?: string;
  iat?: number;
  exp?: number;
  role: 'ADMIN' | 'USER';
};

export class ValidateApplicationTokenUseCase {
  constructor(
    private readonly authRepository: AuthRepositoryPort,
    private readonly tokenService: TokenServicePort,
  ) {}

  async execute(token: string): Promise<AuthenticatedUser> {
    const payload = await this.tokenService.verifyAccessToken(token).catch(() => {
      throw new AuthApplicationError(
        'INVALID_TOKEN',
        'Invalid authentication token',
      );
    });

    if (!payload?.sub || !payload?.jti) {
      throw new AuthApplicationError(
        'INVALID_TOKEN',
        'Invalid authentication token',
      );
    }

    const activeSession = await this.authRepository.findActiveSession(
      payload.sub,
      payload.jti,
    );

    if (!activeSession) {
      throw new AuthApplicationError(
        'SESSION_INACTIVE',
        'Authentication session is no longer active',
      );
    }

    const user = await this.authRepository.findUserById(payload.sub);

    if (!user) {
      throw new AuthApplicationError(
        'INVALID_TOKEN',
        'Invalid authentication token',
      );
    }

    return {
      ...payload,
      role: user.role,
    };
  }
}
