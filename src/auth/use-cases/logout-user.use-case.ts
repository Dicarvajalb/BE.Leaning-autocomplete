import type { AuthRepositoryPort } from '../ports/auth.ports';

export class LogoutUserUseCase {
  constructor(private readonly authRepository: AuthRepositoryPort) {}

  async execute(userId: string): Promise<void> {
    await this.authRepository.revokeSessions(userId);
  }
}
