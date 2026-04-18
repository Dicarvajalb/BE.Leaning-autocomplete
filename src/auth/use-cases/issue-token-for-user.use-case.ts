import { AuthApplicationError } from './errors';
import type { TokenPayload, LoginResponseDTO } from '../domain/entities';
import type {
  AuthRepositoryPort,
  ClockPort,
  IdGeneratorPort,
  TokenServicePort,
} from '../ports/auth.ports';

export class IssueTokenForUserUseCase {
  constructor(
    private readonly authRepository: AuthRepositoryPort,
    private readonly tokenService: TokenServicePort,
    private readonly jwtIssuer: string,
    private readonly jwtDurationMs: number,
    private readonly idGenerator: IdGeneratorPort,
    private readonly clock: ClockPort,
  ) {}

  async execute(
    userId: string,
    repository: AuthRepositoryPort = this.authRepository,
  ): Promise<LoginResponseDTO> {
    const user = await repository.findUserById(userId);

    if (!user) {
      throw new AuthApplicationError('INVALID_USER', 'Invalid user');
    }

    const accessTokenId = this.idGenerator.generate();
    const accessToken = await this.tokenService.signAccessToken(
      this.buildTokenPayload(user.id, user.email, accessTokenId),
    );

    await repository.createSession({
      userId: user.id,
      accessTokenId,
      expiresAt: new Date(this.clock.now() + this.jwtDurationMs),
    });

    return {
      access_token: accessToken,
    };
  }

  private buildTokenPayload(
    sub: string,
    email: string | null,
    jti: string,
  ): TokenPayload {
    return {
      sub,
      email,
      iss: this.jwtIssuer,
      jti,
    };
  }
}
