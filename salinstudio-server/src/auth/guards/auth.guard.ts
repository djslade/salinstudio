import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ExpandedRequest } from '../types/expanded-request';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: ExpandedRequest = context.switchToHttp().getRequest();
    const token = this.authService.getBearerToken(request.headers);

    const user = await this.authService.validateAccessToken(token);
    request.user = user;

    return true;
  }
}
