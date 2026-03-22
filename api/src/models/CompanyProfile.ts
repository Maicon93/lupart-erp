import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Company } from './Company';

@Entity('company_profiles')
export class CompanyProfile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer', name: 'company_id', unique: true })
    companyId: number;

    @OneToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @Column({ type: 'varchar', nullable: true })
    phone: string;

    @Column({ type: 'varchar', nullable: true })
    email: string;

    @Column({ type: 'varchar', name: 'zip_code', nullable: true })
    zipCode: string;

    @Column({ type: 'varchar' })
    street: string;

    @Column({ type: 'varchar' })
    number: string;

    @Column({ type: 'varchar' })
    complement: string;

    @Column({ type: 'varchar' })
    neighborhood: string;

    @Column({ type: 'varchar', nullable: true })
    city: string;

    @Column({ type: 'varchar', nullable: true })
    state: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
