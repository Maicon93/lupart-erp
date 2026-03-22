import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from './Company';
import { Customer } from './Customer';
import { User } from './User';

export enum SaleStatus {
    FINALIZED = 'finalized',
    CANCELLED = 'cancelled',
}

export enum SalePaymentForm {
    CASH = 'cash',
    INSTALLMENT = 'installment',
}

@Entity('sales')
export class Sale {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer', name: 'company_id' })
    companyId: number;

    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @Column({ type: 'integer', name: 'customer_id' })
    customerId: number;

    @ManyToOne(() => Customer)
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;

    @Column({ type: 'date' })
    date: Date;

    @Column({ type: 'text', nullable: true })
    observation: string;

    @Column({ type: 'enum', enum: SaleStatus, default: SaleStatus.FINALIZED })
    status: SaleStatus;

    @Column({ type: 'enum', enum: SalePaymentForm, name: 'payment_form' })
    paymentForm: SalePaymentForm;

    @Column({ type: 'decimal', precision: 5, scale: 2, name: 'discount_percentage', default: 0 })
    discountPercentage: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'discount_value', default: 0 })
    discountValue: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'total_value' })
    totalValue: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'final_value' })
    finalValue: number;

    @Column({ type: 'text', name: 'cancellation_reason', nullable: true })
    cancellationReason: string;

    @Column({ type: 'integer', name: 'created_by' })
    createdBy: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'created_by' })
    creator: User;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
