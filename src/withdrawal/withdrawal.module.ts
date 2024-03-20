import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtTokenModule } from '../jwt/jwt.module';

import { Deposit } from '../entity/deposit.entity';
import { WalletModule } from '../wallet/wallet.module';
import { WithdrawalService } from './withdrawal.service';
import { WithdrawalRepository } from './withdrawal.repository';
import { WithdrawalController } from './withdrawal.controller';
import { Withdrawal } from '../entity/withdrawal.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Withdrawal]),
    JwtTokenModule,
    WalletModule,
  ],
  exports: [WithdrawalService, WithdrawalRepository],
  providers: [
    WithdrawalService,
    WithdrawalRepository,
  ],
  controllers: [WithdrawalController]
})
export class WithdrawalModule {}
