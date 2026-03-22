import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './Product';

@Entity('product_images')
export class ProductImage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer', name: 'product_id' })
    productId: number;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ type: 'varchar' })
    url: string;

    @Column({ type: 'integer' })
    position: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
