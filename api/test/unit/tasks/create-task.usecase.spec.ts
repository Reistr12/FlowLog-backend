import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CreateTaskUseCase } from '../../../src/application/use-cases/tasks/create-task.usecase';
import { TaskRepository } from '../../../src/infra/repositories/task.repository';
import { CreateTaskDto } from '../../../src/application/DTOs/tasks/createTask.dto';
import { TaskEntity } from '../../../src/domain/entities/task.entity';
import { UserEntity } from '../../../src/domain/entities/user.entity';

describe('CreateTaskUseCase', () => {
  let useCase: CreateTaskUseCase;
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
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-12-12'));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTaskUseCase,
        {
          provide: TaskRepository,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateTaskUseCase>(CreateTaskUseCase);
    taskRepository = module.get(TaskRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe('execute', () => {
    const createTaskDto: CreateTaskDto = {
      title: 'Estudar TypeScript',
      description: 'Estudar decorators',
      type: 'recorrente',
      frequency: 'daily',
      startDate: new Date('2025-12-13'),
    };

    it('deve criar uma tarefa com sucesso', async () => {
      taskRepository.create.mockResolvedValue({ task: mockTask });

      const result = await useCase.execute(createTaskDto, mockUser);

      expect(taskRepository.create).toHaveBeenCalledWith(createTaskDto, mockUser.id);
      expect(result).toEqual(mockTask);
      expect(result.title).toBe(createTaskDto.title);
    });

    it('deve lançar BadRequestException quando startDate é anterior à data atual', async () => {
      const invalidDto: CreateTaskDto = {
        ...createTaskDto,
        startDate: new Date('2025-12-11'), // Data passada
      };

      await expect(useCase.execute(invalidDto, mockUser)).rejects.toThrow(
        BadRequestException
      );
      expect(taskRepository.create).not.toHaveBeenCalled();
    });

    it('deve lançar BadRequestException quando tipo é recorrente sem frequência', async () => {
      const invalidDto: CreateTaskDto = {
        ...createTaskDto,
        frequency: undefined,
      };

      await expect(useCase.execute(invalidDto, mockUser)).rejects.toThrow(
        BadRequestException
      );
      expect(taskRepository.create).not.toHaveBeenCalled();
    });

    it('deve criar tarefa pontual sem frequência', async () => {
      const pontualDto: CreateTaskDto = {
        ...createTaskDto,
        type: 'pontual',
        frequency: undefined,
      };

      taskRepository.create.mockResolvedValue({
        task: { ...mockTask, type: 'pontual', frequency: undefined },
      });

      const result = await useCase.execute(pontualDto, mockUser);

      expect(result.type).toBe('pontual');
      expect(taskRepository.create).toHaveBeenCalled();
    });

    it('deve lançar BadRequestException quando há erro ao criar tarefa', async () => {
      taskRepository.create.mockResolvedValue({
        task: null,
        error: 'Erro no banco de dados',
      });

      await expect(useCase.execute(createTaskDto, mockUser)).rejects.toThrow(
        BadRequestException
      );
    });
  });
});

