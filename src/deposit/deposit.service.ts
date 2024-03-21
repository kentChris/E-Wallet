import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DepositRepository } from './deposit.repository';
import { Deposit, Deposit_Status_Enum } from '../entity/deposit.entity';
import { DepositRequestDto } from './dto/deposit.request.dto';
import { WalletService } from '../wallet/wallet.service';
import { Wallet, Wallet_Status_Enum } from '../entity/wallet.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class DepositService {
    constructor(
        private repository: DepositRepository,
        private walletService: WalletService,
        private entityManager: EntityManager,
    ) { }

    public async getWithFilter(filter) {
        return await this.repository.getWithFilter(filter);
    }

    public async getAllWithFilter(filter) {
        return await this.repository.getAllWithFilter(filter);
    }

    private async createDeposit(deposit: Deposit) {
        return await this.repository.createWallet(deposit);
    }

    private async updateDepositById(id: string,deposit: Deposit) {
        return await this.repository.updateWallet(id, deposit);
    };

    private async saveWithTransaction(entity: Deposit, entityManager: EntityManager): Promise<Deposit> {
        return await this.repository.saveWithTransaction(entity, entityManager);
    }

    public async addVirtualMoney(user: any, dto: DepositRequestDto) {
        const [wallet, deposit] = await Promise.all([
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
            throw new NotFoundException('Wallet disabled');
        };

        if(deposit) {
            throw new BadRequestException('RefrenceId must be unique');
        }

        const depositDto = new Deposit();
        depositDto.reference_id = dto.reference_id;
        depositDto.amount = dto.amount;
        depositDto.deposited_at = new Date();
        depositDto.deposited_by = user.customer_xid;
        depositDto.status = Deposit_Status_Enum.SUCCESS;

        wallet.balance = wallet.balance + dto.amount;

        await this.saveDepositUsingTransaction(wallet, depositDto);
        
        return {deposit: await this.getWithFilter({reference_id: dto.reference_id })};
    }

    private async saveDepositUsingTransaction(wallet: Wallet, deposit: Deposit) {
        try{
            await this.entityManager.transaction(async (entityManager) => {
                await this.saveWithTransaction(deposit, entityManager);
                await this.walletService.saveWithTransaction(wallet, entityManager);
            });
        }catch(e) {
            console.log(e);
            throw new InternalServerErrorException('Something wrong when submiting to db');
        }
    }
}   
