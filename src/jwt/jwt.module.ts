import { Module } from '@nestjs/common';
import { JwtTokenService } from './jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'dotenv';

config();
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [JwtTokenService],
  exports: [JwtTokenService],
})
export class JwtTokenModule {}
