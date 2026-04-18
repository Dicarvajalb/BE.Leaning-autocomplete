import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import type { AuthRepositoryPort } from '../ports/auth.ports';

type PrismaClientLike = PrismaService | Prisma.TransactionClient;

@Injectable()
export class PrismaAuthRepository implements AuthRepositoryPort {
  constructor(@Inject(PrismaService) private readonly client: PrismaClientLike) {}

  async findUserById(userId: string) {
    return this.client.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true },
    });
  }

  async findActiveSession(userId: string, accessTokenId: string) {
    return this.client.authSession.findFirst({
      where: {
        userId,
        accessTokenId,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      select: { id: true },
    });
  }

  async createSession(input: {
    userId: string;
    accessTokenId: string;
    expiresAt: Date;
  }) {
    await this.client.authSession.create({ data: input });
  }

  async revokeSessions(userId: string) {
    await this.client.authSession.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  async upsertUserByOAuthProfile(profile: {
    sub: string;
    email: string | null;
    displayName: string;
  }) {
    const user = await this.client.user.upsert({
      where: { oAuthSubject: profile.sub },
      update: {
        displayName: profile.displayName,
        ...(profile.email ? { email: profile.email } : {}),
      },
      create: {
        oAuthSubject: profile.sub,
        email: profile.email,
        displayName: profile.displayName,
        role: 'USER',
      },
      select: { id: true, email: true, role: true },
    });

    return user;
  }

  async transaction<T>(
    work: (repository: AuthRepositoryPort) => Promise<T>,
  ): Promise<T> {
    if (!('$transaction' in this.client)) {
      throw new Error('Transactions are only available from the root repository');
    }

    return this.client.$transaction(async (transactionClient: Prisma.TransactionClient) => {
      return work(new PrismaAuthRepository(transactionClient));
    });
  }
}
