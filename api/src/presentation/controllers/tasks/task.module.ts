import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TaskController } from "./task.controller";
import { CreateTaskUseCase } from "src/application/use-cases/tasks/create-task.usecase";
import { UpdateTaskUseCase } from "src/application/use-cases/tasks/update-task.usecase";
import { TaskEntity } from "src/domain/entities/task.entity";
import { TaskRepository } from "src/infra/repositories/task.repository";

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity])],
  controllers: [TaskController],
  providers: [
    CreateTaskUseCase,
    UpdateTaskUseCase,
    TaskRepository, 
  ],
  exports: [],
})
export class TaskModule {}
