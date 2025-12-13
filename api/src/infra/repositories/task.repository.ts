import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateTaskDto } from "src/application/DTOs/tasks/createTask.dto";
import { UpdateTaskDto } from "src/application/DTOs/tasks/update-task.dto";
import { TaskFilter } from "src/application/Enums/task-filters.enum";
import { TaskEntity } from "src/domain/entities/task.entity";
import { ITaskRepository } from "src/domain/interfaces/task.interface";
import { Repository } from "typeorm";

@Injectable()
export class TaskRepository implements ITaskRepository {
    constructor(
        @InjectRepository(TaskEntity)
        private readonly repository: Repository<TaskEntity>
    ) {}
    
    async create(createTaskDto: CreateTaskDto, userInfo: string): Promise<{ task: TaskEntity | null; error?: string }> {
        const data = {...createTaskDto, user: { id: userInfo } };
        try {
            const task = this.repository.create(data);
            const savedTask = await this.repository.save(task);
            return { task: savedTask };
        } catch (error) {
            return { task: null, error: (error as Error).message };
        }
    }

    async findById(id: string): Promise<{ task: TaskEntity | null; error?: string }> {
        try {
            const task = await this.repository.findOne({
                where: { id },
                relations: ['user'],
            });
            return { task };
        } catch (error) {
            return { task: null, error: (error as Error).message };
        }
    }

    async findAll(filters?: TaskFilter, userId?: string): Promise<{ tasks: TaskEntity[]; error?: string }> {
        try {
            const qb = this.repository.createQueryBuilder('task');
            qb.leftJoinAndSelect('task.user', 'user');

            if (userId) {
                qb.where('task.user.id = :userId', { userId });
            }
        
            if (filters?.END_DATE) {
                const endDate = filters.END_DATE instanceof Date 
                    ? filters.END_DATE 
                    : new Date(filters.END_DATE);
                qb.andWhere('task.endDate <= :endDate', { endDate });
            }

            if (filters?.TYPE) {
                qb.andWhere('task.type = :type', { type: filters.TYPE });
            }

            if (filters?.FREQUENCY) {
                qb.andWhere('task.frequency = :frequency', { frequency: filters.FREQUENCY });
            }
            
            if (filters?.DESCRIPTION) {
                qb.andWhere('task.description LIKE :description', { 
                    description: `%${filters.DESCRIPTION}%` 
                });
            }

            if (filters?.TITLE) {
                qb.andWhere('task.title LIKE :title', { 
                    title: `%${filters.TITLE}%` 
                });
            }

            if (filters?.START_DATE) {
                const startDate = filters.START_DATE instanceof Date 
                    ? filters.START_DATE 
                    : new Date(filters.START_DATE);
                qb.andWhere('task.startDate >= :startDate', { startDate });
            }

            if (filters?.STREAK !== undefined) {
                qb.andWhere('task.streak = :streak', { streak: filters.STREAK });
            }

            const tasks = await qb.getMany();
            return { tasks };
        } catch (error) {
            return { tasks: [], error: (error as Error).message };
        }
    }

    async update(id: string, updateTaskDto: UpdateTaskDto): Promise<{ task: TaskEntity | null; error?: string }> {
        try {
            await this.repository.update(id, updateTaskDto);
            const updatedTask = await this.repository.findOne({
                where: { id },
                relations: ['user'],
            });
            return { task: updatedTask };
        } catch (error) {
            return { task: null, error: (error as Error).message };
        }
    }
}