import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from './Company';
import { Category } from './Category';
import { MeasurementUnit } from './MeasurementUnit';

export enum ProductType {
    PRODUCT = 'product',
    SERVICE = 'service',
}

export enum ProductStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer', name: 'company_id' })
    companyId: number;

    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @Column({ type: 'enum', enum: ProductType })
    type: ProductType;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'varchar', nullable: true })
    code: string;

    @Column({ type: 'varchar', nullable: true })
    barcode: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'integer', name: 'category_id' })
    categoryId: number;

    @ManyToOne(() => Category)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column({ type: 'integer', name: 'measurement_unit_id', nullable: true })
    measurementUnitId: number;

    @ManyToOne(() => MeasurementUnit)
    @JoinColumn({ name: 'measurement_unit_id' })
    measurementUnit: MeasurementUnit;

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'sale_price' })
    salePrice: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'average_cost', default: 0 })
    averageCost: number;

    @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
    stock: number;

    @Column({ type: 'decimal', precision: 10, scale: 3, name: 'minimum_stock', nullable: true })
    minimumStock: number;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.ACTIVE })
    status: ProductStatus;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
