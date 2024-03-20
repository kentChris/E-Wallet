import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

export enum Wallet_Status_Enum {
  DISABLE = 'disabled',
  ENABLE = 'enabled'
}

@Entity()
@Unique(['owned_by'])
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'double', default: 0})
  balance: number;

  @Column({ default: 'disabled' })
  status: string;

  @Column('uuid')
  owned_by: string;

  @Column({type: 'timestamp', nullable: true, default: null })
  enabled_at: Date;
}
