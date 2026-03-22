import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum AccessPlanStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

@Entity('access_plans')
export class AccessPlan {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    title: string;

    @Column({ type: 'integer', name: 'user_limit' })
    userLimit: number;

    @Column({ type: 'integer', name: 'duration_days' })
    durationDays: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'enum', enum: AccessPlanStatus, default: AccessPlanStatus.ACTIVE })
    status: AccessPlanStatus;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
