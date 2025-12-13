import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateTaskDto } from "src/application/DTOs/tasks/createTask.dto";
import { TaskEventEntity } from "src/domain/entities/task-event.entity";
import { TaskEntity } from "src/domain/entities/task.entity";
import { UserEntity } from "src/domain/entities/user.entity";
import { TaskRepository } from "src/infra/repositories/task.repository";

@Injectable()
export class CreateTaskUseCase {
   constructor(
      private readonly taskRepository: TaskRepository,
      @InjectRepository(TaskEventEntity)
      private readonly taskEventRepository: Repository<TaskEventEntity>
   ) {}

  async execute(createTaskDto: CreateTaskDto, userInfo: UserEntity): Promise<TaskEntity> {
    if (createTaskDto.startDate < new Date()) {
        throw new BadRequestException('A data de início da tarefa não pode ser anterior à data atual');
    }

    if (createTaskDto.type === 'recorrente' && !createTaskDto.frequency) {
        throw new BadRequestException('Tarefas de tipo recorrente devem ter uma frequência definida');
    }

    const response = await this.taskRepository.create(createTaskDto, userInfo.id);

    if (response.task === null) {
        console.error(`Erro ao criar a tarefa: ${response.error}`);
        throw new BadRequestException('Erro ao criar a tarefa');
    }

    const taskEvent = new TaskEventEntity();
    taskEvent.task = response.task;
    taskEvent.eventType = 'created';
    taskEvent.user = userInfo;
    taskEvent.createdAt = new Date();
    taskEvent.updatedAt = new Date();

    try {
      await this.taskEventRepository.save(taskEvent);
    } catch (error) {
      console.error(`Erro ao salvar evento de criação da tarefa: ${(error as Error).message}`);
      // Não lançamos exceção aqui para não falhar a criação da task se o evento falhar
    }

    return response.task as TaskEntity;
  }
}