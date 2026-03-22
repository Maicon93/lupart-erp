import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from './Company';
import { Product } from './Product';
import { User } from './User';

export enum ProductMovimentationType {
    ENTRY = 'entry',
    ADJUSTMENT = 'adjustment',
    INVENTORY = 'inventory',
    SALE = 'sale',
    SALE_RETURN = 'sale_return',
    SERVICE_ORDER = 'service_order',
}

@Entity('product_movimentations')
export class ProductMovimentation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer', name: 'company_id' })
    companyId: number;

    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @Column({ type: 'integer', name: 'product_id' })
    productId: number;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ type: 'enum', enum: ProductMovimentationType })
    type: ProductMovimentationType;

    @Column({ type: 'integer', name: 'reference_id' })
    referenceId: number;

    @Column({ type: 'decimal', precision: 10, scale: 3, name: 'previous_quantity' })
    previousQuantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 3, name: 'new_quantity' })
    newQuantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 3 })
    amount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    value: number;

    @Column({ type: 'integer', name: 'created_by' })
    createdBy: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'created_by' })
    creator: User;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
