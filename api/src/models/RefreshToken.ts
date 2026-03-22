import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('refresh_tokens')
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer', name: 'user_id' })
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'varchar', unique: true })
    token: string;

    @Column({ type: 'timestamp', name: 'expires_at' })
    expiresAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
