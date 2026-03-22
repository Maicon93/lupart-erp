import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Role } from './Role';

@Entity('user_roles')
export class UserRole {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer', name: 'user_id' })
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'integer', name: 'role_id' })
    roleId: number;

    @ManyToOne(() => Role)
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column({ type: 'integer', name: 'created_by' })
    createdBy: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'created_by' })
    creator: User;
}
