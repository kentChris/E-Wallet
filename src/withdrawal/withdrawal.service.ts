import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { WalletService } from '../wallet/wallet.service';
import { Wallet, Wallet_Status_Enum } from '../entity/wallet.entity';
import { WithdrawalRepository } from './withdrawal.repository';
import { Withdrawal, Withdrawal_Status_Enum } from '../entity/withdrawal.entity';
import { WithdrawalRequestDto } from './dto/withdrawal.request';
import { EntityManager } from 'typeorm';

@Injectable()
export class WithdrawalService {
    constructor(
        private repository: WithdrawalRepository,
        private walletService: WalletService,
        private entityManager: EntityManager,
    ) { }

    public async getWithFilter(filter) {
        return await this.repository.getWithFilter(filter);
    }

    public async getAllWithFilter(filter) {
        return await this.repository.getAllWithFilter(filter);
    }

    private async createDeposit(deposit: Withdrawal) {
        return await this.repository.createWithdrawal(deposit);
    }

    private async updateDepositById(id: string,deposit: Withdrawal) {
        return await this.repository.updateWithdrawal(id, deposit);
    };

    private async saveWithTransaction(entity: Withdrawal, entityManager: EntityManager): Promise<Withdrawal> {
        return await this.repository.saveWithTransaction(entity, entityManager);
    }

    public async withdrawVirtualMoney(user: any, dto: WithdrawalRequestDto) {
        const [wallet, withdrawal] = await Promise.all([
            this.walletService.getWithFilter({
                id: user.id,
                status: Wallet_Status_Enum.ENABLE,
                owned_by: user.customer_xid,
            }),
            this.getWithFilter({
                reference_id: dto.reference_id,
            })
        ]); 

        if(!wallet) {
            throw new NotFoundException('Wallet Disabled');
        };

        if(withdrawal) {
            throw new BadRequestException('Refrence id must be unique');
        }

        if(wallet.balance < dto.amount) {
            throw new BadRequestException('Balance not enough');
        };

        const withdrawalDto = new Withdrawal();
        withdrawalDto.amount = dto.amount;
        withdrawalDto.reference_id = dto.reference_id;
        withdrawalDto.status = Withdrawal_Status_Enum.SUCCESS;
        withdrawalDto.withdrawn_at = new Date();
        withdrawalDto.withdrawn_by = user.customer_xid;

        wallet.balance = wallet.balance - dto.amount;

        await this.saveWithdrawalUsingTransaction(wallet, withdrawalDto);

        return {withdrawal: await this.getWithFilter({reference_id: dto.reference_id})};
    };

    private async saveWithdrawalUsingTransaction(wallet: Wallet, withdrawal: Withdrawal) {
        try{
            await this.entityManager.transaction(async (entityManager) => {
                await this.saveWithTransaction(withdrawal, entityManager);
                await this.walletService.saveWithTransaction(wallet, entityManager);
            });
        }catch(e) {
            console.log(e);
            throw new InternalServerErrorException('Something wrong when submiting to db');
        }
    }


}   
