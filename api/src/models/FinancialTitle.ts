import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from './Company';
import { Customer } from './Customer';
import { Supplier } from './Supplier';
import { PaymentType } from './PaymentType';
import { User } from './User';

@Entity('financial_titles')
export class FinancialTitle {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer', name: 'company_id' })
    companyId: number;

    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @Column({ type: 'integer', name: 'customer_id', nullable: true })
    customerId: number;

    @ManyToOne(() => Customer)
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;

    @Column({ type: 'integer', name: 'supplier_id', nullable: true })
    supplierId: number;

    @ManyToOne(() => Supplier)
    @JoinColumn({ name: 'supplier_id' })
    supplier: Supplier;

    @Column({ type: 'varchar' })
    type: string;

    @Column({ type: 'varchar' })
    origin: string;

    @Column({ type: 'integer', name: 'reference_id', nullable: true })
    referenceId: number;

    @Column({ type: 'integer', name: 'parent_id', nullable: true })
    parentId: number;

    @ManyToOne(() => FinancialTitle)
    @JoinColumn({ name: 'parent_id' })
    parent: FinancialTitle;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    value: number;

    @Column({ type: 'date', name: 'due_date' })
    dueDate: Date;

    @Column({ type: 'date', name: 'payment_date', nullable: true })
    paymentDate: Date;

    @Column({ type: 'integer', name: 'payment_type_id', nullable: true })
    paymentTypeId: number;

    @ManyToOne(() => PaymentType)
    @JoinColumn({ name: 'payment_type_id' })
    paymentType: PaymentType;

    @Column({ type: 'varchar', default: 'pendente' })
    status: string;

    @Column({ type: 'varchar', nullable: true })
    observation: string;

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
