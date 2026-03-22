import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from './Company';

export enum PaymentTypeStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

@Entity('payment_types')
export class PaymentType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer', name: 'company_id' })
    companyId: number;

    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'text', nullable: true })
    observation: string;

    @Column({ type: 'enum', enum: PaymentTypeStatus, default: PaymentTypeStatus.ACTIVE })
    status: PaymentTypeStatus;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
