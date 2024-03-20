import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Deposit } from '../entity/deposit.entity';

@Injectable()
export class DepositRepository {
    constructor(@InjectRepository(Deposit) private depositRepository: Repository<Deposit>) { }

    async getAllDeposit(): Promise<Deposit[]> {
        return await this.depositRepository.find();
    }

    async getWithFilter(filter: object): Promise<Deposit> {
        return await this.depositRepository.findOne({where: filter});
    }

    async getAllWithFilter(filter: object): Promise<Deposit[]> {
        return await this.depositRepository.find({where: filter});
    }

    async updateWallet(id: string ,deposit: Deposit) {
        return await this.depositRepository.update(id, deposit);
    }

    async deleteWallet(deposit: Deposit) {
        return await this.depositRepository.remove(deposit);
    }

    async createWallet(deposit: Deposit): Promise<Deposit> {
        return await this.depositRepository.save(deposit);
    };

    async saveWithTransaction(entity: Deposit, entityManager: EntityManager): Promise<Deposit> {
        return await entityManager.save(entity);
      }
}
