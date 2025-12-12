import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateTaskDto } from "src/application/DTOs/tasks/createTask.dto";
import { TaskEntity } from "src/domain/entities/task.entity";
import { TaskRepository } from "src/infra/repositories/task.repository";

@Injectable()
export class CreateTaskUseCase {
   constructor(private readonly taskRepository: TaskRepository) {}

  async execute(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    if (createTaskDto.startDate < new Date()) {
        throw new BadRequestException('A data de início da tarefa não pode ser anterior à data atual');
    }

    if (createTaskDto.type === 'recorrente' && createTaskDto.frequency !== 'daily') {

    }
    const task = await this.taskRepository.create(createTaskDto);

    return task;
  }
}