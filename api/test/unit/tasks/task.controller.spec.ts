import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { TaskController } from '../../../src/presentation/controllers/tasks/task.controller';
import { CreateTaskUseCase } from '../../../src/application/use-cases/tasks/create-task.usecase';
import { UpdateTaskUseCase } from '../../../src/application/use-cases/tasks/update-task.usecase';
import { CreateTaskDto } from '../../../src/application/DTOs/tasks/createTask.dto';
import { UpdateTaskDto } from '../../../src/application/DTOs/tasks/update-task.dto';
import { TaskEntity } from '../../../src/domain/entities/task.entity';
import { UserEntity } from '../../../src/domain/entities/user.entity';

describe('TaskController', () => {
  let controller: TaskController;
  let createTaskUseCase: jest.Mocked<CreateTaskUseCase>;
  let updateTaskUseCase: jest.Mocked<UpdateTaskUseCase>;

  const mockUser: UserEntity = {
    id: 'user-123',
    name: 'João Silva',
    email: 'joao@example.com',
    password: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTask: TaskEntity = {
    id: 'task-123',
    title: 'Estudar TypeScript',
    description: 'Estudar decorators',
    type: 'recorrente',
    frequency: 'daily',
    startDate: new Date('2025-12-13'),
    endDate: null,
    streak: 0,
    user: mockUser,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: CreateTaskUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: UpdateTaskUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    createTaskUseCase = module.get(CreateTaskUseCase);
    updateTaskUseCase = module.get(UpdateTaskUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    const createTaskDto: CreateTaskDto = {
      title: 'Estudar TypeScript',
      description: 'Estudar decorators',
      type: 'recorrente',
      frequency: 'daily',
      startDate: new Date('2025-12-13'),
    };

    it('deve criar uma tarefa com sucesso', async () => {
      createTaskUseCase.execute.mockResolvedValue(mockTask);

      const result = await controller.createTask(createTaskDto, mockUser);

      expect(createTaskUseCase.execute).toHaveBeenCalledWith(createTaskDto, mockUser);
      expect(result).toEqual(mockTask);
      expect(result.title).toBe(createTaskDto.title);
    });

    it('deve lançar BadRequestException quando validação falha', async () => {
      createTaskUseCase.execute.mockRejectedValue(
        new BadRequestException('Data inválida')
      );

      await expect(controller.createTask(createTaskDto, mockUser)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('updateTask', () => {
    const updateTaskDto: UpdateTaskDto = {
      title: 'Estudar TypeScript Avançado',
    };

    it('deve atualizar tarefa com sucesso', async () => {
      updateTaskUseCase.execute.mockResolvedValue({
        success: true,
        message: 'Tarefa atualizada com sucesso',
      });

      const result = await controller.updateTask('task-123', updateTaskDto, mockUser);

      expect(updateTaskUseCase.execute).toHaveBeenCalledWith(
        'task-123',
        updateTaskDto,
        mockUser
      );
      expect(result.success).toBe(true);
      expect(result.message).toBe('Tarefa atualizada com sucesso');
    });

    it('deve lançar BadRequestException quando validação falha', async () => {
      updateTaskUseCase.execute.mockRejectedValue(
        new BadRequestException('Sem permissão')
      );

      await expect(
        controller.updateTask('task-123', updateTaskDto, mockUser)
      ).rejects.toThrow(BadRequestException);
    });
  });
});

