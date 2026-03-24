import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Company } from './Company';
import { Customer } from './Customer';
import { PaymentType } from './PaymentType';
import { Sale } from './Sale';
import { User } from './User';

@Entity('quotes')
export class Quote {
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

    @Column({ type: 'date', name: 'validity_date' })
    validityDate: Date;

    @Column({ type: 'varchar', nullable: true })
    observation: string;

    @Column({ type: 'decimal', precision: 5, scale: 2, name: 'discount_percentage', default: 0 })
    discountPercentage: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'discount_value', default: 0 })
    discountValue: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'total_value' })
    totalValue: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'final_value' })
    finalValue: number;

    @Column({ type: 'integer', name: 'payment_type_id', nullable: true })
    paymentTypeId: number;

    @ManyToOne(() => PaymentType)
    @JoinColumn({ name: 'payment_type_id' })
    paymentType: PaymentType;

    @Column({ type: 'varchar', default: 'emitido' })
    status: string;

    @Column({ type: 'integer', name: 'sale_id', nullable: true })
    saleId: number;

    @ManyToOne(() => Sale)
    @JoinColumn({ name: 'sale_id' })
    sale: Sale;

    @Column({ type: 'integer', name: 'created_by' })
    createdBy: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'created_by' })
    creator: User;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;
}
