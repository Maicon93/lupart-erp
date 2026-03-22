import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ServiceOrder } from './ServiceOrder';
import { Product } from './Product';

@Entity('service_order_items')
export class ServiceOrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer', name: 'service_order_id' })
    serviceOrderId: number;

    @ManyToOne(() => ServiceOrder)
    @JoinColumn({ name: 'service_order_id' })
    serviceOrder: ServiceOrder;

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
