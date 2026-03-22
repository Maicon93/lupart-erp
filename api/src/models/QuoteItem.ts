import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Quote } from './Quote';
import { Product } from './Product';

@Entity('quote_items')
export class QuoteItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer', name: 'quote_id' })
    quoteId: number;

    @ManyToOne(() => Quote)
    @JoinColumn({ name: 'quote_id' })
    quote: Quote;

    @Column({ type: 'integer', name: 'product_id' })
    productId: number;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ type: 'decimal', precision: 10, scale: 3 })
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'unit_price' })
    unitPrice: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    subtotal: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
