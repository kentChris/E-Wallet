import { Module } from '@nestjs/common';
import { JwtTokenModule } from '../jwt/jwt.module';
import { TransactionFacade } from './transactions.facade';
import { TransactionController } from './transactions.controller';
import { WalletModule } from '../wallet/wallet.module';
import { DepositModule } from '../deposit/deposit.module';
import { WithdrawalModule } from '../withdrawal/withdrawal.module';

@Module({
  imports: [
    JwtTokenModule,
    WalletModule,
    DepositModule,
    WithdrawalModule
  ],
  exports: [TransactionFacade],
  providers: [
    TransactionFacade
  ],
  controllers: [TransactionController]
})
export class TransactionModule {}
