import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { NotificationEntity } from "./notification.entity";

@Entity('tasks')
export class TaskEntity {
    @PrimaryColumn({
        type: 'uuid',
        generated: 'uuid'
    })
    id: string;

    @Column()
    title: string;

    @Column({ nullable: true })
    description?: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    @Column()
    type: 'recorrente' | 'pontual';

    @Column({ nullable: true })
    frequency?: 'daily' | 'weekly' | 'monthly';

    @Column()
    startDate: Date;

    @Column({ nullable: true })
    endDate?: Date;

    @Column({ default: 0 })
    streak: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
