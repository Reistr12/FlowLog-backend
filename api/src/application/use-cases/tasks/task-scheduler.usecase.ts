import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UpdateDailyTasksUseCase } from 'src/application/use-cases/tasks/update-daily-tasks.usecase';

@Injectable()
export class TaskSchedulerService {
    private readonly logger = new Logger(TaskSchedulerService.name);

    constructor(
        private readonly updateDailyTasksUseCase: UpdateDailyTasksUseCase
    ) {}

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleDailyTasksReset() {
        this.logger.log('Iniciando reset de tarefas diárias...');
        try {
            const result = await this.updateDailyTasksUseCase.execute();
            this.logger.log(`Reset de tarefas diárias concluído: ${result?.updated || 0} tarefas atualizadas`);
        } catch (error) {
            this.logger.error(`Erro ao resetar tarefas diárias: ${(error as Error).message}`);
        }
    }
}

