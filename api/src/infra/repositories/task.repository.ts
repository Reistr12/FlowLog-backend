import { InjectRepository } from "@nestjs/typeorm";
import { CreateTaskDto } from "src/application/DTOs/tasks/createTask.dto";
import { TaskEntity } from "src/domain/entities/task.entity";
import { ITaskRepository } from "src/domain/interfaces/task.interface";
import { Repository } from "typeorm";
export class TaskRepository implements ITaskRepository {
    constructor(
        @InjectRepository(TaskEntity)
        private readonly repository: Repository<TaskEntity>
    ) {}

    async create(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
        const task = this.repository.create(createTaskDto);
        return await this.repository.save(task);
    }

    async findAll(): Promise<TaskEntity[]> {
        return []
    }

    async find(id: string, filters?: string[]): Promise<TaskEntity | null> {
        return null
    }
}