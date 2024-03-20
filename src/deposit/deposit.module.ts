import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtTokenModule } from '../jwt/jwt.module';
import { DepositRepository } from './deposit.repository';
import { DepositService } from './deposit.service';
import { DepositController } from './deposit.controller';
import { Deposit } from '../entity/deposit.entity';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Deposit]),
    JwtTokenModule,
    WalletModule,
  ],
  exports: [DepositRepository, DepositService],
  providers: [
    DepositRepository,
    DepositService,
  ],
  controllers: [DepositController]
})
export class DepositModule {}
