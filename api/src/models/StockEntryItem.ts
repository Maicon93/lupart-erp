import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { StockEntry } from './StockEntry';
import { Product } from './Product';

@Entity('stock_entry_items')
export class StockEntryItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer', name: 'stock_entry_id' })
    stockEntryId: number;

    @ManyToOne(() => StockEntry)
    @JoinColumn({ name: 'stock_entry_id' })
    stockEntry: StockEntry;

    @Column({ type: 'integer', name: 'product_id' })
    productId: number;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ type: 'decimal', precision: 10, scale: 3 })
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'unit_price', nullable: true })
    unitPrice: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    subtotal: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
