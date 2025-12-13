import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { TaskEntity } from "./task.entity";
import { UserEntity } from "./user.entity";

@Entity('task_events')
export class TaskEventEntity {
    @PrimaryColumn({
        type: 'uuid',
        generated: 'uuid'
    })
    id: string;

    @ManyToOne(() => TaskEntity)
    @JoinColumn({ name: 'taskId' })
    task: TaskEntity;

    @Column()
    eventType: 'created' | 'updated' | 'deleted';

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

