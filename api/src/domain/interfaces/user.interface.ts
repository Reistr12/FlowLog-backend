import { UserEntity } from '../entities/user.entity';

export interface IUserRepository {
  create(user: Partial<UserEntity>): Promise<UserEntity>;
  findAll(): Promise<UserEntity[]>;
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  update(id: string, user: Partial<UserEntity>): Promise<UserEntity>;
  delete(id: string): Promise<void>;
  updatePassword(id: string, hashedPassword: string): Promise<void>;
  exists(email: string): Promise<boolean>;
  count(): Promise<number>;
}

