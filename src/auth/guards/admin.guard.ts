import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

type AuthenticatedUser = {
  sub: string;
  email: string | null;
  iss: string;
  jti?: string;
  iat?: number;
  exp?: number;
  role: 'ADMIN' | 'USER';
};

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser | undefined;
    return user?.role === 'ADMIN';
  }
}
