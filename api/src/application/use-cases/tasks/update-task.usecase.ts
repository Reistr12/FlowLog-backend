import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UpdateTaskDto } from "src/application/DTOs/tasks/update-task.dto";
import { TaskEventEntity } from "src/domain/entities/task-event.entity";
import { TaskEntity } from "src/domain/entities/task.entity";
import { UserEntity } from "src/domain/entities/user.entity";
import { TaskRepository } from "src/infra/repositories/task.repository";

@Injectable()
export class UpdateTaskUseCase {
    constructor(
        private readonly taskRepository: TaskRepository,
        @InjectRepository(TaskEventEntity)
        private readonly taskEventRepository: Repository<TaskEventEntity>
    ) {}
    async execute(taskId: string, updateTaskDto: UpdateTaskDto, userInfo: UserEntity): Promise<TaskEntity> {
        const task = await this.taskRepository.findById(taskId);
        if (!task.task) {
            throw new NotFoundException('Tarefa não encontrada');
        }

        if (task.task?.user?.id !== userInfo.id) {
            throw new BadRequestException('Seu usuário não tem permissão para atualizar esta tarefa');
        }

        if (task.task?.frequency === 'daily' && updateTaskDto.status === 'completed' && task.task?.status === 'completed') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const lastUpdated = task.task?.updatedAt ? new Date(task.task.updatedAt) : null;
            if (lastUpdated) {
                lastUpdated.setHours(0, 0, 0, 0);
                
                if (lastUpdated.getTime() === today.getTime()) {
                    throw new BadRequestException('Você já finalizou a tarefa hoje, volte amanhã para continuar');
                }
            }
        }

        if (updateTaskDto.type === 'recorrente' && !updateTaskDto.frequency) {
            if (!task.task?.frequency) {
                throw new BadRequestException('Tarefas de tipo recorrente devem ter uma frequência definida');
            }
        }
        
        if (updateTaskDto.type === 'recorrente' && updateTaskDto.frequency && updateTaskDto.frequency !== 'daily') {
            throw new BadRequestException('Tarefas de tipo recorrente devem ser de frequência diária');
        }
        
        if (updateTaskDto.status === 'completed') {
            updateTaskDto = {
                ...updateTaskDto,
                streak: task.task?.streak + 1
            }
        }
        
        const response = await this.taskRepository.update(taskId, updateTaskDto);

        if (!response.task) {
            throw new NotFoundException(response.error || 'Erro ao atualizar a tarefa');
        }
        
        const taskEvent = new TaskEventEntity();
        taskEvent.task = response.task;
        taskEvent.eventType = 'updated';
        taskEvent.user = userInfo;
        taskEvent.createdAt = new Date();
        taskEvent.updatedAt = new Date();

        try {
            await this.taskEventRepository.save(taskEvent);
        } catch (error) {
            console.error(`Erro ao salvar evento de atualização da tarefa: ${(error as Error).message}`);
            // Não lançamos exceção aqui para não falhar a atualização da task se o evento falhar
        }

        return response.task as TaskEntity;
    }
}