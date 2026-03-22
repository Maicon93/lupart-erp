import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from './Company';
import { User } from './User';

@Entity('activity_logs')
export class ActivityLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer', name: 'company_id', nullable: true })
    companyId: number;

    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @Column({ type: 'varchar', name: 'entity_type' })
    entityType: string;

    @Column({ type: 'integer', name: 'entity_id' })
    entityId: number;

    @Column({ type: 'varchar' })
    action: string;

    @Column({ type: 'jsonb', nullable: true })
    data: Record<string, unknown>;

    @Column({ type: 'integer', name: 'created_by' })
    createdBy: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'created_by' })
    creator: User;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
