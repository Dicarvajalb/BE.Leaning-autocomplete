import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import appConfig from 'src/config/app.config';
import authConfig from 'src/config/auth.config';
import frontendConfig from 'src/config/frontend.config';
import oauthConfig from 'src/config/oauth.config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleOAuthGateway } from '../adapters/google-oauth.gateway';
import { JwtTokenService } from '../adapters/jwt-token.service';
import { PrismaAuthRepository } from '../adapters/prisma-auth.repository';
import { CreateAuthRedirectUseCase } from '../use-cases/create-auth-redirect.use-case';
import { ExchangeAuthCodeForAccessTokenUseCase } from '../use-cases/exchange-auth-code-for-access-token.use-case';
import { IssueTokenForUserUseCase } from '../use-cases/issue-token-for-user.use-case';
import { LogoutUserUseCase } from '../use-cases/logout-user.use-case';
import { ValidateApplicationTokenUseCase } from '../use-cases/validate-application-token.use-case';
import {
  CREATE_AUTH_REDIRECT,
  EXCHANGE_AUTH_CODE_FOR_ACCESS_TOKEN,
  ISSUE_TOKEN_FOR_USER,
  LOGOUT_USER,
  VALIDATE_APPLICATION_TOKEN,
} from '../use-cases/tokens';
import {
  AUTH_REPOSITORY,
  CLOCK,
  GOOGLE_OAUTH_GATEWAY,
  ID_GENERATOR,
  TOKEN_SERVICE,
} from '../ports/auth.ports';
import { AuthController } from '../auth.controller';
import { SystemClockAdapter } from '../adapters/system-clock.adapter';
import { SystemIdGeneratorAdapter } from '../adapters/system-id-generator.adapter';

@Module({
  imports: [
    ConfigModule.forFeature(appConfig),
    ConfigModule.forFeature(frontendConfig),
    ConfigModule.forFeature(oauthConfig),
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(authConfig)],
      inject: [authConfig.KEY],
      useFactory: (config: ConfigType<typeof authConfig>) => ({
        privateKey: config.jwtPrivateKey,
        publicKey: config.jwtPublicKey,
        signOptions: { algorithm: 'RS256' },
      }),
    }),
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [
    PrismaAuthRepository,
    JwtTokenService,
    GoogleOAuthGateway,
    SystemClockAdapter,
    SystemIdGeneratorAdapter,
    {
      provide: AUTH_REPOSITORY,
      useExisting: PrismaAuthRepository,
    },
    {
      provide: TOKEN_SERVICE,
      useExisting: JwtTokenService,
    },
    {
      provide: GOOGLE_OAUTH_GATEWAY,
      useExisting: GoogleOAuthGateway,
    },
    {
      provide: CLOCK,
      useExisting: SystemClockAdapter,
    },
    {
      provide: ID_GENERATOR,
      useExisting: SystemIdGeneratorAdapter,
    },
    {
      provide: ISSUE_TOKEN_FOR_USER,
      inject: [AUTH_REPOSITORY, TOKEN_SERVICE, CLOCK, ID_GENERATOR, authConfig.KEY],
      useFactory: (
        authRepository: PrismaAuthRepository,
        tokenService: JwtTokenService,
        clock: SystemClockAdapter,
        idGenerator: SystemIdGeneratorAdapter,
        authConfiguration: ConfigType<typeof authConfig>,
      ) =>
        new IssueTokenForUserUseCase(
          authRepository,
          tokenService,
          authConfiguration.jwtIssuer,
          authConfiguration.jwtDurationMs,
          idGenerator,
          clock,
        ),
    },
    {
      provide: VALIDATE_APPLICATION_TOKEN,
      inject: [AUTH_REPOSITORY, TOKEN_SERVICE],
      useFactory: (
        authRepository: PrismaAuthRepository,
        tokenService: JwtTokenService,
      ) => new ValidateApplicationTokenUseCase(authRepository, tokenService),
    },
    {
      provide: LOGOUT_USER,
      inject: [AUTH_REPOSITORY],
      useFactory: (authRepository: PrismaAuthRepository) =>
        new LogoutUserUseCase(authRepository),
    },
    {
      provide: CREATE_AUTH_REDIRECT,
      inject: [GOOGLE_OAUTH_GATEWAY],
      useFactory: (googleOAuthGateway: GoogleOAuthGateway) =>
        new CreateAuthRedirectUseCase(googleOAuthGateway),
    },
    {
      provide: EXCHANGE_AUTH_CODE_FOR_ACCESS_TOKEN,
      inject: [AUTH_REPOSITORY, GOOGLE_OAUTH_GATEWAY, ISSUE_TOKEN_FOR_USER],
      useFactory: (
        authRepository: PrismaAuthRepository,
        googleOAuthGateway: GoogleOAuthGateway,
        issueTokenForUserUseCase: IssueTokenForUserUseCase,
      ) =>
        new ExchangeAuthCodeForAccessTokenUseCase(
          authRepository,
          googleOAuthGateway,
          issueTokenForUserUseCase,
        ),
    },
    {
      provide: AuthService,
      inject: [
        ISSUE_TOKEN_FOR_USER,
        VALIDATE_APPLICATION_TOKEN,
        LOGOUT_USER,
        CREATE_AUTH_REDIRECT,
        EXCHANGE_AUTH_CODE_FOR_ACCESS_TOKEN,
      ],
      useFactory: (
        issueTokenForUserUseCase: IssueTokenForUserUseCase,
        validateApplicationTokenUseCase: ValidateApplicationTokenUseCase,
        logoutUserUseCase: LogoutUserUseCase,
        createAuthRedirectUseCase: CreateAuthRedirectUseCase,
        exchangeAuthCodeForAccessTokenUseCase: ExchangeAuthCodeForAccessTokenUseCase,
      ) =>
        new AuthService(
          issueTokenForUserUseCase,
          validateApplicationTokenUseCase,
          logoutUserUseCase,
          createAuthRedirectUseCase,
          exchangeAuthCodeForAccessTokenUseCase,
        ),
    },
    JwtAuthGuard,
  ],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
