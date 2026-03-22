import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Company } from './Company';

@Entity('user_companies')
export class UserCompany {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer', name: 'user_id' })
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'integer', name: 'company_id' })
    companyId: number;

    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column({ type: 'integer', name: 'created_by' })
    createdBy: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'created_by' })
    creator: User;
}
