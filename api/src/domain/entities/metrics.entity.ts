import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity('metrics')
export class MetricsEntity {
    @PrimaryColumn({
        type: 'uuid',
        generated: 'uuid'
    })
    id: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    // Data de referência da métrica (apenas data, sem hora)
    @Column({ type: 'date' })
    date: Date;

    // Taxa de conclusão diária em percentual (ex: 85.50 = 85.5% das tarefas concluídas)
    @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
    dailyCompletionRate: number;

    // Número de sequências semanais consecutivas completadas
    @Column({ default: 0 })
    weeklyStreaks: number;

    // Número total de tarefas concluídas no período (dia/semana/mês)
    @Column({ default: 0 })
    tasksCompleted: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

