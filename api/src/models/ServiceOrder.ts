import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from './Company';
import { Customer } from './Customer';
import { User } from './User';

@Entity('service_orders')
export class ServiceOrder {
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

    @Column({ type: 'varchar', nullable: true })
    observation: string;

    @Column({ type: 'timestamp', name: 'date_started', nullable: true })
    dateStarted: Date;

    @Column({ type: 'timestamp', name: 'date_finished', nullable: true })
    dateFinished: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'total_value', default: 0 })
    totalValue: number;

    @Column({ type: 'decimal', precision: 5, scale: 2, name: 'discount_percentage', default: 0 })
    discountPercentage: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'discount_value', default: 0 })
    discountValue: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'final_value', nullable: true })
    finalValue: number;

    @Column({ type: 'varchar', name: 'payment_form', nullable: true })
    paymentForm: string;

    @Column({ type: 'varchar', default: 'aberta' })
    status: string;

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
