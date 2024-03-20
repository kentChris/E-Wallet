import { Controller, Get } from '@nestjs/common';
import { CurrentWallet } from '../jwt/jwt.decorator';
import { TransactionFacade } from './transactions.facade';

@Controller('api/v1/wallet/transactions')
export class TransactionController {

    constructor(private facade: TransactionFacade) { }

    @Get()
    async getWalletTransactions(
        @CurrentWallet() wallet: any,
    ) {
        return await this.facade.getWalletTransactions(wallet);
    }
}
