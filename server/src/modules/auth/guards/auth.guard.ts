import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
  ) {
    super();
  }

  handleRequest(err, user, info, context) {
    const req = context.switchToHttp().getRequest();
    const accessToken = req.cookies[process.env.COOKIE_ACCESS_TOKEN_KEY];
    
    if (!accessToken) {
      throw new UnauthorizedException('Access-token cookie is required');
    }

    if (!user) {
      throw new UnauthorizedException('Unauthorized access');
    }

    if (new Date(user.exp * 1000) < new Date()) {
      throw new UnauthorizedException('Token is expired');
    }

    const requiredRoles = this.getRouteRoles(context);

    if (requiredRoles?.length && !requiredRoles.includes(user.role)) {
      throw new UnauthorizedException('Unauthorized');
    }

    return user;
  }

  private getRouteRoles(context: ExecutionContext): string[] {
    return this.reflector.get<string[]>('roles', context.getHandler()) || [];
  }
}

export default AuthGuard