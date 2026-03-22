import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from './Company';

@Entity('suppliers')
export class Supplier {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer', name: 'company_id' })
    companyId: number;

    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'varchar', name: 'cpf_cnpj' })
    cpfCnpj: string;

    @Column({ type: 'varchar' })
    phone: string;

    @Column({ type: 'varchar', nullable: true })
    email: string;

    @Column({ type: 'varchar', name: 'zip_code', nullable: true })
    zipCode: string;

    @Column({ type: 'varchar', nullable: true })
    street: string;

    @Column({ type: 'varchar', nullable: true })
    number: string;

    @Column({ type: 'varchar', nullable: true })
    complement: string;

    @Column({ type: 'varchar', nullable: true })
    neighborhood: string;

    @Column({ type: 'varchar', nullable: true })
    city: string;

    @Column({ type: 'varchar', nullable: true })
    state: string;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;
}
