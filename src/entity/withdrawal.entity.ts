import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

export enum Withdrawal_Status_Enum {
  SUCCESS = 'success',
  FAILED = 'failed'
}

@Entity()
@Unique(['reference_id'])
export class Withdrawal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'uuid', nullable: false})
  withdrawn_by: string;

  @Column({ type: 'varchar', length: 100,nullable: false })
  status: string;

  @Column({type: 'double', default: 0})
  amount: number;

  @Column({type: 'timestamp', nullable: true, default: null })
  withdrawn_at: Date;

  @Column({type: 'uuid', nullable: false})
  reference_id: string;
}
