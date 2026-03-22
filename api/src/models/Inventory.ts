import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from './Company';
import { Category } from './Category';
import { StockAdjustment } from './StockAdjustment';
import { User } from './User';

export enum InventoryScope {
    ALL = 'all',
    CATEGORY = 'category',
}

export enum InventoryStatus {
    IN_PROGRESS = 'in_progress',
    FINALIZED = 'finalized',
}

@Entity('inventories')
export class Inventory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer', name: 'company_id' })
    companyId: number;

    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @Column({ type: 'enum', enum: InventoryScope })
    scope: InventoryScope;

    @Column({ type: 'integer', name: 'category_id', nullable: true })
    categoryId: number;

    @ManyToOne(() => Category)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column({ type: 'date' })
    date: Date;

    @Column({ type: 'text', nullable: true })
    observation: string;

    @Column({ type: 'enum', enum: InventoryStatus, default: InventoryStatus.IN_PROGRESS })
    status: InventoryStatus;

    @Column({ type: 'integer', name: 'adjustment_id', nullable: true })
    adjustmentId: number;

    @ManyToOne(() => StockAdjustment)
    @JoinColumn({ name: 'adjustment_id' })
    adjustment: StockAdjustment;

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
