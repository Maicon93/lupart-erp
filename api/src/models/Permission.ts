import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('permissions')
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', unique: true })
    name: string;

    @Column({ type: 'varchar', nullable: true })
    observation: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
