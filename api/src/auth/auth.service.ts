import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../infra/repositories/user.repository';
import { RegisterDto } from './DTOs/register.dto';
import { LoginDto } from './DTOs/login.dto';
import { UserEntity } from '../domain/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<Omit<UserEntity, 'password'>> {
    const existingUser = await this.userRepository.findByEmail(registerDto.email);
    
    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    const user = await this.userRepository.create({
      id: uuidv4(),
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
    });

    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  async login(loginDto: LoginDto): Promise<{ user: Omit<UserEntity, 'password'>; accessToken: string }> {
    const user = await this.userRepository.findByEmail(loginDto.email);
    
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const { password, ...userWithoutPassword } = user;
    const accessToken = this.generateToken(user);

    return {
      user: userWithoutPassword,
      accessToken,
    };
  }

  async validateUser(userId: string): Promise<UserEntity | null> {
    return await this.userRepository.findById(userId);
  }

  private generateToken(user: UserEntity): string {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }
}

