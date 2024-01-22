
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class CustomJwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    // Add custom logic to check the user's role
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // You can modify this logic to suit your needs
    if (!user || user.role !== 'hospital' || user.role !== 'user') {
      throw new UnauthorizedException('You are not authorized to access this');
    }

    return true;
  }
}


