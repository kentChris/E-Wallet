import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtTokenService } from './jwt.service';
import { JwtService } from '@nestjs/jwt';

export const CurrentWallet = createParamDecorator((data: unknown, context: ExecutionContext) => {

  const request = context.switchToHttp().getRequest();
  const token = request.headers.authorization?.replace('Token ', '');

  if(!token) {
    throw new UnauthorizedException('Unauthorize Invalid or expired token');
  }

  try {
    const service = new JwtService();
    const jwtService = new JwtTokenService(service);
    const payload = jwtService.verifyToken(token);
    request.user = payload;

  } catch (error) {
    throw new UnauthorizedException('Unauthorize Invalid or expired token');
  }
  return request.user;
});
