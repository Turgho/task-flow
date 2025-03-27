import { CanActivate, ExecutionContext, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(ctx);
    const token = this.extractToken(request);

    if (!token){
      this.logger.warn('No JWT token found in request');
      throw new UnauthorizedException({
        errorCode: 'MISSING_JWT_TOKEN',
        message: 'Missing authentication token',
      });
    }

    try {
      const payload = await this.jwtService.verifyAsync(
        token, {
          secret: process.env.JWT_SECRET,
        }
      );

      // Attach user payload to request
      request['email'] = payload;
      
      return true;

    } catch(error){
      this.logger.error(`JWT validation failed: ${error.message}`);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractToken(request: Request): string | undefined {
    return request.headers.authorization?.split(' ')[1]; // Bearer <token>
  }

  private getRequest(context: ExecutionContext): Request {
    return context.switchToHttp().getRequest();
  }
}