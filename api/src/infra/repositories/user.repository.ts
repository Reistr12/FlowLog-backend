import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/interfaces/user.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async create(user: Partial<UserEntity>): Promise<UserEntity> {
    const newUser = this.repository.create(user);
    return await this.repository.save(newUser);
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.repository.find({
      select: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
    });
  }

  async findById(id: string): Promise<UserEntity | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.repository.findOne({ where: { email } });
  }

  async update(id: string, user: Partial<UserEntity>): Promise<UserEntity> {
    const existingUser = await this.findById(id);
    
    if (!existingUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    await this.repository.update(id, user);
    return await this.findById(id) as UserEntity;
  }

  async delete(id: string): Promise<void> {
    const user = await this.findById(id);
    
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    await this.repository.delete(id);
  }

  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    const user = await this.findById(id);
    
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    await this.repository.update(id, { password: hashedPassword });
  }

  async exists(email: string): Promise<boolean> {
    const count = await this.repository.count({ where: { email } });
    return count > 0;
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }
}

