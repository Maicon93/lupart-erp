import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { StockAdjustment } from './StockAdjustment';
import { Product } from './Product';

@Entity('stock_adjustment_items')
export class StockAdjustmentItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer', name: 'stock_adjustment_id' })
    stockAdjustmentId: number;

    @ManyToOne(() => StockAdjustment)
    @JoinColumn({ name: 'stock_adjustment_id' })
    stockAdjustment: StockAdjustment;

    @Column({ type: 'integer', name: 'product_id' })
    productId: number;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ type: 'decimal', precision: 10, scale: 3, name: 'previous_quantity' })
    previousQuantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 3, name: 'new_quantity' })
    newQuantity: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
