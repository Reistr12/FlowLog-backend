import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { TaskEntity } from "./task.entity";
import { UserEntity } from "./user.entity";

@Entity('notifications')
export class NotificationEntity {
    @PrimaryColumn({
        type: 'uuid',
        generated: 'uuid'
    })
    id: string;

    @ManyToOne(() => TaskEntity, task => task.notifications)
    @JoinColumn({ name: 'taskId' })
    task: TaskEntity;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    @Column()
    type: 'reminder' | 'streak' | 'achievement';

    @Column()
    message: string;

    // Data e hora em que a notificação deve ser enviada (agendamento)
    @Column()
    scheduledAt: Date;

    // Data e hora em que a notificação foi realmente enviada (preenchido após o envio)
    @Column({ nullable: true })
    sentAt?: Date;

    @Column()
    status: 'pending' | 'sent' | 'failed';

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

