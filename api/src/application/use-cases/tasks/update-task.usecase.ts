import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UpdateTaskDto } from "src/application/DTOs/tasks/update-task.dto";
import { UserEntity } from "src/domain/entities/user.entity";
import { TaskRepository } from "src/infra/repositories/task.repository";

@Injectable()
export class UpdateTaskUseCase {
    constructor(private readonly taskRepository: TaskRepository) {}
    async execute(taskId: string, updateTaskDto: UpdateTaskDto, userInfo: UserEntity): Promise<{ success: boolean; message?: string }> {
        const task = await this.taskRepository.findById(taskId);
        if (!task.task) {
            throw new NotFoundException('Tarefa não encontrada');
        }

        if (task.task?.user?.id !== userInfo.id) {
            throw new BadRequestException('Seu usuário não tem permissão para atualizar esta tarefa');
        }

        if (updateTaskDto.type === 'recorrente' && !updateTaskDto.frequency) {
            if (!task.task?.frequency) {
                throw new BadRequestException('Tarefas de tipo recorrente devem ter uma frequência definida');
            }
        }

        if (updateTaskDto.type === 'recorrente' && updateTaskDto.frequency && updateTaskDto.frequency !== 'daily') {
            throw new BadRequestException('Tarefas de tipo recorrente devem ser de frequência diária');
        }
        
        return this.taskRepository.update(taskId, updateTaskDto);
    }
}