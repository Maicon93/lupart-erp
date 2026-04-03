import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Company } from './Company';
import { Supplier } from './Supplier';
import { StockEntryItem } from './StockEntryItem';
import { User } from './User';

@Entity('stock_entries')
export class StockEntry {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer', name: 'company_id' })
    companyId: number;

    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @Column({ type: 'integer', name: 'supplier_id', nullable: true })
    supplierId: number;

    @ManyToOne(() => Supplier)
    @JoinColumn({ name: 'supplier_id' })
    supplier: Supplier;

    @Column({ type: 'varchar', name: 'invoice_number', nullable: true })
    invoiceNumber: string;

    @Column({ type: 'text', nullable: true })
    observation: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'total_value', nullable: true })
    totalValue: number;

    @Column({ type: 'integer', name: 'created_by' })
    createdBy: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'created_by' })
    creator: User;

    @OneToMany(() => StockEntryItem, (item) => item.stockEntry)
    items: StockEntryItem[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
