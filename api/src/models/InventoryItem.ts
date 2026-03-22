import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Inventory } from './Inventory';
import { Product } from './Product';
import { User } from './User';

@Entity('inventory_items')
export class InventoryItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer', name: 'inventory_id' })
    inventoryId: number;

    @ManyToOne(() => Inventory)
    @JoinColumn({ name: 'inventory_id' })
    inventory: Inventory;

    @Column({ type: 'integer', name: 'product_id' })
    productId: number;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ type: 'decimal', precision: 10, scale: 3, name: 'system_quantity' })
    systemQuantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 3, name: 'counted_quantity', nullable: true })
    countedQuantity: number;

    @Column({ type: 'integer', name: 'counted_by', nullable: true })
    countedBy: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'counted_by' })
    counter: User;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
