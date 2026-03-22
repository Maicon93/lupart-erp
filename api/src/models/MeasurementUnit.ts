import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from './Company';

export enum MeasurementUnitStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

@Entity('measurement_units')
export class MeasurementUnit {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer', name: 'company_id' })
    companyId: number;

    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @Column({ type: 'varchar', length: 10 })
    abbreviation: string;

    @Column({ type: 'varchar' })
    description: string;

    @Column({ type: 'enum', enum: MeasurementUnitStatus, default: MeasurementUnitStatus.ACTIVE })
    status: MeasurementUnitStatus;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
