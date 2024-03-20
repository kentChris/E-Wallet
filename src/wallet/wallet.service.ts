import { Injectable } from '@nestjs/common';
import { WalletRepository } from './wallet.repostory';
import { Wallet } from '../entity/wallet.entity';
import { EntityManager } from 'typeorm';



@Injectable()
export class WalletService {
    constructor(
        private repository: WalletRepository,
    ) { }

    public async getWithFilter(filter) {
        return await this.repository.getWithFilter(filter);
    }

    public async createWallet(wallet: Wallet) {
        return await this.repository.createWallet(wallet);
    }

    public async updateWalletById(id: string,wallet: Wallet) {
        return await this.repository.updateWallet(id, wallet);
    }

    public async saveWithTransaction(entity: Wallet, entityManager: EntityManager): Promise<Wallet> {
        return await this.repository.saveWithTransaction(entity, entityManager);
    };
}   
