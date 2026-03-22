import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from './Role';
import { Permission } from './Permission';
import { User } from './User';

@Entity('role_permissions')
export class RolePermission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer', name: 'role_id' })
    roleId: number;

    @ManyToOne(() => Role)
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @Column({ type: 'integer', name: 'permission_id' })
    permissionId: number;

    @ManyToOne(() => Permission)
    @JoinColumn({ name: 'permission_id' })
    permission: Permission;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column({ type: 'integer', name: 'created_by' })
    createdBy: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'created_by' })
    creator: User;
}
