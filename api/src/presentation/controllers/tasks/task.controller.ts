import { Body, Controller, Param, Patch, Post } from "@nestjs/common";
import { CreateTaskDto } from "src/application/DTOs/tasks/createTask.dto";
import { UpdateTaskDto } from "src/application/DTOs/tasks/update-task.dto";
import { CreateTaskUseCase } from "src/application/use-cases/tasks/create-task.usecase";
import { UpdateTaskUseCase } from "src/application/use-cases/tasks/update-task.usecase";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { UserEntity } from "src/domain/entities/user.entity";

@Controller('tasks')
export class TaskController {
    constructor(
        private readonly createTaskUseCase: CreateTaskUseCase,
        private readonly updateTaskUseCase: UpdateTaskUseCase
    ) {}

    @Post()
    async createTask(@Body() createTaskDto: CreateTaskDto, @CurrentUser() userInfo: UserEntity) {
        return await this.createTaskUseCase.execute(createTaskDto, userInfo);
    }

    @Patch(':id')
    async updateTask(
        @Param('id') taskId: string,
        @Body() updateTaskDto: UpdateTaskDto,
        @CurrentUser() userInfo: UserEntity
    ) {
        return await this.updateTaskUseCase.execute(taskId, updateTaskDto, userInfo);
    }
}
