import { Injectable, Logger } from "@nestjs/common";
import { TaskRepository } from "src/infra/repositories/task.repository";

@Injectable()
export class UpdateDailyTasksUseCase {
    private readonly logger = new Logger(UpdateDailyTasksUseCase.name);

    constructor(
        private readonly taskRepository: TaskRepository
    ) {}

    async execute() {
        try {
            const response = await this.taskRepository.findAll({
                FREQUENCY: 'daily'
            });

            if (response.error) {
                this.logger.error(`Erro ao buscar tarefas: ${response.error}`);
                return { updated: 0, total: 0 };
            }

            const dailyRecurringTasks = response.tasks.filter(
                task => task.type === 'recorrente' && task.frequency === 'daily'
            );

            const updatePromises = dailyRecurringTasks.map(async (task) => {
                try {
                    const updateResponse = await this.taskRepository.update(task.id, {
                        status: 'pending'
                    });
                    return updateResponse.task;
                } catch (error) {
                    this.logger.error(`Erro ao atualizar tarefa ${task.id}: ${(error as Error).message}`);
                    return null;
                }
            });

            const updatedTasks = await Promise.all(updatePromises);
            const successCount = updatedTasks.filter(t => t !== null).length;
            
            this.logger.log(`Tarefas diárias atualizadas: ${successCount} de ${dailyRecurringTasks.length}`);
            return { updated: successCount, total: dailyRecurringTasks.length };
        } catch (error) {
            this.logger.error(`Erro ao executar atualização de tarefas diárias: ${(error as Error).message}`);
            throw error;
        }
    }
}
