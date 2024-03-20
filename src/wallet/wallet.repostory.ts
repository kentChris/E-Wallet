import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from '../entity/wallet.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class WalletRepository {
    constructor(@InjectRepository(Wallet) private walletRepository: Repository<Wallet>) { }

    async getAllWallet(): Promise<Wallet[]> {
        return await this.walletRepository.find();
    }

    async getWithFilter(filter: object): Promise<Wallet> {
        return await this.walletRepository.findOne({where: filter});
    }

    async updateWallet(id: string ,wallet: Wallet) {
        return await this.walletRepository.update(id, wallet);
    }

    async deleteWallet(wallet: Wallet) {
        this.walletRepository.remove(wallet);
    }

    async createWallet(wallet: Wallet): Promise<Wallet> {
        return this.walletRepository.save(wallet);
    };

    async saveWithTransaction(entity: Wallet, entityManager: EntityManager): Promise<Wallet> {
        return await entityManager.save(entity);
    }
}
