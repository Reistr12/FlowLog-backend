import { CreateTaskDto } from "src/application/DTOs/tasks/createTask.dto";
import { TaskEntity } from "../entities/task.entity";
import { TaskFilter } from "src/application/Enums/task-filters.enum";
import { UpdateTaskDto } from "src/application/DTOs/tasks/update-task.dto";

export interface ITaskRepository {
    create(createTaskDto: CreateTaskDto, userInfo: string): Promise<{ task: TaskEntity | null; error?: string }>;

    findById(id: string): Promise<{ task: TaskEntity | null; error?: string }>;

    findAll(filters?: TaskFilter, userId?: string): Promise<{ tasks: TaskEntity[]; error?: string }>;
    
    update(id: string, updateTaskDto: UpdateTaskDto): Promise<{ success: boolean; error?: string }>
}