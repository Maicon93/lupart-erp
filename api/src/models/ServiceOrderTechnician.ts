import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ServiceOrder } from './ServiceOrder';
import { User } from './User';

@Entity('service_order_technicians')
export class ServiceOrderTechnician {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer', name: 'service_order_id' })
    serviceOrderId: number;

    @ManyToOne(() => ServiceOrder)
    @JoinColumn({ name: 'service_order_id' })
    serviceOrder: ServiceOrder;

    @Column({ type: 'integer', name: 'user_id' })
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column({ type: 'integer', name: 'created_by' })
    createdBy: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'created_by' })
    creator: User;
}
