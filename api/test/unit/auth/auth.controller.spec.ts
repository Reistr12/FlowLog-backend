import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthController } from '../../../src/auth/auth.controller';
import { AuthService } from '../../../src/auth/auth.service';
import { RegisterDto } from '../../../src/auth/DTOs/register.dto';
import { LoginDto } from '../../../src/auth/DTOs/login.dto';
import { UserEntity } from '../../../src/domain/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockUserWithoutPassword: Omit<UserEntity, 'password'> = {
    id: 'user-123',
    name: 'João Silva',
    email: 'joao@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      name: 'João Silva',
      email: 'joao@example.com',
      password: 'senha123',
      confirmPassword: 'senha123',
    };

    it('deve registrar um novo usuário com sucesso', async () => {
      authService.register.mockResolvedValue(mockUserWithoutPassword);

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(mockUserWithoutPassword);
      expect(result).not.toHaveProperty('password');
    });

    it('deve lançar ConflictException quando email já existe', async () => {
      authService.register.mockRejectedValue(new ConflictException('Email já está em uso'));

      await expect(controller.register(registerDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'joao@example.com',
      password: 'senha123',
    };

    it('deve fazer login com sucesso e retornar token', async () => {
      const mockResponse = {
        user: mockUserWithoutPassword,
        accessToken: 'mock-jwt-token-123',
      };

      authService.login.mockResolvedValue(mockResponse);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('user');
      expect(result.accessToken).toBe('mock-jwt-token-123');
      expect(result.user).not.toHaveProperty('password');
    });

    it('deve lançar UnauthorizedException quando credenciais são inválidas', async () => {
      authService.login.mockRejectedValue(new UnauthorizedException('Credenciais inválidas'));

      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getProfile', () => {
    const mockUser: UserEntity = {
      ...mockUserWithoutPassword,
      password: 'hashedPassword',
    };

    it('deve retornar perfil do usuário sem senha', async () => {
      const result = await controller.getProfile(mockUser);

      expect(result).not.toHaveProperty('password');
      expect(result.id).toBe(mockUser.id);
      expect(result.email).toBe(mockUser.email);
      expect(result.name).toBe(mockUser.name);
    });
  });
});

