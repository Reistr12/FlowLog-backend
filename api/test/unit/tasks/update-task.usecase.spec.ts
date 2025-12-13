import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateTaskUseCase } from '../../../src/application/use-cases/tasks/update-task.usecase';
import { TaskRepository } from '../../../src/infra/repositories/task.repository';
import { UpdateTaskDto } from '../../../src/application/DTOs/tasks/update-task.dto';
import { TaskEntity } from '../../../src/domain/entities/task.entity';
import { UserEntity } from '../../../src/domain/entities/user.entity';

describe('UpdateTaskUseCase', () => {
  let useCase: UpdateTaskUseCase;
  let taskRepository: jest.Mocked<TaskRepository>;

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
      providers: [
        UpdateTaskUseCase,
        {
          provide: TaskRepository,
          useValue: {
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<UpdateTaskUseCase>(UpdateTaskUseCase);
    taskRepository = module.get(TaskRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const updateTaskDto: UpdateTaskDto = {
      title: 'Estudar TypeScript Avançado',
    };

    it('deve atualizar tarefa com sucesso', async () => {
      taskRepository.findById.mockResolvedValue({ task: mockTask });
      taskRepository.update.mockResolvedValue({ success: true });

      const result = await useCase.execute('task-123', updateTaskDto, mockUser);

      expect(taskRepository.findById).toHaveBeenCalledWith('task-123');
      expect(taskRepository.update).toHaveBeenCalledWith('task-123', updateTaskDto);
      expect(result).toEqual({ success: true, message: 'Tarefa atualizada com sucesso' });
    });

    it('deve lançar NotFoundException quando tarefa não existe', async () => {
      taskRepository.findById.mockResolvedValue({ task: null });

      await expect(useCase.execute('task-123', updateTaskDto, mockUser)).rejects.toThrow(
        NotFoundException
      );
      expect(taskRepository.update).not.toHaveBeenCalled();
    });

    it('deve lançar BadRequestException quando usuário não tem permissão', async () => {
      const otherUser: UserEntity = {
        ...mockUser,
        id: 'other-user-123',
      };

      taskRepository.findById.mockResolvedValue({ task: mockTask });

      await expect(useCase.execute('task-123', updateTaskDto, otherUser)).rejects.toThrow(
        BadRequestException
      );
      expect(taskRepository.update).not.toHaveBeenCalled();
    });

    it('deve lançar BadRequestException quando tipo recorrente sem frequência e tarefa não tem frequência', async () => {
      const updateDto: UpdateTaskDto = {
        type: 'recorrente',
      };

      const taskWithoutFrequency: TaskEntity = {
        ...mockTask,
        frequency: undefined,
      };

      taskRepository.findById.mockResolvedValue({ task: taskWithoutFrequency });

      await expect(useCase.execute('task-123', updateDto, mockUser)).rejects.toThrow(
        BadRequestException
      );
    });

    it('deve permitir atualizar para recorrente sem frequência se tarefa já tem frequência', async () => {
      const updateDto: UpdateTaskDto = {
        type: 'recorrente',
      };

      taskRepository.findById.mockResolvedValue({ task: mockTask });
      taskRepository.update.mockResolvedValue({ success: true });

      const result = await useCase.execute('task-123', updateDto, mockUser);

      expect(result.success).toBe(true);
      expect(taskRepository.update).toHaveBeenCalled();
    });

    it('deve lançar BadRequestException quando tipo recorrente com frequência diferente de daily', async () => {
      const updateDto: UpdateTaskDto = {
        type: 'recorrente',
        frequency: 'weekly',
      };

      taskRepository.findById.mockResolvedValue({ task: mockTask });

      await expect(useCase.execute('task-123', updateDto, mockUser)).rejects.toThrow(
        BadRequestException
      );
      expect(taskRepository.update).not.toHaveBeenCalled();
    });

    it('deve permitir atualizar para recorrente com frequência daily', async () => {
      const updateDto: UpdateTaskDto = {
        type: 'recorrente',
        frequency: 'daily',
      };

      taskRepository.findById.mockResolvedValue({ task: mockTask });
      taskRepository.update.mockResolvedValue({ success: true });

      const result = await useCase.execute('task-123', updateDto, mockUser);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Tarefa atualizada com sucesso');
    });

    it('deve retornar erro quando update falha', async () => {
      taskRepository.findById.mockResolvedValue({ task: mockTask });
      taskRepository.update.mockResolvedValue({
        success: false,
        error: 'Erro ao atualizar',
      });

      await expect(useCase.execute('task-123', updateTaskDto, mockUser)).rejects.toThrow(
        NotFoundException
      );
    });
  });
});

