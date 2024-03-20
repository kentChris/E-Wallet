import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { WalletRepository } from './wallet.repostory';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from '../entity/wallet.entity';
import { JwtTokenModule } from '../jwt/jwt.module';
import { WalletFacade } from './wallet.facade';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet]),
    JwtTokenModule,
  ],
  exports: [WalletFacade, WalletService, WalletRepository],
  providers: [
    WalletFacade,
    WalletService,
    WalletRepository,
  ],
  controllers: [WalletController]
})
export class WalletModule {}
