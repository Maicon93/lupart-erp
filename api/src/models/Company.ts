import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AccessPlan } from './AccessPlan';
import { User } from './User';

export enum CompanyStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

@Entity('companies')
export class Company {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'varchar', unique: true })
    cnpj: string;

    @Column({ type: 'integer', name: 'access_plan_id' })
    accessPlanId: number;

    @ManyToOne(() => AccessPlan)
    @JoinColumn({ name: 'access_plan_id' })
    accessPlan: AccessPlan;

    @Column({ type: 'integer', name: 'responsible_id' })
    responsibleId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'responsible_id' })
    responsible: User;

    @Column({ type: 'integer', nullable: true })
    matriz: number;

    @ManyToOne(() => Company)
    @JoinColumn({ name: 'matriz' })
    matrizCompany: Company;

    @Column({ type: 'date', name: 'plan_expires_at', nullable: true })
    planExpiresAt: Date;

    @Column({ type: 'varchar', name: 'logo_url', nullable: true })
    logoUrl: string;

    @Column({ type: 'enum', enum: CompanyStatus, default: CompanyStatus.ACTIVE })
    status: CompanyStatus;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
