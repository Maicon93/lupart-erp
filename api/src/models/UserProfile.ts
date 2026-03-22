import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('user_profiles')
export class UserProfile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer', name: 'user_id', unique: true })
    userId: number;

    @OneToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'varchar' })
    phone: string;

    @Column({ type: 'varchar' })
    country: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
