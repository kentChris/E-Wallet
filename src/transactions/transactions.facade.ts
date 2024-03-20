import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Wallet_Status_Enum } from '../entity/wallet.entity';
import { DepositService } from '../deposit/deposit.service';
import { WithdrawalService } from '../withdrawal/withdrawal.service';
import { Deposit, Deposit_Status_Enum } from '../entity/deposit.entity';
import { Withdrawal, Withdrawal_Status_Enum } from '../entity/withdrawal.entity';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class TransactionFacade {
    constructor(
        private service: WalletService,
        private depositService: DepositService,
        private withdrawalService: WithdrawalService,
    ) { }

    public async getWalletTransactions(user: any) {
        const wallet = await this.service.getWithFilter({
            id: user.id,
            owned_by: user.customer_xid,
            status: Wallet_Status_Enum.ENABLE,
        });

        if(!wallet) {
            throw new NotFoundException('Wallet disabled');
        };

        let [deposits, withdrawals] = await Promise.all([
            this.depositService.getAllWithFilter({
                deposited_by: user.customer_xid,
            }),
            this.withdrawalService.getAllWithFilter({
                withdrawn_by: user.customer_xid,
            })
        ]);

        deposits = deposits ? deposits : []; 
        withdrawals = withdrawals ? withdrawals : [];

        const [depostiResult, withdrawalResult] =  await Promise.all([
            this.setWalletTransactionResponse('deposit', deposits),
            this.setWalletTransactionResponse('withdrawal', withdrawals),
        ]);

        const finalResult = [...depostiResult, ...withdrawalResult];
        finalResult.sort((a,b)=> a.transacted_at - b.transacted_at);

        return finalResult;

    }

    private async setWalletTransactionResponse(type: string, entity: Deposit[] | Withdrawal[]) {
        let field_transacted_at;

        if(type === 'deposit') {
            field_transacted_at = 'deposited_at';
        } else if(type === 'withdrawal') {
            field_transacted_at = 'withdrawn_at';
        } else {
            throw new InternalServerErrorException("type can not be null");
        };

        const result = entity.map(data => {
            return {
                id: data.id,
                status: data.status,
                type: type,
                amount: data.amount,
                transacted_at: data[field_transacted_at],
                reference_id: data.reference_id,
            }
        })

        return result;
    }
}   
