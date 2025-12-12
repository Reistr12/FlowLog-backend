import { CreateTaskDto } from "src/application/DTOs/tasks/createTask.dto";
import { TaskEntity } from "../entities/task.entity";

export interface ITaskRepository {
    create(createTaskDto: CreateTaskDto): Promise<TaskEntity>;

    findAll(): Promise<TaskEntity[]>;

    find(id: string, filters?: string[]): Promise<TaskEntity | null>;
 
}