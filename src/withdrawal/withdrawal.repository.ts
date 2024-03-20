import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Withdrawal } from '../entity/withdrawal.entity';

@Injectable()
export class WithdrawalRepository {
    constructor(@InjectRepository(Withdrawal) private withdrwalRepo: Repository<Withdrawal>) { }

    async getAllWithdrawal(): Promise<Withdrawal[]> {
        return await this.withdrwalRepo.find();
    }

    async getWithFilter(filter: object): Promise<Withdrawal> {
        return await this.withdrwalRepo.findOne({where: filter});
    }

    async getAllWithFilter(filter: object): Promise<Withdrawal[]> {
        return await this.withdrwalRepo.find({where: filter});
    }

    async updateWithdrawal(id: string ,withdrawal: Withdrawal) {
        return await this.withdrwalRepo.update(id, withdrawal);
    }

    async deleteWithdrawal(withdrawal: Withdrawal) {
        this.withdrwalRepo.remove(withdrawal);
    }

    async createWithdrawal(withdrawal: Withdrawal): Promise<Withdrawal> {
        return this.withdrwalRepo.save(withdrawal);
    };

    async saveWithTransaction(entity: Withdrawal, entityManager: EntityManager): Promise<Withdrawal> {
        return await entityManager.save(entity);
      }
}
