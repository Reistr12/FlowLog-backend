import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TaskController } from "./task.controller";
import { CreateTaskUseCase } from "src/application/use-cases/tasks/create-task.usecase";
import { UpdateTaskUseCase } from "src/application/use-cases/tasks/update-task.usecase";
import { UpdateDailyTasksUseCase } from "src/application/use-cases/tasks/update-daily-tasks.usecase";
import { TaskEntity } from "src/domain/entities/task.entity";
import { TaskEventEntity } from "src/domain/entities/task-event.entity";
import { TaskRepository } from "src/infra/repositories/task.repository";
import { TaskSchedulerService } from "src/application/use-cases/tasks/task-scheduler.usecase";

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity, TaskEventEntity])],
  controllers: [TaskController],
  providers: [
    CreateTaskUseCase,
    UpdateTaskUseCase,
    UpdateDailyTasksUseCase,
    TaskRepository,
    TaskSchedulerService,
  ],
  exports: [],
})
export class TaskModule {}
