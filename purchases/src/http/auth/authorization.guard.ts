import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as jwt from 'express-jwt';
import { expressJwtSecret } from 'jwks-rsa';
import { promisify } from 'node:util';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  private AUTH0_AUDIENCE: string;
  private AUTH0_DOMAIN: string;

  constructor(private readonly configService: ConfigService) {
    this.AUTH0_DOMAIN = this.configService.get('AUTH0_DOMAIN') ?? '';
    this.AUTH0_AUDIENCE = this.configService.get('AUTH0_AUDIENCE') ?? '';
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const http = context.switchToHttp();
    // const request = http.getRequest();
    // const response = http.getResponse();

    const { req, res } = GqlExecutionContext.create(context).getContext();

    const jwtCheck = promisify(
      jwt({
        secret: expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: `${this.AUTH0_DOMAIN}.well-known/jwks.json`,
        }),
        audience: this.AUTH0_AUDIENCE,
        issuer: this.AUTH0_DOMAIN,
        algorithms: ['RS256'],
      }),
    );

    try {
      await jwtCheck(req, res);
    } catch (err) {
      throw new UnauthorizedException(err);
    }

    return true;
  }
}
